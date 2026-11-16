import { z } from 'zod';
import { createLocalStore } from '@/lib/localStore';
import type { CartItemInput, CartLine } from '@/types';

const EMPTY: CartLine[] = [];

export const cartLinesSchema = z.array(
  z.object({
    id: z.string(),
    kind: z.enum(['flavor', 'menu', 'custom']),
    name: z.string(),
    unitPrice: z.number().nonnegative(),
    quantity: z.number().int().positive(),
    detail: z.string().optional(),
    creation: z.object({ vesselId: z.string(), flavorIds: z.array(z.string()), toppingIds: z.array(z.string()) }).optional(),
  }),
);

const MAX_QUANTITY = 20;

const store = createLocalStore<CartLine[]>('frosty.cart', cartLinesSchema, EMPTY);

export const cartStore = {
  subscribe: store.subscribe,
  getSnapshot: store.getSnapshot,
  getServerSnapshot: store.getServerSnapshot,

  add(item: CartItemInput, quantity = 1) {
    const lines = store.getSnapshot();
    const existing = lines.find((line) => line.id === item.id);
    if (existing) {
      const next = Math.min(MAX_QUANTITY, existing.quantity + quantity);
      store.set(lines.map((line) => (line.id === item.id ? { ...line, quantity: next } : line)));
    } else {
      store.set([...lines, { ...item, quantity: Math.min(MAX_QUANTITY, quantity) }]);
    }
  },

  /** Gifts always get their own line so they are never merged with a regular scoop or another gift. */
  addGift(item: Omit<CartItemInput, 'id' | 'kind'>) {
    store.set([...store.getSnapshot(), { ...item, id: `gift-${Date.now()}`, kind: 'custom', quantity: 1 }]);
  },

  /** Replaces the cart contents, used when re-ordering a past order. */
  replaceAll(lines: CartLine[]) {
    store.set(lines.map((line) => ({ ...line, quantity: Math.min(MAX_QUANTITY, line.quantity) })));
  },

  setQuantity(id: string, quantity: number) {
    const lines = store.getSnapshot();
    if (quantity <= 0) {
      store.set(lines.filter((line) => line.id !== id));
      return;
    }
    store.set(lines.map((line) => (line.id === id ? { ...line, quantity: Math.min(MAX_QUANTITY, quantity) } : line)));
  },

  remove(id: string) {
    store.set(store.getSnapshot().filter((line) => line.id !== id));
  },

  clear() {
    store.set(EMPTY);
  },

  maxQuantity: MAX_QUANTITY,
};
