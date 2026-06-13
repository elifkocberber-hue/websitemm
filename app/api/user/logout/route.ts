import { NextResponse } from 'next/server';

// Oturumu kapat — userToken cookie'sini sil.
export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('userToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
  return response;
}
