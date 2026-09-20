// scripts/generate_data.js
import fs from 'fs';
import path from 'path';

// Target counts:
// place: 9
// music: 27
// purchase: 14
// event: 8
// movie: 15
// photo: 48
// message: 62
// search: 78
// note: 51
// TOTAL = 312

const records = [];
let idCounter = 1;

function makeId(type) {
  const prefix = type.slice(0, 3).toUpperCase();
  const num = String(idCounter++).padStart(3, '0');
  return `REC-${prefix}-${num}`;
}

// 1. PLACES (Exactly 9)
const places = [
  {
    id: makeId('place'),
    type: 'place',
    title: 'Café Aurora',
    timestamp: '2026-02-14T09:15:00Z',
    location: '442 St. Mark Avenue, Historic District',
    description: 'Specialty pour-over coffee bar and quiet reading nook with south-facing windows.',
    metadata: { category: 'Café', visit_count: 14, wifi: 'Aurora_Guest', noise_level: 'Low' },
    tags: ['coffee', 'reading', 'work', 'routine']
  },
  {
    id: makeId('place'),
    type: 'place',
    title: 'District 4 Co-working',
    timestamp: '2026-02-16T08:30:00Z',
    location: '88 Industrial Way, Floor 3',
    description: 'Shared tech and design studio workspace with open desks and phone booths.',
    metadata: { category: 'Workplace', desk_id: 'Pod-12', floor: 3, access_card: 'D4-9921' },
    tags: ['work', 'design', 'desk', 'studio']
  },
  {
    id: makeId('place'),
    type: 'place',
    title: 'Beacon Point Lookout',
    timestamp: '2026-03-21T18:40:00Z',
    location: 'Pacific Coast Ridge, Mile Marker 4',
    description: 'Elevated coastal promontory with panoramic ocean views, lighthouse ruins, and walking trail.',
    metadata: { category: 'Nature / Scenic', elevation_m: 140, parking: 'Turnout B' },
    tags: ['nature', 'sunset', 'ocean', 'solitude']
  },
  {
    id: makeId('place'),
    type: 'place',
    title: 'Terminal 2, North Gate',
    timestamp: '2026-04-10T06:15:00Z',
    location: 'Metro Airport Terminal 2',
    description: 'Regional transit hub and departure concourse.',
    metadata: { category: 'Transit', gate: 'B18', carrier: 'CoastAir' },
    tags: ['travel', 'transit', 'departure', 'airport']
  },
  {
    id: makeId('place'),
    type: 'place',
    title: 'The Mill Bakery',
    timestamp: '2026-05-02T10:05:00Z',
    location: '120 Canal Basin Rd',
    description: 'Artisanal sourdough bakery with outdoor communal timber tables.',
    metadata: { category: 'Bakery / Food', specialty: 'Country Loaf', seating: 'Patio' },
    tags: ['food', 'breakfast', 'weekend', 'bakery']
  },
  {
    id: makeId('place'),
    type: 'place',
    title: 'St. Jude Community Library',
    timestamp: '2026-05-18T14:20:00Z',
    location: '710 Civic Square',
    description: 'Municipal archive and public reading room with mid-century architecture.',
    metadata: { category: 'Library / Public Space', floor: 2, section: 'Architectural History' },
    tags: ['books', 'archive', 'research', 'quiet']
  },
  {
    id: makeId('place'),
    type: 'place',
    title: 'Redwood Trailhead',
    timestamp: '2026-08-20T07:10:00Z',
    location: 'Mount Tamalpais North Entrance, Trailhead 4B',
    description: 'Dense old-growth redwood grove entrance with stream crossing.',
    metadata: { category: 'Trail / Park', trail_length_km: 12.4, difficulty: 'Moderate' },
    tags: ['hiking', 'outdoors', 'redwoods', 'nature']
  },
  {
    id: makeId('place'),
    type: 'place',
    title: 'Komorebi Tea House',
    timestamp: '2026-09-12T16:30:00Z',
    location: '33 Garden Pavilion Alley',
    description: 'Minimalist Japanese matcha and loose-leaf tea salon overlooking a courtyard moss garden.',
    metadata: { category: 'Tea Salon', specialty: 'Uji Ceremonial Matcha', seating: 'Tatami' },
    tags: ['tea', 'calm', 'afternoon', 'mindfulness']
  },
  {
    id: makeId('place'),
    type: 'place',
    title: 'Cinema Roxy',
    timestamp: '2026-09-28T19:15:00Z',
    location: '502 West Grand Blvd',
    description: 'Single-screen repertory cinema specializing in 35mm prints and restored film classics.',
    metadata: { category: 'Cinema', screen_format: '35mm projection', seat: 'Row G, Seat 14' },
    tags: ['cinema', 'film', 'evening', 'culture']
  }
];
records.push(...places);

// 2. MUSIC (Exactly 27)
const musicTracks = [
  { title: 'Blurred', artist: 'Kiasmos', album: 'Blurred EP', duration: '5:04', time: '2026-02-14T09:40:00Z', tags: ['ambient', 'minimal techno', 'focus'] },
  { title: 'Swayed', artist: 'Kiasmos', album: 'Kiasmos', duration: '4:24', time: '2026-02-20T22:15:00Z', tags: ['ambient', 'electronic', 'night'] },
  { title: 'Looped', artist: 'Kiasmos', album: 'Kiasmos', duration: '6:18', time: '2026-03-05T01:30:00Z', tags: ['electronic', 'late night', 'instrumental'] },
  { title: 'Singularity', artist: 'Jon Hopkins', album: 'Singularity', duration: '6:29', time: '2026-03-12T17:45:00Z', tags: ['electronic', 'deep', 'focus'] },
  { title: 'Emerald Rush', artist: 'Jon Hopkins', album: 'Singularity', duration: '5:36', time: '2026-03-21T18:20:00Z', tags: ['electronic', 'motion', 'coast'] },
  { title: 'Immunity', artist: 'Jon Hopkins', album: 'Immunity', duration: '9:56', time: '2026-04-02T23:40:00Z', tags: ['ambient', 'piano', 'meditative'] },
  { title: 'Cirrus', artist: 'Bonobo', album: 'The North Borders', duration: '5:52', time: '2026-04-10T06:40:00Z', tags: ['downtempo', 'travel', 'beats'] },
  { title: 'Kerala', artist: 'Bonobo', album: 'Migration', duration: '3:58', time: '2026-04-18T14:10:00Z', tags: ['electronic', 'focus', 'work'] },
  { title: 'Break Apart', artist: 'Bonobo feat. Rhye', album: 'Migration', duration: '4:35', time: '2026-05-02T10:30:00Z', tags: ['downtempo', 'morning', 'chill'] },
  { title: 'A Walk', artist: 'Tycho', album: 'Dive', duration: '5:16', time: '2026-05-15T08:15:00Z', tags: ['ambient', 'morning', 'synth'] },
  { title: 'Awake', artist: 'Tycho', album: 'Awake', duration: '4:43', time: '2026-05-25T19:00:00Z', tags: ['chillwave', 'evening', 'summer'] },
  { title: 'Spectacle', artist: 'Tycho', album: 'Awake', duration: '4:18', time: '2026-06-04T16:20:00Z', tags: ['electronic', 'warm', 'design'] },
  { title: 'Says', artist: 'Nils Frahm', album: 'Spaces', duration: '8:18', time: '2026-06-18T21:40:00Z', tags: ['modern classical', 'synthesizer', 'intense'] },
  { title: 'Toilet Brushes - More', artist: 'Nils Frahm', album: 'Spaces', duration: '14:49', time: '2026-07-02T23:10:00Z', tags: ['piano', 'live', 'deep night'] },
  { title: 'My Friend the Forest', artist: 'Nils Frahm', album: 'All Melody', duration: '5:16', time: '2026-07-14T02:05:00Z', tags: ['piano', 'solitude', 'acoustic'] },
  { title: 'Near Light', artist: 'Olafur Arnalds', album: 'Living Room Songs', duration: '3:28', time: '2026-07-28T09:10:00Z', tags: ['strings', 'piano', 'morning'] },
  { title: 'Saman', artist: 'Olafur Arnalds', album: 're:member', duration: '2:11', time: '2026-08-08T22:30:00Z', tags: ['ambient', 'peaceful', 'piano'] },
  { title: 'Woven Song', artist: 'Olafur Arnalds', album: 'some kind of peace', duration: '3:05', time: '2026-08-14T06:50:00Z', tags: ['neoclassical', 'morning', 'trail'] },
  { title: 'Odyssey', artist: 'Rival Consoles', album: 'Now Is', duration: '4:52', time: '2026-08-15T20:15:00Z', tags: ['analog electronic', 'rhythm', 'focus'] },
  { title: 'Running', artist: 'Rival Consoles', album: 'Now Is', duration: '5:28', time: '2026-09-05T18:40:00Z', tags: ['electronic', 'pace', 'momentum'] },
  { title: 'Untravel', artist: 'Rival Consoles', album: 'Persona', duration: '6:12', time: '2026-09-10T23:50:00Z', tags: ['electronic', 'late night', 'subtle'] },
  { title: 'Dayvan Cowboy', artist: 'Boards of Canada', album: 'The Campfire Headphase', duration: '5:00', time: '2026-09-15T15:20:00Z', tags: ['idm', 'nostalgia', 'guitar'] },
  { title: 'Roygbiv', artist: 'Boards of Canada', album: 'Music Has the Right to Children', duration: '2:31', time: '2026-09-22T12:00:00Z', tags: ['idm', 'warm', 'analog'] },
  { title: 'On The Nature of Daylight', artist: 'Max Richter', album: 'The Blue Notebooks', duration: '6:11', time: '2026-09-28T21:30:00Z', tags: ['cinematic', 'strings', 'autumn'] },
  { title: 'November', artist: 'Max Richter', album: 'Memoryhouse', duration: '8:01', time: '2026-10-04T17:15:00Z', tags: ['classical', 'violin', 'reflection'] },
  { title: 'Spring 1', artist: 'Max Richter', album: 'Recomposed by Max Richter: Vivaldi', duration: '2:31', time: '2026-10-12T08:45:00Z', tags: ['recomposed', 'strings', 'energy'] },
  { title: 'Orison', artist: 'Kiasmos', album: 'Blurred EP', duration: '5:56', time: '2026-10-18T22:20:00Z', tags: ['ambient techno', 'closing', 'rhythm'] }
];

