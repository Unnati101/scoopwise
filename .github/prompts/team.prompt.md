---
description: Run the Frosty Delights development team (planner, designer, engineer, translator, tester, reviewer) on a request
argument-hint: Describe the feature, change or bug
agent: agent
---

Read `CLAUDE.md` and `MEMORY.md`, then follow `.claude/skills/team/SKILL.md` and `.claude/skills/team/protocol.md` step by step as the team-lead (`.claude/agents/team-lead.md`), using the agents in `.claude/agents/`. Run the whole job autonomously: plan, delegate, correct failures within the limits, and report. Ask only at an approval gate or for a genuinely ambiguous requirement.

Request:

${input:task:Describe the feature, change or bug}

Use `runSubagent` with the agent names from `.claude/agents/` when available; otherwise read each agent file and act in that role. Verify with the qa-tester gates and a browser check before reporting.
