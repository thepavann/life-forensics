import fs from 'fs';
import path from 'path';

console.log('=== VERIFYING LIFE//FORENSICS REAL DATA ENGINE ===\n');

const rawPath = path.resolve('src/data/raw_receipts.json');
const rawData = JSON.parse(fs.readFileSync(rawPath, 'utf8'));

if (!Array.isArray(rawData) || rawData.length < 1) {
  throw new Error(`Expected a non-empty real dataset, found ${rawData.length}`);
}

console.log(`[1] Raw dataset: ${rawData.length.toLocaleString()} records`);

const typeMap = {};
for (const r of rawData) typeMap[r.type] = (typeMap[r.type] || 0) + 1;
console.log('[2] Type breakdown:', typeMap);

if (!typeMap.music || !typeMap.purchase) {
  throw new Error('Expected real music and purchase records.');
}

const invalid = rawData.filter(r => !r.id || !r.timestamp || !r.type || !r.title);
if (invalid.length) throw new Error(`Found ${invalid.length} incomplete normalized source records.`);
console.log('[3] Required fields: valid');

const dates = rawData.map(r => new Date(r.timestamp)).filter(d => !Number.isNaN(d.getTime()));
const minDate = new Date(Math.min(...dates)).toISOString();
const maxDate = new Date(Math.max(...dates)).toISOString();
console.log(`[4] Date coverage: ${minDate} → ${maxDate}`);

const uniqueDays = new Set(rawData.map(r => new Date(r.timestamp).toISOString().slice(0, 10)));
const uniqueLocations = new Set(rawData.map(r => r.location).filter(Boolean));
console.log(`[5] ${uniqueDays.size.toLocaleString()} active days · ${uniqueLocations.size.toLocaleString()} locations`);

if (uniqueDays.size < 10) throw new Error('Activity timeline has insufficient date coverage.');

console.log('\n=== REAL DATA VERIFICATION PASSED ===');
