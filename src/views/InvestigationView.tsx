import React, { useMemo, useState } from 'react';
import {
  Activity, BrainCircuit, Database, Fingerprint, GitBranch, LockKeyhole,
  Search, ShieldCheck, Sparkles, Timeline, Zap
} from 'lucide-react';
import type { ForensicsDataset } from '../lib/analyzer';
import { answerInvestigationQuery } from '../lib/analyzer/queryEngine';

interface InvestigationViewProps {
  data: ForensicsDataset;
  onSelectReceipt: (id: string) => void;
}

const QUICK_QUERIES = [
  'What changed over time?',
  'Show unusual activity',
  'Which sources overlap?',
  'Explain this archive'
];

function formatHour(hour: number) {
  return String(hour).padStart(2, '0') + ':00';
}

export const InvestigationView: React.FC<InvestigationViewProps> = ({ data, onSelectReceipt }) => {
  const { statistics, discoveries, baseline } = data;
  const [query, setQuery] = useState('');
  const maxHour = Math.max(...statistics.hourlyCounts.map(x => x.count), 1);
  const maxMonth = Math.max(...statistics.monthlyCounts.map(x => x.count), 1);
  const topDay = statistics.weekdayCounts[0];
  const sourceTotal = statistics.sourceStats.reduce((a, b) => a + b.count, 0) || 1;
  const recentMonths = statistics.monthlyCounts.slice(-24);

  const anomalyItems = useMemo(() => [
    {
      label: 'Late-night purchase cluster',
      value: statistics.lateNightPurchases,
      detail: ((statistics.lateNightPurchases / Math.max(1, statistics.typeDistribution.purchase)) * 100).toFixed(1) + '% of purchase signals occur before 06:00.'
    },
    {
      label: 'Multi-source convergence',
      value: statistics.multiSourceDays,
      detail: statistics.multiSourceDays.toLocaleString() + ' active days contain at least two source streams.'
    },
    {
      label: 'Source-labelled transactions',
      value: statistics.sourceFraudLabels,
      detail: 'Imported is_fraud labels only; this product does not independently classify fraud.'
    }
  ], [statistics]);

  const answer = useMemo(
    () => answerInvestigationQuery(query, data.receipts, statistics, discoveries, baseline),
    [query, data.receipts, statistics, discoveries, baseline]
  );

  const peakBaseline = baseline
    ? formatHour(baseline.historical.peakStartHour) + '–' + formatHour(baseline.historical.peakEndHour)
    : 'Not enough historical data';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-[#171722] via-[#101016] to-[#0b0b10] p-6 sm:p-10 overflow-hidden relative">
        <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="relative grid lg:grid-cols-[1.25fr_.75fr] gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[.18em] uppercase text-amber-300"><Sparkles size={13} /> Investigation Console</div>
            <h1 className="mt-3 text-4xl sm:text-6xl font-extrabold tracking-tight">ASK YOUR DATA.</h1>
            <p className="mt-4 max-w-2xl text-zinc-400 leading-relaxed">
              A deterministic forensic layer over {statistics.totalReceipts.toLocaleString()} normalized signals. Query change, overlap and anomaly candidates, then trace the supporting evidence.
            </p>

            <div className="mt-6 flex flex-wrap gap-2" aria-label="Investigation questions">
              {QUICK_QUERIES.map(q => (
                <button
                  key={q}
                  type="button"
                  aria-pressed={query === q}
                  onClick={() => setQuery(q)}
                  className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white hover:border-zinc-700"
                >
                  {q}
                </button>
              ))}
            </div>

            <label className="mt-5 flex items-center gap-2 rounded-2xl border border-zinc-800 bg-black/20 px-4 py-3 max-w-2xl">
              <Search size={15} className="text-zinc-500" aria-hidden="true" />
              <span className="sr-only">Ask the evidence layer</span>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Ask about changes, anomalies, sources or search evidence…"
                aria-label="Ask the evidence layer"
                className="bg-transparent outline-none text-sm text-white w-full placeholder:text-zinc-600"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              [statistics.totalReceipts, 'SIGNALS'],
              [statistics.multiSourceDays, 'MULTI-SOURCE DAYS'],
              [statistics.uniquePlacesCount, 'LOCATIONS'],
              [statistics.totalConnections, 'CONNECTIONS']
            ].map(([value, label]) => (
              <div key={String(label)} className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
                <div className="text-2xl font-bold text-white">{Number(value).toLocaleString()}</div>
                <div className="mt-1 text-[10px] font-mono tracking-widest text-zinc-500">{String(label)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {answer && (
        <section className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.04] p-6" aria-live="polite">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[10px] font-mono tracking-widest text-amber-300 uppercase">Deterministic answer · {answer.intent}</div>
              <h2 className="text-2xl font-bold mt-1 text-white">{answer.title}</h2>
              <p className="mt-2 text-sm text-zinc-400 max-w-3xl">{answer.summary}</p>
            </div>
            {answer.receiptIds[0] && (
              <button
                type="button"
                onClick={() => onSelectReceipt(answer.receiptIds[0])}
                className="shrink-0 px-3 py-2 rounded-xl bg-white text-zinc-950 text-xs font-semibold hover:bg-zinc-200"
              >
                Inspect evidence
              </button>
            )}
          </div>
          {answer.metrics.length > 0 && (
            <div className="mt-5 grid sm:grid-cols-3 gap-3">
              {answer.metrics.map(metric => (
                <div key={metric.label} className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-600">{metric.label}</div>
                  <div className="mt-1 text-lg font-semibold text-white">{metric.value}</div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 text-[11px] text-zinc-600">Answer source: normalized records + deterministic analysis rules. No generative model is required for this result.</div>
        </section>
      )}

      <section className="grid lg:grid-cols-3 gap-4">
        {anomalyItems.map((item, index) => (
          <div key={item.label} className="glass-card rounded-2xl p-5">
            <div className="flex justify-between">
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-500">{index === 0 ? 'ANOMALY CANDIDATE' : index === 1 ? 'CORRELATION' : 'SOURCE LABEL'}</div>
              <Zap size={15} className="text-amber-400" aria-hidden="true" />
            </div>
            <div className="mt-3 text-2xl font-bold text-white">{item.value.toLocaleString()}</div>
            <div className="mt-1 text-sm font-medium text-zinc-200">{item.label}</div>
            <p className="mt-2 text-xs leading-relaxed text-zinc-500">{item.detail}</p>
          </div>
        ))}
      </section>

      <section className="grid lg:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-zinc-800 bg-[#111118] p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono tracking-widest text-zinc-500">PERSONAL BASELINE</div>
              <h2 className="text-xl font-bold mt-1">Historical vs recent activity</h2>
            </div>
            <Activity size={18} className="text-emerald-400" aria-hidden="true" />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
              <div className="text-[10px] uppercase tracking-widest text-zinc-600">Historical</div>
              <div className="mt-2 text-lg font-semibold text-white">{baseline?.historical.dailyAverage.toFixed(1) || '—'} / day</div>
              <div className="text-xs text-zinc-500 mt-1">Peak {peakBaseline}</div>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
              <div className="text-[10px] uppercase tracking-widest text-zinc-600">Recent</div>
              <div className="mt-2 text-lg font-semibold text-white">{baseline?.recent.dailyAverage.toFixed(1) || '—'} / day</div>
              <div className="text-xs text-zinc-500 mt-1">{baseline ? (baseline.deviationPercent >= 0 ? '+' : '') + baseline.deviationPercent.toFixed(1) + '% vs historical' : 'Not enough data'}</div>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <span className="text-xs text-zinc-500">Baseline status</span>
            <div className="text-lg font-semibold text-white mt-1 uppercase">{baseline?.status || 'unavailable'}</div>
            <p className="text-xs text-zinc-500 mt-1">
              Compared first 80% of the archive with the most recent 20%. This is a personal-history deviation signal, not a population benchmark.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#111118] p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono tracking-widest text-zinc-500">LIFE TIMELINE</div>
              <h2 className="text-xl font-bold mt-1">Activity by month</h2>
            </div>
            <Timeline size={18} className="text-blue-400" aria-hidden="true" />
          </div>
          <div className="mt-6 h-36 flex items-end gap-1" aria-label="Activity by month chart">
            {recentMonths.map(point => (
              <div
                key={point.month}
                title={point.month + ' · ' + point.count + ' signals'}
                aria-label={point.month + ': ' + point.count + ' signals'}
                className="flex-1 bg-zinc-600 hover:bg-blue-400 rounded-t-sm min-w-[5px]"
                style={{ height: Math.max(5, (point.count / maxMonth) * 100) + '%' }}
              />
            ))}
          </div>
          <div className="mt-3 flex justify-between text-[10px] font-mono text-zinc-600">
            <span>{recentMonths[0]?.month || '—'}</span>
            <span>{recentMonths[Math.floor(recentMonths.length / 2)]?.month || '—'}</span>
            <span>{recentMonths.at(-1)?.month || '—'}</span>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-[#111118] p-6">
        <div className="flex items-center gap-3">
          <GitBranch size={18} className="text-purple-400" aria-hidden="true" />
          <div>
            <div className="text-[10px] font-mono tracking-widest text-zinc-500">CROSS-SOURCE CORRELATION</div>
            <h2 className="text-xl font-bold mt-1">Evidence graph</h2>
          </div>
        </div>
        <div className="mt-6 grid md:grid-cols-5 gap-3 items-center">
          {['Spotify', 'Transactions', 'Household', 'Time / Date', 'Discovery'].map((source, index) => (
            <React.Fragment key={source}>
              <div className={`rounded-xl border p-4 text-center ${index === 4 ? 'border-amber-400/30 bg-amber-400/5' : 'border-zinc-800 bg-zinc-950/40'}`}>
                <div className="text-sm font-semibold">{source}</div>
                <div className="text-[10px] text-zinc-500 mt-1">
                  {index < 3
                    ? (statistics.sourceStats.find(s => s.source.toLowerCase().includes(source.toLowerCase().split(' ')[0]))?.count || 0).toLocaleString() + ' records'
                    : 'indexed signal'}
                </div>
              </div>
              {index < 4 && <div className="hidden md:block text-center text-zinc-700" aria-hidden="true">→</div>}
            </React.Fragment>
          ))}
        </div>
        <div className="mt-5 text-xs text-zinc-500">
          {statistics.multiSourceDays.toLocaleString()} active dates contain at least two source streams. Shared dates and indexed entities generate candidates; correlation does not establish causation.
        </div>
      </section>

      <section className="grid lg:grid-cols-[1.2fr_.8fr] gap-5">
        <div className="rounded-2xl border border-zinc-800 bg-[#111118] p-6">
          <div className="flex items-center gap-3">
            <BrainCircuit size={18} className="text-amber-400" aria-hidden="true" />
            <div>
              <div className="text-[10px] font-mono tracking-widest text-zinc-500">WHY DID YOU FIND THIS?</div>
              <h2 className="text-xl font-bold mt-1">Explainable discoveries</h2>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {discoveries.slice(0, 8).map(discovery => (
              <button
                key={discovery.id}
                type="button"
                onClick={() => discovery.receiptIds[0] && onSelectReceipt(discovery.receiptIds[0])}
                aria-label={'Inspect evidence for ' + discovery.title}
                className="w-full text-left rounded-xl border border-zinc-800 bg-zinc-950/40 p-4 hover:border-zinc-700"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-white">{discovery.title}</div>
                    <div className="text-xs text-zinc-500 mt-1">{discovery.evidenceCount.toLocaleString()} evidence · {discovery.confidence}% confidence · {discovery.confidenceLabel}</div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-300">TRACE</span>
                </div>
                <div className="mt-3 grid sm:grid-cols-2 gap-1 text-[11px] text-zinc-500">
                  {discovery.reasons.slice(0, 4).map(reason => <div key={reason}>• {reason}</div>)}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#111118] p-6">
          <div className="flex items-center gap-3">
            <LockKeyhole size={18} className="text-emerald-400" aria-hidden="true" />
            <div>
              <div className="text-[10px] font-mono tracking-widest text-zinc-500">PRIVACY CENTER</div>
              <h2 className="text-xl font-bold mt-1">Data trust layer</h2>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {[
              'PII excluded from the UI',
              'Payment-card fields excluded',
              'Coordinates excluded',
              'Raw source labels retained only when useful',
              'Evidence shown before interpretation'
            ].map(item => (
              <div key={item} className="flex gap-3 items-center rounded-xl bg-zinc-950/50 border border-zinc-800 p-3 text-xs text-zinc-300">
                <ShieldCheck size={15} className="text-emerald-400 shrink-0" aria-hidden="true" />
                {item}
              </div>
            ))}
          </div>
          <div className="mt-5 text-xs text-zinc-600">This interface is designed around the supplied normalized archive. It does not claim identity reconstruction or independent fraud detection.</div>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-[#0d0d12] p-6">
        <div className="flex items-center gap-3">
          <Database size={18} className="text-blue-400" aria-hidden="true" />
          <div>
            <div className="text-[10px] font-mono tracking-widest text-zinc-500">DATA TRUST</div>
            <h2 className="text-xl font-bold mt-1">Source health</h2>
          </div>
        </div>
        <div className="mt-5 grid md:grid-cols-3 gap-3">
          {statistics.sourceStats.map(source => (
            <div key={source.source} className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
              <div className="text-sm font-semibold text-white truncate">{source.source}</div>
              <div className="mt-3 text-2xl font-bold">{source.count.toLocaleString()}</div>
              <div className="text-[10px] font-mono text-zinc-600 mt-1">{((source.count / sourceTotal) * 100).toFixed(1)}% OF NORMALIZED SIGNALS</div>
              <div className="mt-3 text-[11px] text-zinc-500">{source.start} → {source.end}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-gradient-to-r from-[#12121a] to-[#0c0c11] p-6 sm:p-8">
        <div className="grid md:grid-cols-6 gap-4 items-center text-center">
          {[
            ['DATA SOURCES', Database],
            ['PRIVACY FILTER', LockKeyhole],
            ['NORMALIZATION', Fingerprint],
            ['CORRELATION', GitBranch],
            ['FORENSIC ENGINE', BrainCircuit],
            ['LIFE GRAPH', Activity]
          ].map(([label, Icon]) => (
            <div key={String(label)} className="relative">
              <Icon size={19} className="mx-auto text-zinc-400" aria-hidden="true" />
              <div className="mt-2 text-[10px] font-mono tracking-widest text-zinc-500">{String(label)}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center text-xs text-zinc-600">Fragmented traces → privacy filtering → behavioral correlation → explainable discoveries → personal life graph</div>
      </section>
    </div>
  );
};
