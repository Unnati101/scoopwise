import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddToCartButton } from '@/features/cart/AddToCartButton';
import { CartDrawer } from '@/features/cart/CartDrawer';
import { CartProvider, useCartUi } from '@/features/cart/CartProvider';
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

const other = { id: 'flv-other', kind: 'flavor' as const, name: 'Other Flavor', unitPrice: 5 };

function OpenButton() {
  const { open } = useCartUi();
  return <button onClick={open}>Open drawer</button>;
}

async function openDrawer() {
  const user = userEvent.setup();
  render(
    <CartProvider>
      <OpenButton />
      <CartDrawer />
    </CartProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Open drawer' }));
  return user;
}

describe('cart drawer clear confirmation', () => {
  it('shows the confirmation without emptying the cart and hides Checkout', async () => {
    act(() => {
      cartStore.add(item);
      cartStore.add(other);
    });
    const user = await openDrawer();
    expect(screen.getByRole('link', { name: 'Checkout' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear cart' }));

    expect(screen.getByRole('group')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Clear your cart?');
    expect(screen.getByRole('button', { name: 'Keep items' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Yes, clear cart' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Checkout' })).not.toBeInTheDocument();
    expect(cartStore.getSnapshot()).toHaveLength(2);
  });

  it('keeps the cart intact on "Keep items" and returns focus to "Clear cart"', async () => {
    act(() => {
      cartStore.add(item);
      cartStore.add(other);
    });
    const user = await openDrawer();
    await user.click(screen.getByRole('button', { name: 'Clear cart' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Keep items' })).toHaveFocus());

    await user.click(screen.getByRole('button', { name: 'Keep items' }));

    expect(screen.queryByRole('group')).not.toBeInTheDocument();
    expect(cartStore.getSnapshot()).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'Checkout' })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('button', { name: 'Clear cart' })).toHaveFocus());
  });

  it('empties the cart on "Yes, clear cart" and focuses the empty-state heading', async () => {
    act(() => {
      cartStore.add(item);
      cartStore.add(other);
    });
    const user = await openDrawer();
    await user.click(screen.getByRole('button', { name: 'Clear cart' }));
    await user.click(screen.getByRole('button', { name: 'Yes, clear cart' }));

    expect(cartStore.getSnapshot()).toEqual([]);
    const heading = screen.getByRole('heading', { name: 'Your cart is empty' });
    expect(heading).toBeInTheDocument();
    await waitFor(() => expect(heading).toHaveFocus());
  });

  it.each([
    ['Escape', async (user: ReturnType<typeof userEvent.setup>) => user.keyboard('{Escape}')],
    ['the backdrop', async (user: ReturnType<typeof userEvent.setup>) => user.click(document.body.querySelector('.bg-foreground\\/40') as HTMLElement)],
    ['the X button', async (user: ReturnType<typeof userEvent.setup>) => user.click(screen.getByRole('button', { name: 'Close Your cart' }))],
  ])('keeps the cart and resets the confirmation when closed with %s', async (_label, close) => {
    act(() => cartStore.add(item));
    const user = await openDrawer();
    await user.click(screen.getByRole('button', { name: 'Clear cart' }));
    expect(screen.getByRole('group')).toBeInTheDocument();

    await close(user);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(cartStore.getSnapshot()).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: 'Open drawer' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.queryByRole('group')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear cart' })).toBeInTheDocument();
  });

  it('leaves no stale panel when the last line is removed while confirming', async () => {
    act(() => cartStore.add(item));
    const user = await openDrawer();
    await user.click(screen.getByRole('button', { name: 'Clear cart' }));
    await user.click(screen.getByRole('button', { name: 'Remove Test Flavor' }));

    expect(cartStore.getSnapshot()).toEqual([]);
    expect(screen.getByRole('heading', { name: 'Your cart is empty' })).toBeInTheDocument();
    expect(screen.queryByRole('group')).not.toBeInTheDocument();
  });

  it('uses the singular text for a total quantity of 1', async () => {
    act(() => cartStore.add(item));
    const user = await openDrawer();
    await user.click(screen.getByRole('button', { name: 'Clear cart' }));
    expect(screen.getByText('This removes 1 item from your cart.')).toBeInTheDocument();
  });

  it('uses the plural text and counts the sum of quantities for one line of quantity 3', async () => {
    act(() => {
      cartStore.add(item);
      cartStore.add(item);
      cartStore.add(item);
    });
    expect(cartStore.getSnapshot()).toHaveLength(1);
    const user = await openDrawer();
    await user.click(screen.getByRole('button', { name: 'Clear cart' }));
    expect(screen.getByText('This removes all 3 items from your cart.')).toBeInTheDocument();
  });

  it('sums quantities across several lines', async () => {
    act(() => {
      cartStore.add(item);
      cartStore.add(item);
      cartStore.add(other);
    });
    const user = await openDrawer();
    await user.click(screen.getByRole('button', { name: 'Clear cart' }));
    expect(screen.getByText('This removes all 3 items from your cart.')).toBeInTheDocument();
  });
});
