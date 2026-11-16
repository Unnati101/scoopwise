'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Star } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Field } from '@/components/ui/Field';
import { Input, Textarea } from '@/components/ui/Input';
import { useI18n } from '@/i18n/provider';
import type { MessageKey } from '@/i18n/translate';
import { addMyReview } from '@/lib/reviews';
import { reviewSchema, type ReviewValues } from '@/lib/schemas';
import { cn } from '@/lib/utils';

export function ReviewDialog() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ReviewValues>({ resolver: zodResolver(reviewSchema), defaultValues: { name: '', quote: '' } });

  const onSubmit = (values: ReviewValues) => {
    addMyReview(values);
    toast.success(t('home.reviews.thanks'));
    reset();
    setOpen(false);
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        {t('home.reviews.write')}
      </Button>
      <Dialog open={open} onClose={close} title={t('home.reviews.dialogTitle')}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 space-y-4">
          <Field label={t('home.reviews.name')} htmlFor="review-name" error={errors.name?.message}>
            <Input id="review-name" autoComplete="given-name" aria-invalid={errors.name ? true : undefined} aria-describedby={errors.name ? 'review-name-error' : undefined} {...register('name')} />
          </Field>

          <Controller
            control={control}
            name="rating"
            render={({ field }) => (
              <fieldset className="space-y-1.5">
                <legend className="text-sm font-semibold">{t('home.reviews.rating')}</legend>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => field.onChange(value)}
                      aria-pressed={field.value === value}
                      aria-label={t('home.reviews.stars', { count: value })}
                      className="rounded-full p-1"
                    >
                      <Star className={cn('h-8 w-8 transition-colors', (field.value ?? 0) >= value ? 'fill-accent text-accent' : 'text-border')} aria-hidden />
                    </button>
                  ))}
                </div>
                {errors.rating && (
                  <p role="alert" className="text-xs font-medium text-danger">
                    {t(errors.rating.message as MessageKey)}
                  </p>
                )}
              </fieldset>
            )}
          />

          <Field label={t('home.reviews.body')} htmlFor="review-quote" error={errors.quote?.message}>
            <Textarea id="review-quote" aria-invalid={errors.quote ? true : undefined} aria-describedby={errors.quote ? 'review-quote-error' : undefined} {...register('quote')} />
          </Field>

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={close}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">{t('home.reviews.post')}</Button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
