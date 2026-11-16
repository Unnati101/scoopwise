'use client';

import { Button } from '@/components/ui/Button';
import { useI18n } from '@/i18n/provider';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  const { t } = useI18n();
  return (
    <section className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center" role="alert">
      <h1 className="text-3xl font-bold">{t('states.somethingWrong')}</h1>
      <p className="max-w-md text-muted-foreground">{t('states.snag')}</p>
      <Button onClick={reset}>{t('common.tryAgain')}</Button>
    </section>
  );
}
