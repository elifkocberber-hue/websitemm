import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Public API - Aktif ürünleri getir
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const clayType = searchParams.get('clayType');
    const handmade = searchParams.get('handmade');
    const featured = searchParams.get('featured');
    const id = searchParams.get('id');

    let query = supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (id) {
      const { data: singleProduct, error: singleError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (singleError || !singleProduct) return NextResponse.json(null);
      return NextResponse.json(mapProduct(singleProduct as Record<string, unknown>));
    }

    if (category) query = query.eq('category', category);
    if (clayType) query = query.eq('clay_type', clayType);
    if (handmade === 'true') query = query.eq('handmade', true);
    if (featured === 'true') query = query.eq('featured', true);

    const { data, error } = await query;

    if (error) {
      console.error('Products fetch error:', error);
      return NextResponse.json([]);
    }

    return NextResponse.json((data || []).map(mapProduct));
  } catch {
    return NextResponse.json([]);
  }
}

// Supabase snake_case → camelCase dönüşümü (eski format uyumluluğu)
function mapProduct(p: Record<string, unknown>) {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    stock: p.stock,
    clayType: p.clay_type,
    category: p.category,
    handmade: p.handmade,
    glaze: p.glaze,
    dimensions: p.dimensions || {},
    weight: p.weight,
    dishwasherSafe: p.dishwasher_safe,
    microwave: p.microwave,
    images: p.images || [],
    featured: p.featured,
    variations: p.variations || null,
    categories: p.categories || [],
  };
}
