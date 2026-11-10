import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const release = JSON.parse(await readFile('dist/release.json', 'utf8'));
const origin = process.env.TEST_ORIGIN;
assert.ok(origin?.startsWith('https://'), 'An HTTPS deployment origin is required');
const headers = {};
if (release.environment === 'preview') {
  const anonymous = await fetch(new URL('/', origin), {
    redirect: 'manual',
    signal: AbortSignal.timeout(15000),
  });
  assert.equal(anonymous.status, 302, 'Preview must redirect anonymous visitors to Access');
  const destination = new URL(anonymous.headers.get('location') ?? '', origin);
  assert.ok(
    destination.hostname.endsWith('.cloudflareaccess.com'),
    'Preview must use Cloudflare Access',
  );
  assert.ok(
    process.env.CF_ACCESS_CLIENT_ID && process.env.CF_ACCESS_CLIENT_SECRET,
    'Preview smoke checks require an Access service token',
  );
}
if (process.env.CF_ACCESS_CLIENT_ID && process.env.CF_ACCESS_CLIENT_SECRET) {
  headers['CF-Access-Client-Id'] = process.env.CF_ACCESS_CLIENT_ID;
  headers['CF-Access-Client-Secret'] = process.env.CF_ACCESS_CLIENT_SECRET;
}
async function get(path) {
  const response = await fetch(new URL(path, origin), {
    headers,
    redirect: 'manual',
    signal: AbortSignal.timeout(15000),
  });
  assert.equal(response.status, 200, `Unexpected status for ${path}: ${response.status}`);
  return response;
}
const hostedRelease = await (await get('/release.json')).json();
assert.equal(hostedRelease.revision, release.revision, 'Deployment revision does not match');
assert.equal(hostedRelease.environment, release.environment);
for (const path of release.routes.filter((route) => route !== '/404')) {
  const response = await get(path);
  assert.ok(response.headers.get('content-security-policy'), `Missing CSP on ${path}`);
  if (release.environment === 'preview') {
    assert.match(response.headers.get('x-robots-tag') ?? '', /noindex/);
  }
  const html = await response.text();
  assert.match(html, /<html lang="en"/);
  assert.match(html, /rel="canonical" href="https:\/\/michaeldadi\.dev\//);
}
const health = await (await get('/api/health')).json();
assert.equal(health.status, 'ready', 'Contact configuration is not ready');
assert.equal(health.revision, release.revision);
const robots = await (await get('/robots.txt')).text();
assert.match(robots, release.environment === 'production' ? /Allow: \// : /Disallow: \//);
assert.match((await get('/resume.pdf')).headers.get('content-type') ?? '', /application\/pdf/);
await get('/rss.xml');
await get('/sitemap-index.xml');
const missing = await fetch(new URL('/smoke-route-that-does-not-exist/', origin), {
  headers,
  redirect: 'manual',
  signal: AbortSignal.timeout(15000),
});
assert.equal(missing.status, 404, 'Missing pages must return a real 404');
console.log(
  `Verified ${release.routes.length - 1} deployed pages, release revision, assets, crawler rules, and contact configuration. Inbox delivery still requires its separate controlled check.`,
);
