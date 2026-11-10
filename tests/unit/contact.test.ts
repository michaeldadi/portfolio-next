import { beforeEach, describe, expect, it, vi } from 'vitest';
import worker, { handleRequest, type Env } from '../../worker/index';

const origin = 'https://portfolio.example.test';
const submission = {
  name: 'Jordan Lee',
  email: 'jordan@example.test',
  message: 'I would like to discuss an engineering role.',
  submissionId: 'c43aaac1-bbe0-4db3-8563-63bf33daa197',
  turnstileToken: 'verified-example-token',
};
const env = (): Env => ({
  ASSETS: { fetch: vi.fn(async () => new Response('static')) },
  DEPLOY_ENV: 'preview',
  ALLOWED_ORIGIN: origin,
  CONTACT_TO_EMAIL: 'private-recipient@example.test',
  CONTACT_FROM_EMAIL: 'sender@example.test',
  RESEND_API_KEY: 'example-api-key',
  TURNSTILE_SECRET_KEY: 'example-verification-key',
  RATE_LIMIT_SALT: 'example-salt',
  CONTACT_RATE_LIMITER: { limit: vi.fn(async () => ({ success: true })) },
});
function request(value: unknown = submission, headers: Record<string, string> = {}) {
  return new Request(`${origin}/api/contact`, {
    method: 'POST',
    headers: {
      Origin: origin,
      'Content-Type': 'application/json',
      'CF-Connecting-IP': '192.0.2.8',
      ...headers,
    },
    body: JSON.stringify(value),
  });
}
const providers = () =>
  vi.fn(async (url: string) =>
    url.includes('turnstile')
      ? Response.json({
          success: true,
          action: 'portfolio_contact',
          hostname: 'portfolio.example.test',
        })
      : Response.json({ id: 'provider-message-id' }),
  );

beforeEach(() => {
  vi.restoreAllMocks();
  vi.spyOn(console, 'info').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});
