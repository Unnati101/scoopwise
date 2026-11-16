import { INTL_LOCALES, type Locale } from '@/i18n/config';
import type { Messages } from '@/i18n/messages/en';
import { formatCurrency, formatDate, formatDateTime, formatTime, formatWeekday } from '@/lib/format';

type Paths<T> = T extends string
  ? never
  : T extends readonly unknown[]
    ? never
    : { [K in keyof T & string]: T[K] extends string ? K : T[K] extends readonly unknown[] ? never : string extends keyof T[K] ? never : `${K}.${Paths<T[K]>}` }[keyof T & string];

/** Dotted path to a string in the dictionary, e.g. "cart.checkout". */
export type MessageKey = Paths<Messages>;

type Params = Record<string, string | number>;

function lookup(messages: Messages, key: string): string | undefined {
  let node: unknown = messages;
  for (const part of key.split('.')) {
    if (typeof node !== 'object' || node === null) return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === 'string' ? node : undefined;
}

// French and Hindi treat 0 as singular, the other supported languages do not.
const ZERO_IS_SINGULAR: Locale[] = ['fr', 'hi'];

export function createI18n(locale: Locale, messages: Messages) {
  const intl = INTL_LOCALES[locale];

  /** Translates a key. "one|other" strings pick a form with the `count` param. */
  function t(key: MessageKey, params: Params = {}): string {
    const raw = lookup(messages, key);
    if (raw === undefined) return key;
    let text = raw;
    if (raw.includes('|')) {
      const [one = raw, other = raw] = raw.split('|');
      const count = Number(params.count ?? 0);
      const singular = count === 1 || (count === 0 && ZERO_IS_SINGULAR.includes(locale));
      text = singular ? one : other;
    }
    return text.replace(/\{(\w+)\}/g, (match, name: string) => (name in params ? String(params[name]) : match));
  }

  return {
    locale,
    intl,
    m: messages,
    t,
    formatCurrency: (value: number) => formatCurrency(value, intl),
    formatDateTime: (value: number | string) => formatDateTime(value, intl),
    formatDate: (value: number | string | Date) => formatDate(value, intl),
    formatTime: (value: number | string | Date) => formatTime(value, intl),
    formatWeekday: (day: number, style: 'long' | 'short' = 'long') => formatWeekday(day, intl, style),
  };
}

export type I18n = ReturnType<typeof createI18n>;
