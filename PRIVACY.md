# Privacy Model

Privacy is a core design principle of **LIFE//FORENSICS**.

The project is designed to demonstrate how behavioral analysis can be performed while minimizing unnecessary exposure of identifying information.

## Privacy Pipeline

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

## Data Minimization

The analytical layer excludes fields that are not required for behavioral analysis. Depending on the source, examples include:

- Names
- Gender
- Street address
- Date of birth
- Customer identifiers
- Card/account numbers
- Precise latitude/longitude

The exact fields depend on the source schema and the current implementation.

## Local Data

The prototype is designed around local dataset processing. Users should inspect the deployment configuration before using real personal data.

Do not upload sensitive personal information to a public deployment unless the deployment has been specifically designed and secured for that purpose.

## Dataset Responsibility

Third-party datasets may have their own licenses and privacy restrictions.

The project license does **not** automatically grant permission to redistribute third-party datasets.

Only use datasets you are legally permitted to use and redistribute.

## Analytical Guardrails

LIFE//FORENSICS distinguishes:

- **Observation:** a measurable event exists.
- **Correlation:** multiple signals occur together.
- **Anomaly candidate:** a signal differs from a defined pattern.
- **Interpretation:** a possible explanation.

Correlation is not treated as proof of causation.

Confidence values represent the strength of the implemented evidence model; they are not probabilities that an interpretation is objectively true.

## User-Controlled Data

When adding data-import features, contributors should preserve clear user control over:

- What is imported.
- What is retained.
- What is analyzed.
- What is displayed.
- What can be removed.

Privacy-sensitive behavior should be documented whenever a feature changes the data flow.