describe('contact delivery boundary', () => {
  it('accepts a message and keeps the fixed recipient on the server', async () => {
    const configuration = env();
    const fetcher = providers();
    const result = await handleRequest(request(), configuration, fetcher);
    expect(result.status).toBe(202);
    expect(await result.text()).not.toContain(configuration.CONTACT_TO_EMAIL);
    const payload = JSON.parse(String(fetcher.mock.calls[1]?.[1]?.body));
    expect(payload.to).toEqual([configuration.CONTACT_TO_EMAIL]);
    expect(payload.reply_to).toBe(submission.email);
    expect(payload.subject).toBe('Portfolio inquiry');
    expect(fetcher.mock.calls[1]?.[1]?.headers).toMatchObject({
      'Idempotency-Key': `portfolio-contact-${submission.submissionId}`,
    });
  });
  it('reuses a deterministic provider payload and key across retries', async () => {
    const fetcher = providers();
    await handleRequest(request(), env(), fetcher);
    await handleRequest(request(), env(), fetcher);
    expect(fetcher.mock.calls[1]?.[1]?.body).toBe(fetcher.mock.calls[3]?.[1]?.body);
    expect(fetcher.mock.calls[1]?.[1]?.headers).toEqual(fetcher.mock.calls[3]?.[1]?.headers);
  });
  it('never logs message contents, recipient, tokens, or raw IPs', async () => {
    await handleRequest(request(), env(), providers());
    const log = JSON.stringify(vi.mocked(console.info).mock.calls);
    for (const secret of [
      submission.name,
      submission.email,
      submission.message,
      submission.turnstileToken,
      env().CONTACT_TO_EMAIL!,
      '192.0.2.8',
    ])
      expect(log).not.toContain(secret);
  });
  it.each([
    [{ ...submission, name: '' }, 422],
    [{ ...submission, email: 'not-an-address' }, 422],
    [{ ...submission, message: 'short' }, 422],
    [{ ...submission, message: 'x'.repeat(5001) }, 422],
    [{ ...submission, submissionId: 'invalid' }, 400],
    [{ ...submission, turnstileToken: '' }, 403],
    [null, 400],
    [[], 400],
  ])('rejects invalid input before calling providers: %j', async (input, status) => {
    const fetcher = providers();
    const response = await handleRequest(request(input), env(), fetcher);
    expect(response.status).toBe(status);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('accepts unicode names and personal-provider addresses', async () => {
    expect(
      (
        await handleRequest(
          request({ ...submission, name: '李 Jordan', email: 'jordan@personal.example' }),
          env(),
          providers(),
        )
      ).status,
    ).toBe(202);
  });
  it('rejects cross-origin and missing-origin requests', async () => {
    const fetcher = providers();
    expect(
      (
        await handleRequest(
          request(submission, { Origin: 'https://other.example' }),
          env(),
          fetcher,
        )
      ).status,
    ).toBe(403);
    expect((await handleRequest(request(submission, { Origin: '' }), env(), fetcher)).status).toBe(
      403,
    );
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('enforces content type and method', async () => {
    expect((await handleRequest(new Request(`${origin}/api/contact`), env())).status).toBe(405);
    expect(
      (
        await handleRequest(
          request(submission, { 'Content-Type': 'application/json-not-really' }),
          env(),
        )
      ).status,
    ).toBe(415);
  });
  it('bounds chunked request bodies without trusting Content-Length', async () => {
    const fetcher = providers();
    expect(
      (await handleRequest(request({ ...submission, message: 'x'.repeat(33000) }), env(), fetcher))
        .status,
    ).toBe(413);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('rejects malformed JSON', async () => {
    const response = await handleRequest(
      new Request(`${origin}/api/contact`, {
        method: 'POST',
        headers: { Origin: origin, 'Content-Type': 'application/json' },
        body: '{',
      }),
      env(),
      providers(),
    );
    expect(response.status).toBe(400);
  });
  it('throttles before contacting upstream services and hashes the IP', async () => {
    const configuration = env();
    const fetcher = providers();
    const limiter = vi.fn(async () => ({ success: false }));
    configuration.CONTACT_RATE_LIMITER = { limit: limiter };
    const response = await handleRequest(request(), configuration, fetcher);
    expect(response.status).toBe(429);
    expect(response.headers.get('Retry-After')).toBe('60');
    expect(limiter.mock.calls[0]?.[0]?.key).toMatch(/^contact:[0-9a-f]{64}$/);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it.each([
    { success: false, action: 'portfolio_contact', hostname: 'portfolio.example.test' },
    { success: true, action: 'wrong_action', hostname: 'portfolio.example.test' },
    { success: true, action: 'portfolio_contact', hostname: 'wrong.example.test' },
  ])('requires a valid verification action and hostname', async (result) => {
    const fetcher = vi.fn(async () => Response.json(result));
    expect((await handleRequest(request(), env(), fetcher)).status).toBe(403);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it('reports provider failure without echoing its contents', async () => {
    let call = 0;
    const response = await handleRequest(request(), env(), async () =>
      ++call === 1
        ? Response.json({
            success: true,
            action: 'portfolio_contact',
            hostname: 'portfolio.example.test',
          })
        : new Response('sensitive provider details', { status: 500 }),
    );
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain('sensitive');
  });
  it('handles network timeouts without claiming success', async () => {
    const response = await handleRequest(request(), env(), async () => {
      throw new Error('private-network-details');
    });
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain('private-network-details');
  });
  it('fails closed when configuration is absent while keeping static pages available', async () => {
    const configuration = env();
    delete configuration.RESEND_API_KEY;
    expect((await handleRequest(request(), configuration, providers())).status).toBe(503);
    expect((await handleRequest(new Request(`${origin}/api/health`), configuration)).status).toBe(
      503,
    );
    expect(await (await worker.fetch(new Request(`${origin}/work/`), configuration)).text()).toBe(
      'static',
    );
  });
  it('returns API 404s and a minimal readiness response', async () => {
    expect((await handleRequest(new Request(`${origin}/api/missing`), env())).status).toBe(404);
    const health = await handleRequest(new Request(`${origin}/api/health`), env());
    expect(health.status).toBe(200);
    expect(await health.text()).not.toContain('@');
  });
});
