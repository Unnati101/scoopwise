'use client';

import { Heart, Search, SearchX } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { FlavorCard } from '@/features/flavors/FlavorCard';
import { useLocalStore } from '@/hooks/useLocalStore';
import { useI18n } from '@/i18n/provider';
import { favoritesStore } from '@/lib/favorites';
import { ALL, FLAVOR_CATEGORIES, SORT_VALUES, filterFlavors, sortFlavors, type FlavorSort } from '@/lib/flavorFilters';
import { cn } from '@/lib/utils';
import type { Flavor } from '@/types';

export function FlavorExplorer({ flavors, initialQuery = '' }: { flavors: Flavor[]; initialQuery?: string }) {
  const { t, m } = useI18n();
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(ALL);
  const [dairyFreeOnly, setDairyFreeOnly] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sort, setSort] = useState<FlavorSort>('popular');
  const favorites = useLocalStore(favoritesStore);

  const results = useMemo(
    () => sortFlavors(filterFlavors(flavors, { query, category, dairyFreeOnly, onlyIds: favoritesOnly ? favorites : undefined }), sort),
    [flavors, query, category, dairyFreeOnly, favoritesOnly, favorites, sort],
  );

  const reset = () => {
    setQuery('');
    setCategory(ALL);
    setDairyFreeOnly(false);
    setFavoritesOnly(false);
  };

  return (
    <section className="container py-10" aria-label={t('flavors.explorer.label')}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('flavors.explorer.searchPlaceholder')}
            aria-label={t('flavors.explorer.searchLabel')}
            className="pl-10"
          />
        </div>
        <Select aria-label={t('flavors.explorer.sortLabel')} value={sort} onChange={(event) => setSort(event.target.value as FlavorSort)} className="lg:w-56">
          {SORT_VALUES.map((value) => (
            <option key={value} value={value}>
              {m.flavors.sort[value]}
            </option>
          ))}
        </Select>
        <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={dairyFreeOnly}
            onChange={(event) => setDairyFreeOnly(event.target.checked)}
            className="h-4 w-4 accent-[hsl(var(--primary))]"
          />
          {t('flavors.explorer.dairyFree')}
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={favoritesOnly}
            onChange={(event) => setFavoritesOnly(event.target.checked)}
            className="h-4 w-4 accent-[hsl(var(--primary))]"
          />
          <Heart className="h-4 w-4 text-primary" aria-hidden />
          {t('flavors.explorer.favorites', { count: favorites.length })}
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label={t('flavors.explorer.filterLabel')}>
        {[ALL, ...FLAVOR_CATEGORIES].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            aria-pressed={category === item}
            className={cn(
              'rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition-colors',
              category === item ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-surface hover:border-primary',
            )}
          >
            {item === ALL ? t('flavors.explorer.all') : (m.data.flavorCategories[item] ?? item)}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
        {t('flavors.explorer.showing', { shown: results.length, total: flavors.length })}
      </p>

      {results.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border bg-surface p-12 text-center">
          <SearchX className="h-10 w-10 text-primary" aria-hidden />
          <h2 className="text-xl font-semibold">{favoritesOnly && favorites.length === 0 ? t('flavors.explorer.noFavTitle') : t('flavors.explorer.noneTitle')}</h2>
          <p className="text-sm text-muted-foreground">
            {favoritesOnly && favorites.length === 0 ? t('flavors.explorer.noFavText') : t('flavors.explorer.noneText')}
          </p>
          <Button variant="outline" onClick={reset}>
            {t('flavors.explorer.clear')}
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {results.map((flavor, index) => (
            <FlavorCard key={flavor.id} flavor={flavor} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}
