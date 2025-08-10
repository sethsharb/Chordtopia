// --- Constants ---
const NOTE_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const NOTE_MAP = {};
const ID_TO_NOTE = {};
const ENHARMONIC_MAP = {
  'C♯': 'D♭', 'D♭': 'C♯',
  'D♯': 'E♭', 'E♭': 'D♯',
  'F♯': 'G♭', 'G♭': 'F♯',
  'G♯': 'A♭', 'A♭': 'G♯',
  'A♯': 'B♭', 'B♭': 'A♯',
  'E♯': 'F', 'F': 'E♯',
  'F♭': 'E', 'E': 'F♭',
  'C♭': 'B', 'B': 'C♭',
  'B♯': 'C', 'C': 'B♯'
};

function getNoteLetter(n) {
  return n.replace(/[♯♭]/, '');
}

function adjustEnharmonics(scale, root) {
  const noteLetters = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const result = [];
  let idx = noteLetters.indexOf(root[0]);

  for (let i = 0; i < scale.length; i++) {
    const expectedLetter = noteLetters[idx % 7];
    const candidates = [scale[i], ENHARMONIC_MAP[scale[i]]].filter(Boolean);
    const match = candidates.find(n => n[0] === expectedLetter) || scale[i];
    result.push(match);
    idx++;
  }

  return result;
}
let id = 0;
for (let octave = 1; octave <= 7; octave++) {
  for (let i = 0; i < 12; i++) {
    const sharpName = NOTE_NAMES[i] + octave;
    NOTE_MAP[sharpName] = id;
    ID_TO_NOTE[12 + id] = sharpName;

    const baseNote = NOTE_NAMES[i];
    const flatNote = ENHARMONIC_MAP[baseNote];
    if (flatNote) {
      const flatName = flatNote + octave;
      NOTE_MAP[flatName] = id;
    }
    id++;
  }
}

const MODES = {
  // Heptatonic (Diatonic) – Major and its modes
  Major: [2, 2, 1, 2, 2, 2, 1], // Ionian
  Dorian: [2, 1, 2, 2, 2, 1, 2],
  Phrygian: [1, 2, 2, 2, 1, 2, 2],
  Lydian: [2, 2, 2, 1, 2, 2, 1],
  Mixolydian: [2, 2, 1, 2, 2, 1, 2],
  Minor: [2, 1, 2, 2, 1, 2, 2], // Aeolian
  Locrian: [1, 2, 2, 1, 2, 2, 2],

  // Heptatonic – common variants
  HarmonicMinor: [2, 1, 2, 2, 1, 3, 1],
  MelodicMinor: [2, 1, 2, 2, 2, 2, 1], // Jazz (ascending)
  HarmonicMajor: [2, 2, 1, 2, 1, 3, 1],
  DoubleHarmonic: [1, 3, 1, 2, 1, 3, 1], // Byzantine / Gypsy major

  // Hexatonic
  WholeTone: [2, 2, 2, 2, 2, 2],
  MajorBlues: [2, 1, 1, 3, 2, 3], // 1 2 b3 3 5 6
  MinorBlues: [3, 2, 1, 1, 3, 2], // 1 b3 4 b5 5 b7

  // Pentatonic
  MajorPentatonic: [2, 2, 3, 2, 3],
  MinorPentatonic: [3, 2, 2, 3, 2],

  // Octatonic (Diminished)
  Diminished_Whole_Half: [2, 1, 2, 1, 2, 1, 2, 1],
  Diminished_Half_Whole: [1, 2, 1, 2, 1, 2, 1, 2],

  // Chromatic (12-tone)
  Chromatic: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};



const MODE_ROMAN_NUMERALS = {
  Major: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
  Dorian: ['i', 'ii', 'III', 'IV', 'v', 'vi°', 'VII'],
  Phrygian: ['i', 'II', 'III', 'iv', 'v°', 'VI', 'vii'],
  Lydian: ['I', 'II', 'iii', '<span class="acc">♯</span>iv°', 'V', 'vi', 'vii'],
  Mixolydian: ['I', 'ii', 'iii°', 'IV', 'v', 'vi', 'VII'],
  Minor: ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'],
  HarmonicMinor: ['i', 'ii°', 'III+', 'iv', 'V', 'VI', 'vii°'],
  MelodicMinor: ['i', 'ii', 'III', 'IV', 'V', 'vi°', 'vii°'],
  Locrian: ['i°', 'II', 'iii', 'iv', 'V', 'VI', 'VII']
};

const MODE_ROMAN_NUMERALS_7 = {
  Major: [
    'Imaj<span class="acc">7</span>',
    'ii<span class="acc">7</span>',
    'iii<span class="acc">7</span>',
    'IVmaj<span class="acc">7</span>',
    'V<span class="acc">7</span>',
    'vi<span class="acc">7</span>',
    'viiø<span class="acc">7</span>'
  ],
  Dorian: [
    'i<span class="acc">7</span>',
    'ii<span class="acc">7</span>',
    '<span class="acc">♭</span>IIImaj<span class="acc">7</span>',
    'IV<span class="acc">7</span>',
    'v<span class="acc">7</span>',
    'viø<span class="acc">7</span>',
    '<span class="acc">♭</span>VIImaj<span class="acc">7</span>'
  ],
  Phrygian: [
    'i<span class="acc">7</span>',
    '<span class="acc">♭</span>IImaj<span class="acc">7</span>',
    '<span class="acc">♭</span>III<span class="acc">7</span>',
    'iv<span class="acc">7</span>',
    'vø<span class="acc">7</span>',
    '<span class="acc">♭</span>VImaj<span class="acc">7</span>',
    '<span class="acc">♭</span>vii<span class="acc">7</span>'
  ],
  Lydian: [
    'Imaj<span class="acc">7</span>',
    'II<span class="acc">7</span>',
    'iii<span class="acc">7</span>',
    '<span class="acc">♯</span>ivø<span class="acc">7</span>',
    'Vmaj<span class="acc">7</span>',
    'vi<span class="acc">7</span>',
    'vii<span class="acc">7</span>'
  ],
  Mixolydian: [
    'I<span class="acc">7</span>',
    'ii<span class="acc">7</span>',
    'iiiø<span class="acc">7</span>',
    'IVmaj<span class="acc">7</span>',
    'v<span class="acc">7</span>',
    'vi<span class="acc">7</span>',
    'VIImaj<span class="acc">7</span>'
  ],
  Minor: [
    'i<span class="acc">7</span>',
    'iiø<span class="acc">7</span>',
    'IIImaj<span class="acc">7</span>',
    'iv<span class="acc">7</span>',
    'v<span class="acc">7</span>',
    'VImaj<span class="acc">7</span>',
    'VII<span class="acc">7</span>'
  ],
  HarmonicMinor: [
    'i(maj<span class="acc">7</span>)',
    'iiø<span class="acc">7</span>',
    'III+maj<span class="acc">7</span>',
    'iv<span class="acc">7</span>',
    'V<span class="acc">7</span>',
    'VImaj<span class="acc">7</span>',
    'vii°<span class="acc">7</span>'
  ],
  MelodicMinor: [
    'i(maj<span class="acc">7</span>)',
    'ii<span class="acc">7</span>',
    'III+maj<span class="acc">7</span>',
    'IV<span class="acc">7</span>',
    'V<span class="acc">7</span>',
    'viø<span class="acc">7</span>',
    'viiø<span class="acc">7</span>'
  ],
  Locrian: [
    'iø<span class="acc">7</span>',
    'IImaj<span class="acc">7</span>',
    'iii<span class="acc">7</span>',
    'iv<span class="acc">7</span>',
    'Vmaj<span class="acc">7</span>',
    'VI<span class="acc">7</span>',
    'vii<span class="acc">7</span>'
  ]
};

// Default key list used when a scale doesn't define a preferred set
const DEFAULT_KEYS = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];

function triadRomanForQuality(baseKey, scalePCs, degreeIndex, quality) {
  // Start from degree with correct accidentals (e.g., ♭II, ♯iv)
  const baseWithAcc = degreeRomanWithAccidentals(baseKey, scalePCs, degreeIndex);
  const caseRomans = (str, toLower) => str.replace(/VII|VI|IV|V|III|II|I/g, m => toLower ? m.toLowerCase() : m);

  switch (quality) {
    case 'Major': return caseRomans(baseWithAcc, false);
    case 'Minor': return caseRomans(baseWithAcc, true);
    case 'Diminished': return caseRomans(baseWithAcc, true) + '°';
    case 'Augmented': return caseRomans(baseWithAcc, false) + '+';
    case 'Sus2': return caseRomans(baseWithAcc, false) + '(sus2)';
    case 'Sus4': return caseRomans(baseWithAcc, false) + '(sus4)';
    case 'Quartal': return caseRomans(baseWithAcc, false) + '(quartal)';
    default: return caseRomans(baseWithAcc, false);
  }
}

