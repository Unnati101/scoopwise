import Link from 'next/link';
import { ScoopCup } from '@/components/illustrations/ScoopCup';
import { buttonVariants } from '@/components/ui/Button';
import { getI18n } from '@/i18n/server';

export async function OrderBanner() {
  const { t } = await getI18n();
  return (
    <section className="container pt-16" aria-labelledby="order-heading">
      <div className="relative flex flex-col items-center justify-between gap-4 overflow-hidden rounded-2xl bg-gradient-berry px-6 py-8 text-center text-primary-foreground shadow-soft sm:flex-row sm:px-10 sm:text-left">
        <ScoopCup color="#F6E3B0" className="hidden h-24 w-24 shrink-0 sm:block" />
        <div className="flex-1">
          <h2 id="order-heading" className="text-2xl font-bold uppercase tracking-wide sm:text-3xl">
            {t('home.order.title')}
          </h2>
          <p className="mt-1 text-sm text-primary-foreground/90">{t('home.order.text')}</p>
        </div>
        <Link href="/menu" className={buttonVariants({ variant: 'secondary', size: 'lg' })}>
          {t('home.order.cta')}
        </Link>
      </div>
    </section>
  );
}
