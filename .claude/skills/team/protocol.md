# Team protocol

Shared rules for the orchestrator (`team` skill, `team-lead` agent) and the six agents. Subagents cannot start other subagents, so only the orchestrator delegates; agents ask for follow-up work by listing it under **Handoffs needed** in their report, and the orchestrator must act on every one.

## Limits (defaults)

The user can override them in the request, for example "max rounds 3".

| Limit | Default |
| --- | --- |
| Attempts per task (first try plus corrections) | 3 |
| Correction rounds per job (one round = fix, then re-verify) | 6 |
| Same failure repeated | 2nd time: change the approach or the owner. 3rd time: blocker |
| No progress | 2 rounds in a row with no fewer failures and no new, smaller failure: blocker |

Progress means fewer failing gates, tests or findings, or a different and smaller failure than before. When a limit is hit, stop and report the exact blocker. Never claim success.

## Task ledger

The orchestrator keeps `.claude/ledger.md` (gitignored, plain markdown, overwritten at the start of each new job) and mirrors it with the todo tool when one exists. Update it after every agent report. If it exists with unfinished tasks and the user says "continue" or repeats the same request, resume from it instead of starting over.

```
# Job: <one line>   Requirement: <user's words>   Limits: attempts 3, rounds 6
Assumptions: <list>   Approvals needed: <none | list>
Round: <n of max>

| ID | Description | Agent | Status | Depends on | Files | Acceptance criteria | Tests | Retries | Blockers | Outcome |
```

Status: `todo`, `in-progress`, `needs-verify`, `done`, `failed`, `blocked`. A task is `done` only after its acceptance criteria were verified by an agent that actually ran the check.

## Task brief (orchestrator to agent)

Agents do not remember each other, so every brief contains:

1. Original user requirement, word for word.
2. Task ID and the assigned task.
3. Relevant project context: files to read, similar code, conventions that apply.
4. Expected output (the report below).
5. Acceptance criteria for this task.
6. Previous agents' findings (full text of the reports that matter, not a summary of a summary).
7. Constraints: files this agent may touch, approval rules, no new dependencies.
8. For a correction: the root cause, the exact log excerpt or finding, and which attempt this is.

## Agent report (agent to orchestrator)

Every agent ends with:

- **Task**: ID and status (`done`, `partial` or `blocked`).
- **Summary**: what was done, in plain language.
- **Files**: created or changed, as links.
- **Evidence**: the exact commands run and their real result. Never write "passes" for something not run.
- **Handoffs needed**: work for another agent, for example "new text keys for i18n-translator: ...". Write "None" if there is none.
- **Unresolved**: anything incomplete, assumed or not verified.

Agent files add role-specific sections (keys, spec, gates table, findings).

## Reading a report

Before accepting a report, the orchestrator checks it against the task's acceptance criteria and looks for:

- missing requirements or acceptance criteria not covered
- shopper-visible text not in `en.ts`, or new keys not yet translated
- a UI feature missing a state: loading, empty, error, disabled, mobile 375px, tablet 768px, desktop 1280px, dark mode
- tests added only for the happy path, or a test weakened or removed
- "partial" or "blocked" status, TODOs, stubs, or claims with no evidence

Anything found becomes a correction task in the ledger. Do not ask the user.

## Automatic triggers

| When | Do next, without asking |
| --- | --- |
| Engineer reports new or changed text keys | i18n-translator, before the tester |
| Translator changes dictionaries | `npx jest src/i18n`, then the full gates |
| Any application code changed | qa-tester runs all gates; UI changes also get the browser check |
| A gate or test fails | find root cause, assign owner, correct, re-run |
| Reviewer reports "Must fix" | correction round, then reviewer re-verifies |
| Spec or plan gap found | back to ui-designer or planner, then engineer |
| An agent returns nothing useful | re-send the brief once with a narrower task; then do that role yourself, keeping its restrictions |

## Correction loop

For every failure:

1. **Root cause.** Read the failing output and the code. State the cause in one sentence. A symptom is not a cause.
2. **Owner.** Use the table below.
3. **Delegate.** Brief the owner with the root cause, exact logs and attempt number. Update the ledger (`Retries` + 1).
4. **Re-run** the failed check first, then the full gates once it is green.
5. **Review.** The reviewer re-checks the corrected findings and anything the fix touched.
6. **Decide.** Acceptance criteria pass: next task. Otherwise repeat, within the limits.

If a test fails because of the implementation, fix the implementation. The test is only changed when it is proven wrong, by the qa-tester, with the reason in the report. Never delete or weaken a test to get green.

### Failure owner

| Symptom | Owner |
| --- | --- |
| Type error, lint error, build error in app code | frontend-engineer |
| Behavior wrong, app test fails | frontend-engineer |
| Layout, responsive or dark-mode problem | frontend-engineer, with a revised spec from ui-designer if the spec lacked it |
| Missing or ambiguous design decision | ui-designer |
| Missing key, placeholder, plural or untranslated text in a dictionary | i18n-translator |
| English wording unclear or wrong | frontend-engineer (the only agent allowed to edit `en.ts`), then i18n-translator |
| Wrong test, flaky test, server or port problem, test setup | qa-tester |
| Wrong plan or missed requirement | planner |
| Reviewer finding | the owner of the file or area it names |

## Parallel and sequential

- Parallel when independent and read-only: exploring different areas of the code, planner and ui-designer on separate questions.
- Sequential for anything that edits files: engineer, then translator, then tester. Never two editing agents at once.
- Order of gates: `npm run typecheck`, `npm run lint`, `npx jest`, `npm run build`, then the browser check.

## Approval gates

Stop and ask the user before: installing or removing dependencies, deleting files, overwriting important files, major architecture changes, changing env vars or secrets, changing auth or security configuration, backend changes, committing or pushing. Never bypass a permission or security restriction to keep going. While waiting, continue any task that does not depend on the answer.

Ask about a requirement only when it is genuinely ambiguous and no reasonable default follows from the existing app. Otherwise assume, record the assumption in the ledger, and list it in the final report.

## Final report

1. Original requirement.
2. Agents involved.
3. Tasks completed (ledger table).
4. Files created or modified (links).
5. Corrections and retries performed, with root causes.
6. Quality gates and browser checks with their actual results, and what was not run.
7. Remaining limitations, assumptions, and what is mock.
8. Whether all acceptance criteria passed. If not, the exact blocker.
