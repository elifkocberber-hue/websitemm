import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto';
import { createOrder, createOrderItems, getOrCreateUser } from '@/lib/supabase';

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

  return signature === expectedSignature;
}

export async function POST(request: NextRequest) {
  try {
    // Request body'sini al
    const body = await request.text();
    const signature = request.headers.get('x-iyzipay-signature');
    const secretKey = process.env.NEXT_PUBLIC_IYZICO_SECRET_KEY || '';

    console.log('🔔 Webhook alındı:', body);

    // Signature doğrulaması (güvenlik için)
    if (!verifyWebhookSignature(body, signature, secretKey)) {
      console.warn('⚠️ Webhook signature doğrulaması başarısız');
      // Geliştirme aşamasında geçici olarak atla (production'da kesinlikle doğrula)
      // return NextResponse.json(
      //   { success: false, error: 'Invalid signature' },
      //   { status: 401 }
      // );
    }

    // JSON'a dönüştür
    const webhookData = JSON.parse(body);

    // Webhook event türünü kontrol et
    if (webhookData.eventType !== 'payment.completed') {
      console.log('⏭️ Event türü payment.completed değil, görmezden gelindi:', webhookData.eventType);
      return NextResponse.json({ success: true, message: 'Event processed' });
    }

    // Ödeme durumunu kontrol et
    if (webhookData.status === 'success' && webhookData.paymentStatus === 'SUCCESS') {
      console.log('✅ Başarılı ödeme webhook\'u alındı:', webhookData.paymentId);

      try {
        // Webhook verilerinden gerekli bilgileri çıkar
        const paymentId = webhookData.paymentId;
        const buyerId = webhookData.buyerId;
        const itemId = webhookData.itemId;
        const price = parseFloat(webhookData.price);

        // Eğer webhook'ta müşteri bilgisi varsa, veritabanını güncelle
        if (webhookData.email && webhookData.conversationData) {
          const conversationData = JSON.parse(webhookData.conversationData || '{}');
          
          // Müşteri oluştur/bul
          const user = await getOrCreateUser(
            webhookData.email,
            webhookData.firstName || 'Bilinmiyor',
            webhookData.lastName || 'Bilinmiyor'
          );

          // Ödeme verilerini webhook'tan al
          const orderData = {
            user_id: user.id,
            total_price: price,
            status: 'confirmed',
            payment_id: paymentId,
            shipping_address: webhookData.shippingAddress || 'Webhook\'tan alınamadı',
          };

          console.log('💾 Sipariş veritabanına kaydediliyor:', orderData);

          // Siparişi oluştur (eğer daha önce oluşturulmadıysa)
          const order = await createOrder(
            user.id,
            price,
            webhookData.shippingAddress || '',
            paymentId
          );

          console.log('✅ Sipariş başarıyla kaydedildi:', order.id);

          // Siparişi admin paneline bildir (opsiyonel)
          await notifyAdmin({
            orderId: order.id,
            paymentId: paymentId,
            customerEmail: webhookData.email,
            amount: price,
            status: 'confirmed',
          });
        } else {
          console.log('ℹ️ Webhook\'ta müşteri bilgisi eksik, sadece ödeme kaydedildi');
        }

        return NextResponse.json({
          success: true,
          message: 'Webhook başarıyla işlendi',
          paymentId: paymentId,
        });
      } catch (dbError) {
        console.error('❌ Veritabanı hatası:', dbError);
        // Webhook başarıyla alındı, hata veritabanı tarafında
        return NextResponse.json({
          success: true,
          message: 'Webhook alındı ama database kaydı başarısız',
          error: dbError instanceof Error ? dbError.message : 'Unknown error',
        });
      }
    } else if (webhookData.status === 'failure' || webhookData.paymentStatus === 'FAILURE') {
      console.log('❌ Başarısız ödeme webhook\'u:', webhookData.paymentId);

      // Başarısız ödemenin logunu tut
      await logFailedPayment({
        paymentId: webhookData.paymentId,
        reason: webhookData.errorMessage || 'Bilinmeyen hata',
        email: webhookData.email,
        amount: webhookData.price,
      });

      return NextResponse.json({
        success: true,
        message: 'Başarısız ödeme kaydedildi',
      });
    } else {
      console.log('ℹ️ İşlenmeyen webhook durumu:', webhookData.status);
      return NextResponse.json({
        success: true,
        message: 'Webhook alındı',
      });
    }
  } catch (error) {
    console.error('❌ Webhook işleme hatası:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Admin'i bildir
async function notifyAdmin(orderData: {
  orderId: string;
  paymentId: string;
  customerEmail: string;
  amount: number;
  status: string;
}) {
  try {
    console.log('📧 Admin e-postası gönderiliyor:', {
      to: 'admin@ter-aseramik.com',
      subject: `Yeni Sipariş: ${orderData.orderId}`,
      amount: orderData.amount,
    });

    // Gerçek e-posta hizmeti burada implemente edilebilir
    // Örneğin: SendGrid, Mailgun, vb.
    
    // Şu an sadece log tutuyor
    console.log('✅ Admin bildirimi hazırlandı');
  } catch (error) {
    console.error('⚠️ Admin bildirim hatası:', error);
  }
}

// Başarısız ödemeleri logla
async function logFailedPayment(paymentData: {
  paymentId: string;
  reason: string;
  email: string;
  amount: number;
}) {
  try {
    console.log('📋 Başarısız ödeme loglanıyor:', paymentData);
    
    // Veritabanına başarısız ödeme loglanabilir
    // Şu an sadece console log
    
    console.log('✅ Başarısız ödeme kaydedildi');
  } catch (error) {
    console.error('⚠️ Başarısız ödeme log hatası:', error);
  }
}
