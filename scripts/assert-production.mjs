import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const release = JSON.parse(readFileSync('dist/release.json', 'utf8'));
if (release.environment !== 'production')
  throw new Error('Build with DEPLOY_ENV=production before production deployment');
const key = process.env.PUBLIC_TURNSTILE_SITE_KEY ?? '';
if (!key || /^[123]x0+/.test(key))
  throw new Error('A real production Turnstile site key is required');
if (!process.env.PUBLIC_CF_WEB_ANALYTICS_TOKEN)
  throw new Error('Production Web Analytics configuration is required');
const keys = JSON.parse(
  execFileSync('pnpm', ['exec', 'wrangler', 'secret', 'list', '--env', 'production'], {
    encoding: 'utf8',
  }),
);
const names = new Set(keys.map((key) => key.name));
for (const name of [
  'CONTACT_TO_EMAIL',
  'CONTACT_FROM_EMAIL',
  'RESEND_API_KEY',
  'TURNSTILE_SECRET_KEY',
  'RATE_LIMIT_SALT',
]) {
  if (!names.has(name)) throw new Error(`Missing production Worker secret: ${name}`);
}
console.log('Production build and secret names verified. No secret values were read.');
