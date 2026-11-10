# Release evidence — November 10, 2026

## Implemented

Fresh Astro/TypeScript/Tailwind application in the existing repository, with the approved Bold Geometric homepage, working selectors, four case studies, three complete articles, project/writing indexes, privacy page, real 404 page, RSS, sitemap, local fonts, supplied portrait, and a contact-redacted public résumé. The previous application and dependency graph have been removed from this branch; history is preserved.

The Cloudflare Worker implements bounded validation, origin checks, Turnstile verification, approximate rate limiting with HMAC-derived keys, provider idempotency, private-recipient email delivery, and configuration health. GitHub workflows provide checks, protected-preview deployment, guarded production deployment, exact-revision provenance, hosted smoke checks, and optional automatic main-branch release after account setup.

## Observed local verification

- ESLint and Astro/Worker type checks pass with no reported diagnostics.
- 24 handler tests pass.
- Browser suite: 37 passed, 3 intentionally skipped responsive-loop duplicates. Chromium, Firefox, WebKit, and mobile WebKit cover navigation, selectors, menu controls, contact success/retry fixtures, no-JavaScript content, real 404 routing, security headers, crawler rules, and automated WCAG checks on three representative pages.
- Responsive checks cover 360, 390, 768, 834, 1024, and 1440 pixels without page overflow.
- Build checks validate 12 HTML outputs, internal links, public résumé contact removal, and compressed asset budgets. First-party JavaScript is approximately 2.5 KB Brotli; CSS is approximately 7.2 KB Brotli.
- Public résumé page layout and representative desktop/mobile pages were visually reviewed. Product diagrams are illustrative and contain synthetic examples.
- Browser contact providers are explicit test fixtures. No real message has been sent or delivered by this implementation.

Mobile Lighthouse measurements completed: three runs each of the homepage, Zealthy case study, and PostgreSQL article. Every page has median scores of 100 performance, 100 accessibility, and 100 best practices. Preview SEO scores are 69/66/66 because indexing is intentionally disabled; the only failing scored SEO audit is the expected crawler exclusion. These local measurements are not field performance or a production SEO result. Hosted CI results are added when completed.

## External launch requirements

Cloudflare authentication was not available during local implementation. No Cloudflare resource, DNS record, production deployment, or Resend sender was created. Temporary OAuth/device codes expire and are not a persistent setup mechanism.

The remaining account-dependent work is to authenticate the intended personal Cloudflare account, verify domain control/DNS, configure protected preview and Turnstile, verify a Resend sending subdomain, install server-side secrets, configure production Web Analytics and GitHub environments, deploy preview, verify one controlled message in the private inbox, then cut over the production custom domain with DNS/TLS and rollback evidence.

The previous Vercel deployment is retained. The replacement includes a new Vercel Git-deployment disable setting to prevent legacy automatic deployments of this branch. Production auto-release remains disabled until `CLOUDFLARE_DEPLOYS_ENABLED=true` is deliberately configured after initial setup.

The deployment runbook is [operations.md](operations.md). These external gates are not equivalent to missing application code, and local success is not evidence of hosted delivery.
