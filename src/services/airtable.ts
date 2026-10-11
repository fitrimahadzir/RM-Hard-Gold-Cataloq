import { CategoryId, Product } from '../types';

export interface AirtableAttachment {
  id?: string;
  url?: string;
  filename?: string;
  thumbnails?: {
    small?: { url: string };
    large?: { url: string };
    full?: { url: string };
  };
}

export interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
}

const CATEGORY_SINGULARS: Record<CategoryId, string> = {
  'pendant-bead': 'Pendant',
  ring: 'Ring',
  bracelet: 'Bracelet',
  necklace: 'Necklace',
  earring: 'Earring',
};

const CATEGORY_SIZE_LABELS: Record<CategoryId, string> = {
  'pendant-bead': 'Pendant / Bead Size',
  ring: 'Ring Size (Diameter)',
  bracelet: 'Wrist Circumference',
  necklace: 'Necklace Length',
  earring: 'Earring Type & Length',
};

const AVAILABLE_VALUES = ['', 'available', 'yes', 'y', 'true', 'in stock', 'instock', 'ready', '1'];
const UNAVAILABLE_VALUES = ['sold', 'sold out', 'no', 'n', 'false', 'out of stock', 'unavailable', 'reserved', '0'];

function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[\s_-]/g, '');
}

function getField(fields: Record<string, unknown>, key: string): unknown {
  if (key in fields) return fields[key];
  const normalized = normalizeKey(key);
  const found = Object.keys(fields).find((k) => normalizeKey(k) === normalized);
  return found ? fields[found] : undefined;
}

export function normalizeCategory(value: unknown): CategoryId | null {
  const v = String(value ?? '').toLowerCase().trim();
  if (!v) return null;
  if (v.includes('ring')) return 'ring';
  if (v.includes('pendant') || v.includes('bead') || v.includes('charm')) return 'pendant-bead';
  if (v.includes('bracelet') || v.includes('bangle') || v.includes('cuff') || v.includes('wrist')) return 'bracelet';
  if (v.includes('necklace') || v.includes('choker') || v.includes('chain')) return 'necklace';
  if (v.includes('earring') || v.includes('ear ')) return 'earring';
  return null;
}

function parseWeight(value: unknown): { weight: string; weightNumeric: number } {
  if (value === null || value === undefined || value === '') return { weight: '', weightNumeric: 0 };
  if (typeof value === 'number') return { weight: `${value} g`, weightNumeric: value };
  const raw = String(value).trim();
  const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
  return { weight: raw, weightNumeric: Number.isFinite(num) ? num : 0 };
}

function parseSizes(value: unknown): string[] {
  if (value === null || value === undefined) return [];
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  return String(value)
    .split(/[,\n;|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function pickImage(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') return value.trim();
  if (Array.isArray(value)) {
    const first = value[0];
    if (typeof first === 'string') return first.trim();
    if (first && typeof first === 'object') {
      const attachment = first as AirtableAttachment;
      return attachment.thumbnails?.large?.url || attachment.url || '';
    }
    return '';
  }
  if (typeof value === 'object') {
    const attachment = value as AirtableAttachment;
    return attachment.thumbnails?.large?.url || attachment.url || '';
  }
  return '';
}

function parseBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (value === null || value === undefined) return false;
  return ['true', 'yes', 'y', '1', 'featured'].includes(String(value).trim().toLowerCase());
}

function parseAvailability(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'boolean') return value;
  const v = String(value).trim().toLowerCase();
  if (UNAVAILABLE_VALUES.includes(v)) return false;
  if (AVAILABLE_VALUES.includes(v)) return true;
  return true;
}

function toText(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) return value.map((item) => String(item)).join(', ');
  return String(value).trim();
}

export function mapRecord(record: AirtableRecord): Product | null {
  const fields = record.fields ?? {};
  const category = normalizeCategory(getField(fields, 'category'));
  if (!category) return null;

  const name = toText(getField(fields, 'name')) || 'Untitled';
  const id = toText(getField(fields, 'id')) || record.id;
  const { weight, weightNumeric } = parseWeight(getField(fields, 'estimated-weight') ?? getField(fields, 'weight'));
  const description = toText(getField(fields, 'description') ?? getField(fields, 'shortdesc'));

  return {
    id,
    category,
    name,
    fullName: `${CATEGORY_SINGULARS[category]} «${name}»`,
    subtitle: toText(getField(fields, 'subtitle')),
    shortDesc: toText(getField(fields, 'shortdesc')) || description,
    description,
    metal: toText(getField(fields, 'metal')),
    gemstone: toText(getField(fields, 'gemstone')),
    gender: toText(getField(fields, 'gender')),
    weight,
    weightNumeric,
    sizeLabel: CATEGORY_SIZE_LABELS[category],
    sizes: parseSizes(getField(fields, 'size')),
    image: pickImage(getField(fields, 'image')),
    karat: toText(getField(fields, 'karat')),
    purity: toText(getField(fields, 'purity')),
    featured: parseBoolean(getField(fields, 'featured')),
    availability: parseAvailability(getField(fields, 'availability')),
  };
}

export async function fetchCatalogProducts(): Promise<Product[]> {
  const response = await fetch('/api/products', { headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new Error(`Catalog request failed (${response.status})`);
  }
  const data = (await response.json()) as { records?: AirtableRecord[]; error?: string };
  if (!Array.isArray(data.records)) {
    throw new Error(data.error || 'Malformed catalog response');
  }
  return data.records
    .map(mapRecord)
    .filter((product): product is Product => product !== null && product.availability !== false);
}
