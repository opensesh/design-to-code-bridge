---
description: "Cross-feature evaluation view — every bridged feature, with PR cross-refs and component +/- diff."
allowed-tools: Read, Bash
argument-hint: "[--feature <name>] [--write] [--json]"
---

# /design-to-code:dashboard — Cross-feature evaluation

Aggregates every feature ever driven through the bridge. The bookend to `/design-to-code:start` (initiation) — initiation and evaluation are the two cross-feature surfaces.

## What it shows

- **Cumulative block** — features bridged, total slices merged, total LOC, components introduced (new), components reused, reuse ratio, net-new count.
- **Per-feature table** — feature name, status, started/closed dates, slices, LOC, PRs, spike link, `+N / −M` reuse diff.
- **Per-feature expand** (with `--feature`) — full component +/− breakdown by tier with names.

## How it computes

Reads `.design-to-code/state/*/status.json` for every feature. Cross-references:

- `git log --oneline` for commit chain → LOC totals.
- `gh pr view <n>` for PR titles, dates, merge state.
- `componentMap.byTier.{*}.{reused,new}` for the +/− diff.

The `newOrReused` flag in `componentMap.units[]` is the **single source of truth** for the diff. Mapper agents verify reuse claims by `ls`-ing target paths — false positives misleading the dashboard are explicitly guarded against.

## Arguments

- `--feature <name>` — Drill into one feature; shows per-unit breakdown.
- `--write` — Persist output to the path in `config.yaml.dashboard_output_path` (default `docs/spikes/design-system/design-to-code-dashboard.md`).
- `--json` — Emit machine-readable JSON instead of markdown.

## Sample output (markdown, default)

```
Design-to-Code Bridge — cumulative
==================================
Features bridged:        3
Total slices merged:    17
Total LOC:           4,820
Components introduced:  38  (+)
Components reused:      51  (−)
Reuse ratio:            57%  (target: ↑ over time)
Net-new (no primitive):  4  (target: ↓ over time)

| Feature          | Status | Started    | Closed     | Slices | LOC   | PRs       | Spike            | New / Reused |
|------------------|--------|------------|------------|--------|-------|-----------|------------------|--------------|
| brand-hub-hifi   | done   | 2026-05-12 | 2026-05-12 | 6      | 1,800 | #314–#319 | 2026-05-12-…md   | +24 / −23    |
| spaces-redesign  | slice  | 2026-06-04 | —          | 3      | 980   | #341–#343 | 2026-06-04-…md   |  +9 / −18    |
| account-shell    | retro  | 2026-06-10 | —          | 4      | 920   | #355–#358 | 2026-06-10-…md   |  +5 / −10    |
```

## What it surfaces over time

- Rising reuse ratio → DS is maturing; bridge is paying off.
- Rising net-new count → missing primitives that should be promoted to `base/` or `custom/shared/`.
- Recurring icon gaps → batch-add candidates.
- Same guardrail violation across features → the guardrails skill prompt needs tightening, or a new lint rule is warranted.

## Failure modes

- No `.design-to-code/state/` directory → command prints setup instructions.
- A `status.json` is malformed → that feature row marked `ERROR`; render continues for the rest.

---

*Plugin: [design-to-code-bridge](https://github.com/opensesh/design-to-code-bridge)*
