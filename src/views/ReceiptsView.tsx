// src/views/ReceiptsView.tsx
import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  MapPin,
  ArrowUpDown,
  ArrowRight
} from 'lucide-react';
import type { ForensicsDataset, ReceiptType, NormalizedReceipt } from '../types/receipt';
import { ReceiptIcon, getTypeBadgeClass } from '../components/ReceiptIcon';

interface ReceiptsViewProps {
  data: ForensicsDataset;
  onSelectReceipt: (id: string) => void;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

export const ReceiptsView: React.FC<ReceiptsViewProps> = ({
  data,
  onSelectReceipt,
  searchInputRef
}) => {
  const { receipts, statistics } = data;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ReceiptType | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'title' | 'connections'>('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 24;

  const receiptTypes: { id: ReceiptType | 'all'; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: statistics.totalReceipts },
    { id: 'music', label: 'Music', count: statistics.typeDistribution.music },
    { id: 'movie', label: 'Movies', count: statistics.typeDistribution.movie },
    { id: 'place', label: 'Places', count: statistics.typeDistribution.place },
    { id: 'purchase', label: 'Purchases', count: statistics.typeDistribution.purchase },
    { id: 'photo', label: 'Photos', count: statistics.typeDistribution.photo },
    { id: 'message', label: 'Messages', count: statistics.typeDistribution.message },
    { id: 'search', label: 'Searches', count: statistics.typeDistribution.search },
    { id: 'event', label: 'Events', count: statistics.typeDistribution.event },
    { id: 'note', label: 'Notes', count: statistics.typeDistribution.note }
  ];

  // Filtering
  const filteredReceipts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return receipts.filter((r: NormalizedReceipt) => {
      // Type
      if (selectedType !== 'all' && r.type !== selectedType) return false;

      // Location
      if (selectedLocation !== 'all') {
        if (!r.location || r.location !== selectedLocation) return false;
      }

      // Query
      if (q) {
        const matchesTitle = r.title.toLowerCase().includes(q);
        const matchesDesc = r.description.toLowerCase().includes(q);
        const matchesLoc = r.location && r.location.toLowerCase().includes(q);
        const matchesTag = r.tags.some((t: string) => t.toLowerCase().includes(q));
        const matchesChapter = r.chapterTitle && r.chapterTitle.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesLoc && !matchesTag && !matchesChapter) {
          return false;
        }
      }

      return true;
    });
  }, [receipts, selectedType, selectedLocation, searchQuery]);

  // Sorting
  const sortedReceipts = useMemo(() => {
    return [...filteredReceipts].sort((a: NormalizedReceipt, b: NormalizedReceipt) => {
      if (sortBy === 'date-desc') {
        return b.dateObj.getTime() - a.dateObj.getTime();
      }
      if (sortBy === 'date-asc') {
        return a.dateObj.getTime() - b.dateObj.getTime();
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'connections') {
        const connsA = data.adjacencyMap.get(a.id)?.length || 0;
        const connsB = data.adjacencyMap.get(b.id)?.length || 0;
        return connsB - connsA;
      }
      return 0;
    });
  }, [filteredReceipts, sortBy, data.adjacencyMap]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedReceipts.length / pageSize));
  const paginatedReceipts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedReceipts.slice(start, start + pageSize);
  }, [sortedReceipts, currentPage, pageSize]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedLocation('all');
    setSortBy('date-desc');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery !== '' || selectedType !== 'all' || selectedLocation !== 'all' || sortBy !== 'date-desc';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-zinc-800/80 pb-6">
        <div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            RECEIPT ARCHIVE
          </h1>
          <p className="text-sm text-zinc-400 mt-1 font-editorial">
            Inspect, filter, and cross-reference all {statistics.totalReceipts.toLocaleString()} imported digital fragments.
          </p>
        </div>
        <div className="text-xs font-mono text-zinc-400">
          Showing <strong className="text-white">{sortedReceipts.length}</strong> of {statistics.totalReceipts} records
        </div>
      </div>

      {/* Control / Filter Bar */}
      <div className="space-y-4">
        {/* Search Input & Selects */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Full-text search receipts, metadata, artists, keywords..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#121217] border border-zinc-800 focus:border-zinc-600 outline-none text-sm text-white placeholder-zinc-400 font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Location Filter Dropdown */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={selectedLocation}
                onChange={e => {
                  setSelectedLocation(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none pl-8 pr-8 py-2.5 rounded-xl bg-[#121217] border border-zinc-800 text-xs text-zinc-300 outline-none focus:border-zinc-600 cursor-pointer font-sans"
              >
                <option value="all">All Locations ({statistics.uniquePlacesCount})</option>
                {statistics.uniquePlaces.map((loc: string, idx: number) => (
                  <option key={idx} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none" />
            </div>

            {/* Sort Select */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="appearance-none pl-8 pr-8 py-2.5 rounded-xl bg-[#121217] border border-zinc-800 text-xs text-zinc-300 outline-none focus:border-zinc-600 cursor-pointer font-sans"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="connections">Most Connected</option>
                <option value="title">Title (A-Z)</option>
              </select>
              <ArrowUpDown size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer shrink-0"
                title="Reset all filters"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {receiptTypes.map(t => (
            <button
              key={t.id}
              onClick={() => {
                setSelectedType(t.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                selectedType === t.id
                  ? 'bg-white text-zinc-950 shadow font-semibold'
                  : 'bg-[#121217] hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80'
              }`}
            >
              <span>{t.label}</span>
              <span
                className={`text-[10px] font-mono px-1 rounded ${
                  selectedType === t.id ? 'bg-zinc-200 text-zinc-950' : 'text-zinc-400'
                }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Receipts Grid */}
      {paginatedReceipts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#121217] border border-zinc-800 text-zinc-400 space-y-3">
          <p className="text-sm">No receipts match the current search or filter combination.</p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-zinc-800 text-xs font-medium text-white hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedReceipts.map((r: NormalizedReceipt) => {
            const connsCount = data.adjacencyMap.get(r.id)?.length || 0;
            return (
              <button
                type="button"
                key={r.id}
                onClick={() => onSelectReceipt(r.id)}
                aria-label={'Open receipt ' + r.title}
                className="w-full text-left p-5 rounded-2xl bg-[#121217] hover:bg-[#16161f] border border-zinc-800/80 hover:border-zinc-700/80 transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wider ${getTypeBadgeClass(r.type)}`}>
                      <ReceiptIcon type={r.type} size={11} />
                      {r.type}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400">
                      {r.timeFormatted}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                    {r.title}
                  </h3>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-sans">
                    {r.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="font-mono">{r.dateFormatted}</span>
                  <div className="flex items-center gap-2">
                    {connsCount > 0 && (
                      <span className="font-mono text-amber-400/90">
                        {connsCount} ties
                      </span>
                    )}
                    <ArrowRight size={13} className="text-zinc-600 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80 text-xs font-mono text-zinc-400">
          <div>
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 disabled:opacity-30 hover:bg-zinc-800 text-zinc-200 transition-colors cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 disabled:opacity-30 hover:bg-zinc-800 text-zinc-200 transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
