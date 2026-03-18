import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const SUPABASE_HOSTNAME = 'zpqtdaoyeokavrkosuii.supabase.co';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const videoUrl = searchParams.get('url');

  if (!videoUrl) {
    return new NextResponse('Missing url', { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(videoUrl);
  } catch {
    return new NextResponse('Invalid URL', { status: 400 });
  }

  if (parsed.hostname !== SUPABASE_HOSTNAME) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const fetchHeaders: HeadersInit = {};
  const range = request.headers.get('range');
  if (range) fetchHeaders['Range'] = range;

  try {
    const upstream = await fetch(videoUrl, { headers: fetchHeaders });

    const contentType = /\.webm$/i.test(parsed.pathname) ? 'video/webm' : 'video/mp4';

    const resHeaders = new Headers({
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=86400',
    });

    const cr = upstream.headers.get('content-range');
    const cl = upstream.headers.get('content-length');
    if (cr) resHeaders.set('Content-Range', cr);
    if (cl) resHeaders.set('Content-Length', cl);

    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: resHeaders,
    });
  } catch {
    return new NextResponse('Upstream error', { status: 502 });
  }
}
