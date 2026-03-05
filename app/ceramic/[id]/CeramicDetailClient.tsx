'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CeramicProduct } from '@/types/ceramic';
import { CeramicProductCard } from '@/components/CeramicProductCard';
import { ImageZoom } from '@/components/ImageZoom';
import { useCart } from '@/context/CeramicCartContext';
import { useState } from 'react';

interface CeramicDetailClientProps {
  product: CeramicProduct;
  relatedProducts: CeramicProduct[];
}

const clayTypeLabels: Record<string, string> = {
  stoneware: 'Stoneware',
  porcelain: 'Porselen',
  earthenware: 'Toprak Çanak',
  'bone-china': 'Kemik Porseleni',
  terracotta: 'Terracotta',
};

export default function CeramicDetailClient({ product, relatedProducts }: CeramicDetailClientProps) {
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [zoomedImageIndex, setZoomedImageIndex] = useState<number | null>(null);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setQuantity(1);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="max-w-350 mx-auto px-6 md:px-10 py-12">
      {/* Breadcrumb */}
      <div className="mb-8 text-sm text-earth">
        <Link href="/" className="hover:text-amber-600">Ana Sayfa</Link>
        <span className="mx-2">›</span>
        <Link href="/ceramics" className="hover:text-amber-600">Seramik Ürünleri</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900">{product.name}</span>
      </div>

      {/* Product Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Image Section with Zoom */}
        <div>
          {/* Main Image with Zoom */}
          <div className="mb-4">
            {zoomedImageIndex !== null ? (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div className="relative w-full max-w-4xl bg-white rounded-lg p-6">
                  <button
                    onClick={() => setZoomedImageIndex(null)}
                    className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium z-10"
                  >
                    Kapat ✕
                  </button>
                  <ImageZoom
                    src={product.images[zoomedImageIndex]}
                    alt={`${product.name} - Yakınlaştırma`}
                  />
                </div>
              </div>
            ) : (
              <button
                onClick={() => setZoomedImageIndex(currentImageIndex)}
                className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden group cursor-zoom-in"
              >
                <Image
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                  priority
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                  <div className="bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    Yakınlaştır
                  </div>
                </div>
                {product.handmade && (
                  <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    El Yapımı
                  </div>
                )}
              </button>
            )}
          </div>

          {/* Thumbnail Gallery */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.images.map((image, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                title={`Görüntü ${idx + 1}`}
                className={`relative w-24 h-24 shrink-0 rounded-lg overflow-hidden border-3 transition-all hover:border-amber-400 ${
                  idx === currentImageIndex ? 'border-amber-600 scale-105' : 'border-gray-300'
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} - Görüntü ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-4">
            <span className="inline-block bg-amber-600 text-white px-4 py-1 rounded-full text-sm font-medium mb-2">
              {product.category}
            </span>
            <span className="inline-block ml-2 bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              {clayTypeLabels[product.clayType]}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-3">{product.name}</h1>

          {/* Rating - placeholder */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl font-bold text-amber-600">₺{product.price}</span>
          </div>

          {/* Description */}
          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            {product.description}
          </p>

          {/* Features */}
          <div className="bg-amber-50 rounded-lg p-6 mb-6 border border-amber-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Özellikleri</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-amber-600 font-bold mr-3">✓</span>
                <span className="text-gray-700">
                  <strong>Çamur Tipi:</strong> {clayTypeLabels[product.clayType]}
                </span>
              </li>
              {product.glaze && (
                <li className="flex items-start">
                  <span className="text-amber-600 font-bold mr-3">✓</span>
                  <span className="text-gray-700">
                    <strong>Cilası:</strong> {product.glaze}
                  </span>
                </li>
              )}
              {product.weight && (
                <li className="flex items-start">
                  <span className="text-amber-600 font-bold mr-3">✓</span>
                  <span className="text-gray-700">
                    <strong>Ağırlık:</strong> {product.weight}g
                  </span>
                </li>
              )}
              {product.dimensions && (
                <li className="flex items-start">
                  <span className="text-amber-600 font-bold mr-3">✓</span>
                  <span className="text-gray-700">
                    <strong>Boyutlar:</strong>{' '}
                    {product.dimensions.height && `Y: ${product.dimensions.height}cm `}
                    {product.dimensions.width && `G: ${product.dimensions.width}cm `}
                    {product.dimensions.diameter && `Ç: ${product.dimensions.diameter}cm`}
                  </span>
                </li>
              )}
              {product.dishwasherSafe && (
                <li className="flex items-start">
                  <span className="text-amber-600 font-bold mr-3">✓</span>
                  <span className="text-gray-700">Bulaşık makinesinde güvenli</span>
                </li>
              )}
              {product.microwave && (
                <li className="flex items-start">
                  <span className="text-amber-600 font-bold mr-3">✓</span>
                  <span className="text-gray-700">Mikrodalgada güvenli</span>
                </li>
              )}
              {product.handmade && (
                <li className="flex items-start">
                  <span className="text-amber-600 font-bold mr-3">✓</span>
                  <span className="text-gray-700">El yapımı, benzersiz tasarım</span>
                </li>
              )}
            </ul>
          </div>

          {/* Stock Status */}
          <div className="mb-8">
            {product.stock > 0 ? (
              <p className="text-green-600 font-semibold text-lg">✓ Stokta Var ({product.stock} adet)</p>
            ) : (
              <p className="text-red-600 font-semibold text-lg">✗ Stokta Yok</p>
            )}
          </div>

          {/* Add to Cart */}
          <div className="flex gap-3 mb-8">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-3 hover:bg-gray-100 transition-colors"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setQuantity(Math.min(product.stock, Math.max(1, val)));
                }}
                className="w-16 text-center border-l border-r border-gray-300 py-2 focus:outline-none"
                title="Ürün adedi"
                aria-label="Ürün adedi"
              />
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-4 py-3 hover:bg-gray-100 transition-colors"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 font-bold py-3 px-6 rounded-lg transition-colors text-white ${
                addedToCart
                  ? 'bg-green-600'
                  : product.stock === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              {addedToCart ? '✓ Sepete Eklendi' : 'Sepete Ekle'}
            </button>
          </div>

          {/* Back Link */}
          <Link
            href="/ceramics"
            className="block text-center text-amber-600 hover:text-amber-800 font-medium"
          >
            ← Seramik ürünlerine dön
          </Link>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">İlgili Ürünler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(relatedProduct => (
              <CeramicProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