function seventhRomanForQuality(baseKey, scalePCs, degreeIndex, quality7) {
  // Map the 7th quality to its implied triad flavor
  const triadFlavor =
    quality7 === 'Major7' ? 'Major' :
      quality7 === 'Dominant7' ? 'Major' :
        quality7 === 'Minor7' ? 'Minor' :
          (quality7 === 'Half-Diminished' || quality7 === 'Diminished7') ? 'Diminished' :
            (quality7 === 'AugmentedMaj7' || quality7 === 'Augmented7') ? 'Augmented' :
              'Major';

  let baseTriad = triadRomanForQuality(baseKey, scalePCs, degreeIndex, triadFlavor);

  switch (quality7) {
    case 'Major7': return baseTriad.replace(/\+$/, '') + 'maj<span class="acc">7</span>';
    case 'Dominant7': return baseTriad.replace(/maj(?![^<]*<\/)/i, '').replace(/\+$/, '') + '<span class="acc">7</span>';
    case 'Minor7': return baseTriad + '<span class="acc">7</span>';
    case 'Half-Diminished': return baseTriad.replace('°', 'ø') + '<span class="acc">7</span>';
    case 'Diminished7': return baseTriad + '°<span class="acc">7</span>';
    case 'AugmentedMaj7': return baseTriad.replace(/\+?$/, '+') + 'maj<span class="acc">7</span>';
    case 'Augmented7': return baseTriad.replace(/\+?$/, '+') + '<span class="acc">7</span>';
    default: return baseTriad + '<span class="acc">7</span>';
  }
}
// Generate roman numerals for a given key, mode, and chord size using RELATIVE intervals
function generateRomanSet(baseKey, modeName, chordSize) {
  const scalePCs = getScalePitchClasses(baseKey, modeName);
  const degCount = Array.isArray(MODES[modeName]) ? MODES[modeName].length : 7;
  if (!Array.isArray(scalePCs) || scalePCs.length !== degCount) {
    return Array.from({ length: degCount }, (_, i) => 'I'.repeat(i + 1)); // never digits
  }

  // For non-heptatonic scales (pentatonic, hexatonic, octatonic, whole tone, etc.)
  // show simple Roman numerals without quality annotations (no "(quartal)", sus, etc.).
  const useSimple = degCount !== 7;
  const out = [];

  for (let degree = 0; degree < degCount; degree++) {
    if (useSimple) {
      // Non‑heptatonic scales: show simple ordinal Romans (no accidentals, no quality)
      const SIMPLE_ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
      const base = SIMPLE_ROMAN[degree] || 'I';
      out.push(chordSize === 4 ? base + '<span class="acc">7</span>' : base);
      continue;
    }

    // Original behavior for 7-note (heptatonic) scales
    const rel = scaleIntervalsAtDegree(scalePCs, degree, chordSize);
    if (chordSize === 4) {
      const q7 = classifySeventh(rel) || '';
      if (q7) {
        out.push(seventhRomanForQuality(baseKey, scalePCs, degree, q7));
      } else {
        out.push(degreeRomanWithAccidentals(baseKey, scalePCs, degree) + '<span class="acc">7</span>');
      }
    } else {
      const q3 = classifyTriadExtended(rel) || '';
      if (q3) {
        out.push(triadRomanForQuality(baseKey, scalePCs, degree, q3));
      } else {
        out.push(degreeRomanWithAccidentals(baseKey, scalePCs, degree));
      }
    }
  }
  return out;
}

function getDegreeCountFor(modeName) {
  const p = MODES[modeName];
  return Array.isArray(p) ? p.length : 7;
}

const root = document.documentElement;

function enableHover() { root.classList.add('can-hover'); }
function disableHover() { root.classList.remove('can-hover'); }

window.addEventListener('touchstart', disableHover, { passive: true });
window.addEventListener('mousemove', enableHover);

enableHover();
const TRIAD_INTERVALS = {
  Major: [0, 4, 7],
  Minor: [0, 3, 7],
  Diminished: [0, 3, 6],
  Augmented: [0, 4, 8],
};

const SEVENTH_INTERVALS = {
  Major7: [0, 4, 7, 11],
  Dominant7: [0, 4, 7, 10],
  Minor7: [0, 3, 7, 10],
  HalfDiminished: [0, 3, 6, 10],
  Diminished7: [0, 3, 6, 9],
  AugmentedMaj7: [0, 4, 8, 11],
  Augmented7: [0, 4, 8, 10],
};

function classifySeventh(intervals) {
  const dict = new Map([
    [JSON.stringify(SEVENTH_INTERVALS.Major7), 'Major7'],
    [JSON.stringify(SEVENTH_INTERVALS.Dominant7), 'Dominant7'],
    [JSON.stringify(SEVENTH_INTERVALS.Minor7), 'Minor7'],
    [JSON.stringify(SEVENTH_INTERVALS.HalfDiminished), 'Half-Diminished'],
    [JSON.stringify(SEVENTH_INTERVALS.Diminished7), 'Diminished7'],
    [JSON.stringify(SEVENTH_INTERVALS.AugmentedMaj7), 'AugmentedMaj7'],
    [JSON.stringify(SEVENTH_INTERVALS.Augmented7), 'Augmented7'],
  ]);
  return dict.get(JSON.stringify(intervals)) || '';
}

// Helper to pretty-print seventh chord qualities for display
function prettySeventhQuality(q7) {
  switch (q7) {
    case 'Major7': return 'maj7';       // Major triad + major 7th
    case 'Dominant7': return '7';          // Major triad + minor 7th
    case 'Minor7': return 'm7';         // Minor triad + minor 7th
    case 'Half-Diminished': return 'ø7';         // m7♭5 (half-diminished)
    case 'Diminished7': return '°7';         // fully diminished 7th
    case 'AugmentedMaj7': return 'maj7♯5';     // augmented triad + major 7th
    case 'Augmented7': return '7♯5';        // augmented triad + minor 7th (a.k.a. aug7)
    default: return '';
  }
}

function idsToIntervals(ids) {
  if (!Array.isArray(ids) || !ids.length) return [];
  const pcs = ids.map(id => {
    const name = ID_TO_NOTE[id];
    if (!name) return null;
    const base = name.replace(/\d+$/, '');
    let pc = NOTE_NAMES.indexOf(base);
    if (pc === -1 && ENHARMONIC_MAP[base]) pc = NOTE_NAMES.indexOf(ENHARMONIC_MAP[base]);
    return pc;
  }).filter(v => v != null);
  if (!pcs.length) return [];
  const root = pcs[0];
  const rel = pcs.map(pc => (pc - root + 12) % 12);
  return Array.from(new Set(rel)).sort((a, b) => a - b);
}

function scaleIntervalsAtDegree(scalePCs, degree, chordSize) {
  const steps = chordSize === 4 ? [0, 2, 4, 6] : [0, 2, 4];
  const n = scalePCs.length;
  const pcs = steps.map(s => scalePCs[(degree + s) % n]);
  const root = pcs[0];
  const rel = pcs.map(pc => (pc - root + 12) % 12);
  return Array.from(new Set(rel)).sort((a, b) => a - b);
}

function classifyTriad(intervals) {
  const dict = {
    [JSON.stringify(TRIAD_INTERVALS.Major)]: 'Major',
    [JSON.stringify(TRIAD_INTERVALS.Minor)]: 'Minor',
    [JSON.stringify(TRIAD_INTERVALS.Diminished)]: 'Diminished',
    [JSON.stringify(TRIAD_INTERVALS.Augmented)]: 'Augmented',
  };
  return dict[JSON.stringify(intervals)] || '';
}

const IONIAN_OFFSETS = [0, 2, 4, 5, 7, 9, 11];
const DEGREE_ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

function degreeRomanWithAccidentals(baseKey, scalePCs, degreeIndex) {
  const basePC = toPitchClass(baseKey);
  if (basePC == null || basePC === -1) return String(degreeIndex + 1);
  const pc = scalePCs[degreeIndex % scalePCs.length];
  if (pc == null || pc === -1) return String(degreeIndex + 1);

  // Ionian reference for THIS degree (prevents mislabeling like ♯ii instead of ♭III)
  const ref = (basePC + IONIAN_OFFSETS[degreeIndex % 7]) % 12;

  // Signed difference in semitones, mapped to [-6..+5], then clamped to [-2..+2]
  let diff = (pc - ref + 12) % 12;       // 0..11
  if (diff > 6) diff -= 12;              // -> -6..+5
  if (diff < -2) diff = -2;              // avoid exotic triple flats
  if (diff > 2) diff = 2;              // avoid exotic triple sharps

  const acc = diff === 0 ? '' : (diff < 0 ? '♭'.repeat(-diff) : '♯'.repeat(diff));
  return (acc ? `<span class="acc">${acc}</span>` : '') + DEGREE_ROMAN[degreeIndex % 7];
}

