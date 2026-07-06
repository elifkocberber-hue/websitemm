import { Metadata } from 'next';
import { fetchProducts } from '@/data/ceramicProducts';
import { supabase } from '@/lib/supabase';
import CeramicsClient from '../../ceramics/CeramicsClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Handmade Ceramic Collection | El's Dream Factory",
  description:
    'Handmade ceramic mugs, cat figurines, decorative objects and gift ideas. Discover unique, artistic Turkish ceramics.',
  keywords: [
    'handmade ceramics',
    'ceramic mug',
    'ceramic cat figurine',
    'decorative ceramics',
    'ceramic gift',
    'Turkish ceramics',
    'ceramic collection',
    'handmade gift',
  ],
  openGraph: {
    title: "Handmade Ceramic Collection | El's Dream Factory",
    description:
      'Handmade ceramic mugs, cat figurines and decorative objects. Discover artistic gifts.',
    url: 'https://www.elsdreamfactory.com/en/ceramics',
    type: 'website',
    locale: 'en_US',
  },
  alternates: {
    canonical: 'https://www.elsdreamfactory.com/en/ceramics',
    languages: {
      tr: 'https://www.elsdreamfactory.com/ceramics',
      en: 'https://www.elsdreamfactory.com/en/ceramics',
      'x-default': 'https://www.elsdreamfactory.com/ceramics',
    },
  },
};

export default async function CeramicsPageEn() {
  const [products, categoriesResult] = await Promise.all([
    fetchProducts(),
    supabase.from('categories').select('name').order('sort_order', { ascending: true }),
  ]);

  const definedCategories = (categoriesResult.data ?? []).map((c: { name: string }) => c.name);

  return <CeramicsClient products={products} definedCategories={definedCategories} />;
}
