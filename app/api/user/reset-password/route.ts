import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { checkRateLimit, getRateLimitKey } from '@/lib/rateLimit';
import { isValidPassword } from '@/lib/validation';
import bcrypt from 'bcrypt';

function getSupabase() {
  return supabaseAdmin;
}

export async function POST(request: NextRequest) {
  try {
    const rateLimitKey = getRateLimitKey(request, 'reset-password');
    const { allowed } = await checkRateLimit(rateLimitKey, 10, 15 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Çok fazla deneme. Lütfen daha sonra tekrar deneyin.' },
        { status: 429, headers: { 'Retry-After': '900' } }
      );
    }

    const { token, password } = await request.json() as { token: string; password: string };

    if (!token || !password) {
      return NextResponse.json({ error: 'Token ve şifre gerekli' }, { status: 400 });
    }

    // Kayıt ile aynı şifre politikası — sıfırlama üzerinden zayıf şifre belirlenemesin
    if (!isValidPassword(password)) {
      return NextResponse.json(
        { error: 'Şifre en az 8 karakter olmalı; büyük harf, küçük harf ve rakam içermelidir' },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    // Token'ı doğrula
    const { data: resetToken } = await supabase
      .from('password_reset_tokens')
      .select('id, user_id, expires_at, used')
      .eq('token', token)
      .single();

    if (!resetToken) {
      return NextResponse.json({ error: 'Geçersiz veya süresi dolmuş bağlantı' }, { status: 400 });
    }

    if (resetToken.used) {
      return NextResponse.json({ error: 'Bu bağlantı daha önce kullanıldı' }, { status: 400 });
    }

    if (new Date(resetToken.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Bağlantının süresi dolmuş. Yeni bir istek gönderin.' }, { status: 400 });
    }

    // Yeni şifreyi hashle ve güncelle
    const passwordHash = await bcrypt.hash(password, 12);

    const { error: updateError } = await supabase
      .from('site_users')
      .update({ password_hash: passwordHash })
      .eq('id', resetToken.user_id);

    if (updateError) {
      return NextResponse.json({ error: 'Şifre güncellenemedi' }, { status: 500 });
    }

    // Token'ı kullanıldı olarak işaretle ve sil
    await supabase
      .from('password_reset_tokens')
      .delete()
      .eq('id', resetToken.id);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Reset password error:', e);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
