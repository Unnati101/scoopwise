import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { stores } from '@/data/stores';
import { CheckoutView } from '@/features/checkout/CheckoutView';
import { cartStore } from '@/lib/cartStore';
import { ordersStore } from '@/lib/ordersStore';
import { activePromoStore } from '@/lib/promos';

jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

beforeEach(() => {
  act(() => {
    cartStore.clear();
    ordersStore.set([]);
    activePromoStore.set(null);
    cartStore.add({ id: 'menu-test', kind: 'menu', name: 'Test Shake', unitPrice: 400 });
  });
});

describe('CheckoutView', () => {
  it('applies a promo code, places the order, and saves it for tracking', async () => {
    const user = userEvent.setup();
    render(<CheckoutView stores={stores} />);

    await user.type(screen.getByLabelText('Promo code'), 'frosty10');
    await user.click(screen.getByRole('button', { name: 'Apply' }));
    expect(screen.getByText('-₹40')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Full name'), 'Ada Lovelace');
    await user.type(screen.getByLabelText('Email'), 'ada@example.com');
    await user.type(screen.getByLabelText('Phone'), '555 010 1234');
    await user.selectOptions(screen.getByLabelText('Pickup store'), 'downtown');

    const time = screen.getByLabelText('When do you want it?');
    const options = within(time).getAllByRole('option');
    expect(options.length).toBeGreaterThan(1);
    await user.selectOptions(time, options[1]!);

    await user.click(screen.getByRole('button', { name: 'Place order' }));

    expect(await screen.findByRole('heading', { name: /Your order is in/ })).toBeInTheDocument();
    await waitFor(() => expect(ordersStore.getSnapshot()).toHaveLength(1));
    expect(ordersStore.getSnapshot()[0]).toMatchObject({ total: 360, promoCode: 'FROSTY10', destination: 'Downtown Branch', fulfilment: 'pickup' });
    expect(cartStore.getSnapshot()).toEqual([]);
    expect(activePromoStore.getSnapshot()).toBeNull();
  });

  it('asks for a time before placing the order', async () => {
    const user = userEvent.setup();
    render(<CheckoutView stores={stores} />);
    await user.click(screen.getByRole('button', { name: 'Place order' }));
    expect(await screen.findByText('Choose when you want your order')).toBeInTheDocument();
    expect(ordersStore.getSnapshot()).toHaveLength(0);
  });

  it('rejects an unknown promo code', async () => {
    const user = userEvent.setup();
    render(<CheckoutView stores={stores} />);
    await user.type(screen.getByLabelText('Promo code'), 'nope');
    await user.click(screen.getByRole('button', { name: 'Apply' }));
    expect(screen.getByRole('alert')).toHaveTextContent('That code is not valid.');
  });
});
