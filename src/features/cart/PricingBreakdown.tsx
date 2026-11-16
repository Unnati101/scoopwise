'use client';

import { useI18n } from '@/i18n/provider';
import type { CartPricing } from '@/lib/cartPricing';

interface PricingBreakdownProps {
  pricing: CartPricing;
  promoCode?: string | null;
  /** Show the delivery row (checkout) instead of the "calculated at checkout" note (cart drawer). */
  showDelivery?: boolean;
}

export function PricingBreakdown({ pricing, promoCode, showDelivery = false }: PricingBreakdownProps) {
  const { t, formatCurrency } = useI18n();
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between">
        <dt className="text-muted-foreground">{t('cart.subtotal')}</dt>
        <dd>{formatCurrency(pricing.subtotal)}</dd>
      </div>
      {pricing.discount > 0 && (
        <div className="flex justify-between font-medium text-success">
          <dt>{t('cart.sweetDeal', { count: pricing.freeScoops })}</dt>
          <dd>-{formatCurrency(pricing.discount)}</dd>
        </div>
      )}
      {pricing.promoDiscount > 0 && (
        <div className="flex justify-between font-medium text-success">
          <dt>{t('cart.promo', { code: promoCode ?? '' })}</dt>
          <dd>-{formatCurrency(pricing.promoDiscount)}</dd>
        </div>
      )}
      {showDelivery && (
        <div className="flex justify-between">
          <dt className="text-muted-foreground">{t('cart.delivery')}</dt>
          <dd>{pricing.deliveryFee > 0 ? formatCurrency(pricing.deliveryFee) : t('cart.free')}</dd>
        </div>
      )}
      <div className="flex justify-between border-t pt-3 font-display text-lg font-semibold">
        <dt>{t('cart.total')}</dt>
        <dd>{formatCurrency(pricing.total)}</dd>
      </div>
    </dl>
  );
}
