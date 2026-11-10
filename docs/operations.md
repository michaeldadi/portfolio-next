# Deployment and operations

## Environments

| Environment | Worker                         | Indexing                                                   | Email configuration                          |
| ----------- | ------------------------------ | ---------------------------------------------------------- | -------------------------------------------- |
| Preview     | michael-dadi-portfolio-preview | noindex headers/meta, disallowed robots, Cloudflare Access | Isolated provider/verification configuration |
| Production  | michael-dadi-portfolio         | canonical michaeldadi.dev                                  | Real verified sender and private recipient   |

Use the account's `workers.dev` address for preview and attach `michaeldadi.dev` only for the production cutover. Configure Cloudflare Access for preview before sharing its URL. Disable additional unprotected preview/version URLs. Keep deployment credentials in provider/GitHub secret stores.

## One-time account setup

1. Confirm the Cloudflare account and an active zone for the domain. Export existing DNS records and inspect DNSSEC before changes. The registered `michaeldadi.dev` zone is active in the personal Cloudflare account. The initial zone was empty before adding the dedicated sending records.
2. Create the preview Worker, then configure its exact HTTPS origin in `ALLOWED_ORIGIN`.
3. Create separate Turnstile widgets for preview and production, restricted to their hostnames. Both use action `portfolio_contact`.
4. Verify a sending subdomain in Resend. Preserve existing mailbox MX/SPF/DKIM records; use the provider's exact records for the sending subdomain.
5. Set `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, and `RATE_LIMIT_SALT` with `wrangler secret put --env <environment>`. The recipient is the private address Michael supplied; do not copy it into this repository.
6. Set the public Turnstile key at build time. Configure the Web Analytics identifier only for production.
7. Set up GitHub environments `portfolio-preview` and `portfolio-production` with the deployment account/token and corresponding public configuration. Preview requires `PREVIEW_ORIGIN`.
8. Configure a Cloudflare Access service token for the protected preview. Store `CF_ACCESS_CLIENT_ID` and `CF_ACCESS_CLIENT_SECRET` in the preview GitHub environment so hosted smoke checks can pass Access without making the preview public.
9. The newly authored `vercel.json` disables the legacy Vercel Git deployment integration for this replacement. Retain the previous deployment as a recovery reference.
10. After the first controlled production release and delivery check, set repository variable `CLOUDFLARE_DEPLOYS_ENABLED=true` to enable automatic production releases after successful `Portfolio checks` runs on main. Leave it unset during initial account and DNS setup.

Michael registered `michaeldadi.dev` on November 10, 2026; it is the approved canonical domain. Do not interact with the suspended personal AWS account or attempt recovery of the superseded `.com` domain for this project. The first staging upload used a temporary configuration with both `workers_dev` and `preview_urls` disabled so Access could be prepared before any preview URL became reachable. The checked-in preview configuration enables its Worker hostname for a completed protected release, while version URLs remain explicitly disabled in both environments.

Michael completed Zero Trust Free onboarding himself. The hosted preview requires Cloudflare Access for all traffic; version URLs remain disabled. Web Analytics uses manual snippet installation so Cloudflare does not inject a duplicate beacon.

## Release commands

```sh
DEPLOY_ENV=preview PUBLIC_TURNSTILE_SITE_KEY=<preview-key> pnpm build
export PREVIEW_ORIGIN=https://<protected-worker-hostname>
pnpm deploy:preview
```

The preview origin must match its configured Worker value. Verify access protection, noindex headers, robots, every content route, the PDF, CSP behavior, and real provider delivery. Provider credentials must not be supplied to pull requests from forks.

For production, provide the real public build configuration and run:

```sh
DEPLOY_ENV=production pnpm build
pnpm deploy:production
```

The production command verifies the release environment, real verification key, analytics configuration, and required Worker secret names before deployment. It also verifies that the public configuration was included at build time. Both deployment commands set the health endpoint's revision from the artifact. The GitHub deployment workflow requires the main branch for production and does not retrieve secret values. Automatic releases check out the exact successful CI revision rather than the current branch tip.

The deployment workflow runs `scripts/smoke.mjs` after deployment to verify the hosted revision, all content pages, CSP, crawler rules, résumé, RSS, sitemap, true 404 responses, and contact configuration readiness. Preview checks first require an anonymous redirect to Cloudflare Access, then use the Access service token. The script does not send messages or establish inbox delivery.

## Cutover

Record the prior DNS and any existing deployment. Attach the production Worker custom domain, verify TLS, and configure a Cloudflare zone redirect from `www` to the apex while preserving path/query. Confirm unrelated subdomains and mail continue resolving. Do not delete the prior deployment during initial verification.

Check `/api/health` returns 200; that establishes configuration readiness only. Submit one clearly identified synthetic inquiry through the actual form and verify receipt in the designated inbox. An accepted API response alone is not an inbox delivery record.

## Recovery

Use `wrangler deployments list --env production` to identify versions. Roll back to the recorded known-good Worker version with the supported Wrangler rollback command, then rerun public smoke checks. Revert the source change before deploying again. DNS rollback uses the saved DNS records and is separate from application-version rollback.

The initial known-good production baseline is version `2803b856-413d-461b-bcad-2977a4777a03`, source revision `2c7364f5dda96b5639881660ad3aa04ad3cc725e` (November 10, 2026). Prefer a more recent verified version when one exists. Rollback changes the live application; it was not executed during the successful initial launch. The `www` redirect uses a proxied `192.0.2.1` placeholder A record and an exact-host redirect expression, preserving request path and query.

GitHub deployment and preview CI credentials created at launch expire in November 2027. Replace them in the corresponding GitHub environment secret stores before expiry and run a controlled deployment/smoke check. Keep Resend Sending keys restricted to the verified `mail.michaeldadi.dev` domain. Rotate values through provider secret stores; never put them into the repository, release artifacts, Craft, or logs.

## Monitoring and privacy

Inspect Worker errors, response categories and latency, Resend delivery/bounce status, and Web Analytics field performance. The application logs no names, addresses, message bodies, tokens, or raw client IPs. Rate limiting is approximate per Cloudflare location and is not a global quota guarantee.

No message database or autoresponder is used. Resend and the receiving mailbox handle message retention under their configured policies. Keep operational evidence free of real message content.

## Updating content

Make a focused change, run the checks, inspect a preview, then release the tested revision. Preserve publication dates and update modification dates when content changes. Publish new source evidence and public assets deliberately; do not import private Craft pages or employer records into the public repository.
