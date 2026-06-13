import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';
import { isAdminAuthenticated } from '@/lib/adminAuth';

// GET - Tüm kategorileri getir (public - ürün formunda kullanılır)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      return NextResponse.json({ error: 'Kategoriler alınamadı' }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}

// POST - Yeni kategori ekle (admin only)
export async function POST(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'Kategori adı zorunludur' }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from('categories')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .single();

    const nextOrder = existing ? (existing.sort_order as number) + 1 : 1;

    const { data, error } = await supabase
      .from('categories')
      .insert({ name: body.name.trim(), sort_order: nextOrder })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Bu isimde bir kategori zaten var' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Kategori eklenemedi' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}
