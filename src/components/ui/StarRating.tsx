'use client';

import { Star } from 'lucide-react';
import { useI18n } from '@/i18n/provider';
import { cn } from '@/lib/utils';

export function StarRating({ rating, className }: { rating: number; className?: string }) {
  const { t } = useI18n();
  return (
    <span role="img" aria-label={t('common.rated', { rating })} className={cn('inline-flex gap-0.5', className)}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} aria-hidden className={cn('h-4 w-4', index < Math.round(rating) ? 'fill-accent text-accent' : 'text-border')} />
      ))}
    </span>
  );
}
