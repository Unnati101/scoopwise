import { CakeSlice, Cherry, CupSoda, IceCreamBowl, IceCreamCone, type LucideIcon } from 'lucide-react';
import type { MenuCategory } from '@/types';

export const CATEGORY_ICONS: Record<MenuCategory, LucideIcon> = {
  Cones: IceCreamCone,
  Cups: IceCreamBowl,
  Shakes: CupSoda,
  Toppings: Cherry,
  Cakes: CakeSlice,
  Sundaes: IceCreamBowl,
};
