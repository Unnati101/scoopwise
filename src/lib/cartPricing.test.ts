import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD, priceCart } from '@/lib/cartPricing';
import type { CartLine } from '@/types';

const scoop = (id: string, unitPrice: number, quantity: number): CartLine => ({ id, kind: 'flavor', name: id, unitPrice, quantity });
const menu = (id: string, unitPrice: number, quantity: number): CartLine => ({ id, kind: 'menu', name: id, unitPrice, quantity });

describe('priceCart', () => {
  it('returns zeros for an empty cart', () => {
    expect(priceCart([])).toMatchObject({ itemCount: 0, subtotal: 0, discount: 0, deliveryFee: 0, total: 0, amountToFreeDelivery: 0 });
  });

  it('makes the cheapest of every three flavor scoops free', () => {
    const pricing = priceCart([scoop('a', 4.5, 2), scoop('b', 5.25, 1)]);
    expect(pricing.freeScoops).toBe(1);
    expect(pricing.discount).toBe(4.5);
    expect(pricing.total).toBe(9.75);
  });

  it('does not apply the deal to menu items or to fewer than three scoops', () => {
    const pricing = priceCart([scoop('a', 4.5, 2), menu('cone', 6.5, 3)]);
    expect(pricing.freeScoops).toBe(0);
    expect(pricing.discount).toBe(0);
  });

  it('charges delivery below the free-delivery threshold only for delivery orders', () => {
    const lines = [menu('shake', 150, 1)];
    expect(priceCart(lines, 'pickup').deliveryFee).toBe(0);
    const delivery = priceCart(lines, 'delivery');
    expect(delivery.deliveryFee).toBe(DELIVERY_FEE);
    expect(delivery.total).toBe(150 + DELIVERY_FEE);
    expect(delivery.amountToFreeDelivery).toBe(FREE_DELIVERY_THRESHOLD - 150);
  });

  it('makes delivery free at or above the threshold', () => {
    const pricing = priceCart([menu('cake', FREE_DELIVERY_THRESHOLD, 1)], 'delivery');
    expect(pricing.deliveryFee).toBe(0);
    expect(pricing.total).toBe(FREE_DELIVERY_THRESHOLD);
  });

  it('avoids floating point drift', () => {
    expect(priceCart([menu('x', 0.1, 3)]).subtotal).toBe(0.3);
  });
});
