import type { ContactValues } from '@/lib/schemas';

// MOCK SERVICE: the message is not sent anywhere. Swap for a real endpoint later.
const wait = () => new Promise<void>((resolve) => setTimeout(resolve, process.env.NODE_ENV === 'test' ? 0 : 600));

export const contactService = {
  async send(values: ContactValues): Promise<void> {
    void values;
    await wait();
  },
};
