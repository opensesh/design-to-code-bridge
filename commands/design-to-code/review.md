---
description: "Reviewer: pull a slice PR diff and validate it against the plan's slice spec. Prints PASS/REVISE."
allowed-tools: Read, Bash, Task
argument-hint: <pr>
---

# /design-to-code:review — Validate a slice PR

Optional reviewer helper. Pulls a PR diff via `gh`, finds its slice spec in the plan, asks `design-to-code-reviewer` for a PASS/REVISE verdict with file:line citations.

## What it does

1. `gh pr view <pr> --json title,headRefName,baseRefName,additions,deletions`.
2. Parse `<feature>-pr-<n>-<slug>` from the head ref → find slice `<n>` in `status.json.slices[]`.
3. `gh pr diff <pr>` → pass the diff + the slice spec + the plan's component-mapping table to `@design-to-code-reviewer.md`.
4. Reviewer returns a structured block:

```
PASS — slice 3 (PillarCard + 8-card grid, mock data)

Files changed (matches plan):
  + components/custom/shared/branding/PillarCard.tsx
  + components/custom/shared/branding/pillar-previews/PillarPreview.tsx
  + lib/brand-hub/pillar-mock.ts

Guardrails: 0 violations
LOC: 437 (budget: 450, under)
Component map: all units present

Verify steps remaining:
  - Side-by-side visual diff against 01-brand-hub-overview.png (designer)
  - Playwright 03-grid-mock.png baseline (engineer)
```

Or:

```
REVISE — slice 3

Issues:
  ⚠ components/custom/shared/branding/PillarCard.tsx:42 — border-2 detected (use `border`)
  ⚠ components/custom/shared/branding/pillar-previews/PreviewLogo.tsx:18 — raw hex #FFFAEE (use bg-color-vanilla)
  ⚠ components/custom/shared/branding/pillar-previews/PreviewLogo.tsx:36 — array-index-key
  ✗ Missing file: components/custom/shared/branding/pillar-previews/PreviewTypography.tsx (declared in slice 3 mapping)

Action: address above, push, request re-review.
```

## Arguments

- `<pr>` (required) — GitHub PR number.

## Failure modes

- PR's head branch doesn't match `<feature>-pr-<n>-<slug>` → reviewer warns "branch name doesn't match bridge convention; running guardrails-only review" and continues.
- `gh` not authenticated → command prints `gh auth status` and exits.

---

*Plugin: [design-to-code-bridge](https://github.com/opensesh/design-to-code-bridge)*
