import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/PageHero';
import { CategoryNav } from '@/features/menu/CategoryNav';
import { MenuSection } from '@/features/menu/MenuSection';
import { getI18n } from '@/i18n/server';
import { menuService } from '@/services/menuService';
import type { MenuCategory } from '@/types';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t('meta.titles.menu'), description: t('meta.descriptions.menu') };
}

const CATEGORIES: MenuCategory[] = ['Cones', 'Cups', 'Shakes', 'Toppings'];

export default async function MenuPage() {
  const [grouped, { t }] = await Promise.all([menuService.listByCategories(CATEGORIES), getI18n()]);
  return (
    <>
      <PageHero eyebrow={t('menu.hero.eyebrow')} title={t('menu.hero.title')} description={t('menu.hero.text')} />
      <CategoryNav categories={CATEGORIES} />
      <div className="container pb-4">
        {CATEGORIES.map((category) => (
          <MenuSection key={category} category={category} items={grouped[category]} />
        ))}
      </div>
    </>
  );
}
