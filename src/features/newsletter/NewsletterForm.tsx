'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useI18n } from '@/i18n/provider';
import type { MessageKey } from '@/i18n/translate';
import { newsletterSchema, type NewsletterValues } from '@/lib/schemas';
import { newsletterService } from '@/services/newsletterService';

export function NewsletterForm() {
  const { t } = useI18n();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterValues>({ resolver: zodResolver(newsletterSchema), defaultValues: { email: '' } });

  const onSubmit = async (values: NewsletterValues) => {
    try {
      await newsletterService.subscribe(values);
      toast.success(t('newsletter.success'));
      reset();
    } catch {
      toast.error(t('newsletter.failure'));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-2">
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder={t('newsletter.placeholder')}
          aria-label={t('newsletter.label')}
          autoComplete="email"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? 'newsletter-email-error' : undefined}
          className="h-10 min-w-0"
          {...register('email')}
        />
        <Button type="submit" size="sm" loading={isSubmitting} className="h-10 shrink-0">
          {t('newsletter.subscribe')}
        </Button>
      </div>
      {errors.email && (
        <p id="newsletter-email-error" role="alert" className="text-xs font-medium text-danger">
          {t(errors.email.message as MessageKey)}
        </p>
      )}
    </form>
  );
}
