# Typecase

A private type library and specimen book. Every font in `fonts/` is scanned, measured and
shown in one place so a face can be compared, tried on a page and inspected before it is
chosen for a project.

Live: https://melaniesigrid.github.io/typecase/

## What it does

- **Index** sets every family on one line. Type once and every row follows. Case, size and
  category filters apply to all rows.
- **Specimen** shows a family in full: its cuts, a glyph pair ruled with the real vertical
  metrics from the font file, a waterfall, the exact character set the cut contains, its
  OpenType features (toggle them live) and the file details and license.
- **Compare** puts up to four cuts against the same words. Stack them, overlay them with
  blend modes to see where the skeletons differ, or read the metrics side by side.
- **Play** pairs a headline face with a body face on an editable page. Presets for
  editorial, poster and wordmark. Copy the CSS when it looks right.
- Characters a cut does not contain are marked rather than rendered as boxes. Demo cuts are
  labelled as demo.

Keyboard: `1` `2` `3` switch views, `t` toggles paper and ink.

## Adding a font

1. Drop the files in a new folder under `fonts/<family-id>/`.
2. Add an entry to `fonts/meta.json` (name, category, designer, license, sample line, and
   per-file style and weight if the font's own name table is unhelpful).
3. `npm run manifest` rebuilds `src/manifest.json` and `src/fontfaces.js`. The build runs it
   automatically.

## Stack

Vite, React 19, plain CSS. Fonts are parsed at build time with fontkit in
`scripts/build-manifest.mjs`; the UI reads only the generated manifest. Deployed to GitHub
Pages by the workflow in `.github/workflows/deploy.yml`.

```
npm install
npm run dev
npm run build
```

## Licensing

See `fonts/README.md`. The fonts are here for personal comparison and are not offered for
download or reuse.
