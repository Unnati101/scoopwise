import { z } from 'zod';
import { createLocalStore } from '@/lib/localStore';

export type PromoKind = 'percent' | 'fixed' | 'free-delivery';

export interface Promo {
  code: string;
  label: string;
  kind: PromoKind;
  /** Percent for 'percent', rupees for 'fixed'. */
  value: number;
  /** Minimum subtotal (after the Sweet Deal) needed for the code to apply. */
  minSubtotal?: number;
  /** One-time codes earned through the rewards program. */
  reward?: boolean;
}

// MOCK DATA: promo codes are checked in the browser only. A real shop validates codes on the server.
export const PROMOS: Promo[] = [
  { code: 'FROSTY10', label: '10% off your order', kind: 'percent', value: 10 },
  { code: 'SWEET100', label: '₹100 off orders over ₹600', kind: 'fixed', value: 100, minSubtotal: 600 },
  { code: 'FREESHIP', label: 'Free delivery', kind: 'free-delivery', value: 0 },
];

export interface RewardCode {
  code: string;
  value: number;
}

export const rewardCodesStore = createLocalStore<RewardCode[]>(
  'frosty.rewardCodes',
  z.array(z.object({ code: z.string(), value: z.number().positive() })),
  [],
);

/** The code the shopper has applied to their cart. */
export const activePromoStore = createLocalStore<string | null>('frosty.promo', z.string().nullable(), null);

export function lookupPromo(input: string, rewardCodes: RewardCode[]): Promo | null {
  const code = input.trim().toUpperCase();
  if (!code) return null;
  const standard = PROMOS.find((promo) => promo.code === code);
  if (standard) return standard;
  const reward = rewardCodes.find((item) => item.code === code);
  return reward ? { code: reward.code, label: `Reward: ₹${reward.value} off`, kind: 'fixed', value: reward.value, reward: true } : null;
}
