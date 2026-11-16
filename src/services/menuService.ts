import { menuItems } from '@/data/menu';
import type { MenuCategory, MenuItem } from '@/types';

// MOCK SERVICE: reads sample data. Swap the bodies for real API calls later.
export const menuService = {
  async listAll(): Promise<MenuItem[]> {
    return menuItems;
  },

  async listByCategories(categories: MenuCategory[]): Promise<Record<MenuCategory, MenuItem[]>> {
    const result = { Cones: [], Cups: [], Shakes: [], Toppings: [], Cakes: [], Sundaes: [] } as Record<MenuCategory, MenuItem[]>;
    for (const item of menuItems) {
      if (categories.includes(item.category)) result[item.category].push(item);
    }
    return result;
  },
};
