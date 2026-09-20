// src/components/ReceiptDetailModal.tsx
import React, { useEffect } from 'react';
import { X, MapPin, ExternalLink, Link2, Sparkles, Clock, Folder } from 'lucide-react';
import type { NormalizedReceipt, Connection } from '../types/receipt';
import { ReceiptIcon, getTypeBadgeClass } from './ReceiptIcon';

interface ReceiptDetailModalProps {
  receipt: NormalizedReceipt | null;
  connections: Connection[];
  receiptMap: Map<string, NormalizedReceipt>;
  onClose: () => void;
  onSelectReceipt: (id: string) => void;
  onOpenChapter?: (chapterId: string) => void;
  onViewInAtlas?: (id: string) => void;
}

export const ReceiptDetailModal: React.FC<ReceiptDetailModalProps> = ({
  receipt,
  connections,
  receiptMap,
  onClose,
  onSelectReceipt,
  onOpenChapter,
  onViewInAtlas
}) => {
  // Listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!receipt) return null;

  // Filter connections involving this receipt
  const relevantConnections = connections.filter(
    c => c.sourceId === receipt.id || c.targetId === receipt.id
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-xl h-full sm:h-[94vh] bg-[#121217] sm:rounded-2xl border border-zinc-800/80 shadow-2xl flex flex-col overflow-hidden text-zinc-200 animate-slide-left"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-[#16161d]">
          <div className="flex items-center space-x-3">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium uppercase tracking-wider ${getTypeBadgeClass(
                receipt.type
              )}`}
            >
              <ReceiptIcon type={receipt.type} size={14} />
              {receipt.type}
            </span>
            <span className="text-xs text-zinc-400 mono-tag">{receipt.id}</span>
          </div>
          <div className="flex items-center gap-2">
            {onViewInAtlas && (
              <button
                onClick={() => onViewInAtlas(receipt.id)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/60 transition-colors text-xs flex items-center gap-1"
                title="View in Atlas Graph"
              >
                <Sparkles size={14} className="text-amber-400" />
                <span className="hidden sm:inline">Atlas</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/60 transition-colors"
              aria-label="Close drawer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Title & Timing */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white leading-snug">
              {receipt.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-zinc-400">
              <span className="inline-flex items-center gap-1.5 bg-zinc-800/60 px-2 py-1 rounded border border-zinc-700/40">
                <Clock size={12} className="text-zinc-400" />
                {receipt.dateFormatted} · {receipt.timeFormatted}
              </span>
              {receipt.location && (
                <span className="inline-flex items-center gap-1.5 bg-zinc-800/60 px-2 py-1 rounded border border-zinc-700/40 text-amber-300/90">
                  <MapPin size={12} className="text-amber-400" />
                  {receipt.location}
                </span>
              )}
              {receipt.chapterTitle && (
                <button
                  onClick={() => onOpenChapter && receipt.chapterId && onOpenChapter(receipt.chapterId)}
                  className="inline-flex items-center gap-1.5 bg-zinc-800/60 hover:bg-zinc-700/60 px-2 py-1 rounded border border-zinc-700/40 text-purple-300/90 transition-colors"
                >
                  <Folder size={12} className="text-purple-400" />
                  {receipt.chapterTitle}
                </button>
              )}
            </div>
          </div>

          {/* Narrative / Description */}
          <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800/60">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">Record Narrative</h4>
            <p className="text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap font-sans">
              {receipt.description}
            </p>
          </div>

          {/* Metadata Breakdown */}
          {receipt.metadata && Object.keys(receipt.metadata).length > 0 && (
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
                Extracted Attributes
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(receipt.metadata).map(([key, value]) => (
                  <div
                    key={key}
                    className="p-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800/40 flex flex-col justify-between"
                  >
                    <span className="text-zinc-400 mono-tag capitalize">{key.replace(/_/g, ' ')}</span>
                    <span className="text-zinc-200 font-medium mt-1 truncate">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {receipt.tags && receipt.tags.length > 0 && (
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Contextual Tags
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {receipt.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[11px] bg-zinc-800/50 text-zinc-400 border border-zinc-700/30"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Connections Section */}
          <div className="pt-2 border-t border-zinc-800/80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold tracking-wide uppercase text-zinc-200 flex items-center gap-2">
                <Link2 size={16} className="text-zinc-400" />
                Discovered Connections ({relevantConnections.length})
              </h3>
            </div>

            {relevantConnections.length === 0 ? (
              <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/40 text-center text-xs text-zinc-400">
                This fragment stands alone in the timeline. No high-confidence correlations exceed the threshold.
              </div>
            ) : (
              <div className="space-y-3">
                {relevantConnections.map((conn, idx) => {
                  const otherId = conn.sourceId === receipt.id ? conn.targetId : conn.sourceId;
                  const otherReceipt = receiptMap.get(otherId);
                  if (!otherReceipt) return null;

                  return (
                    <div
                      key={idx}
                      onClick={() => onSelectReceipt(otherId)}
                      className="p-3.5 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/50 border border-zinc-800/60 hover:border-zinc-700/80 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`p-1.5 rounded-md ${getTypeBadgeClass(otherReceipt.type)}`}
                          >
                            <ReceiptIcon type={otherReceipt.type} size={13} />
                          </span>
                          <div>
                            <div className="text-xs font-medium text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                              {otherReceipt.title}
                            </div>
                            <div className="text-[11px] text-zinc-400">
                              {otherReceipt.dateFormatted} · {otherReceipt.timeFormatted}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-zinc-400 group-hover:text-white shrink-0">
                          <span>{(conn.score * 100).toFixed(0)}%</span>
                          <ExternalLink size={12} />
                        </div>
                      </div>

                      {/* Reasons trail */}
                      <div className="mt-2.5 pt-2 border-t border-zinc-800/40 space-y-1">
                        <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                          Why Connected:
                        </div>
                        {conn.reasons.map((r, rIdx) => (
                          <div key={rIdx} className="text-xs text-zinc-300 flex items-center gap-1.5">
                            <span className="text-emerald-400">✓</span>
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
