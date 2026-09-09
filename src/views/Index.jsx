import { families, primaryFace, applyCase, categories } from '../lib/fonts.js';
import { href } from '../lib/router.js';
import { Sample, Seg, Range, Badge } from '../components/ui.jsx';

const CATEGORY_LABEL = { all: 'All', sans: 'Sans', serif: 'Serif', script: 'Script', display: 'Display', duo: 'Duos', trio: 'Trios' };

export default function Index({ prefs, set }) {
  const { text, size, filter, caps } = prefs;
  const list = families.filter(f => filter === 'all' || f.category === filter);
  const cuts = families.reduce((n, f) => n + f.faces.length, 0);

  return (
    <section className="index">
      <header className="hero">
        <p className="eyebrow mono">Specimen index · {families.length} families · {cuts} cuts</p>
        <h1 className="hero-title">
          Every face in the case,<br />set on <em>one</em> line.
        </h1>
        <p className="hero-sub">
          Type below and every row follows. Open a row for the full specimen, or take a few into Compare.
        </p>
      </header>

      <div className="toolbar">
        <input
          className="text-input"
          value={text}
          placeholder="Type to set every row…"
          onChange={e => set('text', e.target.value)}
          spellCheck={false}
          aria-label="Sample text"
        />
        <div className="toolbar-controls">
          <Seg value={caps} onChange={v => set('caps', v)} options={[['mixed', 'Aa'], ['upper', 'AA'], ['lower', 'aa']]} />
          <Range value={size} onChange={v => set('size', v)} min={32} max={200} step={2} unit="px" />
          <Seg value={filter} onChange={v => set('filter', v)} options={categories.map(c => [c, CATEGORY_LABEL[c] || c])} />
        </div>
      </div>

      <ol className="rows">
        {list.map((f, i) => {
          const face = primaryFace(f);
          const t = applyCase(text.trim() || f.sample || f.name, caps);
          return (
            <li key={f.id} className="row" style={{ '--i': i }}>
              <a href={href(`/f/${f.id}`)} className="row-link">
                <span className="row-num mono">{String(i + 1).padStart(2, '0')}</span>
                <Sample face={face} text={t} className="row-sample" style={{ fontSize: size }} />
                <span className="row-meta">
                  <b>{f.name}</b>
                  <span className="mono">{f.designer}</span>
                  <span className="mono muted">{f.faces.length} {f.faces.length === 1 ? 'cut' : 'cuts'} · {f.category}</span>
                  {f.demo && <Badge tone="warn">demo</Badge>}
                </span>
                <span className="row-arrow" aria-hidden>→</span>
              </a>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
