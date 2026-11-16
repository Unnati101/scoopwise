import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from '@/features/contact/ContactForm';

jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

describe('ContactForm', () => {
  it('shows inline errors for an empty submission', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    expect(await screen.findByText('Enter your name')).toBeInTheDocument();
    expect(screen.getByText('Enter a valid email address')).toBeInTheDocument();
    expect(screen.getByText('Choose a subject', { selector: 'p' })).toBeInTheDocument();
    expect(screen.getAllByRole('alert')).toHaveLength(4);
  });

  it('shows a confirmation after a valid submission', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByLabelText('Name'), 'Ada Lovelace');
    await user.type(screen.getByLabelText('Email'), 'ada@example.com');
    await user.selectOptions(screen.getByLabelText('Subject'), 'Feedback');
    await user.type(screen.getByLabelText('Message'), 'Loved the mango flavor, thank you!');
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    expect(await screen.findByText(/your message is on its way/i)).toBeInTheDocument();
  });
});