for (const m of musicTracks) {
  records.push({
    id: makeId('music'),
    type: 'music',
    title: m.title,
    timestamp: m.time,
    description: `Streamed "${m.title}" by ${m.artist} from album ${m.album}.`,
    metadata: { artist: m.artist, album: m.album, duration: m.duration, platform: 'Lossless Audio Stream' },
    tags: ['music', ...m.tags, m.artist.toLowerCase()]
  });
}

// 3. PURCHASES (Exactly 14)
const purchases = [
  { title: 'Field Notebook & Fineliners', amount: '$24.50', store: 'Paper & Ink Co.', time: '2026-02-12T14:15:00Z', tags: ['stationery', 'sketching', 'design'], note: 'Dot grid paper and waterproof archival pens.' },
  { title: 'Single Origin Pour-over', amount: '$6.75', store: 'Café Aurora', time: '2026-02-14T09:22:00Z', tags: ['coffee', 'café aurora', 'routine'], note: 'Ethiopian Yirgacheffe batch.' },
  { title: 'Ergonomic Split Keyboard', amount: '$289.00', store: 'KeyStudio Systems', time: '2026-03-01T11:40:00Z', tags: ['hardware', 'ergonomics', 'workplace'], note: 'Columnar layout with silent linear switches.' },
  { title: 'Acoustic Dampening Foam', amount: '$74.00', store: 'ProAudio Supply', time: '2026-03-15T16:10:00Z', tags: ['audio', 'studio', 'acoustics'], note: '6-pack beveled sound panels.' },
  { title: 'Train Pass - Zone 1 to 4', amount: '$42.00', store: 'Regional Rail Terminal', time: '2026-04-10T06:05:00Z', tags: ['transit', 'rail', 'travel'], note: 'Unlimited weekend transit pass.' },
  { title: 'Sennheiser HD600 Cable', amount: '$38.50', store: 'Custom Cables Direct', time: '2026-04-22T19:30:00Z', tags: ['audio', 'headphones', 'gear'], note: 'Braided 1.5m balanced replacement lead.' },
  { title: 'Hardcover "The Design of Everyday Things"', amount: '$32.00', store: 'City Lights Bookstore', time: '2026-05-18T15:05:00Z', tags: ['books', 'design', 'reading'], note: 'Revised & expanded edition.' },
  { title: 'Studio Monitor Isolation Pads', amount: '$45.00', store: 'SoundCraft Workshop', time: '2026-06-12T13:20:00Z', tags: ['audio', 'studio', 'hardware'], note: 'High-density foam wedges.' },
  { title: 'Analog Thermometer & Barometer', amount: '$68.00', store: 'Maritime Antiques', time: '2026-07-08T17:45:00Z', tags: ['weather', 'analog', 'desk'], note: 'Brass framed aneroid instrument.' },
  { title: 'Film Stock - Portra 400 (5-pack)', amount: '$78.90', store: 'Photographic Center', time: '2026-08-10T12:30:00Z', tags: ['photography', 'film', 'analog'], note: '120 medium format roll film.' },
  { title: 'Rain Shell Jacket', amount: '$185.00', store: 'Ridge & Peak Outfitters', time: '2026-08-18T13:45:00Z', tags: ['outdoors', 'apparel', 'escape'], note: '3-layer waterproof breathable shell.' },
  { title: 'Osprey 28L Daypack', amount: '$140.00', store: 'Trailhead Equipment', time: '2026-08-19T16:20:00Z', tags: ['gear', 'hiking', 'escape'], note: 'Lightweight technical trail backpack.' },
  { title: 'French Press Replacement Glass', amount: '$18.00', store: 'Home Brew Elements', time: '2026-09-14T10:15:00Z', tags: ['coffee', 'kitchen', 'routine'], note: 'Borosilicate 800ml beaker.' },
  { title: 'Wool Overcoat', amount: '$340.00', store: 'Atelier North', time: '2026-10-06T15:50:00Z', tags: ['apparel', 'autumn', 'clothing'], note: 'Charcoal boiled merino wool coat.' }
];

for (const p of purchases) {
  records.push({
    id: makeId('purchase'),
    type: 'purchase',
    title: p.title,
    timestamp: p.time,
    description: `Purchased ${p.title} at ${p.store} for ${p.amount}.`,
    metadata: { amount: p.amount, merchant: p.store, payment_method: 'Apple Pay', receipt_note: p.note },
    tags: ['purchase', ...p.tags]
  });
}

// 4. EVENTS (Exactly 8)
const events = [
  { title: 'Design Systems Summit 2026', time: '2026-02-18T09:00:00Z', location: 'Metropolitan Convention Hall', desc: 'Annual assembly on token systems, spatial UI, and computational design patterns.', attendees: 420, tags: ['conference', 'design', 'talks'] },
  { title: 'Quarterly Retrospective', time: '2026-03-27T15:00:00Z', location: 'District 4 Co-working', desc: 'Team wrap-up for Q1 deliverables, sprint velocity check, and design sprint planning.', attendees: 12, tags: ['work', 'sprint', 'retro'] },
  { title: 'Open Studio Night', time: '2026-04-24T18:00:00Z', location: 'The Mill Arts Corridor', desc: 'Local independent artist studios and printmakers open their workshops to visitors.', attendees: 85, tags: ['art', 'printmaking', 'community'] },
  { title: 'Exhibition: Light & Shadow', time: '2026-05-20T17:30:00Z', location: 'Civic Modern Gallery', desc: 'Curated retrospective on mid-century architectural photography and minimalism.', attendees: 150, tags: ['exhibition', 'photography', 'art'] },
  { title: 'Ambient Soundscapes Live', time: '2026-06-25T20:30:00Z', location: 'Old St. James Chapel', desc: 'Immersive Quadraphonic electronic performance with acoustic instruments and modular synthesis.', attendees: 95, tags: ['live music', 'ambient', 'concert'] },
  { title: 'Annual Lease Renewal', time: '2026-07-31T11:00:00Z', location: 'District Management Office', desc: 'Residential apartment lease signature and building inspection check.', attendees: 2, tags: ['apartment', 'admin', 'routine'] },
  { title: 'Late Summer Sendoff', time: '2026-08-21T17:00:00Z', location: 'Redwood Trailhead Campground', desc: 'Gathering before the extended coastal ridge backpacking trip.', attendees: 6, tags: ['hiking', 'camping', 'friends', 'escape'] },
  { title: 'Coastal Trail Half Marathon', time: '2026-09-06T07:30:00Z', location: 'Beacon Point Lookout', desc: 'Scenic trail run across coastal cliffs and fire roads with morning fog cover.', attendees: 280, tags: ['running', 'outdoors', 'fitness'] }
];

for (const e of events) {
  records.push({
    id: makeId('event'),
    type: 'event',
    title: e.title,
    timestamp: e.time,
    location: e.location,
    description: e.desc,
    metadata: { organizer: 'Host / Coordinator', attendee_count: e.attendees, status: 'Confirmed Attended' },
    tags: ['event', ...e.tags]
  });
}

