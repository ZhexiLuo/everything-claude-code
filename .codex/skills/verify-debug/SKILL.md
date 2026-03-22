---
name: verify-debug
description: Use when debugging complex bugs that resist quick fixes, when two consecutive fix attempts have failed, when confidence in the root cause is below 70%, or when user explicitly activates this skill. MANDATORY when ralph-loop is active and task is debugging. Symptoms include mysterious failures, inconsistent behavior, fixes that don't stick, and bugs where the root cause is unclear.
---

# Verify-Debug

## Overview

**The highest art of debugging is locating the problem, not blindly attempting fixes.**

This skill enforces a verification-first debugging workflow: reproduce, research, hypothesize, **verify before fixing**, then deliver a minimal clean fix. Never jump to solutions — prove the root cause first.

## When to Use

- User asks for help with a complex or deep bug
- Two consecutive fix attempts have already failed (auto-activate)
- Your confidence in the root cause is below 70%
- User explicitly invokes `/verify-debug`
- Bug exhibits: mysterious failures, inconsistent behavior, fixes that don't stick
- **MANDATORY: when ralph-loop is active and the task involves debugging**

**When NOT to use:**
- Simple, obvious errors (typos, missing imports, clear stack traces)
- You have 80%+ confidence a specific fix will resolve it

## Core Workflow

```
Reproduce → Research (agents) → Hypothesize → Verify hypothesis
    ↑                                              |
    |            hypothesis wrong ─────────────────┘
    |            hypothesis confirmed ─────────────┐
    |                                              ↓
    |         Fix → Verify fix → Clean commit → Final test → Commit
    |                   |
    └── fix failed ─────┘
```

### Phase 1: Reproduce the Problem

- Read the error message, stack trace, and user description carefully
- **Reproduce the exact error the user reported** — if you can't reproduce it, you don't understand it yet
- Record the reproduction command/steps for later verification

### Phase 2: Research — Gather Solutions with Agents

Dispatch **parallel subagents** to collect information. The more times you've failed, the deeper you search.

| Agent | Task | Source |
|-------|------|--------|
| Agent 1 | Search official documentation for the relevant API/library | context7, official docs |
| Agent 2 | Find similar issues and solutions | GitHub Issues, web search |
| Agent 3 | Find official examples with similar functionality/requirements | Official repos, examples |
| Agent 4 | Read related code in the current codebase | Grep, Read |
| Agent 5 | Check past debugging experience | claude-mem |

**Escalation rule:** Each consecutive failure MUST increase search depth:
- **1st attempt failed →** search docs + codebase
- **2nd attempt failed →** add GitHub Issues + web search
- **3rd+ attempt failed →** add official examples, similar projects, Stack Overflow, and broaden search terms

### Phase 3: Hypothesize Causes

List possible root causes ranked by probability (high → low):

```markdown
| # | Hypothesis | Probability | Evidence From | How to Verify |
|---|-----------|-------------|---------------|---------------|
| 1 | ...       | High        | Agent X found | ...           |
| 2 | ...       | Medium      | Code reading  | ...           |
| 3 | ...       | Low         | Speculation   | ...           |
```

### Phase 4: Verify Hypothesis (THE KEY STEP)

**Write verification code to prove or disprove each hypothesis.** Do NOT skip to fixing.

Verification methods:
- **Reproduce the error** with a minimal test case
- **Print/log variable contents** at critical points
- **Write visualization code** for user to observe and confirm
- **Add assertions** to narrow down where behavior diverges from expectation

**Verification file rules:**
- Create verification scripts in `claude/test/`
- If verification code MUST go in the main codebase, mark every added line with `# debug` comment
- Clean up all `# debug` lines after the bug is fixed

**LOOP POINT:** If the hypothesis is **confirmed** as root cause → proceed to Phase 5. If **disproven** → return to Phase 2 (Research) with increased search depth.

### Phase 5: Fix and Verify

1. **Implement the minimal fix** — only the code necessary to resolve the root cause
2. **Run the reproduction command** from Phase 1 to confirm the fix works
3. **If fix fails** → return to Phase 2, increase search depth

### Phase 6: Clean Commit

**The commit MUST contain only the minimal code to fix the bug. Zero tolerance for:**
- Intermediate debugging code
- Redundant comments
- Extra logic "just in case"
- Code the user didn't ask for
- `# debug` markers
- Temporary verification files

**Commit preparation:**
1. Remove ALL temporary code, `# debug` markers, and verification artifacts
2. `git diff` — review every changed line, ask yourself: "Is this line necessary to fix the bug?"
3. If any line is not strictly required, remove it

### Phase 7: Final Test and Commit

1. Run the reproduction command one last time — confirm the bug is resolved
2. Run existing tests — confirm nothing is broken
3. Commit with a message that clearly states: **what was wrong** and **how the fix resolves it**

```
🚀 fix: [what was fixed]

Root cause: [what exactly was wrong]
Fix: [how the change resolves it]
```

## Red Flags — STOP and Re-verify

- You're about to change code without understanding WHY it's broken
- Your fix is "try this and see if it works"
- You've changed the same area twice with no improvement
- You're adding defensive code (try-catch, null checks) to mask a deeper issue
- The fix "works" but you can't explain why
- Your commit contains more than the minimum necessary changes

**All of these mean: go back to Phase 2. Research deeper, verify the root cause.**

## Common Mistakes

| Mistake | Better Approach |
|---------|----------------|
| ❌ Jump straight to fixing | ✅ Reproduce → Research → Verify first |
| ❌ "Try this and see" | ✅ Hypothesize, then write proof |
| ❌ Add defensive wrappers | ✅ Find and fix the actual cause |
| ❌ Search only once when stuck | ✅ Each failure → deeper and broader search |
| ❌ Fix in main code without marking | ✅ Use `# debug` comments for temp code |
| ❌ Commit with debugging artifacts | ✅ Clean commit: only fix code, nothing else |
| ❌ Commit without final test | ✅ Always run reproduction + tests before commit |
| ❌ Vague commit message | ✅ State root cause and how fix resolves it |
| ❌ Guess → fix → guess → fix loop | ✅ One hypothesis, one verification at a time |
