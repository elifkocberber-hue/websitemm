'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CeramicProduct } from '@/types/ceramic';
import { CeramicProductCard } from '@/components/CeramicProductCard';
import { useCart } from '@/context/CeramicCartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useState, useRef, useEffect } from 'react';
import { trackViewContent } from '@/lib/pixel';
import { renderDescriptionHtml } from '@/lib/format';

interface CeramicDetailClientProps {
  product: CeramicProduct;
  relatedProducts: CeramicProduct[];
}

export default function CeramicDetailClient({ product, relatedProducts }: CeramicDetailClientProps) {
  const { addToCart } = useCart();
  const { t, language } = useLanguage();

  // EN modunda İngilizce ad/açıklama gösterilir; boşsa Türkçe'ye düşülür.
  const displayName =
    language === 'en' && product.nameEn?.trim() ? product.nameEn : product.name;
  const activeDescription =
    language === 'en' && product.descriptionEn?.trim()
      ? product.descriptionEn
      : product.description;

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
        <Link href="/" className="hover:text-charcoal transition-colors">{t.product.breadcrumb_home}</Link>
        <span>›</span>
        <Link href="/ceramics" className="hover:text-charcoal transition-colors">{t.product.breadcrumb_collection}</Link>
        <span>›</span>
        <span className="text-charcoal truncate max-w-[60vw] sm:max-w-none">{displayName}</span>
      </div>

      {/* Product Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Image Section */}
        <div>
          <div className="mb-4">
            {product.images.length > 0 && /\.(mp4|webm|mov)$/i.test(product.images[currentImageIndex]) ? (
              // Video: kendi en-boy oranını korur (kırpılmaz). Kare kutuya sığdırmak
              // yerine max yükseklikli esnek konteynerde object-contain ile gösterilir.
              <div className="relative w-full bg-charcoal rounded-lg overflow-hidden flex items-center justify-center max-h-130">
                <video
                  key={product.images[currentImageIndex]}
                  src={`/api/video?url=${encodeURIComponent(product.images[currentImageIndex])}`}
                  className="w-full max-h-130 object-contain"
                  controls
                  playsInline
                />
              </div>
            ) : (
              <div
                ref={imageContainerRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative w-full aspect-square bg-warm-gray/50 rounded-lg overflow-hidden cursor-zoom-in"
              >
                {product.images.length > 0 ? (
                  <div
                    className={`image-zoom-inner${isHovered ? ' is-hovered' : ''}`}
                    style={{ '--zoom-x': `${mousePos.x}%`, '--zoom-y': `${mousePos.y}%` } as React.CSSProperties}
                  >
                    <Image
                      src={product.images[currentImageIndex]}
                      alt={`${displayName} — ${language === 'en' ? `handmade ${product.category} ceramic` : `el yapımı ${product.category} seramik`}`}
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-clay">
                    <span className="text-sm">{t.product.no_image}</span>
                  </div>
                )}
              </div>
            )}
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
                  idx === currentImageIndex ? 'border-charcoal scale-105' : 'border-warm-gray'
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
                    alt={`${displayName} - ${t.product.image_thumb} ${idx + 1}`}
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

          <h1 className="heading-display text-4xl text-charcoal mb-3">{displayName}</h1>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl font-light text-charcoal">₺{product.price}</span>
          </div>

          <div
            className="product-description text-earth text-lg mb-6 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderDescriptionHtml(activeDescription) }}
          />

          {/* Variations */}
          {product.variations && product.variations.options.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-charcoal mb-2">{product.variations.typeName}</h3>
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
                        ? 'border-warm-gray bg-warm-gray/40 text-clay cursor-not-allowed line-through'
                        : 'border-warm-gray bg-white text-charcoal hover:border-accent'
                    }`}
                  >
                    {opt.name}
                    {opt.stock === 0 && ` (${t.product.sold_out})`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Features — hiç özellik seçilmediyse kutu tamamen gizlenir */}
          {(product.dishwasherSafe || product.microwave || product.handmade) && (
            <div className="bg-[#5C0A1A]/8 rounded-lg p-6 mb-6 border border-[#5C0A1A]/20">
              <h3 className="heading-serif text-lg text-charcoal mb-4">{t.product.features_title}</h3>
              <ul className="space-y-3">
                {product.dishwasherSafe && (
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-accent shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                    <span className="text-charcoal/80">{t.product.dishwasher_safe}</span>
                  </li>
                )}
                {product.microwave && (
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-accent shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                    <span className="text-charcoal/80">{t.product.microwave_safe}</span>
                  </li>
                )}
                {product.handmade && (
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-accent shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                    <span className="text-charcoal/80">{t.product.handmade_unique}</span>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Stock Status — 1'den fazla stokta sayı gösterme; son 1'de vurgula; yoksa tükendi */}
          <div className="mb-8">
            {availableStock === 0 ? (
              <p className="text-accent font-medium text-lg">{t.product.out_of_stock}</p>
            ) : availableStock === 1 ? (
              <p className="text-accent font-medium text-lg">{t.product.last_one}</p>
            ) : (
              <p className="text-charcoal font-medium text-lg">{t.product.in_stock}</p>
            )}
          </div>

          {/* Add to Cart */}
          <div className="flex gap-3 mb-8">
            <div className="flex items-center border border-warm-gray rounded-lg">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-3 text-charcoal hover:bg-warm-gray/50 transition-colors"
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
                className="w-16 text-center border-l border-r border-warm-gray py-2 text-charcoal focus:outline-none"
                title={t.product.quantity_label}
                aria-label={t.product.quantity_label}
              />
              <button
                type="button"
                onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                className="px-4 py-3 text-charcoal hover:bg-warm-gray/50 transition-colors"
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={availableStock === 0}
              className={`flex-1 py-3 px-6 rounded-lg text-sm tracking-wider uppercase transition-colors text-bone ${
                addedToCart
                  ? 'bg-accent animate-cart-pop'
                  : availableStock === 0
                  ? 'bg-warm-gray text-clay cursor-not-allowed'
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
          <h2 className="heading-display text-3xl text-charcoal mb-8">{t.product.related_title}</h2>
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
