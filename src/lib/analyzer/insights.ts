import type { Connection, Discovery, NormalizedReceipt } from '../../types/receipt';

export function discoverPatterns(
  receipts: NormalizedReceipt[],
  connections: Connection[]
): Discovery[] {
  const discoveries: Discovery[] = [];

  const bySource = new Map<string, NormalizedReceipt[]>();
  const byDay = new Map<string, NormalizedReceipt[]>();
  receipts.forEach(r => {
    const source = String(r.metadata?.source || 'Imported records');
    const sourceRows = bySource.get(source) || [];
    sourceRows.push(r);
    bySource.set(source, sourceRows);
    const day = r.dateObj.toISOString().slice(0, 10);
    const dayRows = byDay.get(day) || [];
    dayRows.push(r);
    byDay.set(day, dayRows);
  });

  const confidenceLabel = (score: number) => score >= 90 ? 'HIGH' : score >= 75 ? 'MEDIUM' : 'LOW';
  const add = (d: Omit<Discovery, 'confidence' | 'confidenceLabel'>, score: number) => {
    d.confidence = Math.max(1, Math.min(99, Math.round(score)));
    d.confidenceLabel = confidenceLabel(d.confidence);
    discoveries.push(d);
  };

  // 1. Cross-source convergence: the most defensible "forensic" pattern in this demo.
  const multiSourceDays = Array.from(byDay.entries()).filter(([, rows]) => new Set(rows.map(r => r.metadata?.source)).size >= 2);
  const convergenceIds = multiSourceDays.flatMap(([, rows]) => rows.map(r => r.id)).slice(0, 160);
  const convergenceRate = receipts.length ? (multiSourceDays.length / byDay.size) * 100 : 0;
  add({
    id: 'disc-convergence',
    title: `${multiSourceDays.length.toLocaleString()} days contain signals from multiple source streams.`,
    explanation: `Independent source streams overlap on the same calendar dates, creating candidates for cross-source behavioral reconstruction. This is a correlation signal, not proof of causation.`,
    evidenceCount: multiSourceDays.length,
    involvedTypes: ['music', 'purchase'],
    receiptIds: convergenceIds,
    reasons: [
      'Indexed by calendar date before correlation',
      `${multiSourceDays.length.toLocaleString()} of ${byDay.size.toLocaleString()} active days contain 2+ source streams`,
      `${convergenceRate.toFixed(1)}% of active days show multi-source overlap`,
      'No raw payment-card or identity fields are required by the correlation layer'
    ],
    category: 'cross_chapter'
  }, Math.min(96, 72 + Math.min(20, convergenceRate)));

  // 2. Recurring music entity.
  const artistCounts = new Map<string, number>();
  receipts.filter(r => r.type === 'music' && r.metadata?.artist).forEach(r => {
    const artist = String(r.metadata.artist);
    artistCounts.set(artist, (artistCounts.get(artist) || 0) + Number(r.metadata?.plays || 1));
  });
  const topArtist = Array.from(artistCounts.entries()).sort((a, b) => b[1] - a[1])[0];
  if (topArtist) {
    const ids = receipts.filter(r => r.type === 'music' && String(r.metadata?.artist) === topArtist[0]).slice(0, 160).map(r => r.id);
    add({
      id: 'disc-artist',
      title: `${topArtist[0]} is a dominant recurring signal in the music archive.`,
      explanation: `${topArtist[1].toLocaleString()} recorded plays are represented by the daily Spotify summaries.`,
      evidenceCount: ids.length,
      involvedTypes: ['music'],
      receiptIds: ids,
      reasons: ['Source: spotify_history', 'Daily summaries retain the top three artists by play count', `Artist: ${topArtist[0]}`],
      category: 'entity_cluster'
    }, 91);
  }

  // 3. Weekly routine candidate.
  const weekdayCounts = new Map<number, number>();
  receipts.forEach(r => {
    const day = r.dateObj.getUTCDay();
    weekdayCounts.set(day, (weekdayCounts.get(day) || 0) + 1);
  });
  const weekdayTop = Array.from(weekdayCounts.entries()).sort((a, b) => b[1] - a[1])[0];
  if (weekdayTop) {
    const labels = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const share = weekdayTop[1] / receipts.length * 100;
    const ids = receipts.filter(r => r.dateObj.getUTCDay() === weekdayTop[0]).slice(0, 120).map(r => r.id);
    add({
      id: 'disc-routine',
      title: `${labels[weekdayTop[0]]} carries the highest signal density in the archive.`,
      explanation: `A weekday distribution check found ${weekdayTop[1].toLocaleString()} signals on ${labels[weekdayTop[0]]}. This is a routine candidate, not a claim about the user's behavior outside the supplied archive.`,
      evidenceCount: weekdayTop[1],
      involvedTypes: ['music', 'purchase'],
      receiptIds: ids,
      reasons: ['Computed from UTC calendar dates', `${share.toFixed(1)}% of all normalized signals fall on this weekday`, 'Compared against all seven weekday buckets'],
      category: 'behavioral_burst'
    }, Math.min(92, 70 + share));
  }

  // 4. Late-night purchase anomaly candidate.
  const purchases = receipts.filter(r => r.type === 'purchase');
  const late = purchases.filter(r => {
    const h = r.dateObj.getUTCHours();
    return h < 6;
  });
  if (late.length) {
    const rate = late.length / Math.max(1, purchases.length) * 100;
    const ids = late.slice(0, 120).map(r => r.id);
    add({
      id: 'disc-late-night',
      title: `${late.length.toLocaleString()} purchase signals occur between midnight and 06:00.`,
      explanation: `The archive contains a measurable late-night purchase cluster. LIFE//FORENSICS flags this as an anomaly candidate for inspection rather than declaring it abnormal for a person.`,
      evidenceCount: late.length,
      involvedTypes: ['purchase'],
      receiptIds: ids,
      reasons: [`${rate.toFixed(1)}% of purchase records fall in the 00:00–05:59 window`, 'Compared against every normalized purchase timestamp', 'Use the evidence trail before drawing a behavioral conclusion'],
      category: 'behavioral_burst'
    }, Math.min(94, 68 + rate));
  }

  // 5. Household category.
  const household = bySource.get('Daily Household Transactions') || [];
  const catCounts = new Map<string, number>();
  household.forEach(r => {
    const cat = String(r.metadata?.category || 'Other');
    catCounts.set(cat, (catCounts.get(cat) || 0) + 1);
  });
  const topCat = Array.from(catCounts.entries()).sort((a, b) => b[1] - a[1])[0];
  if (topCat) {
    const ids = household.filter(r => String(r.metadata?.category) === topCat[0]).slice(0, 120).map(r => r.id);
    add({
      id: 'disc-household',
      title: `${topCat[0]} is the most frequent household category.`,
      explanation: `${topCat[1].toLocaleString()} records in the household dataset are categorized as ${topCat[0]}.`,
      evidenceCount: topCat[1],
      involvedTypes: ['purchase'],
      receiptIds: ids,
      reasons: ['Source: Daily Household Transactions', `Category count: ${topCat[1]}`, 'Count reflects transaction records, not monetary value'],
      category: 'location_recurrence'
    }, 86);
  }

  // 6. Dataset fraud labels — explicitly not independent detection.
  const india = bySource.get('Augmented IndiaTransactMultiFacet2024') || [];
  const flagged = india.filter(r => r.metadata?.is_fraud_flagged === true);
  if (india.length) {
    const ids = flagged.slice(0, 120).map(r => r.id);
    add({
      id: 'disc-flags',
      title: `${flagged.length.toLocaleString()} imported transactions carry a source fraud label.`,
      explanation: 'This is the supplied dataset’s is_fraud field. LIFE//FORENSICS reports the source label and does not independently determine fraud.',
      evidenceCount: flagged.length,
      involvedTypes: ['purchase'],
      receiptIds: ids,
      reasons: ['Source: Augmented IndiaTransactMultiFacet2024', 'Field: is_fraud', `Flagged records: ${flagged.length.toLocaleString()}`, 'Sensitive identity/payment fields are excluded from the application layer'],
      category: 'behavioral_burst'
    }, 99);
  }

  // 7. Connection engine summary.
  const typeCounts = new Map<string, number>();
  connections.forEach(c => typeCounts.set(c.type, (typeCounts.get(c.type) || 0) + 1));
  const topConnection = Array.from(typeCounts.entries()).sort((a, b) => b[1] - a[1])[0];
  if (topConnection) {
    add({
      id: 'disc-connections',
      title: `${topConnection[1].toLocaleString()} ${topConnection[0]} links were synthesized.`,
      explanation: 'The indexed graph links nearby events, recurring locations and repeated entities without quadratic all-to-all comparison.',
      evidenceCount: topConnection[1],
      involvedTypes: ['music', 'purchase'],
      receiptIds: [],
      reasons: ['Scalable indexed connection engine', 'Same-day temporal neighbors', 'Repeated locations or artists'],
      category: 'cross_chapter'
    }, 94);
  }

  return discoveries.sort((a, b) => b.confidence - a.confidence);
}
