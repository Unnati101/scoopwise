'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface CartUiValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const CartUiContext = createContext<CartUiValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);
  return <CartUiContext.Provider value={value}>{children}</CartUiContext.Provider>;
}

export function useCartUi(): CartUiValue {
  const context = useContext(CartUiContext);
  if (!context) throw new Error('useCartUi must be used inside CartProvider');
  return context;
}
