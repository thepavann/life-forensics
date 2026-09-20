// src/lib/analyzer/index.ts
import rawData from '../../data/raw_receipts.json';
import type { RawReceipt, NormalizedReceipt, Connection, Chapter, Discovery, LifeStatistics } from '../../types/receipt';
import { normalizeAllReceipts } from './normalizer';
import { computeConnections } from './connections';
import { discoverChapters } from './chapters';
import { discoverPatterns } from './insights';
import { computeStatistics } from './statistics';

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
}

let cachedDefaultDataset: ForensicsDataset | null = null;

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

  return {
    raw: rawInput,
    receipts,
    receiptMap,
    connections,
    adjacencyMap,
    chapters,
    chapterMap,
    discoveries,
    statistics
  };
}

export function getForensicsData(customRaw?: RawReceipt[]): ForensicsDataset {
  if (customRaw) {
    return analyzeDataset(customRaw);
  }
  if (!cachedDefaultDataset) {
    cachedDefaultDataset = analyzeDataset(rawData as RawReceipt[]);
  }
  return cachedDefaultDataset;
}
