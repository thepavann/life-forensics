// src/lib/analyzer/chapters.ts
import type { NormalizedReceipt, Chapter, ReceiptType } from '../../types/receipt';

export function discoverChapters(receipts: NormalizedReceipt[]): Chapter[] {
  if (!receipts.length) return [];

  const years = Array.from(new Set(receipts.map(r => r.dateObj.getUTCFullYear()))).sort((a, b) => a - b);
  const chapters: Chapter[] = [];

  years.forEach((year, idx) => {
    const matchedReceipts = receipts.filter(r => r.dateObj.getUTCFullYear() === year);
    const start = new Date(Date.UTC(year, 0, 1));
    const end = new Date(Date.UTC(year, 11, 31, 23, 59, 59));

    const typeCounts: Partial<Record<ReceiptType, number>> = {};
    const places = new Set<string>();
    const entities = new Map<string, number>();

    matchedReceipts.forEach(r => {
      typeCounts[r.type] = (typeCounts[r.type] || 0) + 1;
      if (r.location) places.add(r.location);
      if (r.metadata?.artist) {
        const key = String(r.metadata.artist);
        entities.set(key, (entities.get(key) || 0) + 1);
      }
      if (r.metadata?.merchant) {
        const key = String(r.metadata.merchant);
        entities.set(key, (entities.get(key) || 0) + 1);
      }
    });

    const topEntityNames = Array.from(entities.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name]) => name);

    const sequenceTypes: ReceiptType[] = ['music', 'purchase', 'place', 'event', 'photo', 'message', 'note'];
    const sequenceFlow: { type: ReceiptType; label: string; receiptId: string }[] = [];
    sequenceTypes.forEach(type => {
      const candidate = matchedReceipts.find(r => r.type === type);
      if (candidate) sequenceFlow.push({ type, label: candidate.title, receiptId: candidate.id });
    });

    const dominantType = (Object.entries(typeCounts) as [ReceiptType, number][])
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'note';

    const sourceCounts = new Map<string, number>();
    matchedReceipts.forEach(r => {
      const source = String(r.metadata?.source || 'Imported records');
      sourceCounts.set(source, (sourceCounts.get(source) || 0) + 1);
      r.chapterId = `year-${year}`;
      r.chapterTitle = `The ${year} Record`;
    });

    const sourceSummary = Array.from(sourceCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([name, count]) => `${name} (${count})`)
      .join(' · ');

    chapters.push({
      id: `year-${year}`,
      number: String(idx + 1).padStart(2, '0'),
      title: `The ${year} Record`,
      subtitle: `${matchedReceipts.length.toLocaleString()} signals · ${dominantType} dominant`,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      dateRangeFormatted: `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} — ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
      receiptCount: matchedReceipts.length,
      typeCounts,
      keyPlaces: Array.from(places).slice(0, 4),
      keyEntities: topEntityNames,
      receipts: matchedReceipts,
      sequenceFlow,
      narrative: `The ${year} archive contains ${matchedReceipts.length.toLocaleString()} recorded signals. Primary sources: ${sourceSummary || 'Imported records'}.`
    });
  });

  return chapters;
}
