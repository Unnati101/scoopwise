import type { NewsletterValues } from '@/lib/schemas';

// MOCK SERVICE: no subscription is stored. Swap for a real endpoint later.
const wait = () => new Promise<void>((resolve) => setTimeout(resolve, process.env.NODE_ENV === 'test' ? 0 : 500));

export const newsletterService = {
  async subscribe(values: NewsletterValues): Promise<void> {
    void values;
    await wait();
  },
};
