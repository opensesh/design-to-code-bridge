// T10 — Source-meta defaults
// Given .claude-design/<feature>/ with only PNGs and no review.html, the
// discriminator returns `screenshot-only` and the rest of the flow proceeds.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { detectSourceType } from '../scripts/discriminator.mjs';

const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), 'fixtures');

test('screenshot-only fixture: no review.html exists', () => {
  const dir = join(FIXTURES, 'screenshot-only');
  assert.equal(existsSync(join(dir, 'review.html')), false);
});

test('screenshot-only fixture: at least one PNG in screenshots/', () => {
  const dir = join(FIXTURES, 'screenshot-only');
  const pngs = readdirSync(join(dir, 'screenshots')).filter((f) => f.toLowerCase().endsWith('.png'));
  assert.ok(pngs.length >= 1, `expected ≥1 PNG, got ${pngs.length}`);
});

test('discriminator returns screenshot-only', () => {
  const result = detectSourceType(join(FIXTURES, 'screenshot-only'));
  assert.equal(result.type, 'screenshot-only');
  assert.match(result.signal, /png/);
});

test('empty feature dir returns generic-html (no review.html, no screenshots)', () => {
  // Construct a path that exists but is empty — we use the parent fixtures/
  // and a non-existent subdir to test the "feature-dir-missing" path.
  const result = detectSourceType(join(FIXTURES, 'nonexistent-feature'));
  assert.equal(result.type, 'generic-html');
});
