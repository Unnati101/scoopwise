import type { Metadata } from 'next';
import { CheckoutView } from '@/features/checkout/CheckoutView';
import { localizeStore } from '@/i18n/localize';
import { getI18n } from '@/i18n/server';
import { storeService } from '@/services/storeService';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t('meta.titles.checkout') };
}

export default async function CheckoutPage() {
  const [stores, { m }] = await Promise.all([storeService.list(), getI18n()]);
  return <CheckoutView stores={stores.map((store) => localizeStore(store, m))} />;
}
