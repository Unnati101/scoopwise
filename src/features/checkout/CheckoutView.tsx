'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, IceCreamCone, Store as StoreIcon, Truck } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { Button, buttonVariants } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { PricingBreakdown } from '@/features/cart/PricingBreakdown';
import { PromoCodeForm } from '@/features/cart/PromoCodeForm';
import { OrderTracker } from '@/features/orders/OrderTracker';
import { useCart } from '@/hooks/useCart';
import { useNow } from '@/hooks/useNow';
import { describeSlot, localizeLine } from '@/i18n/localize';
import { useI18n } from '@/i18n/provider';
import { cartStore } from '@/lib/cartStore';
import { pointsForOrder } from '@/lib/rewards';
import { checkoutSchema, type CheckoutValues } from '@/lib/schemas';
import { getStoreStatus, getTimeSlots, isStoreOpenAt } from '@/lib/storeHours';
import { cn } from '@/lib/utils';
import { orderService } from '@/services/orderService';
import type { Fulfilment, Order, Store } from '@/types';

const FULFILMENT_OPTIONS: { value: Fulfilment; icon: typeof Truck }[] = [
  { value: 'pickup', icon: StoreIcon },
  { value: 'delivery', icon: Truck },
];

export function CheckoutView({ stores }: { stores: Store[] }) {
  const i18n = useI18n();
  const { t, formatCurrency } = i18n;
  const [confirmation, setConfirmation] = useState<Order | null>(null);
  const now = useNow(60_000);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { name: '', email: '', phone: '', fulfilment: 'pickup', address: '', storeId: '', scheduledFor: '', notes: '' },
  });

  const fulfilment = useWatch({ control, name: 'fulfilment' });
  const storeId = useWatch({ control, name: 'storeId' });
  const { lines, pricing, promo } = useCart(fulfilment);

  const timing = useMemo(() => {
    if (now === null) return { asap: false, slots: [] };
    const relevant = fulfilment === 'pickup' ? stores.filter((store) => store.id === storeId) : stores;
    const scope = relevant.length > 0 ? relevant : stores;
    return { asap: scope.some((store) => isStoreOpenAt(store, new Date(now))), slots: getTimeSlots(scope, new Date(now)) };
  }, [now, fulfilment, storeId, stores]);

  const onSubmit = async (values: CheckoutValues) => {
    try {
      const destination = values.fulfilment === 'delivery' ? (values.address ?? '') : (stores.find((store) => store.id === values.storeId)?.name ?? '');
      const order = await orderService.place({ values, destination, lines, pricing, promoCode: promo?.code ?? null });
      cartStore.clear();
      setConfirmation(order);
    } catch {
      toast.error(t('checkout.failure'));
    }
  };

  if (confirmation) {
    const points = pointsForOrder(confirmation.total);
    return (
      <div className="container flex max-w-xl flex-col items-center gap-4 py-16 text-center">
        <CheckCircle2 className="h-16 w-16 text-success" aria-hidden />
        <h1 className="text-3xl font-bold">{t('checkout.thanks')}</h1>
        <p className="text-muted-foreground">
          {t('checkout.placed', {
            id: confirmation.id,
            total: formatCurrency(confirmation.total),
            fulfilment: confirmation.fulfilment === 'delivery' ? t('checkout.delivery') : t('checkout.pickup'),
            points,
          })}
        </p>
        <div className="w-full rounded-2xl border bg-surface p-5 text-left shadow-card">
          <OrderTracker order={confirmation} />
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Link href="/orders" className={buttonVariants()}>
            {t('checkout.viewOrders')}
          </Link>
          <Link href="/flavors" className={buttonVariants({ variant: 'outline' })}>
            {t('checkout.orderMore')}
          </Link>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="container flex max-w-xl flex-col items-center gap-4 py-20 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-blush text-primary">
          <IceCreamCone className="h-10 w-10" aria-hidden />
        </span>
        <h1 className="text-3xl font-bold">{t('cart.emptyTitle')}</h1>
        <p className="text-muted-foreground">{t('checkout.emptyText')}</p>
        <div className="flex gap-2">
          <Link href="/flavors" className={buttonVariants()}>
            {t('cart.browse')}
          </Link>
          <Link href="/menu" className={buttonVariants({ variant: 'outline' })}>
            {t('cart.seeMenu')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="mb-8 text-4xl font-bold uppercase tracking-wide">{t('checkout.title')}</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
          <Card className="space-y-4 p-6">
            <h2 className="text-xl font-bold">{t('checkout.details')}</h2>
            <Field label={t('checkout.fullName')} htmlFor="checkout-name" error={errors.name?.message}>
              <Input id="checkout-name" autoComplete="name" aria-invalid={errors.name ? true : undefined} aria-describedby={errors.name ? 'checkout-name-error' : undefined} {...register('name')} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t('checkout.email')} htmlFor="checkout-email" error={errors.email?.message}>
                <Input id="checkout-email" type="email" autoComplete="email" aria-invalid={errors.email ? true : undefined} aria-describedby={errors.email ? 'checkout-email-error' : undefined} {...register('email')} />
              </Field>
              <Field label={t('checkout.phone')} htmlFor="checkout-phone" error={errors.phone?.message}>
                <Input id="checkout-phone" type="tel" autoComplete="tel" aria-invalid={errors.phone ? true : undefined} aria-describedby={errors.phone ? 'checkout-phone-error' : undefined} {...register('phone')} />
              </Field>
            </div>
          </Card>

          <Card className="space-y-4 p-6">
            <h2 className="text-xl font-bold">{t('checkout.pickupOrDelivery')}</h2>
            <div role="radiogroup" aria-label={t('checkout.pickupOrDelivery')} className="grid gap-3 sm:grid-cols-2">
              {FULFILMENT_OPTIONS.map(({ value, icon: Icon }) => (
                <label
                  key={value}
                  className={cn(
                    'flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
                    fulfilment === value ? 'border-primary bg-blush' : 'border-border hover:border-primary/60',
                  )}
                >
                  <input type="radio" value={value} className="sr-only" {...register('fulfilment')} />
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <span>
                    <span className="block font-semibold">{value === 'pickup' ? t('checkout.pickup') : t('checkout.delivery')}</span>
                    <span className="block text-xs text-muted-foreground">{value === 'pickup' ? t('checkout.pickupHint') : t('checkout.deliveryHint')}</span>
                  </span>
                </label>
              ))}
            </div>

            {fulfilment === 'delivery' ? (
              <Field label={t('checkout.address')} htmlFor="checkout-address" error={errors.address?.message}>
                <Input id="checkout-address" autoComplete="street-address" aria-invalid={errors.address ? true : undefined} aria-describedby={errors.address ? 'checkout-address-error' : undefined} {...register('address')} />
              </Field>
            ) : (
              <Field label={t('checkout.store')} htmlFor="checkout-store" error={errors.storeId?.message}>
                <Select id="checkout-store" aria-invalid={errors.storeId ? true : undefined} aria-describedby={errors.storeId ? 'checkout-store-error' : undefined} {...register('storeId')}>
                  <option value="">{t('checkout.chooseStore')}</option>
                  {stores.map((store) => {
                    const status = now === null ? null : getStoreStatus(store, new Date(now));
                    return (
                      <option key={store.id} value={store.id}>
                        {store.name} - {store.address}
                        {status && !status.open ? t('checkout.closedNow') : ''}
                      </option>
                    );
                  })}
                </Select>
              </Field>
            )}

            <Field label={t('checkout.when')} htmlFor="checkout-time" error={errors.scheduledFor?.message}>
              <Select id="checkout-time" aria-invalid={errors.scheduledFor ? true : undefined} aria-describedby={errors.scheduledFor ? 'checkout-time-error' : undefined} {...register('scheduledFor')}>
                <option value="">{t('checkout.chooseTime')}</option>
                {timing.asap && <option value="asap">{t('checkout.asap')}</option>}
                {timing.slots.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {describeSlot(slot, i18n)}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label={t('checkout.notes')} htmlFor="checkout-notes" error={errors.notes?.message} hint={t('checkout.notesHint')}>
              <Textarea id="checkout-notes" className="min-h-20" {...register('notes')} />
            </Field>
          </Card>
        </form>

        <aside aria-label={t('checkout.summary')}>
          <Card className="sticky top-32 space-y-4 p-6">
            <h2 className="text-xl font-bold">{t('checkout.summary')}</h2>
            <ul className="divide-y text-sm">
              {lines.map((line) => (
                <li key={line.id} className="flex justify-between gap-3 py-2">
                  <span>{t('common.quantity', { count: line.quantity, name: localizeLine(line, i18n).name })}</span>
                  <span className="shrink-0">{formatCurrency(line.unitPrice * line.quantity)}</span>
                </li>
              ))}
            </ul>
            <PromoCodeForm id="checkout-promo" />
            <PricingBreakdown pricing={pricing} promoCode={promo?.code} showDelivery={fulfilment === 'delivery'} />
            <Button type="submit" form="checkout-form" size="lg" loading={isSubmitting} className="w-full">
              {t('checkout.place')}
            </Button>
            <p className="text-center text-xs text-muted-foreground">{t('checkout.demo')}</p>
          </Card>
        </aside>
      </div>
    </div>
  );
}
