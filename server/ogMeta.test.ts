import { describe, it, expect } from "vitest";
import { injectMetaTags } from "./ogMeta";

const TEMPLATE_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5" />
    <title>The PPL's Chef | Private Chef &amp; Luxury Catering in Las Vegas</title>
    <meta name="description" content="Default description" />
    <meta name="keywords" content="private chef Las Vegas" />
    <meta property="og:title" content="Default OG Title" />
    <meta property="og:description" content="Default OG Description" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="The PPL's Chef" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Default Twitter Title" />
    <meta name="twitter:description" content="Default Twitter Description" />
    <link rel="canonical" href="https://thepplschef.com" />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

describe("OG Meta Tag Injection", () => {
  it("injects homepage-specific meta tags for /", () => {
    const result = injectMetaTags(TEMPLATE_HTML, "/");
    expect(result).toContain("Luxury Private Dining");
    expect(result).toContain("<title>");
    expect(result).toContain('og:image" content="');
    expect(result).toContain("og-images/og-homepage-v2.jpg");
    expect(result).toContain('twitter:card" content="summary_large_image"');
    expect(result).toContain('twitter:image" content="');
    expect(result).toContain('og:image:width" content="1200"');
    expect(result).toContain('og:image:height" content="630"');
  });

  it("injects gallery-specific meta tags for /gallery", () => {
    const result = injectMetaTags(TEMPLATE_HTML, "/gallery");
    expect(result).toContain("Culinary Portfolio");
    expect(result).toContain("og-images/og-gallery-v2.jpg");
    expect(result).toContain('og:url" content="https://www.thepplschef.com/gallery"');
  });

  it("injects private chef meta tags for /private-chef-las-vegas", () => {
    const result = injectMetaTags(TEMPLATE_HTML, "/private-chef-las-vegas");
    expect(result).toContain("Private Chef Experience");
    expect(result).toContain("og-images/og-private-chef-v2.jpg");
    expect(result).toContain("unforgettable in-home dining");
  });

  it("injects meal prep meta tags for /meal-prep-las-vegas", () => {
    const result = injectMetaTags(TEMPLATE_HTML, "/meal-prep-las-vegas");
    expect(result).toContain("Chef-Crafted Meal Boxes");
    expect(result).toContain("og-images/og-meal-prep-v2.jpg");
    expect(result).not.toContain("Default OG Title");
  });

  it("injects catering meta tags for /catering-las-vegas", () => {
    const result = injectMetaTags(TEMPLATE_HTML, "/catering-las-vegas");
    expect(result).toContain("Full-Service Catering");
    expect(result).toContain("og-images/og-catering-v2.jpg");
  });

  it("injects special events meta tags for /special-events-las-vegas", () => {
    const result = injectMetaTags(TEMPLATE_HTML, "/special-events-las-vegas");
    expect(result).toContain("Special Event Catering");
    expect(result).toContain("og-images/og-special-events-v2.jpg");
  });

  it("injects corporate meta tags for /corporate-catering-las-vegas", () => {
    const result = injectMetaTags(TEMPLATE_HTML, "/corporate-catering-las-vegas");
    expect(result).toContain("Corporate");
    expect(result).toContain("og-images/og-corporate-v2.jpg");
  });

  it("injects about page meta tags for /about", () => {
    const result = injectMetaTags(TEMPLATE_HTML, "/about");
    expect(result).toContain("Chef Stephen Austin");
    expect(result).toContain("og-images/og-about-v2.jpg");
  });

  it("injects pricing page meta tags for /pricing", () => {
    const result = injectMetaTags(TEMPLATE_HTML, "/pricing");
    expect(result).toContain("Pricing");
    expect(result).toContain("og-images/og-pricing-v2.jpg");
  });

  it("injects book page meta tags for /book", () => {
    const result = injectMetaTags(TEMPLATE_HTML, "/book");
    expect(result).toContain("Book Your Experience");
    expect(result).toContain("og-images/og-book-v2.jpg");
  });

  it("injects faq page meta tags for /faq", () => {
    const result = injectMetaTags(TEMPLATE_HTML, "/faq");
    expect(result).toContain("Frequently Asked Questions");
    expect(result).toContain("og-images/og-faq-v2.jpg");
  });

  it("injects contact page meta tags for /contact", () => {
    const result = injectMetaTags(TEMPLATE_HTML, "/contact");
    expect(result).toContain("Contact Us");
    expect(result).toContain("og-images/og-contact-logo-v2.jpg");
  });

  it("adds noindex for /admin route", () => {
    const result = injectMetaTags(TEMPLATE_HTML, "/admin");
    expect(result).toContain('name="robots" content="noindex, nofollow"');
    expect(result).toContain("Admin");
  });

  it("falls back to homepage meta for unknown routes", () => {
    const result = injectMetaTags(TEMPLATE_HTML, "/some-unknown-page");
    expect(result).toContain("og-images/og-homepage-v2.jpg");
    expect(result).toContain("Luxury Private Dining");
  });

  it("removes duplicate meta tags (only 1 og:title, 1 title, 1 twitter:card)", () => {
    const result = injectMetaTags(TEMPLATE_HTML, "/");
    const ogTitleCount = (result.match(/og:title/g) || []).length;
    const titleCount = (result.match(/<title>/g) || []).length;
    const twitterCardCount = (result.match(/twitter:card/g) || []).length;
    expect(ogTitleCount).toBe(1);
    expect(titleCount).toBe(1);
    expect(twitterCardCount).toBe(1);
  });

  it("includes og:image dimensions for WhatsApp/iMessage", () => {
    const result = injectMetaTags(TEMPLATE_HTML, "/");
    expect(result).toContain('og:image:width" content="1200"');
    expect(result).toContain('og:image:height" content="630"');
    expect(result).toContain('og:image:type" content="image/jpeg"');
  });

  it("strips query strings from URL for canonical", () => {
    const result = injectMetaTags(TEMPLATE_HTML, "/gallery?filter=private");
    expect(result).toContain("Culinary Portfolio");
    expect(result).toContain('og:url" content="https://www.thepplschef.com/gallery"');
  });

  it("includes og:locale and og:site_name", () => {
    const result = injectMetaTags(TEMPLATE_HTML, "/");
    expect(result).toContain('og:locale" content="en_US"');
    expect(result).toContain('og:site_name" content="The PPL');
  });
});
