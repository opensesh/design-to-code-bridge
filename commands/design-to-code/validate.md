---
description: "Re-run Gate 5 (component mapping) standalone. Useful when the plan was hand-edited or source updated."
allowed-tools: Read, Write, Edit, Bash, Task
argument-hint: <feature>
---

# /design-to-code:validate — Re-run Gate 5

Re-runs the component-mapping step against a feature that already has a plan. Replaces `componentMap` in `status.json` with a fresh pass.

## When to use

- The design source got updated (new `review.html`, new screenshots).
- The plan was hand-edited and you want to confirm the mapper still agrees.
- A net-new component you flagged in the plan got built into `components/custom/shared/` since the last mapping run — the mapper should now mark it `reused`.
- Mid-slicing, you want a sanity check that the remaining slices still match.

## What it does

1. Reads `.design-to-code/state/<feature>/status.json` and `.claude-design/<feature>/review.html` + `screenshots/`.
2. Re-runs `@design-to-code-extractor.md` (if `review.html` mtime is newer than the last extraction).
3. Re-runs `@design-to-code-mapper.md` with the latest inputs.
4. **Diffs the new mapping against the prior one.** Surfaces additions, removals, tier changes, confidence shifts.
5. On user approval, replaces `componentMap` in `status.json` and appends a `gateLog` entry: `{gate: 5, result: "pass", note: "re-validated; <n> changes"}`.

## Arguments

- `<feature>` (required) — the slug.

## Failure modes

- No prior `componentMap` in `status.json` → command suggests `/design-to-code:plan <feature>` instead.
- Mapper produces wildly different output from the prior run (>30% of units changed) → PM surfaces an explicit warning and asks for confirmation before overwriting.

---

*Plugin: [design-to-code-bridge](https://github.com/opensesh/design-to-code-bridge)*
