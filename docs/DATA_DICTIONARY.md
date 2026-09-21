# Data Dictionary

LIFE//FORENSICS converts different source schemas into a common analytical representation.

## Normalized Event

| Field | Purpose |
|---|---|
| `id` | Deterministic identifier for the source event |
| `timestamp` | Event time used for temporal analysis |
| `source` | Origin of the event |
| `entity` | Relevant person/item/service/entity represented by the record |
| `category` | High-level classification |
| `location` | Dataset-provided location signal when available |
| `eventType` | Normalized event category |
| `metadata` | Non-sensitive analytical context where required |

The exact TypeScript shape is defined by the current implementation and may evolve.

## Source Types

The current prototype works with signals derived from:

- Music records.
- Purchase/transaction records.
- Household transaction records.

## Privacy-Sensitive Source Fields

Fields that are not required for behavioral analysis should not enter normalized analytical output.

Examples include:

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

The active deny-list is defined by the implementation and should be treated as the source of truth when extending the pipeline.

## Timestamp Rules

A timestamp must be valid before a record participates in temporal analysis.

Records without reliable timestamps may still be useful for non-temporal source analysis, but they should not be assigned fabricated dates.

## Data Coverage

The current documented prototype contains:

- 18,133 normalized records.
- 7,413 music signals.
- 10,720 transaction signals.
- 3,017 active days.
- 1,209 location strings.
- Coverage spanning 2013–2024.

These figures describe the documented prototype dataset and may change as the project evolves.
