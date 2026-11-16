'use client';

import { Gift, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CodeRow } from '@/features/rewards/CodeRow';
import { useLocalStore } from '@/hooks/useLocalStore';
import { useI18n } from '@/i18n/provider';
import { ordersStore } from '@/lib/ordersStore';
import { PROMOS, rewardCodesStore } from '@/lib/promos';
import { REWARD_OPTIONS, RUPEES_PER_POINT, earnedPoints, getTierProgress, pointsSpentStore, redeemReward, type RewardOption } from '@/lib/rewards';

export function RewardsView() {
  const orders = useLocalStore(ordersStore);
  const spent = useLocalStore(pointsSpentStore);
  const rewardCodes = useLocalStore(rewardCodesStore);
  const { t, m, formatCurrency } = useI18n();

  const lifetime = earnedPoints(orders);
  const balance = Math.max(0, lifetime - spent);
  const { tier, next, progress, pointsToNext } = getTierProgress(lifetime);
  const tierText = m.data.tiers[tier.id];

  const redeem = (option: RewardOption) => {
    const reward = redeemReward(option, balance);
    if (reward) toast.success(t('rewards.unlocked', { code: reward.code, amount: formatCurrency(reward.value) }));
  };

  return (
    <div className="container max-w-4xl space-y-8 py-10">
      <Card className="grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="text-center sm:text-left">
          <p className="text-sm font-semibold text-muted-foreground">{t('rewards.balance')}</p>
          <p className="font-display text-5xl font-bold text-primary" data-testid="points-balance">
            {balance}
          </p>
          <p className="text-sm text-muted-foreground">{t('rewards.points')}</p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="accent">
              <Sparkles className="h-3 w-3" aria-hidden />
              {tierText?.name}
            </Badge>
            <p className="text-sm text-muted-foreground">{tierText?.perk}</p>
          </div>
          <div
            role="progressbar"
            aria-label={t('rewards.progressLabel')}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            className="h-3 overflow-hidden rounded-full bg-muted"
          >
            <div className="h-full rounded-full bg-gradient-berry transition-all duration-500" style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
          <p className="text-sm text-muted-foreground">
            {next ? t('rewards.toNext', { count: pointsToNext, tier: m.data.tiers[next.id]?.name ?? '' }) : t('rewards.topTier')}
          </p>
        </div>
      </Card>

      <section aria-labelledby="redeem-heading">
        <h2 id="redeem-heading" className="mb-4 text-2xl font-bold">
          {t('rewards.redeemTitle')}
        </h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {REWARD_OPTIONS.map((option) => (
            <li key={option.cost}>
              <Card className="flex h-full flex-col items-center gap-2 p-5 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blush text-primary">
                  <Gift className="h-6 w-6" aria-hidden />
                </span>
                <p className="font-display text-2xl font-bold">{t('rewards.off', { amount: formatCurrency(option.value) })}</p>
                <p className="text-sm text-muted-foreground">{t('rewards.pointsCost', { count: option.cost })}</p>
                <Button size="sm" className="mt-auto w-full" disabled={balance < option.cost} onClick={() => redeem(option)}>
                  {balance < option.cost ? t('rewards.morePoints', { count: option.cost - balance }) : t('rewards.redeem')}
                </Button>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      {rewardCodes.length > 0 && (
        <section aria-labelledby="codes-heading">
          <h2 id="codes-heading" className="mb-4 text-2xl font-bold">
            {t('rewards.codesTitle')}
          </h2>
          <ul className="space-y-3">
            {rewardCodes.map((reward) => (
              <CodeRow key={reward.code} code={reward.code} description={t('rewards.codeDescription', { amount: formatCurrency(reward.value) })} />
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="offers-heading">
        <h2 id="offers-heading" className="mb-4 text-2xl font-bold">
          {t('rewards.offersTitle')}
        </h2>
        <ul className="space-y-3">
          {PROMOS.map((promo) => (
            <CodeRow key={promo.code} code={promo.code} description={m.data.promos[promo.code] ?? promo.label} />
          ))}
        </ul>
      </section>

      <section aria-labelledby="how-heading">
        <h2 id="how-heading" className="mb-4 text-2xl font-bold">
          {t('rewards.howTitle')}
        </h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          <li className="rounded-2xl border bg-surface p-5 shadow-card">
            <p className="font-display text-lg font-semibold">{t('rewards.step1Title')}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t('rewards.step1Text', { amount: formatCurrency(RUPEES_PER_POINT) })}</p>
          </li>
          <li className="rounded-2xl border bg-surface p-5 shadow-card">
            <p className="font-display text-lg font-semibold">{t('rewards.step2Title')}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t('rewards.step2Text')}</p>
          </li>
          <li className="rounded-2xl border bg-surface p-5 shadow-card">
            <p className="font-display text-lg font-semibold">{t('rewards.step3Title')}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t('rewards.step3Text')}</p>
          </li>
        </ol>
      </section>
      <p className="text-center text-xs text-muted-foreground">{t('rewards.demoNote')}</p>
    </div>
  );
}
