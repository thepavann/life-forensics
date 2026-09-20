# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.


## Real dataset integration

This build uses the three datasets supplied with the project:

- **Daily Household Transactions** — 2,461 source rows; 1,303 rows with usable timestamps mapped to purchase receipts.
- **Augmented IndiaTransactMultiFacet2024** — 10,267 source rows; 9,417 rows with usable timestamps mapped to purchase receipts.
- **spotify_history** — 149,860 listening records. To keep the interactive graph performant, the frontend uses daily summaries of the top 3 artists by play count (7,413 derived music receipts), retaining real track, artist, play-count and listening-time values.

The resulting archive contains **18,133 normalized receipts**. Personally identifying/payment fields from the India transaction dataset (card numbers, names, street addresses, date of birth, customer IDs and coordinates) are intentionally excluded from the frontend dataset.

See `src/data/dataset_manifest.json` for the transformation manifest.


## Hackathon demo
See `HACKATHON_DEMO.md` for the pitch flow, technical story, privacy claims, and judge walkthrough.
