// src/lib/analyzer/normalizer.ts
import type { RawReceipt, NormalizedReceipt, ReceiptType } from '../../types/receipt';

const VALID_TYPES: Set<ReceiptType> = new Set([
  'music',
  'movie',
  'place',
  'purchase',
  'photo',
  'message',
  'search',
  'event',
  'note'
]);

export function normalizeReceipt(raw: RawReceipt): NormalizedReceipt {
  const rawType = (raw.type || '').toLowerCase().trim();
  const type: ReceiptType = VALID_TYPES.has(rawType as ReceiptType)
    ? (rawType as ReceiptType)
    : 'note';

  let dateObj = new Date(raw.timestamp);
  if (isNaN(dateObj.getTime())) {
    dateObj = new Date('2026-01-01T00:00:00Z');
  }

  const dateFormatted = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const timeFormatted = dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const title = (raw.title && raw.title.trim()) || 'Untitled Fragment';
  const description = (raw.description && raw.description.trim()) || 'No narrative detail recorded.';
  const location = raw.location && raw.location.trim() ? raw.location.trim() : undefined;
  const metadata = raw.metadata && typeof raw.metadata === 'object' ? { ...raw.metadata } : {};

  const tags: string[] = Array.isArray(raw.tags)
    ? Array.from(new Set(raw.tags.map(t => String(t).toLowerCase().trim()).filter(Boolean)))
    : [];

  return {
    id: raw.id || `REC-${Math.random().toString(36).slice(2, 9)}`,
    type,
    title,
    timestamp: dateObj.toISOString(),
    dateObj,
    dateFormatted,
    timeFormatted,
    location,
    description,
    metadata,
    tags
  };
}

export function normalizeAllReceipts(rawList: RawReceipt[]): NormalizedReceipt[] {
  if (!Array.isArray(rawList)) return [];
  const normalized = rawList.map(normalizeReceipt);
  return normalized.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
}
