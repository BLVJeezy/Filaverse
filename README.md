# Filaverse — homepage

A redesigned **homepage** for Filaverse, built to the brief in
*Filaverse Homepage Redesign*: commerce-first hierarchy, filament visually
dominant, B2B and education prominent, brand story and social impact present
but secondary.

```
PRODUCTS → CATEGORIES → TRUST → BESTSELLERS → B2B / EDUCATION → BRAND → IMPACT
```

---

## ⚠️ Read this first: the repository was empty

The brief assumes an existing Filaverse project to inspect and extend —
framework, styling system, header/footer, routing, product data, shop URLs,
logo, colours, fonts, cart and search logic.

**`BLVJeezy/Filaverse` had no commits, no branches and no files when this work
started.** There was no framework to match, no catalogue to read, no cart to
preserve and no brand assets to reuse.

So the homepage is delivered as **standalone, dependency-free HTML + CSS + JS**.
That is a deliberate choice: it carries no framework assumptions, so it ports
cleanly into whatever Filaverse actually runs (Shopify, WooCommerce, Next.js,
…) once that codebase is available. Every point where it must meet the real
shop is marked `TODO(...)` in the source and listed below.

Nothing here replaces existing shop infrastructure — there was none to replace.
When the real project appears, port these sections into it rather than
importing this repository over it.

---

## Running it

No build step, no dependencies.

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

Re-render the category and product cards after editing the data files:

```bash
node scripts/build.mjs        # Node 18+, no packages required
```

---

## Layout

```
index.html                  The homepage. Hand-written, except the two
                            marker blocks filled in by scripts/build.mjs.
assets/css/styles.css       One stylesheet. Design tokens at the top.
assets/js/main.js           Drawer, search panel, accordion, scroll reveal.
                            Progressive enhancement only.
assets/img/*-placeholder.svg  Temporary assets — see "Placeholders".
data/site.json              Every outbound URL the homepage uses.
data/categories.json        Material categories.
data/products.json          Homepage bestsellers.
scripts/build.mjs           Renders the JSON into index.html.
```

### Why the cards are generated

`data/products.json` is the contract between the shop and the homepage. The
renderer omits a price element entirely when `price` is `null`, and a stock line
when `availability` is `null` — so no fabricated amount can reach the page by
accident. Products still carrying `placeholder: true` render a visible
**PLACEHOLDER** badge, and `scripts/build.mjs` prints a warning listing how many
remain.

When porting to a real stack, replace `scripts/build.mjs` with that stack's
template loop and feed it the same fields. The markup between
`<!-- BEGIN:products -->` and `<!-- END:products -->` is the contract.

---

## No invented data

Per section 3 of the brief, nothing on this page claims a fact that was not
available:

- **No prices.** No catalogue existed to read them from.
- **No ratings or reviews.** The product schema has no rating field at all, and
  there is no `Review`/`AggregateRating` structured data.
- **No stock quantities, shipping times, discounts or certifications.**
- **No free-shipping threshold.** The utility bar deliberately says
  "Verzending vanuit België" rather than "Gratis verzending vanaf €X".
- **No `FAQPage` structured data** until the answers are signed off, so
  unverified claims cannot surface as rich results.

The FAQ answers use only general material knowledge (PLA vs PETG vs TPU,
1,75 mm being the common desktop diameter) — no Filaverse-specific promises.

---

## What needs verifying before launch

Everything below is marked `TODO(...)` in the source.

### `TODO(business)` — facts to confirm
| Where | What |
|---|---|
| Utility bar | All three benefit claims |
| Hero USPs | All three USPs |
| Impact section | **The €0,50 per Filaverse spool donation to Ugani Foundation.** Delete the figure block and keep the neutral paragraph if it cannot be confirmed. |
| Brands section | The exact Filaverse ↔ Smart Print positioning |
| B2B section | Which services are actually offered (volume pricing, recurring supply, quotations) |
| Education section | Which services schools can actually get. Leasing and subscriptions are *not* claimed. |
| FAQ | Every answer |
| JSON-LD | Legal name, address, VAT number, contact details |

### `TODO(integration)` — wiring to the real shop
- **Search** — both forms `GET` to `/zoeken?q=`. Point them at the existing
  search route; do not re-implement search.
- **Cart** — the icon is a plain link to `/winkelmand`. The badge is hidden
  until the real cart calls `window.filaverse.setCartCount(n)`. The homepage
  owns no cart state, so existing cart logic cannot break.
- **Account** — remove the icon entirely if the project has no accounts.
- **URLs** — every path lives in `data/site.json`. Replace them all, and
  **delete any entry with no page behind it** rather than shipping a dead link.
  This applies especially to the three "Hulp bij kiezen" cards: if the guides
  are not written, remove the cards.

### `TODO(assets)` — real imagery
All `assets/img/*-placeholder.svg` files are schematic SVG illustrations, drawn
from scratch and clearly labelled `PLACEHOLDER` in the artwork itself. No
competitor imagery was used anywhere. Replace with real Filaverse photography,
and swap the accent hex values at the top of `styles.css` for the official
brand colours.

The hero image is the LCP element: preloaded, `fetchpriority="high"`, never
lazy-loaded. Keep those attributes on the replacement and add
`srcset`/`sizes` with AVIF or WebP sources.

---

## Design notes

**Palette.** White / off-white / light grey surfaces, deep-navy text. Orange is
reserved for the primary purchase CTA, badges and active states; teal and blue
carry secondary actions, icons and supporting information. No gradients beyond
one flat hero wash, no glassmorphism.

**Performance.** No framework, no animation library, no web fonts, no video.
One stylesheet, one deferred ~5 KB script. All below-fold images lazy-load with
explicit `width`/`height` so there is no layout shift.

**Motion.** Micro-interactions only, 150–350 ms: cards lift, images scale
slightly, arrows nudge, sections fade up once on entry. All of it is disabled
under `prefers-reduced-motion`.

**Mobile.** Designed, not stacked. The primary CTA sits ~527 px down a 844 px
viewport. Categories become a 2-column grid, bestsellers a snap-scrolling
carousel below 560 px, B2B and education stack. All touch targets are ≥44 px.

**Accessibility.** One `h1`, ordered headings, a skip link, visible focus rings
that are never removed, real `alt` text on every image, a focus-trapped mobile
drawer with `Escape` to close, and a WAI-ARIA accordion with arrow-key
navigation. Cards are clickable in full via a stretched anchor
(`.fv-stretch::after`) — one real link, one tab stop, no clickable `div`s.

---

## Verified

Checked in Chromium at 390 / 834 / 1440 px:

- exactly one `h1`; heading order intact
- no horizontal overflow at any of the three widths
- no console errors
- every image has `alt`
- no interactive target under 44 px on mobile
- category, product and help cards clickable across their whole surface
- drawer, search panel and accordion all keyboard-operable

## Out of scope

Product pages, category pages, checkout, accounts, admin, the product database,
B2B backend systems, and site-wide SEO. Only the homepage and the components it
needs.
