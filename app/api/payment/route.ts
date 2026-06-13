import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { validateCustomerData } from '@/lib/validation';
import { checkRateLimit, getRateLimitKey } from '@/lib/rateLimit';

function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function generateSignature(message: string, secretKey: string): string {
  return crypto
    .createHmac('sha1', secretKey)
    .update(message)
    .digest('base64');
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

    const apiKey = process.env.IYZICO_API_KEY || '';
    const secretKey = process.env.IYZICO_SECRET_KEY || '';
    const baseUrl = process.env.IYZICO_BASE_URL;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elsdreamfactory.com';

    if (!baseUrl || !apiKey || !secretKey) {
      return NextResponse.json(
        { success: false, error: 'Ödeme servisi yapılandırılmamış. Lütfen site yöneticisi ile iletişime geçin.' },
        { status: 503 }
      );
    }

    // Server-side fiyat doğrulaması — client'ın gönderdiği fiyata güvenme
    let verifiedTotal = 0;
    for (const item of items) {
      const { data: dbProduct } = await (await import('@/lib/supabaseAdmin')).supabaseAdmin
        .from('products')
        .select('price, stock')
        .eq('id', item.id)
        .single();

      if (!dbProduct) {
        const { getCeramicProductById } = await import('@/data/ceramicProducts');
        const localProduct = getCeramicProductById(item.id);
        if (!localProduct) {
          return NextResponse.json(
            { success: false, error: `Ürün bulunamadı: ${item.name}` },
            { status: 400 }
          );
        }
        verifiedTotal += localProduct.price * (item.quantity || 1);
      } else {
        if (dbProduct.stock < (item.quantity || 1)) {
          return NextResponse.json(
            { success: false, error: `Yetersiz stok: ${item.name}` },
            { status: 400 }
          );
        }
        verifiedTotal += dbProduct.price * (item.quantity || 1);
      }
    }

    // Fiyat farkı %1'den fazlaysa reddet (yuvarlama toleransı)
    if (Math.abs(verifiedTotal - totalPrice) > verifiedTotal * 0.01) {
      return NextResponse.json(
        { success: false, error: 'Fiyat uyuşmazlığı tespit edildi. Lütfen sayfayı yenileyip tekrar deneyin.' },
        { status: 400 }
      );
    }

    if (!customer.cardNumber || !customer.expireMonth || !customer.expireYear || !customer.cvc || !customer.cardHolderName) {
      return NextResponse.json(
        { success: false, error: 'Kart bilgileri eksik' },
        { status: 400 }
      );
    }

    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-real-ip') ||
      '0.0.0.0';

    const conversationId = generateRandomId();

    // 3D Secure başlatma payload'ı
    const paymentPayload = {
      locale: 'tr',
      conversationId,
      price: verifiedTotal.toFixed(2),
      paidPrice: verifiedTotal.toFixed(2),
      currency: 'TRY',
      installment: '1',
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
        lastLoginDate: new Date().toISOString(),
        registrationDate: new Date().toISOString(),
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
      basketItems: items.map((item: any) => ({
        id: item.id.toString(),
        name: item.name,
        category1: item.category || 'Seramik',
        itemType: 'PHYSICAL',
        price: (item.price * item.quantity).toFixed(2),
      })),
    };

    const jsonPayload = JSON.stringify(paymentPayload);
    const signature = generateSignature(jsonPayload, secretKey);
    const authorizationHeader = Buffer.from(apiKey).toString('base64');

    // 3D Secure başlatma isteği
    const response = await fetch(`${baseUrl}/payment/3dsecure/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `IyzipayV2 ${authorizationHeader}`,
        'X-IyzipayV2-Client-Version': '1.0.0',
        'X-Iyzi-Rnd': generateRandomId(),
        'X-IyzipayV2': signature,
      },
      body: jsonPayload,
    });

    const result = await response.json();

    if (result.status === 'success' && result.threeDSHtmlContent) {
      // iyzico banka OTP sayfasının HTML içeriğini döner;
      // istemci bunu bir form olarak sayfaya yazıp otomatik submit eder.
      return NextResponse.json({
        success: true,
        requires3DS: true,
        threeDSHtmlContent: result.threeDSHtmlContent,
        conversationId,
      });
    } else {
      let errorCode = 'timeout';
      const errorMsg = result.errorMessage || '';

      if (errorMsg.includes('Kart reddedildi') || errorMsg.includes('declined')) errorCode = 'card_declined';
      else if (errorMsg.includes('yetersiz') || errorMsg.includes('insufficient')) errorCode = 'insufficient_funds';
      else if (errorMsg.includes('süresi') || errorMsg.includes('expired')) errorCode = 'expired_card';
      else if (errorMsg.includes('geçersiz') || errorMsg.includes('invalid')) errorCode = 'invalid_card';
      else if (errorMsg.includes('ağ') || errorMsg.includes('network')) errorCode = 'network_error';

      return NextResponse.json(
        { success: false, errorCode, error: result.errorMessage || 'Ödeme başlatılamadı' },
        { status: 400 }
      );
    }
  } catch (error) {
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
