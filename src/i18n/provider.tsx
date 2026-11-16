'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/config';
import { en, type Messages } from '@/i18n/messages/en';
import { createI18n, type I18n } from '@/i18n/translate';

// Defaults to English so components also work in tests without a provider.
const I18nContext = createContext<I18n>(createI18n(DEFAULT_LOCALE, en));

export function I18nProvider({ locale, messages, children }: { locale: Locale; messages: Messages; children: ReactNode }) {
  const value = useMemo(() => createI18n(locale, messages), [locale, messages]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18n {
  return useContext(I18nContext);
}
