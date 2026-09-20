// src/views/ChaptersView.tsx
import React, { useState } from 'react';
import {
  Folder,
  ArrowRight,
  ChevronLeft,
  Calendar,
  MapPin,
  Sparkles,
  Search,
  ShoppingBag,
  Camera,
  ArrowDown
} from 'lucide-react';
import type { ForensicsDataset, Chapter } from '../types/receipt';
import { ReceiptIcon, getTypeBadgeClass } from '../components/ReceiptIcon';

interface ChaptersViewProps {
  data: ForensicsDataset;
  onSelectReceipt: (id: string) => void;
  initialChapterId?: string | null;
}

export const ChaptersView: React.FC<ChaptersViewProps> = ({
  data,
  onSelectReceipt,
  initialChapterId
}) => {
  const { chapters } = data;
  const [activeChapterId, setActiveChapterId] = useState<string | null>(initialChapterId || null);

  const activeChapter: Chapter | undefined = chapters.find((c: Chapter) => c.id === activeChapterId);

  // If a chapter is selected, render the deep immersive view!
  if (activeChapter) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12 animate-fade-in">
        {/* Back navigation button */}
        <button
          onClick={() => setActiveChapterId(null)}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <ChevronLeft size={16} />
          <span>Back to all chapters</span>
        </button>

        {/* Immersive Chapter Hero */}
        <header className="space-y-4 border-b border-zinc-800/80 pb-8">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold uppercase tracking-widest bg-zinc-800 text-zinc-300 border border-zinc-700/80">
              CHAPTER {activeChapter.number}
            </span>
            <span className="text-xs font-mono text-zinc-400">
              {activeChapter.dateRangeFormatted}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
            {activeChapter.title}
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl font-sans leading-relaxed">
            {activeChapter.narrative}
          </p>

          {/* Metrics Pill Row */}
          <div className="flex flex-wrap items-center gap-3 pt-4 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-semibold">
              {activeChapter.receiptCount} moments
            </span>
            {activeChapter.typeCounts.search && (
              <span className="px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-300 flex items-center gap-1.5">
                <Search size={13} />
                {activeChapter.typeCounts.search} searches
              </span>
            )}
            {activeChapter.typeCounts.purchase && (
              <span className="px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-300 flex items-center gap-1.5">
                <ShoppingBag size={13} />
                {activeChapter.typeCounts.purchase} purchases
              </span>
            )}
            {activeChapter.typeCounts.event && (
              <span className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 flex items-center gap-1.5">
                <Calendar size={13} />
                {activeChapter.typeCounts.event} event
              </span>
            )}
            {activeChapter.typeCounts.photo && (
              <span className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center gap-1.5">
                <Camera size={13} />
                {activeChapter.typeCounts.photo} photos
              </span>
            )}
          </div>
        </header>

        {/* Visual Sequence Flow (Search ↓ Place ↓ Purchase ↓ Event ↓ Photo) */}
        {activeChapter.sequenceFlow.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400">
              <Sparkles size={14} className="text-amber-400" />
              <span>Evidence Arc Sequence</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#121217] border border-zinc-800/80">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {activeChapter.sequenceFlow.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <div
                      onClick={() => onSelectReceipt(step.receiptId)}
                      className="p-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer flex-1 group"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`p-1 rounded ${getTypeBadgeClass(step.type)}`}>
                          <ReceiptIcon type={step.type} size={12} />
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                          {step.type}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                        {step.label}
                      </div>
                    </div>

                    {idx < activeChapter.sequenceFlow.length - 1 && (
                      <div className="flex items-center justify-center text-zinc-600 shrink-0">
                        <ArrowDown size={14} className="md:hidden" />
                        <ArrowRight size={16} className="hidden md:block" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Chronological Evidence Receipts List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-zinc-400">
            <span>Verified Timeline Receipts ({activeChapter.receipts.length})</span>
            <span>Click any receipt to open forensic dossier</span>
          </div>

          <div className="space-y-3">
            {activeChapter.receipts.map(r => (
              <div
                key={r.id}
                onClick={() => onSelectReceipt(r.id)}
                className="p-4 rounded-xl bg-[#121217] hover:bg-[#16161e] border border-zinc-800/80 hover:border-zinc-700/80 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <span className={`p-2 rounded-lg shrink-0 ${getTypeBadgeClass(r.type)}`}>
                    <ReceiptIcon type={r.type} size={16} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors truncate">
                      {r.title}
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5 font-sans">
                      {r.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 shrink-0">
                  {r.location && (
                    <span className="flex items-center gap-1 text-amber-400/80">
                      <MapPin size={12} />
                      <span className="truncate max-w-[140px]">{r.location}</span>
                    </span>
                  )}
                  <span className="font-mono">{r.dateFormatted}</span>
                  <ArrowRight size={14} className="text-zinc-600 group-hover:text-white transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // Chapters Overview Grid (All 11 Chapters)
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10 animate-fade-in">
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono tracking-widest text-zinc-400 uppercase">
          <Folder size={12} className="text-purple-400" />
          <span>Algorithmic Chapters</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          THE 11 CHAPTERS
        </h1>
        <p className="text-base text-zinc-400 max-w-2xl font-editorial">
          Rather than arbitrary calendar splits, chapters are formed from dense activity clusters,
          recurring hubs, and spatial shifts. Click any chapter to inspect the sequential evidence arc.
        </p>
      </header>

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {chapters.map((ch: Chapter) => (
          <div
            key={ch.id}
            onClick={() => setActiveChapterId(ch.id)}
            className="p-6 rounded-2xl bg-[#121217] hover:bg-[#16161f] border border-zinc-800/80 hover:border-zinc-700 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-400 tracking-wider">
                  CHAPTER {ch.number}
                </span>
                <span className="text-xs font-mono text-purple-300">
                  {ch.receiptCount} moments
                </span>
              </div>

              <h2 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                {ch.title}
              </h2>

              <p className="text-xs text-zinc-400 font-sans line-clamp-2 leading-relaxed">
                {ch.narrative}
              </p>

              {/* Major Places Chips */}
              {ch.keyPlaces.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {ch.keyPlaces.slice(0, 2).map((place: string, pIdx: number) => (
                    <span
                      key={pIdx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-zinc-900 text-amber-300/80 border border-zinc-800"
                    >
                      <MapPin size={9} />
                      <span className="truncate max-w-[120px]">{place}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
              <span className="font-mono">{ch.dateRangeFormatted}</span>
              <span className="text-white group-hover:text-purple-300 font-medium flex items-center gap-1">
                Explore <ArrowRight size={13} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
