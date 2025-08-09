// --- Constants ---
// NOTE_NAMES and pitch-aware NOTE_MAP and ID_TO_NOTE, 36 slots, scale centered in IDs 12–24
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
    // Add enharmonic flat equivalent
    const baseNote = NOTE_NAMES[i];
    const flatNote = ENHARMONIC_MAP[baseNote];
    if (flatNote) {
      const flatName = flatNote + octave;
      NOTE_MAP[flatName] = id;  // same ID
    }
    id++;
  }
}

const MODES = {
  Major: [2, 2, 1, 2, 2, 2, 1],
  Dorian: [2, 1, 2, 2, 2, 1, 2],
  Phrygian: [1, 2, 2, 2, 1, 2, 2],
  Lydian: [2, 2, 2, 1, 2, 2, 1],
  Mixolydian: [2, 2, 1, 2, 2, 1, 2],
  Minor: [2, 1, 2, 2, 1, 2, 2],
  Harmonic: [2, 1, 2, 2, 1, 3, 1],
  Melodic: [2, 1, 2, 2, 2, 2, 1],
  Locrian: [1, 2, 2, 1, 2, 2, 2]
};

// Only sharp notes for simplicity in the new system.


// Roman numerals for 7 scale degrees
const MODE_ROMAN_NUMERALS = {
  Major: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
  Dorian: ['i', 'ii', 'III', 'IV', 'v', 'vi°', 'VII'],
  Phrygian: ['i', 'II', 'III', 'iv', 'v°', 'VI', 'vii'],
  Lydian: ['I', 'II', 'iii', '#iv°', 'V', 'vi', 'vii'],
  Mixolydian: ['I', 'ii', 'iii°', 'IV', 'v', 'vi', 'VII'],
  Minor: ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'],
  Harmonic: ['i', 'ii°', 'III+', 'iv', 'V', 'VI', 'vii°'],
  Melodic: ['i', 'ii', 'III', 'IV', 'V', 'vi°', 'vii°'],
  Locrian: ['i°', 'II', 'iii', 'iv', 'V', 'VI', 'VII']
};

