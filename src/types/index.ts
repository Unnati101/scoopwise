export type FlavorCategory = 'Fruity' | 'Chocolatey' | 'Creamy' | 'Nutty' | 'Sorbet';

export interface Flavor {
  id: string;
  name: string;
  description: string;
  price: number;
  category: FlavorCategory;
  /** Swatch color used by the illustrations. */
  color: string;
  /** Optional speckle color (chips, cookie bits). */
  speckle?: string;
  rating: number;
  popular: boolean;
  dairyFree: boolean;
  /** Calories per scoop. */
  calories: number;
  allergens: string[];
}

export type MenuCategory = 'Cones' | 'Cups' | 'Shakes' | 'Toppings' | 'Cakes' | 'Sundaes';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  /** Machine-readable opening hours. Days use 0 = Sunday; times are minutes after midnight. */
  schedule: { days: number[]; open: number; close: number }[];
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  quote: string;
  /** True for reviews written in this browser. */
  mine?: boolean;
}

export type CartLineKind = 'flavor' | 'menu' | 'custom';

export interface CartLine {
  id: string;
  kind: CartLineKind;
  name: string;
  unitPrice: number;
  quantity: number;
  /** Extra description, e.g. the contents of a custom creation. */
  detail?: string;
  /** What a custom line is made of, so it can be described in any language. */
  creation?: { vesselId: string; flavorIds: string[]; toppingIds: string[] };
}

export type CartItemInput = Omit<CartLine, 'quantity'>;

export type Fulfilment = 'delivery' | 'pickup';

export interface Order {
  id: string;
  createdAt: number;
  /** ISO time the customer asked for, or 'asap'. */
  scheduledFor: string;
  customerName: string;
  fulfilment: Fulfilment;
  /** Pickup store name or delivery address. */
  destination: string;
  /** Set for pickup orders so the store name can be shown in any language. */
  storeId?: string;
  lines: CartLine[];
  promoCode: string | null;
  subtotal: number;
  discount: number;
  promoDiscount: number;
  deliveryFee: number;
  total: number;
}
