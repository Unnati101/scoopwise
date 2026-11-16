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
        <p className="font-script text-xl text-primary">{eyebrow}</p>
        <h1 className="mt-1 text-4xl font-bold uppercase tracking-wide sm:text-5xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{description}</p>
        {children}
      </div>
    </section>
  );
}
