'use client';

import { CeramicProduct } from '@/types/ceramic';
import { CeramicProductCard } from '@/components/CeramicProductCard';
import { ScrollReveal } from '@/components/ScrollReveal';
import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const clayTypeLabels: Record<string, { tr: string; en: string }> = {
  stoneware:   { tr: 'Stoneware',  en: 'Stoneware' },
  porcelain:   { tr: 'Porselen',   en: 'Porcelain' },
  earthenware: { tr: 'Toprak',     en: 'Earthenware' },
  'bone-china':{ tr: 'Bone China', en: 'Bone China' },
  terracotta:  { tr: 'Terracotta', en: 'Terracotta' },
};

const imageClasses = ['aspect-[4/5]', 'aspect-[3/4]', 'aspect-square', 'aspect-[5/6]', 'aspect-[4/5]'];

interface CeramicsClientProps {
  products: CeramicProduct[];
  definedCategories: string[];
}

export default function CeramicsClient({ products, definedCategories }: CeramicsClientProps) {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedClayType, setSelectedClayType] = useState<string | null>(null);
  const categories = definedCategories;
  const clayTypes = Array.from(new Set(products.map(p => p.clayType))) as CeramicProduct['clayType'][];

  let filteredProducts = products;
  if (selectedCategory) filteredProducts = filteredProducts.filter(p =>
    (p.categories && p.categories.length > 0)
      ? p.categories.includes(selectedCategory)
      : p.category === selectedCategory
  );
  if (selectedClayType) filteredProducts = filteredProducts.filter(p => p.clayType === selectedClayType);

  const hasActiveFilters = selectedCategory || selectedClayType;

  const getClayLabel = (ct: string) =>
    clayTypeLabels[ct]?.[language] ?? ct;

  return (
    <div className="max-w-350 mx-auto px-6 md:px-10 py-12 md:py-20">
      {/* Header */}
      <ScrollReveal>
        <div className="mb-12 md:mb-16">
          <div className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-earth mb-4">
            <Link href="/" className="hover:text-charcoal transition-colors">{t.ceramics.breadcrumb_home}</Link>
            <span>/</span>
            <span className="text-charcoal">{t.ceramics.breadcrumb_collection}</span>
          </div>
          <h1 className="heading-display text-4xl md:text-5xl text-charcoal">{t.ceramics.title}</h1>
        </div>
      </ScrollReveal>

      {/* Mobile/Tablet horizontal category chips */}
      <div className="lg:hidden -mx-6 md:-mx-10 mb-8">
        <div className="flex gap-2 overflow-x-auto px-6 md:px-10 pb-2 scrollbar-hide">
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className={`shrink-0 px-4 min-h-10 rounded-full text-sm tracking-wide transition-colors border ${
              !selectedCategory
                ? 'bg-charcoal text-bone border-charcoal'
                : 'bg-bone text-earth border-warm-gray hover:text-charcoal hover:border-charcoal'
            }`}
          >
            {t.ceramics.all}
          </button>
          {categories.map(cat => (
            <button
              type="button"
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-4 min-h-10 rounded-full text-sm tracking-wide transition-colors border ${
                selectedCategory === cat
                  ? 'bg-charcoal text-bone border-charcoal'
                  : 'bg-bone text-earth border-warm-gray hover:text-charcoal hover:border-charcoal'
              }`}
            >
              {cat}
            </button>
          ))}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => { setSelectedCategory(null); setSelectedClayType(null); }}
              className="shrink-0 px-4 min-h-10 text-sm text-accent hover:text-charcoal transition-colors"
            >
              {t.ceramics.clear_filters}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10 md:gap-14">
        {/* Sidebar Filters - desktop only */}
        <aside className="hidden lg:block lg:sticky lg:top-23 lg:self-start">
          <div className="space-y-8">
            {/* Category */}
            <div>
              <h3 className="text-[11px] tracking-[0.15em] uppercase text-earth mb-4">{t.ceramics.category_label}</h3>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className={`block text-sm transition-colors ${!selectedCategory ? 'text-charcoal font-medium' : 'text-earth hover:text-charcoal'}`}
                >
                  {t.ceramics.all}
                </button>
                {categories.map(cat => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`block text-sm transition-colors ${selectedCategory === cat ? 'text-charcoal font-medium' : 'text-earth hover:text-charcoal'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => { setSelectedCategory(null); setSelectedClayType(null); }}
                className="text-sm text-accent hover:text-charcoal transition-colors"
              >
                {t.ceramics.clear_filters}
              </button>
            )}
          </div>
        </aside>

        {/* Products */}
        <div>
          <p className="text-sm text-earth mb-8">{filteredProducts.length} {t.ceramics.product_count}</p>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {filteredProducts.map((product, i) => (
                <ScrollReveal key={product.id} delay={Math.min(i * 60, 400)} className="h-full">
                  <CeramicProductCard
                    product={product}
                    imageClass="aspect-[3/4]"
                  />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="heading-serif text-xl text-charcoal mb-4">{t.ceramics.no_products}</p>
              <button
                type="button"
                onClick={() => { setSelectedCategory(null); setSelectedClayType(null); }}
                className="text-sm text-accent hover:text-charcoal transition-colors"
              >
                {t.ceramics.clear_filters}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
