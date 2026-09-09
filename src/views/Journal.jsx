import { articles, bySlug } from '../content/articles.js';
import { byLook } from '../content/looks.js';
import { byFace, ff } from '../lib/fonts.js';
import { href } from '../lib/router.js';
import { Sample } from '../components/ui.jsx';
import Look from '../components/Look.jsx';
import { site } from '../site.js';

const fmtDate = d => new Date(`${d}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

export function JournalIndex() {
  return (
    <section className="journal">
      <header className="page-head">
        <p className="eyebrow mono">Journal · {articles.length} articles</p>
        <h1 className="page-title">Notes on <em>pairing.</em></h1>
        <p className="hero-sub">Short pieces on why two faces work together, with the evidence set live in the faces themselves.</p>
      </header>
      <ol className="article-list">
        {articles.map((a, i) => {
          const face = byFace[a.face];
          return (
            <li key={a.slug} className="article-row" style={{ '--i': i }}>
              <a href={href(`/journal/${a.slug}`)}>
                <span className="mono muted">{String(i + 1).padStart(2, '0')} · {fmtDate(a.date)}</span>
                <Sample face={face} text={a.title} as="h2" className="article-row-title" />
                <p>{a.deck}</p>
                <span className="article-faces mono">{a.faces.map(id => byFace[id]?.family.name).filter((v, j, arr) => arr.indexOf(v) === j).join(' · ')}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Block({ b }) {
  if (b.t === 'p') return <p className="art-p">{b.text}</p>;
  if (b.t === 'h') return <h2 className="art-h">{b.text}</h2>;
  if (b.t === 'pull') return <blockquote className="art-pull">{b.text}</blockquote>;
  if (b.t === 'rule') return (
    <div className="art-rule">
      <span className="mono">{b.n}</span>
      <div><h3>{b.title}</h3><p>{b.text}</p></div>
    </div>
  );
  if (b.t === 'look') {
    const look = byLook[b.id];
    return look ? <figure className="art-look"><Look look={look} size="wide" interactive={false} /><figcaption className="mono muted">{look.title} · {look.mood}</figcaption></figure> : null;
  }
  if (b.t === 'specimen') {
    const face = byFace[b.face];
    return face ? (
      <figure className="art-spec">
        <Sample face={face} text={b.text} style={{ fontSize: b.size || 48 }} />
        <figcaption className="mono muted"><a href={href(`/f/${face.family.id}`)}>{face.family.name} {face.style}</a> · {b.size || 48}px</figcaption>
      </figure>
    ) : null;
  }
  return null;
}

export function Article({ slug }) {
  const a = bySlug[slug];
  if (!a) return <section className="notfound"><h1>No such article.</h1><a href={href('/journal')}>Back to the journal</a></section>;
  const face = byFace[a.face];
  return (
    <article className="article">
      <nav className="crumbs mono"><a href={href('/journal')}>Journal</a><span>/</span><span>{a.title}</span></nav>
      <header className="art-head">
        <p className="eyebrow mono">{fmtDate(a.date)} · {a.author}</p>
        <h1 className="art-title" style={{ fontFamily: ff(face) }}>{a.title}</h1>
        <p className="art-deck">{a.deck}</p>
      </header>
      <div className="art-body">
        {a.blocks.map((b, i) => <Block key={i} b={b} />)}
      </div>
      <footer className="art-foot">
        <p className="mono muted">Faces in this piece</p>
        <ul className="art-facelist">
          {a.faces.map(id => { const f = byFace[id]; return f ? <li key={id}><a href={href(`/f/${f.family.id}`)} style={{ fontFamily: ff(f) }}>{f.family.name} {f.style}</a></li> : null; })}
        </ul>
        <p className="mono muted">Written by <a href={site.ownerUrl}>{a.author}</a> for {site.name}.</p>
      </footer>
    </article>
  );
}
