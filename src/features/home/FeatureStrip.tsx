import { Gift, IceCreamBowl, ShieldCheck, Truck } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
import { getI18n } from '@/i18n/server';

const FEATURES = [
  { icon: Truck, href: '/menu' },
  { icon: ShieldCheck, href: '/about' },
  { icon: IceCreamBowl, href: '/flavors' },
  { icon: Gift, href: '/rewards' },
];

export async function FeatureStrip() {
  const { m } = await getI18n();
  return (
    <section className="container -mt-6 relative z-10">
      <Reveal as="ul" className="grid grid-cols-2 gap-4 rounded-2xl border bg-surface p-5 shadow-card lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, href }, index) => {
          const { title, text } = m.home.features[index] ?? { title: '', text: '' };
          return (
            <li key={href}>
              <Link href={href} className="group flex items-center gap-3 rounded-xl transition-colors hover:text-primary">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blush text-primary transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{title}</span>
                  <span className="block text-xs text-muted-foreground">{text}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </Reveal>
    </section>
  );
}
