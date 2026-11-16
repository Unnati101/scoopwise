// MOCK DATA: sample nutrition and allergen info per scoop. Replace with real product data from an API.
export const flavorFacts: Record<string, { calories: number; allergens: string[] }> = {
  'flv-strawberry-bliss': { calories: 190, allergens: ['Milk'] },
  'flv-chocolate-fudge': { calories: 230, allergens: ['Milk', 'Soy'] },
  'flv-vanilla-dream': { calories: 200, allergens: ['Milk', 'Eggs'] },
  'flv-mint-chocolate-chip': { calories: 215, allergens: ['Milk', 'Soy'] },
  'flv-mango-magic': { calories: 180, allergens: ['Milk'] },
  'flv-cookies-and-cream': { calories: 235, allergens: ['Milk', 'Wheat', 'Soy'] },
  'flv-pistachio-crunch': { calories: 240, allergens: ['Milk', 'Tree nuts'] },
  'flv-salted-caramel': { calories: 210, allergens: ['Milk'] },
  'flv-blueberry-cheesecake': { calories: 225, allergens: ['Milk', 'Wheat', 'Eggs'] },
  'flv-coconut-cloud': { calories: 170, allergens: ['Coconut'] },
  'flv-raspberry-sorbet': { calories: 110, allergens: [] },
  'flv-hazelnut-crunch': { calories: 245, allergens: ['Milk', 'Tree nuts'] },
};
