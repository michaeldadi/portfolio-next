# Release evidence — November 10, 2026

## Live release

The portfolio is public at **https://michaeldadi.dev/**. [PR #1](https://github.com/michaeldadi/portfolio-next/pull/1) was merged, preserving the original Git history while replacing the prior application. The first verified production release is main revision `2c7364f5dda96b5639881660ad3aa04ad3cc725e`.

- Cloudflare Worker `michael-dadi-portfolio` serves the custom domain. Its `workers.dev` hostname and version URLs are disabled.
- [Production deployment and public smoke checks passed](https://github.com/michaeldadi/portfolio-next/actions/runs/42878260915). They verify exact revision, eleven public pages, security headers, canonical URLs, crawler rules, RSS, sitemap, résumé delivery, true 404s, and contact configuration readiness. The first attempt encountered initial DNS propagation; the rerun passed after resolution was established.
- Michael submitted a real message through the production form and confirmed inbox receipt. He separately verified preview delivery. Production and preview use separate domain-restricted Resend Sending keys, Turnstile widgets, and rate-limit salts. Private contact details and secrets are not published.
- `www` redirects to the HTTPS apex while preserving path and query; both HTTP and HTTPS requests were checked.
- DNSSEC DS/DNSKEY records are published and a validating resolver returned the authenticated-data flag. Cloudflare Registrar manages the DS record.
- Production Web Analytics uses one manually installed beacon. Automatic provider injection is disabled to prevent duplicate tracking; open/click tracking and receiving remain disabled in Resend.
- The preview remains behind Worker-wide Cloudflare Access, with a service-auth policy only for the preview CI token. [Its deployment and authenticated smoke checks passed](https://github.com/michaeldadi/portfolio-next/actions/runs/42876494187); anonymous requests redirect to Access. Version URLs are disabled.
- GitHub environment secrets and public build settings are installed. After the controlled public release and inbox confirmation, `CLOUDFLARE_DEPLOYS_ENABLED=true` was enabled for future successful main-branch checks. The workflow checks out the exact successful revision before building and deploying.

## Application and verification

Fresh Astro/TypeScript/Tailwind application follows the approved AIDesigner Portfolio variant A, Bold Geometric. It includes the supplied portrait, functioning focus/tooling selectors, responsive navigation, four complete case studies, three engineering articles, indexes, privacy, RSS, sitemap, and a contact-redacted résumé. The mobile hero caption and GitHub badge occupy separate layout rows below the desktop breakpoint; a regression check covers 360–1440px.

The iPhone header uses viewport safe-area insets, a solid white background and matching browser tint. Mobile controls retain space by showing the GitHub link in the menu. Dropdown positioning, anchor offsets, landscape content gutters and the footer account for safe areas. Regression coverage includes nonzero portrait notch/Dynamic Island and landscape insets via Chromium emulation, plus menu alignment and keyboard behavior in WebKit. These emulations do not constitute a physical-device test.

Initial [main-branch CI passed](https://github.com/michaeldadi/portfolio-next/actions/runs/42875995661): formatting, lint, Astro/Worker types, 24 handler tests, 37 browser checks across Chromium/Firefox/WebKit/mobile WebKit, three intentional responsive duplicates skipped, automated accessibility checks on representative pages, twelve HTML outputs, internal links, PDF privacy, and asset budgets. First-party JavaScript is 2,497 bytes and CSS is 7,132 bytes Brotli.

Three mobile Lighthouse runs per representative page produced median 100 performance, 100 accessibility, and 100 best-practices scores. Preview SEO is intentionally lower because indexing is disabled. A separate local production-build rehearsal scored 100 in all four categories on sampled pages. These are lab measurements, not field-performance claims.

Browser contact fixtures remain distinct from the real delivery checks. Turnstile rejected the automated browser with challenge failure `300030`; Michael completed the human verification himself. No verification bypass or test key is used in production.

## Domain and recovery

Michael personally registered `michaeldadi.dev` through Cloudflare on November 10, 2026. Registration is active through November 10, 2027 with auto-renewal enabled. The earlier `.com` planning value is superseded. Michael excluded interaction with the suspended personal AWS account and recovery of that domain; no AWS account or registrar changes were made for this project.

The initial registered zone was empty. Dedicated Resend DKIM/Forge records and a monitoring-only DMARC policy were added before website cutover; the provider verified the sending domain. The `www` record is a proxied documentation-address placeholder used only for the zone redirect. The apex Worker custom domain is managed by Cloudflare.

The first verified production recovery baseline is Worker version `2803b856-413d-461b-bcad-2977a4777a03` at source revision `2c7364f5dda96b5639881660ad3aa04ad3cc725e`. Later documentation-only releases may have a newer live revision; consult `/api/health`, `/release.json`, GitHub deployment runs, and `wrangler deployments list --env production` for current state. Release artifacts and the DNS cutover snapshot were recorded separately. No live rollback was performed because it would change the functioning public deployment.

The previous Vercel deployment is retained as a historical recovery reference; new Vercel Git deployments are disabled. Operational commands, secret handling, deployment and recovery procedures are in [operations.md](operations.md).
