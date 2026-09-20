# LIFE//FORENSICS

### From fragmented traces to explainable discoveries.

<p align="center">
  <strong>Privacy-first behavioral intelligence for fragmented personal data.</strong>
</p>

<p align="center">
  <a href="https://github.com/thepavann/life-forensics">
    <img src="https://img.shields.io/badge/GitHub-LIFE%2F%2FFORENSICS-181717?style=for-the-badge&logo=github" />
  </a>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss" />
</p>

---

## Overview

**LIFE//FORENSICS** is a privacy-first behavioral intelligence platform that transforms fragmented personal datasets into an interactive and explainable view of activity over time.

Modern personal data is distributed across multiple systems — music platforms, transactions, household records, timestamps, locations and other digital traces.

LIFE//FORENSICS brings these heterogeneous signals together through a unified analysis pipeline.

Instead of simply asking:

> **What happened?**

LIFE//FORENSICS explores:

> **What patterns can be reconstructed from the available evidence, and why was a particular discovery made?**

The platform combines:

**Data ingestion → Privacy filtering → Normalization → Cross-source correlation → Pattern detection → Evidence → Explainable discoveries**

---

## The Problem

Personal data is fragmented.

A user's activity may be distributed across completely different systems:

* Music platforms
* Transaction records
* Household activity
* Locations
* Timestamps
* Categories
* Repeated behavioral events

Traditional dashboards generally analyze these sources independently.

As a result:

* Cross-source relationships remain hidden.
* Long-term changes are difficult to identify.
* Raw records are difficult to interpret.
* Generic anomaly thresholds may ignore individual behavior.
* Black-box conclusions are difficult to verify.
* Sensitive information can be exposed unnecessarily.

---

# The Solution

LIFE//FORENSICS converts heterogeneous records into a common analytical representation and then builds an evidence trail around detected patterns.

```text
┌─────────────────────────────────────┐
│            DATA SOURCES             │
│                                     │
│ Spotify • Transactions • Household  │
└──────────────────┬──────────────────┘
                   ↓
┌─────────────────────────────────────┐
│          PRIVACY FILTER             │
│                                     │
│ Sensitive-field exclusion           │
└──────────────────┬──────────────────┘
                   ↓
┌─────────────────────────────────────┐
│            NORMALIZER               │
│                                     │
│ Time • Source • Entity • Category   │
│ Location • Event                    │
└──────────────────┬──────────────────┘
                   ↓
┌─────────────────────────────────────┐
│        CORRELATION ENGINE           │
│                                     │
│ Temporal • Source • Entity signals  │
└──────────────────┬──────────────────┘
                   ↓
┌─────────────────────────────────────┐
│          FORENSIC ENGINE            │
│                                     │
│ Patterns • Baselines • Anomalies    │
└──────────────────┬──────────────────┘
                   ↓
┌─────────────────────────────────────┐
│          EVIDENCE ENGINE            │
│                                     │
│ Evidence • Confidence • Reasoning   │
│ Limitations                         │
└──────────────────┬──────────────────┘
                   ↓
┌─────────────────────────────────────┐
│          EXPERIENCE LAYER           │
│                                     │
│ Timeline • Atlas • Life Graph       │
│ Investigation Console               │
└─────────────────────────────────────┘
```

---

# Core Features

## 01. Investigation Console

The Investigation Console provides an interface for exploring the dataset through behavioral questions and discoveries.

Examples:

* What patterns exist across my data?
* What changed over time?
* Which sources overlap?
* Which activities recur?
* What activity differs from the historical baseline?
* What evidence supports a discovery?

The objective is to connect investigation questions with measurable evidence.

---

## 02. Life Graph

The **Life Graph** provides a connected representation of activity.

```text
                    MUSIC
                      │
                      │
                      ▼
LOCATION ───────── LIFE ───────── TRANSACTIONS
                      │
                      │
                      ▼
                     TIME
```

The graph connects dimensions such as:

* Time
* Location
* Music
* Transactions
* Categories
* Recurring entities

This allows users to explore relationships instead of isolated charts.

---

## 03. Life Timeline

The Timeline provides a longitudinal view of activity.

