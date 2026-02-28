'use client';

import Link from 'next/link';
import { useCart } from '@/context/CeramicCartContext';
import { useState } from 'react';

export const Header: React.FC = () => {
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-amber-600">
          🐱 El's Dream Factory
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          <Link href="/" className="text-gray-600 hover:text-amber-600 font-medium">
            Ana Sayfa
          </Link>
          <Link href="/ceramics" className="text-gray-600 hover:text-amber-600 font-medium">
            🏺 Koleksiyon
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-amber-600 font-medium">
            Hakkında
          </Link>
          <Link
            href="/cart"
            className="relative bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 font-medium"
          >
            Sepet
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded hover:bg-gray-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-50 border-t">
          <div className="px-4 py-4 space-y-3">
            <Link href="/" className="block text-gray-600 hover:text-amber-600 font-medium py-2">
              Ana Sayfa
            </Link>
            <Link href="/ceramics" className="block text-gray-600 hover:text-amber-600 font-medium py-2">
              🏺 Koleksiyon
            </Link>
            <Link href="/about" className="block text-gray-600 hover:text-amber-600 font-medium py-2">
              Hakkında
            </Link>
            <Link
              href="/cart"
              className="block bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 font-medium text-center"
            >
              Sepet ({totalItems})
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
