---
name: project-conventions
description: Frosty Delights technical conventions: stack, folder layout, state, i18n, pricing, lint rules, commands, and known pitfalls. Read before writing, reviewing or testing code in this app.
user-invocable: false
---

# Frosty Delights conventions

## Stack

Next.js 16 App Router (pages render on demand; the language comes from a cookie), React 19, TypeScript strict with `noUncheckedIndexedAccess`, Tailwind 3 with CSS-variable tokens and a `.dark` class, zod 4, react-hook-form, sonner (toasts), lucide-react, Jest 30 with Testing Library. Imports use the `@/` alias for `src/`. Read `node_modules/next/dist/docs/` before changing Next.js specific code.

## Layout

`src/app` (routes, thin), `src/components/{ui,layout,illustrations}`, `src/features/<feature>`, `src/hooks`, `src/i18n`, `src/lib` (pure logic and stores), `src/data` (mock data), `src/services` (data access behind async functions), `src/types`.

## Data and state

- All data is mock and lives in the browser or in `src/data`. Label mock data in code and in reports. Never invent real endpoints.
- Browser state uses `createLocalStore(key, zodSchema, empty)` from `src/lib/localStore.ts` and `useLocalStore(store)`. Keys: `frosty.cart`, `frosty.orders`, `frosty.favorites`, `frosty.promo`, `frosty.rewardCodes`, `frosty.pointsSpent`, `frosty.subscription`, `frosty.reviews`, `frosty.theme`.

## Text and languages

- Five languages: en, es, hi, fr, de. `src/i18n/messages/en.ts` is the typed source of truth (`Messages`); the others are `export const xx: Messages`.
- `src/i18n/messages.test.ts` enforces identical keys, identical `{placeholders}`, identical `|` plural markers, and under 10% untranslated text.
- Use `t('dotted.key', { params })` from `useI18n()` (client) or `getI18n()` (server). `MessageKey` excludes arrays and `Record<string, ...>` maps: read those through `m.data.*`, `m.nav[key]` and similar.
- Catalog items (flavors, menu, stores, plans) are localized through `src/i18n/localize.ts`.

## Money and dates

Prices are rupees. Format with `formatCurrency`; format dates with the helpers in `i18n/translate.ts`. Never hard-code `$` or `₹` in text.

## Lint rules that bite

- Do not call `Date.now()` or other impure functions during render. Put them in event handlers or actions.
- Use `useWatch` instead of `watch` from react-hook-form.
- Indexed access can be `undefined`; handle it.

## Commands (run from the app folder)

`npm run typecheck`, `npm run lint`, `npx jest`, `npm run build`, `npm run start -- -p 3100`. Format with `npm run format`.

## Pitfalls

- After deleting or renaming a route, `npm run typecheck` can fail on stale `.next/types`. Run `npm run build` once.
- Stop the server on port 3100 before building; start it again afterwards.
- Check UI work in a fresh browser tab; old tabs can show stale "Loading".
- A multi-file replace can leave stale or clipped edits; re-read the file after editing.
