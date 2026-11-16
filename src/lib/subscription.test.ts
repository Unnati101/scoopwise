import { PLANS, planPrice } from '@/data/plans';
import {
  addInterval,
  cancelSubscription,
  createSubscription,
  fitFlavors,
  pauseSubscription,
  resumeSubscription,
  skipNextDelivery,
  switchPlan,
  upcomingDeliveries,
} from '@/lib/subscription';

// Local-time dates keep these tests independent of the machine's time zone.
const NOW = new Date(2026, 10, 16, 15, 30).getTime();
const input = { planId: 'pint-club', flavorIds: ['a', 'b'], name: 'Ada', email: 'ada@example.com', address: '1 Main Street', frequency: 'weekly' as const };
const at = (day: number, hour = 10) => new Date(2026, 10, day, hour).getTime();

describe('planPrice', () => {
  it('applies the savings to the pint price and rounds to the paisa', () => {
    expect(PLANS.map(planPrice)).toEqual([391, 736, 1380]);
  });
});

describe('createSubscription', () => {
  it('starts active with the first delivery three days out at 10:00', () => {
    const sub = createSubscription(input, NOW);
    expect(sub.status).toBe('active');
    expect(sub.nextDelivery).toBe(at(19));
    expect(sub.skipped).toEqual([]);
  });
});

describe('addInterval', () => {
  it('adds a week, two weeks, or a calendar month', () => {
    expect(addInterval(at(19), 'weekly')).toBe(at(26));
    expect(addInterval(at(19), 'biweekly')).toBe(new Date(2026, 11, 3, 10).getTime());
    expect(new Date(addInterval(at(19), 'monthly')).getMonth()).toBe(11);
  });
});

describe('upcomingDeliveries', () => {
  it('lists the next deliveries on the chosen schedule', () => {
    const sub = createSubscription(input, NOW);
    expect(upcomingDeliveries(sub)).toEqual([at(19), at(26), new Date(2026, 11, 3, 10).getTime()]);
  });

  it('is empty while paused or cancelled', () => {
    const sub = createSubscription(input, NOW);
    expect(upcomingDeliveries(pauseSubscription(sub))).toEqual([]);
    expect(upcomingDeliveries(cancelSubscription(sub))).toEqual([]);
  });
});

describe('skipNextDelivery', () => {
  it('moves to the following delivery and remembers the skipped one', () => {
    const sub = skipNextDelivery(createSubscription(input, NOW));
    expect(sub.nextDelivery).toBe(at(26));
    expect(sub.skipped).toEqual([at(19)]);
  });

  it('keeps only the three most recent skips', () => {
    let sub = createSubscription(input, NOW);
    for (let i = 0; i < 5; i += 1) sub = skipNextDelivery(sub);
    expect(sub.skipped).toHaveLength(3);
  });

  it('does nothing when paused', () => {
    const paused = pauseSubscription(createSubscription(input, NOW));
    expect(skipNextDelivery(paused)).toBe(paused);
  });
});

describe('pause and resume', () => {
  it('keeps the saved delivery date when it is still in the future', () => {
    const sub = createSubscription(input, NOW);
    const resumed = resumeSubscription(pauseSubscription(sub), NOW);
    expect(resumed.status).toBe('active');
    expect(resumed.nextDelivery).toBe(sub.nextDelivery);
  });

  it('schedules a fresh delivery when the saved one has passed', () => {
    const paused = pauseSubscription(createSubscription(input, NOW));
    const later = new Date(2026, 11, 1, 9).getTime();
    expect(resumeSubscription(paused, later).nextDelivery).toBe(new Date(2026, 11, 4, 10).getTime());
  });

  it('cannot resume an active or cancelled subscription', () => {
    const active = createSubscription(input, NOW);
    expect(resumeSubscription(active, NOW)).toBe(active);
    const cancelled = cancelSubscription(active);
    expect(resumeSubscription(cancelled, NOW)).toBe(cancelled);
  });
});

describe('fitFlavors and switchPlan', () => {
  const all = ['a', 'b', 'c', 'd', 'e'];

  it('trims to fewer pints and tops up for more', () => {
    expect(fitFlavors(['a', 'b', 'c'], 2, all)).toEqual(['a', 'b']);
    expect(fitFlavors(['c', 'a'], 4, all)).toEqual(['c', 'a', 'b', 'd']);
  });

  it('switches plan and refits the flavors', () => {
    const sub = createSubscription(input, NOW);
    const switched = switchPlan(sub, 'family-tub', all);
    expect(switched.planId).toBe('family-tub');
    expect(switched.flavorIds).toEqual(['a', 'b', 'c', 'd']);
  });

  it('ignores unknown plans and cancelled subscriptions', () => {
    const sub = createSubscription(input, NOW);
    expect(switchPlan(sub, 'nope', all)).toBe(sub);
    const cancelled = cancelSubscription(sub);
    expect(switchPlan(cancelled, 'family-tub', all)).toBe(cancelled);
  });
});
