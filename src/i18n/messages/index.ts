import { DEFAULT_LOCALE, type Locale } from '@/i18n/config';
import { de } from '@/i18n/messages/de';
import { en, type Messages } from '@/i18n/messages/en';
import { es } from '@/i18n/messages/es';
import { fr } from '@/i18n/messages/fr';
import { hi } from '@/i18n/messages/hi';

const dictionaries: Record<Locale, Messages> = { en, es, hi, fr, de };

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
}
