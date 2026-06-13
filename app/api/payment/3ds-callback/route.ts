import { NextRequest, NextResponse } from 'next/server';
import { threedsComplete } from '@/lib/iyzipay';

function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
}

// iyzico 3D Secure callback — banka OTP doğrulaması sonrası iyzico bu endpoint'e POST atar.
// Tarayıcı POST ile gelir; başarı/başarısızlık sayfasına 303 (GET) ile yönlendiririz.
export async function POST(request: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elsdreamfactory.com';

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
      const orderId = `ORD-${ref.slice(-8).toUpperCase()}`;
      const date = new Date().toLocaleDateString('tr-TR');
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
