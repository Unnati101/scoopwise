import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { flavors } from '@/data/flavors';
import { menuItems } from '@/data/menu';
import { IceCreamBuilder } from '@/features/builder/IceCreamBuilder';
import { CartProvider } from '@/features/cart/CartProvider';
import { cartStore } from '@/lib/cartStore';

jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

const toppings = menuItems.filter((item) => item.category === 'Toppings');

beforeEach(() => {
  act(() => cartStore.clear());
});

function renderBuilder() {
  return render(
    <CartProvider>
      <IceCreamBuilder flavors={flavors} toppings={toppings} />
    </CartProvider>,
  );
}

describe('IceCreamBuilder', () => {
  it('cannot be added to the cart until a scoop is chosen', () => {
    renderBuilder();
    expect(screen.getByRole('button', { name: 'Add to cart' })).toBeDisabled();
  });

  it('prices the creation live and adds it to the cart as a custom line', async () => {
    const user = userEvent.setup();
    renderBuilder();
    await user.click(screen.getByRole('button', { name: 'Add a scoop of Mango Magic' }));
    await user.click(screen.getByRole('button', { name: /Rainbow Sprinkles/ }));
    // Waffle cone 60 + Mango Magic 115 + sprinkles 20
    expect(screen.getByText('₹195')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Add to cart' }));
    expect(cartStore.getSnapshot()).toEqual([
      expect.objectContaining({ kind: 'custom', name: 'Custom Waffle cone', unitPrice: 195, detail: 'Mango Magic with Rainbow Sprinkles', quantity: 1 }),
    ]);
  });

  it('stops at three scoops', async () => {
    const user = userEvent.setup();
    renderBuilder();
    const add = screen.getByRole('button', { name: 'Add a scoop of Vanilla Dream' });
    await user.click(add);
    await user.click(add);
    await user.click(add);
    expect(add).toBeDisabled();
    expect(screen.getByText(/3 of 3 scoops/)).toBeInTheDocument();
  });
});
