import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = [
  '/',
  '/work/',
  '/work/foresight-rcm/',
  '/work/zealthy-mobile/',
  '/work/workonomics/',
  '/work/rcm-copilot/',
  '/writing/',
  '/writing/logging-sensitive-data/',
  '/writing/mobile-release-pipeline/',
  '/writing/postgres-indexing/',
  '/privacy/',
];

async function contactFixture(page: Page, statuses = [202]) {
  const submissions: Record<string, unknown>[] = [];
  await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js*', (route) =>
    route.fulfill({
      contentType: 'application/javascript',
      body: "window.turnstile={render:(_el,options)=>{window.__testVerification=options;options.callback('browser-test-token');return 'fixture-widget';},reset:()=>window.__testVerification.callback('browser-test-token')};",
    }),
  );
  await page.route('**/api/contact', async (route) => {
    submissions.push(route.request().postDataJSON());
    const status = statuses[Math.min(submissions.length - 1, statuses.length - 1)] ?? 202;
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(status === 202 ? { ok: true } : { error: 'send_unavailable' }),
    });
  });
  await page.goto('/');
  await page
    .locator('#contact-form')
    .evaluate((form) => form.setAttribute('data-sitekey', 'browser-fixture'));
  await page.getByLabel('Name', { exact: true }).fill('Jordan Lee');
  await page.getByLabel('Work email').fill('jordan@example.test');
  await page
    .getByLabel('What are you building?')
    .fill('A product team with a full-stack engineering opportunity.');
  await page.waitForFunction(() =>
    Boolean((window as Window & { __testVerification?: unknown }).__testVerification),
  );
  return submissions;
}

test('complete homepage and working selectors', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Founding engineer.Ships the whole stack.',
  );
  await expect(page.locator('#work article')).toHaveCount(4);
  await expect(page.locator('#writing .post')).toHaveCount(3);
  await page.evaluate(() => document.fonts.ready);
  const heroHeight = (await page.locator('#hero-copy').boundingBox())!.height;
  await page.getByRole('tab', { name: 'Mobile', exact: true }).click();
  expect(
    Math.abs((await page.locator('#hero-copy').boundingBox())!.height - heroHeight),
  ).toBeLessThan(1);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Mobile products.');
  await expect(page.locator('[data-hero-cta]')).toHaveAttribute('href', '#work-zealthy-mobile');
  await page.getByRole('tab', { name: 'Mobile', exact: true }).press('ArrowLeft');
  await expect(page.getByRole('tab', { name: 'Full-stack' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await page.getByRole('tab', { name: 'AWS', exact: true }).click();
  await expect(page.locator('#tooling-aws')).toBeVisible();
  await expect(page.locator('#tooling-product')).toBeHidden();
  await page.getByRole('tab', { name: 'AWS', exact: true }).press('End');
  await expect(page.locator('#tooling-ai')).toBeVisible();
});

test('every published route loads directly', async ({ page }) => {
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://michaeldadi.dev${route}`,
    );
  }
});

test('mobile menu supports selection and Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.locator('.mobile-menu');
  const toggle = menu.locator('summary');
  await toggle.click();
  await expect(menu).toHaveAttribute('open', '');
  await menu.getByRole('link', { name: 'Work', exact: true }).click();
  await expect(menu).not.toHaveAttribute('open', '');
  await toggle.click();
  await toggle.press('Escape');
  await expect(menu).not.toHaveAttribute('open', '');
  await expect(toggle).toBeFocused();
});

test('form validates and explains missing configuration without fake success', async ({ page }) => {
  await page.goto('/');
  await page.locator('#contact-form').evaluate((form) => form.setAttribute('data-sitekey', ''));
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.locator('#name-error')).toContainText('Enter a name');
  await expect(page.getByLabel('Name', { exact: true })).toBeFocused();
  await page.getByLabel('Name', { exact: true }).fill('Jordan');
  await page.getByLabel('Work email').fill('jordan@example.test');
  await page
    .getByLabel('What are you building?')
    .fill('A full-stack product engineering opportunity.');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.locator('#contact-status')).toContainText('not connected yet');
});

test('form submits successfully through a browser-only provider fixture', async ({ page }) => {
  const submissions = await contactFixture(page);
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.locator('#contact-status')).toContainText('has been submitted');
  expect(submissions).toHaveLength(1);
  expect(submissions[0]?.submissionId).toMatch(/^[0-9a-f-]{36}$/);
  await expect(page.getByLabel('Name', { exact: true })).toHaveValue('');
});

test('failed delivery preserves input and retries with the same submission identifier', async ({
  page,
}) => {
  const submissions = await contactFixture(page, [503, 202]);
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.locator('#contact-status')).toContainText('could not be confirmed');
  await expect(page.getByLabel('Name', { exact: true })).toHaveValue('Jordan Lee');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.locator('#contact-status')).toContainText('has been submitted');
  expect(submissions[0]?.submissionId).toBe(submissions[1]?.submissionId);
});

test('static delivery uses real 404s, restrictive preview headers, and API readiness', async ({
  page,
  request,
}) => {
  expect((await page.goto('/does-not-exist/'))?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('dead end');
  const home = await request.get('/');
  if (process.env.DEPLOY_ENV !== 'production')
    expect(home.headers()['x-robots-tag']).toContain('noindex');
  else expect(home.headers()['x-robots-tag']).toBeUndefined();
  expect(home.headers()['content-security-policy']).toContain("frame-ancestors 'none'");
  expect(await (await request.get('/robots.txt')).text()).toContain(
    process.env.DEPLOY_ENV === 'production' ? 'Allow: /' : 'Disallow: /',
  );
  expect((await request.get('/api/contact')).status()).toBe(405);
  const health = await request.get('/api/health');
  expect(health.status()).toBe(503);
  expect(await health.text()).not.toContain('@');
  expect((await request.get('/resume.pdf')).headers()['content-type']).toContain('application/pdf');
  expect((await request.get('/rss.xml')).status()).toBe(200);
});

test('core content works with JavaScript disabled and no direct email links', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('#work h2')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Send message' })).toBeDisabled();
  await expect(page.locator('[data-contact-fallback]')).toContainText('JavaScript is needed');
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
  await context.close();
});

test('representative pages have no automated accessibility violations', async ({ page }) => {
  for (const route of ['/', '/work/foresight-rcm/', '/writing/postgres-indexing/']) {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(
      results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
      route,
    ).toEqual([]);
  }
});

test('responsive layout has no page overflow and records review screenshots', async ({
  page,
  browserName,
}, testInfo) => {
  test.skip(browserName !== 'chromium');
  for (const width of [360, 390, 768, 834, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      `${width}px`,
    ).toBe(true);
    const github = await page.locator('[data-aid="hero-github"]').boundingBox();
    const caption = await page.locator('[data-aid="hero-caption"]').boundingBox();
    expect(github).not.toBeNull();
    expect(caption).not.toBeNull();
    if (github && caption) {
      const separated =
        caption.y >= github.y + github.height ||
        github.y >= caption.y + caption.height ||
        caption.x >= github.x + github.width ||
        github.x >= caption.x + caption.width;
      expect(separated, `Hero caption and GitHub badge must not overlap at ${width}px`).toBe(true);
    }
    if ([390, 834, 1440].includes(width))
      await page.screenshot({ path: testInfo.outputPath(`home-${width}.png`), fullPage: true });
  }
});
