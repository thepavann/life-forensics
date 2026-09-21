# Methodology

## Purpose

LIFE//FORENSICS is designed to make behavioral analysis inspectable rather than presenting opaque conclusions.

The system distinguishes between measurable observations, correlations, anomaly candidates, and interpretations.

## Analytical Levels

### Observation

A measurable event exists in the dataset.

Example:

> 184 events occurred between 00:00 and 06:00.

### Correlation

Two or more signals repeatedly occur together.

Example:

> Music activity and transaction activity overlap on multiple dates.

Correlation does not establish causation.

### Anomaly Candidate

A signal differs from a defined historical or statistical pattern.

Example:

> Activity during a time window is substantially higher than the individual's historical baseline.

An anomaly candidate does not mean the behavior is abnormal or harmful.

### Interpretation

A possible explanation for a detected pattern.

Interpretations should be presented as possibilities and should not be stated as established facts without supporting evidence.

## Personal Baseline

Where sufficient history exists, the system can compare current activity against an individual's own historical behavior.

This helps avoid treating every deviation from a generic threshold as unusual.

## Cross-Source Correlation

Signals are compared across common dimensions:

- Date.
- Time.
- Source.
- Entity.
- Category.
- Location.

The system surfaces relationships but does not automatically infer causal relationships.

## Anomaly Signals

Potential anomaly signals include:

- Unusual time activity.
- Activity spikes.
- Frequency deviations.
- New location clusters.
- Historical-baseline deviations.
- Temporal concentration.

These are candidates for investigation.

## Confidence Model

The documented confidence model classifies evidence strength:

| Score | Classification |
|---:|---|
| 90–99 | HIGH |
| 75–89 | MEDIUM |
| Below 75 | LOW |

Confidence may incorporate:

- Evidence volume.
- Recurrence.
- Cross-source support.
- Signal strength.
- Temporal consistency.

Confidence is **not** a probability that an interpretation is objectively true.

## Explainability

A discovery should expose:

1. What was detected.
2. Supporting evidence.
3. Contributing sources.
4. Reasoning used by the implemented model.
5. Confidence classification.
6. Known limitations.

## Limitations

- Correlation does not establish causation.
- Anomaly candidates are not diagnoses or judgments.
- Dataset-provided labels are not independently verified by LIFE//FORENSICS.
- Missing timestamps limit temporal analysis.
- Location strings do not imply precise physical positioning.
- Confidence reflects the implemented evidence model.
