# Changelog

All notable changes to the Design-to-Code Bridge plugin are documented here. Follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] — 2026-05-12

### Added

- Plugin scaffold: `.claude-plugin/plugin.json` manifest.
- `DESIGN_TO_CODE_RULES.md` — portable rules file for subagent behavior (lifts KARIMO_RULES.md shape).
- 10 commands under `commands/design-to-code/`: `start`, `prep`, `plan`, `validate`, `slice`, `swap`, `retro`, `dashboard`, `status`, `review`.
- 6 subagents: `design-to-code-pm` (Opus, orchestrator), `-extractor` (Opus), `-auditor` (Sonnet), `-mapper` (Opus, keystone), `-planner` (Opus), `-reviewer` (Sonnet).
- 2 skills: `design-to-code-guardrails` (editor-time lint reminders), `design-to-code-vocabulary` (base/ds/custom tier model).
- 2 opt-in hooks: `pre-commit-guardrails.sh`, `post-merge-cleanup.sh`.
- 7 templates + 10 per-gate failure messages.
- 2 consumer-config examples: `config.example.yaml`, `token-map.example.yaml`.
- 4 deterministic Node helper scripts: `discriminator.mjs`, `status-machine.mjs`, `render-dashboard.mjs`, `check-guardrails.mjs`.
- 10-test suite (`tests/*.test.mjs`) — manifest + frontmatter validation, discriminator unit tests, mapper schema check, status round-trip, dashboard render, gate ordering, PM no-code-writing audit, guardrail detection, source-meta defaults.
- CI workflow (`.github/workflows/test.yml`) — runs all 10 tests on every PR + push to main.
- Brand Hub reference fixture under `examples/brand-hub/` with hand-authored golden files.

### Notes

- Day-1 source decoders: Claude Design + screenshot-only. Figma, V0, Lovable, Webflow detection is wired; their decoders land when first encountered.
- First real-feature validation pending — synthetic-feature dogfood passed at scaffold time.
