import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/adminAuth';

// SSRF önlemi: yalnızca bu hostlardan görsel çekilebilir.
const ALLOWED_HOSTS = new Set<string>([
  'images.unsplash.com',
  'zpqtdaoyeokavrkosuii.supabase.co',
]);

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = request.nextUrl.searchParams.get('url');
  if (!url) {
    return NextResponse.json({ error: 'url parametresi gerekli' }, { status: 400 });
  }

  let fetchUrl: string;

  if (url.startsWith('/')) {
    // Aynı-origin göreli yol (// ile başlayan protocol-relative URL'leri reddet)
    if (url.startsWith('//')) {
      return NextResponse.json({ error: 'Geçersiz URL' }, { status: 400 });
    }
    const host = request.headers.get('host') ?? 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    fetchUrl = `${protocol}://${host}${url}`;
  } else {
    // Mutlak URL — yalnız https ve allowlist'teki host'lara izin ver
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return NextResponse.json({ error: 'Geçersiz URL' }, { status: 400 });
    }
    if (parsed.protocol !== 'https:' || !ALLOWED_HOSTS.has(parsed.hostname)) {
      return NextResponse.json({ error: 'Bu kaynağa izin verilmiyor' }, { status: 403 });
    }
    fetchUrl = parsed.toString();
  }

  let response: Response;
  try {
    response = await fetch(fetchUrl, { cache: 'no-store', redirect: 'error' });
  } catch {
    return NextResponse.json({ error: 'Görsel alınamadı' }, { status: 502 });
  }
  if (!response.ok) {
    return NextResponse.json({ error: 'Görsel alınamadı' }, { status: 502 });
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.startsWith('image/')) {
    return NextResponse.json({ error: 'Yalnızca görsel çekilebilir' }, { status: 415 });
  }

  const buffer = await response.arrayBuffer();
  if (buffer.byteLength > MAX_BYTES) {
    return NextResponse.json({ error: 'Görsel çok büyük' }, { status: 413 });
  }
  const base64 = Buffer.from(buffer).toString('base64');

  return NextResponse.json({ dataUrl: `data:${contentType};base64,${base64}` });
}
