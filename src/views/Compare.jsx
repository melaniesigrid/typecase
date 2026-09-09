import { families, byFace, ff, ratio, fmtBytes } from '../lib/fonts.js';
import { href } from '../lib/router.js';
import { Sample, Seg, Range, Field } from '../components/ui.jsx';

const MAX = 4;
const COLORS = ['var(--overlay-a)', 'var(--overlay-b)', 'var(--overlay-c)', 'var(--overlay-d)'];

export default function Compare({ prefs, set }) {
  const picked = prefs.compare.map(id => byFace[id]).filter(Boolean);
  const { cmpText, cmpSize, cmpTracking, cmpLeading, cmpMode } = prefs;

  function toggle(id) {
    set('compare', list => (list.includes(id) ? list.filter(x => x !== id) : [...list.slice(-(MAX - 1)), id]));
  }

  const style = { fontSize: cmpSize, letterSpacing: `${cmpTracking}em`, lineHeight: cmpLeading };

  return (
    <section className="compare">
      <header className="page-head">
        <p className="eyebrow mono">Compare · up to {MAX} cuts</p>
        <h1 className="page-title">Same words, <em>different</em> voices.</h1>
      </header>

      <div className="picker">
        {families.map(f => (
          <div key={f.id} className="picker-fam">
            <span className="picker-name mono">{f.name}</span>
            <div className="picker-faces">
              {f.faces.map(x => {
                const i = prefs.compare.indexOf(x.id);
                return (
                  <button key={x.id} type="button" className={`chip ${i > -1 ? 'on' : ''}`}
                    style={i > -1 ? { '--chip': COLORS[i] } : undefined}
                    onClick={() => toggle(x.id)}>
                    <span style={{ fontFamily: ff(x) }}>Aa</span> {x.style}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="toolbar">
        <input className="text-input" value={cmpText} onChange={e => set('cmpText', e.target.value)} spellCheck={false} aria-label="Compare text" />
        <div className="toolbar-controls">
          <Seg value={cmpMode} onChange={v => set('cmpMode', v)} options={[['stack', 'Stack'], ['overlay', 'Overlay'], ['grid', 'Metrics']]} />
          <Field label="Size"><Range value={cmpSize} onChange={v => set('cmpSize', v)} min={24} max={240} step={2} unit="px" /></Field>
          <Field label="Tracking"><Range value={cmpTracking} onChange={v => set('cmpTracking', v)} min={-0.1} max={0.4} step={0.005} unit="em" /></Field>
          <Field label="Leading"><Range value={cmpLeading} onChange={v => set('cmpLeading', v)} min={0.8} max={2} step={0.05} /></Field>
        </div>
      </div>

      {picked.length === 0 && <p className="empty">Pick a cut above to begin.</p>}

      {cmpMode === 'stack' && (
        <div className="stack">
          {picked.map((x, i) => (
            <div key={x.id} className="stack-row" style={{ '--i': i }}>
              <a className="stack-label" href={href(`/f/${x.family.id}`)}>
                <i style={{ background: COLORS[i] }} />
                <b>{x.family.name}</b> <span className="mono muted">{x.style}</span>
              </a>
              <Sample face={x} text={cmpText || x.family.sample} style={style} />
            </div>
          ))}
        </div>
      )}

      {cmpMode === 'overlay' && (
        <div className="overlay" style={{ ...style }}>
          <div className="overlay-legend mono">
            {picked.map((x, i) => <span key={x.id}><i style={{ background: COLORS[i] }} />{x.family.name} {x.style}</span>)}
          </div>
          <div className="overlay-stage">
            {picked.map((x, i) => (
              <Sample key={x.id} face={x} text={cmpText || x.family.sample} className="overlay-layer" style={{ color: COLORS[i] }} />
            ))}
            {picked.length > 0 && <Sample face={picked[0]} text={cmpText || picked[0].family.sample} className="overlay-ghost" aria-hidden />}
          </div>
          <p className="hint">Layers multiply, so shared strokes go dark and differences keep their colour.</p>
        </div>
      )}

      {cmpMode === 'grid' && picked.length > 0 && (
        <div className="metrics-grid" style={{ '--n': picked.length }}>
          <div className="mg-head mono">
            <span />
            {picked.map((x, i) => <span key={x.id}><i style={{ background: COLORS[i] }} />{x.family.name} {x.style}</span>)}
          </div>
          {[
            ['Glyph', x => <span style={{ fontFamily: ff(x), fontSize: 64, lineHeight: 1 }}>Rag</span>],
            ['x-height / em', x => ratio(x.xHeight, x.unitsPerEm)],
            ['cap height / em', x => ratio(x.capHeight, x.unitsPerEm)],
            ['x / cap', x => ratio(x.xHeight, x.capHeight)],
            ['ascent / descent', x => `${x.ascent} / ${x.descent}`],
            ['glyphs', x => x.glyphs],
            ['characters', x => x.characters],
            ['features', x => x.features.join(' ') || '–'],
            ['file', x => `${x.format} · ${fmtBytes(x.bytes)}`],
            ['license', x => x.family.license],
          ].map(([label, fn]) => (
            <div key={label} className="mg-row">
              <span className="mg-label mono">{label}</span>
              {picked.map(x => <span key={x.id} className="mg-cell mono">{fn(x)}</span>)}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
