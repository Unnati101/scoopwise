import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/PageHero';
import { PlansView } from '@/features/plans/PlansView';
import { localizeFlavor } from '@/i18n/localize';
import { getI18n } from '@/i18n/server';
import { flavorService } from '@/services/flavorService';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t('meta.titles.plans'), description: t('meta.descriptions.plans') };
}

export default async function PlansPage() {
  const [flavors, { t, m }] = await Promise.all([flavorService.list(), getI18n()]);
  return (
    <>
      <PageHero eyebrow={t('plans.hero.eyebrow')} title={t('plans.hero.title')} description={t('plans.hero.text')} />
      <PlansView flavors={flavors.map((flavor) => localizeFlavor(flavor, m))} />
    </>
  );
}
