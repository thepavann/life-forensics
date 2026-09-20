// src/components/DatasetUploadModal.tsx
import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, CheckCircle2, AlertCircle, FileJson, Loader2, Sparkles } from 'lucide-react';
import type { RawReceipt } from '../types/receipt';

interface DatasetUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDatasetLoaded: (raw: RawReceipt[]) => void;
}

type UploadState = 'idle' | 'dragging' | 'parsing' | 'preview' | 'error';

interface ParsedPreview {
  totalRecords: number;
  typeCounts: Record<string, number>;
  dateRange: { min: string; max: string };
  raw: RawReceipt[];
}

const VALID_TYPES = ['music','movie','place','purchase','photo','message','search','event','note'];
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_RECORDS = 50000;

const TYPE_COLORS: Record<string, string> = {
  music: '#34d399', movie: '#818cf8', place: '#fbbf24',
  purchase: '#2dd4bf', photo: '#fb7185', message: '#38bdf8',
  search: '#fb923c', event: '#c084fc', note: '#94a3b8'
};

function parseRawFile(text: string): ParsedPreview {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('Invalid JSON — could not parse file.');
  }
  const records: RawReceipt[] = Array.isArray(parsed) ? (parsed as RawReceipt[]) : [];
  if (records.length === 0) throw new Error('No records found. Expected a JSON array of receipt objects.');
  if (records.length > MAX_RECORDS) throw new Error('Dataset is too large. Maximum supported size is 50,000 records.');
  for (const r of records) {
    if (!r || typeof r !== 'object' || !r.id || !r.type || !r.timestamp) throw new Error('Every record must have id, type, and timestamp fields.');
    if (Number.isNaN(new Date(String(r.timestamp)).getTime())) throw new Error('Every record must contain a valid timestamp.');
  }
  const typeCounts: Record<string, number> = {};
  let minDate = '';
  let maxDate = '';
  for (const r of records) {
    const t = String(r.type);
    typeCounts[t] = (typeCounts[t] || 0) + 1;
    if (r.timestamp) {
      const d = String(r.timestamp).slice(0, 10);
      if (!minDate || d < minDate) minDate = d;
      if (!maxDate || d > maxDate) maxDate = d;
    }
  }
  return { totalRecords: records.length, typeCounts, dateRange: { min: minDate, max: maxDate }, raw: records };
}

