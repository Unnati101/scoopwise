'use client';

import { IceCreamCone, Minus, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/Button';
import { Sheet } from '@/components/ui/Sheet';
import { useCartUi } from '@/features/cart/CartProvider';
import { PricingBreakdown } from '@/features/cart/PricingBreakdown';
import { PromoCodeForm } from '@/features/cart/PromoCodeForm';
import { useCart } from '@/hooks/useCart';
import { localizeLine } from '@/i18n/localize';
import { useI18n } from '@/i18n/provider';
import { DEAL_SIZE, FREE_DELIVERY_THRESHOLD } from '@/lib/cartPricing';
import { cartStore } from '@/lib/cartStore';

export function CartDrawer() {
  const { isOpen, close } = useCartUi();
  const { lines, pricing, promo } = useCart();
  const i18n = useI18n();
  const { t, formatCurrency } = i18n;
  const scoops = lines.filter((line) => line.kind === 'flavor').reduce((sum, line) => sum + line.quantity, 0);
  const scoopsToNextFree = DEAL_SIZE - (scoops % DEAL_SIZE);

  return (
    <Sheet open={isOpen} onClose={close} title={t('cart.title')}>
      {lines.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-blush text-primary">
            <IceCreamCone className="h-10 w-10" aria-hidden />
          </span>
          <h3 className="text-lg font-semibold">{t('cart.emptyTitle')}</h3>
          <p className="text-sm text-muted-foreground">{t('cart.emptyText')}</p>
          <div className="flex gap-2">
            <Link href="/flavors" onClick={close} className={buttonVariants()}>
              {t('cart.browse')}
            </Link>
            <Link href="/menu" onClick={close} className={buttonVariants({ variant: 'outline' })}>
              {t('cart.seeMenu')}
            </Link>
          </div>
        </div>
      ) : (
        <>
          <ul className="flex-1 divide-y overflow-y-auto px-5">
            {lines.map((line) => {
              const { name, detail } = localizeLine(line, i18n);
              return (
                <li key={line.id} className="flex items-center gap-3 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{name}</p>
                    {detail && <p className="text-xs text-muted-foreground">{detail}</p>}
                    <p className="text-sm text-muted-foreground">{t('common.each', { price: formatCurrency(line.unitPrice) })}</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full border-2 border-border">
                    <button
                      type="button"
                      onClick={() => cartStore.setQuantity(line.id, line.quantity - 1)}
                      aria-label={t('cart.decrease', { name })}
                      className="rounded-full p-2 hover:bg-muted"
                    >
                      <Minus className="h-4 w-4" aria-hidden />
                    </button>
                    <span className="min-w-6 text-center text-sm font-semibold" aria-live="polite">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => cartStore.setQuantity(line.id, line.quantity + 1)}
                      disabled={line.quantity >= cartStore.maxQuantity}
                      aria-label={t('cart.increase', { name })}
                      className="rounded-full p-2 hover:bg-muted disabled:opacity-40"
                    >
                      <Plus className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => cartStore.remove(line.id)}
                    aria-label={t('cart.remove', { name })}
                    className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-danger"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="space-y-4 border-t bg-surface p-5">
            {scoops > 0 && (
              <p className="rounded-xl bg-blush px-3 py-2 text-xs font-medium text-primary">
                {pricing.freeScoops > 0 && t('cart.dealApplied')}
                {t('cart.dealNext', { count: scoopsToNextFree })}
              </p>
            )}
            <PromoCodeForm id="cart-promo" />
            <PricingBreakdown pricing={pricing} promoCode={promo?.code} />
            <p className="text-xs text-muted-foreground">{t('cart.deliveryNote', { amount: formatCurrency(FREE_DELIVERY_THRESHOLD) })}</p>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => cartStore.clear()} className="shrink-0">
                {t('cart.clear')}
              </Button>
              <Link href="/checkout" onClick={close} className={buttonVariants({ className: 'flex-1' })}>
                {t('cart.checkout')}
              </Link>
            </div>
          </div>
        </>
      )}
    </Sheet>
  );
}
