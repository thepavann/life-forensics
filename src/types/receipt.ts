// src/types/receipt.ts

export type ReceiptType =
  | 'music'
  | 'movie'
  | 'place'
  | 'purchase'
  | 'photo'
  | 'message'
  | 'search'
  | 'event'
  | 'note';

export interface RawReceipt {
  id: string;
  type: string;
  title: string;
  timestamp: string;
  location?: string;
  description?: string;
  metadata?: Record<string, any>;
  tags?: string[];
}

export interface NormalizedReceipt {
  id: string;
  type: ReceiptType;
  title: string;
  timestamp: string;
  dateObj: Date;
  dateFormatted: string;
  timeFormatted: string;
  location?: string;
  description: string;
  metadata: Record<string, any>;
  tags: string[];
  chapterId?: string;
  chapterTitle?: string;
}

export interface Connection {
  sourceId: string;
  targetId: string;
  score: number; // 0.0 to 1.0
  reasons: string[];
  type: 'temporal' | 'spatial' | 'entity' | 'sequence' | 'narrative';
}

export interface Chapter {
  id: string;
  number: string; // e.g. "01", "03"
  title: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  dateRangeFormatted: string;
  receiptCount: number;
  typeCounts: Partial<Record<ReceiptType, number>>;
  keyPlaces: string[];
  keyEntities: string[];
  receipts: NormalizedReceipt[];
  sequenceFlow: { type: ReceiptType; label: string; receiptId: string }[];
  narrative: string;
}

export interface DiscoveryEvidence {
  label: string;
  value: string | number;
}

export interface Discovery {
  confidence: number;
  confidenceLabel?: string;
  id: string;
  title: string;
  explanation: string;
  evidenceCount: number;
  involvedTypes: ReceiptType[];
  receiptIds: string[];
  reasons: string[];
  chapterId?: string;
  category: 'location_recurrence' | 'sequence' | 'cross_chapter' | 'behavioral_burst' | 'entity_cluster';
}

export interface ActivityPulsePoint {
  date: string; // YYYY-MM-DD
  label: string; // e.g. "Feb 14"
  count: number;
  dominantTypes: ReceiptType[];
  receiptIds: string[];
}

export interface LifeStatistics {
  totalReceipts: number;
  dateRange: {
    start: string;
    end: string;
    daysSpan: number;
  };
  typeDistribution: Record<ReceiptType, number>;
  uniquePlacesCount: number;
  uniquePlaces: string[];
  totalConnections: number;
  totalChapters: number;
  topEntities: { name: string; count: number }[];
  activityPulse: ActivityPulsePoint[];
  sourceStats: { source: string; count: number; start: string; end: string }[];
  weekdayCounts: { day: string; count: number }[];
  hourlyCounts: { hour: number; count: number }[];
  monthlyCounts: { month: string; count: number }[];
  multiSourceDays: number;
  lateNightPurchases: number;
  sourceFraudLabels: number;
}

export interface PersonalBaselineSummary {
  historical: {
    start: string;
    end: string;
    activeDays: number;
    totalSignals: number;
    dailyAverage: number;
    peakStartHour: number;
    peakEndHour: number;
  };
  recent: {
    start: string;
    end: string;
    activeDays: number;
    totalSignals: number;
    dailyAverage: number;
    peakStartHour: number;
    peakEndHour: number;
  };
  deviationPercent: number;
  status: 'stable' | 'elevated' | 'reduced';
  evidenceDays: number;
}

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
  baseline: PersonalBaselineSummary | null;
}
