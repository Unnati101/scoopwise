import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider } from '@/features/cart/CartProvider';
import { GiftScoopButton } from '@/features/flavors/GiftScoopButton';
import { cartStore } from '@/lib/cartStore';
import type { Flavor } from '@/types';

jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

const flavor = { id: 'flv-test', name: 'Test Flavor', price: 80 } as Flavor;

beforeEach(() => {
  act(() => cartStore.clear());
});

function renderButton() {
  return render(
    <CartProvider>
      <GiftScoopButton flavor={flavor} />
    </CartProvider>,
  );
}

describe('GiftScoopButton', () => {
  it('asks for a recipient and adds a gift line to the cart', async () => {
    const user = userEvent.setup();
    renderButton();
    await user.click(screen.getByRole('button', { name: 'Gift a scoop of Test Flavor' }));
    await user.click(screen.getByRole('button', { name: 'Add gift to cart' }));
    expect(screen.getByText("Enter the recipient's name")).toBeInTheDocument();
    expect(cartStore.getSnapshot()).toHaveLength(0);

    await user.type(screen.getByLabelText('Recipient name'), 'Asha');
    await user.type(screen.getByLabelText('Gift message (optional)'), 'Happy birthday');
    await user.click(screen.getByRole('button', { name: 'Add gift to cart' }));

    expect(cartStore.getSnapshot()).toEqual([
      expect.objectContaining({ kind: 'custom', name: 'Gift scoop: Test Flavor', unitPrice: 80, quantity: 1, detail: 'For Asha: "Happy birthday"' }),
    ]);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
