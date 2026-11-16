import { flavors } from '@/data/flavors';
import { menuItems } from '@/data/menu';
import { MAX_SCOOPS, VESSELS, creationId, describeCreation, priceCreation, randomCreation } from '@/lib/builder';

const toppings = menuItems.filter((item) => item.category === 'Toppings');

describe('creation pricing', () => {
  it('adds the vessel, each scoop, and toppings without float drift', () => {
    const creation = { vesselId: 'waffle-cone', flavorIds: ['flv-strawberry-bliss', 'flv-vanilla-dream'], toppingIds: ['menu-sprinkles'] };
    // Waffle cone 60 + Strawberry 110 + Vanilla 100 + sprinkles 20
    expect(priceCreation(creation, flavors, toppings)).toBe(290);
  });

  it('describes scoops and toppings', () => {
    const creation = { vesselId: 'cup', flavorIds: ['flv-mango-magic'], toppingIds: ['menu-hot-fudge'] };
    expect(describeCreation(creation, flavors, toppings)).toBe('Mango Magic with Hot Fudge');
  });

  it('gives identical creations the same id regardless of topping order', () => {
    const a = { vesselId: 'cup', flavorIds: ['x'], toppingIds: ['b', 'a'] };
    const b = { vesselId: 'cup', flavorIds: ['x'], toppingIds: ['a', 'b'] };
    expect(creationId(a)).toBe(creationId(b));
  });
});

describe('randomCreation', () => {
  it('stays within the scoop limit and uses real ids', () => {
    for (let i = 0; i < 20; i += 1) {
      const creation = randomCreation(flavors, toppings);
      expect(creation.flavorIds.length).toBeGreaterThanOrEqual(1);
      expect(creation.flavorIds.length).toBeLessThanOrEqual(MAX_SCOOPS);
      expect(VESSELS.some((vessel) => vessel.id === creation.vesselId)).toBe(true);
      creation.flavorIds.forEach((id) => expect(flavors.some((flavor) => flavor.id === id)).toBe(true));
    }
  });
});
