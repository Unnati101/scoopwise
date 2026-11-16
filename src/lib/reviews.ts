import { z } from 'zod';
import { createLocalStore } from '@/lib/localStore';
import type { ReviewValues } from '@/lib/schemas';
import type { Review } from '@/types';

/** Reviews written in this browser. A real site would send them to a server for moderation. */
export const myReviewsStore = createLocalStore<Review[]>(
  'frosty.reviews',
  z.array(z.object({ id: z.string(), name: z.string(), rating: z.number(), quote: z.string(), mine: z.boolean().optional() })),
  [],
);

export function addMyReview(values: ReviewValues) {
  myReviewsStore.set([{ id: `mine-${Date.now()}`, mine: true, ...values }, ...myReviewsStore.getSnapshot()]);
}