// 5. MOVIES (Exactly 15)
const movies = [
  { title: 'Arrival', director: 'Denis Villeneuve', year: 2016, time: '2026-02-15T21:00:00Z', runtime: '116 min', tags: ['sci-fi', 'linguistics', 'cinema'] },
  { title: 'Past Lives', director: 'Celine Song', year: 2023, time: '2026-02-28T20:45:00Z', runtime: '106 min', tags: ['drama', 'memory', 'reflection'] },
  { title: 'Solaris (1972)', director: 'Andrei Tarkovsky', year: 1972, time: '2026-03-14T21:30:00Z', runtime: '167 min', tags: ['sci-fi', 'philosophical', 'slow cinema'] },
  { title: 'Perfect Days', director: 'Wim Wenders', year: 2023, time: '2026-03-29T19:20:00Z', runtime: '124 min', tags: ['routine', 'tokyo', 'quiet observation'] },
  { title: 'Blade Runner 2049', director: 'Denis Villeneuve', year: 2017, time: '2026-04-15T21:00:00Z', runtime: '164 min', tags: ['sci-fi', 'visuals', 'soundtrack'] },
  { title: 'Aftersun', director: 'Charlotte Wells', year: 2022, time: '2026-05-08T22:10:00Z', runtime: '102 min', tags: ['memory', 'camcorder', 'nostalgia'] },
  { title: 'Drive My Car', director: 'Ryusuke Hamaguchi', year: 2021, time: '2026-05-29T19:40:00Z', runtime: '179 min', tags: ['drama', 'murakami', 'dialogue'] },
  { title: 'Interstellar', director: 'Christopher Nolan', year: 2014, time: '2026-06-19T20:15:00Z', runtime: '169 min', tags: ['sci-fi', 'time', 'score'] },
  { title: 'Her', director: 'Spike Jonze', year: 2013, time: '2026-07-05T21:30:00Z', runtime: '126 min', tags: ['futurism', 'relationships', 'ui design'] },
  { title: 'Lost in Translation', director: 'Sofia Coppola', year: 2003, time: '2026-07-22T22:00:00Z', runtime: '102 min', tags: ['isolation', 'hotel', 'tokyo'] },
  { title: 'Everything Everywhere All at Once', director: 'Daniels', year: 2022, time: '2026-08-04T20:30:00Z', runtime: '139 min', tags: ['multiverse', 'existential', 'family'] },
  { title: 'Yi Yi', director: 'Edward Yang', year: 2000, time: '2026-08-12T19:00:00Z', runtime: '173 min', tags: ['masterpiece', 'taipei', 'observation'] },
  { title: 'Ex Machina', director: 'Alex Garland', year: 2014, time: '2026-09-18T21:15:00Z', runtime: '108 min', tags: ['ai', 'architecture', 'tension'] },
  { title: 'The Zone of Interest', director: 'Jonathan Glazer', year: 2023, time: '2026-09-28T19:30:00Z', runtime: '105 min', tags: ['sound design', 'cinema roxy', '35mm'] },
  { title: 'Stalker (1979)', director: 'Andrei Tarkovsky', year: 1979, time: '2026-10-10T20:00:00Z', runtime: '162 min', tags: ['zone', 'philosophical', 'atmosphere'] }
];

for (const mv of movies) {
  records.push({
    id: makeId('movie'),
    type: 'movie',
    title: mv.title,
    timestamp: mv.time,
    description: `Watched "${mv.title}" (${mv.year}), directed by ${mv.director}.`,
    metadata: { director: mv.director, year: mv.year, runtime: mv.runtime, format: 'Stream / 4K Projection' },
    tags: ['movie', 'cinema', ...mv.tags]
  });
}

