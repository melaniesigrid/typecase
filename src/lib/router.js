// Hash router. Routes: #/  #/f/<family>  #/compare  #/play
import { useEffect, useState } from 'react';

export function parseHash(h = window.location.hash) {
  const s = h.replace(/^#\/?/, '');
  const [path, qs] = s.split('?');
  const parts = path.split('/').filter(Boolean);
  return { view: parts[0] || 'index', id: parts.slice(1).join('/') || null, q: new URLSearchParams(qs || '') };
}

export function useRoute() {
  const [r, set] = useState(parseHash);
  useEffect(() => {
    const on = () => { set(parseHash()); window.scrollTo({ top: 0 }); };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return r;
}

export const href = to => '#' + to;
export const navigate = to => { window.location.hash = to; };