function classifyTriadExtended(intervals) {
  const triad = classifyTriad(intervals);
  if (triad) return triad;
  if (JSON.stringify(intervals) === JSON.stringify([0, 2, 7])) return 'Sus2';
  if (JSON.stringify(intervals) === JSON.stringify([0, 5, 7])) return 'Sus4';
  if (JSON.stringify(intervals) === JSON.stringify([0, 5, 10])) return 'Quartal';
  return '';
}

const MODE_KEYS = {
  // Heptatonic families
  Major: ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'],
  Minor: ['C', 'C♯', 'D', 'D♯', 'E♭', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'B♭', 'B'],
  Dorian: ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'G♯', 'A♭', 'A', 'B♭', 'B'],
  Phrygian: ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B♭', 'B'],
  Lydian: ['C', 'D', 'D♭', 'E', 'E♭', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'],
  Mixolydian: ['C', 'D', 'E', 'F', 'F♯', 'G', 'A', 'A♯', 'B', 'B♭', 'C♯', 'D♯', 'G♯'],
  Locrian: ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B', 'B♭'],

  // Common variants (names match your MODES keys)
  HarmonicMinor: DEFAULT_KEYS,
  MelodicMinor: DEFAULT_KEYS,
  HarmonicMajor: DEFAULT_KEYS,
  DoubleHarmonic: DEFAULT_KEYS,

  // Hexatonic / Pentatonic / Octatonic / Whole-tone / Chromatic
  WholeTone: DEFAULT_KEYS,
  MajorPentatonic: DEFAULT_KEYS,
  MinorPentatonic: DEFAULT_KEYS,
  MajorBlues: DEFAULT_KEYS,
  MinorBlues: DEFAULT_KEYS,
  Diminished_Whole_Half: DEFAULT_KEYS,
  Diminished_Half_Whole: DEFAULT_KEYS,
  Chromatic: DEFAULT_KEYS,
};

function isKeyValidForMode(baseKey, mode) {
  const list = MODE_KEYS[mode] || DEFAULT_KEYS;
  return list.includes(baseKey);
}

const KEY_BACKGROUNDS = {
  'C': 'linear-gradient(90deg, #92de83, #99dea4, #b2d9a4, #99dea4)',

  'C#': 'linear-gradient(90deg, #7ee7b3, #8be2c4, #a4dcc4, #95dfc4)',
  'Db': 'linear-gradient(90deg, #7ee7b3, #8be2c4, #a4dcc4, #95dfc4)',

  'D': 'linear-gradient(90deg, #9abaf1, #a3c3e1, #b7c9df, #a3c3e1)',

  'D#': 'linear-gradient(90deg, #aeabf1, #b8bce1, #c3c1df, #b7bbe1)',
  'Eb': 'linear-gradient(90deg, #aeabf1, #b8bce1, #c3c1df, #b7bbe1)',

  'E': 'linear-gradient(90deg, #e99fa6, #e8a8bd, #debabe, #e7aebd)',

  'F': 'linear-gradient(90deg, #e9a38c, #e9aba7, #ddbdaa, #e7b2aa)',

  'G#': 'linear-gradient(90deg, #e9a38c, #e9aba7, #ddbdaa, #e7b2aa)',
  'Ab': 'linear-gradient(90deg, #e9a38c, #e9aba7, #ddbdaa, #e7b2aa)',

  'G': 'linear-gradient(90deg, #92de83, #99dea4, #b2d9a4, #99dea4)',

  'F#': 'linear-gradient(90deg, #7ee7b3, #8be2c4, #a4dcc4, #95dfc4)',
  'Gb': 'linear-gradient(90deg, #7ee7b3, #8be2c4, #a4dcc4, #95dfc4)',

  'A': 'linear-gradient(90deg, #9abaf1, #a3c3e1, #b7c9df, #a3c3e1)',

  'A#': 'linear-gradient(90deg, #aeabf1, #b8bce1, #c3c1df, #b7bbe1)',
  'Bb': 'linear-gradient(90deg, #aeabf1, #b8bce1, #c3c1df, #b7bbe1)',

  'B': 'linear-gradient(90deg, #e99fa6, #e8a8bd, #debabe, #e7aebd)'
};

function applyBackground(_el, val, fallback = '#8BEB83') {
  const v = (typeof val === 'string' && val.trim()) ? val.trim() : fallback;
  document.documentElement.style.setProperty('--key-bg', v);
}

function normalizeKeyName(name) {
  return (name || '').replace(/♯/g, '#').replace(/♭/g, 'b');
}
function getKeyBackground(base) {
  if (!base) return null;

  if (KEY_BACKGROUNDS[base]) return KEY_BACKGROUNDS[base];

  const ascii = normalizeKeyName(base);
  if (KEY_BACKGROUNDS[ascii]) return KEY_BACKGROUNDS[ascii];

  const enh = ENHARMONIC_MAP[base];
  if (enh && KEY_BACKGROUNDS[enh]) return KEY_BACKGROUNDS[enh];
  const enhAscii = normalizeKeyName(enh || '');
  if (enhAscii && KEY_BACKGROUNDS[enhAscii]) return KEY_BACKGROUNDS[enhAscii];
  return null;
}

const BASE_WHITE_W = 60;
const BASE_WHITE_H = 264;
const BLACK_W_RATIO = 36 / 60;
const BLACK_H_RATIO = 172 / 264;

let PIANO_SCALE = 1;

function getSizes() {
  const WHITE_W = BASE_WHITE_W * PIANO_SCALE;
  const WHITE_H = BASE_WHITE_H * PIANO_SCALE;
  const BLACK_W = WHITE_W * BLACK_W_RATIO;
  const BLACK_H = WHITE_H * BLACK_H_RATIO;
  return { WHITE_W, WHITE_H, BLACK_W, BLACK_H };
}

function supAcc(str) {
  return String(str).replace(/([♯♭])/g, '<span class="acc">$1</span>');
}

function setPianoScale(scale = 1) {
  PIANO_SCALE = scale;
  update();
}

let selectedKey = 'C4';
let selectedMode = 'Major';
let currentChord = [];
let activeOctave = 1;
let activeScaleNote = null;
let lastClickedScaleNote = null;
let x1 = 0;
let scaleIDs = [];
let scaleNotes = [];
let baseChordIDs = [];
let currentInversion = 0;
let chordType = 'triad';
let lastClickedScaleId = null;

// --- Progression slots (save up to 6 chords + inversion) ---
const MAX_SLOTS = 6;
const chordSlots = Array(MAX_SLOTS).fill(null);

function getActiveChordLabelPlain() {
  const el = document.querySelector('#active_chord .text');
  return el ? el.textContent.trim() : '';
}

function computeCurrentDegree() {
  const degCount = getDegreeCountFor(selectedMode);
  if (lastClickedScaleId != null) return (scaleIDs.indexOf(lastClickedScaleId) % degCount + degCount) % degCount;
  if (!Array.isArray(baseChordIDs) || !baseChordIDs.length) return 0;
  const rootId = baseChordIDs[0];
  const idx = scaleIDs.indexOf(rootId);
  return idx === -1 ? 0 : (idx % degCount);
}

function snapshotCurrentChord() {
  const size = getChordSize();
  if (!Array.isArray(baseChordIDs) || baseChordIDs.length < 3) return null;
  const ids = baseChordIDs.slice(0, size);
  const base = selectedKey.slice(0, -1);
  const mode = selectedMode;
  const degree = computeCurrentDegree();
  const labelHTML = (document.querySelector('#active_chord .text')?.innerHTML || '').trim(); const labelPlain = getActiveChordLabelPlain();
  const inversion = currentInversion || 0;
  const type = chordType; // 'triad' | 'seventh'
  return { base, mode, degree, ids, inversion, type, labelHTML, labelPlain };
}

