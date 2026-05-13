#!/usr/bin/env node
// discriminator.mjs — Detect the source type of a design export.
//
// Pure function. Reads the first 2 KB of `review.html` (or detects
// screenshot-only when there is no `review.html`) and returns one of:
//   claude-design | figma | v0 | lovable | webflow | screenshot-only | generic-html
//
// Usage:
//   node scripts/discriminator.mjs <feature-dir>            # CLI
//   import { detectSourceType } from './discriminator.mjs'  // ESM
//
// CLI exit codes: 0 always; output goes to stdout.

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';

const SAMPLE_BYTES = 2048;

const SIGNATURES = [
  {
    type: 'claude-design',
    match: (sample) => /<script\b[^>]*\btype=["']__bundler\/template["']/i.test(sample),
  },
  {
    type: 'figma',
    match: (sample) => /\bdata-figma-[a-z-]+/.test(sample) || /<meta[^>]+content=["'][^"']*figma\.com/i.test(sample),
  },
  {
    type: 'lovable',
    match: (sample) => /lovable\.dev/i.test(sample),
  },
  {
    type: 'webflow',
    match: (sample) => /<link\b[^>]+href=["'][^"']*\.webflow\.css/i.test(sample) || /\bdata-wf-[a-z-]+/.test(sample),
  },
];

/**
 * Detect source type from a feature directory.
 * @param {string} featureDir - absolute path to .claude-design/<feature>/
 * @returns {{ type: string, signal: string | null }}
 */
export function detectSourceType(featureDir) {
  if (!existsSync(featureDir)) {
    return { type: 'generic-html', signal: 'feature-dir-missing' };
  }

  const reviewPath = join(featureDir, 'review.html');
  const hasReview = existsSync(reviewPath) && statSync(reviewPath).size > 0;

  // screenshot-only: no review.html, ≥1 PNG in screenshots/
  if (!hasReview) {
    const screenshotsDir = join(featureDir, 'screenshots');
    if (existsSync(screenshotsDir)) {
      const pngs = readdirSync(screenshotsDir).filter((f) => f.toLowerCase().endsWith('.png'));
      if (pngs.length > 0) {
        return { type: 'screenshot-only', signal: `${pngs.length} png(s); no review.html` };
      }
    }
    return { type: 'generic-html', signal: 'no review.html; no screenshots' };
  }

  // Filename-based v0 detection (.tsx / .jsx are sometimes saved as review.html.tsx — uncommon, but handled)
  if (/\.(tsx|jsx)$/i.test(reviewPath)) {
    return { type: 'v0', signal: 'filename ends .tsx/.jsx' };
  }

  // Read the first 2 KB of review.html
  const fd = readFileSync(reviewPath);
  const sample = fd.slice(0, SAMPLE_BYTES).toString('utf8');

  // v0/Lovable also leave a comment in the first 2 KB
  if (/\/\/\s*v0(\.dev)?\b/i.test(sample) || /<!--\s*v0/i.test(sample)) {
    return { type: 'v0', signal: 'v0 marker in head' };
  }

  for (const sig of SIGNATURES) {
    if (sig.match(sample)) {
      return { type: sig.type, signal: `signature matched: ${sig.type}` };
    }
  }

  return { type: 'generic-html', signal: 'no signature matched' };
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const target = process.argv[2];
  if (!target) {
    console.error('usage: node discriminator.mjs <feature-dir>');
    process.exit(2);
  }
  const result = detectSourceType(target);
  console.log(JSON.stringify(result));
}