```text
2013 ─── 2015 ─── 2017 ─── 2019 ─── 2021 ─── 2024
  │        │        │        │        │        │
 EVENTS   MUSIC   ROUTINE   CHANGE   SPIKE   CURRENT
```

Users can investigate:

* Active periods
* Activity concentration
* Recurring patterns
* Changes between periods
* Source activity
* Temporal relationships

---

## 04. Anomaly Radar

LIFE//FORENSICS identifies **anomaly candidates** rather than automatically declaring activity abnormal.

Potential signals include:

* Unusual time activity
* Activity spikes
* Frequency deviations
* New location clusters
* Historical-baseline deviations
* Temporal concentration

Example:

```text
ANOMALY CANDIDATE

Late-night activity

184 events
00:00 – 06:00

Evidence:
12 recurring dates
3 categories
7 locations
```

The evidence is surfaced so that the user can investigate the pattern.

---

## 05. Personal Baseline

Behavior that is unusual in a general population may be normal for an individual.

Where sufficient historical data exists, LIFE//FORENSICS can compare activity against an individual's historical baseline.

```text
HISTORICAL BASELINE

Typical:
18:00 – 22:00

Observed:
22:00 – 02:00

Deviation:
+41%
```

This provides contextual analysis rather than relying exclusively on generic thresholds.

---

## 06. Cross-Source Correlation

One of the central concepts of LIFE//FORENSICS is connecting independent data streams.

```text
Spotify
   │
   │ Date / Time
   ▼
┌────────────────────┐
│ CORRELATION ENGINE │
└────────────────────┘
   ▲
   │ Date / Time
   │
Transactions
```

The system can identify:

* Multi-source active days
* Temporal overlap
* Recurring entities
* Repeated categories
* Location recurrence
* Cross-source activity patterns

> **Correlation is presented as correlation — not as proof of causation.**

---

## 07. Explainable Discoveries

A discovery is not presented as a black-box conclusion.

The system exposes supporting context such as:

```text
DISCOVERY

Recurring evening activity

82% CONFIDENCE

Evidence
143 events
31 active days
3 contributing sources

Reasoning
Repeated temporal clustering
was detected during evening hours.

Limitation
Correlation does not establish causation.
```

This makes discoveries easier to inspect and challenge.

---

# Confidence Model

The current deterministic evidence model assigns confidence levels to discoveries.

| Score | Classification |
| ----: | -------------- |
| 90–99 | HIGH           |
| 75–89 | MEDIUM         |
|   <75 | LOW            |

Confidence is based on characteristics of the detected evidence, such as:

* Evidence volume
* Recurrence
* Cross-source support
* Signal strength
* Temporal consistency

**Confidence is not a probability that an interpretation is objectively true.**

It represents the strength of the implemented evidence model.

---

# Privacy by Design

Privacy is integrated into the data-processing pipeline.

The source transaction dataset contains sensitive fields that are not required for the behavioral analysis.

The analytical layer excludes fields such as:

```text
cc_num
first
last
gender
street
dob
customer_id
lat
long
merch_lat
merch_long
```

### Privacy Pipeline

```text
RAW DATA
   ↓
FIELD VALIDATION
   ↓
SENSITIVE FIELD EXCLUSION
   ↓
SIGNAL EXTRACTION
   ↓
NORMALIZED EVENTS
   ↓
BEHAVIORAL ANALYSIS
   ↓
EXPLAINABLE OUTPUT
```

The goal is to preserve analytical value while minimizing unnecessary exposure of identifying information.

---

# Real Dataset

The current prototype uses real datasets rather than fabricated demonstration records.

### Current normalized dataset

| Metric              |         Value |
| ------------------- | ------------: |
| Total records       |    **18,133** |
| Music records       |     **7,413** |
| Transaction records |    **10,720** |
| Active days         |     **3,017** |
| Location strings    |     **1,209** |
| Date coverage       | **2013–2024** |

### Source datasets

#### Spotify

* 149,860 raw records
* 7,413 derived music signals

#### Transactions

* 10,267 raw records
* 9,417 timestamp-usable records

#### Household Transactions

* 2,461 raw records
* 1,303 timestamp-usable records

Records with missing or unusable timestamps are excluded from temporal analysis.

---

# Data Processing Pipeline

### 1. Ingestion

Load heterogeneous source datasets.

