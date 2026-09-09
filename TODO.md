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
- [ ] Shareable URLs for Compare and Play state (encode faces and settings in the hash).
- [ ] Article authoring in Markdown with front matter, compiled to the block format at build time.
- [ ] Variable font support in the manifest (axes already read, no UI yet).
- [ ] Per-face download buttons, gated by license kind.
- [ ] A "Use in project" panel: copy `@font-face` plus a fallback stack, and a CSS variable set for a pairing.
- [ ] Contrast checker for look palettes (WCAG ratio badge on each look).
- [ ] Keyboard navigation through library rows (j/k, enter to open).

## Content

- [x] 2026-09-10 Eleven more looks; five use-case articles (elegant, playful, scripts, posters, weddings).
- [ ] A look for every family that does not have one yet (check the Specimen page's "In the lookbook" section).
- [ ] Article: scripts and where they stop working (Bellique, Paperline, Royal scripts).
- [ ] Article: condensed display faces and measure (Further, Saneoz, Degolan).
- [ ] Article: the neutral body face. Why Helvetica Light carries half the lookbook.

## Housekeeping

- [ ] Replace demo cuts with licensed versions where a font gets used commercially.
- [ ] Decide whether Helvetica stays in a public repo (proprietary, not redistributable).
- [ ] Unit tests for `scripts/build-manifest.mjs` coverage logic and for `segments()`.
- [ ] Lighthouse pass on the deployed site; lazy-load font files per view.
