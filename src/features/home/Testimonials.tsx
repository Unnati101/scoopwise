'use client';

import { Quote, Trash2 } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { StarRating } from '@/components/ui/StarRating';
import { ReviewDialog } from '@/features/home/ReviewDialog';
import { useLocalStore } from '@/hooks/useLocalStore';
import { useI18n } from '@/i18n/provider';
import { myReviewsStore } from '@/lib/reviews';
import type { Review } from '@/types';

export function Testimonials({ reviews }: { reviews: Review[] }) {
  const mine = useLocalStore(myReviewsStore);
  const { t, m } = useI18n();
  const all = [...mine, ...reviews];

  return (
    <section className="container pt-16" aria-labelledby="reviews-heading">
      <SectionHeading id="reviews-heading" title={t('home.reviews.title')} eyebrow={t('home.reviews.eyebrow')} className="justify-center text-center" />
      <ul className="grid gap-4 md:grid-cols-3">
        {all.map((review, index) => (
          <Reveal as="li" key={review.id} delay={(index % 3) * 100}>
            <Card className="relative h-full p-5 transition duration-200 hover:-translate-y-1 hover:shadow-soft">
              <Quote className="absolute right-4 top-4 h-8 w-8 text-blush" aria-hidden />
              <div className="flex items-center gap-3">
                <Avatar name={review.name} />
                <div>
                  <p className="font-semibold">{review.name}</p>
                  <StarRating rating={review.rating} />
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">&ldquo;{review.mine ? review.quote : (m.data.customerReviews[review.id] ?? review.quote)}&rdquo;</p>
              {review.mine && (
                <div className="mt-3 flex items-center justify-between">
                  <Badge variant="accent">{t('home.reviews.yours')}</Badge>
                  <button
                    type="button"
                    onClick={() => myReviewsStore.set(mine.filter((item) => item.id !== review.id))}
                    aria-label={t('home.reviews.delete')}
                    className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-danger"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              )}
            </Card>
          </Reveal>
        ))}
      </ul>
      <div className="mt-6 flex justify-center">
        <ReviewDialog />
      </div>
    </section>
  );
}
