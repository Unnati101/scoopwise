import { AboutPreview } from '@/features/home/AboutPreview';
import { FeatureStrip } from '@/features/home/FeatureStrip';
import { FlavorQuiz } from '@/features/home/FlavorQuiz';
import { Hero } from '@/features/home/Hero';
import { OrderBanner } from '@/features/home/OrderBanner';
import { PopularFlavors } from '@/features/home/PopularFlavors';
import { PromoBanner } from '@/features/home/PromoBanner';
import { Testimonials } from '@/features/home/Testimonials';
import { PersonalizedPicks } from '@/features/recommendations/PersonalizedPicks';
import { localizeFlavor } from '@/i18n/localize';
import { getI18n } from '@/i18n/server';
import { flavorService } from '@/services/flavorService';
import { reviewService } from '@/services/reviewService';

export default async function HomePage() {
  const [rawFlavors, reviews, { m }] = await Promise.all([flavorService.list(), reviewService.list(), getI18n()]);
  const flavors = rawFlavors.map((flavor) => localizeFlavor(flavor, m));
  const popular = flavors.filter((flavor) => flavor.popular);

  return (
    <>
      <Hero />
      <FeatureStrip />
      <PopularFlavors flavors={popular} />
      <PersonalizedPicks flavors={flavors} />
      <FlavorQuiz flavors={flavors} />
      <div className="container grid gap-4 pt-16 lg:grid-cols-5">
        <PromoBanner />
        <AboutPreview />
      </div>
      <Testimonials reviews={reviews} />
      <OrderBanner />
    </>
  );
}