// 6. PHOTOS (Exactly 48)
const photoData = [
  // Feb photos
  { title: 'Steam rising from pour-over at Aurora', time: '2026-02-14T09:30:00Z', loc: 'Café Aurora', cam: 'Fujifilm X100V, 23mm, f/2.0, 1/250s, ISO 320', tags: ['coffee', 'morning', 'light'] },
  { title: 'Design Summit Keynote Hall', time: '2026-02-18T09:45:00Z', loc: 'Metropolitan Convention Hall', cam: 'iPhone 15 Pro, 24mm, f/1.78, 1/120s, ISO 80', tags: ['conference', 'stage', 'screens'] },
  { title: 'Whiteboard wireframes: node graph interaction', time: '2026-02-23T16:15:00Z', loc: 'District 4 Co-working', cam: 'iPhone 15 Pro, 24mm, f/1.78, 1/60s, ISO 160', tags: ['wireframes', 'design', 'ui'] },
  { title: 'Rain on studio skylight', time: '2026-02-27T17:40:00Z', loc: 'District 4 Co-working', cam: 'Fujifilm X100V, 23mm, f/2.8, 1/180s, ISO 640', tags: ['rain', 'window', 'mood'] },
  
  // Mar photos
  { title: 'Ergonomic split layout unboxed', time: '2026-03-02T10:15:00Z', loc: 'District 4 Co-working', cam: 'iPhone 15 Pro, 48mm, f/1.78, 1/100s, ISO 125', tags: ['desk', 'hardware', 'setup'] },
  { title: 'Architectural sketch: grid alignment', time: '2026-03-10T14:50:00Z', loc: 'Café Aurora', cam: 'Fujifilm X100V, 23mm, f/4.0, 1/125s, ISO 400', tags: ['notebook', 'coffee', 'sketches'] },
  { title: 'Sunset glow over Pacific breakers', time: '2026-03-21T18:45:00Z', loc: 'Beacon Point Lookout', cam: 'Fujifilm X100V, 23mm, f/5.6, 1/500s, ISO 160', tags: ['sunset', 'coast', 'ocean'] },
  { title: 'Silhouette of lighthouse ruins against twilight', time: '2026-03-21T19:10:00Z', loc: 'Beacon Point Lookout', cam: 'Fujifilm X100V, 23mm, f/2.0, 1/30s, ISO 1600', tags: ['lighthouse', 'dusk', 'ruins'] },
  { title: 'Whiteboard: Q1 sprint metrics', time: '2026-03-27T16:30:00Z', loc: 'District 4 Co-working', cam: 'iPhone 15 Pro, 24mm, f/1.78, 1/80s, ISO 200', tags: ['retro', 'team', 'charts'] },

  // Apr photos
  { title: 'Morning mist on regional train platform', time: '2026-04-10T06:12:00Z', loc: 'Terminal 2, North Gate', cam: 'iPhone 15 Pro, 24mm, f/1.78, 1/120s, ISO 100', tags: ['train', 'platform', 'mist'] },
  { title: 'Luggage tag B18 departure board', time: '2026-04-10T06:30:00Z', loc: 'Terminal 2, North Gate', cam: 'iPhone 15 Pro, 77mm, f/2.8, 1/200s, ISO 125', tags: ['transit', 'airport', 'departure'] },
  { title: 'Wing over cloud inversion at 18,000 ft', time: '2026-04-10T07:45:00Z', loc: 'Terminal 2, North Gate', cam: 'iPhone 15 Pro, 24mm, f/1.78, 1/2000s, ISO 50', tags: ['flight', 'clouds', 'travel'] },
  { title: 'Etching press with zinc relief plates', time: '2026-04-24T18:45:00Z', loc: 'The Mill Arts Corridor', cam: 'Fujifilm X100V, 23mm, f/2.8, 1/90s, ISO 800', tags: ['printmaking', 'art', 'press'] },
  { title: 'Fresh block prints drying on clothesline', time: '2026-04-24T19:30:00Z', loc: 'The Mill Arts Corridor', cam: 'Fujifilm X100V, 23mm, f/2.0, 1/125s, ISO 1000', tags: ['prints', 'ink', 'craft'] },

  // May photos
  { title: 'Golden crust sourdough loaves on cooling rack', time: '2026-05-02T10:10:00Z', loc: 'The Mill Bakery', cam: 'Fujifilm X100V, 23mm, f/2.8, 1/320s, ISO 200', tags: ['bakery', 'bread', 'morning'] },
  { title: 'Espresso cup on rough-sawn cedar table', time: '2026-05-02T10:25:00Z', loc: 'The Mill Bakery', cam: 'Fujifilm X100V, 23mm, f/2.0, 1/500s, ISO 160', tags: ['patio', 'coffee', 'cedar'] },
  { title: 'Sunlight filtering through library card catalog', time: '2026-05-18T14:45:00Z', loc: 'St. Jude Community Library', cam: 'Fujifilm X100V, 23mm, f/2.8, 1/160s, ISO 400', tags: ['library', 'archive', 'light'] },
  { title: 'Hardcover edition open to Chapter 4 on desk', time: '2026-05-18T15:20:00Z', loc: 'St. Jude Community Library', cam: 'iPhone 15 Pro, 24mm, f/1.78, 1/90s, ISO 250', tags: ['reading', 'books', 'quiet'] },
  { title: 'Gallery wall: black and white brutalist prints', time: '2026-05-20T18:15:00Z', loc: 'Civic Modern Gallery', cam: 'Fujifilm X100V, 23mm, f/4.0, 1/60s, ISO 800', tags: ['exhibition', 'monochrome', 'architecture'] },
  { title: 'Exhibition catalogue with silver foil emboss', time: '2026-05-20T18:50:00Z', loc: 'Civic Modern Gallery', cam: 'iPhone 15 Pro, 48mm, f/1.78, 1/100s, ISO 200', tags: ['catalogue', 'minimalism', 'foil'] },

  // Jun photos
  { title: 'Audio waveform monitor on studio desk', time: '2026-06-12T14:00:00Z', loc: 'District 4 Co-working', cam: 'iPhone 15 Pro, 24mm, f/1.78, 1/60s, ISO 320', tags: ['audio', 'monitors', 'workspace'] },
  { title: 'Modular synth cables patched into filter unit', time: '2026-06-25T20:15:00Z', loc: 'Old St. James Chapel', cam: 'Fujifilm X100V, 23mm, f/2.0, 1/45s, ISO 1250', tags: ['synth', 'patchcables', 'ambient'] },
  { title: 'Stained glass window illuminated by blue floodlight', time: '2026-06-25T21:40:00Z', loc: 'Old St. James Chapel', cam: 'Fujifilm X100V, 23mm, f/2.0, 1/30s, ISO 2000', tags: ['stainedglass', 'concert', 'chapel'] },

  // Jul photos
  { title: 'Aneroid barometer needle pointing to 1014 hPa', time: '2026-07-08T18:00:00Z', loc: 'District 4 Co-working', cam: 'Fujifilm X100V, 23mm, f/2.8, 1/120s, ISO 400', tags: ['analog', 'barometer', 'weather'] },
  { title: 'Cold brew bottle sweating in afternoon heat', time: '2026-07-16T15:10:00Z', loc: 'Café Aurora', cam: 'iPhone 15 Pro, 48mm, f/1.78, 1/250s, ISO 100', tags: ['coldbrew', 'summer', 'heat'] },
  { title: 'Keys and signed lease packet on kitchen counter', time: '2026-07-31T11:45:00Z', loc: 'District Management Office', cam: 'iPhone 15 Pro, 24mm, f/1.78, 1/120s, ISO 160', tags: ['lease', 'keys', 'home'] },

  // Aug photos (includes Chapter 03: The Escape)
  { title: 'Portra 400 film boxes arranged by expiration date', time: '2026-08-10T13:00:00Z', loc: 'District 4 Co-working', cam: 'Fujifilm X100V, 23mm, f/4.0, 1/180s, ISO 250', tags: ['film', 'portra', 'analog'] },
  { title: 'Packed Osprey bag with rain shell strapped on', time: '2026-08-16T18:30:00Z', loc: 'Redwood Trailhead', cam: 'iPhone 15 Pro, 24mm, f/1.78, 1/100s, ISO 200', tags: ['escape', 'backpack', 'prep'] },
  // 3 photos specifically in Chapter 03 (Aug 17 - Sep 04):
  { title: 'Redwood canopy at 06:40 AM', time: '2026-08-20T06:40:00Z', loc: 'Redwood Trailhead', cam: 'Fujifilm X100V, 23mm, f/2.8, 1/90s, ISO 400', tags: ['redwoods', 'canopy', 'dawn', 'escape'] },
  { title: 'Morning fog over coastal ridge', time: '2026-08-22T08:15:00Z', loc: 'Beacon Point Lookout', cam: 'Fujifilm X100V, 23mm, f/5.6, 1/640s, ISO 160', tags: ['fog', 'ridge', 'morning', 'escape'] },
  { title: 'Trail marker 14B carved into cedar post', time: '2026-08-25T11:30:00Z', loc: 'Redwood Trailhead', cam: 'Fujifilm X100V, 23mm, f/4.0, 1/250s, ISO 200', tags: ['trail', 'cedar', 'hike', 'escape'] },
  { title: 'Campfire embers glowing against night sky', time: '2026-08-16T21:40:00Z', loc: 'Redwood Trailhead Campground', cam: 'Fujifilm X100V, 23mm, f/2.0, 1/15s, ISO 3200', tags: ['campfire', 'night', 'stars'] },

  // Sep photos
  { title: 'Half marathon runners crossing coastal bluff bridge', time: '2026-09-06T08:15:00Z', loc: 'Beacon Point Lookout', cam: 'Fujifilm X100V, 23mm, f/5.6, 1/1000s, ISO 200', tags: ['marathon', 'running', 'bluff'] },
  { title: 'Finisher medal and hydration bottle on grass', time: '2026-09-06T09:40:00Z', loc: 'Beacon Point Lookout', cam: 'iPhone 15 Pro, 24mm, f/1.78, 1/800s, ISO 64', tags: ['medal', 'running', 'morning'] },
  { title: 'Bamboo chasen whisking matcha foam', time: '2026-09-12T16:45:00Z', loc: 'Komorebi Tea House', cam: 'Fujifilm X100V, 23mm, f/2.8, 1/160s, ISO 500', tags: ['matcha', 'tea', 'bamboo'] },
  { title: 'Moss garden courtyard through shoji screen', time: '2026-09-12T17:10:00Z', loc: 'Komorebi Tea House', cam: 'Fujifilm X100V, 23mm, f/4.0, 1/120s, ISO 320', tags: ['garden', 'moss', 'shoji'] },
  { title: 'New borosilicate French press vessel in morning light', time: '2026-09-14T11:00:00Z', loc: 'Café Aurora', cam: 'iPhone 15 Pro, 24mm, f/1.78, 1/180s, ISO 160', tags: ['coffee', 'glass', 'light'] },
  { title: 'Marquee sign illuminated: The Zone of Interest', time: '2026-09-28T19:10:00Z', loc: 'Cinema Roxy', cam: 'Fujifilm X100V, 23mm, f/2.0, 1/60s, ISO 1000', tags: ['marquee', 'cinema', 'neon'] },
  { title: 'Empty cinema auditorium with red velvet seats', time: '2026-09-28T21:40:00Z', loc: 'Cinema Roxy', cam: 'Fujifilm X100V, 23mm, f/2.0, 1/30s, ISO 1600', tags: ['seats', 'theatre', 'empty'] },

  // Oct photos
  { title: 'Hanger rack with charcoal wool overcoat', time: '2026-10-06T16:30:00Z', loc: 'District 4 Co-working', cam: 'iPhone 15 Pro, 24mm, f/1.78, 1/120s, ISO 200', tags: ['coat', 'autumn', 'wool'] },
  { title: 'Fallen yellow ginkgo leaves on pavement', time: '2026-10-11T13:20:00Z', loc: 'St. Jude Community Library', cam: 'Fujifilm X100V, 23mm, f/4.0, 1/250s, ISO 200', tags: ['ginkgo', 'autumn', 'leaves'] },
  { title: 'Stone steps leading down to quiet library courtyard', time: '2026-10-11T13:50:00Z', loc: 'St. Jude Community Library', cam: 'Fujifilm X100V, 23mm, f/5.6, 1/320s, ISO 160', tags: ['steps', 'architecture', 'stone'] },
  { title: 'Evening fog rolling over coastal ridge line', time: '2026-10-15T18:20:00Z', loc: 'Beacon Point Lookout', cam: 'Fujifilm X100V, 23mm, f/4.0, 1/125s, ISO 800', tags: ['fog', 'ridge', 'twilight'] },
  { title: 'Mug of dark roast beside closed notebook', time: '2026-10-19T10:00:00Z', loc: 'Café Aurora', cam: 'iPhone 15 Pro, 24mm, f/1.78, 1/140s, ISO 200', tags: ['coffee', 'notebook', 'end'] },
  { title: 'Reflection of streetlights in wet tarmac', time: '2026-10-22T20:45:00Z', loc: 'District 4 Co-working', cam: 'Fujifilm X100V, 23mm, f/2.0, 1/40s, ISO 1600', tags: ['night', 'rain', 'asphalt'] },
  { title: 'Desk lamp throwing circular pool of amber light', time: '2026-10-24T23:15:00Z', loc: 'District 4 Co-working', cam: 'Fujifilm X100V, 23mm, f/2.0, 1/50s, ISO 1250', tags: ['lamp', 'amber', 'desk'] },
  { title: 'Final stack of index cards and field notes', time: '2026-10-28T16:00:00Z', loc: 'District 4 Co-working', cam: 'iPhone 15 Pro, 48mm, f/1.78, 1/120s, ISO 160', tags: ['cards', 'archive', 'finish'] },
  { title: 'Archival binder indexed and shelved', time: '2026-10-30T17:30:00Z', loc: 'District 4 Co-working', cam: 'Fujifilm X100V, 23mm, f/2.8, 1/125s, ISO 400', tags: ['archive', 'workspace', 'conclusion'] }
];

