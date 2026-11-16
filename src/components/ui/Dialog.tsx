'use client';

import { X } from 'lucide-react';
import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '@/i18n/provider';
import { cn } from '@/lib/utils';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Visually hide the title when the content provides its own heading. */
  hideTitle?: boolean;
  className?: string;
  children: ReactNode;
}

export function Dialog({ open, onClose, title, hideTitle = false, className, children }: DialogProps) {
  const { t } = useI18n();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    if (!panelRef.current?.contains(document.activeElement)) panelRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          'relative max-h-[92vh] w-full max-w-lg animate-fade-up overflow-y-auto rounded-t-2xl bg-background p-5 shadow-2xl focus:outline-none sm:rounded-2xl sm:p-6',
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className={cn('text-2xl font-bold', hideTitle && 'sr-only')}>
            {title}
          </h2>
          <button type="button" onClick={onClose} aria-label={t('common.close', { name: title })} className="ml-auto rounded-full p-2 hover:bg-muted">
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
