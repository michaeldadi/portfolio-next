import { UUID, validateFields } from '../src/lib/contact';

export interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  CONTACT_RATE_LIMITER?: { limit(input: { key: string }): Promise<{ success: boolean }> };
  DEPLOY_ENV: string;
  ALLOWED_ORIGIN: string;
  REVISION?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  RATE_LIMIT_SALT?: string;
}
type OutboundFetch = (url: string, init?: RequestInit) => Promise<Response>;
const MAX_BODY = 32 * 1024;
const CONTACT_ACTION = 'portfolio_contact';
const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
};

function json(body: Record<string, unknown>, status: number, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), { status, headers: { ...headers, ...extra } });
}
function ready(env: Env) {
  return Boolean(
    env.CONTACT_TO_EMAIL &&
    env.CONTACT_FROM_EMAIL &&
    env.RESEND_API_KEY &&
    env.TURNSTILE_SECRET_KEY &&
    env.RATE_LIMIT_SALT &&
    env.CONTACT_RATE_LIMITER &&
    /^https?:\/\/[^/]+$/.test(env.ALLOWED_ORIGIN),
  );
}
class BodyTooLarge extends Error {}
async function boundedJson(request: Request): Promise<unknown> {
  if (Number(request.headers.get('content-length')) > MAX_BODY) throw new BodyTooLarge();
  if (!request.body) throw new SyntaxError('Missing body');
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY) {
        await reader.cancel();
        throw new BodyTooLarge();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
}
async function rateKey(ip: string, salt: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(salt),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const bytes = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(ip)));
  return `contact:${Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')}`;
}

export async function handleRequest(request: Request, env: Env, outbound: OutboundFetch = fetch) {
  const url = new URL(request.url);
  if (url.pathname === '/api/health') {
    if (request.method !== 'GET')
      return json({ error: 'method_not_allowed' }, 405, { Allow: 'GET' });
    return json(
      {
        status: ready(env) ? 'ready' : 'configuration_required',
        revision: env.REVISION ?? 'local',
      },
      ready(env) ? 200 : 503,
    );
  }
  if (url.pathname !== '/api/contact') {
    if (url.pathname.startsWith('/api/')) return json({ error: 'not_found' }, 404);
    return env.ASSETS.fetch(request);
  }
  if (request.method !== 'POST')
    return json({ error: 'method_not_allowed' }, 405, { Allow: 'POST' });
  if (
    request.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase() !== 'application/json'
  )
    return json({ error: 'unsupported_content_type' }, 415);
  if (!ready(env)) return json({ error: 'send_unavailable' }, 503, { 'Retry-After': '60' });
  if (request.headers.get('origin') !== env.ALLOWED_ORIGIN || url.origin !== env.ALLOWED_ORIGIN)
    return json({ error: 'origin_not_allowed' }, 403);
  let input: unknown;
  try {
    input = await boundedJson(request);
  } catch (error) {
    return json(
      { error: error instanceof BodyTooLarge ? 'body_too_large' : 'malformed_request' },
      error instanceof BodyTooLarge ? 413 : 400,
    );
  }
  if (!input || typeof input !== 'object' || Array.isArray(input))
    return json({ error: 'malformed_request' }, 400);
  const data = input as Record<string, unknown>;
  const validation = validateFields(data);
  if (!validation.valid)
    return json({ error: 'validation_failed', fields: validation.fields }, 422);
  if (typeof data.submissionId !== 'string' || !UUID.test(data.submissionId))
    return json({ error: 'invalid_submission' }, 400);
  if (
    typeof data.turnstileToken !== 'string' ||
    !data.turnstileToken ||
    data.turnstileToken.length > 4096
  )
    return json({ error: 'verification_required' }, 403);

  const requestId = crypto.randomUUID();
  const started = Date.now();
  let phase = 'throttling';
  try {
    const key = await rateKey(
      request.headers.get('cf-connecting-ip') ?? 'local',
      env.RATE_LIMIT_SALT!,
    );
    const limit = await env.CONTACT_RATE_LIMITER!.limit({ key });
    if (!limit.success) return json({ error: 'rate_limited' }, 429, { 'Retry-After': '60' });
    phase = 'verification';
    const verification = await outbound(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: data.turnstileToken }),
        signal: AbortSignal.timeout(10000),
      },
    );
    if (!verification.ok) throw new Error('Verification unavailable');
    const result = (await verification.json()) as {
      success?: boolean;
      action?: string;
      hostname?: string;
    };
    if (!result.success || result.action !== CONTACT_ACTION || result.hostname !== url.hostname)
      return json({ error: 'verification_required' }, 403);
    phase = 'delivery';
    const { name, email, message } = validation.value;
    const delivery = await outbound('https://api.resend.com/emails', {
      method: 'POST',
      signal: AbortSignal.timeout(10000),
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `portfolio-contact-${data.submissionId}`,
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [env.CONTACT_TO_EMAIL],
        reply_to: email,
        subject: 'Portfolio inquiry',
        text: `Name: ${name}\nReply to: ${email}\n\n${message}`,
      }),
    });
    if (delivery.status === 409) return json({ error: 'submission_conflict' }, 409);
    if (!delivery.ok) throw new Error('Delivery unavailable');
    const accepted = (await delivery.json()) as { id?: string };
    if (typeof accepted.id !== 'string' || accepted.id.length > 128)
      throw new Error('Invalid provider acknowledgement');
    console.info(
      JSON.stringify({
        event: 'contact.accepted',
        requestId,
        providerId: accepted.id,
        durationMs: Date.now() - started,
      }),
    );
    return json({ ok: true, requestId }, 202);
  } catch {
    console.warn(
      JSON.stringify({
        event: 'contact.unavailable',
        phase,
        requestId,
        durationMs: Date.now() - started,
      }),
    );
    return json({ error: 'send_unavailable' }, 503, { 'Retry-After': '60' });
  }
}

export default { fetch: (request: Request, env: Env) => handleRequest(request, env) };
