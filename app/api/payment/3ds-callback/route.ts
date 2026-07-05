import { NextRequest, NextResponse } from 'next/server';
import { threedsComplete } from '@/lib/iyzipay';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { titleCaseName } from '@/lib/format';
import { Resend } from 'resend';

function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
}

async function sendOrderConfirmationEmail(params: {
  customerEmail: string;
  customerName: string;
  orderId: string;
  totalPrice: number;
  items: Array<{ name: string; quantity: number; price: number }>;
  shippingAddress: string;
}) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey || !params.customerEmail) return;

  const resend = new Resend(resendKey);
  const itemRows = params.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #E8E0D8;">${i.name}</td>
          <td style="padding:8px 0;border-bottom:1px solid #E8E0D8;text-align:center;">${i.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #E8E0D8;text-align:right;">₺${(i.price * i.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join('');

  await resend.emails.send({
    from: "El's Dream Factory <noreply@elsdreamfactory.com>",
    to: params.customerEmail,
    subject: `Siparişiniz Alındı – ${params.orderId}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:580px;margin:0 auto;color:#2C2C2C;line-height:1.7;">
        <h2 style="font-size:22px;font-weight:normal;margin-bottom:4px;">Siparişiniz için teşekkürler!</h2>
        <p>Merhaba ${titleCaseName(params.customerName)},</p>
        <p>Siparişiniz başarıyla alındı ve hazırlanmaya başlandı. Aşağıda sipariş özetinizi bulabilirsiniz.</p>
        <div style="background:#f9f6f2;border-radius:8px;padding:16px 20px;margin:20px 0;">
          <p style="margin:0 0 4px;font-size:13px;color:#9B8E85;">Sipariş Numarası</p>
          <p style="margin:0;font-size:20px;font-weight:bold;color:#5C0A1A;letter-spacing:0.05em;">${params.orderId}</p>
        </div>
        <table style="width:100%;border-collapse:collapse;margin:20px 0;">
          <thead>
            <tr style="border-bottom:2px solid #2C2C2C;">
              <th style="text-align:left;padding:6px 0;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;">Ürün</th>
              <th style="text-align:center;padding:6px 0;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;">Adet</th>
              <th style="text-align:right;padding:6px 0;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;">Tutar</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding:10px 0;font-weight:bold;">Toplam</td>
              <td style="padding:10px 0;font-weight:bold;text-align:right;color:#5C0A1A;">₺${params.totalPrice.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        <p><strong>Teslimat Adresi:</strong> ${params.shippingAddress}</p>
        <p>Siparişiniz <strong>1-3 iş günü</strong> içinde kargoya verilecektir. Kargo takip bilgilerinizi ayrıca e-posta ile ileteceğiz.</p>
        <p>Teslimattan itibaren <strong>14 gün</strong> içinde cayma hakkınızı kullanabilirsiniz. Detaylar için <a href="https://www.elsdreamfactory.com/returns" style="color:#5C0A1A;">İade Politikamıza</a> bakabilirsiniz.</p>
        <hr style="border:none;border-top:1px solid #E8E0D8;margin:24px 0;" />
        <p style="color:#9B8E85;font-size:12px;">
          Sorularınız için: <a href="mailto:elsdreamfactory@gmail.com" style="color:#5C0A1A;">elsdreamfactory@gmail.com</a><br/>
          El's Dream Factory — ELİF KOÇBERBER DESIGN HOUSE
        </p>
      </div>
    `,
  });
}

