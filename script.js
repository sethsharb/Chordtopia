// --- Constants ---
// NOTE_NAMES and pitch-aware NOTE_MAP and ID_TO_NOTE, 36 slots, scale centered in IDs 12–24
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTE_MAP = {};
const ID_TO_NOTE = {};
const ENHARMONIC_MAP = {
  'C#': 'Db', 'Db': 'C#',
  'D#': 'Eb', 'Eb': 'D#',
  'F#': 'Gb', 'Gb': 'F#',
  'G#': 'Ab', 'Ab': 'G#',
  'A#': 'Bb', 'Bb': 'A#'
};
function getNoteLetter(n) {
  return n.replace(/[#b]/, '');
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

// Valid key spellings per mode (used by updateKeyOptions and validation in update)
const MODE_KEYS = {
  Major: ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'],
  Minor: ['C', 'C#', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'],
  Dorian: ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'Ab', 'A', 'Bb', 'B'],
  Phrygian: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'Bb', 'B'],
  Lydian: ['C', 'D', 'Db', 'E', 'Eb', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'],
  Mixolydian: ['C', 'D', 'E', 'F', 'F#', 'G', 'A', 'A#', 'B', 'Bb', 'C#', 'D#', 'G#'],
  Locrian: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'Bb'],
  Harmonic: ['C', 'C#', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'],
  Melodic: ['C', 'C#', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'],
};

function isKeyValidForMode(baseKey, mode) {
  const list = MODE_KEYS[mode] || [];
  return list.includes(baseKey);
}

const KEY_BACKGROUNDS = {
  'C': '#8BEB83',
  'C#': '#66F4BB',
  'Db': '#66F4BB',
  'D': '#A1C9FF',
  'D#': '#BEBAFF',
  'Eb': '#BEBAFF',
  'E': '#FFAAB2',
  'F': '#FFAF91',
  'F#': '#D6DF94',
  'Gb': '#D6DF94',
  'G': '#8BEB83',
  'G#': '#66F4BB',
  'Ab': '#66F4BB',
  'A': '#A1C9FF',
  'A#': '#BEBAFF',
  'Bb': '#BEBAFF',
  'B': '#FFAAB2'
};

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

const inversionsContainer = footer.querySelector('.inversions');
// Put the toggle directly ABOVE the inversions (no content removed)
if (inversionsContainer) {
  footer.insertBefore(wrap, inversionsContainer);
} else {
  footer.appendChild(wrap);
}
// Hidden by default; shown only when a chord is active
wrap.style.display = 'none';

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
        updateChordVisibility();
        return;
      }
    }
    // Fallback if nothing selected
    renderInversionButtons(getChordSize());
    renderKeys(scaleIDs, [], 3, 0, true);
    updateChordVisibility();
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
    return `<div class="chord-note">${disp}</div>`;
  }).join('');
}

function getDisplaySpelling(base) {
  const scaleSet = new Set(Array.from(document.querySelectorAll('#scale-display .scale-note'))
    .map(el => el.textContent.trim()));
  if (scaleSet.has(base)) return base;
  const enh = ENHARMONIC_MAP[base];
  return (enh && scaleSet.has(enh)) ? enh : base;
}

function updateChordVisibility() {
  const show = baseChordIDs.length >= 3; // show for triads or sevenths
  document.querySelector('#chord-notes')?.classList.toggle('show', show);
  document.querySelector('.inversions')?.classList.toggle('show', show);
  document.querySelector('.active_chord')?.classList.toggle('show', show);
  // Toggle the Triads/7ths toggle visibility
  const typeToggle = document.querySelector('.chord-type-toggle');
  if (typeToggle) typeToggle.style.display = show ? '' : 'none';
}

function resetChordDisplay() {
  currentChord = [];
  activeScaleNote = null;
  chordNotesDiv.textContent = '';
  const chordDisplay = document.getElementById('active_chord');
  if (chordDisplay) chordDisplay.textContent = '';
  document.querySelectorAll('.scale-note').forEach(n => n.classList.remove('active'));
  setActiveInversion(0);
  updateChordVisibility();
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

  // Use exact input key as display label
  const rootDisplay = key;

  // Get pitch class index from NOTE_NAMES
  let rootIndex = NOTE_NAMES.indexOf(key);
  if (rootIndex === -1 && ENHARMONIC_MAP[key]) {
    rootIndex = NOTE_NAMES.indexOf(ENHARMONIC_MAP[key]);
  }
  if (rootIndex === -1) return [];

  // Calculate scale pitches
  const scaleNotes = intervals.map(interval => {
    const noteIndex = (rootIndex + interval) % 12;
    return NOTE_NAMES[noteIndex];
  });

  return scaleNotes;
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
    `<span class="scale-note" data-note-id="${scaleIDs[i]}" data-degree="${i}">${note}</span>`
  ).join('');
  // Render roman numerals
  const romanDisplay = document.getElementById('roman-display');
  const romanNumerals = MODE_ROMAN_NUMERALS[selectedMode] || [];
  romanDisplay.innerHTML = romanNumerals.map(n =>
    `<span>${n}</span>`
  ).join('');
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
    renderInversionButtons(size);
    setActiveInversion(0); // handles rendering and note labels
    const roman = MODE_ROMAN_NUMERALS[selectedMode]?.[index % 7] || '';
    let quality = '';
    if (roman.includes('°')) quality = 'Diminished';
    else if (roman.includes('+')) quality = 'Augmented';
    else if (roman === roman.toUpperCase()) quality = 'Major';
    else quality = 'Minor';
    const chordDisplay = document.getElementById('active_chord');
    // Strip octave from note for display (replace digit with empty string)
    if (chordDisplay && note) {
      const base = note.replace(/\d+$/, '');
      chordDisplay.textContent = `${getDisplaySpelling(base)} ${quality}`;
    }
    // Re-render roman numerals (already done above but safe to include)
    romanDisplay.innerHTML = romanNumerals.map(n => `<span>${n}</span>`).join('');
  };
  const controls = document.querySelector('.controls');
  const activeDisplay = document.getElementById('active_mode-key');
  if (activeDisplay) {
    if (typeof selectedKey === 'string') {
      activeDisplay.textContent = `${baseKey} ${selectedMode} ›`;
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
    btn.textContent = base;
    btn.dataset.note = matching;
    btn.classList.add('key-button');
    btn.addEventListener('click', () => {
      document.querySelectorAll('.key-button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedKey = matching;
      document.body.style.background = KEY_BACKGROUNDS[base] || '#a8e6cf';
      resetChordDisplay();
      update();
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
});

const controls = document.querySelector('.controls');
const openBtn  = document.getElementById('active_mode-key');
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

renderChordTypeToggle();
populateModesOnce();
updateKeyOptions(selectedMode);
update();
setPianoScale(1.4);