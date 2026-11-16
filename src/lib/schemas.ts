import { z } from 'zod';

// Error messages are dictionary keys (see i18n/messages); Field translates them for display.
const email = z.string().trim().pipe(z.email('errors.email'));

export const newsletterSchema = z.object({ email });
export type NewsletterValues = z.infer<typeof newsletterSchema>;

export const CONTACT_SUBJECTS = ['General question', 'Catering & parties', 'Ice cream cakes', 'Feedback'] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'errors.name'),
  email,
  subject: z.enum(CONTACT_SUBJECTS, { error: 'errors.subject' }),
  message: z.string().trim().min(10, 'errors.messageShort').max(1000, 'errors.messageLong'),
});
export type ContactValues = z.infer<typeof contactSchema>;

export const reviewSchema = z.object({
  name: z.string().trim().min(2, 'errors.name'),
  rating: z.number({ error: 'errors.rating' }).int().min(1, 'errors.rating').max(5),
  quote: z.string().trim().min(10, 'errors.messageShort').max(300, 'errors.reviewLong'),
});
export type ReviewValues = z.infer<typeof reviewSchema>;

export const checkoutSchema = z
  .object({
    name: z.string().trim().min(2, 'errors.fullName'),
    email,
    phone: z.string().trim().regex(/^[0-9+()\-.\s]{7,20}$/, 'errors.phone'),
    fulfilment: z.enum(['delivery', 'pickup']),
    address: z.string().trim().optional(),
    storeId: z.string().optional(),
    scheduledFor: z.string().min(1, 'errors.time'),
    notes: z.string().trim().max(200, 'errors.notes').optional(),
  })
  .superRefine((values, ctx) => {
    if (values.fulfilment === 'delivery' && (values.address ?? '').length < 5) {
      ctx.addIssue({ code: 'custom', path: ['address'], message: 'errors.address' });
    }
    if (values.fulfilment === 'pickup' && !values.storeId) {
      ctx.addIssue({ code: 'custom', path: ['storeId'], message: 'errors.store' });
    }
  });
export type CheckoutValues = z.infer<typeof checkoutSchema>;

export const giftSchema = z.object({
  recipient: z.string().trim().min(2, 'errors.recipient'),
  message: z.string().trim().max(120, 'errors.giftMessage').optional(),
});
export type GiftValues = z.infer<typeof giftSchema>;

export const SUBSCRIPTION_FREQUENCIES = ['weekly', 'biweekly', 'monthly'] as const;

export const subscribeSchema = z.object({
  name: z.string().trim().min(2, 'errors.fullName'),
  email,
  address: z.string().trim().min(5, 'errors.address'),
  frequency: z.enum(SUBSCRIPTION_FREQUENCIES, { error: 'errors.frequency' }),
});
export type SubscribeValues = z.infer<typeof subscribeSchema>;
