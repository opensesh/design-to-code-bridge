---
description: "Print status.json summary for one feature, or all if no arg."
allowed-tools: Read
argument-hint: "[<feature>]"
---

# /design-to-code:status — Per-feature state

Quick read on where a feature is in the ten-gate flow. No agents, no GitHub calls — just a pretty-print of `status.json`.

## What it does

- **No args** — lists every feature in `.design-to-code/state/`, one line each: slug · phase · gates passed · slice progress.
- **`<feature>` arg** — full summary for one feature: phase, branch, target route, gateLog, slices, componentMap aggregate, guardrail violations.

## Sample output (single feature)

```
brand-hub-hifi
==============
Phase: slice (3 / 6)
Branch: brand-hub-hifi
Target: /brand-hub (existing)
Source: claude-design

Gates:
  ✓ 0 — intake
  ✓ 1 — materials present
  ⚠ 2 — DS alignment (warn: synthetic source)
  ✓ 3 — target surface audit
  ✓ 4 — scope confirmation
  ✓ 5 — component mapping (47 units; 0 low-conf remaining)
  ✓ 6 — slice plan
  ⏳ 7 — pre-slice (running on slice 3)

Slices:
  1 ✓ scaffold + .claude-design convention (#314, 150 LOC)
  2 ✓ 3-tab nav + collapsible overview block (#315, 250 LOC)
  3 ⏳ PillarCard + 8-card grid (mock data) — in flight
  4 ◌ wire Logo / Colors / Typography / Guidelines real data
  5 ◌ visual Version History page (mocked seed)
  6 ◌ swap to /brand-hub, delete dropped routes, retro

Component map: 47 units
  base:          19 reused /  0 new
  ds:             4 reused /  1 new
  custom-shared:  0 reused /  8 new
  custom-page:                12 new
  net-new:                     3 new
Icon gaps: slack, asterisk-4-point

Guardrail violations (running totals):
  devProps:           4
  border-2:           1
  ring-2:             2
  raw-hex:            0
  array-index-keys:   8
```

## Arguments

- `<feature>` (optional) — feature slug. Omit to see every feature.

## Failure modes

- No `.design-to-code/state/` directory → command prints the empty-state hint pointing at `/design-to-code:start`.
- `<feature>` not found → command lists features that do exist.

---

*Plugin: [design-to-code-bridge](https://github.com/opensesh/design-to-code-bridge)*
