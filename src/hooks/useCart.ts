'use client';

import { useMemo } from 'react';
import { useLocalStore } from '@/hooks/useLocalStore';
import { priceCart } from '@/lib/cartPricing';
import { cartStore } from '@/lib/cartStore';
import { activePromoStore, lookupPromo, rewardCodesStore } from '@/lib/promos';
import type { Fulfilment } from '@/types';

export function useCart(fulfilment: Fulfilment = 'pickup') {
  const lines = useLocalStore(cartStore);
  const code = useLocalStore(activePromoStore);
  const rewardCodes = useLocalStore(rewardCodesStore);

  const promo = useMemo(() => (code ? lookupPromo(code, rewardCodes) : null), [code, rewardCodes]);
  const pricing = useMemo(() => priceCart(lines, fulfilment, promo), [lines, fulfilment, promo]);

  return { lines, pricing, promo };
}
