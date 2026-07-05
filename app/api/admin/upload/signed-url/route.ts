import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';
import { isAdminAuthenticated } from '@/lib/adminAuth';

const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const ALLOWED_TYPES = [...IMAGE_TYPES, ...VIDEO_TYPES];

// Uzantı, kullanıcı dosya adından değil doğrulanmış MIME tipinden türetilir
// (dosya adıyla .html/.svg gibi uzantı veya '/' ile yol enjeksiyonu önlenir).
const EXT_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
};

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { contentType } = await request.json();

  if (!ALLOWED_TYPES.includes(contentType)) {
    return NextResponse.json(
      { error: 'Desteklenen formatlar: JPEG, PNG, WebP, MP4, WebM, MOV' },
      { status: 400 }
    );
  }

  const ext = EXT_BY_TYPE[contentType] || (VIDEO_TYPES.includes(contentType) ? 'mp4' : 'jpg');
  const path = `products/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

  const { data, error } = await supabase.storage
    .from('product-images')
    .createSignedUploadUrl(path);

  if (error || !data) {
    return NextResponse.json({ error: error?.message || 'URL oluşturulamadı' }, { status: 500 });
  }

  const { data: urlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(path);

  return NextResponse.json({
    signedUrl: data.signedUrl,
    token: data.token,
    publicUrl: urlData.publicUrl,
  });
}
