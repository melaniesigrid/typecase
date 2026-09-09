import { useState } from 'react';
import { byFamily, primaryFace, ff, fmtBytes, pct, ratio, FEATURE_NAMES, PANGRAMS } from '../lib/fonts.js';
import { href, navigate } from '../lib/router.js';
import { Sample, Seg, Badge, Kv } from '../components/ui.jsx';
import MetricGlyph from '../components/MetricGlyph.jsx';

const WATERFALL = [120, 96, 72, 56, 44, 32, 24, 18, 14];

export default function Specimen({ id, prefs, set }) {
  const fam = byFamily[id];
  const [faceId, setFaceId] = useState(fam?.primary);
  const [featOn, setFeatOn] = useState({});
  const [glyphPair, setGlyphPair] = useState('Aa');
  if (!fam) return <section className="notfound"><h1>No such family.</h1><a href={href('/')}>Back to the index</a></section>;

  const face = fam.faces.find(x => x.id === faceId) || primaryFace(fam);
  const sample = prefs.text.trim() || fam.sample || PANGRAMS[0];
  const inCompare = prefs.compare.includes(face.id);
  const chars = [...face.latin].filter(c => c !== ' ');
  const fontFeatureSettings = Object.entries(featOn).filter(([, v]) => v).map(([k]) => `"${k}" 1`).join(', ') || 'normal';

  function toggleCompare() {
    set('compare', list => (inCompare ? list.filter(x => x !== face.id) : [...list.slice(-3), face.id]));
  }

  return (
    <section className="specimen">
      <nav className="crumbs mono"><a href={href('/')}>Index</a><span>/</span><span>{fam.name}</span></nav>

      <header className="spec-head">
        <Sample face={face} text={fam.name} as="h1" className="spec-title" />
        <div className="spec-intro">
          <p className="spec-desc">{fam.description}</p>
          <div className="spec-tags">
            {fam.demo && <Badge tone="warn">demo cut</Badge>}
            <Badge>{fam.category}</Badge>
            {fam.tags.map(t => <Badge key={t}>{t}</Badge>)}
          </div>
          <div className="spec-actions">
            <button type="button" className={`btn ${inCompare ? 'btn-on' : ''}`} onClick={toggleCompare}>
              {inCompare ? '✓ In compare' : '+ Compare'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => { set('playHead', face.id); navigate('/play'); }}>
              Use as headline
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => { set('playBody', face.id); navigate('/play'); }}>
              Use as body
            </button>
          </div>
        </div>
      </header>

      {fam.faces.length > 1 && (
        <div className="cuts">
          {fam.faces.map(x => (
            <button key={x.id} type="button" className={`cut ${x.id === face.id ? 'on' : ''}`} onClick={() => setFaceId(x.id)}>
              <span className="cut-sample" style={{ fontFamily: ff(x) }}>Ag</span>
              <span className="cut-name">{x.style}</span>
              <span className="cut-w mono">{x.weight}{x.italic ? ' i' : ''}</span>
            </button>
          ))}
        </div>
      )}

      <div className="spec-hero">
        <MetricGlyph face={face} text={glyphPair} size={Math.min(360, window.innerWidth * 0.32)} />
        <div className="spec-hero-side">
          <Seg value={glyphPair} onChange={setGlyphPair} options={['Aa', 'Rg', 'Qy', 'Sf']} />
          <dl className="kvs">
            <Kv k="x-height / em" v={ratio(face.xHeight, face.unitsPerEm)} />
            <Kv k="cap height / em" v={ratio(face.capHeight, face.unitsPerEm)} />
            <Kv k="x / cap" v={ratio(face.xHeight, face.capHeight)} />
            <Kv k="ascent · descent" v={`${face.ascent} · ${face.descent}`} />
            <Kv k="units per em" v={face.unitsPerEm} />
          </dl>
        </div>
      </div>

      <h2 className="sec-title"><span className="mono">01</span> Waterfall</h2>
      <div className="waterfall">
        {WATERFALL.map(s => (
          <div key={s} className="wf-row">
            <span className="wf-size mono">{s}</span>
            <Sample face={face} text={sample} style={{ fontSize: s }} />
          </div>
        ))}
      </div>

      <h2 className="sec-title"><span className="mono">02</span> Character set <em className="mono muted">{face.characters} characters · {face.glyphs} glyphs</em></h2>
      <div className="coverage mono">
        {Object.entries(face.coverage).map(([k, v]) => (
          <span key={k} className={`cov ${v === 1 ? 'full' : v === 0 ? 'none' : 'part'}`}>{k} {pct(v)}</span>
        ))}
      </div>
      <div className="charset" style={{ fontFamily: ff(face) }}>
        {chars.map(c => <span key={c} className="char" title={`U+${c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`}>{c}</span>)}
      </div>

      {face.features.length > 0 && (
        <>
          <h2 className="sec-title"><span className="mono">03</span> OpenType features</h2>
          <div className="features">
            {face.features.map(f => (
              <button key={f} type="button" className={`chip ${featOn[f] ? 'on' : ''}`}
                onClick={() => setFeatOn(o => ({ ...o, [f]: !o[f] }))}>
                <span className="mono">{f}</span> {FEATURE_NAMES[f] || ''}
              </button>
            ))}
          </div>
          <Sample face={face} text={`${sample} — Office coffee, 1st fl. ½ off`} className="feat-line" style={{ fontFeatureSettings }} />
        </>
      )}

      <h2 className="sec-title"><span className="mono">{face.features.length ? '04' : '03'}</span> Details</h2>
      <dl className="kvs kvs-wide">
        <Kv k="file" v={face.file} />
        <Kv k="format" v={`${face.format} · ${fmtBytes(face.bytes)}`} />
        <Kv k="postscript" v={face.postscriptName} />
        <Kv k="version" v={face.version || '–'} />
        <Kv k="designer" v={fam.designer || '–'} mono={false} />
        <Kv k="license" v={fam.license} mono={false} />
        {fam.source && <Kv k="source" v={<a href={fam.source} target="_blank" rel="noreferrer">{fam.source}</a>} />}
        {face.copyright && <Kv k="copyright" v={face.copyright} mono={false} />}
      </dl>
    </section>
  );
}
