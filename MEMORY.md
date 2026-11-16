Only save feedback that applies to future jobs, not one-off edits.

## Preferences

- The user wants all agent work to happen in the VS Code chat window, never as features inside the app UI.
- Premium/elegant design. Prices in rupees (₹). Five languages, full site translated.
- Get approval for the plan, stack, and library list before installing anything. The user declined installing packages before, so prefer what is already installed.

## Lessons

- Run type check, lint, tests, and a production build before reporting; state honestly what was not verified.
- Label mock data in code and in reports.
- Test in a real browser, in a fresh tab: a real run caught a bug (ASAP orders shown as "Invalid Date") that unit tests missed.
- Start the server with `npm --prefix <app folder> run start -- -p 3100`; a bare `cd` can be dropped and launch the wrong app.
- Keep new English text and all four other languages in sync in the same change; the parity test enforces it.
- Do not call `Date.now()` during render (lint rule); use `useWatch`, not `watch`.
- After deleting routes, `tsc` can fail on stale `.next/types`; run `npm run build` once.
- Re-read a file after a multi-part edit; clipped or stale replacements happen.