function setChordTypeUI(newType) {
  if (newType !== 'triad' && newType !== 'seventh') return;
  chordType = newType;
  document.querySelectorAll('.chord-type-btn').forEach(b => {
    const on = b.dataset.chordType === newType;
    b.classList.toggle('active', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
}

function saveChordToSlot(index) {
  if (index < 0 || index >= MAX_SLOTS) return;
  const snap = snapshotCurrentChord();
  if (!snap) return;
  chordSlots[index] = snap;
  updateProgressionSlotButton(index);
}

function clearChordSlot(index) {
  if (index < 0 || index >= MAX_SLOTS) return;
  chordSlots[index] = null;
  updateProgressionSlotButton(index);
}

function recallChordSlot(index) {
  const slot = chordSlots[index];
  if (!slot) return;
  // Ensure chord type matches before computing size in switch
  setChordTypeUI(slot.type);
  // Jump to saved context; re-use preserved IDs and labelHTML
  switchToKeyModeAndDegree(slot.base, slot.mode, slot.degree, slot.ids, slot.labelHTML);
  // Restore inversion after switch
  setActiveInversion(slot.inversion || 0);
  updateChordVisibility();
}

function updateProgressionSlotButton(index) {
  const btn = document.querySelector(`.slot-btn[data-slot="${index}"]`);
  const del = document.querySelector(`.slot-del[data-slot="${index}"]`);
  if (!btn) return;
  const slot = chordSlots[index];
  if (!slot) {
    btn.classList.remove('filled');
    btn.innerHTML = `<span class="slot-index">+</span>`;
    btn.setAttribute('aria-label', `Empty slot ${index + 1}`);
    btn.title = `Click to save to slot ${index + 1}`;
    if (del) {
      del.disabled = true;
      del.title = 'Delete';
      del.hidden = true;            // hide when empty
      del.setAttribute('aria-hidden', 'true');
    }
  } else {
    btn.classList.add('filled');
    const invLabel = ordinalLabel(slot.inversion).replace('Root', 'Root');
    const short = (slot.labelPlain || 'Chord');
    btn.innerHTML = `<span class="slot-label">${short}</span> <span class="slot-inv">${invLabel}</span>`;
    btn.setAttribute('aria-label', `Slot ${index + 1}: ${short}, ${invLabel}`);
    btn.title = 'Click to recall';
    if (del) {
      del.disabled = false;
      del.title = 'Delete';
      del.hidden = false;           // show when filled
      del.setAttribute('aria-hidden', 'false');
    }
  }
}

function renderProgressionSlots() {
  const footer = document.getElementById('footer');
  if (!footer) return;

  const trigger = document.getElementById('saved-chords-trigger');
  if (!trigger) return;

  const portal = document.getElementById('saved-chords-popover');
  if (!portal) return;

  // Hide helper
  function hidePopover() {
    portal.classList.remove('is-open');
    portal.style.display = 'none';
    trigger.setAttribute('aria-expanded', 'false');
    // Keep the trigger visible and restore its label
    if (trigger) trigger.textContent = '＋ New Progression';
  }

  // Build/refresh inner content
  function buildContent() {
    portal.innerHTML = '';
    portal.insertAdjacentHTML(
      'afterbegin',
      '<div class="popover-title">\
         <div class="popover-heading">Chord Progression</div>\
         <button type="button" id="closeSavedChords" class="popover-close" aria-label="Close">✕</button>\
       </div>\
       <div class="popover-content" id="saved-chords-content"></div>'
    );

    const content = portal.querySelector('#saved-chords-content');
    if (content) {
      // Render six slots just like before, but inside the popover
      content.innerHTML = Array.from({ length: MAX_SLOTS }, (_, i) =>
        `<div class="slot" data-slot="${i}">\
           <button type="button" class="slot-btn" data-slot="${i}" aria-pressed="false" title="Click to save to slot ${i + 1}">\
             <span class="slot-index">➕</span>\
           </button>\
           <button type="button" class="slot-del" data-slot="${i}" aria-label="Delete slot ${i + 1}" title="Delete">✕</button>\
         </div>`
      ).join('');

      // Initial paint of labels/titles for all slots
      for (let i = 0; i < MAX_SLOTS; i++) updateProgressionSlotButton(i);

      // Delegate click handling for save / recall / delete
      content.addEventListener('click', (e) => {
        const del = e.target.closest('.slot-del');
        if (del && content.contains(del)) {
          const i = parseInt(del.dataset.slot, 10) || 0;
          clearChordSlot(i);
          e.stopPropagation();
          return;
        }
        const btn = e.target.closest('.slot-btn');
        if (!btn || !content.contains(btn)) return;
        const i = parseInt(btn.dataset.slot, 10) || 0;
        const slot = chordSlots[i];
        if (!slot) {
          // Empty → save current chord
          saveChordToSlot(i);
        } else {
          // Filled → recall (keep popover open)
          recallChordSlot(i);
        }
      });
    }

    const closeBtn = portal.querySelector('#closeSavedChords');
    if (closeBtn) {
      closeBtn.addEventListener('click', (ev) => { ev.preventDefault(); hidePopover(); }, { once: true });
    }
  }

  // Position and open the popover near the trigger
  function openPopover() {
    buildContent();

    // Show first (so we can measure)
    portal.style.display = '';
    portal.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    // Keep the trigger visible and change its label to indicate it will close the popover
    if (trigger) trigger.textContent = 'Close Progressions';

    // Position logic (similar to chord search)
    const rect = trigger.getBoundingClientRect();
    const viewportPadding = 8;
    const maxH = window.innerHeight - 2 * viewportPadding;
    const contentH = Math.min(portal.scrollHeight, maxH);
    let top = rect.bottom + 6;
    if (top + contentH > window.innerHeight - viewportPadding) {
      top = Math.max(viewportPadding, rect.top - contentH - 6);
    }
    const left = Math.min(
      Math.max(viewportPadding, rect.left),
      Math.max(viewportPadding, window.innerWidth - portal.offsetWidth - viewportPadding)
    );
    portal.classList.add('positioned');
    portal.dataset.top = top;
    portal.dataset.left = left;
    portal.style.top = `${top}px`;
    portal.style.left = `${left}px`;

    // No auto-dismiss handlers: popover stays open until X is clicked.
  }

  // Attach trigger listener (idempotent)
  if (!trigger._savedPopoverBound) {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      if (portal.classList.contains('is-open')) {
        hidePopover();
      } else {
        openPopover();
      }
    });
    trigger._savedPopoverBound = true;
  }
}

function getChordSize() {
  return chordType === 'seventh' ? 4 : 3;
}

function buildChordIDs(scaleIDs, startIndex, chordSize) {
  const ids = [];
  for (let k = 0; k < chordSize; k++) {
    ids.push(scaleIDs[startIndex + 2 * k]);
  }
  return ids;
}

function ordinalLabel(i) {
  if (i === 0) return 'Root';
  if (i === 1) return '1st';
  if (i === 2) return '2nd';
  return '3rd';
}

function renderInversionButtons(count) {
  const el = document.querySelector('.inversions');
  if (!el) return;
  el.innerHTML = Array.from({ length: count }, (_, i) =>
    `<button type="button" data-inversion="${i}" class="inv-btn${i === currentInversion ? ' active' : ''}" aria-pressed="${i === currentInversion}">${ordinalLabel(i)}</button>`
  ).join('');
}

function renderChordTypeToggle() {
  // Bind once via delegation so it works regardless of wrapper structure
  if (document._chordTypeBound) return;
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.chord-type-btn');
    if (!btn) return;
    if (!document.contains(btn)) return;
    const newType = btn.dataset.chordType;
    if (!newType || (newType !== 'triad' && newType !== 'seventh')) return;
    if (newType === chordType) return;

    // Toggle button states globally
    document.querySelectorAll('.chord-type-btn').forEach(b => {
      const on = b.dataset.chordType === newType;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    chordType = newType;
    currentInversion = 0;

    // Recompute based on last clicked degree if available, else preserve current root if possible
    const size = getChordSize();
    if (lastClickedScaleId && Array.isArray(scaleIDs) && scaleIDs.length) {
      const idx = scaleIDs.indexOf(lastClickedScaleId);
      if (idx !== -1) {
        baseChordIDs = buildChordIDs(scaleIDs, idx, size);
        renderInversionButtons(size);
        setActiveInversion(0);
        const invNoteNames = baseChordIDs.map(id => ID_TO_NOTE[id]).filter(Boolean);
        chordNotesDiv.innerHTML = renderChordNoteLabels(invNoteNames);
        renderKeys([], baseChordIDs, 3, 0, true);

        const romanDisplay = document.getElementById('roman-display');
        if (romanDisplay) {
          const gen = generateRomanSet(selectedKey.slice(0, -1), selectedMode, size);
          romanDisplay.innerHTML = gen.map(n => `<span>${n}</span>`).join('');
        }

        const chordDisplay = document.getElementById('active_chord');
        if (chordDisplay && baseChordIDs.length) {
          const rootName = (ID_TO_NOTE[baseChordIDs[0]] || '').replace(/\d+$/, '');
          const intervals = idsToIntervals(baseChordIDs);
          const inferred = (size === 4)
            ? prettySeventhQuality(classifySeventh(intervals) || '')
            : (classifyTriadExtended(intervals) || '');
          const disp = getDisplaySpelling(rootName);
          const label = inferred ? `${supAcc(disp)} ${inferred}` : supAcc(disp);
          const t = chordDisplay.querySelector('.text');
          if (t) t.innerHTML = label;
        }

        updateChordVisibility();
        document._chordTypeBound = true;
        return;
      }
    }

    // Fallback: if we have an existing chord root, preserve its root pitch class when switching sizes
    if (Array.isArray(baseChordIDs) && baseChordIDs.length) {
      const oldSize = baseChordIDs.length;
      const oldRootId = baseChordIDs[0];
      const sizeNow = getChordSize();
      // Rebuild from scale using the nearest degree to the old root if available
      const degreeIdx = scaleIDs.indexOf(oldRootId);
      if (degreeIdx !== -1) {
        baseChordIDs = buildChordIDs(scaleIDs, degreeIdx, sizeNow);
        renderInversionButtons(sizeNow);
        setActiveInversion(0);
        const invNoteNames = baseChordIDs.map(id => ID_TO_NOTE[id]).filter(Boolean);
        chordNotesDiv.innerHTML = renderChordNoteLabels(invNoteNames);
        renderKeys([], baseChordIDs, 3, 0, true);

        const romanDisplay = document.getElementById('roman-display');
        if (romanDisplay) {
          const gen = generateRomanSet(selectedKey.slice(0, -1), selectedMode, sizeNow);
          romanDisplay.innerHTML = gen.map(n => `<span>${n}</span>`).join('');
        }

        const chordDisplay = document.getElementById('active_chord');
        if (chordDisplay && baseChordIDs.length) {
          const rootName = (ID_TO_NOTE[baseChordIDs[0]] || '').replace(/\d+$/, '');
          const intervals = idsToIntervals(baseChordIDs);
          const inferred = (sizeNow === 4)
            ? prettySeventhQuality(classifySeventh(intervals) || '')
            : (classifyTriadExtended(intervals) || '');
          const disp = getDisplaySpelling(rootName);
          const label = inferred ? `${supAcc(disp)} ${inferred}` : supAcc(disp);
          const t = chordDisplay.querySelector('.text');
          if (t) t.innerHTML = label;
        }

        updateChordVisibility();
        document._chordTypeBound = true;
        return;
      }
    }

    // Last resort: no degree and no prior chord — just switch UI and clear dependent displays
    renderInversionButtons(size);
    setActiveInversion(0);
    renderKeys(scaleIDs, [], 3, 0, true);
    const romanDisplay = document.getElementById('roman-display');
    if (romanDisplay) {
      const gen = generateRomanSet(selectedKey.slice(0, -1), selectedMode, size);
      romanDisplay.innerHTML = gen.map(n => `<span>${n}</span>`).join('');
    }
    updateChordVisibility();
    resetChordSearchUI();
    document._chordTypeBound = true;
  }, { passive: true });
}
function renderChordNoteLabels(noteNames) {
  const scaleSet = new Set(Array.from(document.querySelectorAll('#scale-display .scale-note')).map(el => el.textContent.trim()));
  return noteNames.map(n => {
    const base = n.replace(/\d+$/, '');
    const disp = scaleSet.has(base)
      ? base
      : (ENHARMONIC_MAP[base] && scaleSet.has(ENHARMONIC_MAP[base]))
        ? ENHARMONIC_MAP[base]
        : base;
    return `<div class="chord-note">${supAcc(disp)}</div>`;
  }).join('');
}

function getDisplaySpelling(base) {
  const scaleSet = new Set(Array.from(document.querySelectorAll('#scale-display .scale-note'))
    .map(el => el.textContent.trim()));
  if (scaleSet.has(base)) return base;
  const enh = ENHARMONIC_MAP[base];
  return (enh && scaleSet.has(enh)) ? enh : base;
}
function qualityFromRoman(roman) {
  if (roman) {
    if (roman.includes('°')) return 'Diminished';
    if (roman.includes('+')) return 'Augmented';
    return roman === roman.toUpperCase() ? 'Major' : 'Minor';
  }

  const intervals = idsToIntervals(baseChordIDs);
  const triadGuess = classifyTriad(intervals);
  return triadGuess || '';
}
function stripOctave(n) {
  return (n || '').replace(/\d+$/, '');
}

function toPitchClass(base) {
  let idx = NOTE_NAMES.indexOf(base);
  if (idx === -1 && ENHARMONIC_MAP[base]) {
    idx = NOTE_NAMES.indexOf(ENHARMONIC_MAP[base]);
  }
  return idx;
}

function namesToPitchClasses(noteNames) {
  const pcs = Array.from(new Set(noteNames
    .map(stripOctave)
    .map(toPitchClass)
    .filter(i => i !== -1)));
  pcs.sort((a, b) => a - b);
  return pcs;
}

function chordIDsToPitchClasses(ids) {
  const names = ids.map(id => ID_TO_NOTE[id]).filter(Boolean);
  return namesToPitchClasses(names);
}

function getScalePitchClasses(baseKey, mode) {
  const names = getScaleNotes(baseKey, mode);
  return names.map(toPitchClass);
}

function chordPitchClassesFromScale(scalePCs, degreeIndex, chordSize) {
  const idxs = chordSize === 4 ? [0, 2, 4, 6] : [0, 2, 4];
  const n = scalePCs.length;
  const pcs = idxs.map(step => scalePCs[(degreeIndex + step) % n]);
  return Array.from(new Set(pcs)).sort((a, b) => a - b);
}

function samePCSet(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function updateChordVisibility() {
  const show = baseChordIDs.length >= 3;
  document.querySelector('#chord-notes')?.classList.toggle('show', show);
  document.querySelector('.inversions')?.classList.toggle('show', show);
  document.querySelector('#active_chord')?.classList.toggle('show', show);

  const invEl = document.querySelector('.inversions');
  // if (invEl) invEl.style.display = show ? 'inline-flex' : 'none'; // Let CSS control display
  const typeToggle = document.querySelector('.chord-type-toggle');
  // if (typeToggle) typeToggle.style.display = 'block';
  const searchWrap = document.getElementById('chord-search');
  if (searchWrap) searchWrap.style.display = show ? '' : 'none';
}

function resetChordDisplay() {
  currentChord = [];
  activeScaleNote = null;
  baseChordIDs = [];
  lastClickedScaleId = null;
  chordNotesDiv.textContent = '';
  const chordDisplay = document.getElementById('active_chord');
  if (chordDisplay) {
    const t = chordDisplay.querySelector('.text');
    if (t) t.textContent = '';
  } document.querySelectorAll('.scale-note').forEach(n => n.classList.remove('active'));
  setActiveInversion(0);
  updateChordVisibility();
}

function renderChordSearchUI() {
  const wrap = document.getElementById('chord-search');
  if (!wrap) return; // require prebuilt placeholder in HTML
  const results = document.getElementById('chord-search-results');
  if (!results) return;

  const activeChordEl = document.getElementById('active_chord');

  function hidePopover(ev) {
    if (ev && (results.contains(ev.target) || (activeChordEl && activeChordEl.contains(ev.target)))) return;
    results.classList.remove('is-open');
    const pianoContainer = document.getElementById('pianoSvgContainer');
    if (pianoContainer) pianoContainer.style.pointerEvents = '';
    window.removeEventListener('scroll', hidePopover, true);
    window.removeEventListener('resize', hidePopover, true);
    document.removeEventListener('mousedown', hidePopover, true);
  }

  function openPopover() {
    const matches = findChordInOtherKeys();
    results.innerHTML = '';

    results.insertAdjacentHTML(
      'afterbegin',
      '<div class="popover-title"><div class="popover-heading"></div><button type="button" id="closeChordSearch" class="popover-close" aria-label="Close">✕</button></div><div class="popover-content"></div>'
    );
    const contentEl = results.querySelector('.popover-content');
    const titleEl = results.querySelector('.popover-heading');

    // Build title from current active chord label (without any SVG icons)
    const chordLabelEl = document.querySelector('#active_chord .text');
    const chordText = chordLabelEl ? chordLabelEl.textContent.trim() : '';
    if (titleEl) {
      titleEl.textContent = chordText ? `Other Keys with ${chordText}` : 'Keys Containing This Chord';
    }

    const closeBtn = results.querySelector('#closeChordSearch');
    if (closeBtn) {
      closeBtn.addEventListener('click', (ev) => { ev.preventDefault(); hidePopover(); }, { once: true });
    }

    // Show popover
    const pianoContainer = document.getElementById('pianoSvgContainer');
    if (pianoContainer) pianoContainer.style.pointerEvents = 'none';
    results.style.display = '';
    results.classList.add('is-open');

    // Optional: position near the active chord label
    if (activeChordEl) {
      const rect = activeChordEl.getBoundingClientRect();
      const viewportPadding = 8;
      const maxH = window.innerHeight - 2 * viewportPadding;
      const contentH = Math.min(results.scrollHeight, maxH);
      let top = rect.bottom + 6;
      if (top + contentH > window.innerHeight - viewportPadding) {
        top = Math.max(viewportPadding, rect.top - contentH - 6);
      }
      const left = Math.min(
        Math.max(viewportPadding, rect.left),
        Math.max(viewportPadding, window.innerWidth - results.offsetWidth - viewportPadding)
      );
      results.classList.add('positioned');
      results.dataset.top = top;
      results.dataset.left = left;
    }

    if (!matches.length) {
      if (contentEl) contentEl.innerHTML = '<div class="no-matches">No matches found in other keys/modes.</div>';
      results.addEventListener('mouseleave', () => { results.classList.remove('is-open'); }, { once: true });
    } else {
      if (contentEl) {
        contentEl.innerHTML = matches.map(m => {
          const tag = `${supAcc(m.key)} ${formatModeName(m.mode)} — ${m.roman}`;
          return `<button type="button" class="chord-match" data-key="${m.key}" data-mode="${m.mode}" data-degree="${m.degree}">${tag}</button>`;
        }).join('');
      }

      results.querySelectorAll('.chord-match').forEach(btn => {
        btn.addEventListener('click', () => {
          const base = btn.getAttribute('data-key');
          const mode = btn.getAttribute('data-mode');
          const degree = parseInt(btn.getAttribute('data-degree'), 10) || 0;
          const preserved = baseChordIDs ? baseChordIDs.slice() : null;
          const labelEl = document.querySelector('#active_chord .text');
          const preservedLabelHTML = labelEl ? labelEl.innerHTML : null;
          switchToKeyModeAndDegree(base, mode, degree, preserved, preservedLabelHTML);
          hidePopover();
        });
      });

      setTimeout(() => {
        window.addEventListener('scroll', hidePopover, true);
        window.addEventListener('resize', hidePopover, true);
        document.addEventListener('mousedown', hidePopover, true);
      }, 0);

      results.addEventListener('mouseleave', () => { hidePopover(); }, { once: true });
    }
  }

  // Make the active chord label act as the trigger
  if (activeChordEl) {
    activeChordEl.style.cursor = 'pointer';
    // Also set pointer cursor for the active_mode-key element
    const activeModeKeyEl = document.getElementById('active_mode-key');
    if (activeModeKeyEl) {
      activeModeKeyEl.style.cursor = 'pointer';
    }
    activeChordEl.addEventListener('click', openPopover);
  }
}
function transposeChordIDs(ids, oldRootId, newRootId) {
  if (!Array.isArray(ids) || ids.length === 0) return [];
  const delta = newRootId - oldRootId;
  const keys = Object.keys(ID_TO_NOTE).map(Number);
  const minId = Math.min(...keys);
  const maxId = Math.max(...keys);
  return ids.map((id) => {
    let next = id + delta;

    while (next < minId) next += 12;
    while (next > maxId) next -= 12;
    return next;
  });
}
function findChordInOtherKeys() {
  if (!Array.isArray(baseChordIDs) || baseChordIDs.length < 3) return [];

  const size = getChordSize();

  const targetIntervals = idsToIntervals(baseChordIDs.slice(0, size));
  const targetPCs = chordIDsToPitchClasses(baseChordIDs.slice(0, size));
  if (!targetIntervals.length || targetPCs.length !== size) return [];


  const targetRootDisplay = getDisplaySpelling((ID_TO_NOTE[baseChordIDs[0]] || '').replace(/\d+$/, ''));
  const targetRootLetter = getNoteLetter(targetRootDisplay);

  const out = [];

  for (const mode of Object.keys(MODES)) {
    const keys = MODE_KEYS[mode] || DEFAULT_KEYS;
    const degCount = (MODES[mode] || []).length || 7;
    for (const base of keys) {
      const currentBase = selectedKey ? selectedKey.slice(0, -1) : '';
      if (mode === selectedMode && base === currentBase) continue;

      const scalePCs = getScalePitchClasses(base, mode);
      if (!Array.isArray(scalePCs) || scalePCs.length !== degCount || scalePCs.some(pc => pc === -1)) continue;

      for (let degree = 0; degree < degCount; degree++) {

        const candIntervals = scaleIntervalsAtDegree(scalePCs, degree, size);
        if (JSON.stringify(candIntervals) !== JSON.stringify(targetIntervals)) continue;

        const candPCs = chordPitchClassesFromScale(scalePCs, degree, size);
        if (!Array.isArray(candPCs) || candPCs.length !== size) continue;
        if (!samePCSet(candPCs, targetPCs)) continue;

        const candScaleRaw = getScaleNotes(base, mode) || [];
        const candAdjusted = adjustEnharmonics(candScaleRaw, base) || candScaleRaw;
        const degIdx = degree % degCount;
        const candRootName = (candAdjusted[degIdx] || candScaleRaw[degIdx] || '');
        if (!candRootName) continue;
        const candRootLetter = getNoteLetter(candRootName);
        if (candRootLetter !== targetRootLetter) continue;

        const gen = generateRomanSet(base, mode, size);
        const roman = gen[degIdx] || String(degIdx + 1);
        out.push({ key: base, mode, degree: degIdx, roman });
      }
    }
  }
  return out;
}

function switchToKeyModeAndDegree(base, mode, degree, preservedChordIDs = null, preservedLabelHTML = null) {
  selectedMode = mode;
  updateKeyOptions(mode);


  let matching = Object.keys(NOTE_MAP).find(n => n === base + '4') ||
    Object.keys(NOTE_MAP).find(n => n.startsWith(base));
  if (!matching && ENHARMONIC_MAP[base]) {
    matching = Object.keys(NOTE_MAP).find(n => n.startsWith(ENHARMONIC_MAP[base]));
  }
  if (!matching) return;

  selectedKey = matching;
  applyBackground(null, getKeyBackground(base), '#8BEB83');


  document.querySelectorAll('.mode-button').forEach(b => {
    const on = b.dataset.mode === mode;
    b.classList.toggle('active', on);
  });
  document.querySelectorAll('.key-button').forEach(b => {
    const on = b.textContent.trim() === base;
    b.classList.toggle('active', on);
  });


  lastClickedScaleNote = null;
  lastClickedScaleId = null;
  resetChordSearchUI();


  resetChordDisplay();
  update();


  const sel = `#scale-display .scale-note[data-degree="${degree}"]`;
  const el = document.querySelector(sel);
  document.querySelectorAll('#scale-display .scale-note').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');

  const targetRootId = Array.isArray(scaleIDs) && scaleIDs.length ? scaleIDs[degree] : null;
  const size = getChordSize();

  if (preservedChordIDs && preservedChordIDs.length >= 3 && targetRootId != null) {

    const oldRootId = preservedChordIDs[0];
    baseChordIDs = transposeChordIDs(preservedChordIDs.slice(0, size), oldRootId, targetRootId);
    baseChordIDs = baseChordIDs.slice(0, size);
  } else {

    baseChordIDs = (Array.isArray(scaleIDs) && scaleIDs.length >= 7)
      ? buildChordIDs(scaleIDs, degree, size)
      : [];
    baseChordIDs = baseChordIDs.slice(0, size);
  }

  currentInversion = 0;
  renderInversionButtons(size);
  setActiveInversion(0);
  updateChordVisibility();

  const chordDisplay = document.getElementById('active_chord');
  if (chordDisplay) {
    const t = chordDisplay.querySelector('.text');
    if (t) {
      if (typeof preservedLabelHTML === 'string' && preservedLabelHTML.trim()) {
        t.innerHTML = preservedLabelHTML.trim();
      } else if (baseChordIDs.length) {
        const rootName = (ID_TO_NOTE[baseChordIDs[0]] || '').replace(/\d+$/, '');
        const intervals = idsToIntervals(baseChordIDs);
        const inferred = (getChordSize() === 4)
          ? prettySeventhQuality(classifySeventh(intervals) || '')
          : (classifyTriadExtended(intervals) || '');
        const disp = getDisplaySpelling(rootName);
        const label = inferred ? `${supAcc(disp)} ${inferred}` : supAcc(disp);
        t.innerHTML = label;
      } else {
        t.textContent = '';
      }
    }
  }

}

const keySelect = document.getElementById('key-select');
const modeSelect = document.getElementById('mode-select');
const piano = document.getElementById('piano');
const scaleDisplay = document.getElementById('scale-display');
const chordNotesDiv = document.getElementById('chord-notes');

function getScaleNotesFromX1(x1, modeName) {
  const intervals = MODES[modeName];
  const notes = [x1];
  if (!intervals || !intervals.length) return notes;
  let current = x1;
  for (let i = 0; i < 21; i++) { // enough notes to render/center
    const step = intervals[i % intervals.length];
    current += step;
    notes.push(current);
  }
  return notes;
}

function getScaleNotes(key, mode) {
  const intervals = MODES[mode];
  if (!intervals) return [];

  let rootIndex = NOTE_NAMES.indexOf(key);
  if (rootIndex === -1 && ENHARMONIC_MAP[key]) {
    rootIndex = NOTE_NAMES.indexOf(ENHARMONIC_MAP[key]);
  }
  if (rootIndex === -1) return [];

  const degreeCount = intervals.length;
  const offsets = [0];
  for (let i = 0; i < degreeCount - 1; i++) {
    offsets.push((offsets[i] + intervals[i]) % 12);
  }

  return offsets.map(off => NOTE_NAMES[(rootIndex + off) % 12]);
}

function getNoteNamesFromIDs(ids) {
  return ids.map(id => ID_TO_NOTE[id]);
}
function animateScrollX(el, targetLeft, { duration = 350, easing = 'easeInOutQuad' } = {}) {
  if (!el) return;
  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.scrollLeft = targetLeft;
    return;
  }

  const easings = {
    linear: t => t,
    easeInOutQuad: t => (t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2) / 2),
    easeOutCubic: t => 1 - Math.pow(1 - t, 3),
  };
  const ease = easings[easing] || easings.easeInOutQuad;

  const start = el.scrollLeft;
  const delta = targetLeft - start;
  const startTime = performance.now();

  function tick(now) {
    const t = Math.min((now - startTime) / duration, 1);
    el.scrollLeft = start + delta * ease(t);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function renderKeys(scaleIDs = [], chordIDs = [], nOctaves = 2, offset = 0, highlightOnlyInCenter = true) {


  const svg = document.getElementById('pianoSvg');
  const whiteLayer = svg.querySelector('.white-keys');
  const blackLayer = svg.querySelector('.black-keys');
  whiteLayer.innerHTML = '';
  blackLayer.innerHTML = '';

  const { WHITE_W, WHITE_H, BLACK_W, BLACK_H } = getSizes();
  const KEY_IMAGES = {
    1: 'assets/right-white.svg',
    3: 'assets/both-white.svg',
    5: 'assets/left-white.svg',
    6: 'assets/right-white.svg',
    8: 'assets/both-white.svg',
    10: 'assets/both-white.svg',
    12: 'assets/left-white.svg',
    2: 'assets/black.svg', 4: 'assets/black.svg', 7: 'assets/black.svg', 9: 'assets/black.svg', 11: 'assets/black.svg'
  };


  const WHITE_IDS = [1, 3, 5, 6, 8, 10, 12];
  const BLACK_IDS = [2, 4, 7, 9, 11];


  let keyOrder = [];
  for (let id = 0; id < 60; id++) {
    const note = ID_TO_NOTE[12 + id];
    if (!note) continue;
    const name = note.slice(0, -1);
    const octave = parseInt(note.slice(-1), 10);
    const baseId = NOTE_NAMES.indexOf(name) + 1;
    keyOrder.push({ id: 12 + id, baseId, octave });
  }

  const centerOctaveStart = 3;
  const centerOctaveEnd = 5;


  let whiteKeys = keyOrder.filter(k => WHITE_IDS.includes(k.baseId));
  let blackKeys = keyOrder.filter(k => BLACK_IDS.includes(k.baseId));



  whiteKeys.forEach((k, i) => {
    const x = i * WHITE_W + offset;
    const img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    img.setAttribute('href', KEY_IMAGES[k.baseId] || 'assets/both-white.svg');
    img.setAttribute('x', x);
    img.setAttribute('y', 0);
    img.setAttribute('width', WHITE_W);
    img.setAttribute('height', WHITE_H);
    img.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    const isCenter = k.octave >= centerOctaveStart && k.octave <= centerOctaveEnd;
    if (!highlightOnlyInCenter || isCenter) {
      const degCount = getDegreeCountFor(selectedMode);
      const firstScaleSet = scaleIDs.filter((id, i) => i < degCount);
      if (firstScaleSet.includes(k.id)) img.classList.add('scale-highlight');
      if (chordIDs.includes(k.id)) img.classList.add('chord-highlight');
    }

    img.dataset.noteId = k.id;
    img.dataset.noteName = ID_TO_NOTE[k.id];
    img.dataset.octave = k.octave;
    whiteLayer.appendChild(img);
  });





  function getBlackKeyX(whiteKeys, blackBaseId, octave) {


    let idx = -1;
    switch (blackBaseId) {
      case 2:
        idx = whiteKeys.findIndex(k => k.baseId === 1 && k.octave === octave);
        break;
      case 4:
        idx = whiteKeys.findIndex(k => k.baseId === 3 && k.octave === octave);
        break;
      case 7:
        idx = whiteKeys.findIndex(k => k.baseId === 6 && k.octave === octave);
        break;
      case 9:
        idx = whiteKeys.findIndex(k => k.baseId === 8 && k.octave === octave);
        break;
      case 11:
        idx = whiteKeys.findIndex(k => k.baseId === 10 && k.octave === octave);
        break;
      default: idx = -1;
    }
    if (idx === -1) return null;
    return idx * WHITE_W + (WHITE_W - BLACK_W / 2) + offset;
  }
  blackKeys.forEach(k => {
    const x = getBlackKeyX(whiteKeys, k.baseId, k.octave);
    if (x === null) return;
    const img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    img.setAttribute('href', KEY_IMAGES[k.baseId] || 'assets/black.svg');
    img.setAttribute('x', x);
    img.setAttribute('y', 0);
    img.setAttribute('width', BLACK_W);
    img.setAttribute('height', BLACK_H);
    img.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    const isCenter = k.octave >= centerOctaveStart && k.octave <= centerOctaveEnd;
    if (!highlightOnlyInCenter || isCenter) {
      const degCount = getDegreeCountFor(selectedMode);
      const firstScaleSet = scaleIDs.filter((id, i) => i < degCount);
      if (firstScaleSet.includes(k.id)) img.classList.add('scale-highlight');
      if (chordIDs.includes(k.id)) img.classList.add('chord-highlight');
    }
    img.dataset.noteId = k.id;
    img.dataset.noteName = ID_TO_NOTE[k.id];
    img.dataset.octave = k.octave;
    blackLayer.appendChild(img);
  });


  const totalWhiteKeys = whiteKeys.length;
  const totalWidth = totalWhiteKeys * WHITE_W + offset;
  svg.setAttribute('viewBox', `0 0 ${totalWidth} ${WHITE_H}`);

  svg.style.height = `${WHITE_H}px`;
  svg.style.width = `${totalWidth}px`;

  requestAnimationFrame(() => {
    const svg = document.getElementById('pianoSvg');
    const container = document.getElementById('pianoSvgContainer');
    const highlighted = svg.querySelectorAll('.scale-highlight, .chord-highlight');

    if (!highlighted.length || !container) return;

    let leftMost = Infinity;
    let rightMost = -Infinity;

    highlighted.forEach(el => {
      const x = parseFloat(el.getAttribute('x'));
      const width = parseFloat(el.getAttribute('width'));
      leftMost = Math.min(leftMost, x);
      rightMost = Math.max(rightMost, x + width);
    });

    const centerX = (leftMost + rightMost) / 2;
    const scrollX = centerX - container.clientWidth / 2;

    animateScrollX(container, scrollX, { duration: 550, easing: 'easeOutCubic' });
  });
}

function update() {
  const baseKey = selectedKey.slice(0, -1);
  const octave = selectedKey.slice(-1);

  if (!isKeyValidForMode(baseKey, selectedMode)) {

    const svg = document.getElementById('pianoSvg');
    svg?.querySelector('.white-keys') && (svg.querySelector('.white-keys').innerHTML = '');
    svg?.querySelector('.black-keys') && (svg.querySelector('.black-keys').innerHTML = '');

    scaleDisplay.innerHTML = '';
    const romanDisplay = document.getElementById('roman-display');
    if (romanDisplay) romanDisplay.innerHTML = '';
    const chordDisplay = document.getElementById('active_chord');
    if (chordDisplay) {
      const t = chordDisplay.querySelector('.text');
      if (t) t.textContent = '';
    }
    if (chordNotesDiv) chordNotesDiv.textContent = '';

    baseChordIDs = [];
    currentChord = [];
    updateChordVisibility();
    return;
  }
  const fullKey = baseKey + octave;
  const mapped = NOTE_MAP[fullKey];
  if (typeof mapped === 'undefined') {
    console.warn('Invalid key selected:', selectedKey);
    return;
  }
  x1 = mapped;
  scaleIDs = getScaleNotesFromX1(x1, selectedMode);
  const rawScaleNotes = getNoteNamesFromIDs(scaleIDs).filter(Boolean);
  const baseScaleNames = rawScaleNotes.map(n => n.slice(0, -1));

  const adjustedNames = adjustEnharmonics(baseScaleNames, baseKey);
  scaleNotes = adjustedNames.map((note, i) => note + rawScaleNotes[i].slice(-1));
  const degCount = getDegreeCountFor(selectedMode);
  if (scaleNotes.length < degCount) return;

  const scale = scaleNotes.map(n => n.slice(0, -1));
  const adjustedScale = adjustEnharmonics(scale, baseKey);
  renderKeys(scaleIDs, [], 3, 0, false);

  scaleDisplay.innerHTML = adjustedScale.slice(0, degCount).map((note, i) =>
    `<span class="scale-note" data-note-id="${scaleIDs[i]}" data-degree="${i}">${supAcc(note)}</span>`
  ).join('');

  const romanDisplay = document.getElementById('roman-display');
  if (romanDisplay) {
    const using7 = getChordSize() === 4;
    const genSet = generateRomanSet(baseKey, selectedMode, using7 ? 4 : 3);
    romanDisplay.innerHTML = genSet.map(n => `<span>${n}</span>`).join('');
  }

  scaleDisplay.onclick = e => {
    const target = e.target;
    if (!target.classList.contains('scale-note')) return;
    const noteId = parseInt(target.dataset.noteId, 10);
    lastClickedScaleId = noteId;
    const note = ID_TO_NOTE[noteId] || '';

    if (note === lastClickedScaleNote) {
      resetChordDisplay();
      renderKeys(scaleIDs, [], 2, 0, true);
      lastClickedScaleNote = null;
      resetChordSearchUI();
      return;
    }
    lastClickedScaleNote = note;

    document.querySelectorAll('.scale-note').forEach(n => n.classList.remove('active'));
    target.classList.add('active');

    const index = scaleIDs.indexOf(noteId);
    if (index === -1) return;

    const size = getChordSize();
    const chordIDs = buildChordIDs(scaleIDs, index, size);
    baseChordIDs = chordIDs;
    currentInversion = 0;
    currentChord = chordIDs.map(id => ID_TO_NOTE[id]);
    updateChordVisibility();
    resetChordSearchUI();
    renderInversionButtons(size);
    setActiveInversion(0);
    // Degree count aware roman numeral
    const degCount = getDegreeCountFor(selectedMode);
    const using7 = getChordSize() === 4;
    const genSetClick = generateRomanSet(selectedKey.slice(0, -1), selectedMode, using7 ? 4 : 3);
    const roman = genSetClick[index % degCount] || '';
    const intervals = idsToIntervals(baseChordIDs);
    const quality = using7 ? (prettySeventhQuality(classifySeventh(intervals) || '')) : (classifyTriadExtended(intervals) || '');
    const chordDisplay = document.getElementById('active_chord');

    if (chordDisplay && note) {
      const base = note.replace(/\d+$/, '');
      const t = chordDisplay.querySelector('.text');
      if (t) t.innerHTML = `${supAcc(getDisplaySpelling(base))} ${quality}`;
    }

    // If slots are visible, refresh their button labels that might include quality text length considerations
    document.getElementById('progression-slots') && Array.from({ length: MAX_SLOTS }, (_, i) => updateProgressionSlotButton(i));

    // Display correct roman numerals for degree count
    const using7b = getChordSize() === 4;
    const gen2 = generateRomanSet(selectedKey.slice(0, -1), selectedMode, using7b ? 4 : 3);
    romanDisplay.innerHTML = gen2.map(n => `<span>${n}</span>`).join('');
  };
  const controls = document.querySelector('.controls');
  const activeDisplay = document.getElementById('active_mode-key');
  if (activeDisplay) {
    if (typeof selectedKey === 'string') {
      const t = activeDisplay.querySelector('.text');
      if (t) t.innerHTML = `${supAcc(baseKey)} ${formatModeName(selectedMode)}`;
    }
  }
}

const inversionsEl = document.querySelector('.inversions');
if (inversionsEl) {
  renderInversionButtons(getChordSize());
}

function setActiveInversion(i = 0) {
  const inversionsEl = document.querySelector('.inversions');
  if (!inversionsEl || baseChordIDs.length < 3) return;

  const n = baseChordIDs.length;
  const inv = ((i % n) + n) % n;
  currentInversion = inv;


  inversionsEl.querySelectorAll('[data-inversion]').forEach(b => {
    const on = String(inv) === String(b.dataset.inversion);
    b.classList.toggle('active', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });


  const raised = baseChordIDs.map((id, idx) => (idx < inv ? id + 12 : id));
  const invIDs = raised.slice(inv).concat(raised.slice(0, inv));

  const invNoteNames = invIDs.map(id => ID_TO_NOTE[id]).filter(Boolean);
  chordNotesDiv.innerHTML = renderChordNoteLabels(invNoteNames);
  renderKeys([], invIDs, 3, 0, true);
}

inversionsEl?.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  const btn = e.target.closest('[data-inversion]');
  if (!btn || !inversionsEl.contains(btn)) return;
  const i = parseInt(btn.dataset.inversion, 10) || 0;
  setActiveInversion(i);
});

function populateModesOnce() {
  if (modeSelect.children.length > 0) return;
  Object.keys(MODES).forEach(m => {
    const btn = document.createElement('div');
    btn.textContent = formatModeName(m);
    btn.dataset.mode = m;
    btn.classList.add('mode-button');
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedMode = m;
      resetChordDisplay();
      updateKeyOptions(m);
      update();
      resetChordSearchUI();
    });
    modeSelect.appendChild(btn);
  });
  const defaultMode = Object.keys(MODES)[0];
  selectedMode = defaultMode;
  const defaultBtn = Array.from(document.querySelectorAll('.mode-button'))
    .find(btn => btn.dataset.mode === defaultMode);
  if (defaultBtn) defaultBtn.classList.add('active');
}