// iyzico 3D Secure callback — banka OTP doğrulaması sonrası iyzico bu endpoint'e POST atar.
// Tarayıcı POST ile gelir; başarı/başarısızlık sayfasına 303 (GET) ile yönlendiririz.
export async function POST(request: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.elsdreamfactory.com';

  try {
    if (!process.env.IYZICO_API_KEY || !process.env.IYZICO_SECRET_KEY || !process.env.IYZICO_BASE_URL) {
      return NextResponse.redirect(`${siteUrl}/payment-failed?reason=config_error`, 303);
    }

    // iyzico form-encoded body gönderir
    const formData = await request.formData();
    const paymentId = formData.get('paymentId')?.toString() || '';
    const conversationId = formData.get('conversationId')?.toString() || '';
    const conversationData = formData.get('conversationData')?.toString() || '';
    const mdStatus = formData.get('mdStatus')?.toString() || '';

    // mdStatus: 1 = tam 3DS başarılı; 2-4 = bankaya göre kabul edilebilir; diğerleri başarısız
    if (!['1', '2', '3', '4'].includes(mdStatus) || !paymentId) {
      return NextResponse.redirect(`${siteUrl}/payment-failed?reason=3ds_failed`, 303);
    }

    // 3D Secure ödeme tamamlama (imza/kimlik doğrulama SDK tarafından yapılır)
    const result = await threedsComplete({
      locale: 'tr',
      conversationId: conversationId || generateRandomId(),
      paymentId,
      conversationData,
    });

    if (result.status === 'success') {
      const ref = (result.paymentId || paymentId).toString();
      let orderId = `ORD-${ref.slice(-8).toUpperCase()}`;
      const date = new Date().toLocaleDateString('tr-TR');

      // Bekleyen siparişi bul (payment_id = conversationId) ve 'completed' yap
      try {
        if (conversationId) {
          const { data: order } = await supabaseAdmin
            .from('orders')
            .select('id, status, total_price, shipping_address, customer_email, customer_name, order_items(product_name, quantity, price)')
            .eq('payment_id', conversationId)
            .single();

          if (order) {
            // Ödeme ↔ sipariş bağı: iyzico'nun onayladığı tutar sipariş tutarıyla
            // eşleşmiyorsa siparişi tamamlama (farklı bir ödemenin callback'i
            // bu siparişe yönlendirilmiş olabilir).
            const paidPrice = Number(result.paidPrice ?? result.price ?? NaN);
            if (Number.isFinite(paidPrice) && Math.abs(paidPrice - Number(order.total_price)) > 0.01) {
              console.error(
                `3DS tutar uyuşmazlığı: sipariş ${order.id} tutarı ${order.total_price}, ödenen ${paidPrice}`
              );
              return NextResponse.redirect(`${siteUrl}/payment-failed?reason=amount_mismatch`, 303);
            }

            orderId = `ORD-${order.id.slice(0, 8).toUpperCase()}`;

            // Yalnız ilk tamamlanmada güncelle + e-posta (iyzico tekrar çağırırsa mükerrer olmasın)
            if (order.status !== 'completed') {
              await supabaseAdmin
                .from('orders')
                .update({
                  status: 'completed',
                  iyzico_payment_id: result.paymentId ?? null,
                  updated_at: new Date().toISOString(),
                })
                .eq('id', order.id);

              await sendOrderConfirmationEmail({
                customerEmail: order.customer_email || '',
                customerName: order.customer_name || 'Değerli Müşterimiz',
                orderId,
                totalPrice: Number(order.total_price),
                items: (order.order_items || []).map((i: { product_name: string; quantity: number; price: number }) => ({
                  name: i.product_name,
                  quantity: i.quantity,
                  price: Number(i.price),
                })),
                shippingAddress: order.shipping_address || '',
              }).catch(() => { /* e-posta hatası ödemeyi etkilemez */ });
            }
          }
        }
      } catch (e) {
        console.error('Sipariş tamamlama hatası:', e);
        // DB hatası ödemeyi geçersiz kılmaz — yine de teşekkür sayfasına gönder
      }

      return NextResponse.redirect(
        `${siteUrl}/thank-you?orderId=${orderId}&date=${encodeURIComponent(date)}`,
        303
      );
    }

    const errorMsg = result.errorMessage || '';
    let reason = 'payment_failed';
    if (/reddedildi|declined/i.test(errorMsg)) reason = 'card_declined';
    else if (/yetersiz|insufficient/i.test(errorMsg)) reason = 'insufficient_funds';
    else if (/süresi|expired/i.test(errorMsg)) reason = 'expired_card';

    return NextResponse.redirect(`${siteUrl}/payment-failed?reason=${reason}`, 303);
  } catch (error) {
    console.error('3DS callback hatası:', error);
    return NextResponse.redirect(`${siteUrl}/payment-failed?reason=network_error`, 303);
  }
}
