# LIFE//FORENSICS Architecture

## Overview

LIFE//FORENSICS uses a layered architecture that separates data ingestion, privacy filtering, normalization, analysis, evidence generation, and presentation.

```text
Data Sources
     ↓
Privacy Filter
     ↓
Normalizer
     ↓
Correlation / Analysis
     ↓
Pattern Detection
     ↓
Evidence Engine
     ↓
Confidence + Reasoning
     ↓
React Experience Layer
```

## Layers

### 1. Data Sources

The prototype can combine heterogeneous signals such as:

- Music activity.
- Transactions.
- Household activity.
- Timestamps.
- Locations.
- Categories.
- Recurring entities.

### 2. Privacy Filter

Sensitive fields that are not required for analysis are removed before behavioral processing.

### 3. Normalizer

Different source schemas are converted into a common event representation.

A normalized event can contain concepts such as:

- Event ID.
- Timestamp.
- Source.
- Entity.
- Category.
- Location.
- Event type.

### 4. Analysis Layer

The analysis layer derives:

- Temporal patterns.
- Cross-source overlaps.
- Recurrence.
- Frequency changes.
- Historical baselines.
- Anomaly candidates.

### 5. Evidence Engine

Each discovery is backed by measurable evidence such as event volume, recurrence, source support, and temporal consistency.

### 6. Experience Layer

The React application exposes the analysis through:

- Story.
- Atlas.
- Chapters.
- Investigation.
- Receipts.
- Timeline.
- Life Graph.

## Application Structure

```text
React UI
   ↓
AppShell + domain hooks
   ↓
Dataset service / validation
   ↓
Deterministic analysis orchestrator
   ↓
Normalizer / correlation / baseline / query engines
   ↓
Evidence + confidence model
```

The application keeps dataset loading and analysis concerns separate from view rendering so the UI can evolve without changing the underlying analysis contract.

## Reliability Boundaries

The application is designed to:

- Reject invalid receipt timestamps.
- Avoid fabricating dates.
- Generate deterministic IDs from source records.
- Strip sensitive metadata during normalization.
- Bound uploaded JSON by size and record count.
- Keep graph adjacency consistent with deduplicated edges.
- Use an error boundary around rendering failures.

## Design Principle

The core product principle is:

**Explainable reconstruction rather than visualization alone.**
