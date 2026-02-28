'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CeramicProduct } from '@/types/ceramic';
import { useCart } from '@/context/CeramicCartContext';
import { useState } from 'react';

interface CeramicProductCardProps {
  product: CeramicProduct;
}

export const CeramicProductCard: React.FC<CeramicProductCardProps> = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setQuantity(1);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const clayTypeLabels: Record<string, string> = {
    stoneware: '🏺 Stoneware',
    porcelain: '✨ Porselen',
    earthenware: '🪨 Toprak Çanak',
    'bone-china': '💎 Kemik Porseleni',
    terracotta: '🌍 Terracotta',
  };

  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
      {/* Image Gallery */}
      <div className="relative w-full h-64 bg-gray-100 group">
        <Image
          src={product.images[currentImageIndex]}
          alt={product.name}
          fill
          className="object-cover"
          priority
        />
        
        {product.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ←
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              →
            </button>
            
            {/* Image indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {product.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Handmade Badge */}
        {product.handmade && (
          <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            ✋ El Yapımı
          </div>
        )}
      </div>

      <div className="p-4">
        <Link href={`/ceramic/${product.id}`}>
          <h3 className="text-lg font-bold text-gray-900 hover:text-amber-600 mb-1">
            {product.name}
          </h3>
        </Link>

        {/* Clay Type */}
        <p className="text-sm mb-2 text-gray-600 font-medium">
          {clayTypeLabels[product.clayType]}
        </p>

        {/* Category */}
        <p className="text-xs mb-3 text-gray-500 bg-gray-100 inline-block px-2 py-1 rounded">
          {product.category}
        </p>

        {/* Description */}
        <p className="text-gray-700 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.dishwasherSafe && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              🍽️ Bulaşık Makinesinde
            </span>
          )}
          {product.microwave && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              🔥 Mikrodalga
            </span>
          )}
        </div>

        {/* Price & Stock */}
        <div className="flex justify-between items-center mb-4 border-t pt-3">
          <span className="text-2xl font-bold text-amber-600">₺{product.price}</span>
          <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock > 0 ? `${product.stock} Stok` : 'Stok Yok'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-2">
          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
            className="w-16 px-2 py-2 border border-gray-300 rounded text-center text-sm"
          />
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`flex-1 font-bold py-2 px-4 rounded transition-colors text-white ${
              addedToCart
                ? 'bg-green-600'
                : product.stock === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            {addedToCart ? '✓ Eklendi' : '💳 Sepete Ekle'}
          </button>
        </div>
        
        <Link
          href={`/ceramic/${product.id}`}
          className="w-full text-center text-amber-600 hover:text-amber-800 font-medium text-sm block py-2"
        >
          Detayları Gör →
        </Link>
      </div>
    </div>
  );
};
