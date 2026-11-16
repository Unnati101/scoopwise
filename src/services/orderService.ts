import type { CartPricing } from '@/lib/cartPricing';
import { ordersStore } from '@/lib/ordersStore';
import { activePromoStore, rewardCodesStore } from '@/lib/promos';
import type { CheckoutValues } from '@/lib/schemas';
import type { CartLine, Order } from '@/types';

// MOCK SERVICE: orders are saved in this browser's localStorage and sent nowhere. Swap for a real order API later.
const wait = () => new Promise<void>((resolve) => setTimeout(resolve, process.env.NODE_ENV === 'test' ? 0 : 700));

interface PlaceOrderInput {
  values: CheckoutValues;
  /** Pickup store name or delivery address. */
  destination: string;
  lines: CartLine[];
  pricing: CartPricing;
  promoCode: string | null;
}

export const orderService = {
  async place({ values, destination, lines, pricing, promoCode }: PlaceOrderInput): Promise<Order> {
    await wait();
    const usedPromo = pricing.promoApplied ? promoCode : null;
    const order: Order = {
      id: `FD-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: Date.now(),
      scheduledFor: values.scheduledFor,
      customerName: values.name,
      fulfilment: values.fulfilment,
      destination,
      storeId: values.fulfilment === 'pickup' ? values.storeId : undefined,
      lines,
      promoCode: usedPromo,
      subtotal: pricing.subtotal,
      discount: pricing.discount,
      promoDiscount: pricing.promoDiscount,
      deliveryFee: pricing.deliveryFee,
      total: pricing.total,
    };
    ordersStore.set([order, ...ordersStore.getSnapshot()]);
    if (usedPromo) rewardCodesStore.set(rewardCodesStore.getSnapshot().filter((reward) => reward.code !== usedPromo));
    activePromoStore.set(null);
    return order;
  },
};
