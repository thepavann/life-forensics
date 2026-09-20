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

function sanitizeMetadata(metadata: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(metadata).filter(([key]) => !SENSITIVE_KEYS.has(key.toLowerCase()))
  );
}

export function normalizeReceipt(raw: RawReceipt): NormalizedReceipt {
  const rawType = (raw.type || '').toLowerCase().trim();
  const type: ReceiptType = VALID_TYPES.has(rawType as ReceiptType)
    ? (rawType as ReceiptType)
    : 'note';

  let dateObj = new Date(raw.timestamp);
  if (Number.isNaN(dateObj.getTime())) {
    dateObj = new Date('2026-01-01T00:00:00Z');
  }

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
    id: raw.id || 'REC-' + Math.random().toString(36).slice(2, 9),
    type, title, timestamp: dateObj.toISOString(), dateObj, dateFormatted, timeFormatted,
    location, description, metadata, tags
  };
}

export function normalizeAllReceipts(rawList: RawReceipt[]): NormalizedReceipt[] {
  if (!Array.isArray(rawList)) return [];
  return rawList.map(normalizeReceipt).sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
}