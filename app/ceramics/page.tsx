'use client';

import { ceramicProducts, getCeramicCategories, getClayTypes } from '@/data/ceramicProducts';
import { CeramicProduct } from '@/types/ceramic';
import { CeramicProductCard } from '@/components/CeramicProductCard';
import { ScrollReveal } from '@/components/ScrollReveal';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function CeramicsPage() {
  const [products, setProducts] = useState<CeramicProduct[]>(ceramicProducts);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedClayType, setSelectedClayType] = useState<string | null>(null);
  const [showHandmadeOnly, setShowHandmadeOnly] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setProducts(data);
      })
      .catch(() => {});
  }, []);

  const categories = Array.from(new Set(products.map(p => p.category)));
  const clayTypes = Array.from(new Set(products.map(p => p.clayType))) as CeramicProduct['clayType'][];

  const clayTypeLabels: Record<string, string> = {
    stoneware: 'Stoneware',
    porcelain: 'Porselen',
    earthenware: 'Toprak',
    'bone-china': 'Bone China',
    terracotta: 'Terracotta',
  };

  let filteredProducts = products;
  if (selectedCategory) filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
  if (selectedClayType) filteredProducts = filteredProducts.filter(p => p.clayType === selectedClayType);
  if (showHandmadeOnly) filteredProducts = filteredProducts.filter(p => p.handmade);

  const hasActiveFilters = selectedCategory || selectedClayType || showHandmadeOnly;

  const imageClasses = ['aspect-[4/5]', 'aspect-[3/4]', 'aspect-square', 'aspect-[5/6]', 'aspect-[4/5]'];

  return (
    <div className="max-w-350 mx-auto px-6 md:px-10 py-12 md:py-20">
      {/* Header */}
      <ScrollReveal>
        <div className="mb-12 md:mb-16">
          <div className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-earth mb-4">
            <Link href="/" className="hover:text-charcoal transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-charcoal">Koleksiyon</span>
          </div>
          <h1 className="heading-display text-4xl md:text-5xl text-charcoal">Koleksiyon</h1>
          <p className="text-earth mt-4 max-w-xl leading-relaxed">
            Geleneksel seramik sanatının en güzel örnekleri — her biri benzersiz ve el yapımı.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10 md:gap-14">
        {/* Sidebar Filters */}
        <aside className="lg:sticky lg:top-23 lg:self-start">
          <div className="space-y-8">
            {/* Handmade toggle */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={showHandmadeOnly}
                onChange={(e) => setShowHandmadeOnly(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${
                showHandmadeOnly ? 'bg-charcoal border-charcoal' : 'border-clay group-hover:border-charcoal'
              }`}>
                {showHandmadeOnly && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-charcoal">Sadece El Yapımı</span>
            </label>

            {/* Category */}
            <div>
              <h3 className="text-[11px] tracking-[0.15em] uppercase text-earth mb-4">Kategori</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`block text-sm transition-colors ${!selectedCategory ? 'text-charcoal font-medium' : 'text-earth hover:text-charcoal'}`}
                >
                  Tümü
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`block text-sm transition-colors ${selectedCategory === cat ? 'text-charcoal font-medium' : 'text-earth hover:text-charcoal'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Clay Type */}
            <div>
              <h3 className="text-[11px] tracking-[0.15em] uppercase text-earth mb-4">Malzeme</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedClayType(null)}
                  className={`block text-sm transition-colors ${!selectedClayType ? 'text-charcoal font-medium' : 'text-earth hover:text-charcoal'}`}
                >
                  Tümü
                </button>
                {clayTypes.map(ct => (
                  <button
                    key={ct}
                    onClick={() => setSelectedClayType(ct)}
                    className={`block text-sm transition-colors ${selectedClayType === ct ? 'text-charcoal font-medium' : 'text-earth hover:text-charcoal'}`}
                  >
                    {clayTypeLabels[ct]}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={() => { setSelectedCategory(null); setSelectedClayType(null); setShowHandmadeOnly(false); }}
                className="text-sm text-accent hover:text-charcoal transition-colors"
              >
                Filtreleri Temizle
              </button>
            )}
          </div>
        </aside>

        {/* Products — masonry via CSS columns */}
        <div>
          <p className="text-sm text-earth mb-8">{filteredProducts.length} ürün</p>

          {filteredProducts.length > 0 ? (
            <div className="columns-1 md:columns-2 gap-x-8">
              {filteredProducts.map((product, i) => (
                <div key={product.id} className="mb-8 break-inside-avoid">
                  <ScrollReveal delay={Math.min(i * 60, 400)}>
                    <CeramicProductCard
                      product={product}
                      imageClass={imageClasses[i % imageClasses.length]}
                    />
                  </ScrollReveal>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="heading-serif text-xl text-charcoal mb-4">Ürün bulunamadı</p>
              <button
                onClick={() => { setSelectedCategory(null); setSelectedClayType(null); setShowHandmadeOnly(false); }}
                className="text-sm text-accent hover:text-charcoal transition-colors"
              >
                Filtreleri Temizle
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
