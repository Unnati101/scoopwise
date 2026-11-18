import type { ReactNode } from 'react';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}

export function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <section className="bg-gradient-blush">
      <div className="container py-12 text-center sm:py-16">
        <p className="animate-fade-up font-script text-xl text-primary">{eyebrow}</p>
        <h1 className="mt-1 animate-fade-up text-4xl font-bold uppercase tracking-wide sm:text-5xl" style={{ animationDelay: '80ms' }}>
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl animate-fade-up text-muted-foreground" style={{ animationDelay: '160ms' }}>
          {description}
        </p>
        {children}
      </div>
    </section>
  );
}
