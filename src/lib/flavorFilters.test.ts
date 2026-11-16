import { flavors } from '@/data/flavors';
import { ALL, filterFlavors, sortFlavors } from '@/lib/flavorFilters';

const base = { query: '', category: ALL, dairyFreeOnly: false };

describe('filterFlavors', () => {
  it('returns every flavor with no filters', () => {
    expect(filterFlavors(flavors, base)).toHaveLength(flavors.length);
  });

  it('matches the search query case-insensitively', () => {
    const result = filterFlavors(flavors, { ...base, query: '  MANGO ' });
    expect(result.map((f) => f.name)).toEqual(['Mango Magic']);
  });

  it('filters by category', () => {
    const result = filterFlavors(flavors, { ...base, category: 'Sorbet' });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((f) => f.category === 'Sorbet')).toBe(true);
  });

  it('filters dairy-free flavors', () => {
    const result = filterFlavors(flavors, { ...base, dairyFreeOnly: true });
    expect(result.every((f) => f.dairyFree)).toBe(true);
  });

  it('returns nothing when nothing matches', () => {
    expect(filterFlavors(flavors, { ...base, query: 'zzzz' })).toEqual([]);
  });
});

describe('sortFlavors', () => {
  it('sorts by name without mutating the input', () => {
    const copy = [...flavors];
    const sorted = sortFlavors(flavors, 'name');
    expect(sorted[0]?.name).toBe('Blueberry Cheesecake');
    expect(flavors).toEqual(copy);
  });

  it('sorts by price ascending and descending', () => {
    const asc = sortFlavors(flavors, 'price-asc');
    const desc = sortFlavors(flavors, 'price-desc');
    expect(asc[0]?.price).toBe(Math.min(...flavors.map((f) => f.price)));
    expect(desc[0]?.price).toBe(Math.max(...flavors.map((f) => f.price)));
  });

  it('puts popular flavors first by default', () => {
    const sorted = sortFlavors(flavors, 'popular');
    const popularCount = flavors.filter((f) => f.popular).length;
    expect(sorted.slice(0, popularCount).every((f) => f.popular)).toBe(true);
  });
});
