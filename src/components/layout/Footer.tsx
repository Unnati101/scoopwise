import { Clock, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { NewsletterForm } from '@/features/newsletter/NewsletterForm';
import { getI18n } from '@/i18n/server';
import { SITE_NAME } from '@/lib/constants';

const QUICK_LINKS = [
  { href: '/', key: 'home' },
  { href: '/flavors', key: 'flavors' },
  { href: '/build', key: 'build' },
  { href: '/plans', key: 'plans' },
  { href: '/menu', key: 'menu' },
  { href: '/cakes-sundaes', key: 'cakes' },
  { href: '/about', key: 'about' },
] as const;

export async function Footer() {
  const { t, m } = await getI18n();
  const supportLinks = [
    { href: '/contact', label: t('footer.contactUs') },
    { href: '/contact#faq', label: t('footer.faqs') },
    { href: '/locations', label: t('footer.findStore') },
    { href: '/orders', label: t('footer.trackOrder') },
    { href: '/subscription', label: m.nav.subscription },
    { href: '/rewards', label: m.nav.rewards },
    { href: '/checkout', label: t('footer.checkout') },
  ];

  return (
    <footer className="mt-20 border-t bg-blush/60">
      <div className="container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo />
          <p className="text-sm text-muted-foreground">{t('footer.tagline')}</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              {t('footer.address')}
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              (555) 010-1234
            </li>
            <li className="flex gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              {t('footer.hours')}
            </li>
          </ul>
        </div>

        <nav aria-label={t('footer.quickLinks')}>
          <h2 className="mb-4 text-base font-semibold">{t('footer.quickLinks')}</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-primary">
                  {m.nav[link.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t('footer.support')}>
          <h2 className="mb-4 text-base font-semibold">{t('footer.support')}</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {supportLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 text-base font-semibold">{t('footer.stayUpdated')}</h2>
          <p className="mb-3 text-sm text-muted-foreground">{t('footer.subscribeText')}</p>
          <NewsletterForm />
        </div>
      </div>
      <div className="border-t py-4">
        <p className="container text-center text-xs text-muted-foreground">
          {t('footer.rights', { year: new Date().getFullYear(), name: SITE_NAME })}
        </p>
      </div>
    </footer>
  );
}
