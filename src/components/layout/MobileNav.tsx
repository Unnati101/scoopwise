'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { buttonVariants } from '@/components/ui/Button';
import { Sheet } from '@/components/ui/Sheet';
import { useI18n } from '@/i18n/provider';
import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';

const ACCOUNT_LINKS = [
  { href: '/orders', key: 'orders' },
  { href: '/subscription', key: 'subscription' },
  { href: '/rewards', key: 'rewards' },
] as const;

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { t, m } = useI18n();

  return (
    <Sheet open={open} onClose={onClose} title={t('nav.menuTitle')} side="left">
      <nav aria-label={t('nav.mobile')} className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
        {[...NAV_LINKS, ...ACCOUNT_LINKS].map((link) => {
          const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              aria-current={active ? 'page' : undefined}
              className={cn('rounded-xl px-4 py-3 font-display text-lg font-semibold', active ? 'bg-blush text-primary' : 'hover:bg-muted')}
            >
              {m.nav[link.key]}
            </Link>
          );
        })}
        <Link href="/menu" onClick={onClose} className={buttonVariants({ size: 'lg', className: 'mt-4' })}>
          {t('header.orderOnline')}
        </Link>
        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </nav>
    </Sheet>
  );
}
