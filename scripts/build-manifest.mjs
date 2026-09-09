// Scans ./fonts, reads every font's name / OS/2 / metrics tables with fontkit and writes
//   src/manifest.json   – everything the UI needs to know about each family and face
//   src/fontfaces.js    – Vite imports for every file plus an injectFontFaces() helper
//   fonts/LICENSES.md   – license table generated from meta.json
// Pure Node. Hand-written notes per family live in fonts/meta.json.
import fs from 'node:fs';
import path from 'node:path';
import * as fontkit from 'fontkit';

const ROOT = path.resolve(import.meta.dirname, '..');
const FONTS = path.join(ROOT, 'fonts');
const META = path.join(FONTS, 'meta.json');
const OUT_JSON = path.join(ROOT, 'src', 'manifest.json');
const OUT_JS = path.join(ROOT, 'src', 'fontfaces.js');
const OUT_LICENSES = path.join(FONTS, 'LICENSES.md');

const meta = fs.existsSync(META) ? JSON.parse(fs.readFileSync(META, 'utf8')) : {};
const exts = new Set(['.ttf', '.otf', '.woff', '.woff2']);

const weightWords = [
  [/thin|hairline/i, 100], [/extra ?light|ultra ?light/i, 200], [/light/i, 300],
  [/regular|normal|book|roman/i, 400], [/medium/i, 500], [/semi ?bold|demi ?bold/i, 600],
  [/extra ?bold|ultra ?bold/i, 800], [/black|heavy/i, 900], [/bold/i, 700],
];
function guessWeight(f, style) {
  for (const [re, w] of weightWords) if (re.test(style)) return w;
  const os2 = f['OS/2'];
  if (os2?.usWeightClass >= 100) return os2.usWeightClass;
  return 400;
}
const cssId = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Does the font actually have these? Demo cuts often ship letters only.
const probe = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', lower: 'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789', punct: '.,;:!?\'"-–—()&@#%/', accents: 'àáâãäåçèéêëìíîïñòóôõöùúûüÿ',
};

function licenseKindOf(m) {
  if (m.licenseKind) return m.licenseKind;
  const l = m.license || '';
  if (/proprietary/i.test(l)) return 'proprietary';
  if (/commercial use allowed|free for commercial|open font|ofl/i.test(l)) return 'commercial';
  return 'personal';
}

