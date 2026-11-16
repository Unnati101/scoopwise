import type { Order } from '@/types';

/** Demo timeline: real kitchens take minutes, so each stage is shortened to seconds. */
const STAGE_STARTS_MS = [0, 30_000, 90_000, 150_000];
const READY_AT_MS = 90_000;

export const ORDER_STAGES = ['received', 'preparing', 'ready', 'done'] as const;
export type OrderStage = (typeof ORDER_STAGES)[number];

export interface OrderProgress {
  /** Index of the current step, or -1 while the order is scheduled for later. */
  index: number;
  done: boolean;
}

export function getOrderProgress(order: Order, now: number): OrderProgress {
  const scheduledMs = order.scheduledFor === 'asap' ? null : Date.parse(order.scheduledFor);
  const isScheduled = scheduledMs !== null && !Number.isNaN(scheduledMs);
  const start = isScheduled ? Math.max(order.createdAt, scheduledMs - READY_AT_MS) : order.createdAt;
  const elapsed = now - start;

  // A placed ASAP order is always at least "received", even if the clock ticks a moment behind.
  let index = isScheduled ? -1 : 0;
  STAGE_STARTS_MS.forEach((stageStart, stageIndex) => {
    if (elapsed >= stageStart) index = stageIndex;
  });

  return { index, done: index === ORDER_STAGES.length - 1 };
}
