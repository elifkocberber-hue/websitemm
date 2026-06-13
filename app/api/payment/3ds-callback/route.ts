import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getOrCreateUser, createOrder, createOrderItems } from '@/lib/supabaseAdmin';
import { Resend } from 'resend';

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
  const itemRows = params.items.map(i =>
    `<tr>
      <td style="padding:8px 0;border-bottom:1px solid #E8E0D8;">${i.name}</td>
      <td style="padding:8px 0;border-bottom:1px solid #E8E0D8;text-align:center;">${i.quantity}</td>
      <td style="padding:8px 0;border-bottom:1px solid #E8E0D8;text-align:right;">₺${(i.price * i.quantity).toFixed(2)}</td>
    </tr>`
  ).join('');

  await resend.emails.send({
    from: "El's Dream Factory <noreply@elsdreamfactory.com>",
    to: params.customerEmail,
    subject: `Siparişiniz Alındı – ${params.orderId}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:580px;margin:0 auto;color:#2C2C2C;line-height:1.7;">
        <h2 style="font-size:22px;font-weight:normal;margin-bottom:4px;">Siparişiniz için teşekkürler!</h2>
        <p>Merhaba ${params.customerName},</p>
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
        <p>Siparişiniz <strong>3–7 iş günü</strong> içinde kargoya verilecektir. Kargo takip bilgilerinizi ayrıca e-posta ile ileteceğiz.</p>
        <p>Teslimattan itibaren <strong>14 gün</strong> içinde cayma hakkınızı kullanabilirsiniz. Detaylar için <a href="https://elsdreamfactory.com/returns" style="color:#5C0A1A;">İade Politikamıza</a> bakabilirsiniz.</p>

        <hr style="border:none;border-top:1px solid #E8E0D8;margin:24px 0;" />
        <p style="color:#9B8E85;font-size:12px;">
          Sorularınız için: <a href="mailto:elsdreamfactory@gmail.com" style="color:#5C0A1A;">elsdreamfactory@gmail.com</a><br/>
          El's Dream Factory — ELİF KOÇBERBER DESIGN HOUSE
        </p>
      </div>
    `,
  });
}

function generateSignature(message: string, secretKey: string): string {
  return crypto
    .createHmac('sha1', secretKey)
    .update(message)
    .digest('base64');
}

function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// iyzico 3D Secure callback — banka OTP doğrulaması sonrası iyzico bu endpoint'e POST atar
export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.IYZICO_API_KEY || '';
    const secretKey = process.env.IYZICO_SECRET_KEY || '';
    const baseUrl = process.env.IYZICO_BASE_URL;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elsdreamfactory.com';

    if (!baseUrl || !apiKey || !secretKey) {
      return NextResponse.redirect(`${siteUrl}/payment-failed?reason=config_error`);
    }

    // iyzico form-encoded body gönderir
    const formData = await request.formData();
    const paymentId = formData.get('paymentId')?.toString() || '';
    const conversationData = formData.get('conversationData')?.toString() || '';
    const mdStatus = formData.get('mdStatus')?.toString() || '';

    // mdStatus: 1 = tam 3DS, 2-6 = yarı 3DS (bankaya göre değişir), diğerleri = başarısız
    if (!['1', '2', '3', '4'].includes(mdStatus)) {
      return NextResponse.redirect(`${siteUrl}/payment-failed?reason=3ds_failed`);
    }

    // 3D Secure doğrulama tamamlama isteği
    const authPayload = {
      locale: 'tr',
      conversationId: generateRandomId(),
      paymentId,
      conversationData,
    };

    const jsonPayload = JSON.stringify(authPayload);
    const signature = generateSignature(jsonPayload, secretKey);
    const authorizationHeader = Buffer.from(apiKey).toString('base64');

    const response = await fetch(`${baseUrl}/payment/3dsecure/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `IyzipayV2 ${authorizationHeader}`,
        'X-IyzipayV2': signature,
      },
      body: jsonPayload,
    });

    const result = await response.json();

    if (result.status === 'success') {
      try {
        // Conversation data'dan sipariş bilgilerini çek
        let orderData: any = {};
        try {
          orderData = conversationData ? JSON.parse(conversationData) : {};
        } catch {
          // conversationData JSON değilse boş bırak
        }

        const user = await getOrCreateUser(
          orderData.email || result.buyer?.email || 'musteri@elsdreamfactory.com',
          orderData.firstName || result.buyer?.name || 'Müşteri',
          orderData.lastName || result.buyer?.surname || ''
        );

        const order = await createOrder(
          user.id,
          parseFloat(result.paidPrice || result.price || '0'),
          orderData.address || result.shippingAddress?.address || '',
          result.paymentId
        );

        if (orderData.items && Array.isArray(orderData.items)) {
          await createOrderItems(
            order.id,
            orderData.items.map((item: any) => ({
              product_id: item.id,
              product_name: item.name,
              quantity: item.quantity,
              price: item.price,
            }))
          );
        }

        const orderId = `ORD-${order.id.slice(0, 8).toUpperCase()}`;
        const date = new Date().toLocaleDateString('tr-TR');

        // Sipariş onay e-postası gönder
        await sendOrderConfirmationEmail({
          customerEmail: orderData.email || result.buyer?.email || '',
          customerName: `${orderData.firstName || result.buyer?.name || ''} ${orderData.lastName || result.buyer?.surname || ''}`.trim(),
          orderId,
          totalPrice: parseFloat(result.paidPrice || result.price || '0'),
          items: orderData.items || [],
          shippingAddress: orderData.address || result.shippingAddress?.address || '',
        }).catch(() => { /* e-posta hatası ödemeyi etkilemez */ });

        return NextResponse.redirect(
          `${siteUrl}/thank-you?orderId=${orderId}&date=${encodeURIComponent(date)}`
        );
      } catch {
        // DB kaydı başarısız olsa bile ödeme başarılı — yönlendir
        const orderId = `ORD-${Date.now()}`;
        const date = new Date().toLocaleDateString('tr-TR');
        return NextResponse.redirect(
          `${siteUrl}/thank-you?orderId=${orderId}&date=${encodeURIComponent(date)}`
        );
      }
    } else {
      let errorCode = 'payment_failed';
      const errorMsg = result.errorMessage || '';

      if (errorMsg.includes('declined') || errorMsg.includes('reddedildi')) errorCode = 'card_declined';
      else if (errorMsg.includes('insufficient') || errorMsg.includes('yetersiz')) errorCode = 'insufficient_funds';
      else if (errorMsg.includes('expired') || errorMsg.includes('süresi')) errorCode = 'expired_card';

      return NextResponse.redirect(`${siteUrl}/payment-failed?reason=${errorCode}`);
    }
  } catch {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elsdreamfactory.com';
    return NextResponse.redirect(`${siteUrl}/payment-failed?reason=network_error`);
  }
}
