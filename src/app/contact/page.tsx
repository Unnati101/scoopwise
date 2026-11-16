import type { Metadata } from 'next';
import { Card } from '@/components/ui/Card';
import { PageHero } from '@/components/ui/PageHero';
import { ContactForm } from '@/features/contact/ContactForm';
import { FaqList } from '@/features/contact/FaqList';
import { getI18n } from '@/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t('meta.titles.contact'), description: t('meta.descriptions.contact') };
}

export default async function ContactPage() {
  const { t } = await getI18n();
  return (
    <>
      <PageHero eyebrow={t('contact.hero.eyebrow')} title={t('contact.hero.title')} description={t('contact.hero.text')} />
      <section className="container grid gap-10 py-12 lg:grid-cols-2">
        <Card className="p-6 sm:p-8">
          <h2 className="mb-5 text-2xl font-bold">{t('contact.send')}</h2>
          <ContactForm />
        </Card>
        <FaqList />
      </section>
    </>
  );
}
