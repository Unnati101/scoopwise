export const LOCALES = ['en', 'es', 'hi', 'fr', 'de'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_COOKIE = 'frosty-locale';

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  hi: 'हिन्दी',
  fr: 'Français',
  de: 'Deutsch',
};

/** BCP 47 tags used for number, date and time formatting. */
export const INTL_LOCALES: Record<Locale, string> = {
  en: 'en-US',
  es: 'es-ES',
  hi: 'hi-IN',
  fr: 'fr-FR',
  de: 'de-DE',
};

export function isLocale(value: string | undefined): value is Locale {
  return LOCALES.some((locale) => locale === value);
}
