import { flavors } from '@/data/flavors';
import { menuItems } from '@/data/menu';
import { en } from '@/i18n/messages/en';
import { createI18n } from '@/i18n/translate';
import { recommendFlavors } from '@/lib/flavorQuiz';
import { buildSearchIndex, searchItems } from '@/lib/searchIndex';

describe('recommendFlavors', () => {
  it('favors the chosen mood and returns three picks', () => {
    const picks = recommendFlavors(flavors, { mood: 'fruity', adventure: 'classic', diet: 'any' });
    expect(picks).toHaveLength(3);
    expect(picks[0]?.category).toBe('Fruity');
  });

  it('only suggests dairy-free flavors when asked', () => {
    const picks = recommendFlavors(flavors, { mood: 'rich', adventure: 'classic', diet: 'dairy-free' });
    expect(picks.length).toBeGreaterThan(0);
    expect(picks.every((flavor) => flavor.dairyFree)).toBe(true);
  });

  it('leans toward lesser-known flavors for adventurous answers', () => {
    const picks = recommendFlavors(flavors, { mood: 'nutty', adventure: 'bold', diet: 'any' });
    expect(picks[0]?.category).toBe('Nutty');
    expect(picks[0]?.popular).toBe(false);
  });
});

describe('searchItems', () => {
  const index = buildSearchIndex(flavors, menuItems, createI18n('en', en));

  it('shows pages when the query is empty', () => {
    const results = searchItems(index, '');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((item) => item.kind === 'Page')).toBe(true);
  });

  it('matches flavors case-insensitively and ranks title matches first', () => {
    const results = searchItems(index, 'MANGO');
    expect(results[0]?.title.startsWith('Mango')).toBe(true);
    expect(results.find((item) => item.title === 'Mango Magic')?.href).toBe('/flavors?q=Mango%20Magic');
  });

  it('requires every word to match', () => {
    expect(searchItems(index, 'mango zzzz')).toEqual([]);
  });

  it('links cakes to the cakes page', () => {
    expect(searchItems(index, 'truffle')[0]?.href).toBe('/cakes-sundaes#cakes');
  });
});
