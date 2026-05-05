'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CeramicProduct } from '@/types/ceramic';
import { useCart } from '@/context/CeramicCartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useState } from 'react';

interface CeramicProductCardProps {
  product: CeramicProduct;
  imageClass?: string;
  objectFit?: 'cover' | 'contain';
}

export const CeramicProductCard: React.FC<CeramicProductCardProps> = ({
  product,
  imageClass = 'aspect-[4/5]',
  objectFit = 'cover',
}) => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorited } = useFavorites();
  const [addedToCart, setAddedToCart] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const favorited = isFavorited(product.id);

  const clayTypeLabels: Record<string, string> = {
    stoneware: 'Stoneware',
    porcelain: 'Porselen',
    earthenware: 'Toprak',
    'bone-china': 'Bone China',
    terracotta: 'Terracotta',
  };

  const handleAddToCart = () => {
    addToCart(product, 1);
    setAddedToCart(true);
    setAnimKey(k => k + 1);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="group flex flex-col h-full">
      {/* Image with hover */}
      <Link href={`/ceramic/${product.id}`} aria-label={product.name}>
        <div className={`product-image-hover relative ${imageClass} bg-warm-gray overflow-hidden`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className={`${objectFit === 'contain' ? 'object-contain' : 'object-cover'} img-primary`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.images.length > 1 && (
            <Image
              src={product.images[1]}
              alt={`${product.name} — detay`}
              fill
              className="object-cover img-secondary"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); toggleFavorite(product.id); }}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white/80 rounded-full backdrop-blur-sm hover:bg-white transition-colors duration-200"
            aria-label={favorited ? 'Favorilerden çıkar' : 'Favorilere ekle'}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill={favorited ? '#DD6B56' : 'none'} stroke={favorited ? '#DD6B56' : 'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="mt-5 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 mb-2">
          <p className="text-[12px] sm:text-[11px] tracking-[0.08em] sm:tracking-[0.15em] uppercase text-earth truncate">
            {product.category}
          </p>
          <p className="text-[12px] sm:text-[11px] tracking-[0.08em] sm:tracking-widest uppercase text-clay truncate">
            {clayTypeLabels[product.clayType]}
          </p>
        </div>

        <Link href={`/ceramic/${product.id}`}>
          <h3 className="heading-serif text-lg text-charcoal group-hover:text-accent transition-colors duration-300 line-clamp-2 min-h-[3.5rem]">
            {product.name}
          </h3>
        </Link>

        <p className="text-earth text-sm mt-1 line-clamp-2 leading-relaxed min-h-[2.5rem]">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4">
          <span className="text-xl font-light text-charcoal">₺{product.price}</span>
          <span className={`text-xs ${product.stock > 0 ? 'text-earth' : 'text-accent'}`}>
            {product.stock > 0 ? `Stok: ${product.stock}` : 'Tükendi'}
          </span>
        </div>

        <button
          key={animKey}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full mt-4 py-3.5 text-sm tracking-widest uppercase transition-colors duration-300 flex items-center justify-center gap-2 active:scale-95 ${
            addedToCart
              ? 'bg-accent text-bone animate-cart-pop'
              : product.stock === 0
              ? 'bg-warm-gray text-clay cursor-not-allowed'
              : 'bg-charcoal text-bone hover:bg-accent'
          }`}
        >
          {addedToCart ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Sepete Eklendi
            </>
          ) : product.stock === 0 ? 'Tükendi' : 'Sepete Ekle'}
        </button>
      </div>
    </div>
  );
};
