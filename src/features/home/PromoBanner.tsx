import Link from 'next/link';
import { ConePair } from '@/components/illustrations/ConePair';
import { buttonVariants } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { getI18n } from '@/i18n/server';

export async function PromoBanner() {
  const { t } = await getI18n();
  return (
    <Reveal as="section" aria-labelledby="deal-heading" className="relative flex flex-col items-center gap-4 overflow-hidden rounded-2xl bg-gradient-berry p-6 text-primary-foreground shadow-soft sm:flex-row sm:p-8 lg:col-span-3">
      <ConePair className="h-48 w-44 shrink-0 animate-float sm:h-56 sm:w-52" />
      <div className="text-center sm:text-left">
        <p className="font-script text-lg">{t('home.promo.script')}</p>
        <h2 id="deal-heading" className="text-3xl font-bold uppercase leading-tight sm:text-4xl">
          {t('home.promo.line1')}
          <br />
          {t('home.promo.line2')}
        </h2>
        <p className="mt-2 text-sm text-primary-foreground/90">{t('home.promo.text')}</p>
        <Link href="/flavors" className={buttonVariants({ variant: 'secondary', size: 'lg', className: 'mt-5' })}>
          {t('home.promo.cta')}
        </Link>
      </div>
    </Reveal>
  );
}
