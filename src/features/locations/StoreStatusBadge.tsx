'use client';

import { useNow } from '@/hooks/useNow';
import { describeStoreStatus } from '@/i18n/localize';
import { useI18n } from '@/i18n/provider';
import { getStoreStatus } from '@/lib/storeHours';
import { cn } from '@/lib/utils';
import type { Store } from '@/types';

export function StoreStatusBadge({ store }: { store: Store }) {
  const now = useNow(60_000);
  const i18n = useI18n();
  if (now === null) return <span className="inline-block h-6 w-40" aria-hidden />;

  const status = getStoreStatus(store, new Date(now));
  return (
    <p
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold',
        status.open ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground',
      )}
    >
      <span className={cn('h-2 w-2 rounded-full', status.open ? 'bg-success' : 'bg-muted-foreground')} aria-hidden />
      {describeStoreStatus(status, i18n)}
    </p>
  );
}
