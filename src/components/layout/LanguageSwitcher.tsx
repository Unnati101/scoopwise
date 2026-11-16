'use client';

import { Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { LOCALES, LOCALE_COOKIE, LOCALE_NAMES, isLocale } from '@/i18n/config';
import { useI18n } from '@/i18n/provider';
import { cn } from '@/lib/utils';

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export function LanguageSwitcher({ className, compact = false }: { className?: string; compact?: boolean }) {
  const { locale, t } = useI18n();
  const router = useRouter();

  const change = (value: string) => {
    if (!isLocale(value)) return;
    document.cookie = `${LOCALE_COOKIE}=${value}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
    router.refresh();
  };

  return (
    <label className={cn('relative flex items-center rounded-full text-foreground hover:bg-muted', className)}>
      <span className="sr-only">{t('header.language')}</span>
      <Globe className={cn('pointer-events-none absolute h-4 w-4', compact ? 'left-1.5' : 'left-3')} aria-hidden />
      <select
        value={locale}
        onChange={(event) => change(event.target.value)}
        className={cn(
          'cursor-pointer appearance-none rounded-full bg-transparent font-semibold focus-visible:outline-none [&>option]:bg-surface [&>option]:text-foreground',
          compact ? 'h-7 pl-7 pr-2 text-xs' : 'h-10 py-2 pl-9 pr-3 text-sm',
        )}
      >
        {LOCALES.map((code) => (
          <option key={code} value={code}>
            {LOCALE_NAMES[code]}
          </option>
        ))}
      </select>
    </label>
  );
}
