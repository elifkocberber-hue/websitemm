import { CeramicProduct } from '@/types/ceramic';
import ceramicData from './ceramics.json';

// Yerel veri (fallback)
export const ceramicProducts: CeramicProduct[] = ceramicData as CeramicProduct[];

// Supabase'den ürünleri çek (varsa), yoksa yerel veriye düş
export async function fetchProducts(): Promise<CeramicProduct[]> {
  try {
    const baseUrl = typeof window !== 'undefined' 
      ? '' 
      : (process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    const res = await fetch(`${baseUrl}/api/products`, { 
      next: { revalidate: 60 }, // 60 saniye cache
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data as CeramicProduct[];
    }
  } catch {
    // Supabase erişilemezse yerel veriye düş
  }
  return ceramicProducts;
}

export const getCeramicProductById = (id: number | string): CeramicProduct | undefined => {
  return ceramicProducts.find(product => String(product.id) === String(id));
};

// Supabase'den tek ürün çek — cache yok, her zaman taze veri
export async function fetchProductById(id: string): Promise<CeramicProduct | undefined> {
  try {
    const baseUrl = typeof window !== 'undefined'
      ? ''
      : (process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'));
    const res = await fetch(`${baseUrl}/api/products?id=${encodeURIComponent(id)}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (data) return data as CeramicProduct;
    }
  } catch {
    // Supabase erişilemezse yerel veriye düş
  }
  return getCeramicProductById(id);
}

export const getCeramicProductsByCategory = (category: string): CeramicProduct[] => {
  return ceramicProducts.filter(product => product.category === category);
};

export const getCeramicProductsByClayType = (clayType: CeramicProduct['clayType']): CeramicProduct[] => {
  return ceramicProducts.filter(product => product.clayType === clayType);
};

export const getHandmadeCeramics = (): CeramicProduct[] => {
  return ceramicProducts.filter(product => product.handmade);
};

export const getCeramicCategories = (): string[] => {
  return Array.from(new Set(ceramicProducts.map(product => product.category)));
};

export const getClayTypes = (): CeramicProduct['clayType'][] => {
  return Array.from(new Set(ceramicProducts.map(product => product.clayType))) as CeramicProduct['clayType'][];
};
