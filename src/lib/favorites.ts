import { z } from 'zod';
import { createLocalStore } from '@/lib/localStore';

export const favoritesStore = createLocalStore<string[]>('frosty.favorites', z.array(z.string()), []);

export function toggleFavorite(id: string): boolean {
  const current = favoritesStore.getSnapshot();
  const isFavorite = current.includes(id);
  favoritesStore.set(isFavorite ? current.filter((item) => item !== id) : [...current, id]);
  return !isFavorite;
}
