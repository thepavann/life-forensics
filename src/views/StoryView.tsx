// src/views/StoryView.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Layers,
  MapPin,
  Compass,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';
import type { ForensicsDataset, Discovery, ActivityPulsePoint, ReceiptType } from '../types/receipt';
import { ReceiptIcon, getTypeBadgeClass } from '../components/ReceiptIcon';

interface StoryViewProps {
  data: ForensicsDataset;
  onSelectReceipt: (id: string) => void;
  onOpenChapter: (chapterId: string) => void;
  onOpenAtlasWithFocus?: (receiptIds: string[]) => void;
  onFindMissed: () => void;
  onSwitchTab: (tab: 'story' | 'atlas' | 'chapters' | 'receipts' | 'investigation') => void;
}

export const StoryView: React.FC<StoryViewProps> = ({
  data,
  onSelectReceipt,
  onOpenChapter,
  onOpenAtlasWithFocus,
  onFindMissed,
  onSwitchTab
}) => {
  const { statistics, discoveries, receiptMap } = data;
  const topPlaces = useMemo(() => {
    const counts = new Map<string, number>();
    data.receipts.forEach(r => { if (r.location) counts.set(r.location, (counts.get(r.location) || 0) + 1); });
    return Array.from(counts.entries()).sort((a,b) => b[1] - a[1]).slice(0, 4);
  }, [data.receipts]);
  const topArtist = statistics.topEntities[0]?.name || 'Recurring entity';
  const [hoveredPulse, setHoveredPulse] = useState<ActivityPulsePoint | null>(null);
  const [selectedDiscovery, setSelectedDiscovery] = useState<Discovery | null>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const depthRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = storyRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const sections = Array.from(root.querySelectorAll<HTMLElement>(':scope > section'));
    root.classList.add('lf-reveal-ready');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { root: null, threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const scene = depthRef.current;
    if (!scene || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const handlePointer = (event: PointerEvent) => {
      const rect = scene.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      scene.style.setProperty('--rx', `${(-y * 9).toFixed(2)}deg`);
      scene.style.setProperty('--ry', `${(x * 12).toFixed(2)}deg`);
      scene.style.setProperty('--mx', `${(x * 18).toFixed(2)}px`);
      scene.style.setProperty('--my', `${(y * 18).toFixed(2)}px`);
    };
    const reset = () => {
      scene.style.setProperty('--rx', '0deg');
      scene.style.setProperty('--ry', '0deg');
      scene.style.setProperty('--mx', '0px');
      scene.style.setProperty('--my', '0px');
    };
    scene.addEventListener('pointermove', handlePointer);
    scene.addEventListener('pointerleave', reset);
    return () => {
      scene.removeEventListener('pointermove', handlePointer);
      scene.removeEventListener('pointerleave', reset);
    };
  }, []);

  // The real dataset spans many years, so daily points would create thousands of
  // microscopic bars. Keep the raw data intact but aggregate the visual pulse by month.
  const displayPulse = useMemo<ActivityPulsePoint[]>(() => {
    const buckets = new Map<string, ActivityPulsePoint>();

    statistics.activityPulse.forEach((point) => {
      const monthKey = point.date.slice(0, 7);
      const existing = buckets.get(monthKey);
      if (!existing) {
        buckets.set(monthKey, {
          date: `${monthKey}-01`,
          label: new Date(`${monthKey}-01T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }),
          count: point.count,
          dominantTypes: [...point.dominantTypes],
          receiptIds: [...point.receiptIds]
        });
      } else {
        existing.count += point.count;
        existing.receiptIds.push(...point.receiptIds);
        existing.dominantTypes = Array.from(new Set([...existing.dominantTypes, ...point.dominantTypes])).slice(0, 3);
      }
    });

    return Array.from(buckets.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [statistics.activityPulse]);

  const maxPulseCount = Math.max(...displayPulse.map((p) => p.count), 1);

  return (
    <div ref={storyRef} className="lf-story max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-16">
      {/* Editorial + 3D investigation hero */}
      <section className="lf-hero-section lf-hero-3d space-y-4">
        <div className="lf-hero-copy">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono tracking-widest text-zinc-400 uppercase">
            <Sparkles size={12} className="text-amber-400" />
            <span>Local Forensic Synthesis</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            YOUR DIGITAL LIFE
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl font-editorial leading-relaxed">
            Between {statistics.dateRange.start} and {statistics.dateRange.end}, {statistics.totalReceipts} digital
            signals were captured across {statistics.uniquePlacesCount} physical locations. Individually unremarkable; together, a living topology of habits, places, and patterns.
          </p>
          <div className="lf-hero-meta">
            <span><b>{statistics.totalReceipts}</b> signals</span><i />
            <span><b>{statistics.totalConnections}</b> connections</span><i />
            <span><b>{statistics.totalChapters}</b> chapters</span>
          </div>
        </div>

        <div ref={depthRef} className="lf-3d-life" aria-label="Interactive three dimensional map of your digital life">
          <div className="lf-3d-halo halo-a" />
          <div className="lf-3d-halo halo-b" />
          <div className="lf-3d-grid" />
          <div className="lf-3d-scene">
            <div className="lf-3d-core"><span>YOU</span><small>digital core</small></div>
            <div className="lf-3d-ring ring-x" />
            <div className="lf-3d-ring ring-y" />
            <div className="lf-3d-ring ring-z" />
            <div className="lf-3d-node node-home"><b>{topPlaces[0]?.[0] || 'HOME'}</b><small>{topPlaces[0]?.[1] || 0} signals</small></div>
            <div className="lf-3d-node node-cafe"><b>{topPlaces[1]?.[0] || 'SOURCE'}</b><small>{topPlaces[1]?.[1] || 0} signals</small></div>
            <div className="lf-3d-node node-work"><b>{topArtist}</b><small>music signal</small></div>
            <div className="lf-3d-node node-travel"><b>{statistics.totalChapters} CHAPTERS</b><small>temporal phases</small></div>
            <svg className="lf-3d-lines" viewBox="0 0 520 420" aria-hidden="true">
              <path d="M260 210 C185 135 125 115 75 88" /><path d="M260 210 C335 140 395 125 455 90" /><path d="M260 210 C180 275 130 315 75 350" /><path d="M260 210 C340 280 390 315 455 350" />
            </svg>
          </div>
          <div className="lf-3d-label lf-3d-label-top">LIVE TOPOLOGY <span>•</span> {statistics.uniquePlacesCount.toLocaleString()} LOCATIONS</div>
          <div className="lf-3d-label lf-3d-label-bottom">MOVE YOUR CURSOR · EXPLORE THE FIELD</div>
        </div>
      </section>

      {/* Factual Statistics Grid */}
      <section className="lf-stats-grid grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-5 rounded-2xl bg-[#121217] border border-zinc-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Total Moments</span>
            <Layers size={16} className="text-zinc-400" />
          </div>
          <div>
            <div className="text-3xl font-bold text-white tracking-tight">{statistics.totalReceipts}</div>
            <div className="text-xs text-zinc-400 mt-1">
              Recorded across {statistics.dateRange.daysSpan} days
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121217] border border-zinc-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Recurring Hubs</span>
            <MapPin size={16} className="text-amber-400" />
          </div>
          <div>
            <div className="text-3xl font-bold text-white tracking-tight">{statistics.uniquePlacesCount}</div>
            <div className="text-xs text-zinc-400 mt-1">
              Top: {statistics.uniquePlaces.slice(0, 2).join(' & ') || 'No physical locations recorded'}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121217] border border-zinc-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Discovered Ties</span>
            <Compass size={16} className="text-blue-400" />
          </div>
          <div>
            <div className="text-3xl font-bold text-white tracking-tight">{statistics.totalConnections}</div>
            <div className="text-xs text-zinc-400 mt-1">
              Cross-record correlations verified
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121217] border border-zinc-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Chapters Formed</span>
            <FolderOpen size={16} className="text-purple-400" />
          </div>
          <div>
            <div className="text-3xl font-bold text-white tracking-tight">{statistics.totalChapters}</div>
            <div className="text-xs text-zinc-400 mt-1">
              Distinct temporal & activity phases
            </div>
          </div>
        </div>
      </section>

      <section className="lf-case-strip grid grid-cols-1 md:grid-cols-3 gap-px rounded-2xl overflow-hidden border border-white/[0.07] bg-white/[0.04]">
        <div className="p-5 bg-[#0d0d11]/90"><div className="text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-500">CASE FILE</div><div className="mt-2 text-lg font-semibold text-white">{statistics.totalReceipts.toLocaleString()} normalized signals</div><div className="mt-1 text-xs text-zinc-500">Three imported source streams fused locally.</div></div>
        <div className="p-5 bg-[#0d0d11]/90"><div className="text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-500">PRIVACY LAYER</div><div className="mt-2 text-lg font-semibold text-emerald-300">PII excluded from UI</div><div className="mt-1 text-xs text-zinc-500">Payment-card and identity fields stay outside the app model.</div></div>
        <div className="p-5 bg-[#0d0d11]/90"><div className="text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-500">REASONING</div><div className="mt-2 text-lg font-semibold text-amber-300">Evidence before conclusions</div><div className="mt-1 text-xs text-zinc-500">Every discovery exposes its supporting signals and confidence.</div></div>
      </section>

      {/* Activity Pulse Section */}
      <section className="lf-pulse-panel p-6 sm:p-8 rounded-3xl bg-[#121217] border border-zinc-800/80 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Chronological Density
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Activity Pulse
            </h2>
          </div>
          <div className="text-xs text-zinc-400 font-mono">
            {hoveredPulse ? (
              <span className="text-zinc-200">
                Month of {hoveredPulse.label}: <strong className="text-white">{hoveredPulse.count}</strong> moments
              </span>
            ) : (
              <span>Hover over timeline periods to inspect density</span>
            )}
          </div>
        </div>

        {/* Pulse Visualization Bar */}
        <div className="pt-4 pb-2">
          <div className="lf-pulse-scroll w-full overflow-x-auto pb-2">
            <div className="flex items-end gap-1.5 h-32 min-w-max px-1">
            {displayPulse.map((pulse: ActivityPulsePoint, idx: number) => {
              const heightPercent = Math.max(8, Math.round((pulse.count / maxPulseCount) * 100));
              const isHovered = hoveredPulse?.date === pulse.date;

              return (
                <div
                  key={pulse.date || idx}
                  title={`${pulse.label} · ${pulse.count.toLocaleString()} signals`}
                  onMouseEnter={() => setHoveredPulse(pulse)}
                  onMouseLeave={() => setHoveredPulse(null)}
                  onClick={() => {
                    if (pulse.receiptIds.length > 0 && onOpenAtlasWithFocus) {
                      onOpenAtlasWithFocus(pulse.receiptIds);
                    }
                  }}
                  className="group relative flex flex-col justify-end h-full cursor-pointer w-[9px] sm:w-[11px] shrink-0"
                >
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-sm transition-all duration-200 ${
                      isHovered
                        ? 'bg-amber-400 shadow-md shadow-amber-400/20'
                        : pulse.count > 10
                        ? 'bg-zinc-300 hover:bg-zinc-100'
                        : 'bg-zinc-700 hover:bg-zinc-500'
                    }`}
                  />
                </div>
              );
            })}
            </div>
          </div>

          {/* Timeline labels */}
          <div className="flex justify-between gap-4 text-[11px] font-mono text-zinc-500 mt-3 pt-2 border-t border-zinc-800/80">
            <span>{displayPulse[0]?.label || '—'}</span>
            <span>{displayPulse[Math.floor(displayPulse.length / 2)]?.label || '—'}</span>
            <span>{displayPulse[displayPulse.length - 1]?.label || '—'}</span>
          </div>
        </div>

        {/* Dynamic Hover Details Card */}
        {hoveredPulse && (
          <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-700/80 text-xs flex flex-wrap items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="font-mono text-zinc-300 font-medium">Period: {hoveredPulse.label}</span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-300">{hoveredPulse.count} receipts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-400 text-[11px]">Dominant Signals:</span>
              {hoveredPulse.dominantTypes.map((t: ReceiptType, idx: number) => (
                <span
                  key={idx}
                  className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono ${getTypeBadgeClass(t)}`}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Things You Might Have Missed (Discoveries) */}
      <section className="lf-discoveries-section space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
              Automated Forensic Correlations
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Things You Might Have Missed
            </h2>
          </div>
          <button
            onClick={onFindMissed}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-amber-300 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Sparkles size={14} className="text-amber-400" />
            <span>Discover more patterns</span>
          </button>
        </div>

        {/* Discovery Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {discoveries.map((disc: Discovery) => {
            const isExpanded = selectedDiscovery?.id === disc.id;
            const involvedReceipts = disc.receiptIds
              .map((id: string) => receiptMap.get(id))
              .filter(Boolean);

            return (
              <div
                key={disc.id}
                className="p-6 rounded-2xl bg-[#121217] hover:bg-[#15151c] border border-zinc-800/80 hover:border-zinc-700/80 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {disc.involvedTypes.map((t: ReceiptType, tIdx: number) => (
                        <span key={tIdx} className={`p-1 rounded ${getTypeBadgeClass(t)}`}>
                          <ReceiptIcon type={t} size={12} />
                        </span>
                      ))}
                    </div>
                    <span className="text-[11px] font-mono text-emerald-300">
                      {disc.confidence}% confidence · {disc.evidenceCount.toLocaleString()} evidence
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-white leading-snug">
                    {disc.title}
                  </h3>
                  <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                    {disc.explanation}
                  </p>

                  {/* Expandable Evidence Trail */}
                  <div className="pt-2 border-t border-zinc-800/60">
                    <button
                      onClick={() => setSelectedDiscovery(isExpanded ? null : disc)}
                      className="text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1"
                    >
                      <span>{isExpanded ? 'Hide evidence trail' : 'View evidence trail'}</span>
                      <span>{isExpanded ? '▲' : '▼'}</span>
                    </button>

                    {isExpanded && (
                      <div className="mt-3 p-4 rounded-xl bg-zinc-900/90 border border-zinc-800/80 space-y-2 animate-fade-in">
                        <div className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                          Why We Found This:
                        </div>
                        {disc.reasons.map((r: string, rIdx: number) => (
                          <div key={rIdx} className="text-xs text-zinc-300 flex items-start gap-2">
                            <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card CTA */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => {
                      if (onOpenAtlasWithFocus) {
                        onOpenAtlasWithFocus(disc.receiptIds);
                      } else {
                        onSwitchTab('atlas');
                      }
                    }}
                    className="text-xs font-medium text-white hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Explore connection in Atlas</span>
                    <ArrowRight size={13} />
                  </button>
                  {involvedReceipts.length > 0 && (
                    <button
                      onClick={() => onSelectReceipt(involvedReceipts[0]!.id)}
                      className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      View receipt
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="p-8 rounded-3xl bg-gradient-to-b from-[#14141d] to-[#0f0f15] border border-zinc-800/90 relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono tracking-widest text-zinc-400 uppercase">
            <span>Forensic Investigation Console</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">TRACE THE EVIDENCE</h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">Move from the story layer into a full evidence workspace: personal baseline, anomaly candidates, cross-source convergence, explainable discoveries, privacy controls and source health.</p>
          <button onClick={() => onSwitchTab('investigation')} className="px-5 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer shadow">
            <span>Open Investigation Console</span><ArrowRight size={14}/>
          </button>
        </div>
      </section>

      {/* Subtle Final Message Section */}
      <section className="py-16 text-center border-t border-zinc-800/80 space-y-6">
        <div className="max-w-lg mx-auto space-y-2">
          <p className="text-2xl sm:text-3xl font-light text-zinc-400 font-editorial">
            {statistics.totalReceipts.toLocaleString()} signals.
          </p>
          <p className="text-2xl sm:text-3xl font-light text-zinc-400 font-editorial">
            {statistics.totalChapters} chapters.
          </p>
          <p className="text-2xl sm:text-3xl font-medium text-white font-editorial">
            Countless ways to connect the dots.
          </p>
        </div>

        <div className="pt-4">
          <button
            onClick={() => onSwitchTab('atlas')}
            className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-xs font-medium text-white hover:text-amber-300 inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>Explore Relationship Atlas</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </section>
    </div>
  );
};
