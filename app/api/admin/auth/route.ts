import { NextRequest, NextResponse } from 'next/server';
import * as bcrypt from 'bcrypt';
import crypto from 'crypto';
import { checkRateLimit, getRateLimitKey } from '@/lib/rateLimit';
import { adminSessions } from '@/lib/adminAuth';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';

function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('adminToken')?.value;

    if (!token || !adminSessions.has(token)) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const session = adminSessions.get(token)!;

    if (Date.now() > session.expiresAt) {
      adminSessions.delete(token);
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, email: session.email });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: max 5 login attempts per 15 minutes
    const rateLimitKey = getRateLimitKey(request, 'admin-login');
    const { allowed } = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);

    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Çok fazla başarısız giriş denemesi. Lütfen 15 dakika sonra tekrar deneyin.' },
        { status: 429, headers: { 'Retry-After': '900' } }
      );
    }

    const { email, password, rememberMe } = await request.json();

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
    const sessionDuration = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 7 gün veya 24 saat
    const expiresAt = Date.now() + sessionDuration;

    adminSessions.set(token, { email, expiresAt });

    const response = NextResponse.json({
      success: true,
      email: email,
      message: 'Başarıyla giriş yaptınız',
    });

    response.cookies.set('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60,
    });

    return response;
  } catch {
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
      adminSessions.delete(token);
    }

    const response = NextResponse.json({ success: true, message: 'Çıkış yapıldı' });
    response.cookies.delete('adminToken');

    return response;
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
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

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400');

  return response;
}
