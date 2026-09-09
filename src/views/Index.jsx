import { useMemo, useState } from 'react';
import { families, primaryFace, applyCase, facets, collectionsOf, LICENSE_LABEL, COLLECTION_LABEL } from '../lib/fonts.js';
import { looksUsingFamily } from '../content/looks.js';
import { href } from '../lib/router.js';
import { Sample, Seg, Range, Badge } from '../components/ui.jsx';

const COLLECTION_ORDER = ['picks', 'favs', 'family', 'looks', 'demo'];

function matches(f, q) {
  if (!q) return true;
  const hay = [f.name, f.designer, f.classification, f.kind, ...f.categories, ...f.tags, ...f.bestFor].join(' ').toLowerCase();
  return q.toLowerCase().split(/\s+/).every(w => hay.includes(w));
}

function FacetGroup({ title, options, selected, onToggle, labels, max = 12 }) {
  const [open, setOpen] = useState(false);
  const shown = open ? options : options.slice(0, max);
  return (
    <div className="facet">
      <h3 className="facet-title mono">{title}</h3>
      <ul className="facet-list">
        {shown.map(([v, n]) => (
          <li key={v}>
            <button type="button" className={`facet-opt ${selected.includes(v) ? 'on' : ''}`} onClick={() => onToggle(v)} aria-pressed={selected.includes(v)}>
              <i /><span>{labels?.[v] || v}</span><b className="mono">{n}</b>
            </button>
          </li>
        ))}
      </ul>
      {options.length > max && (
        <button type="button" className="facet-more mono" onClick={() => setOpen(o => !o)}>{open ? 'Fewer' : `+${options.length - max} more`}</button>
      )}
    </div>
  );
}

