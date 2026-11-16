import { checkoutSchema, contactSchema, newsletterSchema } from '@/lib/schemas';

const baseCheckout = { name: 'Ada Lovelace', email: 'ada@example.com', phone: '555 010 1234', fulfilment: 'pickup' as const, storeId: 'downtown', scheduledFor: 'asap' };

describe('checkoutSchema', () => {
  it('accepts a valid pickup order', () => {
    expect(checkoutSchema.safeParse(baseCheckout).success).toBe(true);
  });

  it('requires a store for pickup', () => {
    const result = checkoutSchema.safeParse({ ...baseCheckout, storeId: '' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['storeId']);
  });

  it('requires an address for delivery', () => {
    const result = checkoutSchema.safeParse({ ...baseCheckout, fulfilment: 'delivery', address: '' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['address']);
    expect(checkoutSchema.safeParse({ ...baseCheckout, fulfilment: 'delivery', address: '1 Main Street' }).success).toBe(true);
  });

  it('rejects an invalid email and phone', () => {
    const result = checkoutSchema.safeParse({ ...baseCheckout, email: 'nope', phone: 'abc' });
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.path[0])).toEqual(expect.arrayContaining(['email', 'phone']));
  });
});

describe('contactSchema', () => {
  it('rejects a short message and a missing subject', () => {
    const result = contactSchema.safeParse({ name: 'Ada', email: 'ada@example.com', subject: '', message: 'Hi' });
    expect(result.success).toBe(false);
  });
});

describe('newsletterSchema', () => {
  it('trims and validates the email', () => {
    expect(newsletterSchema.safeParse({ email: '  ada@example.com ' }).data).toEqual({ email: 'ada@example.com' });
    expect(newsletterSchema.safeParse({ email: 'bad' }).success).toBe(false);
  });
});
