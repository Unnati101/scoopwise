import type { MenuItem } from '@/types';

// MOCK DATA: sample menu for the demo, priced in Indian rupees. Replace with real catalog data from an API.
export const menuItems: MenuItem[] = [
  { id: 'menu-single-cone', name: 'Single Scoop Cone', description: 'One scoop of any flavor in a fresh waffle cone.', price: 110, category: 'Cones' },
  { id: 'menu-double-cone', name: 'Double Scoop Cone', description: 'Two flavors stacked high on a crisp waffle cone.', price: 155, category: 'Cones' },
  { id: 'menu-triple-cone', name: 'Triple Scoop Cone', description: 'Three scoops for the truly ambitious.', price: 205, category: 'Cones' },
  { id: 'menu-chocolate-dipped-cone', name: 'Chocolate-Dipped Cone', description: 'Waffle cone dipped in chocolate with sprinkles.', price: 145, category: 'Cones' },

  { id: 'menu-kids-cup', name: 'Kids Cup', description: 'One small scoop with sprinkles.', price: 85, category: 'Cups' },
  { id: 'menu-regular-cup', name: 'Regular Cup', description: 'Two scoops in a cup with one topping.', price: 145, category: 'Cups' },
  { id: 'menu-family-pint', name: 'Family Pint', description: 'A take-home pint of your favorite flavor.', price: 230, category: 'Cups' },

  { id: 'menu-strawberry-shake', name: 'Strawberry Milkshake', description: 'Strawberry Bliss blended with cold whole milk.', price: 145, category: 'Shakes' },
  { id: 'menu-chocolate-shake', name: 'Chocolate Fudge Shake', description: 'Thick, rich, and topped with whipped cream.', price: 150, category: 'Shakes' },
  { id: 'menu-cookies-shake', name: 'Cookies & Cream Shake', description: 'Crushed cookies blended into vanilla cream.', price: 155, category: 'Shakes' },
  { id: 'menu-mango-shake', name: 'Mango Lassi Shake', description: 'Mango and a touch of cardamom.', price: 150, category: 'Shakes' },

  { id: 'menu-sprinkles', name: 'Rainbow Sprinkles', description: 'A generous shower of color.', price: 20, category: 'Toppings' },
  { id: 'menu-hot-fudge', name: 'Hot Fudge', description: 'Warm, glossy chocolate fudge.', price: 25, category: 'Toppings' },
  { id: 'menu-fresh-strawberries', name: 'Fresh Strawberries', description: 'Sliced strawberries, picked this week.', price: 30, category: 'Toppings' },
  { id: 'menu-crushed-cookies', name: 'Crushed Cookies', description: 'Buttery cookie crumbs for extra crunch.', price: 25, category: 'Toppings' },
  { id: 'menu-whipped-cherry', name: 'Whipped Cream & Cherry', description: 'The classic finishing touch.', price: 20, category: 'Toppings' },

  { id: 'menu-berry-bliss-cake', name: 'Berry Bliss Ice Cream Cake', description: 'Strawberry and vanilla layers with a cookie crust. Serves 8.', price: 770, category: 'Cakes' },
  { id: 'menu-truffle-cake', name: 'Chocolate Truffle Cake', description: 'Chocolate fudge layers under a ganache glaze. Serves 8.', price: 815, category: 'Cakes' },
  { id: 'menu-cookies-cake', name: 'Cookies & Cream Cake', description: 'Cookies and cream with crushed-cookie frosting. Serves 8.', price: 720, category: 'Cakes' },

  { id: 'menu-banana-split', name: 'Banana Split', description: 'Three scoops, banana, fudge, whipped cream, and a cherry.', price: 230, category: 'Sundaes' },
  { id: 'menu-hot-fudge-sundae', name: 'Hot Fudge Sundae', description: 'Vanilla Dream under warm fudge and roasted nuts.', price: 190, category: 'Sundaes' },
  { id: 'menu-strawberry-sundae', name: 'Strawberry Shortcake Sundae', description: 'Strawberry Bliss, shortcake crumble, and fresh berries.', price: 205, category: 'Sundaes' },
  { id: 'menu-brownie-volcano', name: 'Brownie Volcano', description: 'Warm brownie, two scoops, and a river of fudge.', price: 215, category: 'Sundaes' },
];