const families = [];
for (const dir of fs.readdirSync(FONTS, { withFileTypes: true }).filter(d => d.isDirectory())) {
  if (dir.name.startsWith('_')) continue;
  const m = meta[dir.name] || {};
  const files = fs.readdirSync(path.join(FONTS, dir.name))
    .filter(f => exts.has(path.extname(f).toLowerCase())).sort();
  if (!files.length) continue;

  const faces = [];
  for (const file of files) {
    const abs = path.join(FONTS, dir.name, file);
    let f;
    try { f = fontkit.openSync(abs); } catch (e) { console.warn('skip', file, e.message); continue; }
    if (f.fonts) f = f.fonts[0];
    const fo = m.faces?.[file] || {};
    const style = fo.style || f.subfamilyName || 'Regular';
    const italic = fo.italic ?? (/italic|oblique/i.test(style) || !!f['OS/2']?.fsSelection?.italic);

    // A code point counts only if it maps to a glyph with an outline that is not a copy
    // of .notdef's box. Some cuts map characters to placeholders.
    let notdef = '';
    try { notdef = f.getGlyph(0).path.toSVG(); } catch { /* no outline */ }
    const has = cp => {
      if (!f.hasGlyphForCodePoint(cp)) return false;
      if (cp === 0x20 || cp === 0xa0) return true;
      try {
        const g = f.glyphForCodePoint(cp);
        if (g.id === 0) return false;
        const svg = g.path.toSVG();
        return svg.length > 0 && !(notdef && svg === notdef);
      } catch { return false; }
    };
    // Demo cuts sometimes replace a few letters with a watermark glyph. Two different
    // letters or digits sharing one outline (and not a case pair) are treated as missing.
    // Two heuristics: (1) three or more distinct letters sharing one outline (i/I and o/O/0
    // pairs are normal, eight letters sharing one glyph is a watermark); (2) an outline far
    // more complex than the face's median, which is what a logo drawn into a glyph looks like.
    const outlineOf = new Map();
    const cmdCount = new Map();
    for (let cp = 0x30; cp <= 0x17f; cp++) {
      const ch = String.fromCodePoint(cp);
      if (!/[\p{L}\p{N}]/u.test(ch) || !has(cp)) continue;
      try {
        const g = f.glyphForCodePoint(cp);
        const svg = g.path.toSVG();
        if (svg) { outlineOf.set(cp, svg); cmdCount.set(cp, g.path.commands.length); }
      } catch { /* skip */ }
    }
    const bySvg = new Map();
    for (const [cp, svg] of outlineOf) bySvg.set(svg, [...(bySvg.get(svg) || []), cp]);
    const watermarked = new Set();
    for (const cps of bySvg.values()) {
      const folded = new Set(cps.map(cp => String.fromCodePoint(cp).toLowerCase()));
      if (folded.size >= 3) cps.forEach(cp => watermarked.add(cp));
    }
    const counts = [...cmdCount.values()].sort((a, b) => a - b);
    const median = counts[Math.floor(counts.length / 2)] || 0;
    for (const [cp, n] of cmdCount) if (median > 0 && n > Math.max(160, median * 6)) watermarked.add(cp);
    const ok = cp => has(cp) && !watermarked.has(cp);

    const coverage = Object.fromEntries(Object.entries(probe).map(([k, chars]) =>
      [k, [...chars].filter(c => ok(c.codePointAt(0))).length / chars.length]));
    const latin = [];
    for (let cp = 0x20; cp <= 0x17f; cp++) {
      if (cp >= 0x7f && cp <= 0xa0) continue; // controls and nbsp
      if (ok(cp)) latin.push(String.fromCodePoint(cp));
    }

    faces.push({
      id: `${dir.name}/${cssId(style)}`,
      file: `fonts/${dir.name}/${file}`,
      format: path.extname(file).slice(1).toLowerCase(),
      bytes: fs.statSync(abs).size,
      postscriptName: f.postscriptName,
      style,
      weight: fo.weight ?? guessWeight(f, style),
      italic,
      variant: !!fo.variant,
      noLiga: !!(fo.noLiga ?? m.noLiga), // demo cuts that hide a watermark in ligature substitutions
      cssFamily: `tc-${cssId(dir.name)}-${cssId(style)}`,
      unitsPerEm: f.unitsPerEm,
      ascent: f.ascent, descent: f.descent, lineGap: f.lineGap,
      capHeight: f.capHeight, xHeight: f.xHeight,
      glyphs: f.numGlyphs,
      characters: f.characterSet.length,
      coverage,
      latin: latin.join(''),
      features: (f.availableFeatures || []).filter(x => x.length === 4 && x !== 'kern'),
      copyright: f.copyright || null,
      version: f.version || null,
    });
  }
  const order = Object.keys(m.faces || {});
  faces.sort((a, b) => {
    const ia = order.indexOf(path.basename(a.file)), ib = order.indexOf(path.basename(b.file));
    if (ia !== -1 && ib !== -1) return ia - ib;
    return Number(a.variant) - Number(b.variant) || a.weight - b.weight || Number(a.italic) - Number(b.italic);
  });
  const primary = (m.primary && faces.find(x => x.file.endsWith('/' + m.primary)))
    || faces.find(x => x.weight === 400 && !x.italic && !x.variant) || faces[0];

  families.push({
    id: dir.name,
    name: m.name || primary.postscriptName,
    cssFamily: primary.cssFamily,
    primary: primary.id,
    classification: m.classification || 'display', // sans | serif | script | display
    kind: m.kind || (faces.filter(x => x.variant).length >= 3 ? 'trio' : faces.some(x => x.variant) ? 'duo' : 'single'),
    categories: m.categories || [],
    tags: m.tags || [],
    bestFor: m.bestFor || [],
    licenseKind: licenseKindOf(m),
    added: m.added || '2026-09-09T00:00',
    staffPick: !!m.staffPick,
    formats: [...new Set(faces.map(x => x.format))],
    description: m.description || '',
    designer: m.designer || null,
    source: m.source || null,
    license: m.license || 'unknown',
    demo: m.demo ?? /demo/i.test(faces.map(x => x.file).join(' ')),
    sample: m.sample || null,
    faces,
  });
}

const allFaces = families.flatMap(f => f.faces);
const fmt = { ttf: 'truetype', otf: 'opentype', woff: 'woff', woff2: 'woff2' };
const NL = String.fromCharCode(10);
const js = [
  '// Generated by scripts/build-manifest.mjs. Do not edit.',
  ...allFaces.map((face, i) => `import u${i} from '../${face.file}';`),
  'export const faces = [',
  ...allFaces.map((face, i) => `  { family: ${JSON.stringify(face.cssFamily)}, url: u${i}, format: ${JSON.stringify(fmt[face.format])} },`),
  '];',
  'export function injectFontFaces() {',
  '  if (document.getElementById("tc-fontfaces")) return;',
  '  const css = faces.map(f => `@font-face{font-family:"${f.family}";src:url("${f.url}") format("${f.format}");font-display:block}`).join(String.fromCharCode(10));',
  '  const el = document.createElement("style"); el.id = "tc-fontfaces"; el.textContent = css; document.head.appendChild(el);',
  '}',
  '',
].join(NL);

// License table, generated so it never drifts from meta.json.
const KIND = { personal: 'Personal use only', commercial: 'Commercial use allowed', proprietary: 'Proprietary, not redistributable' };
const licenses = [
  '# Licenses', '',
  'Generated from `fonts/meta.json` by `scripts/build-manifest.mjs`. Do not edit by hand.',
  'These files are kept for personal comparison only and are not offered for reuse.', '',
  '| Family | Vendor | Kind | Terms |', '| --- | --- | --- | --- |',
  ...families.map(f => `| ${f.name} | ${f.designer || '–'} | ${KIND[f.licenseKind]} | ${f.license}${f.demo ? ' Demo cut.' : ''} |`),
  '',
].join(NL);

fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
fs.writeFileSync(OUT_JSON, JSON.stringify({ generatedAt: new Date().toISOString(), families }, null, 2));
fs.writeFileSync(OUT_JS, js);
fs.writeFileSync(OUT_LICENSES, licenses);
console.log(`${families.length} families, ${allFaces.length} faces -> src/manifest.json, src/fontfaces.js, fonts/LICENSES.md`);