export const DatasetUploadModal: React.FC<DatasetUploadModalProps> = ({ isOpen, onClose, onDatasetLoaded }) => {
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [preview, setPreview] = useState<ParsedPreview | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    setUploadState('idle'); setPreview(null); setErrorMsg(''); setFileName('');
  }, []);

  const handleClose = useCallback(() => { reset(); onClose(); }, [reset, onClose]);

  const processFile = useCallback((file: File) => {
    if (!file.name.toLowerCase().endsWith('.json')) { setUploadState('error'); setErrorMsg('Please upload a .json file.'); return; }
    if (file.size > MAX_FILE_BYTES) { setUploadState('error'); setErrorMsg('File is too large. Maximum supported size is 10 MB.'); return; }
    setFileName(file.name);
    setUploadState('parsing');
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const p = parseRawFile(e.target?.result as string);
        setPreview(p);
        setUploadState('preview');
      } catch (err) {
        setUploadState('error');
        setErrorMsg((err as Error).message);
      }
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setUploadState('idle');
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleConfirm = useCallback(() => {
    if (preview) { onDatasetLoaded(preview.raw); handleClose(); }
  }, [preview, onDatasetLoaded, handleClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-center justify-center px-4"
          onClick={handleClose}
        >
          <div className="absolute inset-0 bg-[#07070a]/90 backdrop-blur-xl" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dataset-upload-title"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md glass-card rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Animated top border */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.05]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <Upload size={16} className="text-purple-400" />
                </div>
                <div>
                  <h2 id="dataset-upload-title" className="text-sm font-semibold text-white tracking-tight">Upload Dataset</h2>
                  <p className="text-xs text-zinc-500 mt-0.5">Load your own life receipts JSON</p>
                </div>
              </div>
              <button type="button" onClick={handleClose} aria-label="Close dataset upload" className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                <X size={15} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <AnimatePresence mode="wait">
                {(uploadState === 'idle' || uploadState === 'dragging') && (
                  <motion.div key="drop" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    <div
                      onDrop={handleDrop}
                      onDragOver={(e) => { e.preventDefault(); setUploadState('dragging'); }}
                      onDragLeave={() => setUploadState('idle')}
                      onClick={() => fileInputRef.current?.click()}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
                      role="button"
                      tabIndex={0}
                      aria-label="Choose a JSON dataset to upload"
                      className={`relative flex flex-col items-center justify-center gap-4 py-12 px-6 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
                        uploadState === 'dragging' ? 'animate-dropzone-pulse' : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
                      }`}
                    >
                      <motion.div
                        animate={uploadState === 'dragging' ? { scale: 1.15, rotate: 5 } : { scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', damping: 15 }}
                        className={`p-4 rounded-2xl ${uploadState === 'dragging' ? 'bg-indigo-500/15 border border-indigo-500/30' : 'bg-white/[0.04] border border-white/[0.07]'}`}
                      >
                        <Upload size={22} className={uploadState === 'dragging' ? 'text-indigo-400' : 'text-zinc-400'} />
                      </motion.div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-zinc-200">{uploadState === 'dragging' ? 'Release to upload' : 'Drop your JSON file here'}</p>
                        <p className="text-xs text-zinc-500 mt-1">or <span className="text-zinc-300 underline underline-offset-2 cursor-pointer">click to browse</span></p>
                      </div>
                      <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">.json • receipts array format</div>
                    </div>
                    <input ref={fileInputRef} type="file" accept=".json" onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }} className="hidden" />

                    <div className="mt-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1.5">
                      <div className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Expected format</div>
                      <pre className="text-[10px] text-zinc-400 font-mono leading-relaxed overflow-x-auto">{`[{ "id": "...", "type": "music|place|...", "timestamp": "2026-03-15T10:30:00Z", "title": "..." }]`}</pre>
                    </div>
                  </motion.div>
                )}

                {uploadState === 'parsing' && (
                  <motion.div key="parse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-14 gap-5">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                        <Loader2 size={22} className="text-purple-400 animate-spin" />
                      </div>
                      <div className="absolute inset-0 rounded-full bg-purple-500/10 animate-ping" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-white">Analyzing {fileName}</p>
                      <p className="text-xs text-zinc-500 mt-1">Running forensic pattern engine…</p>
                    </div>
                    <div className="w-full space-y-2">
                      {[75, 55, 65, 45].map((w, i) => (
                        <div key={i} className="skeleton h-3" style={{ width: `${w}%`, animationDelay: `${i * 0.1}s` }} />
                      ))}
                    </div>
                  </motion.div>
                )}

                {uploadState === 'preview' && preview && (
                  <motion.div key="preview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-emerald-300">Parsed successfully</p>
                        <p className="text-[11px] text-emerald-500 font-mono mt-0.5">{fileName}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Records', value: preview.totalRecords },
                        { label: 'Types', value: Object.keys(preview.typeCounts).length },
                        { label: 'From', value: preview.dateRange.min.slice(0,7) || '—' }
                      ].map((s) => (
                        <div key={s.label} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                          <div className="text-xl font-bold text-white stat-number">{s.value}</div>
                          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wide mt-0.5">{s.label}</div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider mb-2">Type breakdown</div>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(preview.typeCounts).map(([type, count]) => (
                          <div key={type} className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-mono bg-white/[0.04] border border-white/[0.07]">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: TYPE_COLORS[type] || '#888' }} />
                            <span className="text-zinc-300">{type}</span>
                            <span className="text-zinc-600">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {Object.keys(preview.typeCounts).some(t => !VALID_TYPES.includes(t)) && (
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/8 border border-amber-500/20 text-xs text-amber-300">
                        <AlertCircle size={13} className="shrink-0 mt-0.5" />
                        <span>Some unknown types detected — treated as generic receipts.</span>
                      </div>
                    )}
                    <div className="flex gap-2 pt-1">
                      <button onClick={handleConfirm} className="flex-1 px-4 py-2.5 rounded-xl bg-white text-zinc-950 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-zinc-100 transition-all cursor-pointer shadow-lg">
                        <Sparkles size={14} />
                        <span>Analyze this dataset</span>
                      </button>
                      <button onClick={reset} className="px-3 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer">
                        <FileJson size={15} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {uploadState === 'error' && (
                  <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/8 border border-red-500/20">
                      <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-300">Upload failed</p>
                        <p className="text-xs text-red-400/70 mt-1">{errorMsg}</p>
                      </div>
                    </div>
                    <button onClick={reset} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] text-sm text-zinc-300 hover:text-white transition-colors cursor-pointer">
                      Try again
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
