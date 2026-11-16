import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/PageHero';
import { SubscriptionView } from '@/features/plans/SubscriptionView';
import { localizeFlavor } from '@/i18n/localize';
import { getI18n } from '@/i18n/server';
import { flavorService } from '@/services/flavorService';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t('meta.titles.subscription'), description: t('meta.descriptions.subscription') };
}

export default async function SubscriptionPage() {
  const [flavors, { t, m }] = await Promise.all([flavorService.list(), getI18n()]);
  return (
    <>
      <PageHero eyebrow={t('subscription.hero.eyebrow')} title={t('subscription.hero.title')} description={t('subscription.hero.text')} />
      <SubscriptionView flavors={flavors.map((flavor) => localizeFlavor(flavor, m))} />
    </>
  );
}
