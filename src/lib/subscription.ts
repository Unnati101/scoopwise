import { z } from 'zod';
import { PLANS, type Plan } from '@/data/plans';
import { createLocalStore } from '@/lib/localStore';
import type { SubscribeValues } from '@/lib/schemas';

export type Frequency = SubscribeValues['frequency'];
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled';

export interface Subscription {
  planId: string;
  frequency: Frequency;
  /** One distinct flavor per pint in each delivery. */
  flavorIds: string[];
  name: string;
  email: string;
  address: string;
  status: SubscriptionStatus;
  startedAt: number;
  /** Timestamp of the next delivery. Not meaningful while paused or cancelled. */
  nextDelivery: number;
  skipped: number[];
}

const subscriptionSchema = z.object({
  planId: z.string(),
  frequency: z.enum(['weekly', 'biweekly', 'monthly']),
  flavorIds: z.array(z.string()),
  name: z.string(),
  email: z.string(),
  address: z.string(),
  status: z.enum(['active', 'paused', 'cancelled']),
  startedAt: z.number(),
  nextDelivery: z.number(),
  skipped: z.array(z.number()),
});

export const subscriptionStore = createLocalStore<Subscription | null>('frosty.subscription', subscriptionSchema.nullable(), null);

export function findPlan(planId: string): Plan | undefined {
  return PLANS.find((plan) => plan.id === planId);
}

export function addInterval(from: number, frequency: Frequency): number {
  const date = new Date(from);
  if (frequency === 'monthly') date.setMonth(date.getMonth() + 1);
  else date.setDate(date.getDate() + (frequency === 'weekly' ? 7 : 14));
  return date.getTime();
}

/** Three days out at 10:00 local time, leaving room to pack the first box. */
export function firstDeliveryAfter(now: number): number {
  const date = new Date(now);
  date.setDate(date.getDate() + 3);
  date.setHours(10, 0, 0, 0);
  return date.getTime();
}

export function createSubscription(input: SubscribeValues & { planId: string; flavorIds: string[] }, now: number): Subscription {
  return { ...input, status: 'active', startedAt: now, nextDelivery: firstDeliveryAfter(now), skipped: [] };
}

export function upcomingDeliveries(subscription: Subscription, count = 3): number[] {
  if (subscription.status !== 'active') return [];
  const dates = [subscription.nextDelivery];
  while (dates.length < count) dates.push(addInterval(dates[dates.length - 1] ?? subscription.nextDelivery, subscription.frequency));
  return dates;
}

export function skipNextDelivery(subscription: Subscription): Subscription {
  if (subscription.status !== 'active') return subscription;
  return {
    ...subscription,
    skipped: [...subscription.skipped, subscription.nextDelivery].slice(-3),
    nextDelivery: addInterval(subscription.nextDelivery, subscription.frequency),
  };
}

export function pauseSubscription(subscription: Subscription): Subscription {
  return subscription.status === 'active' ? { ...subscription, status: 'paused' } : subscription;
}

/** Resuming keeps the saved delivery date unless it has already passed. */
export function resumeSubscription(subscription: Subscription, now: number): Subscription {
  if (subscription.status !== 'paused') return subscription;
  const nextDelivery = subscription.nextDelivery > now ? subscription.nextDelivery : firstDeliveryAfter(now);
  return { ...subscription, status: 'active', nextDelivery };
}

export function cancelSubscription(subscription: Subscription): Subscription {
  return { ...subscription, status: 'cancelled' };
}

/** Keeps chosen flavors that still fit and tops up from `allFlavorIds` when the new plan has more pints. */
export function fitFlavors(current: string[], pints: number, allFlavorIds: string[]): string[] {
  const kept = current.slice(0, pints);
  const extras = allFlavorIds.filter((id) => !kept.includes(id)).slice(0, pints - kept.length);
  return [...kept, ...extras];
}

export function switchPlan(subscription: Subscription, planId: string, allFlavorIds: string[]): Subscription {
  const plan = findPlan(planId);
  if (!plan || subscription.status === 'cancelled') return subscription;
  return { ...subscription, planId, flavorIds: fitFlavors(subscription.flavorIds, plan.pints, allFlavorIds) };
}

// MOCK SERVICE: subscriptions live in this browser's localStorage. Swap for a real billing API later.
export const subscriptionActions = {
  start(input: Parameters<typeof createSubscription>[0]): Subscription {
    const subscription = createSubscription(input, Date.now());
    subscriptionStore.set(subscription);
    return subscription;
  },
  skip() {
    const current = subscriptionStore.getSnapshot();
    if (current) subscriptionStore.set(skipNextDelivery(current));
  },
  pause() {
    const current = subscriptionStore.getSnapshot();
    if (current) subscriptionStore.set(pauseSubscription(current));
  },
  resume() {
    const current = subscriptionStore.getSnapshot();
    if (current) subscriptionStore.set(resumeSubscription(current, Date.now()));
  },
  cancel() {
    const current = subscriptionStore.getSnapshot();
    if (current) subscriptionStore.set(cancelSubscription(current));
  },
  switchPlan(planId: string, allFlavorIds: string[]) {
    const current = subscriptionStore.getSnapshot();
    if (current) subscriptionStore.set(switchPlan(current, planId, allFlavorIds));
  },
};
