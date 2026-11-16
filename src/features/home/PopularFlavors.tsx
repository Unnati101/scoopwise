import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FlavorCard } from '@/features/flavors/FlavorCard';
import { getI18n } from '@/i18n/server';
import type { Flavor } from '@/types';

export async function PopularFlavors({ flavors }: { flavors: Flavor[] }) {
  const { t } = await getI18n();
  return (
    <section className="container pt-16" aria-labelledby="popular-heading">
      <SectionHeading
        id="popular-heading"
        title={t('home.popular.title')}
        eyebrow={t('home.popular.eyebrow')}
        action={
          <Link href="/flavors" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            {t('home.popular.viewAll')}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        }
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {flavors.map((flavor) => (
          <FlavorCard key={flavor.id} flavor={flavor} />
        ))}
      </div>
    </section>
  );
}
