import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import ceramicData from '@/data/ceramics.json';

// POST /api/admin/seed — Yerel JSON ürünlerini Supabase'e aktar (bir kez çalıştır)
export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Mevcut ürün sayısını kontrol et
  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  const products = (ceramicData as unknown) as Array<{
    name: string;
    description: string;
    price: number;
    stock: number;
    clayType: string;
    category: string;
    handmade: boolean;
    glaze?: string;
    dimensions?: Record<string, number | undefined>;
    weight?: number;
    dishwasherSafe: boolean;
    microwave: boolean;
    images: string[];
  }>;

  const rows = products.map((p) => ({
    name: p.name,
    description: p.description || '',
    price: p.price,
    stock: p.stock,
    clay_type: p.clayType,
    category: p.category,
    handmade: p.handmade,
    glaze: p.glaze || '',
    dimensions: Object.fromEntries(
      Object.entries(p.dimensions || {}).filter(([, v]) => v !== undefined)
    ) as Record<string, number>,
    weight: p.weight || null,
    dishwasher_safe: p.dishwasherSafe,
    microwave: p.microwave,
    images: p.images,
    featured: false,
    active: true,
  }));

  const { data, error } = await supabase.from('products').insert(rows).select('id, name');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    message: `${data?.length ?? 0} ürün başarıyla Supabase'e aktarıldı.`,
    existingBefore: count,
    inserted: data,
  });
}
