import { ChevronDown } from 'lucide-react';
import { getI18n } from '@/i18n/server';

export async function FaqList() {
  const { t, m } = await getI18n();
  return (
    <div id="faq" className="scroll-mt-32 space-y-3">
      <h2 className="text-2xl font-bold">{t('contact.faqTitle')}</h2>
      {m.contact.faqs.map((faq) => (
        <details key={faq.q} className="group rounded-xl border bg-surface p-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold">
            {faq.q}
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden />
          </summary>
          <p className="mt-3 text-sm text-muted-foreground">{faq.a}</p>
        </details>
      ))}
    </div>
  );
}
