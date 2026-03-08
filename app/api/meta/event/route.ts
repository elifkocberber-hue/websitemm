import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { eventName, eventData, eventId, sourceUrl } = await request.json() as {
      eventName: string;
      eventData: Record<string, unknown>;
      eventId: string;
      sourceUrl?: string;
    };

    const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
    const accessToken = process.env.META_CAPI_ACCESS_TOKEN;

    // Token yoksa sessizce geç (geliştirme ortamı için)
    if (!pixelId || !accessToken) {
      return NextResponse.json({ skipped: true });
    }

    const clientIp = (request.headers.get('x-forwarded-for') ?? '')
      .split(',')[0]
      .trim();

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          event_source_url: sourceUrl ?? '',
          action_source: 'website',
          user_data: {
            client_ip_address: clientIp,
            client_user_agent: request.headers.get('user-agent') ?? '',
          },
          custom_data: eventData,
        },
      ],
    };

    const res = await fetch(
      `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      console.error('Meta CAPI error:', data);
      return NextResponse.json({ error: data }, { status: 502 });
    }

    return NextResponse.json({ success: true, events_received: data.events_received });
  } catch (e) {
    console.error('Meta CAPI route error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
