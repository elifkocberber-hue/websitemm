import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Edge runtime'da Node 'crypto' yok; HMAC doğrulamasını Web Crypto ile yaparız.
function base64urlToUint8(input: string): Uint8Array {
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/').padEnd(
    input.length + ((4 - (input.length % 4)) % 4),
    '='
  );
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function uint8ToBase64url(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Admin JWT'sini Edge'de doğrula (lib/adminAuth.ts ile aynı şema: HS256).
async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const secret = process.env.ADMIN_JWT_SECRET;
    if (!secret) return false;

    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const [header, payload, signature] = parts;

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const sig = await crypto.subtle.sign(
      'HMAC',
      key,
      new TextEncoder().encode(`${header}.${payload}`)
    );
    const expected = uint8ToBase64url(new Uint8Array(sig));
    if (expected !== signature) return false;

    const data = JSON.parse(new TextDecoder().decode(base64urlToUint8(payload)));
    if (!data.exp || data.exp < Math.floor(Date.now() / 1000)) return false;
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin route koruması — geçerli, imzalı ve süresi dolmamış token gerekir
  if (pathname.startsWith('/admin')) {
    const adminToken = request.cookies.get('adminToken')?.value;
    if (!adminToken || !(await verifyAdminToken(adminToken))) {
      return NextResponse.redirect(new URL('/sergenim/login', request.url));
    }
  }

  const response = NextResponse.next();

  // CORS Headers - API çağrıları için
  if (pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_APP_URL,
      'https://elsdreamfactory.com',
      'http://localhost:3000',
    ].filter(Boolean);

    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }

    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Max-Age', '86400');
  }

  // Security Headers - Tüm sayfalar için
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  // Content Security Policy — Meta Pixel dahil
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://connect.facebook.net",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: https://www.facebook.com",
      "font-src 'self' data:",
      "connect-src 'self' https://sandbox-api.iyzipay.com https://api.iyzipay.com https://zpqtdaoyeokavrkosuii.supabase.co https://graph.facebook.com",
      // 3D Secure: ödeme formu banka/iyzico ACS adresine (https) gönderilebilmeli
      "form-action 'self' https:",
      "frame-ancestors 'none'",
    ].join('; ')
  );

  // HSTS (HTTPS Strict Transport Security)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
