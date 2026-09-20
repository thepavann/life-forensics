// src/components/GlobalSearchModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, Clock, ArrowRight } from 'lucide-react';
import type { NormalizedReceipt } from '../types/receipt';
import { ReceiptIcon, getTypeBadgeClass } from './ReceiptIcon';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipts: NormalizedReceipt[];
  onSelectReceipt: (id: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  receipts,
  onSelectReceipt
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();
  const filtered = query
    ? receipts.filter(r => {
        return (
          r.title.toLowerCase().includes(normalizedQuery) ||
          r.description.toLowerCase().includes(normalizedQuery) ||
          (r.location && r.location.toLowerCase().includes(normalizedQuery)) ||
          r.type.toLowerCase().includes(normalizedQuery) ||
          r.tags.some(t => t.toLowerCase().includes(normalizedQuery)) ||
          (r.chapterTitle && r.chapterTitle.toLowerCase().includes(normalizedQuery))
        );
      }).slice(0, 15)
    : receipts.slice(0, 8);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#121217] rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden text-zinc-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-zinc-800 bg-[#16161d]">
          <Search size={18} className="text-zinc-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search moments, artists, locations, queries, tags..."
            className="w-full bg-transparent border-none outline-none text-white text-sm placeholder-zinc-400 font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-zinc-400 hover:text-white rounded mr-2"
            >
              <X size={16} />
            </button>
          )}
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-800 rounded border border-zinc-700/60">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex justify-between">
            <span>{query ? `Matching Results (${filtered.length})` : 'Recent Highlights'}</span>
            <span>312 indexed</span>
          </div>

          {filtered.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-sm">
              No matching digital receipts found for "{query}"
            </div>
          ) : (
            filtered.map(r => (
              <div
                key={r.id}
                onClick={() => {
                  onSelectReceipt(r.id);
                  onClose();
                }}
                className="p-3 rounded-xl hover:bg-zinc-800/60 transition-colors flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`p-1.5 rounded-lg shrink-0 ${getTypeBadgeClass(r.type)}`}>
                    <ReceiptIcon type={r.type} size={14} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-zinc-200 group-hover:text-white truncate">
                      {r.title}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {r.dateFormatted}
                      </span>
                      {r.location && (
                        <span className="flex items-center gap-1 truncate max-w-[180px] text-amber-400/80">
                          <MapPin size={11} />
                          {r.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <ArrowRight size={14} className="text-zinc-600 group-hover:text-white shrink-0 ml-2 transition-colors" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
