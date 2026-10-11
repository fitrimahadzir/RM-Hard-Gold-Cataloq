import { AirtableRecord, mapRecord } from '../src/services/airtable';
import { Product } from '../src/types';

interface ApiRequest {
  method?: string;
}

interface ApiResponse {
  status(code: number): ApiResponse;
  setHeader(name: string, value: string): void;
  json(body: unknown): void;
}

const TOKEN_KEYS = [
  'AIRTABLE_TOKEN',
  'AIRTABLE_API_KEY',
  'AIRTABLE_PAT',
  'AIRTABLE_PERSONAL_ACCESS_TOKEN',
  'AIRTABLE_ACCESS_TOKEN',
];
const BASE_KEYS = ['AIRTABLE_BASE_ID', 'AIRTABLE_BASE', 'AIRTABLE_BASEID'];
const TABLE_KEYS = ['AIRTABLE_TABLE', 'AIRTABLE_TABLE_NAME', 'AIRTABLE_TABLE_ID'];

function readEnv(keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key];
    if (value && value.trim()) return value.trim();
  }
  return undefined;
}

export default async function handler(_req: ApiRequest, res: ApiResponse) {
  const token = readEnv(TOKEN_KEYS);
  const baseId = readEnv(BASE_KEYS);
  const table = readEnv(TABLE_KEYS);
  const view = process.env.AIRTABLE_VIEW?.trim();

  if (!token || !baseId || !table) {
    res.status(500).json({
      error: 'Airtable is not configured. Set AIRTABLE_TOKEN, AIRTABLE_BASE_ID and AIRTABLE_TABLE in Vercel.',
      products: [],
    });
    return;
  }

  try {
    const records: AirtableRecord[] = [];
    let offset: string | undefined;

    do {
      const params = new URLSearchParams({ pageSize: '100' });
      if (view) params.set('view', view);
      if (offset) params.set('offset', offset);

      const url = `https://api.airtable.com/v0/${encodeURIComponent(baseId)}/${encodeURIComponent(
        table
      )}?${params.toString()}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const detail = await response.text();
        res.status(response.status).json({
          error: `Airtable request failed (${response.status}).`,
          detail,
          products: [],
        });
        return;
      }

      const data = (await response.json()) as { records?: AirtableRecord[]; offset?: string };
      if (Array.isArray(data.records)) records.push(...data.records);
      offset = data.offset;
    } while (offset);

    const products: Product[] = records
      .map(mapRecord)
      .filter((product): product is Product => product !== null && product.availability !== false);

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.status(200).json({ products, count: products.length });
  } catch (error) {
    res.status(500).json({
      error: 'Unexpected error while loading the catalog.',
      detail: error instanceof Error ? error.message : String(error),
      products: [],
    });
  }
}
