'use client';

import { useCart } from '@/context/CeramicCartContext';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { trackInitiateCheckout } from '@/lib/pixel';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-gray-600">
            <Link href="/" className="text-amber-600 hover:text-amber-800">Ana Sayfa</Link>
            <span className="mx-2">›</span>
            <span>Sepet</span>
          </nav>

          <h1 className="text-3xl font-bold text-gray-900 mb-8">Alışveriş Sepeti</h1>

          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-6">Sepetiniz boş</p>
            <Link
              href="/ceramics"
              className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Seramik Ürünleri Gözat
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-600">
          <Link href="/" className="text-amber-600 hover:text-amber-800">Ana Sayfa</Link>
          <span className="mx-2">›</span>
          <span>Sepet</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Alışveriş Sepeti</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-6 border-b last:border-b-0 flex gap-6 hover:bg-gray-50 transition-colors"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <Link
                      href={`/ceramic/${item.id}`}
                      className="text-lg font-bold text-gray-900 hover:text-amber-600 mb-1 block"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      {item.clayType === 'stoneware' && 'Stoneware'}
                      {item.clayType === 'porcelain' && 'Porselen'}
                      {item.clayType === 'earthenware' && 'Toprak Çanak'}
                      {item.clayType === 'bone-china' && 'Kemik Porseleni'}
                      {item.clayType === 'terracotta' && 'Terracotta'}
                    </p>
                    <p className="text-sm text-gray-700">
                      Birim Fiyat: <span className="font-bold text-amber-600">₺{item.price}</span>
                    </p>
                  </div>

                  {/* Quantity & Remove */}
                  <div className="flex flex-col items-end gap-4">
                    <span className="text-2xl font-bold text-amber-600">₺{(item.price * item.quantity).toFixed(2)}</span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded text-base font-bold transition-colors"
                        aria-label="Adedi azalt"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        inputMode="numeric"
                        min="1"
                        max={item.stock}
                        value={item.quantity}
                        onChange={(e) => {
                          const newQty = parseInt(e.target.value) || 1;
                          updateQuantity(item.id, Math.max(1, Math.min(item.stock, newQty)));
                        }}
                        className="w-14 h-10 text-center text-base border border-gray-300 rounded"
                        title="Ürün adedi"
                      />
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                        className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded text-base font-bold transition-colors"
                        aria-label="Adedi artır"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors"
                    >
                      Kaldır
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link
                href="/ceramics"
                className="inline-block text-amber-600 hover:text-amber-800 font-medium"
              >
                ← Alışverişe Devam Et
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Sipariş Özeti</h2>

              <div className="space-y-4 mb-6 border-b pb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ürünler ({items.length})</span>
                  <span className="font-medium">₺{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kargo</span>
                  <span className="font-medium text-green-600">Ücretsiz</span>
                </div>
              </div>

              <div className="flex justify-between mb-6 text-lg font-bold">
                <span>Toplam</span>
                <span className="text-amber-600">₺{totalPrice.toFixed(2)}</span>
              </div>

              <Link
                href="/payment"
                onClick={() => trackInitiateCheckout(items, totalPrice)}
                className="w-full block text-center bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mb-3"
              >
                Ödemeye Geç
              </Link>

              <button
                onClick={clearCart}
                className="w-full border border-red-300 text-red-600 hover:bg-red-50 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Sepeti Boşalt
              </button>

              <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                <p className="text-sm text-amber-900">
                  Türkiye geneline ücretsiz kargo<br />
                  30 gün iade garantisi
                </p>
              </div>

              <div className="mt-4 flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Image
                  src="/images/payment/logo_band_colored.png"
                  alt="iyzico ile Öde, Mastercard, Visa, American Express ve Troy ile güvenli ödeme"
                  width={520}
                  height={36}
                  className="h-7 w-auto"
                />
                <p className="text-[11px] text-gray-500 text-center">SSL ile güvenli ödeme</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
