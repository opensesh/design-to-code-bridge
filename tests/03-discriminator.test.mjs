// T3 — Discriminator unit tests
// For each fixture under tests/fixtures/<source>/, detectSourceType returns the expected type.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { detectSourceType } from '../scripts/discriminator.mjs';

const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), 'fixtures');

const cases = [
  { dir: 'claude-design',   expected: 'claude-design' },
  { dir: 'figma',           expected: 'figma' },
  { dir: 'v0',              expected: 'v0' },
  { dir: 'lovable',         expected: 'lovable' },
  { dir: 'webflow',         expected: 'webflow' },
  { dir: 'screenshot-only', expected: 'screenshot-only' },
  { dir: 'generic',         expected: 'generic-html' },
];

for (const c of cases) {
  test(`discriminator: ${c.dir} → ${c.expected}`, () => {
    const result = detectSourceType(join(FIXTURES, c.dir));
    assert.equal(result.type, c.expected, `expected ${c.expected}, got ${result.type} (signal: ${result.signal})`);
  });
}
