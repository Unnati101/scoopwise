import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/PageHero';
import { IceCreamBuilder } from '@/features/builder/IceCreamBuilder';
import { localizeFlavor, localizeMenuItem } from '@/i18n/localize';
import { getI18n } from '@/i18n/server';
import { flavorService } from '@/services/flavorService';
import { menuService } from '@/services/menuService';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t('meta.titles.build'), description: t('meta.descriptions.build') };
}

export default async function BuildPage({ searchParams }: { searchParams: Promise<{ flavor?: string }> }) {
  const [rawFlavors, grouped, { flavor }, { t, m }] = await Promise.all([
    flavorService.list(),
    menuService.listByCategories(['Toppings']),
    searchParams,
    getI18n(),
  ]);
  const flavors = rawFlavors.map((item) => localizeFlavor(item, m));
  const toppings = grouped.Toppings.map((item) => localizeMenuItem(item, m));
  return (
    <>
      <PageHero eyebrow={t('builder.hero.eyebrow')} title={t('builder.hero.title')} description={t('builder.hero.text')} />
      <IceCreamBuilder key={flavor ?? ''} flavors={flavors} toppings={toppings} initialFlavorId={flavor} />
    </>
  );
}
