import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';
import crypto from 'crypto';

function generateReturnCode(): string {
  return 'EDF-' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  if (!userId) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  }

  try {
    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: 'Sipariş ID gerekli' }, { status: 400 });
    }

    // Siparişin bu kullanıcıya ait olduğunu ve iade edilebilir durumda olduğunu doğrula
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, status, users:user_id(email, first_name, last_name)')
      .eq('id', orderId)
      .eq('user_id', userId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 });
    }

    const allowedStatuses = ['delivered', 'shipped', 'confirmed'];
    if (!allowedStatuses.includes(order.status)) {
      return NextResponse.json({ error: 'Bu sipariş için iade talebi oluşturulamaz' }, { status: 400 });
    }

    // Daha önce iade talebi var mı?
    const { data: existing } = await supabase
      .from('return_requests')
      .select('id')
      .eq('order_id', orderId)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Bu sipariş için zaten bir iade talebi mevcut' }, { status: 409 });
    }

    // İade kodu üret
    const returnCode = generateReturnCode();

    const { error: insertError } = await supabase.from('return_requests').insert({
      order_id: orderId,
      user_id: userId,
      return_code: returnCode,
      status: 'pending',
    });

    if (insertError) {
      return NextResponse.json({ error: 'İade talebi oluşturulamadı' }, { status: 500 });
    }

    // Kullanıcı bilgilerini al
    const userInfo = Array.isArray(order.users) ? order.users[0] : order.users;
    const customerName = userInfo ? `${userInfo.first_name} ${userInfo.last_name}`.trim() : 'Değerli Müşterimiz';
    const customerEmail = userInfo?.email;

    // Mail gönder
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && customerEmail) {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: "El's Dream Factory <noreply@elsdreamfactory.com>",
        to: customerEmail,
        subject: 'İade Bilgilendirme ve Güvenli Paketleme Rehberi',
        html: `
          <div style="font-family: Georgia, serif; max-width: 580px; margin: 0 auto; color: #2C2C2C; line-height: 1.7;">
            <h2 style="font-size: 22px; font-weight: normal; margin-bottom: 4px;">İade Talebiniz Hakkında: Yolculuk Hazırlığı Başlasın!</h2>
            <p>Merhaba ${customerName},</p>
            <p>İade talebiniz bize ulaştı. Süreci hızlıca tamamlayabilmeniz için ihtiyacınız olan iade kodunuz aşağıdadır:</p>
            <div style="background: #5C0A1A; color: #fff; padding: 16px 24px; border-radius: 8px; margin: 20px 0; font-size: 20px; letter-spacing: 0.12em; font-weight: bold; text-align: center;">
              ${returnCode}
            </div>
            <p>Bu kodu kargo görevlisine ileterek paketinizi bize ücretsiz olarak karşı ödemeli gönderebilirsiniz.</p>
            <hr style="border: none; border-top: 1px solid #E8E0D8; margin: 24px 0;" />
            <h3 style="font-size: 17px; font-weight: normal; color: #5C0A1A;">Küçük Bir Rica: Onları Güvende Tutalım!</h3>
            <p>Biliyorsunuz ki el emeği seramiklerimiz oldukça hassas. Onların size ulaştığı gibi güvenle geri dönebilmeleri bizim için çok önemli. Taşıma sırasında herhangi bir kırılma yaşanmaması (ve iade sürecinizin aksamaması) için paketleme yaparken şu adımları izlemenizi rica ediyoruz:</p>
            <ul style="padding-left: 20px; color: #444;">
              <li style="margin-bottom: 8px;"><strong>Pıtpıt Naylona Sıkıca Sarın:</strong> Ürünün hiçbir kısmının açıkta kalmadığından emin olun.</li>
              <li style="margin-bottom: 8px;"><strong>Boşlukları Doldurun:</strong> Ürünü kutuya yerleştirdikten sonra sağında, solunda veya üstünde boşluk kalmamalı. Kağıt veya ekstra pıtpıtlarla kutu içindeki hareketi sıfıra indirin. (Kutuyu salladığınızda ses gelmiyorsa başardınız demektir!)</li>
              <li style="margin-bottom: 8px;"><strong>Orijinal Kutu Tercihimiz:</strong> Eğer mümkünse ürünü size gönderdiğimiz orijinal kutusu ve koruyucu materyalleriyle göndermeniz işimizi çok kolaylaştırır.</li>
              <li style="margin-bottom: 8px;"><strong>Kutuyu Mühürleyin:</strong> Kutunun tüm kapaklarını sağlam bir koli bandıyla bantlayarak güvene alın.</li>
            </ul>
            <p style="color: #9B8E85; font-size: 13px; background: #FDF8F5; border-left: 3px solid #DD6B56; padding: 10px 14px; border-radius: 4px;">
              <strong>Önemli Not:</strong> Ürünlerin kargoda hasar görmesi durumunda iade işleminizi maalesef tamamlayamıyoruz. Bu yüzden paketleme konusundaki hassasiyetiniz için şimdiden çok teşekkür ederiz.
            </p>
            <p>Ürününüz bize ulaşıp kontrolleri yapıldıktan sonra iade ödemeniz bankanıza bağlı olarak 2-10 iş günü içerisinde hesabınıza yansıtılacaktır.</p>
            <p>Herhangi bir sorunuz olursa bize her zaman <a href="mailto:elsdreamfactory@gmail.com" style="color: #5C0A1A;">buradan</a> ulaşabilirsiniz.</p>
            <p>Sevgiler,<br /><strong>El's Dream Factory</strong></p>
            <hr style="border: none; border-top: 1px solid #E8E0D8; margin: 24px 0;" />
            <p style="color: #9B8E85; font-size: 12px;">El's Dream Factory — El Yapımı Seramik</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true, returnCode });
  } catch {
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}
