'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Gift } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Field } from '@/components/ui/Field';
import { Input, Textarea } from '@/components/ui/Input';
import { useCartUi } from '@/features/cart/CartProvider';
import { useI18n } from '@/i18n/provider';
import { cartStore } from '@/lib/cartStore';
import { giftSchema, type GiftValues } from '@/lib/schemas';
import type { Flavor } from '@/types';

export function GiftScoopButton({ flavor }: { flavor: Flavor }) {
  const { t } = useI18n();
  const { open: openCart } = useCartUi();
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GiftValues>({ resolver: zodResolver(giftSchema), defaultValues: { recipient: '', message: '' } });

  const close = useCallback(() => {
    setOpen(false);
    reset();
  }, [reset]);

  const onSubmit = ({ recipient, message }: GiftValues) => {
    cartStore.addGift({
      name: t('flavors.gift.lineName', { name: flavor.name }),
      unitPrice: flavor.price,
      detail: message ? t('flavors.gift.toWithMessage', { recipient, message }) : t('flavors.gift.to', { recipient }),
    });
    toast.success(t('flavors.gift.added', { recipient }), { action: { label: t('cart.view'), onClick: openCart } });
    close();
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} aria-label={t('flavors.gift.buttonFor', { name: flavor.name })} className="w-full">
        <Gift className="h-4 w-4" aria-hidden />
        {t('flavors.gift.button')}
      </Button>
      <Dialog open={open} onClose={close} title={t('flavors.gift.title', { name: flavor.name })}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 space-y-4 text-left">
          <Field label={t('flavors.gift.recipient')} htmlFor={`gift-recipient-${flavor.id}`} error={errors.recipient?.message}>
            <Input
              id={`gift-recipient-${flavor.id}`}
              autoComplete="off"
              aria-invalid={errors.recipient ? true : undefined}
              aria-describedby={errors.recipient ? `gift-recipient-${flavor.id}-error` : undefined}
              {...register('recipient')}
            />
          </Field>
          <Field label={t('flavors.gift.message')} htmlFor={`gift-message-${flavor.id}`} error={errors.message?.message}>
            <Textarea
              id={`gift-message-${flavor.id}`}
              className="min-h-20"
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={errors.message ? `gift-message-${flavor.id}-error` : undefined}
              {...register('message')}
            />
          </Field>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={close}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">{t('flavors.gift.submit')}</Button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
