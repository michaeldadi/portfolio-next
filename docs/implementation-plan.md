# Bold Geometric — implementation checklist

## Agreed result

Replace the previous application completely while preserving repository identity and history. Follow the approved AIDesigner variant, use Astro/TypeScript/Tailwind, and host the static site and contact service on Cloudflare. Launch the four selected projects, three complete articles, reviewed experience, real portrait, and current public résumé.

## Design and behavior

- Preserve the sticky white header, centered hero, navy montage and portrait overlay, four alternating black/color project panels, cobalt stack section, geometric tooling panel, writing panels, about/experience, contact form, and footer.
- Preserve Outfit, Inter, and JetBrains Mono, self-hosted with the application.
- Make hero and tooling selectors keyboard accessible, with mobile navigation, visible focus, reduced motion, readable no-JavaScript content, and contained overflow.
- Use a real GitHub QR code and clearly illustrative product figures.

## Public content

- Four case studies: Foresight RCM, Zealthy mobile, Workonomics, RCM copilot.
- Three complete articles: logging boundaries, mobile release pipelines, PostgreSQL query/index work.
- Current résumé is the user-provided senior engineering PDF; preserve the private original and publish a contact-redacted copy.
- Preserve the meanings of deployment time −60%, crashes −34%, and database performance +36%. Do not rewrite them as different measurements or invent durations.
- Use the supplied portrait and résumé-derived professional links.
- Keep the private contact recipient out of public files, PDF text, annotations, metadata, and API responses.

## Runtime

- Static HTML with small TypeScript enhancements; no runtime CMS or application database.
- JSON contact endpoint with bounded parsing, shared field validation, same-origin enforcement, server-side Turnstile verification, approximate throttling with hashed keys, deterministic email, and provider idempotency.
- Keep entered values after failures, prevent double submission, announce errors/success, and offer LinkedIn when the form is unavailable.
- Minimal health endpoint reports configuration readiness, never credentials or inbox values.
- Cloudflare Web Analytics runs only on production. Footer and privacy copy describe it accurately.

## Verification and release

- Type checks, focused handler tests, browser tests, accessibility audits, route/link validation, public PDF checks, responsive screenshots, and performance measurements.
- Protected preview, real provider verification and controlled message delivery before production.
- Confirm domain control, authoritative records and DNSSEC. Preserve unrelated DNS and mail records.
- Record tested commit, Worker version, artifact, DNS snapshot, public smoke results, and rollback target.

## Completion evidence

The release record in `docs/release-status.md` distinguishes implemented code, checks actually run, hosted behavior actually observed, and external launch requirements. A successful local build is not a deployment record.
