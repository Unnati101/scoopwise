'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { planPrice, type Plan } from '@/data/plans';
import { useNow } from '@/hooks/useNow';
import { useI18n } from '@/i18n/provider';
import { SUBSCRIPTION_FREQUENCIES, subscribeSchema, type SubscribeValues } from '@/lib/schemas';
import { firstDeliveryAfter, subscriptionActions } from '@/lib/subscription';
import { cn } from '@/lib/utils';
import type { Flavor } from '@/types';

interface SubscribeDialogProps {
  plan: Plan;
  flavors: Flavor[];
  onClose: () => void;
}

export function SubscribeDialog({ plan, flavors, onClose }: SubscribeDialogProps) {
  const { t, m, formatCurrency, formatDate } = useI18n();
  const router = useRouter();
  const now = useNow(60_000);
  const [selected, setSelected] = useState<string[]>([]);
  const [pickError, setPickError] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SubscribeValues>({ resolver: zodResolver(subscribeSchema), defaultValues: { name: '', email: '', address: '', frequency: 'monthly' } });

  const planText = m.data.plans[plan.id];
  const firstDelivery = now === null ? null : formatDate(firstDeliveryAfter(now));
  const frequency = useWatch({ control, name: 'frequency' });

  const toggle = (id: string) => {
    setPickError(false);
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : current.length < plan.pints ? [...current, id] : current));
  };

  const onSubmit = (values: SubscribeValues) => {
    if (selected.length !== plan.pints) {
      setPickError(true);
      return;
    }
    const subscription = subscriptionActions.start({ ...values, planId: plan.id, flavorIds: selected });
    toast.success(t('plans.dialog.started', { date: formatDate(subscription.nextDelivery) }));
    onClose();
    router.push('/subscription');
  };

  return (
    <Dialog open onClose={onClose} title={t('plans.dialog.title', { plan: planText?.name ?? plan.id })} className="max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 space-y-6">
        <fieldset>
          <legend className="text-lg font-bold">{t('plans.dialog.flavors', { count: plan.pints })}</legend>
          <p className={cn('mb-3 text-sm', pickError ? 'font-medium text-danger' : 'text-muted-foreground')} role={pickError ? 'alert' : undefined} aria-live="polite">
            {pickError ? t('plans.dialog.flavorsError', { count: plan.pints }) : t('plans.dialog.selected', { selected: selected.length, count: plan.pints })}
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {flavors.map((flavor) => {
              const isSelected = selected.includes(flavor.id);
              return (
                <button
                  key={flavor.id}
                  type="button"
                  onClick={() => toggle(flavor.id)}
                  aria-pressed={isSelected}
                  disabled={!isSelected && selected.length >= plan.pints}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border-2 p-3 text-left text-sm font-semibold transition-colors disabled:opacity-40',
                    isSelected ? 'border-primary bg-blush' : 'border-border bg-surface hover:border-primary/60',
                  )}
                >
                  <span className="h-8 w-8 shrink-0 rounded-full border" style={{ backgroundColor: flavor.color }} aria-hidden />
                  {flavor.name}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-lg font-bold">{t('plans.dialog.details')}</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t('plans.dialog.name')} htmlFor="sub-name" error={errors.name?.message}>
              <Input id="sub-name" autoComplete="name" aria-invalid={errors.name ? true : undefined} aria-describedby={errors.name ? 'sub-name-error' : undefined} {...register('name')} />
            </Field>
            <Field label={t('plans.dialog.email')} htmlFor="sub-email" error={errors.email?.message}>
              <Input id="sub-email" type="email" autoComplete="email" aria-invalid={errors.email ? true : undefined} aria-describedby={errors.email ? 'sub-email-error' : undefined} {...register('email')} />
            </Field>
          </div>
          <Field label={t('plans.dialog.address')} htmlFor="sub-address" error={errors.address?.message}>
            <Input id="sub-address" autoComplete="street-address" aria-invalid={errors.address ? true : undefined} aria-describedby={errors.address ? 'sub-address-error' : undefined} {...register('address')} />
          </Field>

          <div role="radiogroup" aria-label={t('plans.dialog.frequency')} className="space-y-1.5">
            <p className="text-sm font-semibold">{t('plans.dialog.frequency')}</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {SUBSCRIPTION_FREQUENCIES.map((value) => (
                <label
                  key={value}
                  className={cn(
                    'cursor-pointer rounded-xl border-2 p-3 text-center text-sm font-semibold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
                    frequency === value ? 'border-primary bg-blush' : 'border-border bg-surface hover:border-primary/60',
                  )}
                >
                  <input type="radio" value={value} className="sr-only" {...register('frequency')} />
                  {m.plans.frequency[value]}
                </label>
              ))}
            </div>
          </div>
        </fieldset>

        <div className="space-y-1 rounded-xl bg-muted p-4 text-sm">
          <p className="font-semibold">{t('plans.dialog.priceLine', { price: formatCurrency(planPrice(plan)) })}</p>
          {firstDelivery && <p className="text-muted-foreground">{t('plans.dialog.summary', { date: firstDelivery })}</p>}
          <p className="text-xs text-muted-foreground">{t('plans.dialog.demo')}</p>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {t('plans.dialog.start')}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
