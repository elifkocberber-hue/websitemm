import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/adminAuth';

// GET — tüm aktif ürünler + mevcut öne çıkan ID listesi
export async function GET() {
  const [productsRes, settingsRes] = await Promise.all([
    supabase.from('products').select('id, name, price, images').eq('active', true).order('created_at', { ascending: false }),
    supabase.from('homepage_settings').select('featured_product_ids').eq('id', 1).single(),
  ]);

  const products = (productsRes.data ?? []).map((p: Record<string, unknown>) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: Array.isArray(p.images) && (p.images as string[]).length > 0 ? (p.images as string[])[0] : null,
  }));

  const featuredIds: (number | string)[] = settingsRes.data?.featured_product_ids ?? [];

  return NextResponse.json({ products, featuredIds });
}

// PUT — öne çıkan ürün ID'lerini kaydet
export async function PUT(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const featuredIds: (number | string)[] = Array.isArray(body.featuredIds) ? body.featuredIds.slice(0, 4) : [];

  const { error } = await supabase
    .from('homepage_settings')
    .update({ featured_product_ids: featuredIds, updated_at: new Date().toISOString() })
    .eq('id', 1);

  if (error) return NextResponse.json({ error: 'Kaydedilemedi' }, { status: 500 });
  return NextResponse.json({ ok: true });
}
