# Deployment

## Local Development

Requirements:

- Node.js 18+
- npm
- Git

Install and run:

```bash
git clone https://github.com/thepavann/life-forensics.git
cd life-forensics
npm install
npm run dev
```

## Production Build

Build the application:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Verification

Run:

```bash
npm run verify
npm run test
npm run build
```

## Deployment Platforms

LIFE//FORENSICS is a Vite-based frontend and can be deployed to a static hosting platform that supports modern JavaScript applications.

Typical deployment flow:

```text
GitHub Repository
       ↓
Build Command
       ↓
npm run build
       ↓
dist/
       ↓
Static Hosting
```

If using a hosting provider, configure the project according to its current Vite deployment instructions.

## Environment Variables

Never commit secrets to the repository.

If future integrations require environment variables, document their names and purpose without publishing their values.

Use a local `.env` file for development and ensure it is excluded from version control.

## Production Privacy

Before deploying with real personal datasets:

- Review where data is processed.
- Review browser/server data flow.
- Review logging.
- Review retention.
- Avoid exposing private datasets publicly.
- Confirm third-party services and analytics do not receive sensitive information.

The hackathon prototype should not be treated as a production personal-data vault without additional security review.
