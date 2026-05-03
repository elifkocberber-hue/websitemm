import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/adminAuth';

const DEFAULT = {
  hero_subtitle: 'El Yapımı Seramik Ürünler & Hediyeler',
  hero_title: 'Fırından Yeni Çıkan\nMutluluklar',
  hero_desc: 'Doğanın toprağından, ustalarımızın elleriyle şekillenen; evinize anlam ve güzellik katan eserler.',
  collection_label: 'Koleksiyon',
  featured_title: 'Öne Çıkan Eserler',
  philosophy_label: 'Felsefemiz',
  philosophy_title: 'Wabi-Sabi',
  philosophy_desc: 'Kusursuzlukta güzellik aramıyoruz. Her çatlak, her doku, her asimetri — tabiatın ve insan elinin imzası.',
  pillar1_title: 'Geleneksel Zanaat',
  pillar1_desc: 'Yüzyıllık teknikleri modern formlarla buluşturuyoruz.',
  pillar2_title: 'Doğal Malzeme',
  pillar2_desc: 'En kaliteli topraklar ve organik cilalarla üretiyoruz.',
  pillar3_title: 'Benzersiz Tasarım',
  pillar3_desc: 'Her parça tek ve tekrarlanamaz bir sanat eseridir.',
  cta_image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=1920&q=80',
  cta_overlay_opacity: 60,
  cta_title: 'Evinize Sanat Katın',
  cta_btn: 'Alışverişe Başla',
  newsletter_title: 'Haberdar Olun',
  newsletter_desc: 'Yeni koleksiyonlar, özel teklifler ve atölyeden haberler.',
};

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('homepage_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error || !data) return NextResponse.json(DEFAULT);
    return NextResponse.json({ ...DEFAULT, ...data });
  } catch {
    return NextResponse.json(DEFAULT);
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const s = (key: string, fallback: string) =>
      String(body[key] ?? fallback).trim() || fallback;

    const payload = {
      id: 1,
      hero_subtitle: s('hero_subtitle', DEFAULT.hero_subtitle),
      hero_title: s('hero_title', DEFAULT.hero_title),
      hero_desc: s('hero_desc', DEFAULT.hero_desc),
      collection_label: s('collection_label', DEFAULT.collection_label),
      featured_title: s('featured_title', DEFAULT.featured_title),
      philosophy_label: s('philosophy_label', DEFAULT.philosophy_label),
      philosophy_title: s('philosophy_title', DEFAULT.philosophy_title),
      philosophy_desc: s('philosophy_desc', DEFAULT.philosophy_desc),
      pillar1_title: s('pillar1_title', DEFAULT.pillar1_title),
      pillar1_desc: s('pillar1_desc', DEFAULT.pillar1_desc),
      pillar2_title: s('pillar2_title', DEFAULT.pillar2_title),
      pillar2_desc: s('pillar2_desc', DEFAULT.pillar2_desc),
      pillar3_title: s('pillar3_title', DEFAULT.pillar3_title),
      pillar3_desc: s('pillar3_desc', DEFAULT.pillar3_desc),
      cta_image: s('cta_image', DEFAULT.cta_image),
      cta_overlay_opacity: Math.min(100, Math.max(0, parseInt(String(body.cta_overlay_opacity ?? DEFAULT.cta_overlay_opacity), 10) || DEFAULT.cta_overlay_opacity)),
      cta_title: s('cta_title', DEFAULT.cta_title),
      cta_btn: s('cta_btn', DEFAULT.cta_btn),
      newsletter_title: s('newsletter_title', DEFAULT.newsletter_title),
      newsletter_desc: s('newsletter_desc', DEFAULT.newsletter_desc),
      text_colors: typeof body.text_colors === 'object' && body.text_colors !== null ? body.text_colors : {},
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('homepage_settings')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) return NextResponse.json({ error: 'Kaydedilemedi' }, { status: 500 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}
