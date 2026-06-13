import { NextRequest } from 'next/server';
import crypto from 'crypto';

// Kullanıcı oturumu için imzalı JWT (HS256). Cookie: 'userToken' (httpOnly).
// USER_JWT_SECRET zorunludur — güvensiz fallback YOKTUR (fail-closed).

export interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

function getSecret(): string {
  const secret = process.env.USER_JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error('USER_JWT_SECRET tanımlı değil veya çok kısa (en az 16 karakter olmalı).');
  }
  return secret;
}

function base64url(input: string): string {
  return Buffer.from(input).toString('base64url');
}

function fromBase64url(input: string): string {
  return Buffer.from(input, 'base64url').toString('utf-8');
}

export function signUserJWT(user: SessionUser, expiresInSeconds: number): string {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64url(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
    })
  );
  const signature = crypto
    .createHmac('sha256', getSecret())
    .update(`${header}.${payload}`)
    .digest('base64url');
  return `${header}.${payload}.${signature}`;
}

export function verifyUserJWT(token: string): SessionUser | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, payload, signature] = parts;

    const expected = crypto
      .createHmac('sha256', getSecret())
      .update(`${header}.${payload}`)
      .digest('base64url');

    // Sabit zamanlı karşılaştırma (timing attack önlemi)
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expected);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const data = JSON.parse(fromBase64url(payload));
    if (!data.exp || data.exp < Math.floor(Date.now() / 1000)) return null;
    if (!data.sub) return null;

    return {
      id: data.sub,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    };
  } catch {
    return null;
  }
}

// İstekteki 'userToken' cookie'sinden doğrulanmış kullanıcıyı döndürür.
// Geçersiz/yoksa null. user_id ASLA client'tan (header/param) alınmaz.
export function getSessionUser(request: NextRequest): SessionUser | null {
  const token = request.cookies.get('userToken')?.value;
  if (!token) return null;
  return verifyUserJWT(token);
}
