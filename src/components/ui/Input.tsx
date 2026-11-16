import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export const fieldControlClass =
  'w-full rounded-xl border-2 border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 aria-[invalid=true]:border-danger disabled:opacity-60';

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return <input className={cn(fieldControlClass, 'h-11', className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return <textarea className={cn(fieldControlClass, 'min-h-28 resize-y', className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<'select'>) {
  return <select className={cn(fieldControlClass, 'h-11 pr-8', className)} {...props} />;
}
