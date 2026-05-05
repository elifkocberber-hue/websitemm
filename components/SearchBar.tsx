'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CeramicProduct } from '@/types/ceramic';
import { ceramicProducts } from '@/data/ceramicProducts';
import Image from 'next/image';

interface SearchResult {
  id: number | string;
  name: string;
  category: string;
  price: number;
  image: string;
}

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [products, setProducts] = useState<CeramicProduct[]>(ceramicProducts);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Supabase'den ürünleri çek
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setProducts(data); })
      .catch(() => {});
  }, []);

  // Search logic
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase().trim();
    const filtered = products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.clayType.toLowerCase().includes(q)
      )
      .slice(0, 6)
      .map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        image: p.images[0],
      }));

    setResults(filtered);
    setIsOpen(filtered.length > 0);
  }, [query, products]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setShowInput(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  const handleSelect = (id: number | string) => {
    setIsOpen(false);
    setShowInput(false);
    setQuery('');
    router.push(`/ceramic/${id}`);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Search Icon Button */}
      {!showInput && (
        <button
          onClick={() => setShowInput(true)}
          className="flex items-center gap-2 text-earth hover:text-charcoal transition-colors"
          aria-label="Ara"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="text-[13px] tracking-[0.12em] uppercase hidden lg:inline">Ara</span>
        </button>
      )}

      {/* Search Input */}
      {showInput && (
        <div className="flex items-center gap-2">
          <div className="relative">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-clay"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ürün veya kategori ara..."
              className="w-50 lg:w-65 pl-9 pr-3 py-2 text-sm bg-white border border-warm-gray rounded-full text-charcoal placeholder:text-clay focus:outline-none focus:border-charcoal transition-all"
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setShowInput(false);
                  setQuery('');
                  setIsOpen(false);
                }
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => { setShowInput(false); setQuery(''); setIsOpen(false); }}
            className="flex items-center justify-center w-10 h-10 shrink-0 text-clay hover:text-charcoal transition-colors"
            aria-label="Aramayı kapat"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 mt-2 w-[320px] bg-white rounded-xl shadow-lg border border-warm-gray overflow-hidden z-100">
          {results.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bone transition-colors text-left"
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-warm-gray">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-charcoal truncate">{item.name}</p>
                <p className="text-xs text-earth">{item.category}</p>
              </div>
              <span className="text-sm font-medium text-charcoal whitespace-nowrap">
                ₺{item.price.toFixed(2)}
              </span>
            </button>
          ))}
          {query.trim().length >= 2 && (
            <button
              onClick={() => {
                setIsOpen(false);
                setShowInput(false);
                setQuery('');
                router.push(`/ceramics?search=${encodeURIComponent(query)}`);
              }}
              className="w-full px-4 py-3 text-sm text-center text-accent hover:bg-bone transition-colors border-t border-warm-gray"
            >
              Tüm sonuçları gör →
            </button>
          )}
        </div>
      )}

      {/* No results */}
      {showInput && query.trim().length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 mt-2 w-70 bg-white rounded-xl shadow-lg border border-warm-gray p-4 z-100">
          <p className="text-sm text-earth text-center">Sonuç bulunamadı</p>
        </div>
      )}
    </div>
  );
};