// Roman numerals for diatonic 7th chords (per mode)
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
    '#ivø<span class="acc">7</span>',
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
  Harmonic: [
    'i(maj<span class="acc">7</span>)',
    'iiø<span class="acc">7</span>',
    'III+maj<span class="acc">7</span>',
    'iv<span class="acc">7</span>',
    'V<span class="acc">7</span>',
    'VImaj<span class="acc">7</span>',
    'vii°<span class="acc">7</span>'
  ],
  Melodic: [
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
// --- Chord quality interval dictionaries (root-relative, in semitones) ---
const TRIAD_INTERVALS = {
  Major: [0, 4, 7],
  Minor: [0, 3, 7],
  Diminished: [0, 3, 6],
  Augmented: [0, 4, 8],
};

const SEVENTH_INTERVALS = {
  // common sevenths; kept here for future-proofing (search uses triad/7th intervals generically)
  Major7: [0, 4, 7, 11],
  Dominant7: [0, 4, 7, 10],
  Minor7: [0, 3, 7, 10],
  HalfDiminished: [0, 3, 6, 10], // m7b5 / ø7
  Diminished7: [0, 3, 6, 9],  // °7
  AugmentedMaj7: [0, 4, 8, 11], // +maj7
  Augmented7: [0, 4, 8, 10], // +7
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

// Convert a list of absolute note IDs to root-relative semitone intervals (0..11)
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

// Build expected intervals for a diatonic chord from scale pitch classes
function scaleIntervalsAtDegree(scalePCs, degree, chordSize) {
  const steps = chordSize === 4 ? [0, 2, 4, 6] : [0, 2, 4];
  const pcs = steps.map(s => scalePCs[(degree + s) % 7]);
  const root = pcs[0];
  const rel = pcs.map(pc => (pc - root + 12) % 12);
  return Array.from(new Set(rel)).sort((a, b) => a - b);
}

// Try to classify a triad's quality from its intervals
function classifyTriad(intervals) {
  const dict = {
    [JSON.stringify(TRIAD_INTERVALS.Major)]: 'Major',
    [JSON.stringify(TRIAD_INTERVALS.Minor)]: 'Minor',
    [JSON.stringify(TRIAD_INTERVALS.Diminished)]: 'Diminished',
    [JSON.stringify(TRIAD_INTERVALS.Augmented)]: 'Augmented',
  };
  return dict[JSON.stringify(intervals)] || '';
}

// Valid key spellings per mode (used by updateKeyOptions and validation in update)
const MODE_KEYS = {
  Major: ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'],
  Minor: ['C', 'C♯', 'D', 'D♯', 'E♭', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'B♭', 'B'],
  Dorian: ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'G♯', 'A♭', 'A', 'B♭', 'B'],
  Phrygian: ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B♭', 'B'],
  Lydian: ['C', 'D', 'D♭', 'E', 'E♭', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'],
  Mixolydian: ['C', 'D', 'E', 'F', 'F♯', 'G', 'A', 'A♯', 'B', 'B♭', 'C♯', 'D♯', 'G♯'],
  Locrian: ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B', 'B♭'],
  Harmonic: ['C', 'C♯', 'D', 'D♯', 'E♭', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'B♭', 'B'],
  Melodic: ['C', 'C♯', 'D', 'D♯', 'E♭', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'B♭', 'B'],
};

function isKeyValidForMode(baseKey, mode) {
  const list = MODE_KEYS[mode] || [];
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
  // direct match (Unicode or ASCII if provided)
  if (KEY_BACKGROUNDS[base]) return KEY_BACKGROUNDS[base];
  // ASCII-normalized version of the base (e.g., F♯ -> F#)
  const ascii = normalizeKeyName(base);
  if (KEY_BACKGROUNDS[ascii]) return KEY_BACKGROUNDS[ascii];
  // Try enharmonic equivalents (both original and ASCII-normalized)
  const enh = ENHARMONIC_MAP[base];
  if (enh && KEY_BACKGROUNDS[enh]) return KEY_BACKGROUNDS[enh];
  const enhAscii = normalizeKeyName(enh || '');
  if (enhAscii && KEY_BACKGROUNDS[enhAscii]) return KEY_BACKGROUNDS[enhAscii];
  return null;
}

// --- Sizing (scalable) ---
const BASE_WHITE_W = 60;   // your current white key width
const BASE_WHITE_H = 264;  // your current white key height
const BLACK_W_RATIO = 36 / 60;    // = 0.6
const BLACK_H_RATIO = 172 / 264;  // ≈ 0.6515

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
const CHORD_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width=".9em" height=".9em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="white" fill-rule="evenodd" d="m16.325 14.899l5.38 5.38a1.008 1.008 0 0 1-1.427 1.426l-5.38-5.38a8 8 0 1 1 1.426-1.426M10 16a6 6 0 1 0 0-12a6 6 0 0 0 0 12"></path></svg>`;

// Call this to resize the whole piano (e.g., setPianoScale(1.5) = 150%)
function setPianoScale(scale = 1) {
  PIANO_SCALE = scale;
  update(); // re-render with new sizes
}

let selectedKey = 'C4';
let selectedMode = 'Major';
let currentChord = [];
let activeOctave = 1; // Default center octave
let activeScaleNote = null;
let lastClickedScaleNote = null;
let x1 = 0; // root note ID
let scaleIDs = [];
let scaleNotes = [];
let baseChordIDs = [];
let currentInversion = 0;
let chordType = 'triad'; // 'triad' | 'seventh'
let lastClickedScaleId = null; // remember selected scale degree id for rebuilding chords on toggle

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
  // Add a Triads/7ths toggle inside .controls if not present
  const footer = document.getElementById('footer');
  if (!footer || footer.querySelector('.chord-type-toggle')) return;

  // Ensure a shared flex row exists to hold chord-type toggle and inversions inline
  let row = footer.querySelector('.footer-controls-row');
  if (!row) {
    row = document.createElement('div');
    row.className = 'footer-controls-row';
    // Inline styles to avoid depending on external CSS
    row.style.display = 'inline-flex';
    row.style.flexWrap = 'wrap';
    row.style.gap = '8px';
    row.style.alignItems = 'center';
    row.style.justifyContent = 'center';
    const chordNotes = document.getElementById('chord-notes');
    if (chordNotes && chordNotes.parentElement === footer) {
      chordNotes.insertAdjacentElement('afterend', row);
    } else {
      footer.appendChild(row);
    }
  }

  const wrap = document.createElement('div');
  wrap.className = 'chord-type-toggle';
  wrap.innerHTML = `
  <div class="segmented chord-type" role="group" aria-label="Chord type">
    <button type="button" data-chord-type="triad"
      class="chord-type-btn segment active"
      aria-pressed="true">Triads</button>
    <button type="button" data-chord-type="seventh"
      class="chord-type-btn segment"
      aria-pressed="false">Sevenths</button>
  </div>
`;
  // Ensure the inner segmented group is inline-flex as well
  const chordTypeSeg = wrap.querySelector('.segmented.chord-type');
  if (chordTypeSeg) {
    chordTypeSeg.style.display = 'inline-flex';
  }

  const inversionsContainer = footer.querySelector('.inversions');
  // Place both controls inline inside the shared row
  if (wrap.parentElement !== row) row.appendChild(wrap);
  if (inversionsContainer && inversionsContainer.parentElement !== row) row.appendChild(inversionsContainer);
  // Always shown; keep inline with inversions
  wrap.style.display = 'inline-flex';

  wrap.addEventListener('click', (e) => {
    const btn = e.target.closest('.chord-type-btn');
    if (!btn) return;
    const newType = btn.dataset.chordType;
    if (!newType || newType === chordType) return;

    // Update toggle button states
    wrap.querySelectorAll('.chord-type-btn').forEach(b => {
      const on = b.dataset.chordType === newType;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    chordType = newType;
    // Always reset inversion to root when switching chord type
    currentInversion = 0;

    // If a scale degree is active, rebuild that chord for the new size
    if (lastClickedScaleId && Array.isArray(scaleIDs) && scaleIDs.length) {
      const idx = scaleIDs.indexOf(lastClickedScaleId);
      if (idx !== -1) {
        const size = getChordSize();
        baseChordIDs = buildChordIDs(scaleIDs, idx, size);
        currentInversion = 0;
        renderInversionButtons(size);
        setActiveInversion(0);
        const invNoteNames = baseChordIDs.map(id => ID_TO_NOTE[id]).filter(Boolean);
        chordNotesDiv.innerHTML = renderChordNoteLabels(invNoteNames);
        renderKeys([], baseChordIDs, 3, 0, true);

        // Update roman numerals row to match chord size
        const romanDisplay = document.getElementById('roman-display');
        if (romanDisplay) {
          const rSet = (size === 4)
            ? (MODE_ROMAN_NUMERALS_7[selectedMode] || [])
            : (MODE_ROMAN_NUMERALS[selectedMode]   || []);
          romanDisplay.innerHTML = rSet.map(n => `<span>${n}</span>`).join('');
        }

        // Update the active chord quality label to the correct triad/7th name
        const chordDisplay = document.getElementById('active_chord');
        if (chordDisplay && baseChordIDs.length) {
          const rootName = (ID_TO_NOTE[baseChordIDs[0]] || '').replace(/\d+$/, '');
          const intervals = idsToIntervals(baseChordIDs);
          const inferred = (size === 4)
            ? (classifySeventh(intervals) || '')
            : (classifyTriad(intervals)   || '');
          const disp = getDisplaySpelling(rootName);
          const label = inferred ? `${supAcc(disp)} ${inferred}` : supAcc(disp);
          chordDisplay.innerHTML = `${label} ${CHORD_ICON_SVG}`;
        }

        updateChordVisibility();
        return;
      }
    }
    // Fallback if nothing selected: still reset buttons to root
    const size = getChordSize();
    currentInversion = 0; // ensure buttons render with Root active
    renderInversionButtons(size);
    setActiveInversion(0); // harmless if no chord yet; ensures state is consistent
    renderKeys(scaleIDs, [], 3, 0, true);

    // Update roman numerals row to match chord size
    const romanDisplay = document.getElementById('roman-display');
    if (romanDisplay) {
      const rSet = (size === 4)
        ? (MODE_ROMAN_NUMERALS_7[selectedMode] || [])
        : (MODE_ROMAN_NUMERALS[selectedMode]   || []);
      romanDisplay.innerHTML = rSet.map(n => `<span>${n}</span>`).join('');
    }

    updateChordVisibility();
    resetChordSearchUI();
  });
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
  // Fallback: infer from currently selected/visible chord intervals
  const intervals = idsToIntervals(baseChordIDs);
  const triadGuess = classifyTriad(intervals);
  return triadGuess || '';
}
// --- Pitch-class helpers for chord search ---
function stripOctave(n) {
  return (n || '').replace(/\d+$/, '');
}

function toPitchClass(base) {
  // Map a note name (e.g., 'Db') to a 0–11 index, preferring NOTE_NAMES (sharps).
  let idx = NOTE_NAMES.indexOf(base);
  if (idx === -1 && ENHARMONIC_MAP[base]) {
    idx = NOTE_NAMES.indexOf(ENHARMONIC_MAP[base]);
  }
  return idx; // -1 if unknown
}

function namesToPitchClasses(noteNames) {
  // De-duplicate and sort ascending.
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
  const names = getScaleNotes(baseKey, mode); // 7 names w/o octaves
  return names.map(toPitchClass);
}

function chordPitchClassesFromScale(scalePCs, degreeIndex, chordSize) {
  const idxs = [0, 2, 4];
  if (chordSize === 4) idxs.push(6);
  const pcs = idxs.map(step => scalePCs[(degreeIndex + step) % 7]);
  // De-duplicate and sort
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
  const show = baseChordIDs.length >= 3; // show for triads or sevenths
  document.querySelector('#chord-notes')?.classList.toggle('show', show);
  document.querySelector('.inversions')?.classList.toggle('show', show);
  document.querySelector('.active_chord')?.classList.toggle('show', show);
  // Make inversions control inline-flex when shown so it sits beside the chord-type toggle
  const invEl = document.querySelector('.inversions');
  if (invEl) invEl.style.display = show ? 'inline-flex' : 'none';
  const typeToggle = document.querySelector('.chord-type-toggle');
  if (typeToggle) typeToggle.style.display = 'block';
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
  if (chordDisplay) chordDisplay.textContent = '';
  document.querySelectorAll('.scale-note').forEach(n => n.classList.remove('active'));
  setActiveInversion(0);
  updateChordVisibility();
}

// --- Chord search UI (find chord in other keys & modes) ---
function renderChordSearchUI() {
  const footer = document.getElementById('footer');
  if (!footer || document.getElementById('chord-search')) return;

  const wrap = document.createElement('div');
  wrap.id = 'chord-search';
  wrap.style.display = 'none';

  wrap.innerHTML = `
  <div class="chord-search-bar">
    <button type="button" id="chord-search-btn" title="Find this chord in other keys &amp; modes" aria-label="Find this chord in other keys and modes"">
    </button>
    <div id="chord-search-summary"></div>
  </div>
`;

  // Create (or reuse) a fixed-position portal so results float above the SVG piano
  let resultsPortal = document.getElementById('chord-search-results');
  if (!resultsPortal) {
    resultsPortal = document.createElement('div');
    resultsPortal.id = 'chord-search-results';
    resultsPortal.className = 'chord-search-popover';
    document.body.appendChild(resultsPortal);
  }

  // Insert directly below the active chord display, if present
  const activeChordEl = document.getElementById('active_chord');
  if (activeChordEl && activeChordEl.parentElement) {
    activeChordEl.parentElement.insertBefore(wrap, activeChordEl.nextSibling);
  } else {
    footer.appendChild(wrap);
  }

  const btn = wrap.querySelector('#chord-search-btn');
  const results = document.getElementById('chord-search-results');
  const summary = wrap.querySelector('#chord-search-summary');

  // Also open the popover when clicking the active chord label
  if (activeChordEl) {
    activeChordEl.style.cursor = 'pointer';
    activeChordEl.addEventListener('click', () => {
      btn.click();
    });
  }

  btn.addEventListener('click', () => {
    const matches = findChordInOtherKeys();
    results.innerHTML = '';
    // Title + content container for the popover
    results.insertAdjacentHTML(
      'afterbegin',
      '<div class="popover-title"><div class="popover-heading"></div><button type="button" id="closeChordSearch" class="popover-close" aria-label="Close">✕</button></div><div class="popover-content"></div>'
    );
    const contentEl = results.querySelector('.popover-content');
    const titleEl = results.querySelector('.popover-heading');
    // Build a clean, text-only title (strip any SVG/icons from #active_chord)
    const chordLabelEl = document.getElementById('active_chord');
    let chordText = '';
    if (chordLabelEl) {
      const clone = chordLabelEl.cloneNode(true);
      clone.querySelectorAll('svg').forEach(n => n.remove());
      chordText = clone.textContent.trim();
    }
    if (titleEl) {
      // Use textContent so no HTML (including accidental spans or SVG) leaks in
      titleEl.textContent = chordText ? `Other Keys with ${chordText}` : 'Keys Containing This Chord';
    }
    // Add close button handler (default: just closes the popover)
    const closeBtn = results.querySelector('#closeChordSearch');
    if (closeBtn) {
      closeBtn.addEventListener('click', (ev) => {
        ev.preventDefault();
        results.classList.remove('is-open');
        const pianoContainer = document.getElementById('pianoSvgContainer');
        if (pianoContainer) pianoContainer.style.pointerEvents = '';
      });
    }
    // Ensure the popover can show even after a previous no-match
    summary.textContent = '';
    results.style.display = '';
    results.classList.add('is-open');

    // Position the fixed popover near the button
    // Position values sent to CSS via custom properties
    const rect = btn.getBoundingClientRect();
    const viewportPadding = 8;

    // Width & height constraints
    const minWidth = Math.max(260, rect.width);
    const width = Math.min(minWidth, window.innerWidth - 2 * viewportPadding);
    const maxH = window.innerHeight - 2 * viewportPadding;

    // Temporarily open to measure height
    results.classList.add('is-open');
    // results.style.setProperty('--popover-width', width + 'px');
    // results.style.setProperty('--popover-maxh', maxH + 'px');

    // Measure content and choose above/below
    const contentH = Math.min(results.scrollHeight, maxH);
    let top = rect.bottom + 6;
    if (top + contentH > window.innerHeight - viewportPadding) {
      top = Math.max(viewportPadding, rect.top - contentH - 6);
    }

    // Right-anchored distance
    const right = Math.max(viewportPadding, window.innerWidth - rect.right - 6);

    // Send computed values to CSS
    // results.style.setProperty('--popover-top', top + 'px');
    // results.style.setProperty('--popover-right', right + 'px');
    if (!matches.length) {
      summary.textContent = 'No matches found in other keys/modes.';
      // Keep the popover visible so future searches work normally
      // and show a lightweight message inside the results panel.
      contentEl.innerHTML = '<div class="no-matches">No matches found in other keys/modes.</div>';
      results.addEventListener('mouseleave', () => {
        results.classList.remove('is-open');
      }, { once: true });
      // (No further changes needed here; default close button handler works)
    } else {
      // Temporarily disable pointer events on the piano so the popover can be interacted with
      const pianoContainer = document.getElementById('pianoSvgContainer');
      if (pianoContainer) pianoContainer.style.pointerEvents = 'none';
      const onResize = () => {
        const rect2 = btn.getBoundingClientRect();
        const width2 = Math.min(Math.max(260, rect2.width), window.innerWidth - 2 * viewportPadding);
        const maxH2 = window.innerHeight - 2 * viewportPadding;
        const contentH2 = Math.min(results.scrollHeight, maxH2);
        let top2 = rect2.bottom + 6;
        if (top2 + contentH2 > window.innerHeight - viewportPadding) {
          top2 = Math.max(viewportPadding, rect2.top - contentH2 - 6);
        }
        const right2 = Math.max(viewportPadding, window.innerWidth - rect2.right - 6);
        // results.style.setProperty('--popover-width', width2 + 'px');
        // results.style.setProperty('--popover-maxh', maxH2 + 'px');
        // results.style.setProperty('--popover-top', top2 + 'px');
        // results.style.setProperty('--popover-right', right2 + 'px');
      };
      const hide = (ev) => {
        if (ev && (results.contains(ev.target) || btn.contains(ev.target))) return;
        results.classList.remove('is-open');
        if (pianoContainer) pianoContainer.style.pointerEvents = '';
        window.removeEventListener('scroll', hide, true);
        window.removeEventListener('resize', hide, true);
        document.removeEventListener('mousedown', hide, true);
      };
      // Wire the close button to the hide() function so it fully dismisses and cleans up listeners
      if (closeBtn) {
        closeBtn.addEventListener('click', (ev) => {
          ev.preventDefault();
          hide();
        }, { once: true });
      }
      // Bind listeners after showing
      setTimeout(() => {
        window.addEventListener('scroll', hide, true);
        window.addEventListener('resize', onResize, true);
        document.addEventListener('mousedown', hide, true);
      }, 0);
      results.addEventListener('mouseleave', () => {
        results.classList.remove('is-open');
        if (pianoContainer) pianoContainer.style.pointerEvents = '';
        window.removeEventListener('scroll', hide, true);
        window.removeEventListener('resize', onResize, true);
        document.removeEventListener('mousedown', hide, true);
      }, { once: true });

      contentEl.innerHTML = matches.map(m => {
        const tag = `${supAcc(m.key)} ${m.mode} — ${m.roman}`;
        return `<button type="button" class="chord-match" data-key="${m.key}" data-mode="${m.mode}" data-degree="${m.degree}">${tag}</button>`;
      }).join('');

      results.querySelectorAll('.chord-match').forEach(btn => {
        btn.addEventListener('click', () => {
          const base = btn.dataset.key;
          const mode = btn.dataset.mode;
          const degree = parseInt(btn.dataset.degree, 10) || 0;
          const preserved = baseChordIDs ? baseChordIDs.slice() : null;
          const labelEl = document.getElementById('active_chord');
          const preservedLabelHTML = labelEl ? labelEl.innerHTML : null;
          switchToKeyModeAndDegree(base, mode, degree, preserved, preservedLabelHTML);
        });
      });
    }
  });
}
// Transpose a chord by mapping its root ID to a new root ID, preserving semitone intervals
function transposeChordIDs(ids, oldRootId, newRootId) {
  if (!Array.isArray(ids) || ids.length === 0) return [];
  const delta = newRootId - oldRootId;
  const keys = Object.keys(ID_TO_NOTE).map(Number);
  const minId = Math.min(...keys);
  const maxId = Math.max(...keys);
  return ids.map((id) => {
    let next = id + delta;
    // wrap by octaves so we keep all notes
    while (next < minId) next += 12;
    while (next > maxId) next -= 12;
    return next;
  });
}
function findChordInOtherKeys() {
  if (!Array.isArray(baseChordIDs) || baseChordIDs.length < 3) return [];

  const size = getChordSize(); // 3 or 4
  // Always compute against the exact active chord size
  const targetIntervals = idsToIntervals(baseChordIDs.slice(0, size));
  const targetPCs = chordIDsToPitchClasses(baseChordIDs.slice(0, size));
  if (!targetIntervals.length || targetPCs.length !== size) return [];

  // Determine the displayed root letter of the current chord (respects current key/mode spelling)
  const targetRootDisplay = getDisplaySpelling((ID_TO_NOTE[baseChordIDs[0]] || '').replace(/\d+$/, ''));
  const targetRootLetter = getNoteLetter(targetRootDisplay);

  const out = [];

  for (const mode of Object.keys(MODES)) {
    const keys = MODE_KEYS[mode] || [];
    for (const base of keys) {
      const currentBase = selectedKey ? selectedKey.slice(0, -1) : '';
      if (mode === selectedMode && base === currentBase) continue;

      const scalePCs = getScalePitchClasses(base, mode);
      if (!Array.isArray(scalePCs) || scalePCs.length !== 7 || scalePCs.some(pc => pc === -1)) continue; // invalid scale

      for (let degree = 0; degree < 7; degree++) {
        // Candidate intervals at this degree must match (handles inversions)
        const candIntervals = scaleIntervalsAtDegree(scalePCs, degree, size);
        if (JSON.stringify(candIntervals) !== JSON.stringify(targetIntervals)) continue;

        // Candidate exact PC set must match the searched chord (root specificity)
        const candPCs = chordPitchClassesFromScale(scalePCs, degree, size);
        if (!Array.isArray(candPCs) || candPCs.length !== size) continue;
        if (!samePCSet(candPCs, targetPCs)) continue;

        // Enharmonic spelling guard: displayed root LETTER must match (e.g., Eb vs D#)
        const candScaleRaw = getScaleNotes(base, mode) || [];          // 7 base note names (no octaves)
        const candAdjusted = adjustEnharmonics(candScaleRaw, base) || candScaleRaw;
        const degIdx = degree % 7;
        const candRootName = (candAdjusted[degIdx] || candScaleRaw[degIdx] || '');
        if (!candRootName) continue; // safety
        const candRootLetter = getNoteLetter(candRootName);
        if (candRootLetter !== targetRootLetter) continue;

        const roman = (size === 4)
          ? (MODE_ROMAN_NUMERALS_7[mode]?.[degIdx] || '')
          : (MODE_ROMAN_NUMERALS[mode]?.[degIdx] || ''); out.push({ mode, key: base, degree, roman });
      }
    }
  }
  return out;
}

function switchToKeyModeAndDegree(base, mode, degree, preservedChordIDs = null, preservedLabelHTML = null) {  // Set mode first (rebuilds key options)
  selectedMode = mode;
  updateKeyOptions(mode);

  // Choose a concrete key name with octave to match NOTE_MAP
  let matching = Object.keys(NOTE_MAP).find(n => n === base + '4') ||
    Object.keys(NOTE_MAP).find(n => n.startsWith(base));
  if (!matching && ENHARMONIC_MAP[base]) {
    matching = Object.keys(NOTE_MAP).find(n => n.startsWith(ENHARMONIC_MAP[base]));
  }
  if (!matching) return;

  selectedKey = matching;
  applyBackground(null, getKeyBackground(base), '#8BEB83');

  // Reflect active classes in the UI lists
  document.querySelectorAll('.mode-button').forEach(b => {
    const on = b.dataset.mode === mode;
    b.classList.toggle('active', on);
  });
  document.querySelectorAll('.key-button').forEach(b => {
    const on = b.textContent.trim() === base;
    b.classList.toggle('active', on);
  });

  // Clear any stale selection state so the next click doesn't toggle the chord off
  lastClickedScaleNote = null;
  lastClickedScaleId = null;
  resetChordSearchUI();

  // Re-render with the new selection
  resetChordDisplay(); // keeps chordType (triad/7th) as-is
  update();

  // After update(), mark the degree and set the chord by transposition (keep quality)
  const sel = `#scale-display .scale-note[data-degree="${degree}"]`;
  const el = document.querySelector(sel);
  document.querySelectorAll('#scale-display .scale-note').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');

  const targetRootId = Array.isArray(scaleIDs) && scaleIDs.length ? scaleIDs[degree] : null;
  const size = getChordSize();

  if (preservedChordIDs && preservedChordIDs.length >= 3 && targetRootId != null) {
    // Keep the exact interval structure: transpose root-position chord to the new root
    const oldRootId = preservedChordIDs[0];
    baseChordIDs = transposeChordIDs(preservedChordIDs.slice(0, size), oldRootId, targetRootId);
    baseChordIDs = baseChordIDs.slice(0, size);
  } else {
    // Fallback: diatonic build (only if we have nothing preserved)
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
    if (typeof preservedLabelHTML === 'string' && preservedLabelHTML.trim()) {
      chordDisplay.innerHTML = preservedLabelHTML.trim();
    } else if (baseChordIDs.length) {
      const rootName = (ID_TO_NOTE[baseChordIDs[0]] || '').replace(/\d+$/, '');
      const intervals = idsToIntervals(baseChordIDs);
      const inferred = (getChordSize() === 4)
        ? (classifySeventh(intervals) || '')
        : (classifyTriad(intervals) || '');
      const disp = getDisplaySpelling(rootName);
      const label = inferred ? `${supAcc(disp)} ${inferred}` : supAcc(disp);
      chordDisplay.innerHTML = `${label} ${CHORD_ICON_SVG}`;
    } else {
      chordDisplay.innerHTML = '';
    }
  }
}

const keySelect = document.getElementById('key-select');
const modeSelect = document.getElementById('mode-select');
const piano = document.getElementById('piano');
const scaleDisplay = document.getElementById('scale-display');
const chordNotesDiv = document.getElementById('chord-notes');

// --- New scale/chord logic and rendering ---

function getScaleNotesFromX1(x1, modeName) {
  const intervals = MODES[modeName];
  const notes = [x1];
  let current = x1;
  // Expand the scale to span multiple octaves (3 octaves = 21 notes)
  for (let i = 0; i < 21; i++) {
    const step = intervals[i % 7];
    current += step;
    notes.push(current);
  }
  return notes;
}

// Overhauled getScaleNotes function to properly support sharp and flat root keys and enharmonics
function getScaleNotes(key, mode) {
  const intervals = MODES[mode];
  if (!intervals) return [];

  // Get pitch class index from NOTE_NAMES (prefer sharps, fallback to enharmonic)
  let rootIndex = NOTE_NAMES.indexOf(key);
  if (rootIndex === -1 && ENHARMONIC_MAP[key]) {
    rootIndex = NOTE_NAMES.indexOf(ENHARMONIC_MAP[key]);
  }
  if (rootIndex === -1) return [];

  // Build cumulative semitone offsets for 7 degrees: start at 0 (the root)
  const offsets = [0];
  for (let i = 0; i < 6; i++) {
    offsets.push((offsets[i] + intervals[i]) % 12);
  }

  // Map to note names
  return offsets.map(off => NOTE_NAMES[(rootIndex + off) % 12]);
}

function getNoteNamesFromIDs(ids) {
  return ids.map(id => ID_TO_NOTE[id]);
}

function renderKeys(scaleIDs = [], chordIDs = [], nOctaves = 2, offset = 0, highlightOnlyInCenter = true) {
  // nOctaves = how many octaves to show (default 2)
  // offset = pixel offset of keyboard (default 0)
  // highlightOnlyInCenter = only highlight keys in center octaves (default true)
  const svg = document.getElementById('pianoSvg');
  const whiteLayer = svg.querySelector('.white-keys');
  const blackLayer = svg.querySelector('.black-keys');
  whiteLayer.innerHTML = '';
  blackLayer.innerHTML = '';

  const { WHITE_W, WHITE_H, BLACK_W, BLACK_H } = getSizes();
  const KEY_IMAGES = {
    1: 'assets/right-white.svg',  // C
    3: 'assets/both-white.svg',   // D
    5: 'assets/left-white.svg',   // E
    6: 'assets/right-white.svg',  // F
    8: 'assets/both-white.svg',   // G
    10: 'assets/both-white.svg',  // A
    12: 'assets/left-white.svg',  // B
    2: 'assets/black.svg', 4: 'assets/black.svg', 7: 'assets/black.svg', 9: 'assets/black.svg', 11: 'assets/black.svg'
  };

  // White keys are IDs: 1,3,5,6,8,10,12 (C D E F G A B)
  const WHITE_IDS = [1, 3, 5, 6, 8, 10, 12];
  const BLACK_IDS = [2, 4, 7, 9, 11];

  // Render keys using the new 36-note system
  let keyOrder = [];
  for (let id = 0; id < 60; id++) {
    const note = ID_TO_NOTE[12 + id];
    if (!note) continue;
    const name = note.slice(0, -1);
    const octave = parseInt(note.slice(-1), 10);
    const baseId = NOTE_NAMES.indexOf(name) + 1;
    keyOrder.push({ id: 12 + id, baseId, octave });
  }
  // Highlight all center octaves (3–5)
  const centerOctaveStart = 3;
  const centerOctaveEnd = 5;

  // Only render white keys for white layer
  let whiteKeys = keyOrder.filter(k => WHITE_IDS.includes(k.baseId));
  let blackKeys = keyOrder.filter(k => BLACK_IDS.includes(k.baseId));

  // Positioning: white keys are evenly spaced, black keys float above
  // For each white key, compute its x
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
      const firstScaleSet = scaleIDs.filter((id, i) => i < 7); // only highlight one octave of scale
      if (firstScaleSet.includes(k.id)) img.classList.add('scale-highlight');
      if (chordIDs.includes(k.id)) img.classList.add('chord-highlight');
    }
    // Add data attributes for click mapping
    img.dataset.noteId = k.id;
    img.dataset.noteName = ID_TO_NOTE[k.id];
    img.dataset.octave = k.octave;
    whiteLayer.appendChild(img);
  });

  // Black keys: position between white keys
  // For each black key, find its position
  // The order of white keys in an octave: C(1), D(3), E(5), F(6), G(8), A(10), B(12)
  // Black keys: C#(2) between C(1) and D(3), D#(4) between D(3) and E(5), F#(7) between F(6) and G(8), G#(9) between G(8) and A(10), A#(11) between A(10) and B(12)
  function getBlackKeyX(whiteKeys, blackBaseId, octave) {
    // Find the two white keys it sits between
    // Map: 2 between 1&3, 4 between 3&5, 7 between 6&8, 9 between 8&10, 11 between 10&12
    let idx = -1;
    switch (blackBaseId) {
      case 2: // C#
        idx = whiteKeys.findIndex(k => k.baseId === 1 && k.octave === octave);
        break;
      case 4: // D#
        idx = whiteKeys.findIndex(k => k.baseId === 3 && k.octave === octave);
        break;
      case 7: // F#
        idx = whiteKeys.findIndex(k => k.baseId === 6 && k.octave === octave);
        break;
      case 9: // G#
        idx = whiteKeys.findIndex(k => k.baseId === 8 && k.octave === octave);
        break;
      case 11: // A#
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
      const firstScaleSet = scaleIDs.filter((id, i) => i < 7); // only highlight one octave of scale
      if (firstScaleSet.includes(k.id)) img.classList.add('scale-highlight');
      if (chordIDs.includes(k.id)) img.classList.add('chord-highlight');
    }
    img.dataset.noteId = k.id;
    img.dataset.noteName = ID_TO_NOTE[k.id];
    img.dataset.octave = k.octave;
    blackLayer.appendChild(img);
  });

  // Set SVG width
  const totalWhiteKeys = whiteKeys.length;
  const totalWidth = totalWhiteKeys * WHITE_W + offset;
  svg.setAttribute('viewBox', `0 0 ${totalWidth} ${WHITE_H}`);
  // Ensure the on-screen size matches our scaled dimensions
  svg.style.height = `${WHITE_H}px`;
  svg.style.width = `${totalWidth}px`;
  // --- Center only the highlighted range within the scroll container ---
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

    container.scrollTo({ left: scrollX, behavior: 'smooth' });
  });
}

