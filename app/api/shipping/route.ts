import { NextResponse } from 'next/server';
import { getShippingData } from '@/lib/shipping';

// Public: kargo ücretleri + ücretsiz kargo eşiği (checkout ve sepet gösterimi için).
// Kargo fiyatları kamusal bilgi; yazma işlemleri yalnız admin API'sinde.
export async function GET() {
  const data = await getShippingData();
  return NextResponse.json(data);
}
