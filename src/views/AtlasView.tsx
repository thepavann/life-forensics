// src/views/AtlasView.tsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  MapPin,
  Filter,
  Check
} from 'lucide-react';
import type { ForensicsDataset, ReceiptType, NormalizedReceipt, Chapter, Connection } from '../types/receipt';
import { getTypeHexColor } from '../components/ReceiptIcon';

interface AtlasViewProps {
  data: ForensicsDataset;
  onSelectReceipt: (id: string) => void;
  selectedReceiptId?: string | null;
  initialFocusIds?: string[];
}

interface NodePosition {
  x: number;
  y: number;
  receipt: NormalizedReceipt;
  connectedCount: number;
}

export const AtlasView: React.FC<AtlasViewProps> = ({
  data,
  onSelectReceipt,
  selectedReceiptId
}) => {
  const { receipts, connections, adjacencyMap, chapters } = data;

  // Viewport transformation states
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Filters
  const [typeFilter, setTypeFilter] = useState<ReceiptType | 'all'>('all');
  const [strongOnly, setStrongOnly] = useState(false);
  const [recurringPlacesOnly, setRecurringPlacesOnly] = useState(false);
  const [groupByChapter, setGroupByChapter] = useState(true);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Filter receipts based on selected options
  const recurringPlaceSet = useMemo(() => {
    const counts = new Map<string, number>();
    receipts.forEach(r => { if (r.location) counts.set(r.location, (counts.get(r.location) || 0) + 1); });
    return new Set(Array.from(counts.entries()).sort((a,b) => b[1] - a[1]).slice(0, 12).map(([name]) => name));
  }, [receipts]);

  const activeReceipts = useMemo(() => {
    return receipts.filter((r: NormalizedReceipt) => {
      if (typeFilter !== 'all' && r.type !== typeFilter) return false;
      if (recurringPlacesOnly && (!r.location || !recurringPlaceSet.has(r.location))) return false;
      return true;
    });
  }, [receipts, typeFilter, recurringPlacesOnly, recurringPlaceSet]);

  const atlasReceipts = useMemo(() => {
    const MAX_ATLAS_NODES = 220;
    if (activeReceipts.length <= MAX_ATLAS_NODES) return activeReceipts;
    // Keep the graph legible: prioritize records with connections, then recent records.
    return [...activeReceipts]
      .sort((a, b) => {
        const ca = (adjacencyMap.get(a.id) || []).length;
        const cb = (adjacencyMap.get(b.id) || []).length;
        return (cb - ca) || (b.dateObj.getTime() - a.dateObj.getTime());
      })
      .slice(0, MAX_ATLAS_NODES);
  }, [activeReceipts, adjacencyMap]);

  const activeIdSet = useMemo(() => new Set(atlasReceipts.map((r: NormalizedReceipt) => r.id)), [atlasReceipts]);

  // Compute node coordinates deterministically
  const nodePositions = useMemo<Map<string, NodePosition>>(() => {
    const map = new Map<string, NodePosition>();
    const width = 1100;
    const height = 750;
    const centerX = width / 2;
    const centerY = height / 2;

    if (groupByChapter) {
      // Position by chapters arranged in an organic elliptical ring
      const numChapters = chapters.length;
      const ringRadiusX = 360;
      const ringRadiusY = 240;

      chapters.forEach((ch: Chapter, chIdx: number) => {
        const angle = (chIdx / numChapters) * 2 * Math.PI - Math.PI / 2;
        const clusterCenterX = centerX + ringRadiusX * Math.cos(angle);
        const clusterCenterY = centerY + ringRadiusY * Math.sin(angle);

        const chReceipts = atlasReceipts.filter((r: NormalizedReceipt) => r.chapterId === ch.id);
        const count = chReceipts.length;

        chReceipts.forEach((r: NormalizedReceipt, rIdx: number) => {
          const subAngle = (rIdx / Math.max(count, 1)) * 2 * Math.PI;
          const subRadius = 25 + (rIdx % 4) * 16;
          const x = clusterCenterX + subRadius * Math.cos(subAngle);
          const y = clusterCenterY + subRadius * Math.sin(subAngle);
          const conns = adjacencyMap.get(r.id) || [];
          map.set(r.id, { x, y, receipt: r, connectedCount: conns.length });
        });
      });

      // Position any unassigned receipts in the center area
      const unassigned = atlasReceipts.filter((r: NormalizedReceipt) => !r.chapterId);
      unassigned.forEach((r: NormalizedReceipt, idx: number) => {
        const angle = (idx / Math.max(unassigned.length, 1)) * 2 * Math.PI;
        const rad = 40 + (idx % 3) * 20;
        const x = centerX + rad * Math.cos(angle);
        const y = centerY + rad * Math.sin(angle);
        const conns = adjacencyMap.get(r.id) || [];
        map.set(r.id, { x, y, receipt: r, connectedCount: conns.length });
      });
    } else {
      // Spiral constellation distribution
      atlasReceipts.forEach((r: NormalizedReceipt, idx: number) => {
        const angle = idx * 0.42;
        const radius = 30 + Math.sqrt(idx) * 38;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        const conns = adjacencyMap.get(r.id) || [];
        map.set(r.id, { x, y, receipt: r, connectedCount: conns.length });
      });
    }

    return map;
  }, [atlasReceipts, chapters, groupByChapter, adjacencyMap]);

  // When a pulse/discovery opens Atlas, bring the selected record into view.
  useEffect(() => {
    if (!selectedReceiptId || !nodePositions.has(selectedReceiptId) || !containerRef.current) return;
    const pos = nodePositions.get(selectedReceiptId)!;
    const rect = containerRef.current.getBoundingClientRect();
    const targetX = rect.width / 2;
    const targetY = rect.height / 2;
    setPan({
      x: targetX - (pos.x / 1100) * rect.width * zoom,
      y: targetY - (pos.y / 750) * rect.height * zoom
    });
  }, [selectedReceiptId, nodePositions, zoom]);

  // Filter and cap edges so the real dataset remains legible and responsive.
  const activeConnections = useMemo(() => {
    const filtered = connections.filter((c: Connection) => {
      if (!activeIdSet.has(c.sourceId) || !activeIdSet.has(c.targetId)) return false;
      if (strongOnly && c.score < 0.6) return false;
      return true;
    });

    return filtered
      .sort((a, b) => b.score - a.score)
      .slice(0, 520);
  }, [connections, activeIdSet, strongOnly]);

  // Set of connected IDs to currently selected or hovered node
  const highlightedIds = useMemo(() => {
    const focusId = selectedReceiptId || hoveredNodeId;
    if (!focusId) return null;
    const set = new Set<string>();
    set.add(focusId);
    const neighbors = adjacencyMap.get(focusId) || [];
    for (const n of neighbors) {
      set.add(n.targetId);
      set.add(n.sourceId);
    }
    return set;
  }, [selectedReceiptId, hoveredNodeId, adjacencyMap]);

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const receiptTypes: { id: ReceiptType | 'all'; label: string }[] = [
    { id: 'all', label: 'All Receipts' },
    { id: 'music', label: 'Music' },
    { id: 'movie', label: 'Movies' },
    { id: 'place', label: 'Places' },
    { id: 'purchase', label: 'Purchases' },
    { id: 'photo', label: 'Photos' },
    { id: 'message', label: 'Messages' },
    { id: 'search', label: 'Searches' },
    { id: 'event', label: 'Events' },
    { id: 'note', label: 'Notes' }
  ];

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-[#09090b] flex flex-col overflow-hidden select-none">
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Type Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full p-1.5 rounded-2xl bg-[#121217]/90 border border-zinc-800/90 shadow-xl backdrop-blur-md pointer-events-auto">
          <span className="text-[11px] font-mono text-zinc-400 px-2 flex items-center gap-1 hidden sm:flex">
            <Filter size={12} />
            Filter:
          </span>
          {receiptTypes.map(t => (
            <button
              key={t.id}
              onClick={() => setTypeFilter(t.id)}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                typeFilter === t.id
                  ? 'bg-white text-zinc-950 shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* View Toggles & Zoom Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#121217]/90 border border-zinc-800/90 backdrop-blur-md shadow-xl text-xs">
            <button
              onClick={() => setStrongOnly(!strongOnly)}
              className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                strongOnly ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sparkles size={12} />
              <span>Strong Ties</span>
            </button>
            <button
              onClick={() => setRecurringPlacesOnly(!recurringPlacesOnly)}
              className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                recurringPlacesOnly ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <MapPin size={12} />
              <span>Recurring Hubs</span>
            </button>
            <button
              onClick={() => setGroupByChapter(!groupByChapter)}
              className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                groupByChapter ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Check size={12} className={groupByChapter ? 'opacity-100' : 'opacity-0'} />
              <span>Chapters</span>
            </button>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#121217]/90 border border-zinc-800/90 backdrop-blur-md shadow-xl text-zinc-300">
            <button
              onClick={() => setZoom(z => Math.min(z + 0.2, 2.5))}
              className="p-1.5 hover:text-white rounded hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn size={15} />
            </button>
            <button
              onClick={() => setZoom(z => Math.max(z - 0.2, 0.4))}
              className="p-1.5 hover:text-white rounded hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut size={15} />
            </button>
            <button
              onClick={resetView}
              className="p-1.5 hover:text-white rounded hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Reset View"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={(e) => {
          e.preventDefault();
          setZoom(z => Math.min(2.5, Math.max(0.55, z + (e.deltaY < 0 ? 0.1 : -0.1))));
        }}
        className={`flex-1 w-full h-full cursor-grab active:cursor-grabbing relative overflow-hidden bg-[#09090b] ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
      >
        <svg
          viewBox="0 0 1100 750"
          className="w-full h-full"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '50% 50%',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out'
          }}
        >
          <defs>
            <pattern id="atlas-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#16161f" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="1100" height="750" fill="url(#atlas-grid)" />

          {/* Connection Edges */}
          <g className="edges">
            {activeConnections.map((conn: Connection, idx: number) => {
              const posA = nodePositions.get(conn.sourceId);
              const posB = nodePositions.get(conn.targetId);
              if (!posA || !posB) return null;

              const isConnectedToFocus =
                highlightedIds !== null &&
                (highlightedIds.has(conn.sourceId) && highlightedIds.has(conn.targetId));

              const isDimmed = highlightedIds !== null && !isConnectedToFocus;

              const strokeOpacity = isConnectedToFocus
                ? 0.9
                : isDimmed
                ? 0.05
                : Math.max(0.12, conn.score * 0.35);

              const strokeColor = isConnectedToFocus
                ? '#f59e0b'
                : conn.score > 0.7
                ? '#a855f7'
                : '#3f3f46';

              return (
                <line
                  key={idx}
                  x1={posA.x}
                  y1={posA.y}
                  x2={posB.x}
                  y2={posB.y}
                  stroke={strokeColor}
                  strokeWidth={isConnectedToFocus ? 2 : 1}
                  strokeOpacity={strokeOpacity}
                  strokeDasharray={conn.type === 'sequence' ? '3 3' : undefined}
                />
              );
            })}
          </g>

          {/* Nodes */}
          <g className="nodes">
            {Array.from(nodePositions.values()).map(pos => {
              const r = pos.receipt;
              const isSelected = selectedReceiptId === r.id;
              const isHovered = hoveredNodeId === r.id;
              const isHighlighted = highlightedIds === null || highlightedIds.has(r.id);
              const hexColor = getTypeHexColor(r.type);

              const radius = isSelected ? 12 : isHovered ? 10 : r.type === 'place' ? 9 : 7;
              const opacity = isHighlighted ? 1 : 0.15;

              return (
                <g
                  key={r.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  role="button"
                  tabIndex={0}
                  aria-label={'Open receipt node ' + r.title}
                  onClick={e => {
                    e.stopPropagation();
                    onSelectReceipt(r.id);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      onSelectReceipt(r.id);
                    }
                  }}
                  onMouseEnter={() => setHoveredNodeId(r.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  className="cursor-pointer transition-transform duration-150"
                  style={{ opacity }}
                >
                  {(isSelected || isHovered) && (
                    <circle
                      r={radius + 6}
                      fill="none"
                      stroke={hexColor}
                      strokeWidth="1.5"
                      strokeOpacity="0.4"
                      className="animate-ping"
                    />
                  )}

                  <circle
                    r={radius}
                    fill="#121217"
                    stroke={hexColor}
                    strokeWidth={isSelected ? 3 : 2}
                  />

                  <circle r={radius * 0.4} fill={hexColor} />

                  {(isSelected || isHovered || r.type === 'place' || (pos.connectedCount > 14 && zoom >= 1.15)) && (
                    <text
                      y={radius + 13}
                      textAnchor="middle"
                      fill={isSelected || isHovered ? '#ffffff' : '#a1a1aa'}
                      fontSize={isSelected ? '12px' : '10px'}
                      fontWeight={isSelected ? '600' : '400'}
                      className="font-sans pointer-events-none select-none"
                    >
                      {r.title.length > 24 ? r.title.slice(0, 22) + '…' : r.title}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {activeReceipts.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center p-4 bg-[#09090b]/80 backdrop-blur-sm pointer-events-auto">
            <div className="text-center space-y-3 max-w-sm">
              <span className="text-zinc-500 font-mono text-xs uppercase tracking-wider">Empty Topology</span>
              <p className="text-sm text-zinc-400">
                No receipts match this filter combination.
              </p>
              <button
                onClick={() => {
                  setTypeFilter('all');
                  setStrongOnly(false);
                  setRecurringPlacesOnly(false);
                }}
                className="px-4 py-2 rounded-xl bg-zinc-800 text-xs font-medium text-white hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none text-xs text-zinc-400 font-mono">
        <div className="p-2 px-3 rounded-xl bg-[#121217]/90 border border-zinc-800/90 shadow-xl backdrop-blur-md pointer-events-auto flex items-center gap-3">
          <span>{nodePositions.size} nodes mapped{activeReceipts.length > nodePositions.size ? ` · ${activeReceipts.length - nodePositions.size} condensed` : ""}</span>
          <span>•</span>
          <span>{activeConnections.length} correlation edges</span>
        </div>
        <div className="hidden sm:block p-2 px-3 rounded-xl bg-[#121217]/90 border border-zinc-800/90 shadow-xl backdrop-blur-md pointer-events-auto text-[11px]">
          Click any node to inspect evidence trail
        </div>
      </div>
    </div>
  );
};
