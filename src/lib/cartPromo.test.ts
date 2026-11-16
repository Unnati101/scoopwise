import { DELIVERY_FEE, priceCart } from '@/lib/cartPricing';
import { PROMOS } from '@/lib/promos';
import type { CartLine } from '@/types';

const line = (unitPrice: number, quantity = 1): CartLine => ({ id: 'item', kind: 'menu', name: 'Item', unitPrice, quantity });
const promo = (code: string) => PROMOS.find((item) => item.code === code) ?? null;

describe('priceCart with promo codes', () => {
  it('takes a percentage off after the Sweet Deal', () => {
    const pricing = priceCart([line(40)], 'pickup', promo('FROSTY10'));
    expect(pricing.promoApplied).toBe(true);
    expect(pricing.promoDiscount).toBe(4);
    expect(pricing.total).toBe(36);
  });

  it('ignores a fixed code until the minimum spend is reached', () => {
    const short = priceCart([line(500)], 'pickup', promo('SWEET100'));
    expect(short.promoApplied).toBe(false);
    expect(short.total).toBe(500);
    expect(priceCart([line(600)], 'pickup', promo('SWEET100')).total).toBe(500);
  });

  it('never discounts below zero', () => {
    const pricing = priceCart([line(3)], 'pickup', { code: 'BIG', label: 'Big', kind: 'fixed', value: 10 });
    expect(pricing.promoDiscount).toBe(3);
    expect(pricing.total).toBe(0);
  });

  it('waives the delivery fee with a free-delivery code', () => {
    expect(priceCart([line(80)], 'delivery').deliveryFee).toBe(DELIVERY_FEE);
    const pricing = priceCart([line(80)], 'delivery', promo('FREESHIP'));
    expect(pricing.deliveryFee).toBe(0);
    expect(pricing.total).toBe(80);
  });

  it('applies nothing to an empty cart', () => {
    expect(priceCart([], 'pickup', promo('FROSTY10')).promoApplied).toBe(false);
  });
});
