// A glyph pair drawn to scale with the face's vertical metrics ruled over it.
// Positions come from the manifest (ascent, descent, capHeight, xHeight in font units).
import { ff } from '../lib/fonts.js';

export default function MetricGlyph({ face, text = 'Aa', size = 320 }) {
  const u = face.unitsPerEm;
  const asc = face.ascent / u;
  const desc = -face.descent / u;
  const h = asc + desc;
  const lines = [
    ['ascender', 0, true],
    ['cap height', asc - face.capHeight / u, face.capHeight > 0],
    ['x-height', asc - face.xHeight / u, face.xHeight > 0],
    ['baseline', asc, true],
    ['descender', h, true],
  ].filter(l => l[2]);

  return (
    <div className="metric" style={{ fontSize: size, height: `${h}em` }} aria-label={`${text} with metric lines`}>
      {lines.map(([label, y]) => (
        <div key={label} className={`metric-line ${label === 'baseline' ? 'is-base' : ''}`} style={{ top: `${y}em` }}>
          <span>{label}</span>
        </div>
      ))}
      <div className="metric-glyph" style={{ fontFamily: ff(face), lineHeight: `${h}em` }}>{text}</div>
    </div>
  );
}
