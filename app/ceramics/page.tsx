'use client';

import { ceramicProducts, getCeramicCategories, getClayTypes } from '@/data/ceramicProducts';
import { CeramicProductCard } from '@/components/CeramicProductCard';
import Link from 'next/link';
import { useState } from 'react';
import { CeramicProduct } from '@/types/ceramic';

export default function CeramicsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedClayType, setSelectedClayType] = useState<string | null>(null);
  const [showHandmadeOnly, setShowHandmadeOnly] = useState(false);

  const categories = getCeramicCategories();
  const clayTypes = getClayTypes();

  const clayTypeLabels: Record<string, string> = {
    stoneware: '🏺 Stoneware',
    porcelain: '✨ Porselen',
    earthenware: '🪨 Toprak Çanak',
    'bone-china': '💎 Kemik Porseleni',
    terracotta: '🌍 Terracotta',
  };

  let filteredProducts = ceramicProducts;

  if (selectedCategory) {
    filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
  }
  if (selectedClayType) {
    filteredProducts = filteredProducts.filter(p => p.clayType === selectedClayType);
  }
  if (showHandmadeOnly) {
    filteredProducts = filteredProducts.filter(p => p.handmade);
  }

  return (
    <div className="py-12">
      {/* Header */}
      <section className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">🏺 Seramik Ürünleri</h1>
        <p className="text-lg text-gray-600 mb-6">
          Geleneksel seramik sanatının en güzel örnekleri. Her ürün benzersiz ve kaliteli malzemelerle yapılmıştır.
        </p>
        <div className="flex gap-2">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Elektronik Ürünlere Dön
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Filtreleme */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-5 sticky top-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-3">Filtreler</h3>

            {/* Handmade Filter */}
            <div className="mb-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showHandmadeOnly}
                  onChange={(e) => setShowHandmadeOnly(e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span className="ml-2 text-gray-700 font-medium">✋ Sadece El Yapımı</span>
              </label>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Kategori</h4>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                    selectedCategory === null
                      ? 'bg-blue-600 text-white font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Tümü
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Clay Type Filter */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Çamur Tipi</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                <button
                  onClick={() => setSelectedClayType(null)}
                  className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                    selectedClayType === null
                      ? 'bg-blue-600 text-white font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Tümü
                </button>
                {clayTypes.map(clayType => (
                  <button
                    key={clayType}
                    onClick={() => setSelectedClayType(clayType)}
                    className={`block w-full text-left px-3 py-2 rounded transition-colors text-sm ${
                      selectedClayType === clayType
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {clayTypeLabels[clayType]}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(selectedCategory || selectedClayType || showHandmadeOnly) && (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedClayType(null);
                  setShowHandmadeOnly(false);
                }}
                className="w-full mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors"
              >
                Filtreleri Temizle
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-700 font-medium">
              {filteredProducts.length} ürün gösteriliyor
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <CeramicProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-xl text-gray-600 mb-4">Seçili filtrelere uygun ürün bulunamadı.</p>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedClayType(null);
                  setShowHandmadeOnly(false);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium transition-colors"
              >
                Filtreleri Sıfırla
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
