'use client';

import { useEffect, useRef, useState, type ElementType, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type RevealState = 'visible' | 'hidden' | 'revealing';

interface RevealProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  /** Milliseconds to wait before the entrance starts, for staggering. */
  delay?: number;
}

/**
 * Fades its content up once when it scrolls into view.
 * Content is visible on the server and until the observer reports it is off screen,
 * so nothing stays hidden if scripts or animation do not run.
 */
export function Reveal({ as: Tag = 'div', delay = 0, className, style, children, ...props }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<RevealState>('visible');

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let offscreen = false;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        if (offscreen) setState('revealing');
        observer.disconnect();
      } else {
        offscreen = true;
        setState('hidden');
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={cn(state === 'hidden' && 'opacity-0', state === 'revealing' && 'animate-reveal', className)}
      style={state === 'revealing' && delay > 0 ? { ...style, animationDelay: `${delay}ms` } : style}
      {...props}
    >
      {children}
    </Tag>
  );
}
