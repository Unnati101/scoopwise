'use client';

import { Tag, X } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCart } from '@/hooks/useCart';
import { useLocalStore } from '@/hooks/useLocalStore';
import { useI18n } from '@/i18n/provider';
import { activePromoStore, lookupPromo, rewardCodesStore } from '@/lib/promos';

export function PromoCodeForm({ id }: { id: string }) {
  const { promo, pricing } = useCart();
  const { t, m, formatCurrency } = useI18n();
  const rewardCodes = useLocalStore(rewardCodesStore);
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const apply = (event: FormEvent) => {
    event.preventDefault();
    const found = lookupPromo(value, rewardCodes);
    if (!found) {
      setError(t('cart.invalidCode'));
      return;
    }
    activePromoStore.set(found.code);
    setValue('');
    setError(null);
  };

  if (promo) {
    const shortfall = promo.minSubtotal ? promo.minSubtotal - pricing.afterDeals : 0;
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2 rounded-xl bg-secondary/60 px-3 py-2 text-sm">
          <span className="flex items-center gap-2 font-semibold text-secondary-foreground">
            <Tag className="h-4 w-4" aria-hidden />
            {promo.code}
            <span className="font-normal">{promo.reward ? t('data.rewardCode', { amount: formatCurrency(promo.value) }) : (m.data.promos[promo.code] ?? promo.label)}</span>
          </span>
          <button
            type="button"
            onClick={() => activePromoStore.set(null)}
            aria-label={t('cart.removeCode', { code: promo.code })}
            className="rounded-full p-1 hover:bg-secondary"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
        {!pricing.promoApplied && shortfall > 0 && (
          <p className="text-xs text-warning">{t('cart.addMore', { amount: formatCurrency(shortfall) })}</p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={apply} noValidate className="space-y-1">
      <div className="flex gap-2">
        <Input
          id={id}
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setError(null);
          }}
          placeholder={t('cart.promoPlaceholder')}
          aria-label={t('cart.promoPlaceholder')}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          autoComplete="off"
          className="h-10 uppercase"
        />
        <Button type="submit" variant="outline" size="sm" className="h-10" disabled={!value.trim()}>
          {t('cart.apply')}
        </Button>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </form>
  );
}
