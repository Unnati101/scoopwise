import { cn } from '@/lib/utils';

const TINTS = ['bg-blush text-primary', 'bg-secondary text-secondary-foreground', 'bg-accent/40 text-accent-foreground'];

export function Avatar({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const tint = TINTS[name.length % TINTS.length];
  return (
    <span aria-hidden className={cn('inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display font-semibold', tint, className)}>
      {initials}
    </span>
  );
}
