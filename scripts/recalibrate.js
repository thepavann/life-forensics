// scripts/recalibrate.js
import fs from 'fs';

let code = fs.readFileSync('scripts/generate_data.js', 'utf8');

// Adjust music tracks in Aug/Sep
code = code.replace("time: '2026-08-20T06:50:00Z'", "time: '2026-08-14T06:50:00Z'");
code = code.replace("time: '2026-08-25T20:15:00Z'", "time: '2026-08-15T20:15:00Z'");
code = code.replace("time: '2026-09-02T18:40:00Z'", "time: '2026-09-05T18:40:00Z'");

// Adjust movie in Aug
code = code.replace("time: '2026-08-29T19:00:00Z'", "time: '2026-08-12T19:00:00Z'");

// Adjust extra photos in Aug
code = code.replace("time: '2026-08-19T18:30:00Z'", "time: '2026-08-16T18:30:00Z'");
code = code.replace("time: '2026-08-21T21:40:00Z'", "time: '2026-08-16T21:40:00Z'");

// Adjust extra messages in Aug
code = code.replace("time: '2026-08-21T14:10:00Z'", "time: '2026-08-15T14:10:00Z'");
code = code.replace("time: '2026-08-21T16:00:00Z'", "time: '2026-08-16T16:00:00Z'");
code = code.replace("time: '2026-08-26T12:00:00Z'", "time: '2026-09-05T12:00:00Z'");
code = code.replace("time: '2026-08-19T20:00:00Z'", "time: '2026-08-15T20:00:00Z'");
code = code.replace("time: '2026-08-23T14:30:00Z'", "time: '2026-09-05T14:30:00Z'");
code = code.replace("time: '2026-08-24T11:00:00Z'", "time: '2026-08-16T11:00:00Z'");

// Adjust note in Sep
code = code.replace("time: '2026-09-02T20:00:00Z'", "time: '2026-09-05T20:00:00Z'");

// In filler searches and notes, avoid Aug 17 - Sep 04
code = code.replace(
  "const month = String(3 + Math.floor(i / 6)).padStart(2, '0');",
  "let mNum = 3 + Math.floor(i / 6); if (mNum === 8) mNum = 7; const month = String(mNum).padStart(2, '0');"
);
code = code.replace(
  "const month = String(2 + Math.floor(i / 4)).padStart(2, '0');",
  "let mNumNote = 2 + Math.floor(i / 4); if (mNumNote === 8) mNumNote = 9; const month = String(mNumNote).padStart(2, '0');"
);

fs.writeFileSync('scripts/generate_data.js', code, 'utf8');
console.log('Successfully updated scripts/generate_data.js');
