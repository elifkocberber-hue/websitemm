import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/userAuth';

// Mevcut oturumu doğrula — client mount'ta çağırır. Kaynak: httpOnly cookie.
export async function GET(request: NextRequest) {
  const user = getSessionUser(request);
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({ user });
}
