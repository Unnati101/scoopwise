'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useSyncExternalStore } from 'react';
import { useLocalStore } from '@/hooks/useLocalStore';
import { useI18n } from '@/i18n/provider';
import { DARK_QUERY, themeStore } from '@/lib/theme';
import { cn } from '@/lib/utils';

function subscribeToSystemTheme(onChange: () => void) {
  const query = window.matchMedia(DARK_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

export function ThemeToggle({ className, compact = false }: { className?: string; compact?: boolean }) {
  const { t } = useI18n();
  const stored = useLocalStore(themeStore);
  const systemDark = useSyncExternalStore(
    subscribeToSystemTheme,
    () => window.matchMedia(DARK_QUERY).matches,
    () => false,
  );
  const theme = stored ?? (systemDark ? 'dark' : 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <button
      type="button"
      onClick={() => themeStore.set(theme === 'dark' ? 'light' : 'dark')}
      aria-label={theme === 'dark' ? t('header.themeToLight') : t('header.themeToDark')}
      className={cn('rounded-full text-foreground hover:bg-muted', compact ? 'p-1.5' : 'p-2.5', className)}
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
    </button>
  );
}
