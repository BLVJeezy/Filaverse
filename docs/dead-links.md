# Dead internal links

Generated 2026-09-05 from index.html and 404.html.

Only `/` exists as a page today. Every route below is linked from the site
but returns the custom 404. None of them is in `sitemap.xml`, so search
engines are not being pointed at them — but visitors who click will hit the
error page.

Three ways to resolve each one: build the page, repoint the link at the real
shop URL, or remove the link. Most live in `data/site.json`, so a repoint is
usually a one-line edit there followed by `node scripts/build.mjs`.

## 29 routes

| Route | Linked from |
|---|---|
| `/3d-printers` | homepage |
| `/accessoires` | homepage |
| `/account` | homepage |
| `/algemene-voorwaarden` | homepage, 404 page |
| `/blog` | homepage |
| `/blog/filament-en-printer-compatibiliteit` | homepage |
| `/blog/pla-of-petg` | homepage |
| `/bundels` | homepage |
| `/contact` | homepage |
| `/cookiebeleid` | homepage, 404 page |
| `/filament` | homepage |
| `/filament/asa` | homepage |
| `/filament/petg` | homepage |
| `/filament/pla` | homepage |
| `/filament/pla-plus` | homepage |
| `/filament/silk-specials` | homepage |
| `/filament/tpu` | homepage |
| `/impact` | homepage |
| `/klantendienst/faq` | homepage |
| `/klantendienst/retourneren` | homepage |
| `/klantendienst/verzending` | homepage |
| `/merken/filaverse` | homepage |
| `/merken/smart-print` | homepage |
| `/onderwijs` | homepage |
| `/over-filaverse` | homepage |
| `/privacybeleid` | homepage, 404 page |
| `/winkelmand` | homepage |
| `/zakelijk` | homepage |
| `/zakelijk/offerte` | homepage |
