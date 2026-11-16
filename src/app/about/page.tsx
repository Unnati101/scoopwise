import { HandHeart, Leaf, Milk, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ScoopCup } from '@/components/illustrations/ScoopCup';
import { buttonVariants } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getI18n } from '@/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t('meta.titles.about'), description: t('meta.descriptions.about') };
}

const VALUE_ICONS = [Milk, Leaf, Sparkles, HandHeart];

export default async function AboutPage() {
  const { t, m } = await getI18n();
  return (
    <>
      <PageHero eyebrow={t('about.hero.eyebrow')} title={t('about.hero.title')} description={t('about.hero.text')} />

      <section className="container grid items-center gap-10 py-14 lg:grid-cols-2">
        <div className="space-y-4 text-muted-foreground">
          <h2 className="text-3xl font-bold text-foreground">{t('about.heading')}</h2>
          <p>{t('about.p1')}</p>
          <p>{t('about.p2')}</p>
          <Link href="/flavors" className={buttonVariants({ className: 'mt-2' })}>
            {t('about.cta')}
          </Link>
        </div>
        <div className="relative mx-auto flex h-72 w-full max-w-md items-end justify-center gap-2 rounded-3xl bg-gradient-blush p-6">
          <ScoopCup color="#F7A3B7" className="h-32 w-32" />
          <ScoopCup color="#7A4A33" className="h-44 w-44" />
          <ScoopCup color="#A9E2C3" speckle="#4A2C20" className="h-32 w-32" />
        </div>
      </section>

      <section className="container pb-4">
        <SectionHeading title={t('about.valuesTitle')} eyebrow={t('about.valuesEyebrow')} className="justify-center text-center" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {m.about.values.map(({ title, text }, index) => {
            const Icon = VALUE_ICONS[index] ?? Sparkles;
            return (
              <li key={title}>
                <Card className="h-full p-6 text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blush text-primary">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{text}</p>
                </Card>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
