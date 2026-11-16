'use client';

import { IceCreamCone } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/i18n/provider';
import { SITE_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  const { t } = useI18n();
  return (
    <Link href="/" className={cn('inline-flex items-center gap-2', className)} aria-label={t('nav.logoLabel', { name: SITE_NAME })}>
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-berry text-primary-foreground shadow-soft">
        <IceCreamCone className="h-5 w-5" aria-hidden />
      </span>
      <span className="font-display text-xl font-bold leading-none text-primary">
        Frosty
        <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-foreground">Delights</span>
      </span>
    </Link>
  );
}
