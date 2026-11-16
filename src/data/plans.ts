// MOCK DATA: sample subscription plans for the demo, priced in rupees. Replace with real plans from a billing API.
export interface Plan {
  id: string;
  pints: number;
  /** Discount compared with buying the same pints one by one. */
  savingsPercent: number;
  popular?: boolean;
}

export const PINT_PRICE = 230;

export const PLANS: Plan[] = [
  { id: 'pint-club', pints: 2, savingsPercent: 15 },
  { id: 'family-tub', pints: 4, savingsPercent: 20, popular: true },
  { id: 'party-box', pints: 8, savingsPercent: 25 },
];

/** Price of one delivery in rupees, rounded to the nearest paisa. */
export function planPrice(plan: Plan): number {
  return Math.round(plan.pints * PINT_PRICE * (100 - plan.savingsPercent)) / 100;
}
