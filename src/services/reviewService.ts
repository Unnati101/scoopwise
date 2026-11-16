import { reviews } from '@/data/stores';
import type { Review } from '@/types';

// MOCK SERVICE: reads sample data. Swap the bodies for real API calls later.
export const reviewService = {
  async list(): Promise<Review[]> {
    return reviews;
  },
};
