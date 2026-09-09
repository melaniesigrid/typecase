import { useState } from 'react';
import { faces, byFace, ff } from '../lib/fonts.js';
import { Seg, Range, Field } from '../components/ui.jsx';

const PRESETS = {
  editorial: { playHeadSize: 88, playBodySize: 19, playLeading: 1.5, playTracking: -0.01, playMeasure: 62, playAlign: 'left' },
  poster: { playHeadSize: 160, playBodySize: 22, playLeading: 1.3, playTracking: -0.03, playMeasure: 80, playAlign: 'center' },
  wordmark: { playHeadSize: 200, playBodySize: 16, playLeading: 1.4, playTracking: 0.12, playMeasure: 100, playAlign: 'center' },
};

function cssFor(head, body) {
  const face = x => `@font-face {\n  font-family: "${x.family.name} ${x.style}";\n  src: url("${x.file}") format("${{ ttf: 'truetype', otf: 'opentype', woff: 'woff', woff2: 'woff2' }[x.format]}");\n  font-display: swap;\n}`;
  return [
    face(head), head.id !== body.id ? face(body) : null,
    `h1 { font-family: "${head.family.name} ${head.style}", serif; }`,
    `body { font-family: "${body.family.name} ${body.style}", serif; }`,
  ].filter(Boolean).join('\n\n');
}

function FaceSelect({ value, onChange }) {
  return (
    <select className="select" value={value} onChange={e => onChange(e.target.value)}>
      {faces.map(x => <option key={x.id} value={x.id}>{x.family.name} · {x.style}</option>)}
    </select>
  );
}

export default function Play({ prefs, set }) {
  const head = byFace[prefs.playHead] || faces[0];
  const body = byFace[prefs.playBody] || faces[0];
  const [copied, setCopied] = useState(false);
  const { playHeadSize, playBodySize, playLeading, playTracking, playMeasure, playAlign, playInvert } = prefs;

  function preset(name) { for (const [k, v] of Object.entries(PRESETS[name])) set(k, v); }
  async function copy() {
    try { await navigator.clipboard.writeText(cssFor(head, body)); setCopied(true); setTimeout(() => setCopied(false), 1600); }
    catch { /* clipboard blocked */ }
  }

  return (
    <section className="play">
      <header className="page-head">
        <p className="eyebrow mono">Playground · pair a headline with a body</p>
        <h1 className="page-title">Try it <em>on the page.</em></h1>
      </header>

      <div className="play-layout">
        <aside className="panel">
          <Field label="Preset">
            <Seg value={null} onChange={preset} options={[['editorial', 'Editorial'], ['poster', 'Poster'], ['wordmark', 'Wordmark']]} />
          </Field>
          <Field label="Headline"><FaceSelect value={head.id} onChange={v => set('playHead', v)} /></Field>
          <Field label="Body"><FaceSelect value={body.id} onChange={v => set('playBody', v)} /></Field>
          <Field label="Headline size"><Range value={playHeadSize} onChange={v => set('playHeadSize', v)} min={32} max={240} step={2} unit="px" /></Field>
          <Field label="Headline tracking"><Range value={playTracking} onChange={v => set('playTracking', v)} min={-0.08} max={0.3} step={0.005} unit="em" /></Field>
          <Field label="Body size"><Range value={playBodySize} onChange={v => set('playBodySize', v)} min={12} max={32} step={1} unit="px" /></Field>
          <Field label="Body leading"><Range value={playLeading} onChange={v => set('playLeading', v)} min={1} max={2.2} step={0.05} /></Field>
          <Field label="Measure"><Range value={playMeasure} onChange={v => set('playMeasure', v)} min={30} max={100} step={1} unit="ch" /></Field>
          <Field label="Align"><Seg value={playAlign} onChange={v => set('playAlign', v)} options={[['left', 'Left'], ['center', 'Centre'], ['right', 'Right']]} /></Field>
          <Field label="Ground"><Seg value={playInvert ? 'ink' : 'paper'} onChange={v => set('playInvert', v === 'ink')} options={[['paper', 'Paper'], ['ink', 'Ink']]} /></Field>
          <button type="button" className="btn" onClick={copy}>{copied ? 'Copied CSS' : 'Copy CSS'}</button>
          <p className="hint">Everything on the page is editable. Click into it and type.</p>
        </aside>

        <article className={`page ${playInvert ? 'page-ink' : ''}`} style={{ '--measure': `${playMeasure}ch`, textAlign: playAlign }}>
          <p className="page-kicker mono" contentEditable suppressContentEditableWarning>Issue nº 4 · The Type Pages</p>
          <h2 className="page-h" contentEditable suppressContentEditableWarning
            style={{ fontFamily: ff(head), fontSize: playHeadSize, letterSpacing: `${playTracking}em` }}>
            Letters are shapes before they are sounds
          </h2>
          <p className="page-deck" contentEditable suppressContentEditableWarning
            style={{ fontFamily: ff(body), fontSize: playBodySize * 1.25, lineHeight: playLeading * 0.9 }}>
            On choosing a face for the way it holds a line, not for the way it looks on a chart.
          </p>
          <div className="page-body" style={{ fontFamily: ff(body), fontSize: playBodySize, lineHeight: playLeading }} contentEditable suppressContentEditableWarning>
            <p>A typeface earns its place on the page in the second paragraph, long after the headline has done its job. Watch the rhythm of the stems, the way round letters lean against straight ones, and whether the word spaces read as pauses or holes.</p>
            <p>Set a paragraph at the size you will actually use. Then read it aloud. If your eye trips, adjust the leading before you blame the face. Most pairings fail on measure and leading, not on character.</p>
          </div>
          <p className="page-foot mono">{head.family.name} {head.style} + {body.family.name} {body.style}</p>
        </article>
      </div>
    </section>
  );
}
