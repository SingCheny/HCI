import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { translations } from './translations';
import type { Locale, TranslationKey } from './translations';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
  toggleLocale: () => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(
    () => (localStorage.getItem('locale') as Locale) || 'en'
  );

  const handleSetLocale = (l: Locale) => {
    setLocale(l);
    localStorage.setItem('locale', l);
  };

  const toggleLocale = () => {
    handleSetLocale(locale === 'en' ? 'zh' : 'en');
  };

  const t = (key: TranslationKey): string => {
    return translations[key]?.[locale] ?? key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale: handleSetLocale, t, toggleLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
