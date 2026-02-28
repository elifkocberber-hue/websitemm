'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { ProductList } from '@/components';

export default function ProductPage() {
  const params = useParams();
  const productId = parseInt(params.id as string);
  const product = products.find((p) => p.id === productId);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Ürün Bulunamadı</h1>
        <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
          Ana sayfaya dön
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const relatedProducts = products.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  return (
    <div className="py-12">
      {/* Breadcrumb */}
      <div className="mb-8 text-sm text-gray-600">
        <Link href="/" className="hover:text-blue-600">Ana Sayfa</Link>
        <span className="mx-2">›</span>
        <Link href="/#products" className="hover:text-blue-600">Ürünler</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900">{product.name}</span>
      </div>

      {/* Product Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div>
          <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-4">
            <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {product.category}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl font-bold text-blue-600">₺{product.price}</span>
            <div className="flex items-center">
              <span className="text-yellow-400">★ ★ ★ ★ ★</span>
              <span className="ml-2 text-gray-600">(127 Değerlendirme)</span>
            </div>
          </div>

          <p className="text-gray-700 text-lg mb-6">{product.description}</p>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Özellikler</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Yüksek kaliteli yapı</li>
              <li>✓ Uzun ömürlü tasarım</li>
              <li>✓ Ücretsiz kargo</li>
              <li>✓ 1 yıl garanti</li>
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
          <div className="flex gap-4 mb-8">
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 px-4 py-3 border border-gray-300 rounded-lg text-center text-lg"
            />
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              {addedToCart ? '✓ Sepete Eklendi' : 'Sepete Ekle'}
            </button>
          </div>

          {/* Share Product */}
          <div className="border-t pt-8">
            <p className="text-gray-600 mb-4">Sosyal Medyada Paylaş:</p>
            <div className="flex gap-4">
              <button className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">
                f
              </button>
              <button className="bg-blue-400 text-white p-3 rounded-lg hover:bg-blue-500">
                𝕏
              </button>
              <button className="bg-pink-600 text-white p-3 rounded-lg hover:bg-pink-700">
                📷
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <ProductList products={relatedProducts} title="İlgili Ürünler" />
      )}
    </div>
  );
}
