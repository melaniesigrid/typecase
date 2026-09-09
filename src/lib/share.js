// Shareable state in the hash: #/play?playHead=...&playBodySize=19
// On mount, any listed pref present in the query is applied. `link()` builds the URL back.
import { useEffect, useState } from 'react';

const parse = (v, sample) => {
  if (Array.isArray(sample)) return v.split(',').filter(Boolean);
  if (typeof sample === 'number') return Number(v);
  if (typeof sample === 'boolean') return v === '1' || v === 'true';
  return v;
};

export function useShareable(view, keys, prefs, set) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const q = new URLSearchParams((window.location.hash.split('?')[1]) || '');
    let touched = false;
    for (const k of keys) if (q.has(k)) { set(k, parse(q.get(k), prefs[k])); touched = true; }
    if (touched) window.history.replaceState(null, '', `#/${view}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const link = () => {
    const q = new URLSearchParams();
    for (const k of keys) {
      const v = prefs[k];
      q.set(k, Array.isArray(v) ? v.join(',') : typeof v === 'boolean' ? (v ? '1' : '0') : String(v));
    }
    return `${window.location.origin}${window.location.pathname}#/${view}?${q.toString()}`;
  };
  const share = async () => {
    try { await navigator.clipboard.writeText(link()); setCopied(true); setTimeout(() => setCopied(false), 1600); }
    catch { /* clipboard blocked */ }
  };
  return { share, copied, link };
}
