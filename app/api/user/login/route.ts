import { NextResponse } from 'next/server';
import * as bcrypt from 'bcrypt';
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';
import { checkRateLimit, getRateLimitKey } from '@/lib/rateLimit';
import { signUserJWT } from '@/lib/userAuth';

const SESSION_TTL = 30 * 24 * 60 * 60; // 30 gün

export async function POST(request: Request) {
  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(request, 'login');
    const { allowed } = checkRateLimit(rateLimitKey, 10, 15 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Çok fazla giriş denemesi. Lütfen 15 dakika sonra tekrar deneyin.' },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'E-posta ve şifre gereklidir' }, { status: 400 });
    }

    const { data: user, error } = await supabase
      .from('site_users')
      .select('id, email, password_hash, first_name, last_name')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error || !user) {
      return NextResponse.json({ error: 'E-posta veya şifre hatalı' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'E-posta veya şifre hatalı' }, { status: 401 });
    }

    const sessionUser = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
    };

    const token = signUserJWT(sessionUser, SESSION_TTL);
    const response = NextResponse.json({ user: sessionUser });
    response.cookies.set('userToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: SESSION_TTL,
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}