function updateKeyOptions(mode) {
  keySelect.innerHTML = '';

  const validKeys = MODE_KEYS[selectedMode] || DEFAULT_KEYS;
  validKeys.forEach(base => {

    let matching = Object.keys(NOTE_MAP).find(n => n === base + '4') ||
      Object.keys(NOTE_MAP).find(n => n.startsWith(base));
    if (!matching && ENHARMONIC_MAP[base]) {
      matching = Object.keys(NOTE_MAP).find(n => n.startsWith(ENHARMONIC_MAP[base]));
    }
    if (!matching) return;
    const btn = document.createElement('div');
    btn.innerHTML = supAcc(base);
    btn.dataset.note = matching;
    btn.classList.add('key-button');
    btn.addEventListener('click', () => {
      document.querySelectorAll('.key-button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedKey = matching;
      const bg = getKeyBackground(base);
      applyBackground(null, bg, '#8BEB83');
      resetChordDisplay();
      update();
      resetChordSearchUI();
    });
    keySelect.appendChild(btn);
  });
  if (!selectedKey) selectedKey = 'C4';

  const selectedBase = selectedKey.slice(0, -1);
  const defaultBtn = Array.from(document.querySelectorAll('.key-button'))
    .find(btn => btn.textContent === selectedBase);
  if (defaultBtn) defaultBtn.classList.add('active');
}

modeSelect.addEventListener('click', e => {
  if (!e.target.dataset.mode) return;
  selectedMode = e.target.dataset.mode;
  updateKeyOptions(selectedMode);
  update();
  resetChordSearchUI();
});

const controls = document.querySelector('.controls');
const openBtn = document.getElementById('active_mode-key');
const closeBtn = document.getElementById('closeControls');

function hideAfterTransition(e) {
  if (e.propertyName === 'transform') {
    controls.style.visibility = 'hidden';
    controls.removeEventListener('transitionend', hideAfterTransition);
  }
}

openBtn?.addEventListener('click', () => {
  controls.style.visibility = 'visible';
  controls.classList.toggle('is-open');
});

closeBtn?.addEventListener('click', () => {
  controls.classList.remove('is-open');
  controls.addEventListener('transitionend', hideAfterTransition);
});

controls.addEventListener('mouseleave', () => {
  controls.classList.remove('is-open');
});

renderChordSearchUI();
function resetChordSearchUI() {
  const wrap = document.getElementById('chord-search');
  if (!wrap) return;
  const summary = wrap.querySelector('#chord-search-summary');
  const results = wrap.querySelector('#chord-search-results');
  if (summary) summary.textContent = '';
  if (results) {
    results.innerHTML = '';
    results.classList.remove('is-open');
  }
  const portal = document.getElementById('chord-search-results');
  if (portal) {
    portal.classList.remove('is-open'); portal.innerHTML = '';
  }
  const pianoContainer = document.getElementById('pianoSvgContainer');
  if (pianoContainer) pianoContainer.style.pointerEvents = '';

}
renderChordTypeToggle();
populateModesOnce();
updateKeyOptions(selectedMode);
update();
renderProgressionSlots();

(function initBackground() {
  const base = (typeof selectedKey === 'string') ? selectedKey.slice(0, -1) : 'C';
  const bg = getKeyBackground(base) || '#8BEB83';
  applyBackground(null, bg, '#8BEB83');
})();

function readCSSNumberVar(name, el = document.documentElement) {
  const raw = getComputedStyle(el).getPropertyValue(name);
  const n = parseFloat((raw || '').trim());
  return Number.isFinite(n) ? n : null;
}

window.addEventListener('load', () => {
  const scaleFromCSS = readCSSNumberVar('--piano-scale');
  if (scaleFromCSS == null) {
    console.warn("--piano-scale not found on :root; falling back to 1.4");
  }
  setPianoScale(scaleFromCSS ?? 1.4);
});

function formatModeName(name) {
  return String(name)
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')        // camel→space
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')   // acronym→word
    .trim();
}