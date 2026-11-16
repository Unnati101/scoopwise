'use client';

import { Menu, Search, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MobileNav } from '@/components/layout/MobileNav';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Logo } from '@/components/ui/Logo';
import { buttonVariants } from '@/components/ui/Button';
import { useCartUi } from '@/features/cart/CartProvider';
import { SearchPalette } from '@/features/search/SearchPalette';
import { useCart } from '@/hooks/useCart';
import { useI18n } from '@/i18n/provider';
import { NAV_LINKS } from '@/lib/constants';
import type { SearchItem } from '@/lib/searchIndex';
import { cn } from '@/lib/utils';

const ACCOUNT_LINKS = [
  { href: '/orders', key: 'orders' },
  { href: '/subscription', key: 'subscription' },
  { href: '/rewards', key: 'rewards' },
] as const;

export function Header({ searchItems }: { searchItems: SearchItem[] }) {
  const pathname = usePathname();
  const { t, m } = useI18n();
  const { open: openCart } = useCartUi();
  const { pricing } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen((current) => !current);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="bg-primary text-primary-foreground">
        <div className="container flex items-center justify-center py-1 text-xs font-medium sm:justify-end lg:justify-between">
          <p className="sm:hidden lg:block">{t('header.promo')}</p>
          <div className="hidden items-center gap-4 sm:flex">
            <nav aria-label={t('nav.account')} className="flex gap-4">
              {ACCOUNT_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="hover:underline">
                  {m.nav[link.key]}
                </Link>
              ))}
            </nav>
            <LanguageSwitcher compact className="text-primary-foreground hover:bg-white/15" />
            <ThemeToggle compact className="text-primary-foreground hover:bg-white/15" />
          </div>
        </div>
      </div>
      <div className="container flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav aria-label={t('nav.main')} className="hidden items-center gap-1 xl:flex">
          {NAV_LINKS.map((link) => {
            const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-full px-3 py-2 text-sm font-semibold transition-colors hover:text-primary',
                  active ? 'bg-blush text-primary' : 'text-foreground',
                )}
              >
                {m.nav[link.key]}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label={t('header.search')}
            className="rounded-full p-2.5 text-foreground hover:bg-muted"
          >
            <Search className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={openCart}
            aria-label={t('header.openCart', { count: pricing.itemCount })}
            className="relative rounded-full p-2.5 text-foreground hover:bg-muted"
          >
            <ShoppingBag className="h-5 w-5" aria-hidden />
            {pricing.itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[0.65rem] font-bold text-primary-foreground">
                {pricing.itemCount}
              </span>
            )}
          </button>
          <Link href="/menu" className={cn(buttonVariants({ size: 'sm' }), 'hidden sm:inline-flex')}>
            {t('header.orderOnline')}
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={t('nav.openMenu')}
            className="rounded-full p-2.5 hover:bg-muted xl:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} items={searchItems} />
    </header>
  );
}
