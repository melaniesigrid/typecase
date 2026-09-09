// CSS snippets a project can paste. Font paths are the repo-relative files.
const FORMAT = { ttf: 'truetype', otf: 'opentype', woff: 'woff', woff2: 'woff2' };
const familyName = x => `${x.family.name}${x.style !== 'Regular' ? ' ' + x.style : ''}`;
const fallback = x => (x.family.classification === 'sans' ? 'sans-serif' : x.family.classification === 'script' ? 'cursive' : 'serif');

export function fontFace(x) {
  return `@font-face {\n  font-family: "${familyName(x)}";\n  src: url("${x.file}") format("${FORMAT[x.format]}");\n  font-weight: ${x.weight};\n  font-style: ${x.italic ? 'italic' : 'normal'};\n  font-display: swap;\n}`;
}

// roles: { display, accent?, body } -> faces
export function cssForRoles(roles, palette) {
  const faces = [...new Map(Object.values(roles).filter(Boolean).map(x => [x.id, x])).values()];
  const vars = Object.entries(roles).filter(([, x]) => x).map(([role, x]) => `  --font-${role}: "${familyName(x)}", ${fallback(x)};`);
  const colors = palette ? Object.entries(palette).map(([k, v]) => `  --color-${k}: ${v};`) : [];
  return [
    ...faces.map(fontFace),
    `:root {\n${[...vars, ...colors].join('\n')}\n}`,
    roles.display ? 'h1, h2 { font-family: var(--font-display); }' : null,
    roles.body ? 'body { font-family: var(--font-body); }' : null,
  ].filter(Boolean).join('\n\n');
}
