import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/PageHero';
import { OrdersView } from '@/features/orders/OrdersView';
import { getI18n } from '@/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t('meta.titles.orders'), description: t('meta.descriptions.orders') };
}

export default async function OrdersPage() {
  const { t } = await getI18n();
  return (
    <>
      <PageHero eyebrow={t('orders.hero.eyebrow')} title={t('orders.hero.title')} description={t('orders.hero.text')} />
      <OrdersView />
    </>
  );
}
