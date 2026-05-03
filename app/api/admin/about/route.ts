import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/adminAuth';

const DEFAULT = {
  hero_image: 'https://images.unsplash.com/photo-1604424321003-50b9174b28e3?w=1920&q=80',
  story_image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80',
  craft_image: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=800&q=80',
  founded: 'Kuruluş · 1994',
  story_title: 'Topraktan\nDünyaya',
  story_p1: 'Üç kuşaklık seramik geleneğini taşıyan atölyemiz, 1994 yılında kuruldu. Babamızın başlattığı bu yolculuk, bugün aynı tutku ve titizlikle devam etmektedir.',
  story_p2: 'Her ürünümüz, el yapımı teknikleri ve ustalarımızın birikimi ile özenle şekillendirilir. Geleneksel topraklar ve modern tasarımlar bir araya gelerek çağdaş bir koleksiyon oluşturmuştur.',
  story_p3: 'Biz sadece ürün satmıyoruz — sanat ve kültüre saygı içinde yaratılan, hayatın her anını güzelleştiren eserler sunuyoruz.',
  stat1_value: '30+',
  stat1_label: 'Yıl Deneyim',
  stat2_value: '400+',
  stat2_label: 'Benzersiz Tasarım',
  stat3_value: '%98',
  stat3_label: 'Müşteri Memnuniyeti',
  stat4_value: '3',
  stat4_label: 'Kuşak Gelenek',
  val1_title: 'Geleneksel Zanaat',
  val1_desc: 'Yüzyıllık seramik tekniklerini modern formlarla harmanlıyoruz.',
  val2_title: 'El Yapımı Kalite',
  val2_desc: 'Her parça, ustalarımızın deneyimli elleri tarafından tek tek şekillendirilir.',
  val3_title: 'Doğal Malzeme',
  val3_desc: 'En kaliteli topraklar ve organik cilalarla çevre dostu üretim yapıyoruz.',
  val4_title: 'Sürdürülebilirlik',
  val4_desc: 'Doğaya saygılı üretim süreçleriyle geleceğe yatırım yapıyoruz.',
};

// GET - Hikayemiz ayarlarını getir (public)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('about_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error || !data) return NextResponse.json(DEFAULT);
    return NextResponse.json({ ...DEFAULT, ...data });
  } catch {
    return NextResponse.json(DEFAULT);
  }
}

// PUT - Hikayemiz ayarlarını güncelle (admin only)
export async function PUT(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const str = (key: string, fallback: string) =>
      String(body[key] ?? fallback).trim() || fallback;

    const payload = {
      id: 1,
      hero_image: str('hero_image', DEFAULT.hero_image),
      story_image: str('story_image', DEFAULT.story_image),
      craft_image: str('craft_image', DEFAULT.craft_image),
      founded: str('founded', DEFAULT.founded),
      story_title: str('story_title', DEFAULT.story_title),
      story_p1: str('story_p1', DEFAULT.story_p1),
      story_p2: str('story_p2', DEFAULT.story_p2),
      story_p3: str('story_p3', DEFAULT.story_p3),
      stat1_value: str('stat1_value', DEFAULT.stat1_value),
      stat1_label: str('stat1_label', DEFAULT.stat1_label),
      stat2_value: str('stat2_value', DEFAULT.stat2_value),
      stat2_label: str('stat2_label', DEFAULT.stat2_label),
      stat3_value: str('stat3_value', DEFAULT.stat3_value),
      stat3_label: str('stat3_label', DEFAULT.stat3_label),
      stat4_value: str('stat4_value', DEFAULT.stat4_value),
      stat4_label: str('stat4_label', DEFAULT.stat4_label),
      val1_title: str('val1_title', DEFAULT.val1_title),
      val1_desc: str('val1_desc', DEFAULT.val1_desc),
      val2_title: str('val2_title', DEFAULT.val2_title),
      val2_desc: str('val2_desc', DEFAULT.val2_desc),
      val3_title: str('val3_title', DEFAULT.val3_title),
      val3_desc: str('val3_desc', DEFAULT.val3_desc),
      val4_title: str('val4_title', DEFAULT.val4_title),
      val4_desc: str('val4_desc', DEFAULT.val4_desc),
      text_colors: typeof body.text_colors === 'object' && body.text_colors !== null ? body.text_colors : {},
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('about_settings')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Kaydedilemedi' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}
