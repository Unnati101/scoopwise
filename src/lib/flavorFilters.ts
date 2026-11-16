import type { Flavor, FlavorCategory } from '@/types';

export const ALL = 'All';
export const FLAVOR_CATEGORIES: FlavorCategory[] = ['Fruity', 'Chocolatey', 'Creamy', 'Nutty', 'Sorbet'];

export type FlavorSort = 'popular' | 'name' | 'price-asc' | 'price-desc' | 'rating';

export const SORT_VALUES: FlavorSort[] = ['popular', 'rating', 'name', 'price-asc', 'price-desc'];

export interface FlavorFilters {
  query: string;
  category: string;
  dairyFreeOnly: boolean;
  /** When provided, only flavors with these ids are kept. */
  onlyIds?: string[];
}

export function filterFlavors(flavors: Flavor[], { query, category, dairyFreeOnly, onlyIds }: FlavorFilters): Flavor[] {
  const needle = query.trim().toLowerCase();
  return flavors.filter((flavor) => {
    if (onlyIds && !onlyIds.includes(flavor.id)) return false;
    if (category !== ALL && flavor.category !== category) return false;
    if (dairyFreeOnly && !flavor.dairyFree) return false;
    if (!needle) return true;
    return `${flavor.name} ${flavor.description} ${flavor.category}`.toLowerCase().includes(needle);
  });
}

export function sortFlavors(flavors: Flavor[], sort: FlavorSort): Flavor[] {
  const copy = [...flavors];
  switch (sort) {
    case 'name':
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case 'price-asc':
      return copy.sort((a, b) => a.price - b.price || a.name.localeCompare(b.name));
    case 'price-desc':
      return copy.sort((a, b) => b.price - a.price || a.name.localeCompare(b.name));
    case 'rating':
      return copy.sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name));
    case 'popular':
      return copy.sort((a, b) => Number(b.popular) - Number(a.popular) || b.rating - a.rating);
  }
}