### 2. Validation

Validate required fields and timestamps.

### 3. Privacy Filtering

Exclude unnecessary identifying information.

### 4. Normalization

Convert different schemas into a common event representation.

### 5. Aggregation

Derive useful behavioral signals from raw records.

### 6. Correlation

Compare signals across:

* Dates
* Time
* Sources
* Entities
* Categories
* Locations

### 7. Pattern Detection

Identify recurring patterns and anomaly candidates.

### 8. Evidence Generation

Collect the data supporting each discovery.

### 9. Confidence

Calculate the strength of the implemented evidence model.

### 10. Presentation

Expose findings through the investigation interface.

---

# Technical Architecture

```text
                    ┌──────────────┐
                    │   Spotify    │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │ Transactions │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │  Household   │
                    └──────┬───────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Privacy Filter  │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │  Normalization  │
                  └────────┬────────┘
                           │
                           ▼
              ┌──────────────────────────┐
              │    Analysis Pipeline     │
              │                          │
              │ Temporal Analysis        │
              │ Cross-source Correlation │
              │ Recurrence Detection     │
              │ Baseline Analysis        │
              │ Anomaly Candidates       │
              └────────────┬─────────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Evidence Engine │
                  └────────┬────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │ Confidence + Reason │
                └──────────┬──────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │    React Interface     │
              │                        │
              │ Story                  │
              │ Atlas                  │
              │ Chapters               │
              │ Receipts               │
              │ Investigation Console  │
              └────────────────────────┘
```

---

# Technology Stack

### Frontend

* **React 19**
* **TypeScript**
* **Vite**
* **Tailwind CSS**
* **Framer Motion**
* **Lucide React**

### Analysis

* TypeScript
* Data normalization
* Temporal aggregation
* Cross-source correlation
* Frequency analysis
* Historical baseline comparison
* Deterministic evidence scoring

### Development

* Node.js
* npm
* Git
* GitHub
* ESLint

---

# Project Structure

```text
life-forensics/
│
├── public/
│
├── scripts/
│   └── verify_app.js
│
├── src/
│   ├── components/
│   │
│   ├── views/
│   │   ├── StoryView.tsx
│   │   ├── AtlasView.tsx
│   │   ├── ChaptersView.tsx
│   │   ├── InvestigationView.tsx
│   │   └── ReceiptsView.tsx
│   │
│   ├── lib/
│   │   └── analyzer/
│   │       ├── normalizer
│   │       ├── connections
│   │       ├── insights
│   │       ├── statistics
│   │       └── chapters
│   │
│   ├── types/
│   │   └── receipt.ts
│   │
│   └── App.tsx
│
├── HACKATHON_DEMO.md
├── README.md
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

---

# Installation

## Requirements

* Node.js 18+
* npm
* Git

## Clone

```bash
git clone https://github.com/thepavann/life-forensics.git
cd life-forensics
```

## Install dependencies

```bash
npm install
```

## Start development server

```bash
npm run dev
```

Open the Vite URL displayed in the terminal.

---

# Verification

The repository includes a real-data verification script.

Run:

```bash
npm run verify
```

Expected output:

```text
=== VERIFYING LIFE//FORENSICS REAL DATA ENGINE ===

[1] Raw dataset: 18,133 records
[2] Type breakdown:
    music: 7413
    purchase: 10720

[3] Required fields: valid

[4] Date coverage:
    2013-07-08 → 2024-12-15

[5] 3,017 active days · 1,209 locations

