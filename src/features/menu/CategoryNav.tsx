import { getI18n } from '@/i18n/server';
import type { MenuCategory } from '@/types';

export async function CategoryNav({ categories }: { categories: MenuCategory[] }) {
  const { t, m } = await getI18n();
  return (
    <nav aria-label={t('menu.categoriesLabel')} className="sticky top-[6.5rem] z-30 border-b bg-background/90 backdrop-blur">
      <ul className="container flex gap-2 overflow-x-auto py-3">
        {categories.map((category) => (
          <li key={category}>
            <a
              href={`#${category.toLowerCase()}`}
              className="inline-block whitespace-nowrap rounded-full border-2 border-border bg-surface px-4 py-1.5 text-sm font-semibold hover:border-primary hover:text-primary"
            >
              {m.data.menuCategories[category]?.name ?? category}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
