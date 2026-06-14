import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getSessionUser } from '@/lib/userAuth';
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
      .select('id, status, customer_email, customer_name, total_price')
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

    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', order.id);

    if (updateError) {
      return NextResponse.json({ error: 'Sipariş iptal edilemedi' }, { status: 500 });
    }

    // Bilgilendirme e-postaları (hata olsa da iptali etkilemez)
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const resend = new Resend(resendKey);
      const shortId = `ORD-${order.id.slice(0, 8).toUpperCase()}`;

      // Müşteriye iptal onayı
      if (order.customer_email) {
        resend.emails.send({
          from: "El's Dream Factory <noreply@elsdreamfactory.com>",
          to: order.customer_email,
          subject: `Siparişiniz İptal Edildi – ${shortId}`,
          html: `
            <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#2C2C2C;line-height:1.7;">
              <h2 style="font-size:22px;font-weight:normal;">Siparişiniz İptal Edildi</h2>
              <p>Merhaba ${order.customer_name || 'Değerli Müşterimiz'},</p>
              <p><strong>${shortId}</strong> numaralı siparişiniz talebiniz üzerine iptal edilmiştir.</p>
              <p>Ödediğiniz tutar (<strong>₺${Number(order.total_price).toFixed(2)}</strong>), bankanıza bağlı olarak birkaç iş günü içinde kartınıza iade edilecektir.</p>
              <hr style="border:none;border-top:1px solid #E8E0D8;margin:24px 0;" />
              <p style="color:#9B8E85;font-size:12px;">
                Sorularınız için: <a href="mailto:elsdreamfactory@gmail.com" style="color:#5C0A1A;">elsdreamfactory@gmail.com</a><br/>
                El's Dream Factory — ELİF KOÇBERBER DESIGN HOUSE
              </p>
            </div>
          `,
        }).catch(() => {});
      }

      // Admin'e bildirim (iade işlemi için)
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        resend.emails.send({
          from: "El's Dream Factory <noreply@elsdreamfactory.com>",
          to: adminEmail,
          subject: `⚠️ Müşteri siparişi iptal etti – ${shortId}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#2C2C2C;line-height:1.6;">
              <p><strong>${shortId}</strong> numaralı sipariş müşteri tarafından iptal edildi.</p>
              <p>Müşteri: ${order.customer_name || '-'} (${order.customer_email || '-'})<br/>
              Tutar: ₺${Number(order.total_price).toFixed(2)}</p>
              <p><strong>Yapılması gereken:</strong> Ödeme iadesini iyzico panelinden gerçekleştirin.</p>
            </div>
          `,
        }).catch(() => {});
      }
    }

    return NextResponse.json({ success: true, status: 'cancelled' });
  } catch {
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}
