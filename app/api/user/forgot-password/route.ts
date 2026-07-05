import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { checkRateLimit, getRateLimitKey } from '@/lib/rateLimit';
import { Resend } from 'resend';
import crypto from 'crypto';

function getSupabase() {
  return supabaseAdmin;
}

const TOKEN_TTL_MINUTES = 30;

export async function POST(request: NextRequest) {
  try {
    // Rate limit (IP bazlı): e-posta bombardımanı / Resend kotası tüketimi önlemi
    const ipKey = getRateLimitKey(request, 'forgot-password');
    const { allowed } = await checkRateLimit(ipKey, 3, 60 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Çok fazla deneme. Lütfen daha sonra tekrar deneyin.' },
        { status: 429, headers: { 'Retry-After': '3600' } }
      );
    }

    const { email } = await request.json() as { email: string };
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'E-posta gerekli' }, { status: 400 });
    }

    const sanitized = email.toLowerCase().trim();

    // Aynı hesaba dağıtık IP'lerden hedefli spam önlemi (e-posta bazlı limit)
    const emailKey = `forgot-password-email:${sanitized}`;
    const emailLimit = await checkRateLimit(emailKey, 3, 60 * 60 * 1000);
    if (!emailLimit.allowed) {
      // Enum saldırısına bilgi sızdırmamak için yine başarılı yanıt dön
      return NextResponse.json({ success: true });
    }
    const supabase = getSupabase();

    // Kullanıcıyı bul — e-posta yoksa yine "gönderildi" dön (enum saldırısı önlemi)
    const { data: user } = await supabase
      .from('site_users')
      .select('id, email, first_name')
      .eq('email', sanitized)
      .single();

    if (user) {
      // Eski tokenları temizle
      await supabase
        .from('password_reset_tokens')
        .delete()
        .eq('user_id', user.id);

      // Yeni token üret
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + TOKEN_TTL_MINUTES * 60 * 1000).toISOString();

      const { error: insertError } = await supabase.from('password_reset_tokens').insert({
        user_id: user.id,
        token,
        expires_at: expiresAt,
      });

      if (insertError) {
        console.error('Token insert error:', insertError);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
      }

      // E-posta gönder
      const resendKey = process.env.RESEND_API_KEY;
      if (!resendKey) {
        console.error('RESEND_API_KEY tanımlı değil — e-posta gönderilemedi');
        return NextResponse.json({ error: 'E-posta servisi yapılandırılmamış' }, { status: 500 });
      }

      const resend = new Resend(resendKey);
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.elsdreamfactory.com';
      const resetLink = `${siteUrl}/reset-password?token=${token}`;

      const { error: emailError } = await resend.emails.send({
        from: 'El\'s Dream Factory <noreply@elsdreamfactory.com>',
        to: user.email,
        subject: 'Şifre Sıfırlama Talebi',
        html: `
          <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; color: #2C2C2C;">
            <h2 style="font-size: 24px; font-weight: normal; margin-bottom: 8px;">Merhaba ${user.first_name},</h2>
            <p style="color: #6B6B6B; line-height: 1.6;">
              Şifre sıfırlama talebini aldık. Aşağıdaki butona tıklayarak yeni şifreni belirleyebilirsin.
            </p>
            <a href="${resetLink}"
               style="display: inline-block; margin: 24px 0; padding: 14px 32px; background: #2C2C2C; color: #FAF5EE; text-decoration: none; border-radius: 8px; font-size: 14px; letter-spacing: 0.1em;">
              Şifremi Sıfırla
            </a>
            <p style="color: #9B8E85; font-size: 13px; line-height: 1.6;">
              Bu bağlantı <strong>${TOKEN_TTL_MINUTES} dakika</strong> geçerlidir.<br>
              Şifre sıfırlama talebinde bulunmadıysan bu e-postayı görmezden gelebilirsin.
            </p>
            <hr style="border: none; border-top: 1px solid #E8E0D8; margin: 24px 0;" />
            <p style="color: #9B8E85; font-size: 12px;">El's Dream Factory — El Yapımı Seramik</p>
          </div>
        `,
      });

      if (emailError) {
        console.error('Resend email error:', emailError);
        return NextResponse.json({ error: 'E-posta gönderilemedi' }, { status: 500 });
      }
    }

    // Her durumda aynı yanıt — e-posta var mı yok mu belli etme
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Forgot password error:', e);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
