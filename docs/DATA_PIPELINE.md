# Data Pipeline

## Goal

LIFE//FORENSICS transforms heterogeneous source records into normalized events that can be correlated and explained.

## Pipeline

```text
1. Ingestion
      ↓
2. Validation
      ↓
3. Privacy Filtering
      ↓
4. Normalization
      ↓
5. Aggregation
      ↓
6. Correlation
      ↓
7. Pattern Detection
      ↓
8. Evidence Generation
      ↓
9. Confidence
      ↓
10. Query & Presentation
```

## 1. Ingestion

Source datasets are loaded and identified by their source type.

## 2. Validation

Required fields and timestamps are checked before temporal analysis.

Records with missing or unusable timestamps cannot reliably participate in time-based analysis.

## 3. Privacy Filtering

Fields that are unnecessary for behavioral analysis are excluded.

This reduces the amount of sensitive information entering the analytical layer.

## 4. Normalization

Source-specific records are converted into a common event representation.

This makes it possible to compare signals from different systems.

## 5. Aggregation

Raw records are aggregated into useful signals such as:

- Active days.
- Event counts.
- Recurring entities.
- Time-of-day distributions.
- Location recurrence.
- Source activity.

## 6. Correlation

Normalized signals are compared across:

- Date.
- Time.
- Source.
- Entity.
- Category.
- Location.

## 7. Pattern Detection

The system searches for recurring patterns, changes, and anomaly candidates.

## 8. Evidence Generation

Supporting records and measurable statistics are collected for each discovery.

## 9. Confidence

The deterministic evidence model considers factors such as:

- Evidence volume.
- Recurrence.
- Cross-source support.
- Signal strength.
- Temporal consistency.

Confidence is a measure of the implemented evidence model, not objective truth.

## 10. Query & Presentation

The investigation query layer maps supported questions to measurable evidence. Results are presented through the investigation interface.

## Guardrails

The pipeline does not intentionally infer causation from correlation.

An anomaly candidate is a deviation from a defined pattern, not a declaration that something is wrong.
