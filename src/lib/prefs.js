// Small persisted preference store (localStorage), safe when storage is unavailable.
import { useCallback, useEffect, useState } from 'react';

const KEY = 'tc.prefs.v1';
const DEFAULTS = {
  text: '',
  size: 84,
  filter: 'all',
  caps: 'mixed',
  compare: ['maroes/regular', 'kavorie/regular', 'annyra/regular'],
  cmpText: 'Rhythm & Contrast',
  cmpSize: 120,
  cmpTracking: 0,
  cmpLeading: 1.05,
  cmpMode: 'stack',
  playHead: 'kavorie/regular',
  playBody: 'maroes/regular',
  playHeadSize: 88,
  playBodySize: 19,
  playLeading: 1.5,
  playTracking: -0.01,
  playMeasure: 62,
  playAlign: 'left',
  playInvert: false,
};

function load() {
  try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; }
  catch { return { ...DEFAULTS }; }
}

export function usePrefs() {
  const [prefs, setPrefs] = useState(load);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch { /* ignore */ } }, [prefs]);
  const set = useCallback((k, v) => setPrefs(p => ({ ...p, [k]: typeof v === 'function' ? v(p[k]) : v })), []);
  const reset = useCallback(() => setPrefs({ ...DEFAULTS }), []);
  return [prefs, set, reset];
}

export function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'paper');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('tc.theme', theme); } catch { /* ignore */ }
  }, [theme]);
  return [theme, () => setTheme(t => (t === 'dark' ? 'paper' : 'dark'))];
}
