import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getSessionUser } from '@/lib/userAuth';
import { refundFullPayment } from '@/lib/iyzipay';
import { titleCaseName } from '@/lib/format';
import { Resend } from 'resend';

// Kargoya verilmiş/teslim edilmiş/iptal edilmiş siparişler iptal edilemez
const NON_CANCELLABLE = ['shipped', 'delivered', 'cancelled'];

export async function POST(request: NextRequest) {
  // user_id ASLA client'tan alınmaz — doğrulanmış oturumdan gelir
  const session = getSessionUser(request);
  if (!session) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  }

  try {
    const { orderId } = await request.json();
    if (!orderId) {
      return NextResponse.json({ error: 'Sipariş ID gerekli' }, { status: 400 });
    }

    // Sipariş bu kullanıcıya mı ait? (IDOR koruması: id + user_id birlikte)
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('id, status, customer_email, customer_name, total_price, iyzico_payment_id')
      .eq('id', orderId)
      .eq('user_id', session.id)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 });
    }

    if (NON_CANCELLABLE.includes(order.status)) {
      return NextResponse.json(
        { error: 'Kargoya verilmiş sipariş iptal edilemez.' },
        { status: 400 }
      );
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '85.34.78.112';

    // Otomatik para iadesi (önce iptal, olmazsa transaction bazlı iade)
    const refund = await refundFullPayment(order.iyzico_payment_id || '', ip);

    // Siparişi her durumda iptal et (iade başarısızsa admin manuel tamamlar)
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', order.id);

    if (updateError) {
      return NextResponse.json({ error: 'Sipariş iptal edilemedi' }, { status: 500 });
    }

    // İade sonucunu kaydet — admin panelde takip için. Ayrı çağrı: refund_status
    // kolonu henüz yoksa (migration çalıştırılmadıysa) iptal akışını bozmaz.
    await supabaseAdmin
      .from('orders')
      .update({
        refund_status: refund.ok ? 'refunded' : 'failed',
        refund_error: refund.ok ? null : (refund.error || 'bilinmeyen hata'),
      })
      .eq('id', order.id)
      .then(({ error }) => {
        if (error) console.error('refund_status kaydedilemedi (migration eksik olabilir):', error.message);
      });

    // Bilgilendirme e-postaları (hata olsa da iptali etkilemez)
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const resend = new Resend(resendKey);
      const shortId = `ORD-${order.id.slice(0, 8).toUpperCase()}`;
      const amount = `₺${Number(order.total_price).toFixed(2)}`;

      // Müşteriye iptal onayı
      if (order.customer_email) {
        const refundLine = refund.ok
          ? `Ödediğiniz tutar (<strong>${amount}</strong>) iade edilmiştir; bankanıza bağlı olarak birkaç iş günü içinde kartınıza yansıyacaktır.`
          : `Ödediğiniz tutarın (<strong>${amount}</strong>) iadesi en kısa sürede gerçekleştirilecektir.`;
        resend.emails.send({
          from: "El's Dream Factory <noreply@elsdreamfactory.com>",
          to: order.customer_email,
          subject: `Siparişiniz İptal Edildi – ${shortId}`,
          html: `
            <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#2C2C2C;line-height:1.7;">
              <h2 style="font-size:22px;font-weight:normal;">Siparişiniz İptal Edildi</h2>
              <p>Merhaba ${titleCaseName(order.customer_name) || 'Değerli Müşterimiz'},</p>
              <p><strong>${shortId}</strong> numaralı siparişiniz talebiniz üzerine iptal edilmiştir.</p>
              <p>${refundLine}</p>
              <hr style="border:none;border-top:1px solid #E8E0D8;margin:24px 0;" />
              <p style="color:#9B8E85;font-size:12px;">
                Sorularınız için: <a href="mailto:elsdreamfactory@gmail.com" style="color:#5C0A1A;">elsdreamfactory@gmail.com</a><br/>
                El's Dream Factory — ELİF KOÇBERBER DESIGN HOUSE
              </p>
            </div>
          `,
        }).catch(() => {});
      }

      // Admin'e bildirim
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        const adminLine = refund.ok
          ? `<p style="color:#166534;"><strong>Otomatik iade başarılı</strong> (${refund.method === 'cancel' ? 'iptal' : 'iade'}). Ek işlem gerekmez.</p>`
          : `<p style="color:#991b1b;"><strong>⚠️ OTOMATİK İADE BAŞARISIZ:</strong> ${refund.error || 'bilinmeyen hata'}<br/>Lütfen iyzico panelinden manuel iade yapın.</p>`;
        resend.emails.send({
          from: "El's Dream Factory <noreply@elsdreamfactory.com>",
          to: adminEmail,
          subject: `${refund.ok ? '↩️' : '⚠️'} Sipariş iptal edildi – ${shortId}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#2C2C2C;line-height:1.6;">
              <p><strong>${shortId}</strong> numaralı sipariş müşteri tarafından iptal edildi.</p>
              <p>Müşteri: ${order.customer_name || '-'} (${order.customer_email || '-'})<br/>
              Tutar: ${amount}</p>
              ${adminLine}
            </div>
          `,
        }).catch(() => {});
      }
    }

    return NextResponse.json({ success: true, status: 'cancelled', refunded: refund.ok });
  } catch {
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}
