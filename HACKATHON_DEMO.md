# LIFE//FORENSICS — Hackathon Demo Playbook

## One-line pitch

**LIFE//FORENSICS is a privacy-first behavioral reconstruction engine that turns fragmented digital traces into an explainable personal graph.**

## What the current build actually demonstrates

- 18,133 normalized signals from three supplied source streams.
- 3,017 active calendar days across July 2013–December 2024.
- 7,413 Spotify-derived daily music signals.
- 10,720 purchase/transaction signals.
- 1,209 location strings retained after privacy filtering.
- Indexed relationship synthesis instead of O(n²) all-to-all comparison.
- Evidence-backed discoveries with confidence labels.
- Interactive Activity Pulse and Life Graph/Atlas.
- Source fraud labels are reported as dataset labels, not independently detected fraud.

## Judge demo sequence

1. Start on the cinematic case-file screen.
2. Say: “These records are fragmented. LIFE//FORENSICS reconstructs relationships without requiring raw identity fields.”
3. Enter the Story. Point to the live signal count and the privacy layer.
4. Hover the Activity Pulse and click a dense period.
5. Open a discovery and show **Why We Found This**. Emphasize confidence + evidence.
6. Open Atlas and click a node to reveal its evidence trail.
7. Open Chapters and show how the archive is segmented over time.
8. Open Receipts and search a real artist/category/merchant.
9. Explain the privacy boundary: card numbers, names, street addresses, DOB, customer IDs and raw coordinates are excluded from the frontend dataset.

## Technical story

```text
Raw sources
   ↓
Normalization + privacy filtering
   ↓
Feature extraction
   ↓
Indexed correlation engine
   ├── temporal proximity
   ├── repeated entities
   ├── recurring locations
   └── cross-source date convergence
   ↓
Pattern candidates + evidence + confidence
   ↓
Life Graph / Pulse / Chapters / Receipt archive
```

## Important wording

Say **“pattern candidate”**, **“correlation”**, and **“source label”** where appropriate. Do not claim that a statistical correlation proves causation or that the supplied fraud flag is an independent fraud verdict.

## Local run

```bash
npm install
npm run verify
npm run build
npm run dev
```

`npm run verify` should report 18,133 normalized records and pass the real-data checks.
