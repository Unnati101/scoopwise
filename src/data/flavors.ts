import { flavorFacts } from '@/data/flavorFacts';
import type { Flavor } from '@/types';

type FlavorBase = Omit<Flavor, 'calories' | 'allergens'>;

// MOCK DATA: sample flavors for the demo, priced in Indian rupees. Replace with real catalog data from an API.
const baseFlavors: FlavorBase[] = [
  { id: 'flv-strawberry-bliss', name: 'Strawberry Bliss', description: 'Sun-ripened strawberries swirled into silky cream.', price: 110, category: 'Fruity', color: '#F7A3B7', rating: 4.9, popular: true, dairyFree: false },
  { id: 'flv-chocolate-fudge', name: 'Chocolate Fudge', description: 'Deep dark cocoa with ribbons of warm fudge.', price: 115, category: 'Chocolatey', color: '#7A4A33', rating: 4.9, popular: true, dairyFree: false },
  { id: 'flv-vanilla-dream', name: 'Vanilla Dream', description: 'Madagascar vanilla bean, simple and endlessly creamy.', price: 100, category: 'Creamy', color: '#F6E3B0', speckle: '#B98B4F', rating: 4.8, popular: true, dairyFree: false },
  { id: 'flv-mint-chocolate-chip', name: 'Mint Chocolate Chip', description: 'Cool fresh mint with crunchy dark chocolate chips.', price: 115, category: 'Chocolatey', color: '#A9E2C3', speckle: '#4A2C20', rating: 4.8, popular: true, dairyFree: false },
  { id: 'flv-mango-magic', name: 'Mango Magic', description: 'Golden Alphonso mango, bright, tropical, and juicy.', price: 115, category: 'Fruity', color: '#FFC94A', rating: 4.7, popular: true, dairyFree: false },
  { id: 'flv-cookies-and-cream', name: 'Cookies & Cream', description: 'Sweet cream packed with crushed chocolate cookies.', price: 115, category: 'Creamy', color: '#ECE6E0', speckle: '#3A2118', rating: 4.9, popular: true, dairyFree: false },
  { id: 'flv-pistachio-crunch', name: 'Pistachio Crunch', description: 'Roasted pistachios folded into a velvety green base.', price: 125, category: 'Nutty', color: '#B6D68B', speckle: '#6E8F3E', rating: 4.6, popular: false, dairyFree: false },
  { id: 'flv-salted-caramel', name: 'Salted Caramel', description: 'Slow-cooked caramel with a pinch of sea salt.', price: 115, category: 'Creamy', color: '#DBA45C', rating: 4.8, popular: false, dairyFree: false },
  { id: 'flv-blueberry-cheesecake', name: 'Blueberry Cheesecake', description: 'Tangy cheesecake ice cream with blueberry compote.', price: 120, category: 'Fruity', color: '#A3ABE8', speckle: '#4C55B5', rating: 4.7, popular: false, dairyFree: false },
  { id: 'flv-coconut-cloud', name: 'Coconut Cloud', description: 'Light coconut cream with toasted flakes. Dairy-free.', price: 115, category: 'Sorbet', color: '#F7F2EA', speckle: '#D8C3A0', rating: 4.5, popular: false, dairyFree: true },
  { id: 'flv-raspberry-sorbet', name: 'Raspberry Sorbet', description: 'Tart, vivid raspberries and nothing else. Dairy-free.', price: 110, category: 'Sorbet', color: '#E5576F', rating: 4.6, popular: false, dairyFree: true },
  { id: 'flv-hazelnut-crunch', name: 'Hazelnut Crunch', description: 'Toasted hazelnut paste with praline crunch.', price: 125, category: 'Nutty', color: '#B98A62', speckle: '#6B4128', rating: 4.7, popular: false, dairyFree: false },
];

export const flavors: Flavor[] = baseFlavors.map((flavor) => ({ calories: 0, allergens: [], ...flavorFacts[flavor.id], ...flavor }));
