// src/lib/analyzer/statistics.ts
import type { NormalizedReceipt, LifeStatistics, ActivityPulsePoint, ReceiptType, Chapter, Connection } from '../../types/receipt';

export function computeStatistics(
  receipts: NormalizedReceipt[],
  chapters: Chapter[],
  connections: Connection[]
): LifeStatistics {
  const totalReceipts = receipts.length;
  const startDate = receipts.length ? receipts[0].dateFormatted : 'N/A';
  const endDate = receipts.length ? receipts[receipts.length - 1].dateFormatted : 'N/A';
  const daysSpan = receipts.length
    ? Math.max(1, Math.round((receipts[receipts.length - 1].dateObj.getTime() - receipts[0].dateObj.getTime()) / 86400000))
    : 0;

  const typeDistribution: Record<ReceiptType, number> = {
    music: 0, movie: 0, place: 0, purchase: 0, photo: 0, message: 0, search: 0, event: 0, note: 0
  };

  const placesSet = new Set<string>();
  const entityCounts = new Map<string, number>();
  const pulseBuckets = new Map<string, { label: string; receipts: NormalizedReceipt[] }>();
  const sourceBuckets = new Map<string, NormalizedReceipt[]>();
  const weekdayCounts = new Map<number, number>();
  const hourlyCounts = new Map<number, number>();
  const monthlyCounts = new Map<string, number>();

  for (const r of receipts) {
    typeDistribution[r.type]++;
    if (r.location) placesSet.add(r.location);

    for (const key of ['artist', 'merchant']) {
      if (r.metadata?.[key]) {
        const name = String(r.metadata[key]);
        entityCounts.set(name, (entityCounts.get(name) || 0) + Number(r.metadata?.plays || 1));
      }
    }

    const source = String(r.metadata?.source || 'Imported records');
    const sourceRows = sourceBuckets.get(source) || [];
    sourceRows.push(r);
    sourceBuckets.set(source, sourceRows);
    const weekday = r.dateObj.getUTCDay();
    weekdayCounts.set(weekday, (weekdayCounts.get(weekday) || 0) + 1);
    const hour = r.dateObj.getUTCHours();
    hourlyCounts.set(hour, (hourlyCounts.get(hour) || 0) + 1);
    const monthKey = `${r.dateObj.getUTCFullYear()}-${String(r.dateObj.getUTCMonth() + 1).padStart(2, '0')}`;
    monthlyCounts.set(monthKey, (monthlyCounts.get(monthKey) || 0) + 1);

    const d = new Date(Date.UTC(r.dateObj.getUTCFullYear(), r.dateObj.getUTCMonth(), r.dateObj.getUTCDate()));
    const key = d.toISOString().slice(0, 10);
    if (!pulseBuckets.has(key)) {
      pulseBuckets.set(key, { label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }), receipts: [] });
    }
    pulseBuckets.get(key)!.receipts.push(r);
  }

  const topEntities = Array.from(entityCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const activityPulse: ActivityPulsePoint[] = Array.from(pulseBuckets.entries()).map(([date, b]) => {
    const tCounts: Partial<Record<ReceiptType, number>> = {};
    b.receipts.forEach(r => { tCounts[r.type] = (tCounts[r.type] || 0) + 1; });
    const dominantTypes = (Object.entries(tCounts) as [ReceiptType, number][])
      .sort((a, b) => b[1] - a[1]).slice(0, 3).map(([type]) => type);
    return { date, label: b.label, count: b.receipts.length, dominantTypes, receiptIds: b.receipts.map(r => r.id) };
  });

  const days = new Map<string, Set<string>>();
  receipts.forEach(r => {
    const day = r.dateObj.toISOString().slice(0, 10);
    const set = days.get(day) || new Set<string>();
    set.add(String(r.metadata?.source || 'Imported records'));
    days.set(day, set);
  });
  const multiSourceDays = Array.from(days.values()).filter(s => s.size >= 2).length;
  const lateNightPurchases = receipts.filter(r => r.type === 'purchase' && r.dateObj.getUTCHours() < 6).length;
  const sourceFraudLabels = receipts.filter(r => r.metadata?.is_fraud_flagged === true).length;
  const weekdayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const sourceStats = Array.from(sourceBuckets.entries()).map(([source, rows]) => ({
    source, count: rows.length, start: rows[0]?.dateFormatted || 'N/A', end: rows[rows.length - 1]?.dateFormatted || 'N/A'
  })).sort((a,b) => b.count-a.count);

  return {
    totalReceipts,
    dateRange: { start: startDate, end: endDate, daysSpan },
    typeDistribution,
    uniquePlacesCount: placesSet.size,
    uniquePlaces: Array.from(placesSet),
    totalConnections: connections.length,
    totalChapters: chapters.length,
    topEntities,
    activityPulse,
    sourceStats,
    weekdayCounts: Array.from(weekdayCounts.entries()).map(([day, count]) => ({ day: weekdayNames[day], count })).sort((a,b) => b.count-a.count),
    hourlyCounts: Array.from(hourlyCounts.entries()).map(([hour, count]) => ({ hour, count })).sort((a,b) => a.hour-b.hour),
    monthlyCounts: Array.from(monthlyCounts.entries()).map(([month, count]) => ({ month, count })).sort((a,b) => a.month.localeCompare(b.month)),
    multiSourceDays,
    lateNightPurchases,
    sourceFraudLabels
  };
}
