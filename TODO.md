# Typecase roadmap

Working list for the project. Check items off as they ship; add new ones at the bottom of
the right section. Dates are absolute.

## Shipped

- [x] 2026-09-09 Library, Specimen, Compare and Play views. Manifest built from font files.
- [x] 2026-09-09 GitHub Pages deploy from `main`.
- [x] 2026-09-09 Honest character coverage: empty and .notdef-clone glyphs count as missing.
- [x] 2026-09-09 Lookbook with curated pairings; duos and trios shown together.
- [x] 2026-09-09 Journal with data-driven articles.
- [x] 2026-09-09 Moods, classification, best-for tags with filters and search.
- [x] 2026-09-09 Faceted browsing: categories, tags, collections, formats, license, sort.
- [x] 2026-09-09 Favourites, staff picks, date added.

## Next

- [x] 2026-09-10 Companion sets previewed together (Lookbook Sets, Specimen Together, Library rows).

- [ ] Link the lookbook from melaniesigrid.com (decide: nav item, or a "Type" page that embeds a few looks).
- [ ] Open Graph image per look so shared links preview the composition.
- [ ] Export a look as PNG from the browser (canvas render of the composed piece).
- [x] 2026-09-10 Shareable URLs for Compare and Play (Copy link buttons).
- [ ] Article authoring in Markdown with front matter, compiled to the block format at build time.
- [ ] Variable font support in the manifest (axes already read, no UI yet).
- [ ] Per-face download buttons, gated by license kind.
- [x] 2026-09-10 Copy CSS on looks and in Play: @font-face, fallback stacks, CSS variables for roles and palette.
- [x] 2026-09-10 WCAG contrast badge and swatches on each open look.
- [x] 2026-09-10 Keyboard navigation through library rows (j/k, enter, f). Mobile header fixed.

## Content

- [x] 2026-09-10 Eleven more looks; five use-case articles (elegant, playful, scripts, posters, weddings).
- [x] 2026-09-10 A look for every family except Degolan (its demo watermarks every vowel).
- [ ] Degolan look once a full cut replaces the demo.
- [x] 2026-09-10 Article: signature scripts and what to put under them.
- [x] 2026-09-10 Article: posters and the condensed face.
- [x] 2026-09-10 Article: the neutral body face. Article: merch and the heavy faces.
- [x] 2026-09-10 Articles: colour and type; what a demo cut can and cannot do.

## Housekeeping

- [ ] Replace demo cuts with licensed versions where a font gets used commercially.
- [ ] Decide whether Helvetica stays in a public repo (proprietary, not redistributable).
- [ ] Unit tests for `scripts/build-manifest.mjs` coverage logic and for `segments()`.
- [ ] Lighthouse pass on the deployed site; lazy-load font files per view.
