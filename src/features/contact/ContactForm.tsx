'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { CONTACT_SUBJECTS, contactSchema, type ContactValues } from '@/lib/schemas';
import { useI18n } from '@/i18n/provider';
import { contactService } from '@/services/contactService';

export function ContactForm() {
  const { t, m } = useI18n();
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema), defaultValues: { name: '', email: '', message: '' } });

  const onSubmit = async (values: ContactValues) => {
    try {
      await contactService.send(values);
      setSent(true);
      reset();
    } catch {
      toast.error(t('contact.failure'));
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center" role="status">
        <CheckCircle2 className="h-12 w-12 text-success" aria-hidden />
        <h3 className="text-xl font-semibold">{t('contact.sentTitle')}</h3>
        <p className="text-sm text-muted-foreground">{t('contact.sentText')}</p>
        <Button variant="outline" onClick={() => setSent(false)}>
          {t('contact.another')}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t('contact.name')} htmlFor="contact-name" error={errors.name?.message}>
          <Input id="contact-name" autoComplete="name" aria-invalid={errors.name ? true : undefined} aria-describedby={errors.name ? 'contact-name-error' : undefined} {...register('name')} />
        </Field>
        <Field label={t('contact.email')} htmlFor="contact-email" error={errors.email?.message}>
          <Input id="contact-email" type="email" autoComplete="email" aria-invalid={errors.email ? true : undefined} aria-describedby={errors.email ? 'contact-email-error' : undefined} {...register('email')} />
        </Field>
      </div>
      <Field label={t('contact.subject')} htmlFor="contact-subject" error={errors.subject?.message}>
        <Select id="contact-subject" defaultValue="" aria-invalid={errors.subject ? true : undefined} aria-describedby={errors.subject ? 'contact-subject-error' : undefined} {...register('subject')}>
          <option value="" disabled>
            {t('contact.chooseSubject')}
          </option>
          {CONTACT_SUBJECTS.map((subject) => (
            <option key={subject} value={subject}>
              {m.data.subjects[subject] ?? subject}
            </option>
          ))}
        </Select>
      </Field>
      <Field label={t('contact.message')} htmlFor="contact-message" error={errors.message?.message}>
        <Textarea id="contact-message" aria-invalid={errors.message ? true : undefined} aria-describedby={errors.message ? 'contact-message-error' : undefined} {...register('message')} />
      </Field>
      <Button type="submit" size="lg" loading={isSubmitting}>
        {t('contact.submit')}
      </Button>
    </form>
  );
}
