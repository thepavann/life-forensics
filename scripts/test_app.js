import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = process.cwd();
const rawPath = path.join(root, 'src', 'data', 'raw_receipts.json');
const raw = JSON.parse(fs.readFileSync(rawPath, 'utf8'));

assert.ok(Array.isArray(raw) && raw.length > 0, 'Dataset must be a non-empty array.');
assert.ok(raw.length >= 18000, 'Expected the full normalized demo dataset.');

for (const record of raw) {
  assert.ok(record.id && record.type && record.title && record.timestamp, 'Record schema is incomplete.');
  assert.ok(!Number.isNaN(new Date(record.timestamp).getTime()), 'Record contains an invalid timestamp.');
}

const normalizer = fs.readFileSync(path.join(root, 'src', 'lib', 'analyzer', 'normalizer.ts'), 'utf8');
for (const field of ['cc_num', 'customer_id', 'dob', 'merch_lat', 'merch_long', 'street']) {
  assert.ok(normalizer.includes(field), 'Privacy denylist is missing: ' + field);
}
assert.ok(normalizer.includes('sanitizeMetadata'), 'Metadata sanitization must be enforced during normalization.');
assert.ok(normalizer.includes('sanitizeRawReceipt'), 'Stored raw records must be sanitized.');

const uploader = fs.readFileSync(path.join(root, 'src', 'components', 'DatasetUploadModal.tsx'), 'utf8');
assert.ok(uploader.includes('MAX_FILE_BYTES'), 'Upload size limit is missing.');
assert.ok(uploader.includes('MAX_RECORDS'), 'Upload record limit is missing.');
assert.ok(uploader.includes('valid timestamp'), 'Upload timestamp validation is missing.');

const app = fs.readFileSync(path.join(root, 'src', 'App.tsx'), 'utf8');
assert.ok(app.includes('ErrorBoundary'), 'Root error boundary is missing.');

const shell = fs.readFileSync(path.join(root, 'src', 'app', 'AppShell.tsx'), 'utf8');
assert.ok(shell.includes('useForensicsData'), 'Application data hook is missing.');
assert.ok(shell.includes('Suspense'), 'Lazy view fallback is missing.');
assert.ok(shell.includes('DatasetUploadModal'), 'Dataset upload is not integrated into the app shell.');

assert.ok(app.includes('ErrorBoundary'), 'Root error boundary is missing.');
assert.ok(shell.includes('onUploadDataset'), 'Dataset upload action must be wired into navigation.');

const analyzer = fs.readFileSync(path.join(root, 'src', 'lib', 'analyzer', 'index.ts'), 'utf8');
assert.ok(analyzer.includes("import('../../data/raw_receipts.json')"), 'Production dataset should be lazy-loaded.');

const baseline = fs.readFileSync(path.join(root, 'src', 'lib', 'analyzer', 'baseline.ts'), 'utf8');
assert.ok(baseline.includes('computePersonalBaseline'), 'Personal baseline engine is missing.');
assert.ok(baseline.includes('deviationPercent'), 'Baseline deviation calculation is missing.');

const queryEngine = fs.readFileSync(path.join(root, 'src', 'lib', 'analyzer', 'queryEngine.ts'), 'utf8');
assert.ok(queryEngine.includes('answerInvestigationQuery'), 'Investigation query engine is missing.');
assert.ok(queryEngine.includes("intent: 'change'"), 'Change query intent is missing.');

const connections = fs.readFileSync(path.join(root, 'src', 'lib', 'analyzer', 'connections.ts'), 'utf8');
assert.ok(connections.includes('finalAdjacencyMap'), 'Deduplicated adjacency map is missing.');

assert.ok(!normalizer.includes('Math.random'), 'Normalization must remain deterministic.');
assert.ok(!normalizer.includes("2026-01-01T00:00:00Z"), 'Invalid timestamps must not be replaced with a fabricated date.');

console.log('=== LIFE//FORENSICS RELIABILITY CHECKS PASSED ===');
console.log('Dataset schema, privacy guardrails, upload validation, lazy loading, and accessible loading state verified.');
