import type { Flavor, FlavorCategory } from '@/types';

export type QuizKey = 'mood' | 'adventure' | 'diet';
export type QuizAnswers = Record<QuizKey, string>;

export const QUIZ_QUESTIONS: { key: QuizKey; options: string[] }[] = [
  { key: 'mood', options: ['fruity', 'rich', 'creamy', 'nutty'] },
  { key: 'adventure', options: ['classic', 'bold'] },
  { key: 'diet', options: ['any', 'dairy-free'] },
];

const MOOD_CATEGORIES: Record<string, FlavorCategory[]> = {
  fruity: ['Fruity', 'Sorbet'],
  rich: ['Chocolatey'],
  creamy: ['Creamy'],
  nutty: ['Nutty'],
};

export function recommendFlavors(flavors: Flavor[], answers: QuizAnswers, limit = 3): Flavor[] {
  const wanted = MOOD_CATEGORIES[answers.mood] ?? [];
  return flavors
    .filter((flavor) => answers.diet !== 'dairy-free' || flavor.dairyFree)
    .map((flavor) => {
      let score = flavor.rating / 10;
      if (wanted.includes(flavor.category)) score += 3;
      if (answers.adventure === 'classic' ? flavor.popular : !flavor.popular) score += 2;
      return { flavor, score };
    })
    .sort((a, b) => b.score - a.score || a.flavor.name.localeCompare(b.flavor.name))
    .slice(0, limit)
    .map(({ flavor }) => flavor);
}
