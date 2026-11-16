import { flavors } from '@/data/flavors';
import { hasSignals, recommendFlavorsFor } from '@/lib/recommendations';
import type { CartLine, Order } from '@/types';

const line = (id: string, quantity = 1): CartLine => ({ id, kind: 'flavor', name: id, unitPrice: 4.5, quantity });
const order = (...lines: CartLine[]) => ({ lines }) as Order;
const none = { favorites: [], orders: [], cart: [] };

describe('recommendFlavorsFor', () => {
  it('falls back to popular flavors for a new shopper', () => {
    const picks = recommendFlavorsFor(flavors, none);
    expect(picks).toHaveLength(4);
    expect(picks.every((pick) => pick.reason.kind === 'popular' && pick.flavor.popular)).toBe(true);
  });

  it('suggests flavors from categories the shopper likes', () => {
    const picks = recommendFlavorsFor(flavors, { ...none, favorites: ['flv-strawberry-bliss', 'flv-mango-magic'] });
    const first = picks[0];
    expect(first?.flavor.category).toBe('Fruity');
    expect(first?.reason).toEqual({ kind: 'category', category: 'Fruity' });
  });

  it('offers a past order again, but never more than two', () => {
    const history = order(line('flv-vanilla-dream', 3), line('flv-chocolate-fudge', 2), line('flv-mango-magic'));
    const picks = recommendFlavorsFor(flavors, { ...none, orders: [history] }, 6);
    expect(picks.filter((pick) => pick.reason.kind === 'reorder').length).toBeLessThanOrEqual(2);
    expect(picks.some((pick) => pick.reason.kind === 'reorder')).toBe(true);
  });

  it('does not suggest what is already in the cart', () => {
    const picks = recommendFlavorsFor(flavors, { ...none, cart: [line('flv-mango-magic')] }, 12);
    expect(picks.some((pick) => pick.flavor.id === 'flv-mango-magic')).toBe(false);
  });

  it('leans dairy-free when most signals are dairy-free', () => {
    const picks = recommendFlavorsFor(flavors, { ...none, favorites: ['flv-coconut-cloud', 'flv-raspberry-sorbet'] });
    expect(picks[0]?.flavor.dairyFree).toBe(true);
  });

  it('counts the flavors inside custom creations as signals', () => {
    const custom: CartLine = { id: 'custom-x', kind: 'custom', name: 'Custom', unitPrice: 8, quantity: 1, creation: { vesselId: 'cup', flavorIds: ['flv-pistachio-crunch'], toppingIds: [] } };
    const picks = recommendFlavorsFor(flavors, { ...none, orders: [order(custom)] });
    expect(picks.some((pick) => pick.flavor.category === 'Nutty')).toBe(true);
  });
});

describe('hasSignals', () => {
  it('is false for a new shopper and true once there is any activity', () => {
    expect(hasSignals(none)).toBe(false);
    expect(hasSignals({ ...none, favorites: ['flv-mango-magic'] })).toBe(true);
    expect(hasSignals({ ...none, cart: [line('flv-mango-magic')] })).toBe(true);
  });
});
