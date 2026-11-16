import { flavors } from '@/data/flavors';
import type { Flavor } from '@/types';

// MOCK SERVICE: reads sample data. Swap the bodies for real API calls later.
export const flavorService = {
  async list(): Promise<Flavor[]> {
    return flavors;
  },
};
