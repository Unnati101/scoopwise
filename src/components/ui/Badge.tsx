import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = cva('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold', {
  variants: {
    variant: {
      primary: 'bg-blush text-primary',
      secondary: 'bg-secondary text-secondary-foreground',
      accent: 'bg-accent/40 text-accent-foreground',
      muted: 'bg-muted text-muted-foreground',
    },
  },
  defaultVariants: { variant: 'primary' },
});

export function Badge({ className, variant, ...props }: ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
