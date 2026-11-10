# Michael Dadi — portfolio

A fresh Astro implementation of the approved **Bold Geometric** AIDesigner variant. The repository contains the full homepage, four project case studies, three engineering articles, a public résumé, and a small Cloudflare contact service.

## Development

Use the Node version in `.nvmrc` and the pnpm version in `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

`pnpm dev` serves the UI. To exercise Cloudflare routing and headers locally:

```sh
pnpm build
pnpm preview
```

The contact endpoint intentionally returns an unavailable response until its server-side configuration is present. Browser tests simulate providers explicitly; they never send email.

## Verification

Install Poppler (`pdftotext`, `pdfinfo`) for public résumé checks and the Playwright browsers for browser tests.

```sh
pnpm exec playwright install chromium firefox webkit
pnpm format:check
pnpm lint
pnpm check
pnpm test
pnpm build
pnpm test:browser
```

The build checks all launch routes and internal links, verifies public PDF text and link annotations, generates security headers and crawler rules, and enforces the compressed first-party JavaScript budget.

## Content

Published projects and articles are typed Astro content collections. A `draft: true` entry is omitted from pages, indexes, RSS, and sitemaps. Add content through those collections and keep stable slugs. The site profile, approved experience component, and tooling panels supply the remaining public copy.

Private editorial research and evidence belong in Craft. Publish only reviewed MDX and approved assets to this public repository. The website has no runtime Craft connection. The public résumé removes private contact text and annotations from the user-supplied original; the original is not stored here.

## Hosting

Cloudflare Workers Static Assets serves the compiled site. A Worker handles `/api/contact` and `/api/health`; static pages stay available if email configuration or upstream services fail. Preview and production use separate Worker names, secrets, verification keys, and rate-limit namespaces.

Read [the implementation checklist](docs/implementation-plan.md), [deployment runbook](docs/operations.md), and [design reference](docs/design-reference.md).

## Dependencies and device protection

Dependencies are locked. The workspace applies a three-day package age policy and convergence pins for established compatible `ansi-regex` and `rolldown` releases after device protection rejected newly published transitive versions. Device protection and TLS verification remain enabled. Update these pins only through a normal reviewed dependency update and rerun the complete checks.

## Performance

With the built site running, `pnpm performance` records three mobile Lighthouse runs each for the homepage, a case study, and an article. Reports stay in ignored `artifacts/`. Preview indexing is intentionally disabled; the performance check permits only that expected SEO exclusion. Production checks permit no failing scored SEO audits.
