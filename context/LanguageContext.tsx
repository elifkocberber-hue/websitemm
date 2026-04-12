'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
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

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageType>('tr');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as LanguageType | null;
    if (savedLanguage === 'tr' || savedLanguage === 'en') {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: LanguageType) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const translations = language === 'tr' ? tr : en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
