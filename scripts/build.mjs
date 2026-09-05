#!/usr/bin/env node
/**
 * Filaverse homepage — card renderer.
 *
 * The homepage ships as static HTML (best possible LCP, no client-side
 * fetching, no framework). This script keeps the category and product cards in
 * `index.html` in sync with `data/*.json`, so nobody has to hand-edit markup —
 * and, more importantly, so no price or stock value can end up in the page
 * unless it exists in the data.
 *
 * Usage:  node scripts/build.mjs
 *
 * When porting the homepage into the real stack (Shopify Liquid, WooCommerce,
 * Next.js, ...), replace this script with the template loop of that stack and
 * feed it the same fields. The markup between the BEGIN/END markers is the
 * contract.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => JSON.parse(readFileSync(resolve(root, p), "utf8"));

const site = read("data/site.json");
const { categories } = read("data/categories.json");
const productData = read("data/products.json");

/** Escape text destined for an HTML text node or a quoted attribute. */
const esc = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Real catalogue photography is shot as a product cut-out on white, so it must
 * be contained rather than cropped like the schematic placeholders. Marking it
 * in the markup keeps that treatment in CSS instead of inline styles.
 */
function photoClass(item) {
  const remote = /^https?:/i.test(item.image || "");
  const real = item.imagePlaceholder === false || item.placeholder === false;
  return remote || real ? "fv-photo" : "";
}

const arrowIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;

/**
 * Category card. The heading link is stretched over the whole card via
 * `.fv-stretch`, which keeps the card fully clickable while remaining a single
 * real anchor — no clickable divs, one tab stop, correct semantics.
 */
function categoryCard(cat) {
  return `          <li>
            <article class="fv-card fv-category fv-reveal">
              <div class="fv-card__media">
                <img class="${photoClass(cat)}" src="${esc(cat.image)}" alt="${esc(cat.alt)}" width="600" height="600" loading="lazy" decoding="async">
              </div>
              <div class="fv-category__body">
                <h3><a class="fv-stretch" href="${esc(cat.url)}">${esc(cat.name)}</a></h3>
                <p>${esc(cat.useCase)}</p>
                <span class="fv-category__cta" aria-hidden="true">Bekijk ${esc(cat.name)} ${arrowIcon}</span>
              </div>
            </article>
          </li>`;
}

/**
 * Product card. Every optional field is genuinely optional: a null price
 * renders no price element at all rather than a placeholder amount.
 */
function productCard(product) {
  const specs = [product.material, product.diameter, product.weight]
    .filter(Boolean)
    .map(esc)
    .join(" &middot; ");

  const badge = product.placeholder
    ? `                <p class="fv-badge">Placeholder</p>\n`
    : product.badge
      ? `                <p class="fv-badge">${esc(product.badge)}</p>\n`
      : "";

  const colour = product.colour
    ? `                <p class="fv-product__meta">Kleur: ${esc(product.colour)}</p>\n`
    : "";

  const swatches = product.swatches?.length
    ? `                <ul class="fv-product__swatches" aria-label="Beschikbare kleuren">\n` +
      product.swatches
        .map(
          (s) =>
            `                  <li style="background:${esc(s.hex)}"><span class="fv-visually-hidden">${esc(s.name)}</span></li>`
        )
        .join("\n") +
      `\n                </ul>\n`
    : "";

  // No price data => no price element. Never a fabricated amount.
  const price = Number.isFinite(product.price)
    ? `                <p class="fv-product__price">&euro;&nbsp;${product.price.toFixed(2).replace(".", ",")}</p>\n`
    : `                <!-- TODO(integration): price omitted - no price in data/products.json for ${esc(product.id)} -->\n`;

  // No availability data => no stock line. Never a fabricated stock claim.
  const stock = product.availability
    ? `                <p class="fv-stock">${esc(product.availability)}</p>\n`
    : "";

  return `          <li>
            <article class="fv-card fv-product fv-reveal">
${badge}              <div class="fv-card__media">
                <img class="${photoClass(product)}" src="${esc(product.image)}" alt="${esc(product.alt)}" width="800" height="800" loading="lazy" decoding="async">
              </div>
              <div class="fv-card__body fv-product__body">
                <p class="fv-product__brand">${esc(product.brand)}</p>
                <h3 class="fv-product__title"><a class="fv-stretch" href="${esc(product.url)}">${esc(product.title)}</a></h3>
                <p class="fv-product__meta">${specs}</p>
${colour}${swatches}${stock}                <div class="fv-product__foot">
${price}                  <span class="fv-btn fv-btn--secondary fv-product__cta" aria-hidden="true">Bekijk product</span>
                </div>
              </div>
            </article>
          </li>`;
}

/** Replace the content between `<!-- BEGIN:name -->` and `<!-- END:name -->`. */
function replaceBlock(html, name, content) {
  const re = new RegExp(
    `([ \\t]*<!-- BEGIN:${name} -->\\n)[\\s\\S]*?([ \\t]*<!-- END:${name} -->)`
  );
  if (!re.test(html)) throw new Error(`Marker block "${name}" not found in index.html`);
  return html.replace(re, (_m, open, close) => `${open}${content}\n${close}`);
}

const indexPath = resolve(root, "index.html");
let html = readFileSync(indexPath, "utf8");

html = replaceBlock(html, "categories", categories.map(categoryCard).join("\n"));
html = replaceBlock(html, "products", productData.products.map(productCard).join("\n"));

writeFileSync(indexPath, html);

const placeholders = productData.products.filter((p) => p.placeholder).length;
console.log(
  `index.html updated: ${categories.length} categories, ${productData.products.length} products (${placeholders} still placeholder).`
);
if (placeholders) {
  console.warn(
    "WARNING: placeholder products are still present. Replace data/products.json with real catalogue data before going live."
  );
}
if (site.urls.filament.startsWith("/filament")) {
  console.warn(
    "REMINDER: verify every path in data/site.json against the live shop; remove any that has no page behind it."
  );
}
