import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/PageHero';
import { FlavorExplorer } from '@/features/flavors/FlavorExplorer';
import { PersonalizedPicks } from '@/features/recommendations/PersonalizedPicks';
import { localizeFlavor } from '@/i18n/localize';
import { getI18n } from '@/i18n/server';
import { flavorService } from '@/services/flavorService';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t('meta.titles.flavors'), description: t('meta.descriptions.flavors') };
}

export default async function FlavorsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const [rawFlavors, { q }, { t, m }] = await Promise.all([flavorService.list(), searchParams, getI18n()]);
  const flavors = rawFlavors.map((flavor) => localizeFlavor(flavor, m));
  return (
    <>
      <PageHero eyebrow={t('flavors.hero.eyebrow')} title={t('flavors.hero.title')} description={t('flavors.hero.text')} />
      <PersonalizedPicks flavors={flavors} onlyWhenPersonalized />
      <FlavorExplorer key={q ?? ''} flavors={flavors} initialQuery={q ?? ''} />
    </>
  );
}
