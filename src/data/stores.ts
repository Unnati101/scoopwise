import type { Review, Store } from '@/types';

// MOCK DATA: fictional stores and reviews for the demo.
export const stores: Store[] = [
  {
    id: 'downtown',
    name: 'Downtown Branch',
    address: '123 Sweet Street',
    city: 'Dessert City, CA 90210',
    phone: '(555) 010-1234',
    schedule: [
      { days: [1, 2, 3, 4], open: 11 * 60, close: 21 * 60 },
      { days: [5, 6], open: 11 * 60, close: 23 * 60 },
      { days: [0], open: 12 * 60, close: 21 * 60 },
    ],
  },
  {
    id: 'beachside',
    name: 'Beachside Branch',
    address: '456 Ocean Drive',
    city: 'Dessert City, CA 90211',
    phone: '(555) 010-5678',
    schedule: [
      { days: [1, 2, 3, 4], open: 10 * 60, close: 21 * 60 },
      { days: [5, 6, 0], open: 10 * 60, close: 23 * 60 },
    ],
  },
];

export const reviews: Review[] = [
  { id: 'r1', name: 'Emily R.', rating: 5, quote: 'So creamy and full of flavor! The strawberry is my absolute favorite. Will be back soon!' },
  { id: 'r2', name: 'Jason M.', rating: 5, quote: 'The chocolate fudge is next level. Great service and a super clean shop. Highly recommend!' },
  { id: 'r3', name: 'Sophia L.', rating: 5, quote: 'Great service, great flavors, and beautiful desserts. My kids love the sundaes!' },
];
