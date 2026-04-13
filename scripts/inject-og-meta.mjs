/**
 * Build-time OG Meta Injection Script
 *
 * Runs after `vite build` to generate per-route HTML files with
 * route-specific Open Graph and Twitter Card meta tags.
 *
 * For each route, this script:
 * 1. Reads the built dist/public/index.html
 * 2. Strips the generic meta tags
 * 3. Injects route-specific title, description, og:*, twitter:* tags
 * 4. Writes the result to dist/public/<route>/index.html
 *
 * Vercel's static file serving then picks up the correct HTML for each route.
 * Social crawlers see the right meta tags without any serverless function overhead.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIST = join(ROOT, "dist", "public");
const INDEX_HTML = join(DIST, "index.html");

// ── CDN base for OG images ────────────────────────────────────────────────────
const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ";
const BASE_URL = "https://www.thepplschef.com";

// ── Per-route metadata ────────────────────────────────────────────────────────
const ROUTE_META = {
  "/": {
    title: "The PPL's Chef | Luxury Private Dining & Catering in Las Vegas",
    description: "Las Vegas's premier private chef and catering company. Five-star dining, custom menus, and full-service hospitality — brought directly to you.",
    ogImage: `${CDN}/og-homepage_be185cdd.jpg`,
  },
  "/about": {
    title: "About Chef Stephen Austin | The PPL's Chef | Las Vegas",
    description: "Meet Chef Stephen Austin — 25+ years of culinary mastery, CSN-trained, and the driving force behind Las Vegas's most sought-after private dining experiences.",
    ogImage: `${CDN}/og-about_753eaa26.jpg`,
  },
  "/menus": {
    title: "Sample Menus | The PPL's Chef | Las Vegas",
    description: "Explore our curated sample menus for intimate dinners, celebration catering, and weekly meal prep. Every menu is custom-designed to your vision.",
    ogImage: `${CDN}/og-menus_39908185.jpg`,
  },
  "/gallery": {
    title: "Culinary Portfolio | The PPL's Chef | Las Vegas",
    description: "A curated gallery of private dining experiences, chef-crafted dishes, and behind-the-scenes moments from Las Vegas's premier private chef company.",
    ogImage: `${CDN}/og-gallery_952ca341.jpg`,
  },
  "/pricing": {
    title: "Pricing & Packages | The PPL's Chef | Las Vegas",
    description: "Transparent starting points for private chef experiences, full-service catering, and chef-crafted meal prep. Every package is tailored to your event.",
    ogImage: `${CDN}/og-pricing_21d4a309.jpg`,
  },
  "/book": {
    title: "Book Your Experience | The PPL's Chef | Las Vegas",
    description: "Reserve your private chef experience, catering event, or meal prep service in Las Vegas. Tell us your vision — we'll craft the perfect menu.",
    ogImage: `${CDN}/og-book_c5073fd1.jpg`,
  },
  "/faq": {
    title: "Frequently Asked Questions | The PPL's Chef | Las Vegas",
    description: "Everything you need to know about booking a private chef, catering services, meal prep, pricing, dietary accommodations, and our service area in Las Vegas.",
    ogImage: `${CDN}/og-faq_d7b6e148.jpg`,
  },
  "/contact": {
    title: "Contact Us | The PPL's Chef | Las Vegas",
    description: "Ready to elevate your next gathering? Reach out to The PPL's Chef for private dining, catering, and meal prep inquiries in Las Vegas.",
    ogImage: `${CDN}/og-contact_de01dd21.jpg`,
  },
  "/admin": {
    title: "Admin | The PPL's Chef",
    description: "Administration panel.",
    ogImage: `${CDN}/og-homepage_be185cdd.jpg`,
    noindex: true,
  },
  "/private-chef-las-vegas": {
    title: "Private Chef Experience | The PPL's Chef | Las Vegas",
    description: "Hire a private chef in Las Vegas for an unforgettable in-home dining experience. Custom menus, premium ingredients, and full-service hospitality.",
    ogImage: `${CDN}/og-private-chef_d29ce8f6.jpg`,
  },
  "/catering-las-vegas": {
    title: "Full-Service Catering | The PPL's Chef | Las Vegas",
    description: "Luxury catering for weddings, parties, and large-scale events in Las Vegas. Custom menus, professional staff, and restaurant-quality food at your venue.",
    ogImage: `${CDN}/og-catering_00c2f106.jpg`,
  },
  "/meal-prep-las-vegas": {
    title: "Chef-Crafted Meal Boxes | The PPL's Chef | Las Vegas",
    description: "Restaurant-quality meal boxes delivered in Las Vegas. Fresh, healthy, chef-crafted meals for busy professionals and families. Order your meal box today.",
    ogImage: `${CDN}/og-meal-prep_e66dea91.jpg`,
  },
  "/special-events-las-vegas": {
    title: "Special Event Catering | The PPL's Chef | Las Vegas",
    description: "Make your celebration unforgettable with bespoke catering for birthdays, engagements, showers, and milestone events in Las Vegas.",
    ogImage: `${CDN}/og-special-events_5ec0f5d0.jpg`,
  },
  "/corporate-catering-las-vegas": {
    title: "Corporate & Group Dining | The PPL's Chef | Las Vegas",
    description: "Premium corporate catering in Las Vegas for meetings, conferences, team events, and client dinners. Professional service and custom menus.",
    ogImage: `${CDN}/og-corporate_91a9e154.jpg`,
  },
};

// ── HTML escape ───────────────────────────────────────────────────────────────
function esc(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ── Build the meta block to inject ───────────────────────────────────────────
function buildMetaBlock(meta, path) {
  const canonical = `${BASE_URL}${path === "/" ? "" : path}`;
  const lines = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    meta.noindex ? `<meta name="robots" content="noindex, nofollow" />` : null,
    // Open Graph
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:image" content="${esc(meta.ogImage)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:type" content="image/jpeg" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${esc(canonical)}" />`,
    `<meta property="og:site_name" content="The PPL&#39;s Chef" />`,
    `<meta property="og:locale" content="en_US" />`,
    // Twitter / X Card
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${esc(meta.ogImage)}" />`,
    // Canonical
    `<link rel="canonical" href="${esc(canonical)}" />`,
  ].filter(Boolean);

  return lines.join("\n    ");
}

// ── Strip existing generic meta tags ─────────────────────────────────────────
function stripExistingMeta(html) {
  return html
    .replace(/<title>[^<]*<\/title>\s*/g, "")
    .replace(/<meta name="description"[^>]*>\s*/g, "")
    .replace(/<meta name="keywords"[^>]*>\s*/g, "")
    .replace(/<meta name="robots"[^>]*>\s*/g, "")
    .replace(/<meta property="og:[^"]*"[^>]*>\s*/g, "")
    .replace(/<meta name="twitter:[^"]*"[^>]*>\s*/g, "")
    .replace(/<link rel="canonical"[^>]*>\s*/g, "");
}

