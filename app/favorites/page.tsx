import type { Metadata } from 'next';
import { fetchProducts } from '@/data/ceramicProducts';
import { FavoritesClient } from './FavoritesClient';

export const metadata: Metadata = {
  title: 'Favorilerim | El\'s Dream Factory',
  description: 'Favori seramik ürünlerinizi görüntüleyin.',
};

export default async function FavoritesPage() {
  const products = await fetchProducts();

  return (
    <div className="max-w-350 mx-auto px-6 md:px-10 py-12">
      <FavoritesClient products={products} />
    </div>
  );
}
