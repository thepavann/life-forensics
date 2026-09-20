// src/lib/analyzer/connections.ts
import type { NormalizedReceipt, Connection } from '../../types/receipt';

export interface ScoredConnectionResult {
  connections: Connection[];
  adjacencyMap: Map<string, Connection[]>;
}

/**
 * Scalable connection synthesis for large real-world datasets.
 * We connect meaningful neighbors rather than comparing every pair (O(n²)).
 */
export function computeConnections(receipts: NormalizedReceipt[]): ScoredConnectionResult {
  const connections: Connection[] = [];
  const adjacencyMap = new Map<string, Connection[]>();
  receipts.forEach(r => adjacencyMap.set(r.id, []));

  const add = (a: NormalizedReceipt, b: NormalizedReceipt, score: number, reasons: string[], type: Connection['type']) => {
    if (a.id === b.id) return;
    const conn: Connection = {
      sourceId: a.id,
      targetId: b.id,
      score: Math.min(1, Number(score.toFixed(2))),
      reasons,
      type
    };
    connections.push(conn);
    adjacencyMap.get(a.id)?.push(conn);
    adjacencyMap.get(b.id)?.push({ ...conn, sourceId: b.id, targetId: a.id });
  };

  // Same calendar day: connect nearby events only.
  const dayIndex = new Map<string, NormalizedReceipt[]>();
  for (const r of receipts) {
    const key = r.dateObj.toISOString().slice(0, 10);
    const list = dayIndex.get(key) || [];
    list.push(r);
    dayIndex.set(key, list);
  }
  dayIndex.forEach(list => {
    list.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
    // Keep the graph readable: each event connects to its closest two neighbors.
    for (let i = 0; i < list.length; i++) {
      for (const j of [i - 1, i + 1]) {
        if (j < 0 || j >= list.length) continue;
        const a = list[i], b = list[j];
        const mins = Math.round(Math.abs(a.dateObj.getTime() - b.dateObj.getTime()) / 60000);
        if (mins <= 180) {
          add(a, b, mins <= 30 ? 0.85 : 0.58, [`Occurred ${mins} minutes apart`, 'Same calendar day'], 'temporal');
        }
      }
    }
  });

  // Same location: connect consecutive visits.
  const locationIndex = new Map<string, NormalizedReceipt[]>();
  for (const r of receipts) {
    if (!r.location) continue;
    const key = r.location.toLowerCase();
    const list = locationIndex.get(key) || [];
    list.push(r);
    locationIndex.set(key, list);
  }
  locationIndex.forEach(list => {
    list.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
    for (let i = 1; i < list.length; i++) {
      add(list[i - 1], list[i], 0.72, [`Same location: ${list[i].location}`], 'spatial');
    }
  });

  // Same music artist: connect consecutive listening summaries.
  const artistIndex = new Map<string, NormalizedReceipt[]>();
  for (const r of receipts) {
    if (r.type !== 'music' || !r.metadata?.artist) continue;
    const key = String(r.metadata.artist).toLowerCase();
    const list = artistIndex.get(key) || [];
    list.push(r);
    artistIndex.set(key, list);
  }
  artistIndex.forEach(list => {
    list.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
    for (let i = 1; i < list.length; i++) {
      add(list[i - 1], list[i], 0.62, [`Shared artist: ${list[i].metadata.artist}`], 'entity');
    }
  });

  // Deduplicate undirected edges.
  const unique = new Map<string, Connection>();
  for (const c of connections) {
    const key = c.sourceId < c.targetId ? `${c.sourceId}|${c.targetId}` : `${c.targetId}|${c.sourceId}`;
    if (!unique.has(key) || unique.get(key)!.score < c.score) unique.set(key, c);
  }

  const finalConnections = Array.from(unique.values());

  // Rebuild adjacency from the deduplicated edge set so the graph and edge list
  // always describe the same relationship model.
  const finalAdjacencyMap = new Map<string, Connection[]>();
  receipts.forEach(r => finalAdjacencyMap.set(r.id, []));
  for (const conn of finalConnections) {
    finalAdjacencyMap.get(conn.sourceId)?.push(conn);
    finalAdjacencyMap.get(conn.targetId)?.push({ ...conn, sourceId: conn.targetId, targetId: conn.sourceId });
  }
  finalAdjacencyMap.forEach(conns => conns.sort((a, b) => b.score - a.score));
  return { connections: finalConnections, adjacencyMap: finalAdjacencyMap };
}
