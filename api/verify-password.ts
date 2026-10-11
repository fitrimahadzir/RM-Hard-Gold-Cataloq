import { createHmac, timingSafeEqual } from 'node:crypto';

interface ApiRequest {
  method?: string;
  body?: unknown;
  query?: Record<string, string | string[] | undefined>;
}

interface ApiResponse {
  status(code: number): ApiResponse;
  setHeader(name: string, value: string): void;
  json(body: unknown): void;
}

const PASSWORD_KEYS = ['ADD_PRODUCT_PASSWORD', 'ADMIN_PASSWORD', 'FORM_PASSWORD'];
const SECRET_KEYS = ['ADD_PRODUCT_SECRET'];
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000;

function readEnv(keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key];
    if (value && value.trim()) return value.trim();
  }
  return undefined;
}

function safeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
}

function createToken(secret: string): string {
  const expiry = Date.now() + TOKEN_TTL_MS;
  const signature = createHmac('sha256', secret).update(String(expiry)).digest('hex');
  return `${expiry}.${signature}`;
}

function isValidToken(token: unknown, secret: string): boolean {
  if (typeof token !== 'string' || !token.includes('.')) return false;
  const [expiryPart, signature] = token.split('.');
  const expiry = Number(expiryPart);
  if (!Number.isFinite(expiry) || expiry < Date.now()) return false;
  const expected = createHmac('sha256', secret).update(String(expiry)).digest('hex');
  return safeEqual(signature, expected);
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const password = readEnv(PASSWORD_KEYS);
  if (!password) {
    res.status(500).json({ error: 'Password not configured on the server.' });
    return;
  }
  const secret = readEnv(SECRET_KEYS) || password;

  if (req.method === 'GET') {
    const token = req.query?.token;
    const value = Array.isArray(token) ? token[0] : token;
    res.status(200).json({ ok: isValidToken(value, secret) });
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    res.status(405).json({ ok: false, error: 'Method not allowed.' });
    return;
  }

  const body = (req.body ?? {}) as { password?: unknown; token?: unknown };

  if (typeof body.token === 'string' && isValidToken(body.token, secret)) {
    res.status(200).json({ ok: true, token: body.token });
    return;
  }

  const submitted = typeof body.password === 'string' ? body.password : '';
  if (!submitted || !safeEqual(submitted, password)) {
    res.status(401).json({ ok: false, error: 'Incorrect password.' });
    return;
  }

  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ ok: true, token: createToken(secret) });
}
