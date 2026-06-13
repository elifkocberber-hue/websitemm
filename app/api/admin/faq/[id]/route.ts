import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';
import { isAdminAuthenticated } from '@/lib/adminAuth';

// PUT — cevap + durum güncelle (admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const answer = String(body.answer ?? '').trim();
  const status = body.status === 'published' ? 'published' : 'pending';

  if (status === 'published' && !answer) {
    return NextResponse.json({ error: 'Yayınlamak için cevap zorunludur' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('faqs')
    .update({ answer, status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: 'Güncellenemedi' }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE — soruyu sil (admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const { error } = await supabase
    .from('faqs')
    .delete()
    .eq('id', id);

  if (error) return NextResponse.json({ error: 'Silinemedi' }, { status: 500 });
  return NextResponse.json({ ok: true });
}
