# Contributing to LIFE//FORENSICS

Thank you for your interest in contributing to **LIFE//FORENSICS**.

LIFE//FORENSICS is a privacy-first behavioral intelligence platform that turns fragmented personal data into explainable patterns and evidence.

Contributions, ideas, bug reports, documentation improvements, and technical improvements are welcome.

## Before You Start

- Read the [README](README.md).
- Understand the project's privacy-first approach.
- Check existing issues and pull requests before opening a new one.
- Never commit private datasets, credentials, tokens, or personally identifiable information.

## Getting Started

### Requirements

- Node.js 18+
- npm
- Git

### Setup

```bash
git clone https://github.com/thepavann/life-forensics.git
cd life-forensics
npm install
npm run dev
```

## Branches

Create a focused branch for your work:

```bash
git checkout -b feature/your-feature
```

Examples:

- `feature/life-graph-improvements`
- `feature/new-investigation-query`
- `fix/timeline-rendering`
- `docs/update-architecture`

## Development Guidelines

- Use TypeScript consistently.
- Keep components modular and maintainable.
- Prefer existing dependencies and patterns before adding new ones.
- Keep analytical logic deterministic and explainable where possible.
- Keep observation, correlation, anomaly candidates, and interpretation distinct.
- Do not present correlation as proof of causation.

## Privacy Requirements

Do not commit:

- Names, emails, phone numbers, or addresses.
- Financial account numbers.
- Precise private locations.
- API keys, passwords, access tokens, or secrets.
- Private or non-redistributable datasets.

Use synthetic or appropriately anonymized data for tests and examples.

## Testing

Before opening a pull request, run the available checks:

```bash
npm run verify
npm run test
npm run build
```

If you add analytical functionality, include tests or verification coverage where practical.

## Frontend Contributions

For UI changes:

- Follow the existing visual language.
- Keep interfaces responsive and accessible.
- Reuse components when possible.
- Keep animations purposeful.
- Test important screens at multiple viewport sizes.

## Analytical Contributions

Document:

1. What signal is being analyzed.
2. How it is calculated.
3. Required inputs.
4. Assumptions.
5. Confidence/evidence logic.
6. Known limitations.

## Pull Requests

A good pull request should explain:

- **What changed?**
- **Why was it needed?**
- **How was it tested?**
- **What limitations remain?**

For UI changes, include screenshots when useful.

### Pull Request Checklist

- [ ] Build passes.
- [ ] Tests/verification pass.
- [ ] No sensitive information was committed.
- [ ] Documentation was updated when necessary.
- [ ] UI changes were tested responsively.
- [ ] Analytical changes explain their methodology.

## Bug Reports

Open a GitHub issue with:

- A short description.
- Steps to reproduce.
- Expected behavior.
- Actual behavior.
- Browser/OS information.
- Relevant logs or screenshots.

Never attach private datasets to a public issue.

## Feature Requests

Describe:

- The problem.
- Your proposed solution.
- Why it is useful.
- Technical considerations.

Ideas that improve privacy, explainability, accessibility, and transparency are especially welcome.

## Security

Do not report security or privacy vulnerabilities through public GitHub issues. Follow [SECURITY.md](SECURITY.md).

## License

By contributing, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).

## Community

Please be respectful and constructive. Questions, alternative approaches, and technical disagreement are welcome when discussed in good faith.

**Build thoughtfully. Protect user privacy. Explain the evidence. Keep improving.**
