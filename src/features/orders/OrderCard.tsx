'use client';

import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useCartUi } from '@/features/cart/CartProvider';
import { OrderTracker } from '@/features/orders/OrderTracker';
import { localizeLine } from '@/i18n/localize';
import { useI18n } from '@/i18n/provider';
import { cartStore } from '@/lib/cartStore';
import type { Order } from '@/types';

export function OrderCard({ order }: { order: Order }) {
  const { open } = useCartUi();
  const i18n = useI18n();
  const { t, m, formatCurrency, formatDateTime } = i18n;
  const destination = order.storeId ? (m.data.stores[order.storeId] ?? order.destination) : order.destination;

  const reorder = () => {
    order.lines.forEach(({ quantity, ...item }) => cartStore.add(item, quantity));
    toast.success(t('orders.reordered'));
    open();
  };

  return (
    <Card className="space-y-5 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">{t('orders.order', { id: order.id })}</h2>
          <p className="text-sm text-muted-foreground">{t('orders.placedAt', { date: formatDateTime(order.createdAt) })}</p>
        </div>
        <Badge variant="secondary">{order.fulfilment === 'delivery' ? t('orders.delivery') : t('orders.pickup')}</Badge>
      </div>

      <OrderTracker order={order} />

      <div className="grid gap-5 border-t pt-5 sm:grid-cols-2">
        <ul className="space-y-1 text-sm">
          {order.lines.map((line) => (
            <li key={line.id} className="flex justify-between gap-3">
              <span>{t('common.quantity', { count: line.quantity, name: localizeLine(line, i18n).name })}</span>
              <span className="shrink-0 text-muted-foreground">{formatCurrency(line.unitPrice * line.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="space-y-1 text-sm">
          <p>
            <span className="text-muted-foreground">{order.fulfilment === 'delivery' ? t('orders.deliveringTo') : t('orders.pickupAt')}</span> {destination}
          </p>
          <p>
            <span className="text-muted-foreground">{t('orders.when')}</span> {order.scheduledFor === 'asap' ? t('orders.asap') : formatDateTime(order.scheduledFor)}
          </p>
          {order.promoCode && (
            <p>
              <span className="text-muted-foreground">{t('orders.promo')}</span> {order.promoCode}
            </p>
          )}
          <p className="font-display text-lg font-semibold">{t('orders.total', { total: formatCurrency(order.total) })}</p>
        </div>
      </div>

      <Button variant="outline" size="sm" onClick={reorder}>
        <RotateCcw className="h-4 w-4" aria-hidden />
        {t('orders.reorder')}
      </Button>
    </Card>
  );
}
