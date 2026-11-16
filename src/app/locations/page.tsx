import { Clock, MapPin, Navigation, Phone } from 'lucide-react';
import type { Metadata } from 'next';
import { buttonVariants } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHero } from '@/components/ui/PageHero';
import { StoreStatusBadge } from '@/features/locations/StoreStatusBadge';
import { describeSchedule, localizeStore } from '@/i18n/localize';
import { getI18n } from '@/i18n/server';
import { storeService } from '@/services/storeService';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t('meta.titles.locations'), description: t('meta.descriptions.locations') };
}

export default async function LocationsPage() {
  const [stores, i18n] = await Promise.all([storeService.list(), getI18n()]);
  const { t } = i18n;
  return (
    <>
      <PageHero eyebrow={t('locations.hero.eyebrow')} title={t('locations.hero.title')} description={t('locations.hero.text')} />
      <section className="container grid gap-6 py-12 md:grid-cols-2">
        {stores.map((rawStore) => {
          const store = localizeStore(rawStore, i18n.m);
          const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${store.address}, ${store.city}`)}`;
          return (
            <Card key={store.id} className="p-6">
              <h2 className="text-2xl font-bold">{store.name}</h2>
              <div className="mt-2">
                <StoreStatusBadge store={store} />
              </div>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <span>
                    {store.address}
                    <br />
                    {store.city}
                  </span>
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <a href={`tel:${store.phone.replace(/[^\d+]/g, '')}`} className="hover:text-primary">
                    {store.phone}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                    {describeSchedule(store, i18n).map((hours) => (
                      <div key={hours.days} className="contents">
                        <dt className="font-semibold">{hours.days}</dt>
                        <dd className="text-muted-foreground">{hours.time}</dd>
                      </div>
                    ))}
                  </dl>
                </li>
              </ul>
              <a href={mapUrl} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: 'outline', className: 'mt-6' })}>
                <Navigation className="h-4 w-4" aria-hidden />
                {t('locations.directions')}
              </a>
            </Card>
          );
        })}
      </section>
    </>
  );
}
