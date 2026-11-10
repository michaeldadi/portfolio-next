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

## External launch requirements

The initial implementation checkpoint had no Cloudflare authentication. Michael subsequently connected the intended personal account, and the following setup was verified on November 10:

- Account Workers subdomain: `michaeldadi.workers.dev`.
- Worker `michael-dadi-portfolio-preview` uploaded from source revision `dd750154aa11b3e189832a179a209745e8900f67`. After installing its initial secrets, the active version was `f64752b8-b84c-428e-a900-bcd8cedb56c2`, deployment `a3574d13-cd55-48c4-9b90-364c469ebe42`.
- Both the Worker hostname and version URLs are disabled. Cloudflare reports `enabled: false` and `previews_enabled: false`; this is an unrouted staging upload, not a public preview or production launch.
- A managed preview Turnstile widget is restricted to the planned preview hostname. `TURNSTILE_SECRET_KEY`, `RATE_LIMIT_SALT`, and `CONTACT_TO_EMAIL` are installed as server-side secret bindings. Their values are not in this repository.
- GitHub environments `portfolio-preview` and `portfolio-production` exist. Public account/preview settings are installed; deployment credentials and Access service-token secrets are still pending.

Cloudflare's Zero Trust Free onboarding requires a card, billing address, terms acceptance, and authorization for usage beyond the free allowance. Its checkout is left to Michael; no billing authorization was submitted by the agent. Resend account creation is also a user handoff. No verified sender, real delivery, or production cutover is claimed.

**Domain correction:** `michaeldadi.com` is currently a planning value in configuration. Michael could not confirm owning the registration. Public registry data identifies Amazon Registrar and registration through March 11, 2027; both public resolvers returned SERVFAIL with the delegated AWS nameservers refusing queries. No matching zone exists in the connected Cloudflare account. The available AWS connector had expired credentials, so it did not establish ownership or recover existing DNS records. An old public profile links to the domain, which is a clue rather than ownership proof. No DNS records or registrar settings were changed.

Remaining work: establish domain control or choose an approved alternative, activate/configure protected preview, finish Resend signup and sender verification, install remaining delivery/deployment credentials, configure production Web Analytics, deploy a fully configured preview, verify one controlled message in the private inbox, then complete production custom-domain/TLS cutover with rollback evidence. If the domain changes, update the canonical URL, résumé contact URL, metadata, social assets where applicable, route configuration, verification allowlists, crawler rules, and smoke expectations before release.

The previous Vercel deployment is retained. The replacement includes a new Vercel Git-deployment disable setting to prevent legacy automatic deployments of this branch. Production auto-release remains disabled until `CLOUDFLARE_DEPLOYS_ENABLED=true` is deliberately configured after initial setup.

The deployment runbook is [operations.md](operations.md). These external gates are not equivalent to missing application code, and local success is not evidence of hosted delivery.
