import { Droplets, Leaf, Palette } from 'lucide-react';
import Link from 'next/link';
import { HeroSundae } from '@/components/illustrations/HeroSundae';
import { buttonVariants } from '@/components/ui/Button';
import { getI18n } from '@/i18n/server';

const BENEFIT_ICONS = [Leaf, Droplets, Palette];

export async function Hero() {
  const { t, m } = await getI18n();
  return (
    <section className="relative overflow-hidden bg-gradient-blush">
      <div className="container grid items-center gap-8 py-10 lg:grid-cols-2 lg:py-16">
        <div className="animate-fade-up text-center lg:text-left">
          <p className="font-script text-xl text-primary">{t('home.hero.eyebrow')}</p>
          <h1 className="mt-2 text-5xl font-bold uppercase leading-[1.05] tracking-wide sm:text-6xl xl:text-7xl">
            {t('home.hero.title')}
            <span className="mt-1 block font-script text-5xl normal-case tracking-normal text-primary sm:text-6xl xl:text-7xl">{t('home.hero.script')}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base text-muted-foreground lg:mx-0">{t('home.hero.text')}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Link href="/menu" className={buttonVariants({ size: 'lg' })}>
              {t('home.hero.orderNow')}
            </Link>
            <Link href="/flavors" className={buttonVariants({ size: 'lg', variant: 'outline' })}>
              {t('home.hero.explore')}
            </Link>
          </div>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 lg:justify-start">
            {m.home.hero.benefits.map((label, index) => {
              const Icon = BENEFIT_ICONS[index] ?? Leaf;
              return (
                <li key={label} className="flex items-center gap-2 text-sm font-semibold">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-primary shadow-card">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  {label}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
          <div className="absolute inset-6 rounded-full bg-secondary/60 blur-2xl" aria-hidden />
          <HeroSundae className="relative animate-float drop-shadow-xl" />
          <div className="absolute right-2 top-2 flex h-24 w-24 -rotate-6 flex-col items-center justify-center rounded-full bg-primary text-center text-primary-foreground shadow-soft ring-4 ring-surface sm:h-28 sm:w-28">
            <span className="font-display text-xl font-bold leading-none sm:text-2xl">{t('home.hero.badgeTop')}</span>
            <span className="text-[0.65rem] font-semibold uppercase leading-tight">{t('home.hero.badgeBottom')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
