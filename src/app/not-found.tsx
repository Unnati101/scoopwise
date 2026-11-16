import { IceCreamCone } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/Button';
import { getI18n } from '@/i18n/server';

export default async function NotFound() {
  const { t } = await getI18n();
  return (
    <section className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
      <span className="flex h-24 w-24 items-center justify-center rounded-full bg-blush text-primary">
        <IceCreamCone className="h-12 w-12" aria-hidden />
      </span>
      <h1 className="text-4xl font-bold">{t('states.notFoundTitle')}</h1>
      <p className="max-w-md text-muted-foreground">{t('states.notFoundText')}</p>
      <Link href="/" className={buttonVariants()}>
        {t('common.backHome')}
      </Link>
    </section>
  );
}
