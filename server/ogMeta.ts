/**
 * Server-side OG/Twitter meta tag injection for social sharing previews.
 * 
 * Social crawlers (WhatsApp, iMessage, Facebook, Twitter/X) do NOT execute
 * JavaScript, so meta tags must be present in the server-rendered HTML.
 * This module defines per-route metadata and injects it into the HTML
 * template before serving.
 */

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ";
const BASE_URL = "https://www.thepplschef.com";

interface RouteMeta {
  title: string;
  description: string;
  ogImage: string;
  ogType?: string;
  canonical?: string;
  noindex?: boolean;
}

/**
 * Per-route metadata configuration.
 * Every public route gets unique, luxury-focused metadata.
 */
const routeMetaMap: Record<string, RouteMeta> = {
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

/**
 * Get metadata for a given URL path.
 * Falls back to homepage metadata for unknown routes.
 */
function getMetaForRoute(urlPath: string): RouteMeta {
  // Normalize: strip query strings and trailing slashes
  const cleanPath = urlPath.split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";
  return routeMetaMap[cleanPath] || routeMetaMap["/"]!;
}

/**
 * Inject route-specific meta tags into the HTML template.
 * Replaces the default/fallback meta tags in index.html with
 * route-specific values so social crawlers see the right content.
 */
export function injectMetaTags(html: string, urlPath: string): string {
  const meta = getMetaForRoute(urlPath);
  const canonical = `${BASE_URL}${urlPath === "/" ? "" : urlPath.split("?")[0]}`;
  const ogImageWidth = "1200";
  const ogImageHeight = "630";

  // Build the meta tag block that will replace the existing tags
  const metaBlock = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeAttr(meta.description)}" />`,
    meta.noindex ? `<meta name="robots" content="noindex, nofollow" />` : "",
    // Open Graph
    `<meta property="og:title" content="${escapeAttr(meta.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(meta.description)}" />`,
    `<meta property="og:image" content="${escapeAttr(meta.ogImage)}" />`,
    `<meta property="og:image:width" content="${ogImageWidth}" />`,
    `<meta property="og:image:height" content="${ogImageHeight}" />`,
    `<meta property="og:image:type" content="image/jpeg" />`,
    `<meta property="og:type" content="${meta.ogType || "website"}" />`,
    `<meta property="og:url" content="${escapeAttr(canonical)}" />`,
    `<meta property="og:site_name" content="The PPL's Chef" />`,
    `<meta property="og:locale" content="en_US" />`,
    // Twitter/X Card
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(meta.description)}" />`,
    `<meta name="twitter:image" content="${escapeAttr(meta.ogImage)}" />`,
    // Canonical
    `<link rel="canonical" href="${escapeAttr(canonical)}" />`,
  ].filter(Boolean).join("\n    ");

  // Replace existing meta tags in the HTML
  // Strategy: replace everything between the viewport meta and the preconnect to fonts
  let result = html;

  // Remove existing title
  result = result.replace(/<title>[^<]*<\/title>\s*/, "");
  // Remove existing meta description
  result = result.replace(/<meta name="description"[^>]*\/>\s*/, "");
  // Remove existing meta keywords
  result = result.replace(/<meta name="keywords"[^>]*\/>\s*/, "");
  // Remove existing og: tags
  result = result.replace(/<meta property="og:[^"]*"[^>]*\/>\s*/g, "");
  // Remove existing twitter: tags
  result = result.replace(/<meta name="twitter:[^"]*"[^>]*\/>\s*/g, "");
  // Remove existing canonical
  result = result.replace(/<link rel="canonical"[^>]*\/>\s*/, "");

  // Inject the new meta block after the viewport meta tag
  result = result.replace(
    /(<meta name="viewport"[^>]*\/>)/,
    `$1\n    ${metaBlock}`
  );

  return result;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
