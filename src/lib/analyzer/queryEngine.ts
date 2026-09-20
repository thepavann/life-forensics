import type { Discovery, NormalizedReceipt } from '../../types/receipt';
import type { LifeStatistics } from './statistics';
import type { PersonalBaseline } from './baseline';

export interface InvestigationAnswer {
  intent: 'change' | 'unusual' | 'overlap' | 'explain' | 'search';
  title: string;
  summary: string;
  metrics: { label: string; value: string }[];
  receiptIds: string[];
}

export function answerInvestigationQuery(
  query: string,
  receipts: NormalizedReceipt[],
  statistics: LifeStatistics,
  discoveries: Discovery[],
  baseline: PersonalBaseline | null
): InvestigationAnswer | null {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return null;

  if (normalized.includes('change') || normalized.includes('over time')) {
    const metrics = baseline ? [
      { label: 'Historical daily avg', value: baseline.historical.dailyAverage.toFixed(1) },
      { label: 'Recent daily avg', value: baseline.recent.dailyAverage.toFixed(1) },
      { label: 'Deviation', value: (baseline.deviationPercent >= 0 ? '+' : '') + baseline.deviationPercent.toFixed(1) + '%' }
    ] : [
      { label: 'Active days', value: statistics.dateRange.daysSpan.toLocaleString() },
      { label: 'Monthly samples', value: statistics.monthlyCounts.length.toLocaleString() }
    ];
    return {
      intent: 'change',
      title: 'Change over time',
      summary: baseline
        ? 'Recent activity averages ' + baseline.recent.dailyAverage.toFixed(1) + ' signals/day versus ' + baseline.historical.dailyAverage.toFixed(1) + ' historically.'
        : 'The archive spans ' + statistics.dateRange.daysSpan.toLocaleString() + ' days with measurable monthly activity.',
      metrics,
      receiptIds: receipts.slice(-120).map(r => r.id)
    };
  }

  if (normalized.includes('unusual') || normalized.includes('anomal')) {
    const candidates = discoveries.filter(d => d.category === 'behavioral_burst' || d.category === 'cross_chapter');
    return {
      intent: 'unusual',
      title: 'Anomaly candidates',
      summary: candidates.length
        ? candidates.length + ' evidence-backed anomaly/correlation candidates are available for inspection.'
        : 'No anomaly candidate is currently available in the implemented evidence model.',
      metrics: candidates.slice(0, 3).map(d => ({ label: d.confidenceLabel || 'confidence', value: d.confidence + '%' })),
      receiptIds: candidates.flatMap(d => d.receiptIds).slice(0, 120)
    };
  }

  if (normalized.includes('overlap') || normalized.includes('source')) {
    const discovery = discoveries.find(d => d.id === 'disc-convergence');
    return {
      intent: 'overlap',
      title: 'Cross-source overlap',
      summary: statistics.multiSourceDays.toLocaleString() + ' active dates contain at least two source streams.',
      metrics: [
        { label: 'Multi-source days', value: statistics.multiSourceDays.toLocaleString() },
        { label: 'Sources', value: statistics.sourceStats.length.toLocaleString() }
      ],
      receiptIds: discovery?.receiptIds || receipts.slice(0, 120).map(r => r.id)
    };
  }

  if (normalized.includes('explain') || normalized.includes('archive')) {
    return {
      intent: 'explain',
      title: 'Archive overview',
      summary: statistics.totalReceipts.toLocaleString() + ' normalized signals across ' + statistics.sourceStats.length + ' source streams, connected through deterministic temporal, spatial and entity rules.',
      metrics: [
        { label: 'Signals', value: statistics.totalReceipts.toLocaleString() },
        { label: 'Connections', value: statistics.totalConnections.toLocaleString() },
        { label: 'Locations', value: statistics.uniquePlacesCount.toLocaleString() }
      ],
      receiptIds: receipts.slice(0, 120).map(r => r.id)
    };
  }

  const matching = receipts.filter(r => {
    const haystack = (r.title + ' ' + r.description + ' ' + (r.location || '') + ' ' + r.tags.join(' ')).toLowerCase();
    return haystack.includes(normalized);
  });

  return {
    intent: 'search',
    title: matching.length ? 'Evidence search' : 'No direct evidence match',
    summary: matching.length
      ? matching.length.toLocaleString() + ' normalized records matched the query text.'
      : 'No normalized record matched the query text. Try a question about change, unusual activity, source overlap, or the archive.',
    metrics: [{ label: 'Matches', value: matching.length.toLocaleString() }],
    receiptIds: matching.slice(0, 120).map(r => r.id)
  };
}
