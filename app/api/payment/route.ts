import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto';
import { getOrCreateUser, createOrder, createOrderItems } from '@/lib/supabase';
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

    // Validate total price
    if (!totalPrice || totalPrice <= 0) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz ödeme tutarı' },
        { status: 400 }
      );
    }

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz ürün bilgileri' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_IYZICO_API_KEY || '';
    const secretKey = process.env.NEXT_PUBLIC_IYZICO_SECRET_KEY || '';
    const baseUrl = process.env.NEXT_PUBLIC_IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com';

    // Prepare payment payload
    const conversationId = generateRandomId();
    const requestId = generateRandomId();

    const paymentPayload = {
      locale: 'tr',
      conversationId: conversationId,
      price: totalPrice.toFixed(2),
      paidPrice: totalPrice.toFixed(2),
      currency: 'TRY',
      installment: '1',
      paymentChannel: 'WEB',
      paymentGroup: 'PRODUCT',
      paymentCard: {
        cardHolderName: `${customer.firstName} ${customer.lastName}`,
        cardNumber: '5528790000000008', // Test card (success)
        expireMonth: '12',
        expireYear: '2030',
        cvc: '123',
      },
      buyer: {
        id: generateRandomId(),
        name: customer.firstName,
        surname: customer.lastName,
        gsmNumber: customer.phone,
        email: customer.email,
        identityNumber: '12345678901',
        lastLoginDate: new Date().toISOString(),
        registrationDate: new Date().toISOString(),
        registrationAddress: customer.address,
        ip: '85.34.78.112',
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
        category1: item.category,
        itemType: 'PHYSICAL',
        price: (item.price * item.quantity).toFixed(2),
      })),
    };

    // Convert to JSON for signature
    const jsonPayload = JSON.stringify(paymentPayload);

    // Generate signature
    const signature = generateSignature(jsonPayload, secretKey);
    
    // Encode API key to base64 for Authorization header
    const authorizationHeader = Buffer.from(apiKey).toString('base64');

    // Make request to Iyzico
    const response = await fetch(`${baseUrl}/payment/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `IyzipayV2 ${authorizationHeader}`,
        'X-IyzipayV2': signature,
      },
      body: jsonPayload,
    });

    const result = await response.json();

    console.log('Iyzico Response:', result);

    if (result.status === 'success') {
      try {
        // Create user in Supabase
        const user = await getOrCreateUser(
          customer.email,
          customer.firstName,
          customer.lastName
        );

        // Create order in Supabase
        const order = await createOrder(
          user.id,
          totalPrice,
          `${customer.address}, ${customer.city} ${customer.postalCode}`,
          result.paymentId
        );

        // Create order items in Supabase
        await createOrderItems(
          order.id,
          items.map((item: any) => ({
            product_id: item.id,
            product_name: item.name,
            quantity: item.quantity,
            price: item.price,
          }))
        );

        return NextResponse.json({
          success: true,
          paymentId: result.paymentId,
          orderId: `ORD-${order.id.slice(0, 8).toUpperCase()}`,
          message: 'Ödeme başarılı',
        });
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Payment succeeded but database error - still return success to user
        return NextResponse.json({
          success: true,
          paymentId: result.paymentId,
          orderId: `ORD-${Date.now()}`,
          message: 'Ödeme başarılı (sipariş kaydı başarısız, lütfen destek ile iletişime geçiniz)',
        });
      }
    } else {
      // Hata kodunu belirle
      let errorCode = 'timeout';
      const errorMsg = result.errorMessage || '';
      
      if (errorMsg.includes('Kart reddedildi') || errorMsg.includes('declined')) {
        errorCode = 'card_declined';
      } else if (errorMsg.includes('yetersiz') || errorMsg.includes('insufficient')) {
        errorCode = 'insufficient_funds';
      } else if (errorMsg.includes('süresi') || errorMsg.includes('expired')) {
        errorCode = 'expired_card';
      } else if (errorMsg.includes('geçersiz') || errorMsg.includes('invalid')) {
        errorCode = 'invalid_card';
      } else if (errorMsg.includes('ağ') || errorMsg.includes('network')) {
        errorCode = 'network_error';
      }

      return NextResponse.json(
        {
          success: false,
          errorCode: errorCode,
          error: result.errorMessage || 'Ödeme başarısız oldu',
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('API Error:', error);
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
    'https://websitemm.vercel.app',
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
}
