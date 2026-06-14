import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';
import { isAdminAuthenticated } from '@/lib/adminAuth';

const DEFAULT_TITLE = 'Teşekkürler!';
const DEFAULT_SUBTITLE = 'Siparişiniz Onaylandı.';
const DEFAULT_BODY = `El's Dream Factory'den yaptığınız alışveriş için teşekkür ederiz. Sipariş detaylarınız e-posta adresinize gönderilmiştir.

Ürünleriniz özenle hazırlanarak 1-3 iş günü içerisinde kargoya verilecektir. Kargonuz yola çıktığında takip bilgilerinizi sizinle paylaşacağız. Seramiklerinizin size güvenle ve en kısa sürede ulaşması için çalışıyoruz.

"Seramiklerinizi yeni evlerinde görmeyi çok isteriz! Bizi @elsdreamfactory etiketleyerek Instagram'da paylaşabilirsiniz."

Keyifli günlerde kullanmanız dileğiyle!`;

// GET — teşekkür metni (public; varsayılanlarla)
export async function GET() {
  try {
    const { data } = await supabase
      .from('thankyou_settings')
      .select('title, subtitle, body')
      .eq('id', 1)
      .single();

    return NextResponse.json({
      title: data?.title || DEFAULT_TITLE,
      subtitle: data?.subtitle ?? DEFAULT_SUBTITLE,
      body: data?.body || DEFAULT_BODY,
    });
  } catch {
    return NextResponse.json({ title: DEFAULT_TITLE, subtitle: DEFAULT_SUBTITLE, body: DEFAULT_BODY });
  }
}

// PUT — teşekkür metnini güncelle (admin)
export async function PUT(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
  }
  try {
    const { title, subtitle, body } = await req.json();
    if (typeof title !== 'string' || typeof body !== 'string') {
      return NextResponse.json({ error: 'Geçersiz veri' }, { status: 400 });
    }
    const { error } = await supabase
      .from('thankyou_settings')
      .upsert({ id: 1, title, subtitle: typeof subtitle === 'string' ? subtitle : '', body, updated_at: new Date().toISOString() });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Kaydetme hatası' }, { status: 500 });
  }
}
