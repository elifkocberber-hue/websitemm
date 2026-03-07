import { CeramicProduct } from '@/types/ceramic';
import ceramicData from './ceramics.json';

// Yerel veri (fallback)
export const ceramicProducts: CeramicProduct[] = ceramicData as CeramicProduct[];

// Supabase'den ürünleri direkt çek (cache yok, admin güncellemeleri anında yansır)
export async function fetchProducts(): Promise<CeramicProduct[]> {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) return ceramicProducts;

    const client = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await client
      .from('products')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return ceramicProducts;

    return data.map((p: Record<string, unknown>) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      clayType: p.clay_type,
      category: p.category,
      handmade: p.handmade,
      glaze: p.glaze,
      dimensions: (p.dimensions as Record<string, number>) || {},
      weight: p.weight,
      dishwasherSafe: p.dishwasher_safe,
      microwave: p.microwave,
      images: (p.images as string[]) || [],
      featured: p.featured,
    })) as CeramicProduct[];
  } catch {
    return ceramicProducts;
  }
}

export const getCeramicProductById = (id: number | string): CeramicProduct | undefined => {
  return ceramicProducts.find(product => String(product.id) === String(id));
};

// Supabase'den tek ürün çek — HTTP olmadan, doğrudan sorgu
export async function fetchProductById(id: string): Promise<CeramicProduct | undefined> {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) return getCeramicProductById(id);

    const client = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await client
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return getCeramicProductById(id);

    const p = data as Record<string, unknown>;
    return {
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      clayType: p.clay_type,
      category: p.category,
      handmade: p.handmade,
      glaze: p.glaze,
      dimensions: (p.dimensions as Record<string, number>) || {},
      weight: p.weight,
      dishwasherSafe: p.dishwasher_safe,
      microwave: p.microwave,
      images: (p.images as string[]) || [],
      featured: p.featured,
    } as CeramicProduct;
  } catch {
    return getCeramicProductById(id);
  }
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
