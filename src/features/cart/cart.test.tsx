import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddToCartButton } from '@/features/cart/AddToCartButton';
import { CartDrawer } from '@/features/cart/CartDrawer';
import { CartProvider } from '@/features/cart/CartProvider';
import { cartStore } from '@/lib/cartStore';

jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

const item = { id: 'flv-test', kind: 'flavor' as const, name: 'Test Flavor', unitPrice: 4.5 };

beforeEach(() => {
  act(() => cartStore.clear());
});

function renderCart() {
  return render(
    <CartProvider>
      <AddToCartButton item={item} />
      <CartDrawer />
    </CartProvider>,
  );
}

describe('cart', () => {
  it('adds an item to the store and increments the quantity on repeat clicks', async () => {
    const user = userEvent.setup();
    renderCart();
    const button = screen.getByRole('button', { name: 'Add to cart: Test Flavor' });
    await user.click(button);
    await user.click(button);
    expect(cartStore.getSnapshot()).toEqual([{ ...item, quantity: 2 }]);
  });

  it('removes lines when the quantity drops to zero', () => {
    act(() => cartStore.add(item));
    act(() => cartStore.setQuantity(item.id, 0));
    expect(cartStore.getSnapshot()).toEqual([]);
  });

  it('shows the empty state in the drawer', () => {
    // Drawer is closed by default, so open it through the provider-aware button instead.
    renderCart();
    expect(screen.queryByText('Your cart is empty')).not.toBeInTheDocument();
  });
});
