import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const target = process.argv[2];
assert.ok(['preview', 'production'].includes(target), 'Choose preview or production');
const release = JSON.parse(readFileSync('dist/release.json', 'utf8'));
assert.equal(release.environment, target, 'Build the requested environment before deploying');
const args = [
  'exec',
  'wrangler',
  'deploy',
  '--env',
  target,
  '--var',
  `REVISION:${release.revision}`,
];
if (target === 'production') {
  execFileSync(process.execPath, ['scripts/assert-production.mjs'], { stdio: 'inherit' });
} else {
  const origin = process.env.PREVIEW_ORIGIN;
  assert.ok(origin?.startsWith('https://'), 'Set PREVIEW_ORIGIN to the protected preview origin');
  assert.equal(new URL(origin).origin, origin, 'PREVIEW_ORIGIN must be an exact origin');
  assert.ok(
    release.publicConfiguration?.turnstileSiteKey,
    'Build with the preview Turnstile site key',
  );
  args.push('--var', `ALLOWED_ORIGIN:${origin}`);
}
execFileSync('pnpm', args, { stdio: 'inherit' });
