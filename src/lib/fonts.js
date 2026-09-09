// Read-only access to the generated manifest plus a few pure helpers.
import manifest from '../manifest.json';

export const families = manifest.families;
export const generatedAt = manifest.generatedAt;
export const faces = families.flatMap(f => f.faces.map(x => ({ ...x, family: f })));
export const byFamily = Object.fromEntries(families.map(f => [f.id, f]));
export const byFace = Object.fromEntries(faces.map(x => [x.id, x]));
export const primaryFace = fam => byFace[fam.primary];
export const ff = face => `"${face.cssFamily}"`;

// Facets. Each option is [value, count]; counts are over the whole library.
const counted = (items, order) => {
  const m = new Map();
  for (const t of items) m.set(t, (m.get(t) || 0) + 1);
  const arr = [...m];
  if (order) arr.sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]));
  else arr.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  return arr;
};
const CATEGORY_ORDER = ['Serif', 'Sans Serif', 'Script', 'Display', 'Slab Serif', 'Decorative', 'Blackletter', 'Colorful', 'Dingbats', 'Free'];
const FORMAT_ORDER = ['otf', 'ttf', 'woff', 'woff2', 'eot'];
export const LICENSE_LABEL = { personal: 'Personal use', commercial: 'Commercial', proprietary: 'Proprietary' };
export const COLLECTION_LABEL = { family: 'Font family', picks: 'Staff picks', favs: 'Favourites', looks: 'In the lookbook', demo: 'Demo cuts' };

export function collectionsOf(f, favs = [], inLooks = false) {
  const c = [];
  if (f.faces.length > 1) c.push('family');
  if (f.staffPick) c.push('picks');
  if (favs.includes(f.id)) c.push('favs');
  if (inLooks) c.push('looks');
  if (f.demo) c.push('demo');
  return c;
}

export const facets = {
  categories: counted(families.flatMap(f => f.categories), CATEGORY_ORDER),
  tags: counted(families.flatMap(f => f.tags)),
  formats: counted(families.flatMap(f => f.formats), FORMAT_ORDER),
  license: counted(families.map(f => f.licenseKind), ['personal', 'commercial', 'proprietary']),
};

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
