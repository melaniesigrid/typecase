import { useState } from 'react';
import { families, primaryFace, applyCase, classifications, moods } from '../lib/fonts.js';
import { looksUsingFamily } from '../content/looks.js';
import { href } from '../lib/router.js';
import { Sample, Seg, Range, Badge } from '../components/ui.jsx';

const CLS_LABEL = { all: 'All', sans: 'Sans', serif: 'Serif', script: 'Script', display: 'Display' };

function matches(f, q) {
  if (!q) return true;
  const hay = [f.name, f.designer, f.classification, f.kind, ...f.moods, ...f.tags, ...f.bestFor].join(' ').toLowerCase();
  return q.toLowerCase().split(/\s+/).every(w => hay.includes(w));
}

const MOOD_LIMIT = 14;

export default function Index({ prefs, set }) {
  const { text, size, caps, query, cls, mood } = prefs;
  const [showAll, setShowAll] = useState(false);
  const list = families.filter(f =>
    (cls === 'all' || f.classification === cls) &&
    (!mood || f.moods.includes(mood)) &&
    matches(f, query));
  const cuts = families.reduce((n, f) => n + f.faces.length, 0);

  return (
    <section className="index">
      <header className="hero">
        <p className="eyebrow mono">Library · {families.length} families · {cuts} cuts</p>
        <h1 className="hero-title">
          Every face in the case,<br />set on <em>one</em> line.
        </h1>
        <p className="hero-sub">
          Type below and every row follows. Filter by structure or mood, open a row for the full specimen, or take a few into Compare.
        </p>
      </header>

      <div className="toolbar toolbar-2">
        <div className="toolbar-row">
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
          </div>
        </div>
        <div className="toolbar-row toolbar-filters">
          <input
            className="search-input"
            value={query}
            placeholder="Search names, designers, uses…"
            onChange={e => set('query', e.target.value)}
            spellCheck={false}
            aria-label="Search"
          />
          <Seg value={cls} onChange={v => set('cls', v)} options={classifications.map(c => [c, CLS_LABEL[c] || c])} />
          <div className="moods">
            {(showAll ? moods : moods.slice(0, MOOD_LIMIT)).map(m => (
              <button key={m} type="button" className={`mood ${mood === m ? 'on' : ''}`} onClick={() => set('mood', mood === m ? null : m)}>{m}</button>
            ))}
            {mood && !moods.slice(0, MOOD_LIMIT).includes(mood) && !showAll && (
              <button type="button" className="mood on" onClick={() => set('mood', null)}>{mood}</button>
            )}
            {moods.length > MOOD_LIMIT && (
              <button type="button" className="mood mood-more" onClick={() => setShowAll(s => !s)}>{showAll ? 'fewer' : `+${moods.length - MOOD_LIMIT} more`}</button>
            )}
          </div>
        </div>
      </div>

      {list.length === 0 && <p className="empty">Nothing matches. Clear a filter.</p>}

      <ol className="rows">
        {list.map((f, i) => {
          const face = primaryFace(f);
          const t = applyCase(text.trim() || f.sample || f.name, caps);
          const inLooks = looksUsingFamily(f.id).length;
          return (
            <li key={f.id} className="row" style={{ '--i': i }}>
              <a href={href(`/f/${f.id}`)} className="row-link">
                <span className="row-num mono">{String(i + 1).padStart(2, '0')}</span>
                <Sample face={face} text={t} className="row-sample" style={{ fontSize: size }} />
                <span className="row-meta">
                  <b>{f.name}</b>
                  <span className="mono">{f.designer}</span>
                  <span className="mono muted">{f.faces.length} {f.faces.length === 1 ? 'cut' : 'cuts'} · {f.classification}{f.kind !== 'single' ? ` · ${f.kind}` : ''}{inLooks ? ` · ${inLooks} ${inLooks === 1 ? 'look' : 'looks'}` : ''}</span>
                  <span className="row-moods">{f.moods.slice(0, 3).map(m => <Badge key={m}>{m}</Badge>)}{f.demo && <Badge tone="warn">demo</Badge>}</span>
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
