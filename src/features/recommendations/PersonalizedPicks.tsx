'use client';

import { SectionHeading } from '@/components/ui/SectionHeading';
import { FlavorCard } from '@/features/flavors/FlavorCard';
import { useCart } from '@/hooks/useCart';
import { useLocalStore } from '@/hooks/useLocalStore';
import { useI18n } from '@/i18n/provider';
import { favoritesStore } from '@/lib/favorites';
import { ordersStore } from '@/lib/ordersStore';
import { hasSignals, recommendFlavorsFor, type RecommendationReason } from '@/lib/recommendations';
import type { Flavor } from '@/types';

interface PersonalizedPicksProps {
  flavors: Flavor[];
  /** Hide the row until the shopper has favorites, orders or cart items. */
  onlyWhenPersonalized?: boolean;
}

export function PersonalizedPicks({ flavors, onlyWhenPersonalized = false }: PersonalizedPicksProps) {
  const { t, m } = useI18n();
  const favorites = useLocalStore(favoritesStore);
  const orders = useLocalStore(ordersStore);
  const { lines } = useCart();

  const signals = { favorites, orders, cart: lines };
  const personalized = hasSignals(signals);
  if (onlyWhenPersonalized && !personalized) return null;

  const reasonText = (reason: RecommendationReason): string => {
    switch (reason.kind) {
      case 'category':
        return t('recommendations.reason.category', { category: m.data.flavorCategories[reason.category] ?? reason.category });
      case 'reorder':
        return t('recommendations.reason.reorder');
      case 'dairyFree':
        return t('recommendations.reason.dairyFree');
      case 'popular':
        return t('recommendations.reason.popular');
    }
  };

  return (
    <section className="container pt-16" aria-labelledby="picks-heading">
      <SectionHeading id="picks-heading" title={t('recommendations.title')} eyebrow={t('recommendations.eyebrow')} />
      <p className="-mt-5 mb-6 text-sm text-muted-foreground">{personalized ? t('recommendations.personalized') : t('recommendations.generic')}</p>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {recommendFlavorsFor(flavors, signals).map(({ flavor, reason }) => (
          <FlavorCard key={flavor.id} flavor={flavor} note={reasonText(reason)} />
        ))}
      </div>
    </section>
  );
}
