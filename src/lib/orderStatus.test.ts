import { ORDER_STAGES, getOrderProgress } from '@/lib/orderStatus';
import type { Order } from '@/types';

const createdAt = 1_000_000;
const order = (overrides: Partial<Order> = {}): Order => ({
  id: 'FD-1',
  createdAt,
  scheduledFor: 'asap',
  customerName: 'Ada',
  fulfilment: 'pickup',
  destination: 'Downtown Branch',
  lines: [],
  promoCode: null,
  subtotal: 10,
  discount: 0,
  promoDiscount: 0,
  deliveryFee: 0,
  total: 10,
  ...overrides,
});

describe('getOrderProgress', () => {
  it('starts as received and advances through the stages', () => {
    expect(getOrderProgress(order(), createdAt).index).toBe(0);
    expect(getOrderProgress(order(), createdAt + 30_000).index).toBe(1);
    expect(getOrderProgress(order(), createdAt + 90_000).index).toBe(2);
    const done = getOrderProgress(order(), createdAt + 150_000);
    expect(done.index).toBe(3);
    expect(done.done).toBe(true);
  });

  it('never shows an ASAP order as scheduled when the clock lags the order time', () => {
    expect(getOrderProgress(order(), createdAt - 500).index).toBe(0);
  });

  it('marks the order done after the last stage', () => {
    const done = getOrderProgress(order({ fulfilment: 'delivery' }), createdAt + 150_000);
    expect(done.done).toBe(true);
    expect(ORDER_STAGES[done.index]).toBe('done');
  });

  it('waits for the scheduled time before preparing', () => {
    const scheduled = new Date(createdAt + 3_600_000).toISOString();
    expect(getOrderProgress(order({ scheduledFor: scheduled }), createdAt + 60_000).index).toBe(-1);
    expect(getOrderProgress(order({ scheduledFor: scheduled }), createdAt + 3_600_000).index).toBe(2);
  });
});
