import { supabaseAdmin } from '@/lib/supabaseAdmin';

// SUNUCU TARAFI kargo hesabı — /api/payment bunu kullanır; client'ın gönderdiği
// kargo tutarına asla güvenilmez.

export interface ShippingRate {
  code: string;
  name: string;
  cost: number;
  freeOverThreshold: boolean;
}

export interface ShippingData {
  rates: ShippingRate[];
  threshold: number | null; // null = ücretsiz kargo eşiği kapalı
}

export interface ShippingQuote {
  supported: boolean;
  cost: number;        // eşik uygulanmışsa 0
  freeApplied: boolean;
}

// Tüm kargo verisini okur. FAIL-SAFE: tablolar henüz yoksa (migration
// çalıştırılmadıysa) TR'yi 0₺ ile döndürür — canlı site bozulmaz, yurtdışı kapalı.
export async function getShippingData(): Promise<ShippingData> {
  try {
    const [ratesRes, settingsRes] = await Promise.all([
      supabaseAdmin
        .from('shipping_rates')
        .select('country_code, country_name, cost, free_over_threshold')
        .order('country_name', { ascending: true }),
      supabaseAdmin
        .from('shipping_settings')
        .select('free_shipping_threshold')
        .eq('id', 1)
        .maybeSingle(),
    ]);

    if (ratesRes.error) throw ratesRes.error;

    const rates: ShippingRate[] = (ratesRes.data ?? []).map((r) => ({
      code: r.country_code,
      name: r.country_name,
      cost: Number(r.cost),
      freeOverThreshold: Boolean(r.free_over_threshold),
    }));

    // Tablo var ama boşsa da fallback: TR ücretsiz (geçiş dönemi güvenliği)
    if (rates.length === 0) {
      return { rates: [FALLBACK_TR], threshold: null };
    }

    const rawThreshold = settingsRes.data?.free_shipping_threshold;
    const threshold =
      rawThreshold === null || rawThreshold === undefined ? null : Number(rawThreshold);

    return { rates, threshold };
  } catch {
    return { rates: [FALLBACK_TR], threshold: null };
  }
}

const FALLBACK_TR: ShippingRate = {
  code: 'TR',
  name: 'Türkiye',
  cost: 0,
  freeOverThreshold: false,
};

// Ülke + sepet ara toplamına göre kargo teklifi. Ücreti tanımlı olmayan ülke
// desteklenmez (satış engellenir).
export async function getShippingQuote(
  countryCode: string,
  subtotal: number
): Promise<ShippingQuote> {
  const { rates, threshold } = await getShippingData();
  const rate = rates.find((r) => r.code === (countryCode || '').toUpperCase());

  if (!rate) {
    return { supported: false, cost: 0, freeApplied: false };
  }

  const freeApplied =
    threshold !== null && rate.freeOverThreshold && subtotal >= threshold;

  return { supported: true, cost: freeApplied ? 0 : rate.cost, freeApplied };
}
