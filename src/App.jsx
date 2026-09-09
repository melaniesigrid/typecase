import { useEffect, useState } from 'react';
import { useRoute, href, navigate } from './lib/router.js';
import { usePrefs, useTheme } from './lib/prefs.js';
import { families, primaryFace, ff, generatedAt } from './lib/fonts.js';
import { site } from './site.js';
import Index from './views/Index.jsx';
import Specimen from './views/Specimen.jsx';
import Compare from './views/Compare.jsx';
import Play from './views/Play.jsx';
import Lookbook from './views/Lookbook.jsx';
import { JournalIndex, Article } from './views/Journal.jsx';

// The wordmark is set in a different library face every few seconds.
function Wordmark() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(n => (n + 1) % families.length), 2600);
    return () => clearInterval(t);
  }, []);
  const face = primaryFace(families[i]);
  return (
    <a href={href('/')} className="wordmark" title={`Set in ${families[i].name}`}>
      <span key={face.id} className="wordmark-text" style={{ fontFamily: ff(face) }}>{site.name}</span>
    </a>
  );
}

const NAV = [
  ['index', '/', 'Library', '1'],
  ['looks', '/looks', 'Lookbook', '2'],
  ['journal', '/journal', 'Journal', '3'],
  ['compare', '/compare', 'Compare', '4'],
  ['play', '/play', 'Play', '5'],
];

export default function App() {
  const route = useRoute();
  const [prefs, set] = usePrefs();
  const [theme, toggleTheme] = useTheme();
  const active = route.view === 'f' ? 'index' : route.view;

  useEffect(() => {
    const on = e => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target.closest('input, textarea, select, [contenteditable]')) return;
      const hit = NAV.find(n => n[3] === e.key);
      if (hit) navigate(hit[1]);
      if (e.key === 't') toggleTheme();
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, [toggleTheme]);

  let view;
  if (route.view === 'f') view = <Specimen key={route.id} id={route.id} prefs={prefs} set={set} />;
  else if (route.view === 'looks') view = <Lookbook prefs={prefs} set={set} />;
  else if (route.view === 'journal' && route.id) view = <Article key={route.id} slug={route.id} />;
  else if (route.view === 'journal') view = <JournalIndex />;
  else if (route.view === 'compare') view = <Compare prefs={prefs} set={set} />;
  else if (route.view === 'play') view = <Play prefs={prefs} set={set} />;
  else view = <Index prefs={prefs} set={set} />;

  return (
    <div className="app">
      <header className="top">
        <div className="top-left">
          <Wordmark />
          <a className="owner mono" href={site.ownerUrl}>← {site.ownerLabel}</a>
        </div>
        <nav className="nav">
          {NAV.map(([k, to, label, key]) => (
            <a key={k} href={href(to)} className={active === k ? 'on' : ''}>
              {label}<kbd>{key}</kbd>
            </a>
          ))}
        </nav>
        <div className="top-right">
          <span className="mono muted count">{prefs.compare.length} in compare</span>
          <button type="button" className="theme" onClick={toggleTheme} aria-label="Toggle theme" title="Toggle theme (t)">
            <i /> {theme === 'dark' ? 'Ink' : 'Paper'}
          </button>
        </div>
      </header>

      <main key={route.view + (route.id || '')} className="view">{view}</main>

      <footer className="foot mono">
        <span>{site.name} · {site.tagline}</span>
        <span>Manifest built {new Date(generatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · <a href={site.repo}>source</a></span>
        <span><a href={site.ownerUrl}>{site.owner}</a></span>
      </footer>
    </div>
  );
}
