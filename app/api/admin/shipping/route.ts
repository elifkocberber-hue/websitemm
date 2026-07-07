import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { getShippingData } from '@/lib/shipping';
import { getCountry } from '@/lib/countries';

// GET — kargo ücretleri + eşik (admin panel)
export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const data = await getShippingData();
  return NextResponse.json(data);
}

// PUT — { rate: {countryCode, cost, freeOverThreshold} } upsert
//       VEYA { threshold: number|null } eşik güncelleme
export async function PUT(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    if ('threshold' in body) {
      const raw = body.threshold;
      const threshold =
        raw === null || raw === '' || raw === undefined ? null : Number(raw);
      if (threshold !== null && (!Number.isFinite(threshold) || threshold < 0)) {
        return NextResponse.json({ error: 'Geçersiz eşik tutarı' }, { status: 400 });
      }
      const { error } = await supabase
        .from('shipping_settings')
        .upsert({ id: 1, free_shipping_threshold: threshold });
      if (error) {
        return NextResponse.json({ error: 'Eşik kaydedilemedi' }, { status: 500 });
      }
      return NextResponse.json({ success: true, threshold });
    }

    if ('rate' in body) {
      const { countryCode, cost, freeOverThreshold } = body.rate ?? {};
      const country = getCountry(countryCode);
      if (!country) {
        return NextResponse.json({ error: 'Geçersiz ülke kodu' }, { status: 400 });
      }
      const numCost = Number(cost);
      if (!Number.isFinite(numCost) || numCost < 0) {
        return NextResponse.json({ error: 'Geçersiz kargo ücreti' }, { status: 400 });
      }
      const { error } = await supabase.from('shipping_rates').upsert({
        country_code: country.code,
        country_name: country.tr,
        cost: numCost,
        free_over_threshold: Boolean(freeOverThreshold),
        updated_at: new Date().toISOString(),
      });
      if (error) {
        return NextResponse.json({ error: 'Kargo ücreti kaydedilemedi' }, { status: 500 });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}

// DELETE ?code=DE — ülke kaydını sil (o ülkeye satış kapanır)
export async function DELETE(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const code = (request.nextUrl.searchParams.get('code') || '').toUpperCase();
  if (!code) {
    return NextResponse.json({ error: 'code parametresi gerekli' }, { status: 400 });
  }

  const { error } = await supabase.from('shipping_rates').delete().eq('country_code', code);
  if (error) {
    return NextResponse.json({ error: 'Silinemedi' }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
