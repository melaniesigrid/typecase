# Typecase

A private type library, lookbook and journal. Every font in `fonts/` is scanned, measured and
shown in one place so a face can be compared, tried on a page and inspected before it is
chosen for a project. Companion to [melaniesigrid.com](https://melaniesigrid.com/).

Live: https://melaniesigrid.github.io/typecase/

## What it does

- **Library** sets every family on one line. Type once and every row follows. Filter by
  structure (sans, serif, script, display), by mood (elegant, playful, vintage…) or by search.
- **Lookbook** composes each curated pairing as a small designed piece in its own palette,
  with notes on why it works. Duos and trios that ship together are shown together. Open a
  look to jump into Play or Compare with those faces loaded. Looks live in
  `src/content/looks.js`.
- **Journal** holds short articles on pairing, with the evidence set live in the faces.
  Articles are data in `src/content/articles.js`: paragraphs, numbered principles, pull
  quotes, live specimens and embedded looks.
- **Specimen** shows a family in full: its cuts, a glyph pair ruled with the real vertical
  metrics from the font file, a waterfall, the exact character set the cut contains, its
  OpenType features (toggle them live) and the file details and license.
- **Compare** puts up to four cuts against the same words. Stack them, overlay them with
  blend modes to see where the skeletons differ, or read the metrics side by side.
- **Play** pairs a headline face with a body face on an editable page. Presets for
  editorial, poster and wordmark. Copy the CSS when it looks right.
- Characters a cut does not contain are marked rather than rendered as boxes. Demo cuts are
  labelled as demo.

Keyboard: `1` to `5` switch views, `t` toggles paper and ink.

## Adding a font

1. Drop the files in a new folder under `fonts/<family-id>/`.
2. Add an entry to `fonts/meta.json`: name, classification, moods, bestFor, designer,
   license, a sample line, and per-file style and weight if the font's own name table is
   unhelpful. Companion sets get `kind: duo | trio` and `variant: true` on each face.
3. `npm run manifest` rebuilds `src/manifest.json` and `src/fontfaces.js`. The build runs it
   automatically.

## Adding a look or an article

A look is one object in `src/content/looks.js`: faces by role (display, accent, body), a
palette, copy written to the character coverage of the cuts, a layout (poster, editorial,
card, label, split) and a note. An article is one object in `src/content/articles.js` with
a list of blocks. Both render immediately; no build step beyond `npm run build`.

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
