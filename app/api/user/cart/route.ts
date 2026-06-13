import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';
import { getSessionUser } from '@/lib/userAuth';

// GET /api/user/cart — oturumdaki kullanıcının sepetini getir
export async function GET(request: NextRequest) {
  const session = getSessionUser(request);
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  try {
    const { data, error } = await supabase
      .from('user_carts')
      .select('product_id, quantity')
      .eq('user_id', session.id);

    if (error) {
      console.error('Supabase cart GET error:', error);
      return NextResponse.json({ items: [] });
    }

    return NextResponse.json({ items: data ?? [] });
  } catch (e) {
    console.error('Cart GET error:', e);
    return NextResponse.json({ items: [] });
  }
}

// POST /api/user/cart — oturumdaki kullanıcının sepetini kaydet (tam üzerine yazar)
export async function POST(request: NextRequest) {
  const session = getSessionUser(request);
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  try {
    const { items } = (await request.json()) as {
      items: { product_id: string; quantity: number }[];
    };

    const userId = session.id; // user_id daima oturumdan — client'tan değil

    // Önce kullanıcının mevcut sepetini sil
    const { error: deleteError } = await supabase
      .from('user_carts')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Cart delete error:', deleteError);
      return NextResponse.json({ error: 'Sepet güncellenemedi' }, { status: 500 });
    }

    // Yeni items varsa ekle
    if (Array.isArray(items) && items.length > 0) {
      const rows = items.map((i) => ({
        user_id: userId,
        product_id: i.product_id,
        quantity: i.quantity,
        updated_at: new Date().toISOString(),
      }));

      const { error: insertError } = await supabase.from('user_carts').insert(rows);
      if (insertError) {
        console.error('Cart insert error:', insertError);
        return NextResponse.json({ error: 'Sepet kaydedilemedi' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Cart POST error:', e);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
