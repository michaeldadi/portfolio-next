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

Mobile Lighthouse measurements completed: three runs each of the homepage, Zealthy case study, and PostgreSQL article. Every page has median scores of 100 performance, 100 accessibility, and 100 best practices. Preview SEO scores are 69/66/66 because indexing is intentionally disabled; the only failing scored SEO audit is the expected crawler exclusion. These local measurements are not field performance. Hosted CI and the final source revision are tracked in [draft PR #1](https://github.com/michaeldadi/portfolio-next/pull/1).

A separate local production-mode build verified indexable metadata, crawler rules, and a valid Cloudflare Worker/static-assets dry run. The deployment guard correctly refused to publish without a real Turnstile key. This is a local release rehearsal, not a deployment.

## Hosting checkpoint

Michael connected the intended personal Cloudflare account, activated Zero Trust Free, created his Resend account, and personally completed registration of **michaeldadi.dev**. Registration is active through November 10, 2027 with auto-renewal enabled. The approved canonical URL is `https://michaeldadi.dev`; application URLs, metadata, public résumé, social card, route configuration, and smoke expectations now use it.

The earlier `.com` planning value is superseded. Michael explicitly excluded interaction with his suspended personal AWS account and recovery of that domain for this project. No AWS account or registrar changes were made.

- Preview: `https://michael-dadi-portfolio-preview.michaeldadi.workers.dev/`, protected by Cloudflare Access for all traffic. An anonymous request redirects to the Access login; the authenticated homepage rendered successfully. Version URLs are disabled.
- Preview has all five server-side secret bindings. Its managed Turnstile widget is restricted to the preview hostname. Its Resend key has Sending access restricted to `mail.michaeldadi.dev`.
- Resend verified `mail.michaeldadi.dev`. Its generated DKIM TXT and two Forge CNAME records resolve at the authoritative nameserver. A monitoring-only DMARC policy is present; receiving and click/open tracking remain disabled.
- A separate production Worker has been uploaded **without routes or Worker/version URLs** for private configuration. It has separate Turnstile and rate-limit secrets and a separate domain-scoped Resend Sending key. This private upload is not a public launch.
- Production Web Analytics is configured for manual snippet installation, avoiding duplicate injection. Production and preview GitHub environments exist; deployment credentials and the preview Access service token are still pending.
- The live Turnstile widget loaded but rejected the automated browser with challenge failure `300030`. This is not evidence of a hostname/configuration failure or of successful human verification. A human form submission and actual private-inbox receipt remain required.

Remaining work: complete GitHub deployment and preview service credentials, verify the configured preview, obtain a successful human contact submission, then publish the tested main revision on the production custom domain with TLS, redirect, DNSSEC, smoke and recovery evidence. No real message delivery or public production launch is claimed at this checkpoint.

The previous Vercel deployment is retained. The replacement includes a new Vercel Git-deployment disable setting to prevent legacy automatic deployments of this branch. Production auto-release remains disabled until `CLOUDFLARE_DEPLOYS_ENABLED=true` is deliberately configured after initial setup.

The deployment runbook is [operations.md](operations.md). These external gates are not equivalent to missing application code, and local success is not evidence of hosted delivery.
