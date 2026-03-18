import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/adminAuth';

// PUT - Kategorilerin sırasını güncelle
// body: { ids: string[] }  (yeni sıraya göre id listesi)
export async function PUT(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ids } = await request.json();
    if (!Array.isArray(ids)) {
      return NextResponse.json({ error: 'ids array gerekli' }, { status: 400 });
    }

    const updates = ids.map((id: string, index: number) =>
      supabase.from('categories').update({ sort_order: index + 1 }).eq('id', id)
    );

    await Promise.all(updates);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}
