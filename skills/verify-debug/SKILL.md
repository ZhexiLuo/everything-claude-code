---
name: verify-debug
description: Use when debugging complex bugs that resist quick fixes, when two consecutive fix attempts have failed, when confidence in the root cause is below 70%, or when user explicitly activates this skill. Symptoms include mysterious failures, inconsistent behavior, fixes that don't stick, and bugs where the root cause is unclear.
---

# Verify-Debug

## Overview

**The highest art of debugging is locating the problem, not blindly attempting fixes.**

This skill enforces a verification-first debugging workflow: understand the symptoms, hypothesize causes, **verify before fixing**, then plan the repair. Never jump to solutions — prove the root cause first.

## When to Use

- User asks for help with a complex or deep bug
- Two consecutive fix attempts have already failed (auto-activate)
- Your confidence in the root cause is below 70%
- User explicitly invokes `/verify-debug`
- Bug exhibits: mysterious failures, inconsistent behavior, fixes that don't stick

**When NOT to use:**
- Simple, obvious errors (typos, missing imports, clear stack traces)
- You have 80%+ confidence a specific fix will resolve it

## Core Workflow

```
Reproduce → Hypothesize → Verify → Plan → Fix
    ↑                        |
    └── hypothesis wrong ────┘
```

### Phase 1: Understand the Symptom

- Read the error message, stack trace, and user description carefully
- Dispatch subagents in parallel to gather code context around the bug site
- Reproduce the error — if you can't reproduce it, you don't understand it yet

### Phase 2: Hypothesize Causes

List possible root causes ranked by probability (high → low):

```markdown
| # | Hypothesis | Probability | How to Verify |
|---|-----------|-------------|---------------|
| 1 | ...       | High        | ...           |
| 2 | ...       | Medium      | ...           |
| 3 | ...       | Low         | ...           |
```

### Phase 3: Verify (THE KEY STEP)

**Write verification code to prove or disprove each hypothesis.** Do NOT skip to fixing.

Verification methods:
- **Reproduce the error** with a minimal test case
- **Print/log variable contents** at critical points
- **Write visualization code** for user to observe and confirm
- **Add assertions** to narrow down where behavior diverges from expectation

**Verification file rules:**
- Create verification scripts in `claude/test/` or `claude/scripts/`
- If verification code MUST go in the main codebase, mark every added line with `# debug` comment
- Clean up all `# debug` lines after the bug is fixed

### Phase 4: Plan the Fix

Once root cause is **verified** (not guessed), enter plan mode and write a fix plan to `claude/doc/bug-fix/`:

The plan document must include:
1. **Root cause** — what exactly is wrong and why
2. **How it was located** — which verification proved it
3. **Fix approach** — the minimal change to resolve it
4. **Verification after fix** — how to confirm the fix works

Wait for user review before proceeding.

### Phase 5: Execute and Verify

- Implement the fix per the approved plan
- Run the same reproduction/test from Phase 3 to confirm resolution
- Clean up all `# debug` markers and temporary verification files

## Red Flags — STOP and Re-verify

- You're about to change code without understanding WHY it's broken
- Your fix is "try this and see if it works"
- You've changed the same area twice with no improvement
- You're adding defensive code (try-catch, null checks) to mask a deeper issue
- The fix "works" but you can't explain why

**All of these mean: go back to Phase 3. Verify the root cause.**

## Common Mistakes

| Mistake | Better Approach |
|---------|----------------|
| ❌ Jump straight to fixing | ✅ Verify root cause first |
| ❌ "Try this and see" | ✅ Hypothesize, then write proof |
| ❌ Add defensive wrappers | ✅ Find and fix the actual cause |
| ❌ Fix in main code without marking | ✅ Use `# debug` comments for temp code |
| ❌ Leave verification artifacts | ✅ Clean up after fix is confirmed |
| ❌ Guess → fix → guess → fix loop | ✅ One hypothesis, one verification at a time |
