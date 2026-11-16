import { cookies } from 'next/headers';
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { createI18n } from '@/i18n/translate';

/** Translator for server components. Reads the language cookie of the current request. */
export async function getI18n() {
  const stored = (await cookies()).get(LOCALE_COOKIE)?.value;
  const locale = isLocale(stored) ? stored : DEFAULT_LOCALE;
  return createI18n(locale, getMessages(locale));
}
