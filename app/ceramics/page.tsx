import { Metadata } from 'next';
import { fetchProducts } from '@/data/ceramicProducts';
import { supabase } from '@/lib/supabase';
import CeramicsClient from './CeramicsClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'El Yapımı Seramik Koleksiyonu | El\'s Dream Factory',
  description: 'El yapımı seramik kupalar, kedi figürleri, dekoratif objeler ve hediye seçenekleri. Benzersiz, sanatsal seramik ürünler keşfedin.',
  keywords: [
    'el yapımı seramik',
    'seramik kupa',
    'seramik kedi figürü',
    'dekoratif seramik',
    'seramik hediye',
    'handmade ceramic',
    'seramik koleksiyon',
    'el yapımı hediye',
  ],
  openGraph: {
    title: 'El Yapımı Seramik Koleksiyonu | El\'s Dream Factory',
    description: 'El yapımı seramik kupalar, kedi figürleri ve dekoratif objeler. Sanatsal hediyeler keşfedin.',
    url: 'https://www.elsdreamfactory.com/ceramics',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.elsdreamfactory.com/ceramics',
  },
};

export default async function CeramicsPage() {
  const [products, categoriesResult] = await Promise.all([
    fetchProducts(),
    supabase.from('categories').select('name').order('sort_order', { ascending: true }),
  ]);

  const definedCategories = (categoriesResult.data ?? []).map((c: { name: string }) => c.name);

  return <CeramicsClient products={products} definedCategories={definedCategories} />;
}
