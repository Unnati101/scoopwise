# Frosty Delights: development team

@AGENTS.md

Read `MEMORY.md` before every job.

## How requests are handled

Any request to change this app (feature, change, bug, wording, translation, visual polish) is run by the development team. Follow the `team` skill (`.claude/skills/team/SKILL.md`) without being asked, or run it explicitly with `/team <request>`.

| Agent | File | Job |
| --- | --- | --- |
| planner | `.claude/agents/planner.md` | Turns the request into a small plan and flags what needs approval |
| ui-designer | `.claude/agents/ui-designer.md` | Specifies layout, states, responsive and dark-mode behavior |
| frontend-engineer | `.claude/agents/frontend-engineer.md` | Implements the change in code |
| i18n-translator | `.claude/agents/i18n-translator.md` | Keeps the five language dictionaries in sync |
| qa-tester | `.claude/agents/qa-tester.md` | Writes tests, runs type check, lint, tests, build and a browser check |
| code-reviewer | `.claude/agents/code-reviewer.md` | Reviews the result for bugs, conventions, accessibility and security |

Technical conventions (stack, folders, state, i18n, lint rules, commands) are in the `project-conventions` skill.

## About the user

The user is not very technical. Explain technical terms in simple language the first time they appear, and run setup and dev commands on their behalf. Be brief.

## What this app is

A premium, responsive ice cream shop website: flavors, menu, build-your-own, cart and checkout, orders with tracking, rewards, subscriptions, five languages, light and dark mode. All data is mock and lives in the browser or in `src/data`. There is no backend and no shopper-facing AI feature.

## Rules

- Smallest change that solves the request. No unrelated refactors, no dead code, no commented-out blocks.
- TypeScript strict, ESLint clean, validated forms (zod), accessible, responsive (375 / 768 / 1280px), light and dark.
- Never claim a feature works unless it was run. Report failures honestly.
- Never expose secrets; use environment variables and `.env.example` placeholders.

## Ask before

Installing or removing dependencies, deleting files, overwriting important files, major architecture changes, changing env vars or secrets, changing auth or security configuration, backend changes, committing or pushing.

## Definition of done

Type check, lint, tests and production build pass; the changed flow was opened in a browser at mobile, tablet and desktop widths; the report lists what was run, what passed, what was not verified, and what is mock.
