'use client';

import { Flame, Leaf, Minus, Plus, ShoppingBag, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { ScoopCup } from '@/components/illustrations/ScoopCup';
import { Badge } from '@/components/ui/Badge';
import { Button, buttonVariants } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { StarRating } from '@/components/ui/StarRating';
import { FavoriteButton } from '@/features/flavors/FavoriteButton';
import { useI18n } from '@/i18n/provider';
import { cartStore } from '@/lib/cartStore';
import type { Flavor } from '@/types';

export function FlavorQuickView({ flavor }: { flavor: Flavor }) {
  const { t, m, formatCurrency } = useI18n();
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const close = useCallback(() => setOpen(false), []);

  const addToCart = () => {
    cartStore.add({ id: flavor.id, kind: 'flavor', name: flavor.name, unitPrice: flavor.price }, quantity);
    toast.success(t('flavors.quick.addedMany', { count: quantity, name: flavor.name }));
    setOpen(false);
    setQuantity(1);
  };

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)} aria-label={t('flavors.card.detailsFor', { name: flavor.name })} className="w-full">
        {t('flavors.card.details')}
      </Button>
      <Dialog open={open} onClose={close} title={flavor.name}>
        <div className="mt-4 grid gap-5 sm:grid-cols-[10rem_1fr]">
          <div className="flex items-center justify-center rounded-2xl p-3" style={{ backgroundColor: `${flavor.color}40` }}>
            <ScoopCup color={flavor.color} speckle={flavor.speckle} className="h-36 w-36" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <StarRating rating={flavor.rating} />
              <span className="text-sm text-muted-foreground">{flavor.rating.toFixed(1)}</span>
            </div>
            <p className="text-sm text-muted-foreground">{flavor.description}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="muted">{m.data.flavorCategories[flavor.category] ?? flavor.category}</Badge>
              {flavor.dairyFree && (
                <Badge variant="secondary">
                  <Leaf className="h-3 w-3" aria-hidden />
                  {t('flavors.card.dairyFree')}
                </Badge>
              )}
              <Badge variant="accent">
                <Flame className="h-3 w-3" aria-hidden />
                {t('flavors.quick.calories', { count: flavor.calories })}
              </Badge>
            </div>
            <p className="text-sm">
              <span className="font-semibold">{t('flavors.quick.contains')}</span>{' '}
              {flavor.allergens.length > 0 ? flavor.allergens.map((item) => m.data.allergens[item] ?? item).join(', ') : t('flavors.quick.noAllergens')}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-5">
          <p className="font-display text-2xl font-semibold text-primary">{formatCurrency(flavor.price)}</p>
          <div className="flex items-center gap-1 rounded-full border-2 border-border">
            <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label={t('flavors.quick.decrease')} className="rounded-full p-2 hover:bg-muted">
              <Minus className="h-4 w-4" aria-hidden />
            </button>
            <span className="min-w-6 text-center font-semibold" aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(cartStore.maxQuantity, q + 1))}
              aria-label={t('flavors.quick.increase')}
              className="rounded-full p-2 hover:bg-muted"
            >
              <Plus className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button onClick={addToCart} className="flex-1">
            <ShoppingBag className="h-4 w-4" aria-hidden />
            {t('flavors.quick.add', { count: quantity })}
          </Button>
          <Link href={`/build?flavor=${flavor.id}`} onClick={close} className={buttonVariants({ variant: 'outline' })}>
            <Wand2 className="h-4 w-4" aria-hidden />
            {t('flavors.quick.buildCone')}
          </Link>
          <FavoriteButton id={flavor.id} name={flavor.name} className="border" />
        </div>
      </Dialog>
    </>
  );
}
