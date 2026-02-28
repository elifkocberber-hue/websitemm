import { NextRequest, NextResponse } from 'next/server';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@ter-aseramik.com';
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'; // Production'da güvenli hash kullan!

// Simple session store (production'da database veya Redis kullan)
const sessions = new Map<string, { email: string; expiresAt: number }>();

function generateSessionToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
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
    const { email, password } = await request.json();

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
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
    }

    return NextResponse.json(
      { success: false, error: 'Geçersiz e-posta veya şifre' },
      { status: 401 }
    );
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
