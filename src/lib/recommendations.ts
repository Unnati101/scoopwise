import type { CartLine, Flavor, FlavorCategory, Order } from '@/types';

export type RecommendationReason = { kind: 'reorder' } | { kind: 'category'; category: FlavorCategory } | { kind: 'dairyFree' } | { kind: 'popular' };

export interface Recommendation {
  flavor: Flavor;
  reason: RecommendationReason;
}

export interface Signals {
  favorites: string[];
  orders: Order[];
  cart: CartLine[];
}

const MAX_REORDERS = 2;

function flavorIdsOf(line: CartLine): string[] {
  const ids = line.kind === 'flavor' ? [line.id] : (line.creation?.flavorIds ?? []);
  return ids.flatMap((id) => Array<string>(line.quantity).fill(id));
}

export function hasSignals({ favorites, orders, cart }: Signals): boolean {
  return favorites.length > 0 || orders.length > 0 || cart.some((line) => flavorIdsOf(line).length > 0);
}

/** Picks flavors from what the shopper favorited, ordered and put in the cart; popular flavors for new shoppers. */
export function recommendFlavorsFor(flavors: Flavor[], signals: Signals, limit = 4): Recommendation[] {
  const weights = new Map<string, number>();
  const bump = (id: string, amount: number) => weights.set(id, (weights.get(id) ?? 0) + amount);
  const ordered = new Set<string>();

  signals.favorites.forEach((id) => bump(id, 3));
  signals.orders.forEach((order) =>
    order.lines.flatMap(flavorIdsOf).forEach((id) => {
      bump(id, 1);
      ordered.add(id);
    }),
  );
  const inCart = new Set(signals.cart.flatMap(flavorIdsOf));
  inCart.forEach((id) => bump(id, 2));

  const known = flavors.filter((flavor) => weights.has(flavor.id));
  const byRating = (a: Flavor, b: Flavor) => Number(b.popular) - Number(a.popular) || b.rating - a.rating || a.name.localeCompare(b.name);

  if (known.length === 0) {
    return [...flavors]
      .sort(byRating)
      .slice(0, limit)
      .map((flavor): Recommendation => ({ flavor, reason: { kind: 'popular' } }));
  }

  const affinity = new Map<FlavorCategory, number>();
  known.forEach((flavor) => affinity.set(flavor.category, (affinity.get(flavor.category) ?? 0) + (weights.get(flavor.id) ?? 0)));
  const totalWeight = known.reduce((sum, flavor) => sum + (weights.get(flavor.id) ?? 0), 0);
  const dairyFreeWeight = known.filter((flavor) => flavor.dairyFree).reduce((sum, flavor) => sum + (weights.get(flavor.id) ?? 0), 0);
  const prefersDairyFree = dairyFreeWeight / totalWeight >= 0.5;

  const scored = flavors
    .filter((flavor) => !inCart.has(flavor.id))
    .map((flavor) => {
      const seen = weights.get(flavor.id) ?? 0;
      // Favorites the shopper already has are shown only after fresh discoveries.
      const favoriteOnly = signals.favorites.includes(flavor.id) && !ordered.has(flavor.id);
      const score = (affinity.get(flavor.category) ?? 0) + seen * 0.5 + (prefersDairyFree && flavor.dairyFree ? 2 : 0) + flavor.rating / 5 - (favoriteOnly ? 4 : 0);
      return { flavor, score };
    })
    .sort((a, b) => b.score - a.score || byRating(a.flavor, b.flavor));

  const picks: Recommendation[] = [];
  let reorders = 0;
  for (const { flavor } of scored) {
    if (picks.length === limit) break;
    const isReorder = ordered.has(flavor.id);
    if (isReorder && reorders >= MAX_REORDERS) continue;
    if (isReorder) reorders += 1;

    const reason: RecommendationReason = isReorder
      ? { kind: 'reorder' }
      : prefersDairyFree && flavor.dairyFree
        ? { kind: 'dairyFree' }
        : (affinity.get(flavor.category) ?? 0) > 0
          ? { kind: 'category', category: flavor.category }
          : { kind: 'popular' };
    picks.push({ flavor, reason });
  }
  return picks;
}
