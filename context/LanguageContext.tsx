'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LanguageType, tr, en } from '@/lib/translations';

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: typeof tr;
}

const defaultValue: LanguageContextType = {
  language: 'tr',
  setLanguage: () => {},
  t: tr,
};

const LanguageContext = createContext<LanguageContextType>(defaultValue);

// Bir yolu diğer dilin eşdeğerine çevirir. Yalnız /en/ SEO sayfaları için ön ek
// eklenir/çıkarılır (home, ceramics, about, ceramic/[id]). Diğer sayfalarda yol
// aynı kalır — orada dil localStorage ile yönetilir.
export function localizedPath(pathname: string, target: LanguageType): string {
  const isEnPath = pathname === '/en' || pathname.startsWith('/en/');
  if (target === 'en') {
    if (isEnPath) return pathname;
    return pathname === '/' ? '/en' : `/en${pathname}`;
  }
  // target === 'tr'
  if (!isEnPath) return pathname;
  const stripped = pathname.replace(/^\/en/, '');
  return stripped === '' ? '/' : stripped;
}

export const LanguageProvider: React.FC<{
  children: React.ReactNode;
  // /en segment layout'u bunu 'en' verir → o alt ağaç (Header/Footer/içerik) daima
  // İngilizce, pathname'e bakılmaksızın. Kök layout vermez (localStorage davranışı).
  forcedLanguage?: LanguageType;
}> = ({ children, forcedLanguage }) => {
  const router = useRouter();
  const pathname = usePathname();

  // URL /en veya /en/* ise dil 'en'e kilitlidir (SEO tutarlılığı). forcedLanguage
  // verilmişse (EN segment layout) o kesin olarak kullanılır.
  const urlLocked = forcedLanguage === 'en' || pathname === '/en' || pathname.startsWith('/en/');
  const [stored, setStored] = useState<LanguageType>('tr');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as LanguageType | null;
    if (savedLanguage === 'tr' || savedLanguage === 'en') {
      setStored(savedLanguage);
    }
  }, []);

  const language: LanguageType = urlLocked ? 'en' : stored;

  const setLanguage = (lang: LanguageType) => {
    // Tercihi her durumda kaydet (kullanıcı index'lenmeyen sayfaya geçince korunsun).
    try { localStorage.setItem('language', lang); } catch { /* ignore */ }
    const nextPath = localizedPath(pathname, lang);
    if (nextPath !== pathname) {
      // /en SEO sayfası ↔ TR eşi arasında yol değişimi gerekiyor.
      router.push(nextPath);
    } else {
      setStored(lang);
    }
  };

  const translations = language === 'tr' ? tr : en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