function update() {
  const baseKey = selectedKey.slice(0, -1);
  const octave = selectedKey.slice(-1);
  // If current key isn't valid for the active mode, clear UI and wait for a valid selection
  if (!isKeyValidForMode(baseKey, selectedMode)) {
    // Clear piano SVG layers
    const svg = document.getElementById('pianoSvg');
    svg?.querySelector('.white-keys') && (svg.querySelector('.white-keys').innerHTML = '');
    svg?.querySelector('.black-keys') && (svg.querySelector('.black-keys').innerHTML = '');
    // Clear displays
    scaleDisplay.innerHTML = '';
    const romanDisplay = document.getElementById('roman-display');
    if (romanDisplay) romanDisplay.innerHTML = '';
    const chordDisplay = document.getElementById('active_chord');
    if (chordDisplay) chordDisplay.textContent = '';
    if (chordNotesDiv) chordNotesDiv.textContent = '';
    // Reset chord state and hide chord UI
    baseChordIDs = [];
    currentChord = [];
    updateChordVisibility();
    return; // do not render anything until a valid key is chosen
  }
  const fullKey = baseKey + octave;
  const mapped = NOTE_MAP[fullKey];
  if (typeof mapped === 'undefined') {
    console.warn('Invalid key selected:', selectedKey);
    return;
  }
  x1 = mapped;
  scaleIDs = getScaleNotesFromX1(x1, selectedMode); // pass full ID, not reduced version
  const rawScaleNotes = getNoteNamesFromIDs(scaleIDs).filter(Boolean);
  const baseScaleNames = rawScaleNotes.map(n => n.slice(0, -1));
  // canonicalKey is not defined above anymore, so we use baseKey for enharmonic adjustment
  const adjustedNames = adjustEnharmonics(baseScaleNames, baseKey);
  scaleNotes = adjustedNames.map((note, i) => note + rawScaleNotes[i].slice(-1));
  if (scaleNotes.length < 7) return;
  // --- Enharmonic adjustment for scale display ---
  const scale = scaleNotes.map(n => n.slice(0, -1));
  const adjustedScale = adjustEnharmonics(scale, baseKey);
  renderKeys(scaleIDs, [], 3, 0, false);
  // Render scale display using adjustedScale
  scaleDisplay.innerHTML = adjustedScale.slice(0, 7).map((note, i) =>
    `<span class="scale-note" data-note-id="${scaleIDs[i]}" data-degree="${i}">${supAcc(note)}</span>`
  ).join('');
  // Render roman numerals
  const romanDisplay = document.getElementById('roman-display');
  const usingSevenths = getChordSize() === 4;
  const romanSet = usingSevenths ? (MODE_ROMAN_NUMERALS_7[selectedMode] || [])
    : (MODE_ROMAN_NUMERALS[selectedMode] || []);
  romanDisplay.innerHTML = romanSet.map(n => `<span>${n}</span>`).join('');
  // Click handler for scale notes
  scaleDisplay.onclick = e => {
    const target = e.target;
    if (!target.classList.contains('scale-note')) return;
    const noteId = parseInt(target.dataset.noteId, 10);
    lastClickedScaleId = noteId;
    const note = ID_TO_NOTE[noteId] || '';
    // Check if user clicked same note twice
    if (note === lastClickedScaleNote) {
      resetChordDisplay(); // Hide the chord, show the scale
      renderKeys(scaleIDs, [], 2, 0, true); // Redraw full scale
      lastClickedScaleNote = null; // Reset the tracker
      resetChordSearchUI();
      return;
    }
    lastClickedScaleNote = note; // Update last clicked note
    // Highlight clicked note
    document.querySelectorAll('.scale-note').forEach(n => n.classList.remove('active'));
    target.classList.add('active');
    // Find index of scale note in current scale
    const index = scaleIDs.indexOf(noteId);
    if (index === -1) return;
    // Chord logic: triad (3) or seventh (4) from this scale degree
    const size = getChordSize();
    const chordIDs = buildChordIDs(scaleIDs, index, size);
    baseChordIDs = chordIDs;
    currentInversion = 0;
    currentChord = chordIDs.map(id => ID_TO_NOTE[id]);
    updateChordVisibility();
    resetChordSearchUI();             // <-- add this
    renderInversionButtons(size);
    setActiveInversion(0); // handles rendering and note labels
    const roman = MODE_ROMAN_NUMERALS[selectedMode]?.[index % 7] || '';
    let quality = '';
    const intervals = idsToIntervals(baseChordIDs);
    if (getChordSize() === 4) {
      quality = classifySeventh(intervals) || '';
    } else {
      quality = qualityFromRoman(roman) || classifyTriad(intervals) || '';
    }
    const chordDisplay = document.getElementById('active_chord');
    // Strip octave from note for display (replace digit with empty string)
    if (chordDisplay && note) {
      const base = note.replace(/\d+$/, '');
      chordDisplay.innerHTML = `${supAcc(getDisplaySpelling(base))} ${quality} ${CHORD_ICON_SVG}`;
    }
    // Re-render roman numerals (already done above but safe to include)
    const rSet = getChordSize() === 4 ? (MODE_ROMAN_NUMERALS_7[selectedMode] || [])
      : (MODE_ROMAN_NUMERALS[selectedMode] || []);
    romanDisplay.innerHTML = rSet.map(n => `<span>${n}</span>`).join('');
  };
  const controls = document.querySelector('.controls');
  const activeDisplay = document.getElementById('active_mode-key');
  if (activeDisplay) {
    if (typeof selectedKey === 'string') {
      activeDisplay.innerHTML = `${supAcc(baseKey)} ${selectedMode} <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width=".9em" height=".9em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 733.81 900.04"><path fill="currentColor" d="M13.15,201.34L206.61,12.4c8.51-8.26,18.28-12.4,29.3-12.4s20.91,3.64,28.17,10.89c7.25,7.26,10.89,16.65,10.89,28.17s-3.76,20.54-11.27,27.79l-80.38,77.39-57.85,49.96,80.01-2.63h488.7c11.52,0,20.97,3.7,28.36,11.09s11.09,16.84,11.09,28.36-3.7,21.04-11.09,28.55-16.84,11.27-28.36,11.27H205.48l-80.01-3.01,57.85,50.34,80.38,77.38c7.51,7.26,11.27,16.4,11.27,27.42s-3.64,20.98-10.89,28.37c-7.26,7.38-16.65,11.08-28.17,11.08s-20.79-4.25-29.3-12.78L13.15,260.69c-8.77-8.26-13.15-18.09-13.15-29.48s4.38-21.35,13.15-29.87ZM720.86,698.69l-193.45,188.95c-8.52,8.26-18.29,12.4-29.31,12.4s-20.92-3.64-28.17-10.89c-7.26-7.28-10.89-16.66-10.89-28.18s3.63-20.28,10.89-27.79l80.77-77.38,57.85-50.34-80.01,3.01H39.82c-11.52,0-21.04-3.69-28.55-11.08s-11.27-16.97-11.27-28.75,3.76-20.97,11.27-28.36c7.51-7.38,17.03-11.09,28.55-11.09h488.71l80.01,3.01-57.85-50.33-80.77-77.39c-7.26-7.25-10.89-16.52-10.89-27.79s3.63-20.91,10.89-28.17,16.65-10.89,28.17-10.89,20.79,4.14,29.31,12.4l193.45,189.32c8.51,8.01,12.82,17.78,12.95,29.3s-4.19,21.55-12.95,30.06Z"/></svg>`;
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

  const n = baseChordIDs.length; // 3 for triads, 4 for sevenths
  const inv = ((i % n) + n) % n; // normalize
  currentInversion = inv;

  // Update active state on buttons (they may have been rebuilt)
  inversionsEl.querySelectorAll('[data-inversion]').forEach(b => {
    const on = String(inv) === String(b.dataset.inversion);
    b.classList.toggle('active', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });

  // Generalized inversion: lift the first `inv` notes by an octave, then rotate
  const raised = baseChordIDs.map((id, idx) => (idx < inv ? id + 12 : id));
  const invIDs = raised.slice(inv).concat(raised.slice(0, inv));

  const invNoteNames = invIDs.map(id => ID_TO_NOTE[id]).filter(Boolean);
  chordNotesDiv.innerHTML = renderChordNoteLabels(invNoteNames);
  renderKeys([], invIDs, 3, 0, true);
}

// Re-add inversion click event handler after setActiveInversion
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
    btn.textContent = m;
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
  // Only show keys relevant to the selected mode, using MODE_KEYS if defined
  const validKeys = MODE_KEYS[selectedMode] || [];
  validKeys.forEach(base => {
    // Prefer flat enharmonic match if base includes 'b'
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
  // Find the button for the selectedKey (by its base)
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

// helper: hide only AFTER the slide-up completes
function hideAfterTransition(e) {
  if (e.propertyName === 'transform') {
    controls.style.visibility = 'hidden';
    controls.removeEventListener('transitionend', hideAfterTransition);
  }
}

openBtn?.addEventListener('click', () => {
  // show immediately, then slide down
  controls.style.visibility = 'visible';
  controls.classList.toggle('is-open');
});

closeBtn?.addEventListener('click', () => {
  // slide up, THEN hide on transition end
  controls.classList.remove('is-open');
  controls.addEventListener('transitionend', hideAfterTransition);
});

controls.addEventListener('mouseleave', () => {
  controls.classList.remove('is-open');
});

renderChordSearchUI();
// Reset/clear the chord search UI (hide results and summary)
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
  // Visibility of #chord-search itself is still controlled by updateChordVisibility()
}
renderChordTypeToggle();
populateModesOnce();
updateKeyOptions(selectedMode);
update();

// Initialize background gradient for current selection
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