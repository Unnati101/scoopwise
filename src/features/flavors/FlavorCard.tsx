'use client';

import { Leaf, Star } from 'lucide-react';
import { ScoopCup } from '@/components/illustrations/ScoopCup';
import { Badge } from '@/components/ui/Badge';
import { AddToCartButton } from '@/features/cart/AddToCartButton';
import { FavoriteButton } from '@/features/flavors/FavoriteButton';
import { FlavorQuickView } from '@/features/flavors/FlavorQuickView';
import { GiftScoopButton } from '@/features/flavors/GiftScoopButton';
import { useI18n } from '@/i18n/provider';
import type { Flavor } from '@/types';

/** `note` is a short reason shown above the name, used by personalized recommendations. */
export function FlavorCard({ flavor, note }: { flavor: Flavor; note?: string }) {
  const { t, formatCurrency } = useI18n();
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border bg-surface shadow-card transition-transform duration-200 hover:-translate-y-1">
      <div className="relative flex items-center justify-center px-4 pt-5" style={{ backgroundColor: `${flavor.color}40` }}>
        <FavoriteButton id={flavor.id} name={flavor.name} className="absolute right-3 top-3" />
        <ScoopCup color={flavor.color} speckle={flavor.speckle} className="h-32 w-32" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4 text-center">
        {note && <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-primary">{note}</p>}
        <h3 className="text-base font-semibold leading-tight">{flavor.name}</h3>
        <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-accent text-accent" aria-hidden />
          <span>{flavor.rating.toFixed(1)}</span>
          <span aria-hidden>&middot;</span>
          <span>{t('flavors.card.perScoop', { price: formatCurrency(flavor.price) })}</span>
        </p>
        <p className="flex-1 text-xs text-muted-foreground">{flavor.description}</p>
        {flavor.dairyFree && (
          <Badge variant="secondary" className="mx-auto">
            <Leaf className="h-3 w-3" aria-hidden />
            {t('flavors.card.dairyFree')}
          </Badge>
        )}
        <AddToCartButton item={{ id: flavor.id, kind: 'flavor', name: flavor.name, unitPrice: flavor.price }} className="mt-2 w-full" />
        <GiftScoopButton flavor={flavor} />
        <FlavorQuickView flavor={flavor} />
      </div>
    </article>
  );
}
