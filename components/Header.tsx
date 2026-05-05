'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CeramicCartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useUser } from '@/context/UserContext';
import { useLanguage } from '@/context/LanguageContext';
import { SearchBar } from '@/components/SearchBar';
import { useState, useEffect, useRef } from 'react';

export const Header: React.FC = () => {
  const { totalItems } = useCart();
  const { totalFavorites } = useFavorites();
  const { user, logout } = useUser();
  const { t, language, setLanguage } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      const progress = Math.min(y / 300, 1);
      setScrollProgress(progress);
    };
    const onResize = () => setWindowWidth(window.innerWidth);
    setWindowWidth(window.innerWidth);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const viewportShift = Math.max(0, Math.min(1, (1200 - windowWidth) / 400));
  const effectiveProgress = Math.max(scrollProgress, viewportShift);

  const logoSize = 144 - effectiveProgress * 96;
  const logoTop = effectiveProgress * 12;

  return (
    <>
      {/* Fixed circular logo */}
      <Link
        ref={logoRef}
        href="/"
        className={`fixed z-60 transition-none${menuOpen ? ' hidden' : ''}`}
        style={{
          left: `calc(50% - ${effectiveProgress * 50}% + ${effectiveProgress * (24 + logoSize / 2)}px)`,
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
            ? 'bg-[#FAF5EE]/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]'
            : 'bg-[#FAF5EE]/60 backdrop-blur-sm'
        }`}
      >
        <nav className="max-w-350 mx-auto px-6 md:px-10 flex items-center justify-between h-18 overflow-visible">
          {/* Left: Search */}
          <div className="hidden md:flex items-center w-36">
            <SearchBar />
          </div>

          {/* Right: Nav + Cart + User + Lang */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="link-line text-[13px] tracking-[0.12em] uppercase text-earth hover:text-charcoal transition-colors"
            >
              {t.nav.home}
            </Link>
            <Link
              href="/ceramics"
              className="link-line text-[13px] tracking-[0.12em] uppercase text-earth hover:text-charcoal transition-colors"
            >
              {t.nav.ceramics}
            </Link>

            {/* Favorites */}
            <Link
              href="/favorites"
              className="relative flex items-center justify-center w-11 h-11 -mr-2"
              aria-label={`${t.nav.favorites}${totalFavorites > 0 ? ` (${totalFavorites})` : ''}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={totalFavorites > 0 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={totalFavorites > 0 ? 'text-accent' : 'text-charcoal'}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {totalFavorites > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-accent text-white text-[10px] font-medium flex items-center justify-center rounded-full">
                  {totalFavorites}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-11 h-11 -mr-2"
              aria-label={`${t.nav.cart}${totalItems > 0 ? ` (${totalItems})` : ''}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-charcoal">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-accent text-white text-[10px] font-medium flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Auth */}
            {user ? (
              <div ref={userMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-earth hover:text-charcoal transition-colors"
                  aria-label={t.nav.user_menu}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span className="text-[13px] tracking-wide max-w-25 truncate">{user.firstName}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-warm-gray overflow-hidden z-100">
                    <div className="px-4 py-3 border-b border-warm-gray">
                      <p className="text-sm font-medium text-charcoal">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-earth truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-3 text-sm text-earth hover:bg-bone hover:text-charcoal transition-colors"
                    >
                      Siparişlerim
                    </Link>
                    <button
                      type="button"
                      onClick={() => { logout(); setUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-3 text-sm text-earth hover:bg-bone hover:text-charcoal transition-colors"
                    >
                      {t.nav.logout}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 text-earth hover:text-charcoal transition-colors"
                aria-label={t.nav.login}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="text-[13px] tracking-[0.12em] uppercase">{t.nav.login}</span>
              </Link>
            )}

            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
              className="text-[12px] tracking-[0.12em] font-medium text-earth hover:text-charcoal transition-colors border border-earth/30 hover:border-charcoal/50 rounded px-2 py-0.5"
              aria-label="Switch language"
            >
              {language === 'tr' ? 'EN' : 'TR'}
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden ml-auto w-8 h-8 flex flex-col justify-center items-center gap-1.5"
            aria-label="Menü"
            aria-expanded={menuOpen}
          >
            <span className={`block w-6 h-[1.5px] bg-charcoal transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[4.5px]' : ''}`} />
            <span className={`block w-6 h-[1.5px] bg-charcoal transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[4.5px]' : ''}`} />
          </button>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden fixed inset-0 top-18 bg-bone z-[70] flex flex-col items-center justify-start gap-5 px-6 pt-8 overflow-y-auto">
            <div className="w-full max-w-xs">
              <SearchBar />
            </div>
            <Link href="/" onClick={() => setMenuOpen(false)} className="heading-serif text-2xl text-charcoal hover:text-accent transition-colors">
              {t.nav.home}
            </Link>
            <Link href="/ceramics" onClick={() => setMenuOpen(false)} className="heading-serif text-2xl text-charcoal hover:text-accent transition-colors">
              {t.nav.ceramics}
            </Link>
            <Link href="/favorites" onClick={() => setMenuOpen(false)} className="heading-serif text-2xl text-charcoal hover:text-accent transition-colors">
              {t.nav.favorites}{totalFavorites > 0 ? ` (${totalFavorites})` : ''}
            </Link>
            <Link href="/cart" onClick={() => setMenuOpen(false)} className="heading-serif text-2xl text-charcoal hover:text-accent transition-colors">
              {t.nav.cart}{totalItems > 0 ? ` (${totalItems})` : ''}
            </Link>
            {user ? (
              <>
                <p className="text-earth text-sm">{t.nav.hello}, {user.firstName}</p>
                <Link href="/orders" onClick={() => setMenuOpen(false)} className="heading-serif text-2xl text-charcoal hover:text-accent transition-colors">
                  Siparişlerim
                </Link>
                <button
                  type="button"
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="heading-serif text-2xl text-earth hover:text-accent transition-colors"
                >
                  {t.nav.logout}
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)} className="heading-serif text-2xl text-charcoal hover:text-accent transition-colors">
                {t.nav.login}
              </Link>
            )}
            {/* Language Switcher - Mobile */}
            <button
              type="button"
              onClick={() => { setLanguage(language === 'tr' ? 'en' : 'tr'); setMenuOpen(false); }}
              className="mt-4 text-sm tracking-widest font-medium text-earth hover:text-charcoal transition-colors border border-earth/30 rounded px-4 py-2"
            >
              {language === 'tr' ? 'English' : 'Türkçe'}
            </button>
          </div>
        )}
      </header>
    </>
  );
};
