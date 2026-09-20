import React, { useMemo, useState } from 'react';
import { Activity, BrainCircuit, Database, Fingerprint, GitBranch, LockKeyhole, Search, ShieldCheck, Sparkles, Timeline, Zap } from 'lucide-react';
import type { ForensicsDataset } from '../lib/analyzer';

interface InvestigationViewProps { data: ForensicsDataset; onSelectReceipt: (id: string) => void; }

export const InvestigationView: React.FC<InvestigationViewProps> = ({ data, onSelectReceipt }) => {
  const { statistics, discoveries, receipts } = data;
  const [query, setQuery] = useState('');
  const maxHour = Math.max(...statistics.hourlyCounts.map(x => x.count), 1);
  const maxMonth = Math.max(...statistics.monthlyCounts.map(x => x.count), 1);
  const topDay = statistics.weekdayCounts[0];
  const sourceTotal = statistics.sourceStats.reduce((a, b) => a + b.count, 0) || 1;
  const recentMonths = statistics.monthlyCounts.slice(-24);
  const anomalyItems = useMemo(() => [
    { label: 'Late-night purchase cluster', value: statistics.lateNightPurchases, detail: `${((statistics.lateNightPurchases / Math.max(1, statistics.typeDistribution.purchase)) * 100).toFixed(1)}% of purchase signals occur before 06:00.` },
    { label: 'Multi-source convergence', value: statistics.multiSourceDays, detail: `${statistics.multiSourceDays.toLocaleString()} active days contain at least two source streams.` },
    { label: 'Source-labelled transactions', value: statistics.sourceFraudLabels, detail: 'Imported is_fraud labels only; this product does not independently classify fraud.' }
  ], [statistics]);

  const filteredDiscoveries = discoveries.filter(d => `${d.title} ${d.explanation} ${d.reasons.join(' ')}`.toLowerCase().includes(query.toLowerCase())).slice(0, 8);

  return <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
    <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-[#171722] via-[#101016] to-[#0b0b10] p-6 sm:p-10 overflow-hidden relative">
      <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="relative grid lg:grid-cols-[1.25fr_.75fr] gap-8 items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[.18em] uppercase text-amber-300"><Sparkles size={13}/> Investigation Console</div>
          <h1 className="mt-3 text-4xl sm:text-6xl font-extrabold tracking-tight">ASK YOUR DATA.</h1>
          <p className="mt-4 max-w-2xl text-zinc-400 leading-relaxed">A deterministic forensic layer over {statistics.totalReceipts.toLocaleString()} normalized signals. Search discoveries, inspect evidence, compare activity and trace how a finding was produced.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {['What changed over time?', 'Show unusual activity', 'Which sources overlap?', 'Explain this archive'].map(q => <button key={q} onClick={() => setQuery(q)} className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white hover:border-zinc-700">{q}</button>)}
          </div>
          <div className="mt-5 flex items-center gap-2 rounded-2xl border border-zinc-800 bg-black/20 px-4 py-3 max-w-2xl"><Search size={15} className="text-zinc-500"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search findings, evidence or source labels…" className="bg-transparent outline-none text-sm text-white w-full placeholder:text-zinc-600"/></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[[statistics.totalReceipts,'SIGNALS'],[statistics.multiSourceDays,'MULTI-SOURCE DAYS'],[statistics.uniquePlacesCount,'LOCATIONS'],[statistics.totalConnections,'CONNECTIONS']].map(([v,l])=><div key={l} className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5"><div className="text-2xl font-bold text-white">{Number(v).toLocaleString()}</div><div className="mt-1 text-[10px] font-mono tracking-widest text-zinc-500">{l}</div></div>)}
        </div>
      </div>
    </section>

    <section className="grid lg:grid-cols-3 gap-4">
      {anomalyItems.map((item, i) => <div key={item.label} className="glass-card rounded-2xl p-5"><div className="flex justify-between"><div className="text-xs font-mono uppercase tracking-wider text-zinc-500">{i===0?'ANOMALY CANDIDATE':i===1?'CORRELATION':'SOURCE LABEL'}</div><Zap size={15} className="text-amber-400"/></div><div className="mt-3 text-2xl font-bold text-white">{item.value.toLocaleString()}</div><div className="mt-1 text-sm font-medium text-zinc-200">{item.label}</div><p className="mt-2 text-xs leading-relaxed text-zinc-500">{item.detail}</p></div>)}
    </section>

    <section className="grid lg:grid-cols-2 gap-5">
      <div className="rounded-2xl border border-zinc-800 bg-[#111118] p-6">
        <div className="flex items-center justify-between"><div><div className="text-[10px] font-mono tracking-widest text-zinc-500">PERSONAL BASELINE</div><h2 className="text-xl font-bold mt-1">When the archive is active</h2></div><Activity size={18} className="text-emerald-400"/></div>
        <div className="mt-6"><div className="text-xs text-zinc-500 mb-2">24-hour activity density</div><div className="h-36 flex items-end gap-1">{statistics.hourlyCounts.map(x=><div key={x.hour} title={`${x.hour}:00 · ${x.count} signals`} className="flex-1 bg-zinc-700 hover:bg-amber-400 rounded-t-sm min-w-[3px]" style={{height:`${Math.max(4,(x.count/maxHour)*100)}%`}}/> )}</div><div className="flex justify-between text-[10px] font-mono text-zinc-600 mt-2"><span>00</span><span>06</span><span>12</span><span>18</span><span>23</span></div></div>
        <div className="mt-5 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800"><span className="text-xs text-zinc-500">Highest signal day</span><div className="text-lg font-semibold text-white mt-1">{topDay?.day || '—'} · {topDay?.count?.toLocaleString() || 0} signals</div><p className="text-xs text-zinc-500 mt-1">This is a distribution observation, not a statement about normal behavior outside the supplied archive.</p></div>
      </div>
      <div className="rounded-2xl border border-zinc-800 bg-[#111118] p-6">
        <div className="flex items-center justify-between"><div><div className="text-[10px] font-mono tracking-widest text-zinc-500">LIFE TIMELINE</div><h2 className="text-xl font-bold mt-1">Activity by month</h2></div><Timeline size={18} className="text-blue-400"/></div>
        <div className="mt-6 h-36 flex items-end gap-1">{recentMonths.map(x=><div key={x.month} title={`${x.month} · ${x.count} signals`} className="flex-1 bg-zinc-600 hover:bg-blue-400 rounded-t-sm min-w-[5px]" style={{height:`${Math.max(5,(x.count/maxMonth)*100)}%`}}/> )}</div>
        <div className="mt-3 flex justify-between text-[10px] font-mono text-zinc-600"><span>{recentMonths[0]?.month || '—'}</span><span>{recentMonths[Math.floor(recentMonths.length/2)]?.month || '—'}</span><span>{recentMonths.at(-1)?.month || '—'}</span></div>
      </div>
    </section>

    <section className="rounded-2xl border border-zinc-800 bg-[#111118] p-6">
      <div className="flex items-center gap-3"><GitBranch size={18} className="text-purple-400"/><div><div className="text-[10px] font-mono tracking-widest text-zinc-500">CROSS-SOURCE CORRELATION</div><h2 className="text-xl font-bold mt-1">Evidence graph</h2></div></div>
      <div className="mt-6 grid md:grid-cols-5 gap-3 items-center">
        {['Spotify','Transactions','Household','Time / Date','Discovery'].map((x,i)=><React.Fragment key={x}><div className={`rounded-xl border p-4 text-center ${i===4?'border-amber-400/30 bg-amber-400/5':'border-zinc-800 bg-zinc-950/40'}`}><div className="text-sm font-semibold">{x}</div><div className="text-[10px] text-zinc-500 mt-1">{i<3?`${statistics.sourceStats.find(s=>s.source.toLowerCase().includes(x.toLowerCase().split(' ')[0]))?.count?.toLocaleString() || 0} records`:'indexed signal'}</div></div>{i<4&&<div className="hidden md:block text-center text-zinc-700">→</div>}</React.Fragment>)}
      </div>
      <div className="mt-5 text-xs text-zinc-500">{statistics.multiSourceDays.toLocaleString()} active dates contain at least two source streams. The engine uses shared dates and indexed entities to generate candidates; correlation does not establish causation.</div>
    </section>

    <section className="grid lg:grid-cols-[1.2fr_.8fr] gap-5">
      <div className="rounded-2xl border border-zinc-800 bg-[#111118] p-6"><div className="flex items-center gap-3"><BrainCircuit size={18} className="text-amber-400"/><div><div className="text-[10px] font-mono tracking-widest text-zinc-500">WHY DID YOU FIND THIS?</div><h2 className="text-xl font-bold mt-1">Explainable discoveries</h2></div></div><div className="mt-5 space-y-3">{filteredDiscoveries.map(d=><button key={d.id} onClick={()=>d.receiptIds[0]&&onSelectReceipt(d.receiptIds[0])} className="w-full text-left rounded-xl border border-zinc-800 bg-zinc-950/40 p-4 hover:border-zinc-700"><div className="flex items-start justify-between gap-4"><div><div className="text-sm font-semibold text-white">{d.title}</div><div className="text-xs text-zinc-500 mt-1">{d.evidenceCount.toLocaleString()} evidence · {d.confidence}% confidence · {d.confidenceLabel}</div></div><span className="text-[10px] font-mono text-emerald-300">TRACE</span></div><div className="mt-3 grid sm:grid-cols-2 gap-1 text-[11px] text-zinc-500">{d.reasons.slice(0,4).map(r=><div key={r}>• {r}</div>)}</div></button>)}</div></div>
      <div className="rounded-2xl border border-zinc-800 bg-[#111118] p-6"><div className="flex items-center gap-3"><LockKeyhole size={18} className="text-emerald-400"/><div><div className="text-[10px] font-mono tracking-widest text-zinc-500">PRIVACY CENTER</div><h2 className="text-xl font-bold mt-1">Data trust layer</h2></div></div><div className="mt-5 space-y-3">{['PII excluded from the UI','Payment-card fields excluded','Coordinates excluded','Raw source labels retained only when useful','Evidence shown before interpretation'].map(x=><div key={x} className="flex gap-3 items-center rounded-xl bg-zinc-950/50 border border-zinc-800 p-3 text-xs text-zinc-300"><ShieldCheck size={15} className="text-emerald-400 shrink-0"/>{x}</div>)}</div><div className="mt-5 text-xs text-zinc-600">This interface is designed around the supplied normalized archive. It does not claim identity reconstruction or independent fraud detection.</div></div>
    </section>

    <section className="rounded-2xl border border-zinc-800 bg-[#0d0d12] p-6"><div className="flex items-center gap-3"><Database size={18} className="text-blue-400"/><div><div className="text-[10px] font-mono tracking-widest text-zinc-500">DATA TRUST</div><h2 className="text-xl font-bold mt-1">Source health</h2></div></div><div className="mt-5 grid md:grid-cols-3 gap-3">{statistics.sourceStats.map(s=><div key={s.source} className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4"><div className="text-sm font-semibold text-white truncate">{s.source}</div><div className="mt-3 text-2xl font-bold">{s.count.toLocaleString()}</div><div className="text-[10px] font-mono text-zinc-600 mt-1">{((s.count/sourceTotal)*100).toFixed(1)}% OF NORMALIZED SIGNALS</div><div className="mt-3 text-[11px] text-zinc-500">{s.start} → {s.end}</div></div>)}</div></section>

    <section className="rounded-2xl border border-zinc-800 bg-gradient-to-r from-[#12121a] to-[#0c0c11] p-6 sm:p-8"><div className="grid md:grid-cols-6 gap-4 items-center text-center">{[['DATA SOURCES',Database],['PRIVACY FILTER',LockKeyhole],['NORMALIZATION',Fingerprint],['CORRELATION',GitBranch],['FORENSIC ENGINE',BrainCircuit],['LIFE GRAPH',Activity]].map(([label,Icon])=><div key={String(label)} className="relative"><Icon size={19} className="mx-auto text-zinc-400"/><div className="mt-2 text-[10px] font-mono tracking-widest text-zinc-500">{String(label)}</div></div>)}</div><div className="mt-6 text-center text-xs text-zinc-600">Fragmented traces → privacy filtering → behavioral correlation → explainable discoveries → personal life graph</div></section>
  </div>;
};
