'use client';

import { Receipt } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/Button';
import { OrderCard } from '@/features/orders/OrderCard';
import { useLocalStore } from '@/hooks/useLocalStore';
import { useI18n } from '@/i18n/provider';
import { ordersStore } from '@/lib/ordersStore';

export function OrdersView() {
  const orders = useLocalStore(ordersStore);
  const { t } = useI18n();

  if (orders.length === 0) {
    return (
      <div className="container flex max-w-xl flex-col items-center gap-4 py-16 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-blush text-primary">
          <Receipt className="h-10 w-10" aria-hidden />
        </span>
        <h2 className="text-2xl font-bold">{t('orders.emptyTitle')}</h2>
        <p className="text-muted-foreground">{t('orders.emptyText')}</p>
        <Link href="/flavors" className={buttonVariants()}>
          {t('orders.start')}
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl space-y-4 py-10">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
      <p className="text-center text-xs text-muted-foreground">{t('orders.demoNote')}</p>
    </div>
  );
}
