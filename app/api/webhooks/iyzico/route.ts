import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createOrder, createOrderItems, getOrCreateUser } from '@/lib/supabaseAdmin';

// Webhook'un orijini doğrulama
function verifyWebhookSignature(
  body: string,
  signature: string | null,
  secretKey: string
): boolean {
  if (!signature) return false;

  const expectedSignature = crypto
    .createHmac('sha1', secretKey)
    .update(body)
    .digest('base64');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Request body'sini al
    const body = await request.text();
    const signature = request.headers.get('x-iyzipay-signature');
    const secretKey = process.env.IYZICO_SECRET_KEY || '';

    // Signature doğrulaması (güvenlik için)
    if (!verifyWebhookSignature(body, signature, secretKey)) {
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // JSON'a dönüştür
    const webhookData = JSON.parse(body);

    // Webhook event türünü kontrol et
    if (webhookData.eventType !== 'payment.completed') {
      return NextResponse.json({ success: true, message: 'Event processed' });
    }

    // Ödeme durumunu kontrol et
    if (webhookData.status === 'success' && webhookData.paymentStatus === 'SUCCESS') {
      try {
        const paymentId = webhookData.paymentId;
        const price = parseFloat(webhookData.price);

        if (webhookData.email && webhookData.conversationData) {
          // Müşteri oluştur/bul
          const user = await getOrCreateUser(
            webhookData.email,
            webhookData.firstName || 'Bilinmiyor',
            webhookData.lastName || 'Bilinmiyor'
          );

          // Siparişi oluştur
          await createOrder(
            user.id,
            price,
            webhookData.shippingAddress || '',
            paymentId
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Webhook başarıyla işlendi',
          paymentId: paymentId,
        });
      } catch {
        return NextResponse.json({
          success: true,
          message: 'Webhook alındı ama database kaydı başarısız',
        });
      }
    } else if (webhookData.status === 'failure' || webhookData.paymentStatus === 'FAILURE') {
      return NextResponse.json({
        success: true,
        message: 'Başarısız ödeme kaydedildi',
      });
    } else {
      return NextResponse.json({
        success: true,
        message: 'Webhook alındı',
      });
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
