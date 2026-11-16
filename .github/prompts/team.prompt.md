---
description: Run the Frosty Delights development team (planner, designer, engineer, translator, tester, reviewer) on a request
argument-hint: Describe the feature, change or bug
agent: agent
---

Read `CLAUDE.md` and `MEMORY.md`, then follow `.claude/skills/team/SKILL.md` step by step as the orchestrator, using the agents in `.claude/agents/`.

Request:

${input:task:Describe the feature, change or bug}

Use `runSubagent` with the agent names from `.claude/agents/` when available; otherwise read each agent file and act in that role. Verify with the qa-tester gates and a browser check before reporting.
