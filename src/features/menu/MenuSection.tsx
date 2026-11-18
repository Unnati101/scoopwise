import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/ui/Reveal';
import { AddToCartButton } from '@/features/cart/AddToCartButton';
import { CATEGORY_ICONS } from '@/features/menu/categories';
import { getI18n } from '@/i18n/server';
import { localizeMenuItem } from '@/i18n/localize';
import type { MenuCategory, MenuItem } from '@/types';

export async function MenuSection({ category, items }: { category: MenuCategory; items: MenuItem[] }) {
  const { m, formatCurrency } = await getI18n();
  const Icon = CATEGORY_ICONS[category];
  const meta = m.data.menuCategories[category];
  const description = meta?.description ?? '';
  return (
    <section id={category.toLowerCase()} aria-labelledby={`${category}-heading`} className="scroll-mt-40 pt-12">
      <Reveal className="mb-6 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blush text-primary">
          <Icon className="h-6 w-6" aria-hidden />
        </span>
        <div>
          <h2 id={`${category}-heading`} className="text-2xl font-bold">
            {meta?.name ?? category}
          </h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </Reveal>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((rawItem, index) => {
          const item = localizeMenuItem(rawItem, m);
          return (
            <Reveal as="li" key={item.id} delay={(index % 3) * 80}>
              <Card className="flex h-full flex-col gap-3 p-5 transition duration-200 hover:-translate-y-1 hover:shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold leading-tight">{item.name}</h3>
                  <span className="font-display text-lg font-semibold text-primary">{formatCurrency(item.price)}</span>
                </div>
                <p className="flex-1 text-sm text-muted-foreground">{item.description}</p>
                <AddToCartButton item={{ id: item.id, kind: 'menu', name: item.name, unitPrice: item.price }} className="w-full" />
              </Card>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
