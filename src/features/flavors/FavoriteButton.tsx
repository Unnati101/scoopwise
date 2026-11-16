'use client';

import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useLocalStore } from '@/hooks/useLocalStore';
import { useI18n } from '@/i18n/provider';
import { favoritesStore, toggleFavorite } from '@/lib/favorites';
import { cn } from '@/lib/utils';

export function FavoriteButton({ id, name, className }: { id: string; name: string; className?: string }) {
  const favorites = useLocalStore(favoritesStore);
  const { t } = useI18n();
  const active = favorites.includes(id);

  return (
    <button
      type="button"
      onClick={() => toast(toggleFavorite(id) ? t('flavors.favorite.saved', { name }) : t('flavors.favorite.removed', { name }))}
      aria-pressed={active}
      aria-label={active ? t('flavors.favorite.remove', { name }) : t('flavors.favorite.save', { name })}
      className={cn('rounded-full bg-surface/90 p-2 shadow-card transition-transform hover:scale-110', className)}
    >
      <Heart className={cn('h-4 w-4', active ? 'fill-primary text-primary' : 'text-muted-foreground')} aria-hidden />
    </button>
  );
}
