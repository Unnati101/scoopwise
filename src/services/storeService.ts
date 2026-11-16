import { stores } from '@/data/stores';
import type { Store } from '@/types';

// MOCK SERVICE: reads sample data. Swap the bodies for real API calls later.
export const storeService = {
  async list(): Promise<Store[]> {
    return stores;
  },
};
