'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CeramicProduct } from '@/types/ceramic';
import { CeramicProductCard } from '@/components/CeramicProductCard';
import { useCart } from '@/context/CeramicCartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useState, useRef, useEffect } from 'react';
import { trackViewContent } from '@/lib/pixel';

interface CeramicDetailClientProps {
  product: CeramicProduct;
  relatedProducts: CeramicProduct[];
}

export default function CeramicDetailClient({ product, relatedProducts }: CeramicDetailClientProps) {
  const { addToCart } = useCart();
  const { t } = useLanguage();

  useEffect(() => {
    trackViewContent(product);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [selectedVariation, setSelectedVariation] = useState<number | null>(
    product.variations ? 0 : null
  );
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const availableStock =
    product.variations && selectedVariation !== null
      ? product.variations.options[selectedVariation].stock
      : product.stock;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setQuantity(1);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="max-w-350 mx-auto px-6 md:px-10 py-12">
      {/* Breadcrumb */}
      <div className="mb-8 text-xs sm:text-sm text-earth flex flex-wrap items-center gap-x-1 gap-y-1">
        <Link href="/" className="hover:text-amber-600">{t.product.breadcrumb_home}</Link>
        <span>›</span>
        <Link href="/ceramics" className="hover:text-amber-600">{t.product.breadcrumb_collection}</Link>
        <span>›</span>
        <span className="text-gray-900 truncate max-w-[60vw] sm:max-w-none">{product.name}</span>
      </div>

      {/* Product Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Image Section */}
        <div>
          <div className="mb-4">
            <div
              ref={imageContainerRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative w-full h-[360px] sm:h-[440px] md:h-[520px] bg-gray-100 rounded-lg overflow-hidden cursor-zoom-in"
            >
              {product.images.length > 0 ? (
                /\.(mp4|webm|mov)$/i.test(product.images[currentImageIndex]) ? (
                  <video
                    src={`/api/video?url=${encodeURIComponent(product.images[currentImageIndex])}`}
                    className="w-full h-full object-cover"
                    controls
                    playsInline
                  />
                ) : (
                  <div
                    className={`image-zoom-inner${isHovered ? ' is-hovered' : ''}`}
                    style={{ '--zoom-x': `${mousePos.x}%`, '--zoom-y': `${mousePos.y}%` } as React.CSSProperties}
                  >
                    <Image
                      src={product.images[currentImageIndex]}
                      alt={product.name}
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-sm">{t.product.no_image}</span>
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail Gallery */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.images.map((image, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                title={`${t.product.image_thumb} ${idx + 1}`}
                className={`relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all hover:border-accent ${
                  idx === currentImageIndex ? 'border-charcoal scale-105' : 'border-gray-300'
                }`}
              >
                {/\.(mp4|webm|mov)$/i.test(image) ? (
                  <>
                    <video src={`/api/video?url=${encodeURIComponent(image)}`} className="w-full h-full object-cover" muted playsInline />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <span className="text-white text-xl">▶</span>
                    </div>
                  </>
                ) : (
                  <Image
                    src={image}
                    alt={`${product.name} - ${t.product.image_thumb} ${idx + 1}`}
                    fill
                    className="object-contain"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-4 flex flex-wrap gap-2">
            {(product.categories && product.categories.length > 0
              ? product.categories
              : product.category ? [product.category] : []
            ).map(cat => (
              <span key={cat} className="inline-block bg-charcoal text-bone px-4 py-1 rounded-full text-sm font-medium">
                {cat}
              </span>
            ))}
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-3">{product.name}</h1>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl font-bold text-charcoal">₺{product.price}</span>
          </div>

          <p className="text-gray-700 text-lg mb-6 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>

          {/* Variations */}
          {product.variations && product.variations.options.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">{product.variations.typeName}</h3>
              <div className="flex flex-wrap gap-2">
                {product.variations.options.map((opt, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => { setSelectedVariation(i); setQuantity(1); }}
                    disabled={opt.stock === 0}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                      selectedVariation === i
                        ? 'border-charcoal bg-charcoal text-bone'
                        : opt.stock === 0
                        ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed line-through'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-accent'
                    }`}
                  >
                    {opt.name}
                    {opt.stock === 0 && ` (${t.product.sold_out})`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          <div className="bg-[#5C0A1A]/8 rounded-lg p-6 mb-6 border border-[#5C0A1A]/20">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{t.product.features_title}</h3>
            <ul className="space-y-3">
              {product.dishwasherSafe && (
                <li className="flex items-start">
                  <span className="text-charcoal font-bold mr-3"></span>
                  <span className="text-gray-700">{t.product.dishwasher_safe}</span>
                </li>
              )}
              {product.microwave && (
                <li className="flex items-start">
                  <span className="text-charcoal font-bold mr-3"></span>
                  <span className="text-gray-700">{t.product.microwave_safe}</span>
                </li>
              )}
              {product.handmade && (
                <li className="flex items-start">
                  <span className="text-charcoal font-bold mr-3"></span>
                  <span className="text-gray-700">{t.product.handmade_unique}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Stock Status */}
          <div className="mb-8">
            {availableStock > 0 ? (
              <p className="text-green-600 font-semibold text-lg">{t.product.in_stock} ({availableStock})</p>
            ) : (
              <p className="text-red-600 font-semibold text-lg">{t.product.out_of_stock}</p>
            )}
          </div>

          {/* Add to Cart */}
          <div className="flex gap-3 mb-8">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-3 hover:bg-gray-100 transition-colors"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                max={availableStock}
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setQuantity(Math.min(availableStock, Math.max(1, val)));
                }}
                className="w-16 text-center border-l border-r border-gray-300 py-2 focus:outline-none"
                title={t.product.quantity_label}
                aria-label={t.product.quantity_label}
              />
              <button
                type="button"
                onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                className="px-4 py-3 hover:bg-gray-100 transition-colors"
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={availableStock === 0}
              className={`flex-1 font-bold py-3 px-6 rounded-lg transition-colors text-bone ${
                addedToCart
                  ? 'bg-green-600'
                  : availableStock === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-charcoal hover:bg-accent'
              }`}
            >
              {addedToCart ? `${t.product.added_to_cart}` : t.product.add_to_cart}
            </button>
          </div>

          {/* Back Link */}
          <Link
            href="/ceramics"
            className="block text-center text-charcoal hover:text-accent font-medium transition-colors"
          >
            ← {t.product.back_to_products}
          </Link>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t.product.related_title}</h2>
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
