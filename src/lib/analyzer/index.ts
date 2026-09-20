// src/lib/analyzer/index.ts
import type { RawReceipt, NormalizedReceipt, Connection, Chapter, Discovery, LifeStatistics } from '../../types/receipt';
import { normalizeAllReceipts } from './normalizer';
import { computeConnections } from './connections';
import { discoverChapters } from './chapters';
import { discoverPatterns } from './insights';
import { computeStatistics } from './statistics';
import { computePersonalBaseline } from './baseline';

export interface ForensicsDataset {
  raw: RawReceipt[];
  receipts: NormalizedReceipt[];
  receiptMap: Map<string, NormalizedReceipt>;
  connections: Connection[];
  adjacencyMap: Map<string, Connection[]>;
  chapters: Chapter[];
  chapterMap: Map<string, Chapter>;
  discoveries: Discovery[];
  statistics: LifeStatistics;
  baseline: ReturnType<typeof computePersonalBaseline>;
}

let cachedDefaultDataset: Promise<ForensicsDataset> | null = null;

export function analyzeDataset(rawInput: RawReceipt[]): ForensicsDataset {
  const receipts = normalizeAllReceipts(rawInput);

  const receiptMap = new Map<string, NormalizedReceipt>();
  for (const r of receipts) {
    receiptMap.set(r.id, r);
  }

  const { connections, adjacencyMap } = computeConnections(receipts);
  const chapters = discoverChapters(receipts);

  const chapterMap = new Map<string, Chapter>();
  for (const ch of chapters) {
    chapterMap.set(ch.id, ch);
  }

  const discoveries = discoverPatterns(receipts, connections);
  const statistics = computeStatistics(receipts, chapters, connections);
  const baseline = computePersonalBaseline(receipts);

  return {
    raw: rawInput,
    receipts,
    receiptMap,
    connections,
    adjacencyMap,
    chapters,
    chapterMap,
    discoveries,
    statistics,
    baseline
  };
}

/**
 * The production dataset is loaded as a separate Vite chunk instead of being
 * embedded in the initial application module. This keeps the first paint small
 * while preserving the deterministic real-data analysis pipeline.
 */
export function getForensicsData(customRaw?: RawReceipt[]): Promise<ForensicsDataset> {
  if (customRaw) {
    return Promise.resolve(analyzeDataset(customRaw));
  }

  if (!cachedDefaultDataset) {
    cachedDefaultDataset = import('../../data/raw_receipts.json').then(module =>
      analyzeDataset(module.default as RawReceipt[])
    );
  }

  return cachedDefaultDataset;
}
