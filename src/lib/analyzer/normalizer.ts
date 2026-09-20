// src/lib/analyzer/normalizer.ts
import type { RawReceipt, NormalizedReceipt, ReceiptType } from '../../types/receipt';

const VALID_TYPES: Set<ReceiptType> = new Set([
  'music', 'movie', 'place', 'purchase', 'photo', 'message', 'search', 'event', 'note'
]);

const SENSITIVE_KEYS = new Set([
  'cc_num', 'card_number', 'cardnumber', 'first', 'last', 'gender', 'street',
  'address', 'dob', 'date_of_birth', 'customer_id', 'lat', 'long', 'latitude',
  'longitude', 'merch_lat', 'merch_long', 'merchant_lat', 'merchant_long',
  'email', 'phone', 'phone_number', 'ssn'
]);

function sanitizeValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([key]) => !SENSITIVE_KEYS.has(key.toLowerCase()))
        .map(([key, nested]) => [key, sanitizeValue(nested)])
    );
  }
  return value;
}

export function sanitizeMetadata(metadata: Record<string, any>): Record<string, any> {
  return sanitizeValue(metadata) as Record<string, any>;
}

export function normalizeReceipt(raw: RawReceipt): NormalizedReceipt {
  const rawType = (raw.type || '').toLowerCase().trim();
  const type: ReceiptType = VALID_TYPES.has(rawType as ReceiptType)
    ? (rawType as ReceiptType)
    : 'note';

  if (!raw.id || !String(raw.id).trim()) throw new Error('Receipt id is required.');
  const dateObj = new Date(raw.timestamp);
  if (Number.isNaN(dateObj.getTime())) throw new Error('Invalid receipt timestamp.');

  const dateFormatted = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeFormatted = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const title = (raw.title && raw.title.trim()) || 'Untitled Fragment';
  const description = (raw.description && raw.description.trim()) || 'No narrative detail recorded.';
  const location = raw.location && raw.location.trim() ? raw.location.trim() : undefined;
  const metadata = raw.metadata && typeof raw.metadata === 'object' ? sanitizeMetadata(raw.metadata) : {};
  const tags: string[] = Array.isArray(raw.tags)
    ? Array.from(new Set(raw.tags.map(t => String(t).toLowerCase().trim()).filter(Boolean)))
    : [];

  return {
    id: String(raw.id).trim(),
    type, title, timestamp: dateObj.toISOString(), dateObj, dateFormatted, timeFormatted,
    location, description, metadata, tags
  };
}

export function normalizeAllReceipts(rawList: RawReceipt[]): NormalizedReceipt[] {
  if (!Array.isArray(rawList)) return [];
  return rawList.map(normalizeReceipt).sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
}