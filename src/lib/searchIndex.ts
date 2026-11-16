import { NAV_LINKS } from '@/lib/constants';
import type { I18n } from '@/i18n/translate';
import type { Flavor, MenuItem } from '@/types';

export type SearchKind = 'Page' | 'Flavor' | 'Menu';

export interface SearchItem {
  id: string;
  kind: SearchKind;
  title: string;
  subtitle: string;
  href: string;
}

const CAKES_AND_SUNDAES = ['Cakes', 'Sundaes'];

/** Flavors and menu items must already be in the active language. */
export function buildSearchIndex(flavors: Flavor[], menuItems: MenuItem[], { t, m }: Pick<I18n, 't' | 'm'>): SearchItem[] {
  const page = (id: string, title: string, href: string, subtitle = m.search.kinds.Page): SearchItem => ({ id: `page-${id}`, kind: 'Page', title, subtitle, href });

  return [
    ...NAV_LINKS.map((link) => page(link.href, m.nav[link.key], link.href)),
    page('finder', t('search.finder.title'), '/#flavor-finder', t('search.finder.subtitle')),
    page('orders', m.nav.orders, '/orders'),
    page('subscription', m.nav.subscription, '/subscription'),
    page('rewards', m.nav.rewards, '/rewards'),
    page('checkout', t('search.checkout.title'), '/checkout', t('search.checkout.subtitle')),
    ...flavors.map<SearchItem>((flavor) => {
      const category = m.data.flavorCategories[flavor.category] ?? flavor.category;
      return {
        id: flavor.id,
        kind: 'Flavor',
        title: flavor.name,
        subtitle: t(flavor.dairyFree ? 'search.flavorDairyFree' : 'search.flavorSubtitle', { category }),
        href: `/flavors?q=${encodeURIComponent(flavor.name)}`,
      };
    }),
    ...menuItems.map<SearchItem>((item) => ({
      id: item.id,
      kind: 'Menu',
      title: item.name,
      subtitle: m.data.menuCategories[item.category]?.name ?? item.category,
      href: `${CAKES_AND_SUNDAES.includes(item.category) ? '/cakes-sundaes' : '/menu'}#${item.category.toLowerCase()}`,
    })),
  ];
}

export function searchItems(items: SearchItem[], query: string, limit = 8): SearchItem[] {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return items.filter((item) => item.kind === 'Page').slice(0, limit);

  return items
    .map((item) => {
      const title = item.title.toLowerCase();
      const haystack = `${title} ${item.subtitle.toLowerCase()}`;
      if (!tokens.every((token) => haystack.includes(token))) return null;
      const score = tokens.reduce((sum, token) => sum + (title.startsWith(token) ? 3 : title.includes(token) ? 2 : 1), 0);
      return { item, score };
    })
    .filter((entry): entry is { item: SearchItem; score: number } => entry !== null)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .slice(0, limit)
    .map((entry) => entry.item);
}
