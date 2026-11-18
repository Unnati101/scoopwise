'use client';

import { Check, Crown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button, buttonVariants } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PLANS, planPrice, type Plan } from '@/data/plans';
import { SubscribeDialog } from '@/features/plans/SubscribeDialog';
import { useLocalStore } from '@/hooks/useLocalStore';
import { useI18n } from '@/i18n/provider';
import { subscriptionStore } from '@/lib/subscription';
import { cn } from '@/lib/utils';
import type { Flavor } from '@/types';

export function PlansView({ flavors }: { flavors: Flavor[] }) {
  const { t, m, formatCurrency } = useI18n();
  const subscription = useLocalStore(subscriptionStore);
  const [choosing, setChoosing] = useState<Plan | null>(null);
  const current = subscription && subscription.status !== 'cancelled' ? subscription : null;

  return (
    <>
      <section className="container py-12" aria-label={m.nav.plans}>
        <ul className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan, index) => {
            const text = m.data.plans[plan.id];
            const isCurrent = current?.planId === plan.id;
            return (
              <Reveal as="li" key={plan.id} delay={index * 100}>
                <Card className={cn('relative flex h-full flex-col gap-5 p-6 transition duration-200 hover:-translate-y-1 hover:shadow-soft', plan.popular && 'border-2 border-primary shadow-soft')}>
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-6 bg-primary text-primary-foreground">
                      <Crown className="h-3 w-3" aria-hidden />
                      {t('plans.popular')}
                    </Badge>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold">{text?.name}</h2>
                    <p className="text-sm text-muted-foreground">{text?.tagline}</p>
                  </div>
                  <div>
                    <p className="font-display text-4xl font-bold text-primary">{formatCurrency(planPrice(plan))}</p>
                    <p className="text-sm text-muted-foreground">{t('plans.perDelivery')}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="secondary">{t('plans.pints', { count: plan.pints })}</Badge>
                      <Badge variant="accent">{t('plans.save', { percent: plan.savingsPercent })}</Badge>
                    </div>
                  </div>
                  <ul className="flex-1 space-y-2 text-sm">
                    {text?.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
                        {perk}
                      </li>
                    ))}
                  </ul>
                  {current ? (
                    <Link href="/subscription" className={buttonVariants({ variant: isCurrent ? 'outline' : 'soft' })}>
                      {isCurrent ? t('plans.current') : t('plans.manage')}
                    </Link>
                  ) : (
                    <Button size="lg" onClick={() => setChoosing(plan)}>
                      {t('plans.choose', { plan: text?.name ?? plan.id })}
                    </Button>
                  )}
                </Card>
              </Reveal>
            );
          })}
        </ul>
        <p className="mt-6 text-center text-xs text-muted-foreground">{t('plans.dialog.demo')}</p>
      </section>

      <section className="container pb-4" aria-labelledby="how-plans-heading">
        <SectionHeading id="how-plans-heading" title={t('plans.howTitle')} eyebrow={t('plans.howEyebrow')} className="justify-center text-center" />
        <ol className="grid gap-4 sm:grid-cols-3">
          {m.plans.how.map((step, index) => (
            <Reveal as="li" key={step.title} delay={index * 100}>
              <Card className="h-full p-6 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blush font-display text-xl font-bold text-primary">{index + 1}</span>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
              </Card>
            </Reveal>
          ))}
        </ol>
      </section>

      {choosing && <SubscribeDialog plan={choosing} flavors={flavors} onClose={() => setChoosing(null)} />}
    </>
  );
}
