import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';
import { checkRateLimit, getRateLimitKey } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    const rateLimitKey = getRateLimitKey(request, 'newsletter');
    const { allowed } = await checkRateLimit(rateLimitKey, 3, 60 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ error: 'Çok fazla deneme' }, { status: 429 });
    }

    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'E-posta gereklidir' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Geçersiz e-posta' }, { status: 400 });
    }

    // Save to Supabase (upsert to avoid duplicates)
    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert(
        { email: email.toLowerCase().trim() },
        { onConflict: 'email' }
      );

    if (error) {
      return NextResponse.json({ error: 'Kayıt başarısız' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}
