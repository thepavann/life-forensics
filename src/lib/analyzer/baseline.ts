import type { NormalizedReceipt } from '../../types/receipt';

export interface BaselineWindow {
  label: 'historical' | 'recent';
  start: string;
  end: string;
  activeDays: number;
  totalSignals: number;
  dailyAverage: number;
  peakStartHour: number;
  peakEndHour: number;
}

export interface PersonalBaseline {
  historical: BaselineWindow;
  recent: BaselineWindow;
  deviationPercent: number;
  status: 'stable' | 'elevated' | 'reduced';
  evidenceDays: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function summarizeWindow(
  receipts: NormalizedReceipt[],
  startMs: number,
  endMs: number,
  label: BaselineWindow['label']
): BaselineWindow {
  const rows = receipts.filter(r => {
    const t = r.dateObj.getTime();
    return t >= startMs && t <= endMs;
  });

  const byDay = new Map<string, number>();
  const byHour = new Map<number, number>();
  for (let hour = 0; hour < 24; hour += 1) byHour.set(hour, 0);

  for (const r of rows) {
    const day = r.dateObj.toISOString().slice(0, 10);
    byDay.set(day, (byDay.get(day) || 0) + 1);
    const hour = r.dateObj.getUTCHours();
    byHour.set(hour, (byHour.get(hour) || 0) + 1);
  }

  const activeDays = byDay.size;
  const totalDays = Math.max(1, Math.floor((endMs - startMs) / DAY_MS) + 1);
  const peakHour = Array.from(byHour.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 0;
  const nextHour = (peakHour + 1) % 24;

  return {
    label,
    start: new Date(startMs).toISOString(),
    end: new Date(endMs).toISOString(),
    activeDays,
    totalSignals: rows.length,
    dailyAverage: rows.length / totalDays,
    peakStartHour: peakHour,
    peakEndHour: nextHour
  };
}

export function computePersonalBaseline(receipts: NormalizedReceipt[]): PersonalBaseline | null {
  if (receipts.length < 20) return null;

  const timestamps = receipts.map(r => r.dateObj.getTime()).sort((a, b) => a - b);
  const minMs = timestamps[0];
  const maxMs = timestamps[timestamps.length - 1];
  const spanMs = Math.max(DAY_MS, maxMs - minMs);
  const splitMs = minMs + spanMs * 0.8;

  const historical = summarizeWindow(receipts, minMs, Math.min(maxMs, splitMs), 'historical');
  const recent = summarizeWindow(receipts, Math.min(maxMs, splitMs + DAY_MS), maxMs, 'recent');
  const deviationPercent = historical.dailyAverage > 0
    ? ((recent.dailyAverage - historical.dailyAverage) / historical.dailyAverage) * 100
    : 0;

  return {
    historical,
    recent,
    deviationPercent,
    status: deviationPercent > 15 ? 'elevated' : deviationPercent < -15 ? 'reduced' : 'stable',
    evidenceDays: historical.activeDays + recent.activeDays
  };
}
