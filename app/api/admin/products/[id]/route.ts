import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/adminAuth';

// GET - Tek ürün getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}

// PUT - Ürün güncelle (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    const body = await request.json();

    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.stock !== undefined) updateData.stock = body.stock;
    if (body.clayType !== undefined) updateData.clay_type = body.clayType;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.handmade !== undefined) updateData.handmade = body.handmade;
    if (body.glaze !== undefined) updateData.glaze = body.glaze;
    if (body.dimensions !== undefined) updateData.dimensions = body.dimensions;
    if (body.weight !== undefined) updateData.weight = body.weight;
    if (body.dishwasherSafe !== undefined) updateData.dishwasher_safe = body.dishwasherSafe;
    if (body.microwave !== undefined) updateData.microwave = body.microwave;
    if (body.images !== undefined) updateData.images = body.images;
    if (body.featured !== undefined) updateData.featured = body.featured;
    if (body.active !== undefined) updateData.active = body.active;
    if ('variations' in body) updateData.variations = body.variations;
    if ('categories' in body) updateData.categories = body.categories;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Ürün güncellenemedi' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}

// DELETE - Ürün sil (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    
    // Önce ürünün resimlerini al (storage'dan silmek için)
    const { data: product } = await supabase
      .from('products')
      .select('images')
      .eq('id', id)
      .single();

    // Supabase Storage'daki resimleri sil
    if (product?.images?.length) {
      const paths = product.images
        .filter((img: string) => img.includes('supabase'))
        .map((img: string) => {
          const url = new URL(img);
          const pathParts = url.pathname.split('/storage/v1/object/public/product-images/');
          return pathParts[1] || '';
        })
        .filter(Boolean);

      if (paths.length > 0) {
        await supabase.storage.from('product-images').remove(paths);
      }
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: 'Ürün silinemedi' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}
