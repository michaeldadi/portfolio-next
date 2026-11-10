import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { brotliCompressSync } from 'node:zlib';
import { join } from 'node:path';

async function files(path: string): Promise<string[]> {
  const entries = await readdir(path, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) =>
      entry.isDirectory() ? files(join(path, entry.name)) : [join(path, entry.name)],
    ),
  );
  return nested.flat();
}
const production = process.env.DEPLOY_ENV === 'production';
const htmlFiles = (await files('dist')).filter((path) => path.endsWith('.html'));
const scripts = new Set<string>();
const routes = new Set<string>();
const required = [
  'work/foresight-rcm',
  'work/zealthy-mobile',
  'work/workonomics',
  'work/rcm-copilot',
  'writing/logging-sensitive-data',
  'writing/mobile-release-pipeline',
  'writing/postgres-indexing',
];
for (const route of required) await readFile(`dist/${route}/index.html`);
for (const path of htmlFiles) {
  routes.add(
    path === 'dist/index.html'
      ? '/'
      : `/${path
          .slice(5)
          .replace(/index\.html$/, '')
          .replace(/\.html$/, '')}`,
  );
  const html = await readFile(path, 'utf8');
  if (/href=["']#["']/.test(html)) throw new Error(`Placeholder link in ${path}`);
  if (/mailto:|tel:/i.test(html)) throw new Error(`Public direct-contact link in ${path}`);
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (!/\bsrc=/.test(match[1] ?? '') && match[2])
      scripts.add(`'sha256-${createHash('sha256').update(match[2]).digest('base64')}'`);
  }
  for (const match of html.matchAll(/href=["'](\/[^"'#?]*)/g)) {
    const href = match[1];
    if (!href || href === '/') continue;
    const target = href.endsWith('/') ? `dist${href}index.html` : `dist${href}`;
    await readFile(target).catch(() => {
      throw new Error(`Broken internal link ${href} in ${path}`);
    });
  }
  if (process.env.PRIVATE_CONTACT_ADDRESS && html.includes(process.env.PRIVATE_CONTACT_ADDRESS))
    throw new Error(`Private contact value in ${path}`);
}
const text = execFileSync('pdftotext', ['dist/resume.pdf', '-'], { encoding: 'utf8' });
const annotations = execFileSync('pdfinfo', ['-url', 'dist/resume.pdf'], { encoding: 'utf8' });
if (text.includes('@') || /mailto:|tel:/i.test(annotations) || /903-5565/.test(text))
  throw new Error('Public résumé contains private contact information');

const csp = [
  "default-src 'self'",
  `script-src 'self' ${[...scripts].join(' ')} https://challenges.cloudflare.com https://static.cloudflareinsights.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://challenges.cloudflare.com https://cloudflareinsights.com",
  'frame-src https://challenges.cloudflare.com',
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
].join('; ');
if (csp.length > 1900) throw new Error('CSP exceeds the static header line budget');
await writeFile(
  'dist/_headers',
  `/*\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Content-Security-Policy: ${csp}\n${production ? '' : '  X-Robots-Tag: noindex, nofollow, noarchive\n'}\n/_astro/*\n  Cache-Control: public, max-age=31536000, immutable\n\n/resume.pdf\n  Cache-Control: public, max-age=0, must-revalidate\n\n/404.html\n  X-Robots-Tag: noindex\n`,
);
await writeFile(
  'dist/robots.txt',
  production
    ? 'User-agent: *\nAllow: /\nSitemap: https://michaeldadi.com/sitemap-index.xml\n'
    : 'User-agent: *\nDisallow: /\n',
);

const assets = await files('dist/_astro');
let js = 0;
let css = 0;
for (const path of assets) {
  const bytes = await readFile(path);
  if (path.endsWith('.js')) js += brotliCompressSync(bytes).byteLength;
  if (path.endsWith('.css')) css += brotliCompressSync(bytes).byteLength;
  if (
    process.env.PRIVATE_CONTACT_ADDRESS &&
    bytes.includes(Buffer.from(process.env.PRIVATE_CONTACT_ADDRESS))
  )
    throw new Error(`Private contact value in ${path}`);
}
if (js > 45 * 1024) throw new Error(`First-party JavaScript budget exceeded: ${js} bytes`);
await writeFile(
  'dist/release.json',
  JSON.stringify(
    {
      environment: production ? 'production' : 'preview',
      revision:
        process.env.SOURCE_REVISION ??
        process.env.GITHUB_SHA ??
        execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
      builtAt: new Date().toISOString(),
      publicConfiguration: {
        turnstileSiteKey: process.env.PUBLIC_TURNSTILE_SITE_KEY ?? null,
        analyticsEnabled: Boolean(process.env.PUBLIC_CF_WEB_ANALYTICS_TOKEN),
      },
      routes: [...routes].sort(),
      compressedBytes: { javascript: js, css },
    },
    null,
    2,
  ),
);
console.log(
  `Release verified: ${htmlFiles.length} HTML pages, JavaScript ${js} B, CSS ${css} B (Brotli).`,
);
