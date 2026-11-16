import type { Flavor, MenuItem } from '@/types';

export interface Vessel {
  id: string;
  name: string;
  price: number;
  description: string;
}

export const MAX_SCOOPS = 3;

// MOCK DATA: vessel prices for the demo, in rupees. Replace with real catalog data from an API.
export const VESSELS: Vessel[] = [
  { id: 'cake-cone', name: 'Cake cone', price: 35, description: 'Light and crisp' },
  { id: 'waffle-cone', name: 'Waffle cone', price: 60, description: 'Baked fresh daily' },
  { id: 'cup', name: 'Cup', price: 25, description: 'Grab a spoon' },
  { id: 'waffle-bowl', name: 'Waffle bowl', price: 70, description: 'Eat the bowl too' },
];

export interface Creation {
  vesselId: string;
  /** One entry per scoop, so the same flavor can appear twice. */
  flavorIds: string[];
  toppingIds: string[];
}

export function priceCreation({ vesselId, flavorIds, toppingIds }: Creation, flavors: Flavor[], toppings: MenuItem[]): number {
  const cents = (value: number) => Math.round(value * 100);
  const vessel = VESSELS.find((item) => item.id === vesselId);
  const scoops = flavorIds.reduce((sum, id) => sum + cents(flavors.find((flavor) => flavor.id === id)?.price ?? 0), 0);
  const extras = toppingIds.reduce((sum, id) => sum + cents(toppings.find((topping) => topping.id === id)?.price ?? 0), 0);
  return (cents(vessel?.price ?? 0) + scoops + extras) / 100;
}

export function describeCreation(
  { flavorIds, toppingIds }: Creation,
  flavors: Flavor[],
  toppings: MenuItem[],
  withToppings: (scoops: string, toppings: string) => string = (scoops, extras) => `${scoops} with ${extras}`,
): string {
  const names = (ids: string[], source: { id: string; name: string }[]) => ids.map((id) => source.find((item) => item.id === id)?.name).filter(Boolean);
  const scoops = names(flavorIds, flavors).join(', ');
  const extras = names(toppingIds, toppings).join(', ');
  return extras ? withToppings(scoops, extras) : scoops;
}

/** Identical creations share an id so they merge into one cart line. */
export function creationId({ vesselId, flavorIds, toppingIds }: Creation): string {
  return `custom-${vesselId}-${flavorIds.join('+')}-${[...toppingIds].sort().join('+')}`;
}

export function randomCreation(flavors: Flavor[], toppings: MenuItem[], random: () => number = Math.random): Creation {
  const pick = <T,>(items: T[]): T | undefined => items[Math.floor(random() * items.length)];
  const scoopCount = 1 + Math.floor(random() * MAX_SCOOPS);
  const flavorIds = Array.from({ length: scoopCount }, () => pick(flavors)?.id).filter((id): id is string => id !== undefined);
  const topping = pick(toppings)?.id;
  return { vesselId: pick(VESSELS)?.id ?? 'cup', flavorIds, toppingIds: topping ? [topping] : [] };
}
