'use client';

import { RotateCcw, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { ScoopCup } from '@/components/illustrations/ScoopCup';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { AddToCartButton } from '@/features/cart/AddToCartButton';
import { QUIZ_QUESTIONS, recommendFlavors, type QuizAnswers, type QuizKey } from '@/lib/flavorQuiz';
import { useI18n } from '@/i18n/provider';
import type { Flavor } from '@/types';

export function FlavorQuiz({ flavors }: { flavors: Flavor[] }) {
  const { t, m, formatCurrency } = useI18n();
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const step = QUIZ_QUESTIONS.findIndex((question) => answers[question.key] === undefined);
  const question = QUIZ_QUESTIONS[step];
  const questionText = question ? m.home.quiz.questions[question.key] : undefined;
  const picks = step === -1 ? recommendFlavors(flavors, answers as QuizAnswers) : [];

  const answer = (key: QuizKey, value: string) => setAnswers((current) => ({ ...current, [key]: value }));

  return (
    <section id="flavor-finder" className="container scroll-mt-40 pt-16" aria-labelledby="quiz-heading">
      <div className="rounded-2xl border bg-surface p-6 shadow-card sm:p-8">
        <SectionHeading id="quiz-heading" title={t('home.quiz.title')} eyebrow={t('home.quiz.eyebrow')} className="justify-center text-center" />

        {question && questionText ? (
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-muted-foreground" aria-live="polite">
              {t('home.quiz.progress', { step: step + 1, total: QUIZ_QUESTIONS.length })}
            </p>
            <h3 className="mt-1 text-2xl font-bold">{questionText.title}</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {question.options.map((value) => {
                const option = (questionText.options as Record<string, { label: string; hint: string }>)[value];
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => answer(question.key, value)}
                    className="rounded-xl border-2 border-border bg-background p-4 text-left transition-colors hover:border-primary hover:bg-blush"
                  >
                    <span className="block font-display text-lg font-semibold">{option?.label}</span>
                    <span className="block text-xs text-muted-foreground">{option?.hint}</span>
                  </button>
                );
              })}
            </div>
            {step > 0 && (
              <Button variant="ghost" size="sm" className="mt-4" onClick={() => setAnswers({})}>
                <RotateCcw className="h-4 w-4" aria-hidden />
                {t('home.quiz.startOver')}
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center" aria-live="polite">
            <p className="flex items-center justify-center gap-2 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" aria-hidden />
              {t('home.quiz.picks')}
            </p>
            {picks.length === 0 ? (
              <p className="mt-4 text-muted-foreground">{t('home.quiz.none')}</p>
            ) : (
              <ul className="mt-5 grid gap-4 sm:grid-cols-3">
                {picks.map((flavor, index) => (
                  <li key={flavor.id} className="flex flex-col items-center gap-2 rounded-2xl p-4" style={{ backgroundColor: `${flavor.color}33` }}>
                    <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{t('home.quiz.match', { rank: index + 1 })}</span>
                    <ScoopCup color={flavor.color} speckle={flavor.speckle} className="h-24 w-24" />
                    <h4 className="font-display text-lg font-semibold">{flavor.name}</h4>
                    <p className="text-xs text-muted-foreground">{flavor.description}</p>
                    <p className="text-sm font-semibold">{t('home.quiz.perScoop', { price: formatCurrency(flavor.price) })}</p>
                    <AddToCartButton item={{ id: flavor.id, kind: 'flavor', name: flavor.name, unitPrice: flavor.price }} className="w-full" />
                  </li>
                ))}
              </ul>
            )}
            <Button variant="outline" size="sm" className="mt-5" onClick={() => setAnswers({})}>
              <RotateCcw className="h-4 w-4" aria-hidden />
              {t('home.quiz.again')}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
