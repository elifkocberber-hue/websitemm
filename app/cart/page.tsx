'use client';

import { useCart } from '@/context/CeramicCartContext';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { trackInitiateCheckout } from '@/lib/pixel';
import { useLanguage } from '@/context/LanguageContext';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { t } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-bone py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-earth">
            <Link href="/" className="text-accent hover:text-charcoal transition-colors">{t.cart.breadcrumb_home}</Link>
            <span className="mx-2">›</span>
            <span>{t.cart.breadcrumb_cart}</span>
          </nav>

          <h1 className="heading-display text-3xl md:text-4xl text-charcoal mb-8">{t.cart.title}</h1>

          <div className="text-center py-12">
            <p className="text-xl text-earth mb-6">{t.cart.empty}</p>
            <Link
              href="/ceramics"
              className="inline-block bg-charcoal hover:bg-accent text-bone py-3.5 px-8 text-sm tracking-wider uppercase rounded-lg transition-colors duration-300"
            >
              {t.cart.browse_products}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bone py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-earth">
          <Link href="/" className="text-accent hover:text-charcoal transition-colors">{t.cart.breadcrumb_home}</Link>
          <span className="mx-2">›</span>
          <span>{t.cart.breadcrumb_cart}</span>
        </nav>

        <h1 className="heading-display text-3xl md:text-4xl text-charcoal mb-8">{t.cart.title}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-warm-gray overflow-hidden">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-6 border-b border-warm-gray last:border-b-0 flex gap-6 hover:bg-bone/50 transition-colors"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-warm-gray rounded-lg shrink-0 overflow-hidden">
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
                      className="heading-serif text-lg text-charcoal hover:text-accent transition-colors mb-1 block"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs tracking-[0.12em] uppercase text-earth mb-2">{item.category}</p>
                    <p className="text-sm text-clay mb-3">
                      {item.clayType === 'stoneware' && t.materials.stoneware}
                      {item.clayType === 'porcelain' && t.materials.porcelain}
                      {item.clayType === 'earthenware' && t.materials.earthenware}
                      {item.clayType === 'bone-china' && t.materials['bone-china']}
                      {item.clayType === 'terracotta' && t.materials.terracotta}
                    </p>
                    <p className="text-sm text-earth">
                      {t.cart.unit_price} <span className="font-medium text-charcoal">₺{item.price}</span>
                    </p>
                  </div>

                  {/* Quantity & Remove */}
                  <div className="flex flex-col items-end gap-4">
                    <span className="text-xl font-light text-charcoal">₺{(item.price * item.quantity).toFixed(2)}</span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center bg-warm-gray hover:bg-clay/30 text-charcoal rounded text-base font-bold transition-colors"
                        aria-label={t.cart.decrease_qty}
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
                        className="w-14 h-10 text-center text-base bg-white border border-warm-gray text-charcoal rounded focus:outline-none focus:border-charcoal transition-colors"
                        title={t.cart.quantity_title}
                      />
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                        className="w-10 h-10 flex items-center justify-center bg-warm-gray hover:bg-clay/30 text-charcoal rounded text-base font-bold transition-colors"
                        aria-label={t.cart.increase_qty}
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-earth hover:text-red-600 text-sm transition-colors"
                    >
                      {t.cart.remove}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link
                href="/ceramics"
                className="link-line inline-block text-sm tracking-wider uppercase text-earth hover:text-charcoal transition-colors"
              >
                {t.cart.continue_shopping}
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-warm-gray p-6 sticky top-24">
              <h2 className="heading-serif text-xl text-charcoal mb-6">{t.cart.order_summary}</h2>

              <div className="space-y-4 mb-6 border-b border-warm-gray pb-6">
                <div className="flex justify-between">
                  <span className="text-earth">{t.cart.products} ({items.length})</span>
                  <span className="font-medium text-charcoal">₺{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-earth">{t.cart.shipping}</span>
                  <span className="font-medium text-emerald-700">{t.cart.free}</span>
                </div>
              </div>

              <div className="flex justify-between mb-6 text-lg">
                <span className="font-medium text-charcoal">{t.cart.total}</span>
                <span className="heading-serif text-charcoal">₺{totalPrice.toFixed(2)}</span>
              </div>

              <Link
                href="/payment"
                onClick={() => trackInitiateCheckout(items, totalPrice)}
                className="w-full block text-center bg-charcoal hover:bg-accent text-bone py-3.5 px-4 text-sm tracking-wider uppercase rounded-lg transition-colors duration-300 mb-3"
              >
                {t.cart.checkout}
              </Link>

              <button
                type="button"
                onClick={clearCart}
                className="w-full border border-warm-gray text-earth hover:border-red-300 hover:text-red-600 py-2 px-4 text-sm rounded-lg transition-colors"
              >
                {t.cart.clear_cart}
              </button>

              <div className="mt-6 p-4 bg-warm-gray/40 rounded-lg">
                <p className="text-sm text-earth leading-relaxed">
                  {t.cart.free_shipping_note}<br />
                  {t.cart.return_guarantee}
                </p>
              </div>

              <div className="mt-4 flex flex-col items-center gap-2 p-3 bg-bone rounded-lg">
                <Image
                  src="/images/payment/logo_band_colored.png"
                  alt="iyzico ile Öde, Mastercard, Visa, American Express ve Troy ile güvenli ödeme"
                  width={520}
                  height={36}
                  className="h-7 w-auto"
                />
                <p className="text-[11px] text-earth text-center">{t.cart.ssl_note}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
