'use client';

import { Check } from 'lucide-react';
import { useNow } from '@/hooks/useNow';
import { useI18n } from '@/i18n/provider';
import { ORDER_STAGES, getOrderProgress } from '@/lib/orderStatus';
import { cn } from '@/lib/utils';
import type { Order } from '@/types';

export function OrderTracker({ order }: { order: Order }) {
  const now = useNow(1000);
  const { t, m, formatDateTime } = useI18n();
  if (now === null) return null;

  const { index, done } = getOrderProgress(order, now);
  const labels = ORDER_STAGES.map((stage) => m.orders.stages[order.fulfilment][stage]);

  return (
    <div>
      <p className="text-sm font-semibold" role="status">
        {index === -1 ? t('orders.scheduledFor', { date: formatDateTime(order.scheduledFor) }) : done ? labels[index] : `${labels[index]}...`}
      </p>
      <ol className="mt-3 grid grid-cols-4 gap-2" aria-label={t('orders.progress')}>
        {labels.map((label, stepIndex) => {
          const complete = stepIndex <= index;
          return (
            <li key={label} aria-current={stepIndex === index && !done ? 'step' : undefined} className="space-y-2">
              <div className={cn('h-1.5 rounded-full transition-colors duration-500', complete ? 'bg-primary' : 'bg-border')} />
              <p className={cn('flex items-center gap-1 text-[0.7rem] leading-tight sm:text-xs', complete ? 'font-semibold text-foreground' : 'text-muted-foreground')}>
                {complete && <Check className="h-3 w-3 shrink-0 text-success" aria-hidden />}
                {label}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
