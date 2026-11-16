import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  id?: string;
  eyebrow?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeading({ title, id, eyebrow, action, className }: SectionHeadingProps) {
  return (
    <div className={cn('mb-8 flex flex-wrap items-end justify-between gap-3', className)}>
      <div>
        {eyebrow && <p className="font-script text-lg text-primary">{eyebrow}</p>}
        <h2 id={id} className="text-2xl font-bold uppercase tracking-wide sm:text-3xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}
