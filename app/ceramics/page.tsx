import { Metadata } from 'next';
import { fetchProducts } from '@/data/ceramicProducts';
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
    url: 'https://elsdreamfactory.com/ceramics',
    type: 'website',
  },
  alternates: {
    canonical: 'https://elsdreamfactory.com/ceramics',
  },
};

export default async function CeramicsPage() {
  const products = await fetchProducts();

  return <CeramicsClient products={products} />;
}
