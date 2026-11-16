import { z } from 'zod';
import { cartLinesSchema } from '@/lib/cartStore';
import { createLocalStore } from '@/lib/localStore';
import type { Order } from '@/types';

const orderSchema = z.object({
  id: z.string(),
  createdAt: z.number(),
  scheduledFor: z.string(),
  customerName: z.string(),
  fulfilment: z.enum(['delivery', 'pickup']),
  destination: z.string(),
  storeId: z.string().optional(),
  lines: cartLinesSchema,
  promoCode: z.string().nullable(),
  subtotal: z.number(),
  discount: z.number(),
  promoDiscount: z.number(),
  deliveryFee: z.number(),
  total: z.number(),
});

/** Newest order first. */
export const ordersStore = createLocalStore<Order[]>('frosty.orders', z.array(orderSchema), []);
