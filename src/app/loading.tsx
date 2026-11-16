import { Skeleton } from '@/components/ui/Skeleton';
import { getI18n } from '@/i18n/server';

export default async function Loading() {
  const { t } = await getI18n();
  return (
    <div className="container space-y-6 py-12" role="status" aria-label={t('common.loading')}>
      <Skeleton className="h-10 w-1/3" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-56" />
        ))}
      </div>
    </div>
  );
}