for (const ph of photoData) {
  records.push({
    id: makeId('photo'),
    type: 'photo',
    title: ph.title,
    timestamp: ph.time,
    location: ph.loc,
    description: `Photograph captured at ${ph.loc}. Exposure: ${ph.cam}`,
    metadata: { camera_details: ph.cam, resolution: '24.2 MP', file_format: 'RAW + JPEG', color_profile: 'Display P3' },
    tags: ['photo', ...ph.tags]
  });
}

// 7. MESSAGES (Exactly 62)
const messageTopics = [
  // Feb messages
  { contact: 'Elena (Design Lead)', text: 'Grabbed the corner table at Aurora if you want to run through the design tokens before the keynote.', time: '2026-02-14T09:18:00Z', loc: 'Café Aurora' },
  { contact: 'Elena (Design Lead)', text: 'The token hierarchy slides look tight. Let us meet inside the main hall by 8:45.', time: '2026-02-18T08:20:00Z', loc: 'Metropolitan Convention Hall' },
  { contact: 'Marcus (Engineering)', text: 'Summit auditorium Wi-Fi is hammered. Push the Figma branch directly when you have a chance.', time: '2026-02-18T11:15:00Z', loc: 'Metropolitan Convention Hall' },
  { contact: 'Elena (Design Lead)', text: 'Brilliant response to the layout questions during Q&A. Heading to the speaker lounge now.', time: '2026-02-18T16:30:00Z', loc: 'Metropolitan Convention Hall' },
  { contact: 'David (Audio Lab)', text: 'Did you hear the new Kiasmos track? That middle breakdown reminds me of your generative timeline concepts.', time: '2026-02-21T14:10:00Z' },
  { contact: 'Sarah (Studio)', text: 'Leaving the office keys by the desk pod. Remember to arm the alarm when leaving.', time: '2026-02-25T19:00:00Z', loc: 'District 4 Co-working' },
  
  // Mar messages
  { contact: 'Marcus (Engineering)', text: 'How is the new split keyboard feel? My wrists have been killing me after last sprint.', time: '2026-03-03T11:05:00Z' },
  { contact: 'Elena (Design Lead)', text: 'Reviewed the node graph canvas prototype. The edge routing is buttery smooth.', time: '2026-03-08T15:20:00Z', loc: 'District 4 Co-working' },
  { contact: 'David (Audio Lab)', text: 'Sending you the acoustic test WAV files. Try them with your new sound pads.', time: '2026-03-16T10:45:00Z' },
  { contact: 'Maya (Trail Club)', text: 'Low tide at Beacon Point is around 6:15 PM today. Fog should stay offshore.', time: '2026-03-21T15:30:00Z', loc: 'Beacon Point Lookout' },
  { contact: 'Maya (Trail Club)', text: 'Just saw the sunset photo from the lookout point—insane color gradient.', time: '2026-03-21T20:10:00Z', loc: 'Beacon Point Lookout' },
  { contact: 'Sarah (Studio)', text: 'Retro presentation is queued on the conference screen. Starting in 10 minutes.', time: '2026-03-27T14:50:00Z', loc: 'District 4 Co-working' },

  // Apr messages
  { contact: 'Elena (Design Lead)', text: 'Have a safe flight out north! Bring back some of that sourdough if you pass the canal.', time: '2026-04-10T05:50:00Z', loc: 'Terminal 2, North Gate' },
  { contact: 'Marcus (Engineering)', text: 'Boarding gate changed to B18 just in case you are still at security.', time: '2026-04-10T06:18:00Z', loc: 'Terminal 2, North Gate' },
  { contact: 'Marcus (Engineering)', text: 'Touching down at 9:30. Let me know when you reach the transit station.', time: '2026-04-10T07:15:00Z' },
  { contact: 'Claire (Print Studio)', text: 'We are inking up the proofing press at 6 PM. Plenty of test paper on hand.', time: '2026-04-24T17:15:00Z', loc: 'The Mill Arts Corridor' },
  { contact: 'Claire (Print Studio)', text: 'Thanks for stopping by! The linocut proofs turned out sharper than expected.', time: '2026-04-24T21:10:00Z', loc: 'The Mill Arts Corridor' },

  // May messages
  { contact: 'Elena (Design Lead)', text: 'Mill Bakery line is actually moving fast today. Getting a table outside.', time: '2026-05-02T09:50:00Z', loc: 'The Mill Bakery' },
  { contact: 'Elena (Design Lead)', text: 'Left the second pain au chocolat in the paper bag for you.', time: '2026-05-02T11:15:00Z', loc: 'The Mill Bakery' },
  { contact: 'David (Audio Lab)', text: 'Have you checked out the architectural photo exhibit at Civic Modern? Opens today.', time: '2026-05-20T14:30:00Z' },
  { contact: 'David (Audio Lab)', text: 'Standing by the black and white gallery wall near the atrium entrance.', time: '2026-05-20T17:35:00Z', loc: 'Civic Modern Gallery' },
  { contact: 'Sarah (Studio)', text: 'Those gallery catalogue typography choices are pristine. Exactly the font weight we wanted.', time: '2026-05-20T20:10:00Z' },

  // Jun messages
  { contact: 'Marcus (Engineering)', text: 'Isolation pads arrived at reception. Sound dampening test ready.', time: '2026-06-13T10:00:00Z', loc: 'District 4 Co-working' },
  { contact: 'David (Audio Lab)', text: 'Doors open at Old St. James at 7:30. Acoustics in the vaulted ceiling are wild.', time: '2026-06-25T18:45:00Z', loc: 'Old St. James Chapel' },
  { contact: 'David (Audio Lab)', text: 'That quadraphonic piece with the modular synth took my breath away.', time: '2026-06-25T22:30:00Z', loc: 'Old St. James Chapel' },

  // Jul messages
  { contact: 'Elena (Design Lead)', text: 'Meeting in Aurora courtyard? AC in the main room is cold today.', time: '2026-07-16T14:40:00Z', loc: 'Café Aurora' },
  { contact: 'Property Admin', text: 'Lease extension document uploaded to tenant portal. Signature required before noon.', time: '2026-07-31T09:30:00Z', loc: 'District Management Office' },
  { contact: 'Property Admin', text: 'Countersigned receipt sent. Building access cards updated for next 12 months.', time: '2026-07-31T12:15:00Z', loc: 'District Management Office' },

  // Aug messages (Includes Chapter 03: The Escape messages)
  { contact: 'Maya (Trail Club)', text: 'Weather forecast for the coastal ridge shows overcast mornings and dry afternoons.', time: '2026-08-16T18:20:00Z' },
  { contact: 'Maya (Trail Club)', text: 'Did you pick up the waterproof shell? The ridge gets gusty past mile 6.', time: '2026-08-18T10:15:00Z' },
  { contact: 'Maya (Trail Club)', text: 'Camping permit is pinned to site 3 at Redwood Campground. See you by the fire at 5.', time: '2026-08-15T14:10:00Z', loc: 'Redwood Trailhead Campground' },
  { contact: 'Elena (Design Lead)', text: 'Cell reception will be dead out there—enjoy the hike! Do not think about sprints.', time: '2026-08-16T16:00:00Z' },
  { contact: 'Elena (Design Lead)', text: 'Checking in—hope the ridge trail wasn’t washed out by the spring slides.', time: '2026-09-05T12:00:00Z' },
  { contact: 'Maya (Trail Club)', text: 'Service is spotty up here, reach you Sunday when we cross back down.', time: '2026-08-27T08:45:00Z', loc: 'Redwood Trailhead' },

  // Sep messages
  { contact: 'Maya (Trail Club)', text: 'Bib pickup for the coastal half is at 6:45 AM at the Beacon Point shelter.', time: '2026-09-05T19:00:00Z', loc: 'Beacon Point Lookout' },
  { contact: 'Maya (Trail Club)', text: 'Crushed that hill climb on mile 9! Finish line times will be posted shortly.', time: '2026-09-06T10:15:00Z', loc: 'Beacon Point Lookout' },
  { contact: 'Elena (Design Lead)', text: 'Tried that Komorebi tea spot you mentioned. The moss courtyard is unreal quiet.', time: '2026-09-12T15:50:00Z', loc: 'Komorebi Tea House' },
  { contact: 'Elena (Design Lead)', text: 'Grabbing a booth inside Cinema Roxy. 35mm projector warmup sound is so nostalgic.', time: '2026-09-28T19:05:00Z', loc: 'Cinema Roxy' },

  // Oct messages
  { contact: 'Marcus (Engineering)', text: 'Q4 architecture doc is ready for your feedback. Let’s do a sync tomorrow.', time: '2026-10-08T11:30:00Z', loc: 'District 4 Co-working' },
  { contact: 'Sarah (Studio)', text: 'Left the library archives folder on your desk. Those old town maps are fascinating.', time: '2026-10-12T14:00:00Z', loc: 'District 4 Co-working' },
  { contact: 'Elena (Design Lead)', text: 'One last coffee session at Aurora before the winter schedule kicks in?', time: '2026-10-19T08:45:00Z', loc: 'Café Aurora' },
  { contact: 'Elena (Design Lead)', text: 'Table by the bookshelf is open. See you in five.', time: '2026-02-14T09:12:00Z', loc: 'Café Aurora' },

  // Additional realistic conversational messages filling to 62:
  { contact: 'Marcus (Engineering)', text: 'Production deploy went through with zero downtime. Clean logs across all clusters.', time: '2026-02-19T17:00:00Z' },
  { contact: 'Claire (Print Studio)', text: 'Got a batch of French cotton rag paper if you want to experiment with typography plates.', time: '2026-03-04T13:10:00Z' },
  { contact: 'David (Audio Lab)', text: 'Found an original pressing of The Campfire Headphase on vinyl at the flea market!', time: '2026-03-18T16:20:00Z' },
  { contact: 'Maya (Trail Club)', text: 'Trail cleanup day next Saturday along the south bluff. Bring work gloves if you join.', time: '2026-04-05T11:00:00Z' },
  { contact: 'Elena (Design Lead)', text: 'The design token spec was adopted by the mobile team without questions.', time: '2026-04-16T15:40:00Z' },
  { contact: 'Sarah (Studio)', text: 'Can you bring the HDMI adapter from the library conference desk?', time: '2026-05-18T13:50:00Z', loc: 'St. Jude Community Library' },
  { contact: 'Marcus (Engineering)', text: 'Benchmarking the client-side graph renderer. 60 FPS up to 5,000 nodes.', time: '2026-06-02T16:15:00Z' },
  { contact: 'Elena (Design Lead)', text: 'Working from Aurora patio today. Let me know if you need eyes on the new palette.', time: '2026-06-08T10:20:00Z', loc: 'Café Aurora' },
  { contact: 'David (Audio Lab)', text: 'Reverb decay in the chapel was measured at 3.8 seconds. Perfect for ambient.', time: '2026-06-26T11:00:00Z' },
  { contact: 'Maya (Trail Club)', text: 'Lookout trail has two fallen pines near mile 2, but easy to step over.', time: '2026-07-12T09:30:00Z', loc: 'Beacon Point Lookout' },
  { contact: 'Marcus (Engineering)', text: 'All sprint deliverables merged before the weekend. Time for a breather.', time: '2026-07-24T18:00:00Z' },
  { contact: 'Sarah (Studio)', text: 'Remember to return the archive keycard to the front desk before 5 PM.', time: '2026-08-01T15:00:00Z' },
  { contact: 'Maya (Trail Club)', text: 'Pack some extra electrolytes—the afternoon ridge climb is fully exposed.', time: '2026-08-15T20:00:00Z' },
  { contact: 'David (Audio Lab)', text: 'Recorded some field audio of the stream near Trailhead 4B. The stereo imaging is pure gold.', time: '2026-09-05T14:30:00Z', loc: 'Redwood Trailhead' },
  { contact: 'Elena (Design Lead)', text: 'Hope you are unplugged and getting some proper rest out in the redwoods.', time: '2026-08-16T11:00:00Z' },
  { contact: 'Claire (Print Studio)', text: 'New calendar prints are off the press. Dropping one at your desk on Monday.', time: '2026-09-15T17:00:00Z' },
  { contact: 'David (Audio Lab)', text: 'Listening to Max Richter while looking out at the rain. Peak autumn feeling.', time: '2026-10-04T18:00:00Z' },
  { contact: 'Sarah (Studio)', text: 'Annual inventory check done. Studio supplies restocked for Q4.', time: '2026-10-16T16:45:00Z' },
  { contact: 'Marcus (Engineering)', text: 'The offline sync engine is passing all stress tests. Ready for staging.', time: '2026-10-21T17:20:00Z' },
  { contact: 'Elena (Design Lead)', text: 'Looking over the year’s project archives. It’s wild how everything connected.', time: '2026-10-26T19:30:00Z' }
];

