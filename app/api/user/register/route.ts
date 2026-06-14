import { NextResponse } from 'next/server';
import * as bcrypt from 'bcrypt';
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';
import { checkRateLimit, getRateLimitKey } from '@/lib/rateLimit';
import { isValidPassword } from '@/lib/validation';
import { signUserJWT } from '@/lib/userAuth';

const SESSION_TTL = 30 * 24 * 60 * 60; // 30 gün

export async function POST(request: Request) {
  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(request, 'register');
    const { allowed } = await checkRateLimit(rateLimitKey, 5, 60 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Çok fazla kayıt denemesi. Lütfen daha sonra tekrar deneyin.' },
        { status: 429 }
      );
    }

    const { email, password, firstName, lastName } = await request.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: 'Tüm alanlar gereklidir' }, { status: 400 });
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        { error: 'Şifre en az 8 karakter olmalı; büyük harf, küçük harf ve rakam içermelidir' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Geçerli bir e-posta adresi giriniz' }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedEmail = email.toLowerCase().trim();
    const sanitizedFirstName = firstName.trim().slice(0, 100);
    const sanitizedLastName = lastName.trim().slice(0, 100);

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('site_users')
      .select('id')
      .eq('email', sanitizedEmail)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: 'Bu e-posta adresi zaten kayıtlı' }, { status: 409 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Insert to Supabase
    const { data: newUser, error } = await supabase
      .from('site_users')
      .insert({
        email: sanitizedEmail,
        password_hash: passwordHash,
        first_name: sanitizedFirstName,
        last_name: sanitizedLastName,
      })
      .select('id, email, first_name, last_name')
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Bu e-posta adresi zaten kayıtlı' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Kayıt sırasında bir hata oluştu' }, { status: 500 });
    }

    const sessionUser = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.first_name,
      lastName: newUser.last_name,
    };

    const token = signUserJWT(sessionUser, SESSION_TTL);
    const response = NextResponse.json({ user: sessionUser }, { status: 201 });
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
