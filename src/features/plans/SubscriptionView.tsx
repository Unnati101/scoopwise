'use client';

import { CalendarClock, CircleSlash, PauseCircle, PlayCircle, SkipForward } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/Badge';
import { Button, buttonVariants } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Dialog } from '@/components/ui/Dialog';
import { PLANS, planPrice } from '@/data/plans';
import { useLocalStore } from '@/hooks/useLocalStore';
import { useI18n } from '@/i18n/provider';
import { findPlan, subscriptionActions, subscriptionStore, upcomingDeliveries } from '@/lib/subscription';
import type { Flavor } from '@/types';

const STATUS_VARIANT = { active: 'secondary', paused: 'accent', cancelled: 'muted' } as const;

export function SubscriptionView({ flavors }: { flavors: Flavor[] }) {
  const { t, m, formatCurrency, formatDate } = useI18n();
  const subscription = useLocalStore(subscriptionStore);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const closeCancel = useCallback(() => setConfirmingCancel(false), []);

  if (!subscription) {
    return (
      <div className="container flex max-w-xl flex-col items-center gap-4 py-16 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-blush text-primary">
          <CalendarClock className="h-10 w-10" aria-hidden />
        </span>
        <h2 className="text-2xl font-bold">{t('subscription.emptyTitle')}</h2>
        <p className="text-muted-foreground">{t('subscription.emptyText')}</p>
        <Link href="/plans" className={buttonVariants()}>
          {t('subscription.seePlans')}
        </Link>
      </div>
    );
  }

  const plan = findPlan(subscription.planId);
  const planText = m.data.plans[subscription.planId];
  const chosen = subscription.flavorIds.flatMap((id) => flavors.find((flavor) => flavor.id === id) ?? []);
  const isActive = subscription.status === 'active';
  const isCancelled = subscription.status === 'cancelled';

  const skip = () => {
    subscriptionActions.skip();
    const next = subscriptionStore.getSnapshot()?.nextDelivery;
    if (next) toast.success(t('subscription.skippedToast', { date: formatDate(next) }));
  };

  const resume = () => {
    subscriptionActions.resume();
    const next = subscriptionStore.getSnapshot()?.nextDelivery;
    if (next) toast.success(t('subscription.resumed', { date: formatDate(next) }));
  };

  const pause = () => {
    subscriptionActions.pause();
    toast(t('subscription.paused'));
  };

  const confirmCancel = () => {
    subscriptionActions.cancel();
    setConfirmingCancel(false);
    toast(t('subscription.cancelled'));
  };

  const switchTo = (planId: string) => {
    subscriptionActions.switchPlan(
      planId,
      flavors.map((flavor) => flavor.id),
    );
    toast.success(t('subscription.switched', { plan: m.data.plans[planId]?.name ?? planId }));
  };

  return (
    <div className="container max-w-4xl space-y-6 py-10">
      <Card className="space-y-6 p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">{t('subscription.plan')}</p>
            <h2 className="text-3xl font-bold">{planText?.name}</h2>
            {plan && (
              <p className="text-sm text-muted-foreground">
                {formatCurrency(planPrice(plan))} {t('plans.perDelivery')} &middot; {m.plans.frequency[subscription.frequency]}
              </p>
            )}
          </div>
          <Badge variant={STATUS_VARIANT[subscription.status]}>{m.subscription.status[subscription.status]}</Badge>
        </div>

        {isActive && (
          <div className="flex items-center gap-3 rounded-xl bg-blush p-4">
            <CalendarClock className="h-6 w-6 shrink-0 text-primary" aria-hidden />
            <div>
              <p className="text-sm text-muted-foreground">{t('subscription.nextDelivery')}</p>
              <p className="font-display text-xl font-semibold">{formatDate(subscription.nextDelivery)}</p>
            </div>
          </div>
        )}
        {subscription.status === 'paused' && <p className="rounded-xl bg-muted p-4 text-sm">{t('subscription.pausedNote')}</p>}
        {isCancelled && <p className="rounded-xl bg-muted p-4 text-sm">{t('subscription.cancelledNote')}</p>}

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 text-lg font-semibold">{t('subscription.flavors')}</h3>
            <ul className="space-y-1 text-sm">
              {chosen.map((flavor) => (
                <li key={flavor.id} className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full border" style={{ backgroundColor: flavor.color }} aria-hidden />
                  {flavor.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="mb-1 text-lg font-semibold">{t('subscription.deliverTo')}</h3>
              <p>{subscription.name}</p>
              <p className="text-muted-foreground">{subscription.address}</p>
              <p className="text-muted-foreground">{subscription.email}</p>
            </div>
            {isActive && (
              <div>
                <h3 className="mb-1 text-lg font-semibold">{t('subscription.upcoming')}</h3>
                <ul className="space-y-1">
                  {upcomingDeliveries(subscription).map((date) => (
                    <li key={date}>{formatDate(date)}</li>
                  ))}
                  {subscription.skipped.map((date) => (
                    <li key={`skipped-${date}`} className="text-muted-foreground line-through">
                      {formatDate(date)} <span className="no-underline">({t('subscription.skipped')})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t pt-5">
          {isActive && (
            <>
              <Button onClick={skip}>
                <SkipForward className="h-4 w-4" aria-hidden />
                {t('subscription.skip')}
              </Button>
              <Button variant="outline" onClick={pause}>
                <PauseCircle className="h-4 w-4" aria-hidden />
                {t('subscription.pause')}
              </Button>
            </>
          )}
          {subscription.status === 'paused' && (
            <Button onClick={resume}>
              <PlayCircle className="h-4 w-4" aria-hidden />
              {t('subscription.resume')}
            </Button>
          )}
          {!isCancelled && (
            <Button variant="ghost" onClick={() => setConfirmingCancel(true)} className="text-danger">
              <CircleSlash className="h-4 w-4" aria-hidden />
              {t('subscription.cancel')}
            </Button>
          )}
          {isCancelled && (
            <Link href="/plans" className={buttonVariants()}>
              {t('subscription.resubscribe')}
            </Link>
          )}
        </div>
      </Card>

      {!isCancelled && (
        <Card className="space-y-4 p-6 sm:p-8">
          <div>
            <h3 className="text-xl font-bold">{t('subscription.changePlan')}</h3>
            <p className="text-sm text-muted-foreground">{t('subscription.changePlanText')}</p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-3">
            {PLANS.filter((other) => other.id !== subscription.planId).map((other) => {
              const name = m.data.plans[other.id]?.name ?? other.id;
              return (
                <li key={other.id} className="flex flex-col gap-2 rounded-xl border p-4">
                  <p className="font-semibold">{name}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('plans.pints', { count: other.pints })} &middot; {formatCurrency(planPrice(other))}
                  </p>
                  <Button variant="soft" size="sm" onClick={() => switchTo(other.id)}>
                    {t('subscription.switchTo', { plan: name })}
                  </Button>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      <p className="text-center text-xs text-muted-foreground">{t('subscription.demoNote')}</p>

      <Dialog open={confirmingCancel} onClose={closeCancel} title={t('subscription.cancelTitle')}>
        <p className="mt-3 text-sm text-muted-foreground">{t('subscription.cancelText')}</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={closeCancel}>
            {t('subscription.keep')}
          </Button>
          <Button variant="destructive" onClick={confirmCancel}>
            {t('subscription.confirmCancel')}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