for (const msg of messageTopics) {
  records.push({
    id: makeId('message'),
    type: 'message',
    title: `Message from ${msg.contact}`,
    timestamp: msg.time,
    location: msg.loc || undefined,
    description: `"${msg.text}"`,
    metadata: { sender: msg.contact, channel: 'Encrypted Chat', direction: 'Incoming' },
    tags: ['message', msg.contact.toLowerCase().split(' ')[0], 'communication']
  });
}

// 8. SEARCHES (Exactly 78)
const searchQueries = [
  // Searches preceding purchases / places / events:
  { query: 'archival fineliner waterproof black 0.3mm', time: '2026-02-12T11:20:00Z', intent: 'Product Research' },
  { query: 'dot grid notebook 120gsm lay flat binding', time: '2026-02-12T12:05:00Z', intent: 'Product Research' },
  { query: 'café aurora opening hours weekend', time: '2026-02-13T19:45:00Z', intent: 'Location Research' },
  { query: 'café aurora pour over ethiopian bean roaster', time: '2026-02-14T08:50:00Z', intent: 'Food & Drink' },
  { query: 'design systems summit convention hall parking map', time: '2026-02-17T21:10:00Z', intent: 'Event Logistics' },
  { query: 'spatial design token naming conventions 2026', time: '2026-02-18T07:40:00Z', intent: 'Technical Reference' },
  { query: 'kiasmos tour dates 2026 soundscapes', time: '2026-02-22T23:10:00Z', intent: 'Music Search' },
  { query: 'ergonomic split keyboard tenting kit comparison', time: '2026-02-28T14:30:00Z', intent: 'Hardware Evaluation' },
  { query: 'keystudio columnar layout wrist strain relief', time: '2026-03-01T09:15:00Z', intent: 'Ergonomics' },
  { query: 'dampening studio reflection points first reflection zone', time: '2026-03-14T19:20:00Z', intent: 'Audio Engineering' },
  { query: 'high density acoustic foam bevel vs pyramid', time: '2026-03-15T14:00:00Z', intent: 'Hardware Evaluation' },
  { query: 'beacon point lookout sunset golden hour time march', time: '2026-03-21T16:15:00Z', intent: 'Field Preparation' },
  { query: 'pacific coast trail parking turnout B rules', time: '2026-03-21T17:00:00Z', intent: 'Transit & Access' },
  { query: 'jon hopkins immunity piano sheet arrangement', time: '2026-04-03T00:15:00Z', intent: 'Music Analysis' },
  { query: 'regional rail zone 1 to 4 pass weekend schedule', time: '2026-04-09T18:30:00Z', intent: 'Transit Planning' },
  { query: 'metro airport terminal 2 coffee options after security', time: '2026-04-10T05:30:00Z', intent: 'Travel Logistics' },
  { query: 'sennheiser hd600 4.4mm balanced cable pinout', time: '2026-04-22T17:15:00Z', intent: 'Audio Gear' },
  { query: 'open studio night printmakers canal basin map', time: '2026-04-24T15:40:00Z', intent: 'Event Details' },
  { query: 'the mill bakery weekend sourdough rotation menu', time: '2026-05-01T20:20:00Z', intent: 'Food & Dining' },
  { query: 'norman design of everyday things revised edition chapters', time: '2026-05-18T11:45:00Z', intent: 'Book Search' },
  { query: 'st jude library architectural history archive floor plan', time: '2026-05-18T13:10:00Z', intent: 'Research Preparation' },
  { query: 'civic modern gallery light and shadow exhibition curator talk', time: '2026-05-20T11:00:00Z', intent: 'Exhibition Logistics' },
  { query: 'studio monitor decoupling pads angle adjustment', time: '2026-06-12T11:40:00Z', intent: 'Audio Calibration' },
  { query: 'old st james chapel acoustic reverberation time', time: '2026-06-25T16:00:00Z', intent: 'Concert Preparation' },
  { query: 'aneroid barometer maritime brass calibration sea level', time: '2026-07-08T15:20:00Z', intent: 'Analog Instruments' },
  { query: 'café aurora cold brew single origin roast notes', time: '2026-07-16T13:40:00Z', intent: 'Food & Dining' },
  { query: 'standard residential lease renewal tenant rights notice period', time: '2026-07-30T21:00:00Z', intent: 'Administrative' },
  { query: '120 film stock portra 400 push 1 stop tone curve', time: '2026-08-10T11:00:00Z', intent: 'Photography Technique' },

  // Chapter 03: The Escape 6 searches (Aug 17 - Sep 04):
  { query: 'redwood trail weather august morning fog index', time: '2026-08-17T10:15:00Z', intent: 'Chapter 03 The Escape' },
  { query: 'coastal ridge cabin check-in trail access map', time: '2026-08-17T14:40:00Z', intent: 'Chapter 03 The Escape' },
  { query: 'best lightweight breathable waterproof rain shell jacket', time: '2026-08-18T11:20:00Z', intent: 'Chapter 03 The Escape' },
  { query: 'osprey 28L daypack hydration bladder compatibility', time: '2026-08-19T14:10:00Z', intent: 'Chapter 03 The Escape' },
  { query: 'offline topo maps app gps without cell service', time: '2026-08-19T21:30:00Z', intent: 'Chapter 03 The Escape' },
  { query: 'quiet coastal campsites near redwood trailhead 4B', time: '2026-08-20T22:00:00Z', intent: 'Chapter 03 The Escape' },

  // Post-escape searches:
  { query: 'coastal trail half marathon elevation profile mile by mile', time: '2026-09-05T18:20:00Z', intent: 'Athletic Logistics' },
  { query: 'post marathon recovery hydration electrolyte ratio', time: '2026-09-06T12:30:00Z', intent: 'Health & Recovery' },
  { query: 'uji ceremonial grade matcha water temperature celsius', time: '2026-09-12T14:10:00Z', intent: 'Culinary Craft' },
  { query: 'cinema roxy 35mm schedule september zone of interest', time: '2026-09-27T19:45:00Z', intent: 'Cultural Calendar' },
  { query: 'charcoal wool overcoat tailored fit raglan sleeve', time: '2026-10-06T12:00:00Z', intent: 'Apparel Research' },
  { query: 'ginkgo biloba leaf yellowing peak week mid autumn', time: '2026-10-11T09:15:00Z', intent: 'Nature Observation' },
  { query: 'closing café aurora winter holiday hours notice', time: '2026-10-18T17:30:00Z', intent: 'Location Research' }
];

