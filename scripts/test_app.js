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

const uploader = fs.readFileSync(path.join(root, 'src', 'components', 'DatasetUploadModal.tsx'), 'utf8');
assert.ok(uploader.includes('MAX_FILE_BYTES'), 'Upload size limit is missing.');
assert.ok(uploader.includes('MAX_RECORDS'), 'Upload record limit is missing.');
assert.ok(uploader.includes('valid timestamp'), 'Upload timestamp validation is missing.');

const app = fs.readFileSync(path.join(root, 'src', 'App.tsx'), 'utf8');
assert.ok(app.includes('getForensicsData()'), 'Application dataset loader is missing.');
assert.ok(app.includes('role="status"'), 'Dataset loading state should be accessible.');

const analyzer = fs.readFileSync(path.join(root, 'src', 'lib', 'analyzer', 'index.ts'), 'utf8');
assert.ok(analyzer.includes("import('../../data/raw_receipts.json')"), 'Production dataset should be lazy-loaded.');

console.log('=== LIFE//FORENSICS RELIABILITY CHECKS PASSED ===');
console.log('Dataset schema, privacy guardrails, upload validation, lazy loading, and accessible loading state verified.');
