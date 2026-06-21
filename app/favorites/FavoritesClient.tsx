'use client';

import Link from 'next/link';
import { useFavorites } from '@/context/FavoritesContext';
import { useLanguage } from '@/context/LanguageContext';
import { CeramicProduct } from '@/types/ceramic';
import { CeramicProductCard } from '@/components/CeramicProductCard';

export const FavoritesClient: React.FC<{ products: CeramicProduct[] }> = ({ products }) => {
  const { favoriteIds } = useFavorites();
  const { t } = useLanguage();
  const favProducts = products.filter(p =>
    favoriteIds.some(id => String(id) === String(p.id))
  );

  return (
    <>
      <h1 className="heading-serif text-4xl text-charcoal mb-10">{t.favorites.title}</h1>
      {favProducts.length === 0 ? (
        <div className="text-center py-24">
          <svg className="mx-auto mb-6 text-warm-gray" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <p className="text-earth text-lg mb-6">{t.favorites.empty}</p>
          <Link
            href="/ceramics"
            className="inline-block bg-charcoal text-bone px-8 py-3 text-sm tracking-widest uppercase hover:bg-accent transition-colors duration-300"
          >
            {t.favorites.browse}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {favProducts.map(p => (
            <CeramicProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  );
};
