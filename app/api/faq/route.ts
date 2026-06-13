import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';

// GET — yayınlanmış SSS'leri getir (public)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('faqs')
      .select('id, question, answer')
      .eq('status', 'published')
      .order('created_at', { ascending: true });

    if (error) return NextResponse.json([], { status: 200 });
    return NextResponse.json(data ?? [], {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json([]);
  }
}

// POST — yeni soru gönder (public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const question = String(body.question ?? '').trim();

    if (!question || question.length < 5) {
      return NextResponse.json({ error: 'Soru en az 5 karakter olmalıdır' }, { status: 400 });
    }
    if (question.length > 500) {
      return NextResponse.json({ error: 'Soru 500 karakterden uzun olamaz' }, { status: 400 });
    }

    const { error } = await supabase
      .from('faqs')
      .insert({ question, status: 'pending' });

    if (error) return NextResponse.json({ error: 'Gönderilemedi' }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}
