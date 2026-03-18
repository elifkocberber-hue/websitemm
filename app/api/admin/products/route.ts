import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/adminAuth';

// GET - Tüm ürünleri getir (public - listing için gerekli)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: 'Ürünler alınamadı' }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}

// POST - Yeni ürün ekle (admin only)
export async function POST(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: body.name,
        description: body.description || '',
        price: body.price || 0,
        stock: body.stock || 0,
        clay_type: body.clayType || 'stoneware',
        category: body.category || '',
        handmade: body.handmade ?? true,
        glaze: body.glaze || '',
        dimensions: body.dimensions || {},
        weight: body.weight || null,
        dishwasher_safe: body.dishwasherSafe ?? false,
        microwave: body.microwave ?? false,
        images: body.images || [],
        featured: body.featured ?? false,
        variations: body.variations ?? null,
        categories: body.categories || [],
        active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Product insert error:', error);
      return NextResponse.json({ error: 'Ürün eklenemedi' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}