// Add more searches up to 78 with real technical, creative, and life queries:
const additionalQueries = [
  'tailwind v4 css variables root configuration',
  'framer motion layout animation drag constraints',
  'd3 force layout link distance tension parameter',
  'lucide react icon stroke width consistency',
  'canvas antialiasing device pixel ratio retina display',
  'svg path quadratic bezier smoothing algorithm',
  'typescript strict index access sound practices',
  'web audio api visualizer frequency binned array',
  'iso 320 film grain simulation overlay shader',
  'binaural audio panning head related transfer function',
  'modular grid system 8pt vertical baseline rhythm',
  'monospaced typeface legibility in terminal dashboards',
  'color contrast ratio wcag aaa 7 to 1 requirements',
  'local storage persistence quota limits chromium',
  'deterministic graph clustering louvain algorithm js',
  'temporal density clustering time series sliding window',
  'jaccard similarity index tag overlap formula',
  'levenshtein distance string fuzzy matching javascript',
  'breadth first search connected components undirected graph',
  'prefers reduced motion media query best practices',
  'keyboard accessibility focus visible styling modern css',
  'svg viewport viewBox transform matrix pan zoom',
  'virtualized list windowing 60fps scrolling',
  'memoization strategies in react react 19 compiler',
  'borosilicate glass thermal shock coefficient limits',
  'pour over brew ratio 1 to 16 coffee bed drawdown',
  'roasting profiles light roast anaerobic fermentation',
  'coastal fog condensation rate maritime ecology',
  'aneroid movement vacuum chamber diaphragm mechanics',
  'balanced audio cable noise rejection common mode',
  'columnar keyboard layout homerow finger travel distance',
  'mid century municipal architecture concrete formwork texture',
  'linocut relief ink oil vs water washup solvent',
  'kodak portra 400 skin tone latitude overexposure tolerance',
  '35mm optical projector carbon arc vs xenon lamp color temp',
  'ambient music dynamic range compression r128 standard',
  'nils frahm felt piano dampening felt thickness',
  'max richter recomposed vivaldi violin transcription score',
  'autumn trail running shoe traction wet granite rock'
];

for (const q of searchQueries) {
  records.push({
    id: makeId('search'),
    type: 'search',
    title: `Search: "${q.query}"`,
    timestamp: q.time,
    description: `User initiated browser search for: "${q.query}"`,
    metadata: { query: q.query, category: q.intent, browser: 'Privacy Browser v12' },
    tags: ['search', ...q.query.split(' ').slice(0, 4)]
  });
}

// Fill remaining searches to reach 78:
const remainingSearchCount = 78 - records.filter(r => r.type === 'search').length;
for (let i = 0; i < remainingSearchCount; i++) {
  const queryStr = additionalQueries[i % additionalQueries.length];
  // Spread timestamps across Mar - Oct (avoiding Aug 17 - Sep 04)
  const day = 1 + (i * 3) % 27;
  let mNum = 3 + Math.floor(i / 6);
  if (mNum === 8 || mNum === 9) mNum = (i % 2 === 0 ? 7 : 10);
  const month = String(mNum).padStart(2, '0');
  const hour = String(9 + (i * 2) % 13).padStart(2, '0');
  const min = String((i * 17) % 60).padStart(2, '0');
  records.push({
    id: makeId('search'),
    type: 'search',
    title: `Search: "${queryStr}"`,
    timestamp: `2026-${month}-${String(day).padStart(2, '0')}T${hour}:${min}:00Z`,
    description: `User initiated search query: "${queryStr}"`,
    metadata: { query: queryStr, category: 'Technical / Creative Query', browser: 'Privacy Browser v12' },
    tags: ['search', ...queryStr.split(' ').slice(0, 3)]
  });
}

