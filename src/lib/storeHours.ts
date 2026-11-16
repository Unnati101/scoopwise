import type { Store } from '@/types';

const SLOT_MINUTES = 30;

export type StoreStatus =
  | { open: true; closesAt: number }
  | { open: false; opens: 'today' | 'tomorrow' | 'later'; opensAt: number; day: number }
  | { open: false; opens: 'never' };

export interface TimeSlot {
  value: string;
  /** Whole days from today: 0 is today, 1 is tomorrow. */
  dayOffset: number;
  /** Day of the week where 0 is Sunday. */
  weekday: number;
}

const minutesOf = (date: Date) => date.getHours() * 60 + date.getMinutes();

function hoursFor(store: Store, day: number) {
  return store.schedule.find((item) => item.days.includes(day));
}

export function isStoreOpenAt(store: Store, date: Date): boolean {
  const hours = hoursFor(store, date.getDay());
  const minutes = minutesOf(date);
  return hours !== undefined && minutes >= hours.open && minutes < hours.close;
}

/** Minutes are measured from midnight. */
export function getStoreStatus(store: Store, now: Date): StoreStatus {
  const today = hoursFor(store, now.getDay());
  const minutes = minutesOf(now);

  if (today && minutes >= today.open && minutes < today.close) return { open: true, closesAt: today.close };
  if (today && minutes < today.open) return { open: false, opens: 'today', opensAt: today.open, day: now.getDay() };

  for (let offset = 1; offset <= 7; offset += 1) {
    const day = (now.getDay() + offset) % 7;
    const next = hoursFor(store, day);
    if (next) return { open: false, opens: offset === 1 ? 'tomorrow' : 'later', opensAt: next.open, day };
  }
  return { open: false, opens: 'never' };
}

function dayOffsetOf(date: Date, now: Date): number {
  const midnight = (value: Date) => new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
  return Math.round((midnight(date) - midnight(now)) / 86_400_000);
}

/** Upcoming half-hour pickup/delivery slots while at least one of the given stores is open. */
export function getTimeSlots(stores: Store[], now: Date, count = 12): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const stepMs = SLOT_MINUTES * 60_000;
  const earliest = now.getTime() + stepMs;
  let candidate = Math.ceil(earliest / stepMs) * stepMs;
  const limit = now.getTime() + 3 * 86_400_000;

  while (slots.length < count && candidate <= limit) {
    const date = new Date(candidate);
    const openWithTimeLeft = stores.some((store) => {
      const hours = hoursFor(store, date.getDay());
      const minutes = minutesOf(date);
      return hours !== undefined && minutes >= hours.open && minutes <= hours.close - SLOT_MINUTES;
    });
    if (openWithTimeLeft) {
      slots.push({ value: date.toISOString(), dayOffset: dayOffsetOf(date, now), weekday: date.getDay() });
    }
    candidate += stepMs;
  }
  return slots;
}
