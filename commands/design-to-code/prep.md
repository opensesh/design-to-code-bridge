---
description: "Power-user shortcut — scaffolds .claude-design/<feature>/ without the conversational interview."
allowed-tools: Read, Write, Bash
argument-hint: <feature>
---

# /design-to-code:prep — Scaffold without the intake conversation

For designers (or engineers) who already know the feature slug and have the materials ready and just want the folder structure created.

## What it does

Given a feature slug (e.g. `brand-hub-hifi`):

1. Creates `.claude-design/<feature>/` and `.claude-design/<feature>/screenshots/`.
2. Writes a `source-meta.yaml` stub (user fills in `source:`, `exportedAt`, `exportedBy`, `sourceProject`, `notes`).
3. Writes a `notes.md` stub.
4. Prints next steps:
   - Drop `review.html` into `.claude-design/<feature>/`.
   - Drop screenshots (numerically prefixed: `01-overview.png`, `02-detail.png`) into `screenshots/`.
   - Run `/design-to-code:start` when materials are ready (or `/design-to-code:plan <feature>` if intake is already done elsewhere).

## When to use

- You're a designer doing the export-and-handoff dance and you don't want a conversational interview.
- You're scripting batch setup for multiple features.

Most users should prefer `/design-to-code:start` — the conversational intake catches gotchas (wrong route, missing materials) early.

## Arguments

- `<feature>` (required) — URL-safe slug. Will be sanitized to lowercase + hyphens.

## Failure modes

- `.claude-design/<feature>/` already exists → command refuses; prints suggestion to `cd` in or pick a different slug.

---

*Plugin: [design-to-code-bridge](https://github.com/opensesh/design-to-code-bridge)*
