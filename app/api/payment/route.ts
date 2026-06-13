import { NextRequest, NextResponse } from 'next/server';
import { validateCustomerData } from '@/lib/validation';
import { checkRateLimit, getRateLimitKey } from '@/lib/rateLimit';
import { threedsInitialize } from '@/lib/iyzipay';

function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: max 10 payment attempts per hour
    const rateLimitKey = getRateLimitKey(request, 'payment');
    const { allowed } = checkRateLimit(rateLimitKey, 10, 60 * 60 * 1000);

    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Çok fazla ödeme denemesi. Lütfen daha sonra tekrar deneyin.' },
        { status: 429, headers: { 'Retry-After': '3600' } }
      );
    }

    const { totalPrice, items, customer } = await request.json();

    // Validate customer data
    const validation = validateCustomerData(customer);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz müşteri bilgileri', details: validation.errors },
        { status: 400 }
      );
    }

    if (!totalPrice || totalPrice <= 0) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz ödeme tutarı' },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz ürün bilgileri' },
        { status: 400 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elsdreamfactory.com';

    if (!process.env.IYZICO_API_KEY || !process.env.IYZICO_SECRET_KEY || !process.env.IYZICO_BASE_URL) {
      return NextResponse.json(
        { success: false, error: 'Ödeme servisi yapılandırılmamış. Lütfen site yöneticisi ile iletişime geçin.' },
        { status: 503 }
      );
    }

    if (!customer.cardNumber || !customer.expireMonth || !customer.expireYear || !customer.cvc || !customer.cardHolderName) {
      return NextResponse.json(
        { success: false, error: 'Kart bilgileri eksik' },
        { status: 400 }
      );
    }

    // Server-side fiyat doğrulaması — client fiyatına güvenme.
    // Aynı döngüde iyzico sepet kalemlerini de doğrulanmış fiyatlarla kuruyoruz
    // (iyzico, basketItems toplamının price ile birebir aynı olmasını ister).
    const { supabaseAdmin } = await import('@/lib/supabaseAdmin');
    const { getCeramicProductById } = await import('@/data/ceramicProducts');

    const basketItems: Array<{ id: string; name: string; category1: string; itemType: string; price: string }> = [];

    for (const item of items) {
      const qty = item.quantity || 1;
      let unitPrice: number;

      const { data: dbProduct } = await supabaseAdmin
        .from('products')
        .select('price, stock')
        .eq('id', item.id)
        .single();

      if (dbProduct) {
        if (dbProduct.stock < qty) {
          return NextResponse.json(
            { success: false, error: `Yetersiz stok: ${item.name}` },
            { status: 400 }
          );
        }
        unitPrice = Number(dbProduct.price);
      } else {
        const localProduct = getCeramicProductById(item.id);
        if (!localProduct) {
          return NextResponse.json(
            { success: false, error: `Ürün bulunamadı: ${item.name}` },
            { status: 400 }
          );
        }
        unitPrice = localProduct.price;
      }

      basketItems.push({
        id: String(item.id),
        name: String(item.name || 'Ürün'),
        category1: item.category || 'Seramik',
        itemType: 'PHYSICAL',
        price: (unitPrice * qty).toFixed(2),
      });
    }

    // Sepet kalemlerinin toplamı — iyzico price/paidPrice ile birebir eşit olmalı
    const basketSum = basketItems.reduce((s, b) => s + parseFloat(b.price), 0);

    // Doğrulanmış toplam, client'ın gönderdiği tutarla uyuşmuyorsa reddet
    if (Math.abs(basketSum - totalPrice) > Math.max(basketSum * 0.01, 0.01)) {
      return NextResponse.json(
        { success: false, error: 'Fiyat uyuşmazlığı tespit edildi. Lütfen sayfayı yenileyip tekrar deneyin.' },
        { status: 400 }
      );
    }

    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '85.34.78.112';

    const conversationId = generateRandomId();
    const priceStr = basketSum.toFixed(2);

    // 3D Secure başlatma — imza/kimlik doğrulama resmi SDK tarafından yapılır
    const result = await threedsInitialize({
      locale: 'tr',
      conversationId,
      price: priceStr,
      paidPrice: priceStr,
      currency: 'TRY',
      installment: '1',
      basketId: `B-${conversationId}`,
      paymentChannel: 'WEB',
      paymentGroup: 'PRODUCT',
      // Banka OTP sonrası iyzico'nun geri döneceği URL
      callbackUrl: `${siteUrl}/api/payment/3ds-callback`,
      paymentCard: {
        cardHolderName: customer.cardHolderName,
        cardNumber: customer.cardNumber.replace(/\s/g, ''),
        expireMonth: customer.expireMonth,
        expireYear: customer.expireYear,
        cvc: customer.cvc,
        registerCard: '0',
      },
      buyer: {
        id: generateRandomId(),
        name: customer.firstName,
        surname: customer.lastName,
        gsmNumber: customer.phone,
        email: customer.email,
        identityNumber: customer.identityNumber || '11111111111',
        registrationAddress: customer.address,
        ip: clientIp,
        city: customer.city,
        country: 'Turkey',
        zipCode: customer.postalCode,
      },
      shippingAddress: {
        contactName: `${customer.firstName} ${customer.lastName}`,
        city: customer.city,
        country: 'Turkey',
        address: customer.address,
        zipCode: customer.postalCode,
      },
      billingAddress: {
        contactName: `${customer.firstName} ${customer.lastName}`,
        city: customer.city,
        country: 'Turkey',
        address: customer.address,
        zipCode: customer.postalCode,
      },
      basketItems,
    });

    if (result.status === 'success' && result.threeDSHtmlContent) {
      // iyzico banka OTP sayfasının HTML içeriğini döner;
      // istemci bunu bir form olarak sayfaya yazıp otomatik submit eder.
      return NextResponse.json({
        success: true,
        requires3DS: true,
        threeDSHtmlContent: result.threeDSHtmlContent,
        conversationId,
      });
    }

    // Hata: iyzico'nun gerçek mesajını sınıflandır
    const errorMsg = result.errorMessage || '';
    let errorCode = 'payment_failed';
    if (/reddedildi|declined/i.test(errorMsg)) errorCode = 'card_declined';
    else if (/yetersiz|insufficient/i.test(errorMsg)) errorCode = 'insufficient_funds';
    else if (/süresi|expired/i.test(errorMsg)) errorCode = 'expired_card';
    else if (/geçersiz|invalid/i.test(errorMsg)) errorCode = 'invalid_card';

    return NextResponse.json(
      { success: false, errorCode, error: errorMsg || 'Ödeme başlatılamadı' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Ödeme başlatma hatası:', error);
    return NextResponse.json(
      { success: false, error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse();

  const origin = request.headers.get('origin');
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    'https://elsdreamfactory.com',
    'http://localhost:3000',
  ].filter(Boolean);

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');

  return response;
}
