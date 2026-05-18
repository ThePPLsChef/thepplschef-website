/**
 * Build-time SEO Pre-rendering Script
 *
 * Runs AFTER inject-og-meta.mjs to inject meaningful static HTML content
 * inside <div id="root"> for each public route. This ensures Google crawlers
 * see real text content without requiring JavaScript execution.
 *
 * React will hydrate over this content when the app loads in the browser,
 * replacing it with the full interactive SPA.
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIST = join(ROOT, "dist", "public");

// ── CDN base ─────────────────────────────────────────────────────────────────
const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ";
const BASE_URL = "https://www.thepplschef.com";

// ── Static SEO content for each route ────────────────────────────────────────
// This is the key content that crawlers need to see in the raw HTML.
// It will be replaced by React hydration in the browser.

const ROUTE_CONTENT = {
  "/": `
    <header>
      <nav aria-label="Main navigation">
        <a href="/">The PPL's Chef</a>
        <a href="/services">Services</a>
        <a href="/about">About</a>
        <a href="/menus">Menus</a>
        <a href="/gallery">Gallery</a>
        <a href="/pricing">Pricing</a>
        <a href="/faq">FAQ</a>
        <a href="/contact">Contact</a>
        <a href="/book">Book Now</a>
      </nav>
    </header>
    <main>
      <section aria-label="Hero">
        <h1>Your Table. Your Menu. Your Chef.</h1>
        <p>Las Vegas's premier private chef and catering company. Five-star dining, custom menus, and full-service hospitality — brought directly to you.</p>
        <a href="/book">Plan Your Experience</a>
        <a href="/pricing">View Pricing</a>
      </section>
      <section aria-label="Welcome">
        <h2>The PPL's Chef</h2>
        <p>At The PPL'S Chef, we believe extraordinary food has the power to transform any gathering into a lasting memory. Based in Las Vegas, we specialize in bringing restaurant-quality dining directly to you — whether it's a private dinner for two, a corporate luncheon for fifty, or a celebration for hundreds.</p>
        <p>Every menu is custom-crafted. Every detail is considered. Every guest leaves impressed.</p>
      </section>
      <section aria-label="Services">
        <h2>What We Offer</h2>
        <p>Five distinct culinary experiences, each tailored to your occasion and crafted with the same commitment to excellence.</p>
        <article><h3><a href="/private-chef-las-vegas">Private Chef Experience</a></h3><p>Intimate, chef-driven dining in the comfort of your home.</p></article>
        <article><h3><a href="/catering-las-vegas">Catering</a></h3><p>Full-service catering for events of every scale.</p></article>
        <article><h3><a href="/meal-prep-las-vegas">Meal Boxes</a></h3><p>Chef-crafted meals delivered fresh to your door.</p></article>
        <article><h3><a href="/special-events-las-vegas">Special Events</a></h3><p>Unforgettable celebrations with bespoke menus.</p></article>
        <article><h3><a href="/corporate-catering-las-vegas">Corporate Dining</a></h3><p>Elevate your business events with premium dining.</p></article>
      </section>
      <section aria-label="Pricing">
        <h2>Transparent Pricing</h2>
        <article><h3>Private Chef Experience</h3><p>Starting at $125/person. Custom curated menu, on-site preparation, professional plating, and complete cleanup.</p></article>
        <article><h3>Catering &amp; Events</h3><p>Starting at $55/person. Full-service catering for weddings, parties, corporate events, and celebrations of every scale.</p></article>
        <article><h3>Chef-Crafted Meal Boxes</h3><p>Starting at $75 for 5 meals. Restaurant-quality meals delivered fresh to your door weekly.</p></article>
      </section>
      <section aria-label="The Experience">
        <h2>More Than a Meal — It's a Moment</h2>
        <p>What sets The PPL's Chef apart is our unwavering commitment to creating not just meals, but memories. Every ingredient is hand-selected. Every plate is composed with intention. Every guest is treated like family.</p>
        <p>We bring the warmth of Southern hospitality, the precision of fine dining, and the creativity of a personal chef — all to the location of your choosing.</p>
      </section>
      <section aria-label="About the Chef">
        <h2>Chef Stephen Austin</h2>
        <p>CEO &amp; Director of Culinary Operations</p>
        <p>Chef Stephen Austin is the founder and culinary force behind The PPL's Chef — Las Vegas's premier private chef and catering experience. Born and raised in Georgia, Chef Stephen spent over 25 years immersed in professional kitchens, learning and mastering every aspect of the culinary craft from the ground up.</p>
        <p>After relocating to Las Vegas, he formalized his training at the College of Southern Nevada, where he sharpened his technical skills and deepened his passion for creating exceptional dining experiences. That passion became a mission: to bring restaurant-quality food directly to the people — in their homes, at their events, and in their most meaningful moments.</p>
        <p>Today, The PPL's Chef serves clients across the Las Vegas Valley with custom menus, full-service catering, and intimate private dining experiences that turn every occasion into an unforgettable memory.</p>
        <blockquote>"I spent my life in kitchens learning and training so people can enjoy moments with food." — Chef Stephen Austin</blockquote>
      </section>
      <section aria-label="Testimonials">
        <h2>What Our Clients Say</h2>
        <blockquote><p>"The PPL's Chef transformed my birthday into an unforgettable culinary experience. Every dish was beautifully presented and absolutely delicious."</p><footer>— Jessica M., 40th Birthday Celebration</footer></blockquote>
        <blockquote><p>"We hired The PPL's Chef for an intimate anniversary dinner at home. The attention to detail — from the custom menu to the impeccable service — made us feel like we were at a five-star restaurant."</p><footer>— David &amp; Sarah K., Anniversary Dinner</footer></blockquote>
        <blockquote><p>"Our company has used The PPL's Chef for three corporate events now, and each time they exceed expectations. The food quality is consistently outstanding."</p><footer>— Marcus T., Corporate Event Series</footer></blockquote>
      </section>
      <section aria-label="FAQ">
        <h2>Frequently Asked Questions</h2>
        <details><summary>How far in advance should I book?</summary><p>We recommend booking at least 2–4 weeks in advance for private chef experiences and small events. For large catering events (50+ guests), 4–8 weeks notice is ideal.</p></details>
        <details><summary>Do you accommodate dietary restrictions and allergies?</summary><p>Absolutely. Every menu we create is fully customizable. We regularly prepare meals for guests with allergies, vegan/vegetarian preferences, gluten-free needs, halal requirements, keto diets, and more.</p></details>
        <details><summary>What areas do you serve?</summary><p>We serve the entire Las Vegas Valley, including Las Vegas, Henderson, North Las Vegas, Summerlin, and surrounding areas.</p></details>
        <details><summary>How does pricing work?</summary><p>Private chef experiences start at $125 per person, catering starts at $55 per person for buffet service, and meal prep boxes start at $75 for 5 meals.</p></details>
      </section>
      <section aria-label="Contact">
        <h2>Ready to Book? Start Here.</h2>
        <p>Our guided booking experience walks you through every detail in 3 minutes — so we can design your event before we ever speak.</p>
        <a href="/book">Start Your Curated Experience</a>
        <p>Phone: <a href="tel:725-212-2236">725-212-2236</a></p>
        <p>Email: <a href="mailto:info@thepplschef.com">info@thepplschef.com</a></p>
      </section>
    </main>
    <footer>
      <p>&copy; 2025 The PPL's Chef. All rights reserved.</p>
      <p>Las Vegas, Nevada | Private Chef &amp; Luxury Catering</p>
      <p>"Everybody Deserves a Chef"</p>
    </footer>
  `,

  "/about": `
    <header>
      <nav aria-label="Main navigation">
        <a href="/">The PPL's Chef</a>
        <a href="/services">Services</a>
        <a href="/about">About</a>
        <a href="/menus">Menus</a>
        <a href="/gallery">Gallery</a>
        <a href="/pricing">Pricing</a>
        <a href="/contact">Contact</a>
        <a href="/book">Book Now</a>
      </nav>
    </header>
    <main>
      <section aria-label="Hero">
        <h1>Meet the Chef</h1>
        <p>The story behind Las Vegas's premier private chef and catering experience.</p>
      </section>
      <section aria-label="Chef Bio">
        <h2>Chef Stephen Austin</h2>
        <p>Founder &amp; Director of Culinary Operations</p>
        <p>Chef Stephen Austin is the founder and culinary force behind The PPL's Chef — Las Vegas's premier private chef and catering experience. Born and raised in Georgia, Chef Stephen spent over 25 years immersed in professional kitchens, learning and mastering every aspect of the culinary craft from the ground up.</p>
        <p>After relocating to Las Vegas, he formalized his training at the College of Southern Nevada (CSN), where he sharpened his technical skills and deepened his passion for creating exceptional dining experiences. That passion became a mission: to bring restaurant-quality food directly to the people — in their homes, at their events, and in their most meaningful moments.</p>
        <p>Today, The PPL's Chef serves clients across the Las Vegas Valley with custom menus, full-service catering, intimate private dining experiences, and chef-crafted meal prep that turns every occasion into an unforgettable memory.</p>
        <blockquote>"I spent my life in kitchens learning and training so people can enjoy moments with food." — Chef Stephen Austin</blockquote>
      </section>
      <section aria-label="In Action">
        <h2>Passion in Every Plate</h2>
        <p>Whether it's a signature seafood boil for a backyard celebration, a multi-course plated dinner for an intimate anniversary, or weekly meal prep for a busy professional — Chef Stephen brings the same level of care, creativity, and precision to every dish.</p>
        <p>His approach is simple: treat every client like family, use the freshest ingredients, and never cut corners. The result is food that doesn't just taste extraordinary — it creates moments people remember.</p>
        <blockquote>"Everybody Deserves to Have a Chef." — The PPL's Chef</blockquote>
      </section>
      <section aria-label="Why Choose Us">
        <h2>Why Choose The PPL's Chef</h2>
        <ul>
          <li><strong>25+ Years Experience</strong> — Over two decades of professional culinary mastery.</li>
          <li><strong>CSN Trained</strong> — Formal culinary education at the College of Southern Nevada.</li>
          <li><strong>Full-Service</strong> — From menu design to cleanup, we handle everything.</li>
          <li><strong>Custom Menus</strong> — Every dish is tailored to your vision and dietary needs.</li>
          <li><strong>Las Vegas Based</strong> — Proudly serving the entire Las Vegas Valley.</li>
        </ul>
      </section>
    </main>
    <footer>
      <p>&copy; 2025 The PPL's Chef. All rights reserved.</p>
      <p>Las Vegas, Nevada | Private Chef &amp; Luxury Catering</p>
      <p>"Everybody Deserves a Chef"</p>
    </footer>
  `,

  "/services": `
    <header>
      <nav aria-label="Main navigation">
        <a href="/">The PPL's Chef</a>
        <a href="/services">Services</a>
        <a href="/about">About</a>
        <a href="/menus">Menus</a>
        <a href="/gallery">Gallery</a>
        <a href="/pricing">Pricing</a>
        <a href="/contact">Contact</a>
        <a href="/book">Book Now</a>
      </nav>
    </header>
    <main>
      <section aria-label="Hero">
        <h1>Our Services</h1>
        <p>Five distinct culinary experiences — each tailored to your occasion and crafted with the same commitment to excellence by Chef Stephen Austin.</p>
      </section>
      <section aria-label="Services List">
        <article>
          <h2><a href="/private-chef-las-vegas">Private Chef Experience</a></h2>
          <p>Restaurant-level dining. Personal. Intimate. Unforgettable.</p>
          <p>Transform your home into a five-star restaurant with a dedicated private chef who prepares a custom multi-course meal exclusively for you and your guests. From ingredient sourcing to plating and cleanup — we handle every detail.</p>
        </article>
        <article>
          <h2><a href="/catering-las-vegas">Full-Service Catering</a></h2>
          <p>Elevated cuisine for events of every scale.</p>
          <p>From intimate dinner parties to large-scale celebrations, our full-service catering brings restaurant-quality food, professional staff, and seamless execution to your venue. Buffet, plated, or family-style — we do it all.</p>
        </article>
        <article>
          <h2><a href="/meal-prep-las-vegas">Chef-Crafted Meal Boxes</a></h2>
          <p>Restaurant-quality meals. Delivered to your door.</p>
          <p>Healthy, chef-crafted meals prepared fresh and delivered weekly. Choose your proteins, pick your flavor style, and enjoy restaurant-quality food without the effort. Perfect for busy professionals and families in Las Vegas.</p>
        </article>
        <article>
          <h2><a href="/special-events-las-vegas">Special Event Catering</a></h2>
          <p>Make your celebration unforgettable.</p>
          <p>Birthdays, engagements, showers, anniversaries, and milestone celebrations — we create bespoke menus and full-service experiences that make your special day truly extraordinary.</p>
        </article>
        <article>
          <h2><a href="/corporate-catering-las-vegas">Corporate &amp; Group Dining</a></h2>
          <p>Elevate your business events with premium dining.</p>
          <p>Professional catering for meetings, conferences, team events, and client dinners. Impress your colleagues and clients with chef-crafted menus and seamless service.</p>
        </article>
      </section>
      <section aria-label="CTA">
        <h2>Ready to Experience The PPL's Chef?</h2>
        <p>Every service is fully customizable. Tell us your vision and we'll craft the perfect culinary experience.</p>
        <a href="/book">Book Your Experience</a>
      </section>
    </main>
    <footer>
      <p>&copy; 2025 The PPL's Chef. All rights reserved.</p>
      <p>Las Vegas, Nevada | Private Chef &amp; Luxury Catering</p>
      <p>"Everybody Deserves a Chef"</p>
    </footer>
  `,

  "/menus": `
    <header>
      <nav aria-label="Main navigation">
        <a href="/">The PPL's Chef</a>
        <a href="/services">Services</a>
        <a href="/about">About</a>
        <a href="/menus">Menus</a>
        <a href="/gallery">Gallery</a>
        <a href="/pricing">Pricing</a>
        <a href="/contact">Contact</a>
        <a href="/book">Book Now</a>
      </nav>
    </header>
    <main>
      <section aria-label="Hero">
        <h1>Sample Menus</h1>
        <p>Every menu is 100% customizable. These are starting points to inspire your private dining experience, catering event, or meal prep order.</p>
      </section>
      <section aria-label="Menus">
        <article>
          <h2>Private Dining Menu</h2>
          <p>A curated multi-course experience designed for intimate gatherings. Chef Stephen crafts each course to your preferences, dietary needs, and occasion.</p>
        </article>
        <article>
          <h2>Catering Menu</h2>
          <p>Full-service catering menus for events of every scale — from elegant plated dinners to abundant buffet spreads. Every dish is prepared fresh on-site.</p>
        </article>
        <article>
          <h2>Meal Prep Menu</h2>
          <p>Weekly chef-crafted meal boxes featuring fresh proteins, seasonal vegetables, and bold flavors. Choose your style and let us handle the rest.</p>
        </article>
      </section>
      <section aria-label="CTA">
        <h2>Want a Custom Menu?</h2>
        <p>Every menu we create is tailored to your vision. Book a consultation and we'll design something uniquely yours.</p>
        <a href="/book">Start Planning Your Menu</a>
      </section>
    </main>
    <footer>
      <p>&copy; 2025 The PPL's Chef. All rights reserved.</p>
      <p>Las Vegas, Nevada | Private Chef &amp; Luxury Catering</p>
    </footer>
  `,

  "/gallery": `
    <header>
      <nav aria-label="Main navigation">
        <a href="/">The PPL's Chef</a>
        <a href="/services">Services</a>
        <a href="/about">About</a>
        <a href="/menus">Menus</a>
        <a href="/gallery">Gallery</a>
        <a href="/pricing">Pricing</a>
        <a href="/contact">Contact</a>
        <a href="/book">Book Now</a>
      </nav>
    </header>
    <main>
      <section aria-label="Hero">
        <h1>Culinary Portfolio</h1>
        <p>A curated gallery of private dining experiences, chef-crafted dishes, and behind-the-scenes moments from Las Vegas's premier private chef company.</p>
      </section>
      <section aria-label="Gallery">
        <h2>Our Work</h2>
        <p>From signature seafood boils to elegant plated dinners, every dish tells a story. Browse our collection of culinary creations crafted by Chef Stephen Austin for private events, catering, and special occasions across Las Vegas.</p>
      </section>
      <section aria-label="CTA">
        <h2>Like What You See?</h2>
        <p>Every dish is crafted to your event. Tell us what you're craving and we'll design a custom menu.</p>
        <a href="/book">Book Your Experience</a>
      </section>
    </main>
    <footer>
      <p>&copy; 2025 The PPL's Chef. All rights reserved.</p>
      <p>Las Vegas, Nevada | Private Chef &amp; Luxury Catering</p>
    </footer>
  `,

  "/pricing": `
    <header>
      <nav aria-label="Main navigation">
        <a href="/">The PPL's Chef</a>
        <a href="/services">Services</a>
        <a href="/about">About</a>
        <a href="/menus">Menus</a>
        <a href="/gallery">Gallery</a>
        <a href="/pricing">Pricing</a>
        <a href="/contact">Contact</a>
        <a href="/book">Book Now</a>
      </nav>
    </header>
    <main>
      <section aria-label="Hero">
        <h1>Pricing &amp; Packages</h1>
        <p>Transparent starting points for every service. Every package is tailored to your event — no hidden fees, no surprises.</p>
      </section>
      <section aria-label="Pricing">
        <article>
          <h2>Private Chef Experience</h2>
          <h3>Signature Experience — $125/person</h3>
          <ul><li>Custom curated menu</li><li>On-site preparation</li><li>Professional plating</li><li>Ideal for intimate gatherings</li></ul>
          <h3>Premium Experience — $175/person</h3>
          <ul><li>Multi-course tasting menu</li><li>Premium ingredients</li><li>Wine pairing suggestions</li><li>Full table service</li></ul>
          <h3>Ultimate Experience — $250+/person</h3>
          <ul><li>Luxury ingredients (wagyu, lobster, truffle)</li><li>Sommelier-curated wine pairings</li><li>Dedicated service staff</li><li>Custom tablescaping</li></ul>
        </article>
        <article>
          <h2>Catering &amp; Events</h2>
          <h3>Buffet Service — $55/person</h3>
          <ul><li>Chef-crafted buffet menu</li><li>Professional setup &amp; service</li><li>Chafing dishes &amp; equipment</li><li>Minimum 20 guests</li></ul>
          <h3>Plated Service — $85/person</h3>
          <ul><li>Multi-course plated dinner</li><li>Professional wait staff</li><li>Elegant presentation</li><li>Minimum 15 guests</li></ul>
          <h3>Premium Catering — $125+/person</h3>
          <ul><li>Full custom menu design</li><li>Premium ingredients</li><li>Complete event coordination</li><li>Bar service available</li></ul>
        </article>
        <article>
          <h2>Chef-Crafted Meal Boxes</h2>
          <h3>Starter Plan — $75/week (5 meals)</h3>
          <ul><li>5 chef-crafted meals</li><li>Choose your proteins</li><li>Fresh, never frozen</li><li>Weekly delivery</li></ul>
          <h3>Standard Plan — $130/week (10 meals)</h3>
          <ul><li>10 chef-crafted meals</li><li>More variety &amp; options</li><li>Dietary accommodations</li><li>Priority scheduling</li></ul>
          <h3>Premium Plan — $200+/week (15 meals)</h3>
          <ul><li>15 chef-crafted meals</li><li>Premium proteins</li><li>Custom flavor profiles</li><li>Flexible delivery schedule</li></ul>
        </article>
      </section>
      <section aria-label="CTA">
        <h2>Ready to Get Started?</h2>
        <p>Every quote is custom. Tell us about your event and we'll provide a detailed proposal.</p>
        <a href="/book">Get Your Custom Quote</a>
      </section>
    </main>
    <footer>
      <p>&copy; 2025 The PPL's Chef. All rights reserved.</p>
      <p>Las Vegas, Nevada | Private Chef &amp; Luxury Catering</p>
    </footer>
  `,

  "/faq": `
    <header>
      <nav aria-label="Main navigation">
        <a href="/">The PPL's Chef</a>
        <a href="/services">Services</a>
        <a href="/about">About</a>
        <a href="/menus">Menus</a>
        <a href="/gallery">Gallery</a>
        <a href="/pricing">Pricing</a>
        <a href="/faq">FAQ</a>
        <a href="/contact">Contact</a>
        <a href="/book">Book Now</a>
      </nav>
    </header>
    <main>
      <section aria-label="Hero">
        <h1>Frequently Asked Questions</h1>
        <p>Everything you need to know about booking a private chef, catering services, meal prep, pricing, and our service area in Las Vegas.</p>
      </section>
      <section aria-label="FAQ">
        <h2>Common Questions</h2>
        <details><summary>How far in advance should I book?</summary><p>We recommend booking at least 2–4 weeks in advance for private chef experiences and small events. For large catering events (50+ guests), 4–8 weeks notice is ideal. However, we do our best to accommodate last-minute requests.</p></details>
        <details><summary>Do you accommodate dietary restrictions and allergies?</summary><p>Absolutely. Every menu we create is fully customizable. We regularly prepare meals for guests with allergies, vegan/vegetarian preferences, gluten-free needs, halal requirements, keto diets, and more.</p></details>
        <details><summary>What areas do you serve?</summary><p>We serve the entire Las Vegas Valley, including Las Vegas, Henderson, North Las Vegas, Summerlin, and surrounding areas.</p></details>
        <details><summary>How does pricing work?</summary><p>Pricing varies based on the type of service, number of guests, menu complexity, and event duration. Private chef experiences start at $125 per person, catering starts at $55 per person for buffet service, and meal prep boxes start at $75 for 5 meals. We provide a detailed custom quote after your initial consultation — no hidden fees.</p></details>
        <details><summary>Do you provide service staff, equipment, and setup?</summary><p>Yes. Our full-service catering includes professional service staff, equipment, table setup, and complete cleanup. For private chef experiences, Chef Stephen handles all cooking, plating, and kitchen cleanup.</p></details>
        <details><summary>Can I customize the menu?</summary><p>Every menu is 100% customizable. The sample menus on our website are starting points to inspire you. During your consultation, we'll discuss your preferences, dietary needs, flavor profiles, and event theme to create a menu that's uniquely yours.</p></details>
        <details><summary>How does the meal prep / meal box service work?</summary><p>Choose your proteins, pick your flavor style, and select your plan size. We prepare everything fresh and deliver it to your door. Available as a one-time order or weekly subscription.</p></details>
        <details><summary>What happens after I submit an inquiry?</summary><p>After you submit your inquiry, we'll reach out within 24 hours to schedule a consultation. During the consultation, we'll discuss your vision, finalize the menu, and provide a detailed quote.</p></details>
      </section>
    </main>
    <footer>
      <p>&copy; 2025 The PPL's Chef. All rights reserved.</p>
      <p>Las Vegas, Nevada | Private Chef &amp; Luxury Catering</p>
    </footer>
  `,

  "/contact": `
    <header>
      <nav aria-label="Main navigation">
        <a href="/">The PPL's Chef</a>
        <a href="/services">Services</a>
        <a href="/about">About</a>
        <a href="/menus">Menus</a>
        <a href="/gallery">Gallery</a>
        <a href="/pricing">Pricing</a>
        <a href="/contact">Contact</a>
        <a href="/book">Book Now</a>
      </nav>
    </header>
    <main>
      <section aria-label="Contact">
        <h1>Contact Us</h1>
        <p>Ready to elevate your next gathering? Reach out to The PPL's Chef for private dining, catering, and meal prep inquiries in Las Vegas.</p>
        <h2>Get In Touch</h2>
        <p>Phone: <a href="tel:725-212-2236">725-212-2236</a></p>
        <p>Email: <a href="mailto:info@thepplschef.com">info@thepplschef.com</a></p>
        <p>Location: Las Vegas, Nevada</p>
        <p>We respond to all inquiries within 24 hours.</p>
        <a href="/book">Start Your Curated Experience</a>
      </section>
    </main>
    <footer>
      <p>&copy; 2025 The PPL's Chef. All rights reserved.</p>
      <p>Las Vegas, Nevada | Private Chef &amp; Luxury Catering</p>
    </footer>
  `,

  "/book": `
    <header>
      <nav aria-label="Main navigation">
        <a href="/">The PPL's Chef</a>
        <a href="/services">Services</a>
        <a href="/about">About</a>
        <a href="/menus">Menus</a>
        <a href="/gallery">Gallery</a>
        <a href="/pricing">Pricing</a>
        <a href="/contact">Contact</a>
        <a href="/book">Book Now</a>
      </nav>
    </header>
    <main>
      <section aria-label="Booking">
        <h1>Book Your Experience</h1>
        <p>Reserve your private chef experience, catering event, or meal prep service in Las Vegas. Tell us your vision — we'll craft the perfect menu.</p>
        <h2>Choose Your Service</h2>
        <ul>
          <li><strong>Private Chef</strong> — Intimate, chef-driven dining in the comfort of your home.</li>
          <li><strong>Catering Event</strong> — Full-service catering for celebrations of every scale.</li>
          <li><strong>Weekly Meal Prep</strong> — Chef-crafted meal boxes delivered to your door.</li>
          <li><strong>Special Event</strong> — Bespoke menus for milestone celebrations.</li>
          <li><strong>Corporate Dining</strong> — Premium catering for business events.</li>
        </ul>
        <p>Our guided booking experience walks you through every detail in 3 minutes — so we can design your event before we ever speak.</p>
      </section>
    </main>
    <footer>
      <p>&copy; 2025 The PPL's Chef. All rights reserved.</p>
      <p>Las Vegas, Nevada | Private Chef &amp; Luxury Catering</p>
    </footer>
  `,

  "/private-chef-las-vegas": `
    <header>
      <nav aria-label="Main navigation">
        <a href="/">The PPL's Chef</a>
        <a href="/services">Services</a>
        <a href="/about">About</a>
        <a href="/menus">Menus</a>
        <a href="/gallery">Gallery</a>
        <a href="/pricing">Pricing</a>
        <a href="/contact">Contact</a>
        <a href="/book">Book Now</a>
      </nav>
    </header>
    <main>
      <section aria-label="Hero">
        <h1>Private Chef Experience in Las Vegas</h1>
        <p>Restaurant-level dining. Personal. Intimate. Unforgettable.</p>
      </section>
      <section aria-label="Overview">
        <h2>Your Home. Our Chef. An Unforgettable Evening.</h2>
        <p>Transform your home into a five-star restaurant. Our Private Chef Experience brings a dedicated chef to your space, where they'll prepare a multi-course meal crafted exclusively for you and your guests. From ingredient sourcing to plating and cleanup, we handle every detail — you simply enjoy the evening.</p>
        <h3>What's Included</h3>
        <ul>
          <li>Personal consultation and custom menu design</li>
          <li>Fresh, premium ingredient sourcing</li>
          <li>Full kitchen setup at your location</li>
          <li>Multi-course meal preparation and plating</li>
          <li>Professional table service</li>
          <li>Complete kitchen cleanup</li>
        </ul>
        <h3>Best For</h3>
        <ul>
          <li>Intimate dinner parties (2–20 guests)</li>
          <li>Date nights and anniversaries</li>
          <li>Family gatherings and holiday meals</li>
          <li>Wine pairing dinners</li>
          <li>Proposal and celebration dinners</li>
        </ul>
      </section>
      <section aria-label="Pricing">
        <h2>Private Chef Pricing</h2>
        <p>Signature Experience: $125/person | Premium Experience: $175/person | Ultimate Experience: $250+/person</p>
      </section>
      <section aria-label="Meet Your Chef">
        <h2>Meet Your Chef</h2>
        <h3>Chef Stephen Austin</h3>
        <p>Chef Stephen Austin is the founder and executive chef behind The PPL's Chef. With years of professional culinary experience across private dining, catering, and events, Stephen built this brand on a single belief: everybody deserves to have a chef.</p>
        <p>Every private dining experience is personally overseen by Chef Stephen — from menu design to final plating.</p>
      </section>
      <section aria-label="CTA">
        <h2>Ready for Your Private Chef Experience?</h2>
        <p>Tell us about your occasion and we'll design a custom menu that exceeds expectations.</p>
        <a href="/book">Book Your Private Chef</a>
        <p>Phone: <a href="tel:725-212-2236">725-212-2236</a></p>
      </section>
    </main>
    <footer>
      <p>&copy; 2025 The PPL's Chef. All rights reserved.</p>
      <p>Las Vegas, Nevada | Private Chef &amp; Luxury Catering</p>
      <p>"Everybody Deserves a Chef"</p>
    </footer>
  `,

  "/catering-las-vegas": `
    <header>
      <nav aria-label="Main navigation">
        <a href="/">The PPL's Chef</a>
        <a href="/services">Services</a>
        <a href="/about">About</a>
        <a href="/menus">Menus</a>
        <a href="/gallery">Gallery</a>
        <a href="/pricing">Pricing</a>
        <a href="/contact">Contact</a>
        <a href="/book">Book Now</a>
      </nav>
    </header>
    <main>
      <section aria-label="Hero">
        <h1>Full-Service Catering in Las Vegas</h1>
        <p>Elevated cuisine for events of every scale.</p>
      </section>
      <section aria-label="Overview">
        <h2>Catering That Exceeds Expectations</h2>
        <p>From intimate dinner parties to large-scale celebrations, our full-service catering brings restaurant-quality food, professional staff, and seamless execution to your venue. Whether you envision an elegant plated dinner, an abundant buffet, or interactive food stations — we bring it to life.</p>
        <h3>What's Included</h3>
        <ul>
          <li>Custom menu design consultation</li>
          <li>Fresh, premium ingredient sourcing</li>
          <li>On-site food preparation</li>
          <li>Professional service staff</li>
          <li>Equipment, setup, and breakdown</li>
          <li>Complete cleanup</li>
        </ul>
        <h3>Best For</h3>
        <ul>
          <li>Weddings and receptions</li>
          <li>Large parties (20–200+ guests)</li>
          <li>Holiday celebrations</li>
          <li>Graduation parties</li>
          <li>Community events</li>
        </ul>
      </section>
      <section aria-label="Pricing">
        <h2>Catering Pricing</h2>
        <p>Buffet Service: $55/person | Plated Service: $85/person | Premium Catering: $125+/person</p>
      </section>
      <section aria-label="CTA">
        <h2>Ready to Plan Your Catering Event?</h2>
        <a href="/book">Get Your Custom Quote</a>
        <p>Phone: <a href="tel:725-212-2236">725-212-2236</a></p>
      </section>
    </main>
    <footer>
      <p>&copy; 2025 The PPL's Chef. All rights reserved.</p>
      <p>Las Vegas, Nevada | Private Chef &amp; Luxury Catering</p>
    </footer>
  `,

  "/meal-prep-las-vegas": `
    <header>
      <nav aria-label="Main navigation">
        <a href="/">The PPL's Chef</a>
        <a href="/services">Services</a>
        <a href="/about">About</a>
        <a href="/menus">Menus</a>
        <a href="/gallery">Gallery</a>
        <a href="/pricing">Pricing</a>
        <a href="/contact">Contact</a>
        <a href="/book">Book Now</a>
      </nav>
    </header>
    <main>
      <section aria-label="Hero">
        <h1>Chef-Crafted Meal Boxes in Las Vegas</h1>
        <p>Restaurant-quality meals. Delivered to your door.</p>
      </section>
      <section aria-label="Overview">
        <h2>Meal Prep Made Extraordinary</h2>
        <p>Healthy, chef-crafted meals prepared fresh and delivered weekly. Choose your proteins, pick your flavor style, and enjoy restaurant-quality food without the effort. Perfect for busy professionals and families in Las Vegas.</p>
        <h3>How It Works</h3>
        <ol>
          <li>Choose your proteins (chicken, steak, salmon, shrimp, or mix)</li>
          <li>Pick your flavor style (Southern comfort, Mediterranean, Asian-inspired, or custom)</li>
          <li>Select your plan size (5, 10, or 15 meals per week)</li>
          <li>We prepare everything fresh and deliver to your door</li>
        </ol>
        <h3>Pricing</h3>
        <p>Starter Plan: $75/week (5 meals) | Standard Plan: $130/week (10 meals) | Premium Plan: $200+/week (15 meals)</p>
      </section>
      <section aria-label="CTA">
        <h2>Ready to Start Your Meal Prep?</h2>
        <a href="/book">Order Your Meal Boxes</a>
        <p>Phone: <a href="tel:725-212-2236">725-212-2236</a></p>
      </section>
    </main>
    <footer>
      <p>&copy; 2025 The PPL's Chef. All rights reserved.</p>
      <p>Las Vegas, Nevada | Private Chef &amp; Luxury Catering</p>
    </footer>
  `,

  "/special-events-las-vegas": `
    <header>
      <nav aria-label="Main navigation">
        <a href="/">The PPL's Chef</a>
        <a href="/services">Services</a>
        <a href="/about">About</a>
        <a href="/menus">Menus</a>
        <a href="/gallery">Gallery</a>
        <a href="/pricing">Pricing</a>
        <a href="/contact">Contact</a>
        <a href="/book">Book Now</a>
      </nav>
    </header>
    <main>
      <section aria-label="Hero">
        <h1>Special Event Catering in Las Vegas</h1>
        <p>Make your celebration unforgettable.</p>
      </section>
      <section aria-label="Overview">
        <h2>Celebrations Crafted to Perfection</h2>
        <p>Birthdays, engagements, showers, anniversaries, and milestone celebrations — we create bespoke menus and full-service experiences that make your special day truly extraordinary. Every detail is considered, every guest is impressed.</p>
        <h3>What's Included</h3>
        <ul>
          <li>Custom celebration menu design</li>
          <li>Fresh, premium ingredient sourcing</li>
          <li>On-site preparation and plating</li>
          <li>Professional service staff</li>
          <li>Equipment and setup</li>
          <li>Complete cleanup</li>
        </ul>
        <h3>Best For</h3>
        <ul>
          <li>Birthday celebrations</li>
          <li>Engagement parties</li>
          <li>Baby and bridal showers</li>
          <li>Anniversary dinners</li>
          <li>Graduation parties</li>
          <li>Holiday gatherings</li>
        </ul>
      </section>
      <section aria-label="CTA">
        <h2>Ready to Plan Your Special Event?</h2>
        <a href="/book">Start Planning</a>
        <p>Phone: <a href="tel:725-212-2236">725-212-2236</a></p>
      </section>
    </main>
    <footer>
      <p>&copy; 2025 The PPL's Chef. All rights reserved.</p>
      <p>Las Vegas, Nevada | Private Chef &amp; Luxury Catering</p>
    </footer>
  `,

  "/corporate-catering-las-vegas": `
    <header>
      <nav aria-label="Main navigation">
        <a href="/">The PPL's Chef</a>
        <a href="/services">Services</a>
        <a href="/about">About</a>
        <a href="/menus">Menus</a>
        <a href="/gallery">Gallery</a>
        <a href="/pricing">Pricing</a>
        <a href="/contact">Contact</a>
        <a href="/book">Book Now</a>
      </nav>
    </header>
    <main>
      <section aria-label="Hero">
        <h1>Corporate &amp; Group Dining in Las Vegas</h1>
        <p>Elevate your business events with premium dining.</p>
      </section>
      <section aria-label="Overview">
        <h2>Professional Catering for Business</h2>
        <p>Premium corporate catering in Las Vegas for meetings, conferences, team events, and client dinners. Professional service and custom menus that impress your colleagues and clients.</p>
        <h3>What's Included</h3>
        <ul>
          <li>Custom corporate menu design</li>
          <li>Professional presentation and setup</li>
          <li>On-site preparation</li>
          <li>Service staff as needed</li>
          <li>Equipment and cleanup</li>
          <li>Dietary accommodation for all attendees</li>
        </ul>
        <h3>Best For</h3>
        <ul>
          <li>Board meetings and executive lunches</li>
          <li>Conference catering</li>
          <li>Team building events</li>
          <li>Client appreciation dinners</li>
          <li>Office celebrations</li>
          <li>Product launch events</li>
        </ul>
      </section>
      <section aria-label="CTA">
        <h2>Ready to Elevate Your Corporate Event?</h2>
        <a href="/book">Get Your Corporate Quote</a>
        <p>Phone: <a href="tel:725-212-2236">725-212-2236</a></p>
      </section>
    </main>
    <footer>
      <p>&copy; 2025 The PPL's Chef. All rights reserved.</p>
      <p>Las Vegas, Nevada | Private Chef &amp; Luxury Catering</p>
    </footer>
  `,
};

// ── Main ─────────────────────────────────────────────────────────────────────
console.log("🔍 Pre-rendering SEO content into route HTML files...");

let successCount = 0;

for (const [path, content] of Object.entries(ROUTE_CONTENT)) {
  let htmlPath;
  if (path === "/") {
    htmlPath = join(DIST, "index.html");
  } else {
    htmlPath = join(DIST, path.slice(1), "index.html");
  }

  if (!existsSync(htmlPath)) {
    console.warn(`⚠️  ${htmlPath} not found, skipping ${path}`);
    continue;
  }

  let html = readFileSync(htmlPath, "utf-8");

  // Replace empty <div id="root"></div> with pre-rendered content
  // The content is wrapped in a div that React will replace on hydration
  const prerenderedRoot = `<div id="root">${content.trim()}</div>`;
  html = html.replace(/<div id="root"><\/div>/, prerenderedRoot);

  writeFileSync(htmlPath, html, "utf-8");
  console.log(`✅ ${path} → pre-rendered SEO content injected`);
  successCount++;
}

console.log(`\n🎉 SEO pre-rendering complete: ${successCount} routes processed`);
