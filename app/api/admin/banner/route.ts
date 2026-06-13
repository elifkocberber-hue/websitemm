import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';
import { isAdminAuthenticated } from '@/lib/adminAuth';

const DEFAULT = {
  items: ['Ceramic', 'Illustration', 'Gift', 'Handmade', 'Unique'],
  campaign_active: false,
  campaign_text: '',
  hero_image: '/images/arkaplan.jpg',
};

// GET - Banner ayarlarını getir (public)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('banner_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error || !data) return NextResponse.json(DEFAULT);
    return NextResponse.json({ ...DEFAULT, ...data });
  } catch {
    return NextResponse.json(DEFAULT);
  }
}

// PUT - Banner ayarlarını güncelle (admin only)
export async function PUT(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const items: string[] = Array.isArray(body.items)
      ? body.items.map((s: unknown) => String(s).trim()).filter(Boolean)
      : [];

    if (items.length === 0) {
      return NextResponse.json({ error: 'En az bir kelime girilmelidir' }, { status: 400 });
    }

    const campaign_active: boolean = Boolean(body.campaign_active);
    const campaign_text: string = String(body.campaign_text ?? '').trim();

    if (campaign_active && !campaign_text) {
      return NextResponse.json({ error: 'Kampanya aktifken metin boş olamaz' }, { status: 400 });
    }

    const hero_image: string = String(body.hero_image ?? DEFAULT.hero_image).trim() || DEFAULT.hero_image;

    const { data, error } = await supabase
      .from('banner_settings')
      .upsert(
        { id: 1, items, campaign_active, campaign_text, hero_image, updated_at: new Date().toISOString() },
        { onConflict: 'id' }
      )
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
