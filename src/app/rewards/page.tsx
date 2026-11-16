import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/PageHero';
import { RewardsView } from '@/features/rewards/RewardsView';
import { getI18n } from '@/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t('meta.titles.rewards'), description: t('meta.descriptions.rewards') };
}

export default async function RewardsPage() {
  const { t } = await getI18n();
  return (
    <>
      <PageHero eyebrow={t('rewards.hero.eyebrow')} title={t('rewards.hero.title')} description={t('rewards.hero.text')} />
      <RewardsView />
    </>
  );
}
