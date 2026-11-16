'use client';

import type { ReactNode } from 'react';
import { useI18n } from '@/i18n/provider';
import type { MessageKey } from '@/i18n/translate';
import { cn } from '@/lib/utils';

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}

export function Field({ label, htmlFor, error, hint, className, children }: FieldProps) {
  const { t } = useI18n();
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={htmlFor} className="text-sm font-semibold">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs font-medium text-danger">
          {t(error as MessageKey)}
        </p>
      )}
    </div>
  );
}
