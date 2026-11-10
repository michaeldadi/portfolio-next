import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const execute = promisify(execFile);
const origin = process.env.TEST_ORIGIN ?? 'http://127.0.0.1:4321';
const release = JSON.parse(await readFile('dist/release.json', 'utf8'));
const pages = [
  ['home', '/'],
  ['case-study', '/work/zealthy-mobile/'],
  ['article', '/writing/postgres-indexing/'],
];
const runs = Number(process.env.PERFORMANCE_RUNS ?? 3);
await mkdir('artifacts', { recursive: true });
const summary = [];
for (const [name, path] of pages) {
  const reports = [];
  for (let index = 0; index < runs; index++) {
    const output = `artifacts/lighthouse-${name}-${index + 1}.json`;
    await execute(
      process.execPath,
      [
        'node_modules/lighthouse/cli/index.js',
        `${origin}${path}`,
        '--quiet',
        '--output=json',
        `--output-path=${output}`,
        '--only-categories=performance,accessibility,best-practices,seo',
        '--chrome-flags=--headless --no-sandbox --disable-gpu',
      ],
      { env: { ...process.env, CHROME_PATH: chromium.executablePath() }, maxBuffer: 1024 * 1024 },
    );
    const report = JSON.parse(await readFile(output, 'utf8'));
    if (report.runtimeError) throw new Error(`${name}: ${report.runtimeError.message}`);
    reports.push(report);
  }
  const median = (key) =>
    reports.map((report) => Math.round(report.categories[key].score * 100)).sort((a, b) => a - b)[
      Math.floor(reports.length / 2)
    ];
  const scores = {
    performance: median('performance'),
    accessibility: median('accessibility'),
    bestPractices: median('best-practices'),
    seo: median('seo'),
  };
  const seoFailures = reports.flatMap((report) =>
    report.categories.seo.auditRefs
      .filter(
        (ref) =>
          ref.weight > 0 &&
          report.audits[ref.id]?.score !== null &&
          report.audits[ref.id]?.score < 1,
      )
      .map((ref) => ref.id),
  );
  const unexpectedSeo = seoFailures.filter(
    (id) => release.environment === 'production' || id !== 'is-crawlable',
  );
  summary.push({
    page: path,
    environment: release.environment,
    runs,
    scores,
    expectedPreviewExclusion: release.environment !== 'production' ? 'is-crawlable' : null,
  });
  console.log(JSON.stringify(summary.at(-1)));
  if (
    scores.performance < 95 ||
    scores.accessibility < 100 ||
    scores.bestPractices < 95 ||
    unexpectedSeo.length
  )
    throw new Error(`${name} failed performance or accessibility budgets`);
}
await writeFile('artifacts/performance-summary.json', JSON.stringify(summary, null, 2));
