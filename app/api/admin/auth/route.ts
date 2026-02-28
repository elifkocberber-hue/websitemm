import { NextRequest, NextResponse } from 'next/server';
import * as bcrypt from 'bcrypt';
import { checkRateLimit, getRateLimitKey } from '@/lib/rateLimit';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@ter-aseramik.com';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';

// Simple session store (production'da database veya Redis kullan)
const sessions = new Map<string, { email: string; expiresAt: number }>();

function generateSessionToken(): string {
  return require('crypto').randomBytes(32).toString('hex');
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('adminToken')?.value;

    if (!token || !sessions.has(token)) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const session = sessions.get(token)!;

    if (Date.now() > session.expiresAt) {
      sessions.delete(token);
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, email: session.email });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: max 5 login attempts per 15 minutes
    const rateLimitKey = getRateLimitKey(request, 'admin-login');
    const { allowed, remaining } = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);

    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Çok fazla başarısız giriş denemesi. Lütfen 15 dakika sonra tekrar deneyin.' },
        { status: 429, headers: { 'Retry-After': '900' } }
      );
    }

    const { email, password } = await request.json();

    // Validate input
    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Geçersiz e-posta veya şifre' },
        { status: 401 }
      );
    }

    // Validate email
    if (email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz e-posta veya şifre' },
        { status: 401 }
      );
    }

    // Compare password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz e-posta veya şifre' },
        { status: 401 }
      );
    }

    const token = generateSessionToken();
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 saat

    sessions.set(token, { email, expiresAt });

    const response = NextResponse.json({
      success: true,
      email: email,
      message: 'Başarıyla giriş yaptınız',
    });

    response.cookies.set('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login hatası' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('adminToken')?.value;

    if (token) {
      sessions.delete(token);
    }

    const response = NextResponse.json({ success: true, message: 'Çıkış yapıldı' });
    response.cookies.delete('adminToken');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
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

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400');

  return response;
}
