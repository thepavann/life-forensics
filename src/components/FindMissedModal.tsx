// src/components/FindMissedModal.tsx
import React, { useState } from 'react';
import { Sparkles, X, ArrowRight, RotateCw, CheckCircle2, GitFork, BookOpen } from 'lucide-react';
import type { Discovery, NormalizedReceipt } from '../types/receipt';
import { ReceiptIcon, getTypeBadgeClass } from './ReceiptIcon';

interface FindMissedModalProps {
  isOpen: boolean;
  onClose: () => void;
  discoveries: Discovery[];
  receiptMap: Map<string, NormalizedReceipt>;
  onSelectReceipt: (id: string) => void;
  onExploreInAtlas: (discoveryId: string) => void;
  onExploreChapter?: (chapterId: string) => void;
}

export const FindMissedModal: React.FC<FindMissedModalProps> = ({
  isOpen,
  onClose,
  discoveries,
  receiptMap,
  onSelectReceipt,
  onExploreInAtlas,
  onExploreChapter
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen || discoveries.length === 0) return null;

  const current = discoveries[currentIndex % discoveries.length];
  const involvedReceipts = current.receiptIds
    .map(id => receiptMap.get(id))
    .filter(Boolean) as NormalizedReceipt[];

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % discoveries.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#121218] rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden text-zinc-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-[#16161f]">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles size={16} />
            </span>
            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                Pattern Discovery Engine
              </h3>
              <span className="text-[11px] text-zinc-400">
                Pattern {currentIndex + 1} of {discoveries.length}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Discovery Hero Card */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3"><span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-mono tracking-wider uppercase bg-zinc-800 text-zinc-300 border border-zinc-700/60">Pattern Discovery</span><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">{current.confidence}% {current.confidenceLabel || 'CONFIDENCE'}</span></div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
              "{current.title}"
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
              {current.explanation}
            </p>
          </div>

          {/* Why We Found This (Evidence Trail) */}
          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                Why We Found This
              </h4>
              <span className="text-xs text-zinc-400 font-mono">
                {current.evidenceCount} verified receipts
              </span>
            </div>
            <div className="space-y-2">
              {current.reasons.map((r, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Involved Evidence Chips */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
              Sample Associated Fragments ({involvedReceipts.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {involvedReceipts.slice(0, 6).map(r => (
                <div
                  key={r.id}
                  onClick={() => {
                    onSelectReceipt(r.id);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800/60 hover:border-zinc-700 flex items-center justify-between cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`p-1 rounded-md ${getTypeBadgeClass(r.type)}`}>
                      <ReceiptIcon type={r.type} size={12} />
                    </span>
                    <span className="text-xs text-zinc-200 group-hover:text-white truncate">
                      {r.title}
                    </span>
                  </div>
                  <ArrowRight size={12} className="text-zinc-400 group-hover:text-white shrink-0 ml-1" />
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={handleNext}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCw size={14} />
              <span>Next pattern</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {current.chapterId && onExploreChapter && (
                <button
                  onClick={() => {
                    onExploreChapter(current.chapterId!);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <BookOpen size={14} />
                  <span>Open Chapter</span>
                </button>
              )}
              <button
                onClick={() => {
                  onExploreInAtlas(current.id);
                  onClose();
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer shadow"
              >
                <GitFork size={14} />
                <span>Explore in Atlas</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
