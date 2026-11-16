import { LOCALES } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { en } from '@/i18n/messages/en';
import { createI18n, type MessageKey } from '@/i18n/translate';

function flatten(node: unknown, prefix = ''): Map<string, string> {
  const leaves = new Map<string, string>();
  if (typeof node === 'string') leaves.set(prefix, node);
  else if (typeof node === 'object' && node !== null) {
    for (const [key, value] of Object.entries(node)) flatten(value, prefix ? `${prefix}.${key}` : key).forEach((text, path) => leaves.set(path, text));
  }
  return leaves;
}

const placeholders = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
const englishLeaves = flatten(en);

describe.each(LOCALES.filter((locale) => locale !== 'en'))('%s dictionary', (locale) => {
  const leaves = flatten(getMessages(locale));

  it('has exactly the same keys as English, including list items', () => {
    expect([...leaves.keys()].sort()).toEqual([...englishLeaves.keys()].sort());
  });

  it('keeps every placeholder and plural marker from English', () => {
    englishLeaves.forEach((english, path) => {
      const translated = leaves.get(path) ?? '';
      expect({ path, placeholders: placeholders(translated) }).toEqual({ path, placeholders: placeholders(english) });
      expect({ path, plural: translated.includes('|') }).toEqual({ path, plural: english.includes('|') });
    });
  });

  it('translates something rather than copying English everywhere', () => {
    const same = [...leaves].filter(([path, text]) => text === englishLeaves.get(path)).length;
    expect(same / leaves.size).toBeLessThan(0.1);
  });
});

describe('createI18n', () => {
  const english = createI18n('en', en);

  it('fills placeholders', () => {
    expect(english.t('cart.addedToast', { name: 'Mango Magic' })).toBe('Mango Magic added to your cart');
  });

  it('picks singular or plural from count', () => {
    expect(english.t('header.openCart', { count: 1 })).toBe('Open cart, 1 item');
    expect(english.t('header.openCart', { count: 3 })).toBe('Open cart, 3 items');
    expect(english.t('header.openCart', { count: 0 })).toBe('Open cart, 0 items');
  });

  it('treats zero as singular in French', () => {
    const french = createI18n('fr', getMessages('fr'));
    expect(french.t('header.openCart', { count: 0 })).toBe('Ouvrir le panier, 0 article');
    expect(french.t('header.openCart', { count: 2 })).toBe('Ouvrir le panier, 2 articles');
  });

  it('returns the key for an unknown message and keeps unknown placeholders visible', () => {
    expect(english.t('nope.missing' as MessageKey)).toBe('nope.missing');
    expect(english.t('cart.addedToast')).toBe('{name} added to your cart');
  });

  it('formats prices and dates for the language', () => {
    expect(english.formatCurrency(4.5)).toBe('₹4.50');
    expect(english.formatCurrency(115)).toBe('₹115');
    expect(createI18n('de', getMessages('de')).formatCurrency(4.5)).toContain('4,50');
  });
});
