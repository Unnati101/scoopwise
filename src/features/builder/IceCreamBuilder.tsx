'use client';

import { Dices, Minus, Plus, RotateCcw, ShoppingBag } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { BuilderPreview } from '@/features/builder/BuilderPreview';
import { useCartUi } from '@/features/cart/CartProvider';
import { useI18n } from '@/i18n/provider';
import { MAX_SCOOPS, VESSELS, creationId, describeCreation, priceCreation, randomCreation, type Creation } from '@/lib/builder';
import { cartStore } from '@/lib/cartStore';
import { cn } from '@/lib/utils';
import type { Flavor, MenuItem } from '@/types';

interface IceCreamBuilderProps {
  flavors: Flavor[];
  toppings: MenuItem[];
  initialFlavorId?: string;
}

export function IceCreamBuilder({ flavors, toppings, initialFlavorId }: IceCreamBuilderProps) {
  const { open: openCart } = useCartUi();
  const { t, m, formatCurrency } = useI18n();
  const [creation, setCreation] = useState<Creation>(() => ({
    vesselId: 'waffle-cone',
    flavorIds: flavors.some((flavor) => flavor.id === initialFlavorId) && initialFlavorId ? [initialFlavorId] : [],
    toppingIds: [],
  }));

  const scoops = useMemo(
    () => creation.flavorIds.flatMap((id) => flavors.find((flavor) => flavor.id === id) ?? []),
    [creation.flavorIds, flavors],
  );
  const price = priceCreation(creation, flavors, toppings);
  const vesselName = m.data.vessels[creation.vesselId]?.name ?? '';
  const full = creation.flavorIds.length >= MAX_SCOOPS;
  const description = describeCreation(creation, flavors, toppings, (scoops, extras) => t('builder.withToppings', { scoops, toppings: extras }));

  const countOf = (id: string) => creation.flavorIds.filter((item) => item === id).length;

  const addScoop = (id: string) => {
    if (full) return;
    setCreation((current) => ({ ...current, flavorIds: [...current.flavorIds, id] }));
  };

  const removeScoop = (id: string) => {
    setCreation((current) => {
      const index = current.flavorIds.lastIndexOf(id);
      return index === -1 ? current : { ...current, flavorIds: current.flavorIds.filter((_, position) => position !== index) };
    });
  };

  const toggleTopping = (id: string) => {
    setCreation((current) => ({
      ...current,
      toppingIds: current.toppingIds.includes(id) ? current.toppingIds.filter((item) => item !== id) : [...current.toppingIds, id],
    }));
  };

  const addToCart = () => {
    if (creation.flavorIds.length === 0) return;
    cartStore.add({
      id: creationId(creation),
      kind: 'custom',
      name: t('builder.customName', { vessel: vesselName }),
      unitPrice: price,
      detail: description,
      creation,
    });
    toast.success(t('builder.added'));
    openCart();
  };

  return (
    <div className="container grid gap-8 py-10 lg:grid-cols-[minmax(0,22rem)_1fr]">
      <aside aria-label={t('builder.yourCreation')} className="lg:sticky lg:top-36 lg:self-start">
        <Card className="space-y-4 bg-gradient-blush p-5">
          <div className="h-80">
            <BuilderPreview vesselId={creation.vesselId} scoops={scoops} toppingIds={creation.toppingIds} />
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {scoops.length === 0 ? t('builder.start') : description}
            </p>
            <p className="mt-1 font-display text-3xl font-bold text-primary">{formatCurrency(price)}</p>
          </div>
          <Button size="lg" className="w-full" onClick={addToCart} disabled={scoops.length === 0}>
            <ShoppingBag className="h-5 w-5" aria-hidden />
            {t('builder.addToCart')}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => setCreation(randomCreation(flavors, toppings))}>
              <Dices className="h-4 w-4" aria-hidden />
              {t('builder.surprise')}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setCreation({ vesselId: 'waffle-cone', flavorIds: [], toppingIds: [] })}>
              <RotateCcw className="h-4 w-4" aria-hidden />
              {t('builder.reset')}
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground">{t('builder.notDeal')}</p>
        </Card>
      </aside>

      <div className="space-y-10">
        <section aria-labelledby="vessel-heading">
          <h2 id="vessel-heading" className="mb-4 text-2xl font-bold">
            {t('builder.step1')}
          </h2>
          <div role="radiogroup" aria-labelledby="vessel-heading" className="grid gap-3 sm:grid-cols-2">
            {VESSELS.map((item) => (
              <label
                key={item.id}
                className={cn(
                  'flex cursor-pointer items-center justify-between gap-3 rounded-xl border-2 p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
                  creation.vesselId === item.id ? 'border-primary bg-blush' : 'border-border bg-surface hover:border-primary/60',
                )}
              >
                <input
                  type="radio"
                  name="vessel"
                  value={item.id}
                  checked={creation.vesselId === item.id}
                  onChange={() => setCreation((current) => ({ ...current, vesselId: item.id }))}
                  className="sr-only"
                />
                <span>
                  <span className="block font-semibold">{m.data.vessels[item.id]?.name ?? item.name}</span>
                  <span className="block text-xs text-muted-foreground">{m.data.vessels[item.id]?.description ?? item.description}</span>
                </span>
                <span className="font-display font-semibold text-primary">{formatCurrency(item.price)}</span>
              </label>
            ))}
          </div>
        </section>

        <section aria-labelledby="scoops-heading">
          <h2 id="scoops-heading" className="mb-1 text-2xl font-bold">
            {t('builder.step2')}
          </h2>
          <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">
            {t('builder.scoopCount', { count: creation.flavorIds.length, max: MAX_SCOOPS })}
            {full ? t('builder.full') : ''}
          </p>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {flavors.map((flavor) => {
              const count = countOf(flavor.id);
              return (
                <li key={flavor.id} className={cn('flex items-center gap-3 rounded-xl border-2 p-3', count > 0 ? 'border-primary bg-blush' : 'border-border bg-surface')}>
                  <span className="h-10 w-10 shrink-0 rounded-full border" style={{ backgroundColor: flavor.color }} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{flavor.name}</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(flavor.price)}</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full border-2 border-border bg-surface">
                    <button type="button" onClick={() => removeScoop(flavor.id)} disabled={count === 0} aria-label={t('builder.removeScoop', { name: flavor.name })} className="rounded-full p-1.5 hover:bg-muted disabled:opacity-30">
                      <Minus className="h-4 w-4" aria-hidden />
                    </button>
                    <span className="min-w-5 text-center text-sm font-semibold" aria-label={t('builder.scoopsOf', { count, name: flavor.name })}>
                      {count}
                    </span>
                    <button type="button" onClick={() => addScoop(flavor.id)} disabled={full} aria-label={t('builder.addScoop', { name: flavor.name })} className="rounded-full p-1.5 hover:bg-muted disabled:opacity-30">
                      <Plus className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="toppings-heading">
          <h2 id="toppings-heading" className="mb-4 text-2xl font-bold">
            {t('builder.step3')}
          </h2>
          <div className="flex flex-wrap gap-2" role="group" aria-labelledby="toppings-heading">
            {toppings.map((topping) => {
              const selected = creation.toppingIds.includes(topping.id);
              return (
                <button
                  key={topping.id}
                  type="button"
                  onClick={() => toggleTopping(topping.id)}
                  aria-pressed={selected}
                  className={cn(
                    'rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors',
                    selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-surface hover:border-primary',
                  )}
                >
                  {topping.name} <span className={selected ? 'opacity-90' : 'text-muted-foreground'}>+{formatCurrency(topping.price)}</span>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
