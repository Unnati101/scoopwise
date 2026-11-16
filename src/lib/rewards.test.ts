import { rewardCodesStore } from '@/lib/promos';
import { REWARD_OPTIONS, earnedPoints, getTierProgress, pointsSpentStore, redeemReward } from '@/lib/rewards';
import type { Order } from '@/types';

const orderTotal = (total: number) => ({ total }) as Order;

beforeEach(() => {
  pointsSpentStore.set(0);
  rewardCodesStore.set([]);
});

describe('earnedPoints', () => {
  it('awards 1 point per ₹10 spent, ignoring the remainder', () => {
    expect(earnedPoints([orderTotal(129), orderTotal(50)])).toBe(17);
    expect(earnedPoints([])).toBe(0);
  });
});

describe('getTierProgress', () => {
  it('starts in the first tier with no progress', () => {
    const { tier, next, progress } = getTierProgress(0);
    expect(tier.id).toBe('scoop');
    expect(next?.id).toBe('sundae');
    expect(progress).toBe(0);
  });

  it('reports partial progress toward the next tier', () => {
    expect(getTierProgress(100)).toMatchObject({ progress: 0.5, pointsToNext: 100 });
  });

  it('caps at the top tier', () => {
    const { tier, next, progress } = getTierProgress(2000);
    expect(tier.id).toBe('vip');
    expect(next).toBeNull();
    expect(progress).toBe(1);
  });
});

describe('redeemReward', () => {
  const [small] = REWARD_OPTIONS;

  it('spends points and stores a one-time code', () => {
    const reward = redeemReward(small, small.cost + 50);
    expect(reward?.code).toMatch(/^RWD-[A-Z0-9]{6}$/);
    expect(reward?.value).toBe(small.value);
    expect(pointsSpentStore.getSnapshot()).toBe(small.cost);
    expect(rewardCodesStore.getSnapshot()).toEqual([reward]);
  });

  it('refuses when the balance is too low', () => {
    expect(redeemReward(small, small.cost - 1)).toBeNull();
    expect(pointsSpentStore.getSnapshot()).toBe(0);
    expect(rewardCodesStore.getSnapshot()).toEqual([]);
  });
});
