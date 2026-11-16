'use client';

import { Copy, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/i18n/provider';
import { activePromoStore } from '@/lib/promos';

interface CodeRowProps {
  code: string;
  description: string;
}

export function CodeRow({ code, description }: CodeRowProps) {
  const { t } = useI18n();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(t('rewards.copied', { code }));
    } catch {
      toast.error(t('rewards.copyFailed'));
    }
  };

  const apply = () => {
    activePromoStore.set(code);
    toast.success(t('rewards.applied', { code }));
  };

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-dashed border-primary/40 bg-blush/50 px-4 py-3">
      <div>
        <p className="font-display text-lg font-semibold tracking-wider text-primary">{code}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => void copy()} aria-label={t('rewards.copyLabel', { code })}>
          <Copy className="h-4 w-4" aria-hidden />
          {t('rewards.copy')}
        </Button>
        <Button size="sm" onClick={apply} aria-label={t('rewards.useLabel', { code })}>
          <ShoppingBag className="h-4 w-4" aria-hidden />
          {t('rewards.use')}
        </Button>
      </div>
    </li>
  );
}
