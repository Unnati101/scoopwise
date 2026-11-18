'use client';

import { IceCreamCone, Minus, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useRef, useState, type RefObject } from 'react';
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

// Waits one frame so the element has mounted after the state change.
function focusNextFrame(ref: RefObject<HTMLElement | null>) {
  requestAnimationFrame(() => ref.current?.focus());
}

export function CartDrawer() {
  const { isOpen, close } = useCartUi();
  const { lines, pricing, promo } = useCart();
  const i18n = useI18n();
  const { t, formatCurrency } = i18n;
  const [confirmingClear, setConfirmingClear] = useState(false);
  const clearButtonRef = useRef<HTMLButtonElement>(null);
  const keepButtonRef = useRef<HTMLButtonElement>(null);
  const emptyTitleRef = useRef<HTMLHeadingElement>(null);
  const scoops = lines.filter((line) => line.kind === 'flavor').reduce((sum, line) => sum + line.quantity, 0);
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const scoopsToNextFree = DEAL_SIZE - (scoops % DEAL_SIZE);

  // Must stay stable: Sheet re-runs its focus effect when onClose changes.
  const handleClose = useCallback(() => {
    setConfirmingClear(false);
    close();
  }, [close]);

  const startClear = () => {
    setConfirmingClear(true);
    focusNextFrame(keepButtonRef);
  };

  const cancelClear = () => {
    setConfirmingClear(false);
    focusNextFrame(clearButtonRef);
  };

  const confirmClear = () => {
    cartStore.clear();
    setConfirmingClear(false);
    focusNextFrame(emptyTitleRef);
  };

  return (
    <Sheet open={isOpen} onClose={handleClose} title={t('cart.title')}>
      {lines.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-blush text-primary">
            <IceCreamCone className="h-10 w-10" aria-hidden />
          </span>
          <h3 ref={emptyTitleRef} tabIndex={-1} className="text-lg font-semibold focus:outline-none">
            {t('cart.emptyTitle')}
          </h3>
          <p className="text-sm text-muted-foreground">{t('cart.emptyText')}</p>
          <div className="flex gap-2">
            <Link href="/flavors" onClick={handleClose} className={buttonVariants()}>
              {t('cart.browse')}
            </Link>
            <Link href="/menu" onClick={handleClose} className={buttonVariants({ variant: 'outline' })}>
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
            {confirmingClear ? (
              <div role="group" aria-labelledby="cart-clear-title" className="space-y-3 rounded-xl border bg-blush p-4">
                <p id="cart-clear-title" role="alert" className="text-sm font-semibold">
                  {t('cart.clearTitle')}
                </p>
                <p className="text-xs text-muted-foreground">{t('cart.clearText', { count: itemCount })}</p>
                <div className="flex gap-2">
                  <Button ref={keepButtonRef} variant="outline" className="flex-1" onClick={cancelClear}>
                    {t('cart.clearKeep')}
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={confirmClear}>
                    {t('cart.clearConfirm')}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button ref={clearButtonRef} variant="ghost" onClick={startClear} className="shrink-0">
                  {t('cart.clear')}
                </Button>
                <Link href="/checkout" onClick={handleClose} className={buttonVariants({ className: 'flex-1' })}>
                  {t('cart.checkout')}
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </Sheet>
  );
}
