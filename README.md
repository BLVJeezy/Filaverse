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
assets/img/hero-3d-print-poster.*  Hero poster / mobile fallback.
assets/video/               Hero background video (MP4 + WebM).
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

### Catalogue imagery

Category and bestseller images now point at **real Smart Print product
photography**, and the brand / B2B / education blocks at real Filaverse and
Bambu Lab imagery. The URLs live in `data/categories.json` and
`data/products.json` and are baked into the markup by `scripts/build.mjs`;
the three remaining blocks are still swapped at runtime in `main.js`.

Real photography is a product cut-out on white, so those images carry
`class="fv-photo"` (`object-fit: contain` on white) instead of being cropped
like the schematic placeholders.

Two things to settle:

- **The images are hotlinked** from `b2b.smartprint24.com` and WordPress/S3
  CDNs. That makes the homepage depend on hosts it does not control, and any
  hotlink protection, CDN change or renamed file breaks it silently. Copy the
  assets into `assets/img/` and serve them from the same origin before launch.
- **They could not be verified from here.** This sandbox's egress policy blocks
  both hosts, so the images were never actually rendered during development —
  layout was checked with them failing to load. Open the page on a normal
  connection and confirm framing, aspect ratio and quality.

### `TODO(assets)` — remaining placeholder imagery
All `assets/img/*-placeholder.svg` files are schematic SVG illustrations, drawn
from scratch and clearly labelled `PLACEHOLDER` in the artwork itself. No
competitor imagery was used anywhere. Replace with real Filaverse photography.

**The logo file has not been supplied.** `filaverse-logo-placeholder.svg` is a
stand-in wordmark built to the described blue/white/black scheme. Drop in the
real logo and set `--fv-accent` to its blue.

The hero poster is the LCP paint: preloaded, `fetchpriority="high"`, never
lazy-loaded. Keep those attributes on any replacement.

---

## Design notes

**Palette — blue / white / black.** White, off-white and light grey surfaces
with near-black text. A single brand blue (`--fv-accent`) carries the primary
purchase CTA, badges and active states; a muted blue-grey (`--fv-steel`) carries
icons and supporting detail. **There is no orange anywhere.** The old
`--fv-orange*` / `--fv-teal*` token names survive as aliases onto the blue ramp,
so any component still referencing them stays on-palette instead of silently
reintroducing orange.

Retinting the whole page is a one-line change: replace `--fv-accent` at the top
of `styles.css` with the exact blue from the logo file — everything else derives
from it. All foreground/background pairs were contrast-checked and pass WCAG AA
(lowest is 4.94:1, the light blue accent on the dark hero).

**Performance.** No framework, no animation library, no web fonts. One
stylesheet, one deferred ~6 KB script. All below-fold images lazy-load with
explicit `width`/`height` so there is no layout shift. The hero video is
budgeted rather than assumed — see below.

**Motion.** Micro-interactions only, 150–350 ms: cards lift, images scale
slightly, arrows nudge, sections fade up once on entry. All of it is disabled
under `prefers-reduced-motion`.

### Asset caching — do not remove the version query

`vercel.json` serves `/assets/*.{css,js}` with a one-year `immutable` cache.
That is only safe because `scripts/build.mjs` appends a content hash to those
two URLs (`styles.css?v=ff96fb…`), so an edited file always gets a new URL.

**Skipping the build step after editing CSS or JS will ship a stale page.** This
has already bitten once: an immutable cache on unversioned filenames meant
returning visitors got new HTML paired with a year-old stylesheet — the hero
video rendered as a plain block above the copy instead of behind it, the CTA was
still orange, and the secondary hero button was invisible (translucent white on
white). One cause, four symptoms.

Media keeps stable filenames and is cached for a day with
`stale-while-revalidate`, so a replaced image or video appears quickly rather
than being pinned for a year. The HTML itself is always revalidated, since it is
what carries the versioned asset URLs.

The three `vercel.json` rules, in order — note that **`vercel.json` cannot carry
comments**; Vercel's schema rejects any property on a header rule beyond
`source`, `headers`, `has` and `missing`, and a stray `"//"` key fails the
deployment outright:

| `source` | Cache-Control | Why |
|---|---|---|
| `/assets/(.*).(css\|js)` | 1 year, `immutable` | Safe: these URLs carry a content hash |
| `/assets/(.*).(jpg\|png\|svg\|mp4\|…)` | 1 day + `stale-while-revalidate` | Stable filenames, replaceable in place |
| `/((?!assets/).*)` | `max-age=0, must-revalidate` | Carries the versioned URLs; never stale |

The catch-all deliberately excludes `/assets/` rather than relying on rule
order, so no two rules can fight over the same header. The patterns are
path-to-regexp; each of the paths above matches exactly one rule.

### Hero background video

`assets/video/filaverse-hero-3d-print.{mp4,webm}` — a looping, silent,
colour-graded clip of a 3D printer at work, sitting behind the hero copy.

The brief's performance section advises against background video. It is here
because it was explicitly requested, so it is budgeted rather than assumed:

| | |
|---|---|
| Source | 8.1 MB, 1920×1080, 8.3 s, with an audio track |
| Shipped | **634 KB** MP4 + **424 KB** WebM, 1280×720, 6.87 s, no audio stream |
| Poster | 48 KB JPG (28 KB WebP), identical to frame 1 |

What was done to it:

- **Trimmed.** The last 25 frames were a flat grey end card, which would have
  produced a visible jolt on every loop.
- **Crossfaded.** The final 0.6 s dissolves into the opening frames, so the loop
  has no cut at all.
- **Colour-graded** to full desaturation plus a cool blue cast. This matches the
  blue/white/black palette and removes the orange that was in the original
  footage (the printer's "CAUTION HOT" label and vendor logo).
- **Audio stripped**, so autoplay is never blocked on that basis.

Loading rules, all in `main.js`:

- Ships `preload="none"` — **not one byte is fetched** until the script decides
  the video is welcome.
- Suppressed entirely (poster only, `<source>` elements removed) for
  `prefers-reduced-motion`, `Save-Data`, 2G-class connections, and viewports
  ≤700 px. Phones never pay for it.
- Pauses when scrolled out of view and when the tab is hidden.
- A refused autoplay promise is caught, not fought — the poster simply stays.

The poster, not the video, is the LCP paint: it is preloaded with
`fetchpriority="high"`, and the video is fetched only afterwards so the two
never compete.

**⚠️ The footage is of a Bambu Lab printer, and the "Bambu Lab" wordmark is
legible in several frames.** The grade makes it much less prominent, but it is
still another company's trademark on the Filaverse homepage. Confirm this is
intended — it is defensible if Filaverse stocks Bambu Lab printers, and a
problem if not. Swapping in different footage means re-running the pipeline in
`scripts/` (the exact ffmpeg filter chain is recorded in the commit message).

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
- hero video autoplays on desktop and is never requested at 390 px (0 `<source>`
  elements, poster only)
- every colour pair passes WCAG AA
- no JavaScript or console errors (remote catalogue images cannot be fetched
  from the development sandbox; that noise is excluded)

## Out of scope

Product pages, category pages, checkout, accounts, admin, the product database,
B2B backend systems, and site-wide SEO. Only the homepage and the components it
needs.
