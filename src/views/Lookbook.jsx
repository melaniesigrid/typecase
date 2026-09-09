import { useState } from 'react';
import { looks } from '../content/looks.js';
import { byFace } from '../lib/fonts.js';
import { href, navigate } from '../lib/router.js';
import Look from '../components/Look.jsx';
import SetPreview from '../components/SetPreview.jsx';
import { families } from '../lib/fonts.js';

const ROLE_LABEL = { display: 'Display', accent: 'Accent', body: 'Body' };
const sets = families.filter(f => f.kind === 'duo' || f.kind === 'trio');

export default function Lookbook({ prefs, set }) {
  const [openId, setOpenId] = useState(null);
  const open = looks.find(l => l.id === openId);

  function toPlay(look) {
    set('playHead', look.faces.display);
    set('playBody', look.faces.body);
    navigate('/play');
  }
  function toCompare(look) {
    set('compare', [...new Set(Object.values(look.faces))].slice(0, 4));
    navigate('/compare');
  }

  return (
    <section className="lookbook">
      <header className="page-head">
        <p className="eyebrow mono">Lookbook · {looks.length} pairings</p>
        <h1 className="page-title">Faces that <em>belong</em> together.</h1>
        <p className="hero-sub">Every look is a real pairing from the library, composed in its own palette. Open one to see the faces, the reasoning, and try it on a page.</p>
      </header>

      {open && (
        <div className="look-detail" key={open.id}>
          <Look look={open} size="hero" interactive={false} />
          <div className="look-side">
            <p className="eyebrow mono">{open.mood}</p>
            <h2 className="look-title">{open.title}</h2>
            <p className="look-notes">{open.notes}</p>
            <ul className="look-faces">
              {Object.entries(open.faces).map(([role, id]) => {
                const f = byFace[id];
                return (
                  <li key={role}>
                    <span className="mono muted">{ROLE_LABEL[role]}</span>
                    <a href={href(`/f/${f.family.id}`)} style={{ fontFamily: `"${f.cssFamily}"` }}>{f.family.name} {f.style !== 'Regular' ? f.style : ''}</a>
                  </li>
                );
              })}
            </ul>
            <div className="spec-actions">
              <button type="button" className="btn" onClick={() => toPlay(open)}>Try on a page</button>
              <button type="button" className="btn btn-ghost" onClick={() => toCompare(open)}>Compare the faces</button>
              <button type="button" className="btn btn-ghost" onClick={() => setOpenId(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <h2 className="sec-title"><span className="mono">01</span> Sets <em className="mono muted">duos and trios that ship together</em></h2>
      <div className="sets-grid">
        {sets.map(fam => (
          <a key={fam.id} href={href(`/f/${fam.id}`)} className="set-cell">
            <SetPreview fam={fam} text={prefs.text} size="half" />
            <p className="look-caption"><b>{fam.name}</b> <span className="mono muted">{fam.kind} · {fam.faces.map(f => f.style).join(' + ')}</span></p>
          </a>
        ))}
      </div>

      <h2 className="sec-title"><span className="mono">02</span> Pairings <em className="mono muted">{looks.length} looks</em></h2>
      <div className="look-grid">
        {looks.map((l, i) => (
          <div key={l.id} className={`look-cell ${i % 5 === 0 ? 'wide' : ''}`} style={{ '--i': i }}>
            <Look look={l} size={i % 5 === 0 ? 'wide' : 'half'} onOpen={lk => { setOpenId(lk.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
            <p className="look-caption"><b>{l.title}</b> <span className="mono muted">{l.mood}</span></p>
          </div>
        ))}
      </div>
    </section>
  );
}
