import { z } from 'zod';
import { createLocalStore } from '@/lib/localStore';
import { rewardCodesStore, type RewardCode } from '@/lib/promos';
import type { Order } from '@/types';

/** One point for every ₹10 spent. */
export const RUPEES_PER_POINT = 10;

export const TIERS = [
  { id: 'scoop', min: 0 },
  { id: 'sundae', min: 200 },
  { id: 'vip', min: 600 },
] as const;

/** `value` is the discount in rupees. */
export const REWARD_OPTIONS = [
  { cost: 100, value: 100 },
  { cost: 200, value: 250 },
  { cost: 400, value: 600 },
] as const;

export type RewardOption = (typeof REWARD_OPTIONS)[number];

/** Points already spent on rewards. */
export const pointsSpentStore = createLocalStore<number>('frosty.pointsSpent', z.number().nonnegative(), 0);

export function pointsForOrder(total: number): number {
  return Math.floor(total / RUPEES_PER_POINT);
}

export function earnedPoints(orders: Order[]): number {
  return orders.reduce((sum, order) => sum + pointsForOrder(order.total), 0);
}

export function getTierProgress(lifetimePoints: number) {
  const tier = [...TIERS].reverse().find((item) => lifetimePoints >= item.min) ?? TIERS[0];
  const next = TIERS.find((item) => item.min > lifetimePoints) ?? null;
  const progress = next ? (lifetimePoints - tier.min) / (next.min - tier.min) : 1;
  return { tier, next, progress, pointsToNext: next ? next.min - lifetimePoints : 0 };
}

function createCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 6; i += 1) suffix += chars[Math.floor(Math.random() * chars.length)];
  return `RWD-${suffix}`;
}

/** Spends points on a one-time code. Returns null when the balance is too low. */
export function redeemReward(option: RewardOption, balance: number): RewardCode | null {
  if (balance < option.cost) return null;
  const reward: RewardCode = { code: createCode(), value: option.value };
  pointsSpentStore.set(pointsSpentStore.getSnapshot() + option.cost);
  rewardCodesStore.set([reward, ...rewardCodesStore.getSnapshot()]);
  return reward;
}
