'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CeramicCartContext';
import { useUser } from '@/context/UserContext';
import { SearchBar } from '@/components/SearchBar';
import { useState, useEffect, useRef } from 'react';

export const Header: React.FC = () => {
  const { totalItems } = useCart();
  const { user, logout } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      // 0 → 1 arası: 0px'den 300px'e kadar scroll progress
      const progress = Math.min(y / 300, 1);
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close user menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Logo boyutu: 144px → 48px (küçülme)
  const logoSize = 144 - scrollProgress * 96;
  // Logo pozisyonu: ortadan (left 50%) → sola (left 40px)
  const logoLeft = `calc(50% - ${scrollProgress * (50)}vw + ${scrollProgress * 40}px + ${scrollProgress * logoSize / 2}px)`;
  const logoTop = scrollProgress * 12; // biraz aşağı kayar header içine oturması için

  return (
    <>
      {/* Fixed circular logo - animates from center to left on scroll */}
      <Link
        ref={logoRef}
        href="/"
        className="fixed z-[60] transition-none"
        style={{
          left: `calc(50% - ${scrollProgress * 50}% + ${scrollProgress * (24 + logoSize / 2)}px)`,
          top: `${logoTop}px`,
          transform: 'translateX(-50%)',
        }}
      >
        <Image
          src="/images/logo.png"
          alt="El's Dream Factory"
          width={144}
          height={144}
          className="rounded-full object-cover"
          style={{
            width: `${logoSize}px`,
            height: `${logoSize}px`,
            transition: 'none',
          }}
          priority
        />
      </Link>

      <header
        className={`sticky top-0 z-50 transition-all duration-500 overflow-visible ${
          scrolled
            ? 'bg-[#F7F3EE]/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]'
            : 'bg-[#F7F3EE]/60 backdrop-blur-sm'
        }`}
      >
        <nav className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-between h-[72px] overflow-visible">
          {/* Left: Search */}
          <div className="hidden md:flex items-center w-36">
            <SearchBar />
          </div>

        {/* Right: Nav + Cart + User */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="link-line text-[13px] tracking-[0.12em] uppercase text-earth hover:text-charcoal transition-colors"
          >
            Anasayfa
          </Link>
          <Link
            href="/ceramics"
            className="link-line text-[13px] tracking-[0.12em] uppercase text-earth hover:text-charcoal transition-colors"
          >
            Koleksiyon
          </Link>
          <Link
            href="/about"
            className="link-line text-[13px] tracking-[0.12em] uppercase text-earth hover:text-charcoal transition-colors"
          >
            Hakkımızda
          </Link>

          <Link
            href="/cart"
            className="relative flex items-center gap-2"
            aria-label={`Sepet${totalItems > 0 ? ` (${totalItems} ürün)` : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-charcoal">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 w-5 h-5 bg-accent text-white text-[10px] font-medium flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </Link>

          {/* User Auth */}
          {user ? (
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 text-earth hover:text-charcoal transition-colors"
                aria-label="Kullanıcı menüsü"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="text-[13px] tracking-wide max-w-[100px] truncate">{user.firstName}</span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-warm-gray overflow-hidden z-[100]">
                  <div className="px-4 py-3 border-b border-warm-gray">
                    <p className="text-sm font-medium text-charcoal">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-earth truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => { logout(); setUserMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 text-sm text-earth hover:bg-bone hover:text-charcoal transition-colors"
                  >
                    Çıkış Yap
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 text-earth hover:text-charcoal transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="text-[13px] tracking-[0.12em] uppercase">Giriş</span>
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-8 h-8 flex flex-col justify-center items-center gap-1.5"
          aria-label="Menü"
          aria-expanded={menuOpen}
        >
          <span className={`block w-6 h-[1.5px] bg-charcoal transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[4.5px]' : ''}`} />
          <span className={`block w-6 h-[1.5px] bg-charcoal transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[4.5px]' : ''}`} />
        </button>
      </nav>

      {/* Mobile Menu — Full-screen overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] bg-bone z-40 flex flex-col items-center justify-center gap-8 px-6">
          {/* Mobile Search */}
          <div className="w-full max-w-sm">
            <SearchBar />
          </div>
          <Link href="/" onClick={() => setMenuOpen(false)} className="heading-serif text-3xl text-charcoal hover:text-accent transition-colors">
            Ana Sayfa
          </Link>
          <Link href="/ceramics" onClick={() => setMenuOpen(false)} className="heading-serif text-3xl text-charcoal hover:text-accent transition-colors">
            Koleksiyon
          </Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} className="heading-serif text-3xl text-charcoal hover:text-accent transition-colors">
            Hakkımızda
          </Link>
          <Link href="/cart" onClick={() => setMenuOpen(false)} className="heading-serif text-3xl text-charcoal hover:text-accent transition-colors">
            Sepet{totalItems > 0 ? ` (${totalItems})` : ''}
          </Link>
          {user ? (
            <>
              <p className="text-earth text-sm">Merhaba, {user.firstName}</p>
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="heading-serif text-2xl text-earth hover:text-accent transition-colors"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)} className="heading-serif text-3xl text-charcoal hover:text-accent transition-colors">
              Giriş Yap
            </Link>
          )}
        </div>
      )}
      </header>
    </>
  );
};
