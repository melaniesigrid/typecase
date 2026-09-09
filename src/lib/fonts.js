// Read-only access to the generated manifest plus a few pure helpers.
import manifest from '../manifest.json';

export const families = manifest.families;
export const generatedAt = manifest.generatedAt;
export const faces = families.flatMap(f => f.faces.map(x => ({ ...x, family: f })));
export const byFamily = Object.fromEntries(families.map(f => [f.id, f]));
export const byFace = Object.fromEntries(faces.map(x => [x.id, x]));
export const primaryFace = fam => byFace[fam.primary];
export const ff = face => `"${face.cssFamily}"`;

export const categories = ['all', ...new Set(families.map(f => f.category))];

// Split text into runs the face can and cannot render (Latin block only).
export function segments(face, text) {
  const out = [];
  for (const ch of text) {
    const cp = ch.codePointAt(0);
    const missing = cp > 0x20 && cp <= 0x17f && !face.latin.includes(ch);
    const last = out[out.length - 1];
    if (last && last.missing === missing) last.text += ch;
    else out.push({ text: ch, missing });
  }
  return out;
}

export function applyCase(text, mode) {
  if (mode === 'upper') return text.toUpperCase();
  if (mode === 'lower') return text.toLowerCase();
  return text;
}

export const fmtBytes = n => (n < 1024 * 100 ? `${(n / 1024).toFixed(1)} KB` : `${Math.round(n / 1024)} KB`);
export const pct = x => `${Math.round(x * 100)}%`;
export const ratio = (a, b) => (b ? (a / b).toFixed(3) : '–');

export const FEATURE_NAMES = {
  liga: 'Standard ligatures', dlig: 'Discretionary ligatures', calt: 'Contextual alternates',
  case: 'Case-sensitive forms', ordn: 'Ordinals', sups: 'Superscripts', subs: 'Subscripts',
  smcp: 'Small caps', c2sc: 'Caps to small caps', onum: 'Oldstyle figures', lnum: 'Lining figures',
  tnum: 'Tabular figures', pnum: 'Proportional figures', frac: 'Fractions', swsh: 'Swashes',
  salt: 'Stylistic alternates', aalt: 'Access all alternates', rtla: 'Right-to-left alternates',
  ss01: 'Stylistic set 1', ss02: 'Stylistic set 2', ss03: 'Stylistic set 3', titl: 'Titling',
};

export const PANGRAMS = [
  'Sphinx of black quartz judge my vow',
  'The five boxing wizards jump quickly',
  'Pack my box with five dozen liquor jugs',
  'How vexingly quick daft zebras jump',
];
