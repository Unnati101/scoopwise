import { ArrowRight, Heart, IceCreamBowl, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { ScoopCup } from '@/components/illustrations/ScoopCup';
import { getI18n } from '@/i18n/server';

const POINT_ICONS = [Sparkles, IceCreamBowl, Heart];

export async function AboutPreview() {
  const { t, m } = await getI18n();
  return (
    <section aria-labelledby="about-heading" className="relative overflow-hidden rounded-2xl border bg-surface p-6 shadow-card sm:p-8 lg:col-span-2">
      <h2 id="about-heading" className="text-2xl font-bold uppercase tracking-wide">
        {t('home.about.title')}
      </h2>
      <p className="mt-3 max-w-xs text-sm text-muted-foreground">{t('home.about.text')}</p>
      <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
        {m.home.about.points.map((label, index) => {
          const Icon = POINT_ICONS[index] ?? Sparkles;
          return (
            <li key={label} className="flex items-center gap-1.5 text-xs font-semibold">
              <Icon className="h-4 w-4 text-primary" aria-hidden />
              {label}
            </li>
          );
        })}
      </ul>
      <Link href="/about" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
        {t('home.about.link')}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
      <ScoopCup color="#F7A3B7" className="pointer-events-none absolute -bottom-4 -right-2 h-36 w-36 opacity-90 sm:h-40 sm:w-40" />
    </section>
  );
}
