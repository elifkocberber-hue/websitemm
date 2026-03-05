'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CeramicProduct } from '@/types/ceramic';
import { useCart } from '@/context/CeramicCartContext';
import { useState } from 'react';

interface CeramicProductCardProps {
  product: CeramicProduct;
  imageClass?: string;
}

export const CeramicProductCard: React.FC<CeramicProductCardProps> = ({
  product,
  imageClass = 'aspect-[4/5]',
}) => {
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);

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
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="group">
      {/* Image with hover */}
      <Link href={`/ceramic/${product.id}`} aria-label={product.name}>
        <div className={`product-image-hover relative ${imageClass} bg-warm-gray overflow-hidden`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover img-primary"
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
          {product.handmade && (
            <span className="absolute top-4 left-4 bg-charcoal text-bone text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 z-10">
              El Yapımı
            </span>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] tracking-[0.15em] uppercase text-earth">
            {product.category}
          </p>
          <p className="text-[11px] tracking-widest uppercase text-clay">
            {clayTypeLabels[product.clayType]}
          </p>
        </div>

        <Link href={`/ceramic/${product.id}`}>
          <h3 className="heading-serif text-lg text-charcoal group-hover:text-accent transition-colors duration-300">
            {product.name}
          </h3>
        </Link>

        <p className="text-earth text-sm mt-1 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-light text-charcoal">₺{product.price}</span>
          <span className={`text-xs ${product.stock > 0 ? 'text-earth' : 'text-accent'}`}>
            {product.stock > 0 ? `Stok: ${product.stock}` : 'Tükendi'}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full mt-4 py-3.5 text-sm tracking-widest uppercase transition-all duration-300 ${
            addedToCart
              ? 'bg-accent text-bone'
              : product.stock === 0
              ? 'bg-warm-gray text-clay cursor-not-allowed'
              : 'bg-charcoal text-bone hover:bg-accent'
          }`}
        >
          {addedToCart ? 'Sepete Eklendi' : product.stock === 0 ? 'Tükendi' : 'Sepete Ekle'}
        </button>
      </div>
    </div>
  );
};
