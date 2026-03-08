import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import crypto from 'crypto';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

const TOKEN_TTL_MINUTES = 30;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json() as { email: string };
    if (!email) return NextResponse.json({ error: 'E-posta gerekli' }, { status: 400 });

    const sanitized = email.toLowerCase().trim();
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

      await supabase.from('password_reset_tokens').insert({
        user_id: user.id,
        token,
        expires_at: expiresAt,
      });

      // E-posta gönder
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        const resend = new Resend(resendKey);
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elsdreamfactory.com';
        const resetLink = `${siteUrl}/reset-password?token=${token}`;

        await resend.emails.send({
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
      }
    }

    // Her durumda aynı yanıt — e-posta var mı yok mu belli etme
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Forgot password error:', e);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
