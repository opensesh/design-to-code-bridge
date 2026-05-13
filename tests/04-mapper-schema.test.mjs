// T4 — Mapper output schema test
// The golden examples/brand-hub/expected-mapper-output.json parses, matches the
// componentMap schema, and the byTier rollup matches the units[] tier counts.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const GOLDEN = join(ROOT, 'examples/brand-hub/expected-mapper-output.json');

const VALID_TIERS = ['base', 'ds', 'custom-shared', 'custom-page', 'net-new'];
const VALID_CONFIDENCE = ['high', 'medium', 'low'];
const VALID_NEW_OR_REUSED = ['new', 'reused'];

test('golden file parses', () => {
  const data = JSON.parse(readFileSync(GOLDEN, 'utf8'));
  assert.ok(data);
});

test('golden has required top-level fields', () => {
  const data = JSON.parse(readFileSync(GOLDEN, 'utf8'));
  assert.equal(typeof data.totalUnits, 'number');
  assert.ok(data.byTier);
  assert.equal(typeof data.lowConfidenceCount, 'number');
  assert.ok(Array.isArray(data.iconGaps));
  assert.ok(Array.isArray(data.units));
});

test('byTier has all five tiers', () => {
  const data = JSON.parse(readFileSync(GOLDEN, 'utf8'));
  for (const tier of VALID_TIERS) {
    assert.ok(data.byTier[tier], `byTier missing tier: ${tier}`);
    if (data.byTier[tier].reused !== undefined) {
      assert.equal(typeof data.byTier[tier].reused, 'number');
    }
    assert.equal(typeof data.byTier[tier].new, 'number');
  }
});

test('every unit has valid tier / confidence / newOrReused', () => {
  const data = JSON.parse(readFileSync(GOLDEN, 'utf8'));
  for (const unit of data.units) {
    assert.ok(unit.label?.length > 0, `unit missing label: ${JSON.stringify(unit)}`);
    assert.ok(VALID_TIERS.includes(unit.tier), `unit ${unit.label}: invalid tier ${unit.tier}`);
    assert.ok(VALID_CONFIDENCE.includes(unit.confidence), `unit ${unit.label}: invalid confidence ${unit.confidence}`);
    assert.ok(VALID_NEW_OR_REUSED.includes(unit.newOrReused), `unit ${unit.label}: invalid newOrReused ${unit.newOrReused}`);
  }
});

test('byTier rollup matches units[] counts', () => {
  const data = JSON.parse(readFileSync(GOLDEN, 'utf8'));
  for (const tier of VALID_TIERS) {
    const reusedCount = data.units.filter((u) => u.tier === tier && u.newOrReused === 'reused').length;
    const newCount = data.units.filter((u) => u.tier === tier && u.newOrReused === 'new').length;
    if (data.byTier[tier].reused !== undefined) {
      assert.equal(data.byTier[tier].reused, reusedCount, `byTier.${tier}.reused mismatch: aggregate=${data.byTier[tier].reused}, units=${reusedCount}`);
    }
    assert.equal(data.byTier[tier].new, newCount, `byTier.${tier}.new mismatch: aggregate=${data.byTier[tier].new}, units=${newCount}`);
  }
});

test('totalUnits matches units.length', () => {
  const data = JSON.parse(readFileSync(GOLDEN, 'utf8'));
  assert.equal(data.totalUnits, data.units.length);
});

test('lowConfidenceCount matches units with confidence=low', () => {
  const data = JSON.parse(readFileSync(GOLDEN, 'utf8'));
  const actualLow = data.units.filter((u) => u.confidence === 'low').length;
  assert.equal(data.lowConfidenceCount, actualLow);
});
