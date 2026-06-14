import { NextRequest, NextResponse } from 'next/server';
import * as bcrypt from 'bcrypt';
import { checkRateLimit, getRateLimitKey } from '@/lib/rateLimit';
import { signAdminJWT, verifyAdminJWT } from '@/lib/adminAuth';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';

// GET - Oturum kontrolü
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('adminToken')?.value;
    if (!token) return NextResponse.json({ authenticated: false }, { status: 401 });

    const payload = verifyAdminJWT(token);
    if (!payload) return NextResponse.json({ authenticated: false }, { status: 401 });

    return NextResponse.json({ authenticated: true, email: payload.email });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

// POST - Giriş
export async function POST(request: NextRequest) {
  try {
    const rateLimitKey = getRateLimitKey(request, 'admin-login');
    const { allowed } = await checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);

    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Çok fazla başarısız giriş denemesi. Lütfen 15 dakika sonra tekrar deneyin.' },
        { status: 429, headers: { 'Retry-After': '900' } }
      );
    }

    const { email, password, rememberMe } = await request.json();

    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
      return NextResponse.json({ success: false, error: 'Geçersiz e-posta veya şifre' }, { status: 401 });
    }

    if (email !== ADMIN_EMAIL) {
      return NextResponse.json({ success: false, error: 'Geçersiz e-posta veya şifre' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, error: 'Geçersiz e-posta veya şifre' }, { status: 401 });
    }

    const cookieMaxAge = rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60;
    const token = signAdminJWT(email, cookieMaxAge);

    const response = NextResponse.json({ success: true, email, message: 'Başarıyla giriş yaptınız' });
    response.cookies.set('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: cookieMaxAge,
    });

    return response;
  } catch {
    return NextResponse.json({ success: false, error: 'Login hatası' }, { status: 500 });
  }
}

// DELETE - Çıkış
export async function DELETE(_request: NextRequest) {
  try {
    const response = NextResponse.json({ success: true, message: 'Çıkış yapıldı' });
    response.cookies.delete('adminToken');
    return response;
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// CORS preflight
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

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
}
