import type { Promo } from '@/lib/promos';
import type { CartLine, Fulfilment } from '@/types';

export const FREE_DELIVERY_THRESHOLD = 500;
export const DELIVERY_FEE = 49;
/** Every 3rd flavor scoop is free ("Buy 2 scoops, get 1 free"). */
export const DEAL_SIZE = 3;

export interface CartPricing {
  itemCount: number;
  subtotal: number;
  freeScoops: number;
  discount: number;
  /** Subtotal after the Sweet Deal, before any promo code. */
  afterDeals: number;
  promoApplied: boolean;
  promoDiscount: number;
  deliveryFee: number;
  total: number;
  amountToFreeDelivery: number;
}

const toCents = (value: number) => Math.round(value * 100);
const fromCents = (cents: number) => cents / 100;

export function priceCart(lines: CartLine[], fulfilment: Fulfilment = 'pickup', promo: Promo | null = null): CartPricing {
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotalCents = lines.reduce((sum, line) => sum + toCents(line.unitPrice) * line.quantity, 0);

  const scoopCents = lines
    .filter((line) => line.kind === 'flavor')
    .flatMap((line) => Array<number>(line.quantity).fill(toCents(line.unitPrice)))
    .sort((a, b) => a - b);
  const freeScoops = Math.floor(scoopCents.length / DEAL_SIZE);
  const discountCents = scoopCents.slice(0, freeScoops).reduce((sum, cents) => sum + cents, 0);

  const afterDiscountCents = subtotalCents - discountCents;
  const promoApplied = promo !== null && afterDiscountCents > 0 && afterDiscountCents >= toCents(promo.minSubtotal ?? 0);

  let promoCents = 0;
  if (promoApplied && promo.kind === 'percent') promoCents = Math.round((afterDiscountCents * promo.value) / 100);
  if (promoApplied && promo.kind === 'fixed') promoCents = Math.min(toCents(promo.value), afterDiscountCents);

  const thresholdCents = toCents(FREE_DELIVERY_THRESHOLD);
  const qualifiesForFreeDelivery = afterDiscountCents >= thresholdCents || (promoApplied && promo.kind === 'free-delivery');
  const deliveryCents = fulfilment === 'delivery' && afterDiscountCents > 0 && !qualifiesForFreeDelivery ? toCents(DELIVERY_FEE) : 0;

  return {
    itemCount,
    subtotal: fromCents(subtotalCents),
    freeScoops,
    discount: fromCents(discountCents),
    afterDeals: fromCents(afterDiscountCents),
    promoApplied,
    promoDiscount: fromCents(promoCents),
    deliveryFee: fromCents(deliveryCents),
    total: fromCents(afterDiscountCents - promoCents + deliveryCents),
    amountToFreeDelivery: qualifiesForFreeDelivery || afterDiscountCents === 0 ? 0 : fromCents(thresholdCents - afterDiscountCents),
  };
}
