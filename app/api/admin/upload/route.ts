import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';
import { isAdminAuthenticated } from '@/lib/adminAuth';

const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const ALLOWED_TYPES = [...IMAGE_TYPES, ...VIDEO_TYPES];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;   // 5 MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB

// Magic-byte (dosya imzası) kontrolü — sahte MIME ile yükleme önlemi.
// Beyan edilen file.type'a güvenmek yerine içeriği doğrular.
function sniffMatchesType(bytes: Uint8Array, declaredType: string): boolean {
  const b = bytes;
  const ascii = (start: number, str: string) =>
    str.split('').every((c, i) => b[start + i] === c.charCodeAt(0));

  switch (declaredType) {
    case 'image/jpeg':
    case 'image/jpg':
      return b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
    case 'image/png':
      return b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47;
    case 'image/webp':
      return ascii(0, 'RIFF') && ascii(8, 'WEBP');
    case 'video/mp4':
    case 'video/quicktime':
      // ISO Base Media: 4-7 baytta 'ftyp'
      return ascii(4, 'ftyp');
    case 'video/webm':
      // EBML başlığı
      return b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3;
    default:
      return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Desteklenen formatlar: JPEG, PNG, WebP, MP4, WebM, MOV' },
        { status: 400 }
      );
    }

    const isVideo = VIDEO_TYPES.includes(file.type);
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: isVideo ? 'Video 100MB\'dan küçük olmalıdır' : 'Resim 5MB\'dan küçük olmalıdır' },
        { status: 400 }
      );
    }

    const ext = file.name.split('.').pop() || (isVideo ? 'mp4' : 'jpg');
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = `products/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // İçerik imzası beyan edilen tiple uyuşmuyorsa reddet
    if (!sniffMatchesType(buffer, file.type)) {
      return NextResponse.json(
        { error: 'Dosya içeriği beyan edilen formatla uyuşmuyor' },
        { status: 400 }
      );
    }

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: 'Yüklenemedi: ' + uploadError.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return NextResponse.json({ url: urlData.publicUrl, path: filePath });
  } catch {
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}