export default function Index({ prefs, set }) {
  const { text, size, caps, query, facets: sel, orderBy, sortDir, favs } = prefs;
  const [railOpen, setRailOpen] = useState(false);

  const toggle = (group, v) => set('facets', f => ({ ...f, [group]: f[group].includes(v) ? f[group].filter(x => x !== v) : [...f[group], v] }));
  const clear = () => { set('facets', { categories: [], tags: [], collections: [], formats: [], license: [] }); set('query', ''); };
  const toggleFav = (e, id) => { e.preventDefault(); set('favs', l => (l.includes(id) ? l.filter(x => x !== id) : [...l, id])); };
  const active = Object.values(sel).reduce((n, a) => n + a.length, 0) + (query ? 1 : 0);

  const enriched = useMemo(() => families.map(f => {
    const inLooks = looksUsingFamily(f.id).length;
    return { f, inLooks, collections: collectionsOf(f, favs, inLooks > 0) };
  }), [favs]);

  const collectionOptions = COLLECTION_ORDER
    .map(c => [c, enriched.filter(e => e.collections.includes(c)).length])
    .filter(([, n]) => n > 0);

  const list = enriched
    .filter(({ f, collections }) =>
      sel.categories.every(c => f.categories.includes(c)) &&
      sel.tags.every(t => f.tags.includes(t)) &&
      sel.collections.every(c => collections.includes(c)) &&
      (sel.formats.length === 0 || sel.formats.some(x => f.formats.includes(x))) &&
      (sel.license.length === 0 || sel.license.includes(f.licenseKind)) &&
      matches(f, query))
    .sort((a, b) => {
      const k = orderBy === 'title' ? a.f.name.localeCompare(b.f.name) : a.f.added.localeCompare(b.f.added) || a.f.name.localeCompare(b.f.name);
      return sortDir === 'asc' ? k : -k;
    });
  const cuts = families.reduce((n, f) => n + f.faces.length, 0);

  return (
    <section className="index">
      <header className="hero">
        <p className="eyebrow mono">Library · {families.length} families · {cuts} cuts</p>
        <h1 className="hero-title">
          Every face in the case,<br />set on <em>one</em> line.
        </h1>
        <p className="hero-sub">
          Type below and every row follows. Narrow the case by category, tag, collection, format or license.
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
          <button type="button" className="btn btn-ghost rail-toggle" onClick={() => setRailOpen(o => !o)}>Filters{active ? ` · ${active}` : ''}</button>
        </div>
      </div>

      <div className="library">
        <aside className={`rail ${railOpen ? 'open' : ''}`}>
          <div className="rail-head">
            <input
              className="search-input"
              value={query}
              placeholder="Search…"
              onChange={e => set('query', e.target.value)}
              spellCheck={false}
              aria-label="Search"
            />
            {active > 0 && <button type="button" className="facet-more mono" onClick={clear}>Clear {active}</button>}
          </div>
          <div className="facet">
            <h3 className="facet-title mono">Order by</h3>
            <div className="facet-row">
              <Seg value={orderBy} onChange={v => set('orderBy', v)} options={[['date', 'Date'], ['title', 'Title']]} />
              <Seg value={sortDir} onChange={v => set('sortDir', v)} options={orderBy === 'title' ? [['asc', 'A–Z'], ['desc', 'Z–A']] : [['desc', 'Newest'], ['asc', 'Oldest']]} />
            </div>
          </div>
          <FacetGroup title="Categories" options={facets.categories} selected={sel.categories} onToggle={v => toggle('categories', v)} />
          <FacetGroup title="Collections" options={collectionOptions} selected={sel.collections} onToggle={v => toggle('collections', v)} labels={COLLECTION_LABEL} />
          <FacetGroup title="Tags" options={facets.tags} selected={sel.tags} onToggle={v => toggle('tags', v)} max={14} />
          <FacetGroup title="Formats" options={facets.formats} selected={sel.formats} onToggle={v => toggle('formats', v)} labels={{ otf: 'OTF', ttf: 'TTF', woff: 'WOFF', woff2: 'WOFF2', eot: 'EOT' }} />
          <FacetGroup title="License" options={facets.license} selected={sel.license} onToggle={v => toggle('license', v)} labels={LICENSE_LABEL} />
        </aside>

        <div className="results">
          <p className="results-count mono muted">{list.length} of {families.length} families{active ? ' match' : ''}</p>
          {list.length === 0 && <p className="empty">Nothing matches. Clear a filter.</p>}
          <ol className="rows">
            {list.map(({ f, inLooks }, i) => {
              const face = primaryFace(f);
              const t = applyCase(text.trim() || f.sample || f.name, caps);
              const fav = favs.includes(f.id);
              return (
                <li key={f.id} className="row" style={{ '--i': Math.min(i, 12) }}>
                  <a href={href(`/f/${f.id}`)} className="row-link">
                    <span className="row-num mono">{String(i + 1).padStart(2, '0')}</span>
                    <Sample face={face} text={t} className="row-sample" style={{ fontSize: size }} />
                    <span className="row-meta">
                      <b>{f.name}{f.staffPick && <span className="pick" title="Staff pick">★</span>}</b>
                      <span className="mono">{f.designer}</span>
                      <span className="mono muted">{f.faces.length} {f.faces.length === 1 ? 'cut' : 'cuts'} · {f.categories[0]}{f.kind !== 'single' ? ` · ${f.kind}` : ''}{inLooks ? ` · ${inLooks} ${inLooks === 1 ? 'look' : 'looks'}` : ''}</span>
                      <span className="row-moods">{f.tags.slice(0, 3).map(m => <Badge key={m}>{m}</Badge>)}{f.demo && <Badge tone="warn">demo</Badge>}</span>
                    </span>
                    <button type="button" className={`fav ${fav ? 'on' : ''}`} onClick={e => toggleFav(e, f.id)} aria-label={fav ? 'Remove from favourites' : 'Add to favourites'} title="Favourite">{fav ? '♥' : '♡'}</button>
                  </a>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