// ── Main ─────────────────────────────────────────────────────────────────────
console.log("🔍 Reading base index.html from", INDEX_HTML);

if (!existsSync(INDEX_HTML)) {
  console.error("❌ dist/public/index.html not found. Run vite build first.");
  process.exit(1);
}

const baseHtml = readFileSync(INDEX_HTML, "utf-8");
const strippedHtml = stripExistingMeta(baseHtml);

let successCount = 0;

for (const [path, meta] of Object.entries(ROUTE_META)) {
  const metaBlock = buildMetaBlock(meta, path);
  const injected = strippedHtml.replace(
    /(<meta name="viewport"[^>]*>)/,
    `$1\n    ${metaBlock}`
  );

  if (path === "/") {
    // Overwrite the root index.html with homepage meta
    writeFileSync(INDEX_HTML, injected, "utf-8");
    console.log(`✅ / → dist/public/index.html`);
  } else {
    // Create subdirectory and write index.html
    const routeDir = join(DIST, path.slice(1)); // strip leading /
    mkdirSync(routeDir, { recursive: true });
    const outPath = join(routeDir, "index.html");
    writeFileSync(outPath, injected, "utf-8");
    console.log(`✅ ${path} → dist/public${path}/index.html`);
  }
  successCount++;
}

console.log(`\n🎉 OG meta injection complete: ${successCount} routes processed`);