=== REAL DATA VERIFICATION PASSED ===
```

---

# Production Build

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

# GitHub Development

Create a feature branch:

```bash
git checkout -b feature/your-feature
```

Commit changes:

```bash
git add .
git commit -m "Add your feature"
```

Push:

```bash
git push origin feature/your-feature
```

---

# Demo Flow

A recommended hackathon demonstration:

### 01 — The Problem

> Personal data is everywhere, but its story is fragmented.

### 02 — The Solution

Introduce LIFE//FORENSICS as an explainable behavioral intelligence layer.

### 03 — Show the Data

```text
18,133 Records
3,017 Active Days
1,209 Locations
3 Data Streams
```

### 04 — Investigate

Open the Investigation Console.

### 05 — Show a Discovery

Open the evidence details:

* Confidence
* Evidence
* Sources
* Reasoning
* Limitation

### 06 — Explore the Life Graph

Show relationships between different signals.

### 07 — Show Privacy

Demonstrate the sensitive fields excluded from analytical outputs.

### 08 — Close

> **LIFE//FORENSICS doesn't simply visualize data. It reconstructs patterns from fragmented signals and explains every discovery with evidence.**

---

# Methodological Guardrails

LIFE//FORENSICS explicitly distinguishes between different levels of interpretation.

### Observation

A measurable event exists in the dataset.

### Correlation

Two or more signals repeatedly occur together.

### Anomaly Candidate

A signal deviates from a defined historical or statistical pattern.

### Interpretation

A possible explanation for a detected pattern.

These concepts are not treated as interchangeable.

---

# Limitations

### Correlation does not establish causation

Cross-source relationships indicate association.

### Anomaly does not mean abnormality

An anomaly candidate represents a deviation from a defined pattern.

### Source fraud labels

If a source dataset provides an `is_fraud` field, it is treated as a **source-provided label**.

LIFE//FORENSICS does not independently determine fraud.

### Timestamp limitations

Records without reliable timestamps cannot reliably participate in temporal analysis.

### Geographic limitations

Location strings are treated as dataset-provided signals and do not imply precise physical positioning.

### Confidence limitations

Confidence represents the strength of the implemented evidence model and is not a probability of objective truth.

---

# Roadmap

## Intelligence

* [ ] Natural-language investigation agent
* [ ] Semantic event search
* [ ] Advanced change-point detection
* [ ] Improved anomaly scoring
* [ ] Advanced personal baselines

## Privacy

* [ ] On-device processing
* [ ] Encrypted personal data vault
* [ ] Differential privacy
* [ ] Federated analytics
* [ ] User-controlled data retention

## Integrations

* [ ] Fitness data
* [ ] Calendar data
* [ ] Browser activity
* [ ] Photos
* [ ] Wearables
* [ ] Travel data
* [ ] Financial connectors

## Platform

* [ ] Mobile application
* [ ] Long-term behavioral memory
* [ ] Advanced Life Graph
* [ ] Personal data vault
* [ ] Explainable investigation agent

---

# Potential Applications

The architecture can be extended to:

* Personal analytics
* Digital wellbeing
* Financial behavior analysis
* Lifestyle research
* Longitudinal behavioral studies
* Personal data management
* Digital memory reconstruction
* Research analytics

---

# Why LIFE//FORENSICS?

Traditional analytics:

```text
DATA
  ↓
CHART
  ↓
USER
```

LIFE//FORENSICS:

```text
DATA
  ↓
PRIVACY
  ↓
NORMALIZATION
  ↓
CORRELATION
  ↓
PATTERN
  ↓
EVIDENCE
  ↓
CONFIDENCE
  ↓
REASONING
  ↓
USER
```

The platform focuses on **explainable reconstruction rather than visualization alone**.

---

# Project Metrics

| Metric              | Current Value |
| ------------------- | ------------: |
| Normalized records  |    **18,133** |
| Music signals       |     **7,413** |
| Transaction signals |    **10,720** |
| Active days         |     **3,017** |
| Location strings    |     **1,209** |
| Data coverage       | **2013–2024** |
| Primary sources     |         **3** |

---

# 👥 Team

### LIFE//FORENSICS

**Repository:**
[https://github.com/thepavann/life-forensics](https://github.com/thepavann/life-forensics)

**Team Members**

* **Pavan Tungala** — [Role]
* **[Member Name]** — [Role]
* **[Member Name]** — [Role]
* **[Member Name]** — [Role]

---

# 🎥 Demo

**Live Demo:**
*Add deployment URL*

**Demo Video:**
*Add video URL*

**Presentation:**
*Add presentation URL if required*

---

# 📄 License

This project was developed as a hackathon prototype.

Add the license required by your hackathon or team before public release.

---

<div align="center">

### LIFE//FORENSICS

**Fragmented traces. Connected patterns. Explainable evidence.**

</div>

---

### GitHub final step

After replacing your current `README.md`, run:

```bash
git add README.md
git commit -m "Add professional project documentation"
git push
```

