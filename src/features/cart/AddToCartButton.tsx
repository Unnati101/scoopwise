'use client';

import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button, type ButtonProps } from '@/components/ui/Button';
import { useCartUi } from '@/features/cart/CartProvider';
import { useI18n } from '@/i18n/provider';
import { cartStore } from '@/lib/cartStore';
import type { CartItemInput } from '@/types';

interface AddToCartButtonProps extends Omit<ButtonProps, 'onClick' | 'children'> {
  item: CartItemInput;
  label?: string;
}

export function AddToCartButton({ item, label, variant = 'soft', size = 'sm', ...props }: AddToCartButtonProps) {
  const { open } = useCartUi();
  const { t } = useI18n();
  const text = label ?? t('cart.add');

  const handleClick = () => {
    cartStore.add(item);
    toast.success(t('cart.addedToast', { name: item.name }), { action: { label: t('cart.view'), onClick: open } });
  };

  return (
    <Button variant={variant} size={size} onClick={handleClick} aria-label={t('cart.addLabel', { label: text, name: item.name })} {...props}>
      <Plus className="h-4 w-4" aria-hidden />
      {text}
    </Button>
  );
}
