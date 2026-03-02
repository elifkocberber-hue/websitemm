import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function parseUserAgent(ua: string) {
  let browser = 'Unknown';
  let os = 'Unknown';
  let device = 'Desktop';

  // Browser detection
  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';

  // OS detection
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac OS')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  // Device detection
  if (ua.includes('Mobile') || ua.includes('Android') || ua.includes('iPhone')) {
    device = 'Mobile';
  } else if (ua.includes('iPad') || ua.includes('Tablet')) {
    device = 'Tablet';
  }

  return { browser, os, device };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page, referrer, screenWidth, screenHeight, language, sessionId } = body;

    const userAgent = request.headers.get('user-agent') || '';
    const { browser, os, device } = parseUserAgent(userAgent);

    // Get country/city from Vercel headers (available on Vercel deployments)
    const country = request.headers.get('x-vercel-ip-country') || 'Unknown';
    const city = request.headers.get('x-vercel-ip-city') || 'Unknown';

    const { error } = await supabase.from('visitors').insert({
      page,
      referrer: referrer || null,
      user_agent: userAgent,
      country,
      city,
      device,
      browser,
      os,
      screen_width: screenWidth || null,
      screen_height: screenHeight || null,
      language: language || null,
      session_id: sessionId || null,
    });

    if (error) {
      console.error('Visitor tracking error:', error);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