// 9. NOTES (Exactly 51)
const baseNotes = [
  // Late night notes (pattern 1: 01:00 AM - 04:30 AM spikes):
  { title: 'The architecture of quiet things', time: '2026-02-15T02:15:00Z', text: 'Objects don’t demand attention when their affordances are obvious. The tactile feel of heavy cast switches.', tags: ['reflection', 'design', 'night'] },
  { title: 'Graph coordinates memo', time: '2026-02-21T01:45:00Z', text: 'If we weight edges by inverse time difference plus spatial proximity, related events cluster without artificial clustering passes.', tags: ['algorithms', 'math', 'night'] },
  { title: 'Midnight audio notes: Kiasmos rhythm', time: '2026-03-05T01:50:00Z', text: 'Notice how the kick drum is pitched down two octaves. Feels like footsteps on wet asphalt rather than a dancefloor track.', tags: ['music', 'analysis', 'night'] },
  { title: 'Late night ergonomics reflection', time: '2026-03-02T03:10:00Z', text: 'Typing on split boards forces shoulders back. Breathing changes immediately. Physical ergonomics alters thinking speed.', tags: ['ergonomics', 'habits', 'night'] },
  { title: 'Note on Nils Frahm spaces', time: '2026-07-02T02:40:00Z', text: 'The sound of the piano pedal squeaking is kept in the final master. Imperfection establishes the physical reality of the room.', tags: ['music', 'production', 'night'] },
  { title: 'Acoustic notes at 2 AM', time: '2026-07-14T02:15:00Z', text: 'City noise drops to 28dB after 2 AM. The only sound is the low drone of the HVAC across the alleyway.', tags: ['sound', 'solitude', 'night'] },

  // Café Aurora notes (pattern 2: Café Aurora recurring visits):
  { title: 'Aurora morning dispatch', time: '2026-02-14T09:45:00Z', text: 'Table 4 gets the direct winter light between 9 and 11. Ethiopian pour-over has clean jasmine notes today.', tags: ['café aurora', 'morning', 'coffee'], loc: 'Café Aurora' },
  { title: 'Sketch notes on the corner table', time: '2026-03-10T14:40:00Z', text: 'Outlining the evidence graph schema while watching pedestrians outside Aurora. Nine core hubs emerge.', tags: ['café aurora', 'design', 'schema'], loc: 'Café Aurora' },
  { title: 'Summer heatwave reflection at Aurora', time: '2026-07-16T15:20:00Z', text: 'Cold brew and brick walls keep the room 10 degrees cooler than the street. Finished reading chapter 6.', tags: ['café aurora', 'summer', 'notes'], loc: 'Café Aurora' },
  { title: 'Autumn return to Aurora', time: '2026-10-19T09:30:00Z', text: 'Same table, eight months later. The tree outside has lost all its leaves. Writing down the year’s conclusions.', tags: ['café aurora', 'autumn', 'closure'], loc: 'Café Aurora' },

  // Chapter 03: The Escape field note:
  { title: 'Field observations: stillness after 3 miles', time: '2026-08-20T08:30:00Z', text: 'Cell signal vanished at mile 1.2. The canopy cuts out direct sun completely; temperature dropped 8 degrees within 500 meters.', tags: ['escape', 'hiking', 'redwoods'], loc: 'Redwood Trailhead' },
  { title: 'Ridge campsite log', time: '2026-08-21T21:00:00Z', text: 'Fog bank rolled in from the west at 7:30 PM. Firewood is dry. Sound of distant foghorn every 30 seconds.', tags: ['escape', 'camping', 'ridge'], loc: 'Redwood Trailhead Campground' },

  // Beacon Point solitude notes:
  { title: 'Beacon Point wind log', time: '2026-03-21T18:55:00Z', text: 'Northwest wind at 18 knots. The ocean surface looks like hammered pewter. No other cars at the turnout.', tags: ['beacon point', 'nature', 'solitude'], loc: 'Beacon Point Lookout' },
  { title: 'Marathon pacing thoughts', time: '2026-09-06T11:00:00Z', text: 'Legs held up well on the ridge descent. The final 3 miles along the ocean bluff were pure cadence.', tags: ['running', 'beacon point', 'fitness'], loc: 'Beacon Point Lookout' },

  // Library & Exhibition notes:
  { title: 'Archive study notes: Civic Square 1954', time: '2026-05-18T16:00:00Z', text: 'Reviewing original blueprints of the civic auditorium. The proportional system was based on 3:5 ratios throughout.', tags: ['library', 'architecture', 'history'], loc: 'St. Jude Community Library' },
  { title: 'Light & Shadow exhibition review', time: '2026-05-20T19:20:00Z', text: 'Contrast is not about darkness; it is about where you place the light. High key vs low key photography study.', tags: ['art', 'photography', 'gallery'], loc: 'Civic Modern Gallery' },
  { title: 'Printmaker workshop reflections', time: '2026-04-24T20:30:00Z', text: 'Working with metal plate and roller forces commitment. There is no undo button in linocut printing.', tags: ['craft', 'printmaking', 'art'], loc: 'The Mill Arts Corridor' },

  // Philosophical & creative reflections:
  { title: 'Fragments vs Narrative', time: '2026-06-05T18:10:00Z', text: 'A receipt is a fact. Ten receipts are an itinerary. A hundred receipts are an identity.', tags: ['philosophy', 'data', 'receipts'] },
  { title: 'The illusion of linear memory', time: '2026-06-30T22:45:00Z', text: 'Memory does not work in chronological order. A song pulls you back to a rainy Tuesday four years ago.', tags: ['memory', 'time', 'music'] },
  { title: 'Sound and spatial enclosure', time: '2026-07-25T17:30:00Z', text: 'Why do high ceilings feel calm? The ear detects absence of close reflections. The brain interprets space as safety.', tags: ['acoustics', 'perception', 'space'] },
  { title: 'The tactile life of paper', time: '2026-08-11T16:20:00Z', text: 'Writing with ink on 120gsm paper forces slower phrasing. The physical drag of the nib against grain.', tags: ['stationery', 'analog', 'writing'] },
  { title: 'Post-trail decompression memo', time: '2026-09-05T20:00:00Z', text: 'First hot shower in five days. The skin still feels the cool humidity of the canyon mist.', tags: ['escape', 'transition', 'quiet'] },
  { title: 'Matcha ceremony observations', time: '2026-09-12T17:30:00Z', text: 'The deliberate pause between pouring hot water and lifting the whisk. Rhythm without hurry.', tags: ['mindfulness', 'tea', 'ritual'], loc: 'Komorebi Tea House' },
  { title: 'Celluloid flicker notes', time: '2026-09-28T22:15:00Z', text: 'The shutter mechanism creates 24 brief moments of total blackness every second. We spend half a film in darkness.', tags: ['cinema', 'film', 'perception'], loc: 'Cinema Roxy' },
  { title: 'Autumn light shift', time: '2026-10-14T17:10:00Z', text: 'The sun sets 3 minutes earlier each day now. Golden hour hits the studio brickwork at 4:45 PM.', tags: ['autumn', 'light', 'season'] }
];

for (const n of baseNotes) {
  records.push({
    id: makeId('note'),
    type: 'note',
    title: n.title,
    timestamp: n.time,
    location: n.loc || undefined,
    description: n.text,
    metadata: { word_count: n.text.split(' ').length, client: 'Local Notebook', char_count: n.text.length },
    tags: ['note', ...n.tags]
  });
}

// Fill remaining notes up to 51:
const additionalNoteSnippets = [
  'Design is the deliberate arrangement of constraints to produce clarity.',
  'When you simplify a system, you are not removing complexity; you are deciding who bears the burden.',
  'The digital footprint is a mosaic of micro-decisions made without an overarching plan.',
  'Every search query is a private confession of what we do not know.',
  'Locations anchor memory. If you forget what you thought, revisit where you stood.',
  'The difference between a habit and a ritual is attention.',
  'We photograph what we are afraid to forget.',
  'A song heard ten times in a week becomes the unofficial soundtrack to that week’s crisis.',
  'The morning train is a secular monastery: thirty people reading in silence under fluorescent light.',
  'Contrast is created by restraint, not by amplification.',
  'A clean desk does not guarantee clear thought, but a cluttered desk guarantees distraction.',
  'Analog instruments measure the world without asking for permission or uploading to a server.',
  'The physical resistance of a mechanical shutter is a contract between the eye and the scene.',
  'Every purchase receipt records an optimism about the future self who will use the object.',
  'Walking three miles changes the chemistry of blood and the cadence of sentence structure.',
  'Night is not just absence of light; it is the presence of acoustic quiet.',
  'Maps tell you where paths are; receipts tell you where people actually walked.',
  'The best interface is the one that disappears once the intent is achieved.',
  'We leave breadcrumbs everywhere: transit taps, card swipes, camera shutter logs.',
  'Connecting two distant facts produces meaning that neither fact possessed alone.',
  'The city is an ongoing conversation between architectural intention and human habit.',
  'Quietness is a scarce resource in modern computing environments.',
  'A well-tuned filter lets through only what deepens comprehension.',
  'The final receipt of the year is always an inventory of what survived.',
  'Forensics is not about judging the life; it is about reading the evidence with fidelity.'
];

const remainingNotesCount = 51 - records.filter(r => r.type === 'note').length;
for (let i = 0; i < remainingNotesCount; i++) {
  const text = additionalNoteSnippets[i % additionalNoteSnippets.length];
  const day = 1 + (i * 4) % 28;
  let mNumNote = 2 + Math.floor(i / 4); if (mNumNote === 8) mNumNote = 9; const month = String(mNumNote).padStart(2, '0');
  const hour = String(i % 2 === 0 ? 1 + (i % 4) : 10 + (i % 12)).padStart(2, '0');
  const min = String((i * 23) % 60).padStart(2, '0');
  records.push({
    id: makeId('note'),
    type: 'note',
    title: `Observation #${i + 26}`,
    timestamp: `2026-${month}-${String(day).padStart(2, '0')}T${hour}:${min}:00Z`,
    description: text,
    metadata: { word_count: text.split(' ').length, client: 'Local Notebook', char_count: text.length },
    tags: ['note', 'journal', 'observation']
  });
}

// Sort all records chronologically
records.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

// Verification
const typeCounts = {};
for (const r of records) {
  typeCounts[r.type] = (typeCounts[r.type] || 0) + 1;
}

console.log('Record type summary:');
console.log(typeCounts);
console.log(`TOTAL RECORDS: ${records.length}`);

// Write output
const outPath = path.resolve('src/data/raw_receipts.json');
fs.writeFileSync(outPath, JSON.stringify(records, null, 2), 'utf-8');
console.log(`Successfully generated ${records.length} records to ${outPath}`);
