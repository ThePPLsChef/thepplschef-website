# Project TODO — Phase 1 Backend

- [x] Resolve Home.tsx merge conflict (keep existing homepage)
- [x] Build database schema with all 10 tables (users, eater_profiles, chef_profiles, service_types, inquiries, bookings, quotes, payments, reviews, notifications)
- [x] Push database schema to MySQL/TiDB
- [x] Write Drizzle relations for all tables
- [x] Create db helper functions for inquiries (create, list, getById, updateStatus, getStats)
- [x] Create tRPC inquiry router (public: submit inquiry; admin: list, detail, update status, stats)
- [x] Seed service_types table with 5 core services
- [x] Wire BookingPage form to tRPC inquiry.submit mutation
- [x] Wire ContactPage form to tRPC inquiry.submit mutation
- [x] Wire Contact component (homepage) form to tRPC inquiry.submit mutation
- [x] Wire MealPrepPage form to tRPC inquiry.submit mutation
- [x] Build admin dashboard page at /admin (custom layout with brand styling)
- [x] Admin: inquiry list view (table with status, date, name, service type)
- [x] Admin: inquiry detail view with full info
- [x] Admin: status update functionality (new → reviewed → quoted → booked → cancelled)
- [x] Admin: stats display (total inquiries, new count, this week's count)
- [x] Admin: brand-styled with black, gold, red, cream colors
- [x] Add /admin route to App.tsx
- [x] Notify owner on new inquiry submission via notifyOwner helper
- [x] Write vitest tests for inquiry procedures (17 tests passing)
- [x] Verify full inquiry flow via browser (form submission → DB → admin view) — VERIFIED

## Multi-Step Booking Wizard

- [x] Step 1: Service type selection with large clickable cards
- [x] Step 2: Service-specific guest count / event type question
- [x] Step 3: Date picker (service-specific label)
- [x] Step 4: Dietary needs multi-select cards
- [x] Step 5: Budget selection with service-specific ranges
- [x] Step 6: Optional vision/notes textarea
- [x] Step 7: Contact info (name, email, phone, referral source)
- [x] Progress bar showing step X of 7
- [x] Back button on each step
- [x] Dark luxury aesthetic (dark bg, gold accents, smooth transitions)
- [x] Success screen after submission
- [x] Wire submission to /api/inquiries with error handling
- [x] Preview only — NOT pushed to GitHub (owner review pending)

## Booking Wizard Visual Overhaul

- [x] Match homepage visual language (warm charcoal #1A1A1A bg, not pure black)
- [x] Remove heavy dark overlay — lighter, warmer backgrounds
- [x] Eliminate neon glow effects on selected cards
- [x] Clean gold border + subtle warm tint for selected state
- [x] Larger cards with more breathing room and padding
- [x] Refined typography with bolder section headers
- [x] Improved mobile readability with better spacing
- [x] Premium selected state (warm amber accent, no gaming UI feel)
- [x] Brand-consistent warmth (Gold #ECA241, Cream #F3F1E9, Charcoal #1A1A1A)
- [x] Seamless transition from homepage into booking flow

## Homepage Targeted Edits (Apr 8)

- [x] Change 1: Replace full 9-card pricing section with simplified 3-card starting-at teaser (homepage only)
- [x] Change 2: Update Why Choose Us intro paragraph to new copy
- [x] Change 3: Add "Every dish is crafted to your event" line + BUILD YOUR MENU CTA to Signature Dishes section

## Meal Prep Wizard Branching Flow (Apr 8)

- [x] Add MealPrepWizardData interface with all meal-prep-specific fields
- [x] Add MEAL_PREP_TOTAL_STEPS = 8 constant and dynamic total steps logic
- [x] Implement 6 new Meal Prep steps (2–7) with correct options per spec
- [x] Update canProceed() to handle both standard and meal-prep paths
- [x] Update progress bar to use dynamic total steps based on service selection
- [x] Update step dots to reflect correct step count per path
- [x] Update handleSubmit to include meal-prep-specific fields in inquiry
- [x] Verify standard path (Private Chef, Catering, etc.) is completely unchanged

## Service Page CTA Routing (Apr 8)

- [x] Add URL parameter pre-selection to BookingWizard (?service=X skips to Step 2)
- [x] Update Private Chef page CTA → /book?service=private-chef
- [x] Update Catering page CTA → /book?service=catering
- [x] Update Meal Prep page CTA → /book?service=meal-prep
- [x] Update Special Events page CTA → /book?service=special-event
- [x] Update Corporate Dining page CTA → /book?service=corporate

## Navbar Fix (Apr 8)

- [x] Investigate why navbar links stop working when sticky/fixed navbar is visible during scroll
- [x] Fix all nav links to route correctly in both initial and scrolled states — added py-3 px-1 to linkStyle, hit targets now 41px (was 17px)
- [x] Verify mobile hamburger menu links also work correctly — mobile links already had adequate padding

## Mobile Navbar Fix (Apr 8)

- [x] Fix mobile menu overlay z-index — moved to React Portal on document.body with z-index: 9999
- [x] Ensure mobile menu is full-screen overlay on top of all content — verified via screenshot and console
- [x] Verify X close button works correctly — confirmed in browser test

## Logo Adjustments (Apr 8)
- [x] Fix Meal Prep page logo visibility on dark background — frosted glass container (to be replaced with CSS drop-shadow stroke)
- [x] Replace frosted glass container with CSS filter drop-shadow white outline on logo — 7-directional white drop-shadow applied to PNG image
- [x] Increase navbar logo size for mobile readability
- [x] Increase hero section logo size for brand impact
- [x] Match CTA section logo size to hero logo size
- [x] Audit and adjust all other logo placements for consistency

## Audit Fixes (Apr 8 — Round 2)

- [x] Add "Corporate Dining" to homepage contact form service type dropdown
- [x] Fix booking wizard mobile: make CONTINUE button sticky at bottom of viewport on mobile screens
- [x] Add JSON-LD LocalBusiness schema to homepage and contact page
- [x] Add JSON-LD Service schema to each service page (Private Chef, Catering, Meal Prep, Special Events, Corporate Dining)
- [x] Add JSON-LD FAQPage schema to homepage FAQ section
- [x] Add JSON-LD Person schema to About page
- [x] Add unique meta descriptions (150-160 chars) to all pages missing one
- [x] Fix Menus page title tag to "Sample Menus | The PPL's Chef | Las Vegas Private Chef"
- [x] Replace Special Events hero image with celebration/event-themed photo

## Navbar Active Page Indicator (Apr 8)

- [x] Add gold underline/highlight active page indicator to desktop navbar links
- [x] Add gold active indicator to mobile hamburger menu links
- [x] Use wouter's useLocation to detect current path

## Mobile Wizard Layout Fix (Apr 8)
- [x] Add sufficient bottom padding to wizard container so CONTINUE button clears the sticky bottom bar on mobile
- [x] Prevent wizard page from scrolling into the site footer (no footer bleed, no empty black gap)

## Wizard Mobile Fix + Special Events Hero (Apr 8)
- [x] Hide "BOOK YOUR EXPERIENCE" sticky gold bar on /book page (add hideStickyCta prop to Layout)
- [x] Increase wizard container bottom padding to clear the wizard's own fixed nav bar on mobile
- [x] Remove text overlay from Special Events hero image (inpaint/fill text area)
- [x] Upload cleaned Special Events hero image to CDN and update services.ts

## Image Compression to WebP (Apr 9)
- [x] Audit all image URLs in images.ts and services.ts
- [x] Download all remote images and convert to WebP at quality 85-90
- [x] Upload WebP images to CDN and collect URL mappings
- [x] Update all image references in images.ts and services.ts to WebP CDN URLs
- [x] Verify site loads correctly with new WebP images

## Email Notification System (Apr 9)

- [x] Research email sending service available via Manus built-in API or SMTP
- [x] Build branded HTML email templates (internal notification + customer confirmation)
- [x] Create server-side email sending utility (server/email.ts)
- [x] Add sendInquiryEmails tRPC procedure (or integrate into existing inquiry.submit)
- [x] Wire booking wizard submission to trigger both emails
- [x] Wire contact form (Contact.tsx / homepage) to trigger both emails
- [x] Wire meal prep form to trigger both emails
- [x] Wire catering inquiry form to trigger both emails (if separate)
- [x] Write vitest tests for email procedures (4 tests passing)
- [x] Test all forms end-to-end and confirm emails received
- [x] Deploy to preview

## Pre-Launch Tasks (Apr 9)

- [x] Audit all social media footer links — verified Instagram, TikTok, Facebook all active
- [x] Remove non-existent X/Twitter link (@thepplschef does not exist) from all 5 locations + JSON-LD sameAs
- [x] Update TikTok and Facebook URLs to www. prefix for consistency across all pages
- [x] Install bcrypt (cost 12) for server-side password hashing
- [x] Add ADMIN_PASSWORD_HASH to server ENV (bcrypt hash, never exposed to client)
- [x] Build tRPC admin.verifyPassword procedure (bcrypt.compare server-side)
- [x] Build AdminPasswordGate component — session persists within browser tab
- [x] Wire AdminPasswordGate around AdminDashboard in App.tsx
- [x] Add GA4 tracking code to index.html with real Measurement ID G-QHP2QP8FHE
- [x] Write vitest test for admin.verifyPassword procedure
- [x] Deploy to preview

## Admin Password Gate Bug Fix (Apr 9)

- [x] Diagnose root cause: secrets system strips $ characters from env var values, corrupting the bcrypt hash
- [x] Fix: store hash as base64 in ADMIN_PASSWORD_HASH; server decodes with Buffer.from(val, 'base64').toString('utf8') before bcrypt.compare()
- [x] Update admin.verifyPassword test to cover the base64 decode path (7 tests, all passing)
- [x] All 28 vitest tests passing
- [x] Redeploy to preview

## Admin Dashboard Redirect Fix (Apr 9)

- [x] Diagnose: AdminDashboard used useAuth() OAuth check — redirected non-OAuth users to homepage
- [x] Fix: Switched inquiry list/detail/stats/updateStatus from adminProcedure to adminTokenProcedure (validates x-admin-token header)
- [x] Fix: main.tsx now injects sessionStorage token as x-admin-token header on every tRPC request
- [x] Fix: AdminDashboard rewritten to remove all OAuth dependency — works purely with password gate
- [x] Admin dashboard shows: name, email, phone, service, event date, guests, budget, status, submission date
- [x] Logout button clears sessionStorage and reloads to show password gate
- [x] Updated inquiry.test.ts to use adminTokenProcedure context (x-admin-token header)
- [x] All 28 vitest tests passing
- [x] Redeploy to preview

## Hero Image Rotation Fix (Apr 9)

- [x] Located: CHEF_REAL_PORTRAIT_2 used as background-image on Private Chef service page
- [x] Downloaded image — confirmed rotated 90° clockwise (EXIF issue in original WebP)
- [x] Rotated 270° CCW (= 90° CW) using Pillow to produce upright portrait
- [x] Uploaded corrected image to CDN: chef_real_portrait_2_fixed_73eb83fd.webp
- [x] Updated CHEF_REAL_PORTRAIT_2 in images.ts to point to corrected CDN URL
- [x] Redeploy to preview

## Email Sending Fix — send.thepplschef.com (Apr 11)

- [x] Audit: real production path is api/inquiries.js (Vercel serverless), not server/email.ts (tRPC)
- [x] Fix api/inquiries.js FROM_ADDRESS: notifications@thepplschef.com → notifications@send.thepplschef.com
- [x] Fix api/inquiries.js OWNER_EMAIL: info@thepplschef.com → saustin@thepplschef.com
- [x] Fix api/inquiries.js: await Promise.allSettled so Vercel doesn't terminate before emails send
- [x] Fix api/inquiries.js: inspect r.value?.error for fulfilled-but-failed Resend sends
- [x] Fix server/email.ts production from address: noreply@thepplschef.com → notifications@send.thepplschef.com
- [x] RESEND_API_KEY confirmed read correctly via process.env in both files
- [x] Deploy to preview and test end-to-end

## Booking Wizard Redesign (Apr 11)

- [x] Audit current wizard structure, steps, and styling
- [x] Redesign with warm luxury aesthetic: warm brownish-dark gradient bg, gold accents, brand typography
- [x] Match homepage brand feel: warm, inviting, premium hospitality
- [x] Improve progress stepper: gold gradient bar, step labels, percentage indicator, step dots
- [x] Refine typography: display font headings, body font for labels/descriptions
- [x] Add smooth transitions between steps (AnimatePresence + spring animations)
- [x] Gold CTA buttons (#ECA241 → #F5A623 gradient) throughout
- [x] Mobile-responsive: fixed bottom nav bar, generous touch targets, app-ready layout
- [x] Improved spacing, padding, visual hierarchy, and card warmth
- [x] All 7 standard steps + 8 meal prep steps tested and working
- [x] All 28 vitest tests passing
- [x] Deploy to preview

## Wizard Visual Impact Redesign (Apr 11)

- [x] Cinematic dark background: food photography with multi-layer warm overlay (communal dining hero, elegant table per step)
- [x] Warm cream cards (#FAF7F2 / #F5F0E8) with soft shadow elevation clearly pop against dark bg
- [x] Design direction: elevated, spacious, premium — depth via shadow not harsh contrast
- [x] Gold as guide accent: subtle selection indicator, progress bar, CTA gradient
- [x] Card hover: y-3 lift + deeper shadow (no glow, no harsh border)
- [x] Selected card: warm cream bg + muted gold border + subtle ring
- [x] Dietary pills: cream surface with gold check badge on select
- [x] Progress bar: gold gradient fill + step labels + percentage
- [x] AnimatePresence page transitions with directional slide
- [x] Review/summary step: elevated cream card, all selections with Edit links per step, consent footer
- [x] All 28 vitest tests passing
- [x] Deploy to preview

## Review Step Reassurance Message (Apr 12)

- [x] Added reassurance message above Submit button on review step: "This isn't a finalized booking — just the start of something great..."
- [x] Styled: text-[13.5px], text-[#F3F1E9]/60, centered, leading-relaxed, mb-4 spacing — readable, warm, not fine print
- [x] 0 TypeScript errors, all 28 vitest tests passing
- [x] Deploy to preview and push to GitHub

## Book CTA Routing Fix (Apr 12)

- [x] Audited all booking CTAs across 12+ files
- [x] Home.tsx: hero "Book Your Experience", "Start Planning", "Get Started" CTAs → /book
- [x] Navbar.tsx: "Book Now" button (desktop + mobile) → /book
- [x] Footer.tsx: "Book Now" link → /book
- [x] ClientReviews.tsx: "Book Your Experience" CTA → /book
- [x] MenusPage.tsx: "Book Your Experience" CTA → /book
- [x] AboutPage.tsx: "Book Your Experience" CTA → /book
- [x] GalleryPage.tsx: "Book Your Experience" CTA → /book
- [x] Fixed stale JSX fragment in BookingWizard.tsx nav bar (replaced <> with <div>)
- [x] Kept: Navbar "Contact" nav item → /contact (correct nav link)
- [x] Kept: FAQPage "Send an Inquiry" → /contact (correct contact action)
- [x] All 28 vitest tests passing
- [x] Deploy to preview and push to GitHub

## Contact Form Repositioning (Apr 12)

- [x] ContactPage.tsx: Added gold "Recommended" pill + "Ready to Book? Start Here." wizard CTA block as primary above form
- [x] ContactPage.tsx: Rewritten hero headline to "Let's Create Something Extraordinary" + wizard-first subtext
- [x] ContactPage.tsx: Inquiry form visually demoted — subdued bg, muted border, ghost submit button, "Prefer to Reach Out Directly?" framing
- [x] ContactPage.tsx: Contact info moved to a compact horizontal strip between CTA and form
- [x] Home.tsx ContactSection: Replaced SectionHeader with wizard-first CTA (gold gradient button, feature pills, reassurance text)
- [x] Home.tsx ContactSection: Fallback form collapsed by default behind "Have a unique request?" toggle — expands on click
- [x] Home.tsx ContactSection: Form styled subdued (muted borders, ghost submit button)
- [x] All 28 vitest tests passing, 0 TypeScript errors
- [x] Deploy to preview and push to GitHub

## Homepage Hero Image Overhaul (Apr 12)

- [x] Homepage hero: Replaced HERO_BG with overhead fine-dining table shot — multiple gourmet plated dishes, wine glasses, hands reaching, people actively eating, warm golden lighting
- [x] Audit all page heroes against rule: must show food OR chef cooking/serving/plating
- [x] Private Chef Experience ✅ (chef in action, food visible)
- [x] Full-Service Catering ✅ (chef serving, food visible)
- [x] Chef-Crafted Meal Boxes ✅ (food visible)
- [x] Special Events & Celebrations ✅ (chef with torch, food visible, people eating)
- [x] Corporate & Group Dining ✅ (food visible)
- [x] All 28 vitest tests passing, 0 TypeScript errors
- [x] Deploy to preview ONLY (no GitHub push until owner approves)

## Card CSS/Design Overhaul + Hero Regeneration (Apr 12)

- [x] Replace thin borders with tiered soft shadows on ALL card components
- [x] Add "active" lift (translateY(-8px)) for selected cards
- [x] Double internal padding on all cards for premium breathing room
- [x] Replace flat gold borders with subtle gold glow (#ECA241) on selected state
- [x] Typography: Fredoka for card headers, Outfit for body copy (brand fonts)
- [x] Ensure design feels luxury hospitality, not software UI
- [x] Regenerate homepage hero image — cinematic overhead fine-dining v2
- [x] Run TypeScript checks and tests
- [x] Deploy to preview only (no GitHub push)

## Curated Culinary Storytelling Gallery (Apr 12)

- [x] Replace current gallery categories with 4 filters: All | Private Dining | Meal Prep | The Process
- [x] Sticky experience filter bar at top of gallery with Gold (#ECA241) active state, editorial headline font
- [x] Masonry layout with variable image heights (editorial/luxury hospitality feel, not uniform grid)
- [x] Hover reveal on desktop: soft Cream (#F3F1E9) overlay at ~80% opacity with Chef's Note (title + one-line description)
- [x] Full-screen lightbox: deep black (#000000) bg, high-res image, "Request This Experience" CTA linking to /book
- [x] Smooth 300ms ease-in-out filter transitions — no flicker, snapping, or jarring rearrangement
- [x] Categorize images by intent: Private Dining (elegant plated, tablescapes, service), Meal Prep (organized, abundant, practical luxury), The Process (behind-the-scenes, prep, finishing, hospitality details)
- [x] Add Chef's Note metadata (title + description) to every gallery image
- [x] Visual standard: curated Las Vegas culinary gallery, NOT social media feed
- [x] Update homepage gallery preview section to match new design language
- [x] Run TypeScript checks and all vitest tests (16 new gallery tests + 28 existing = 44 total)
- [x] Deploy to preview only (no GitHub push)

## Pre-Launch Priority Fixes (Apr 13 — 7-Day Window)

- [x] Fix /pricing route — create premium pricing page with starting points, package logic, custom quote explanation, on-brand dark/gold luxury aesthetic, CTAs to book or request custom quote
- [x] Secure /admin route — add noindex meta tag, remove any public links to /admin, keep password gate, make route less discoverable
- [x] Strengthen homepage hero messaging — tighter headline, subheadline, CTA language for maximum emotional impact, value proposition clear within 3 seconds
- [x] Polish booking wizard — crystal clear selection states, visible/intuitive progress indicators, fix touch targets (min 44px), smooth step transitions, effortless feel
- [x] Add proper robots.txt — valid robots.txt allowing crawling, pointing to sitemap, served as text/plain
- [x] Add proper sitemap.xml — valid XML sitemap listing all public routes, served as application/xml, noindex for /admin
- [x] Fix analytics placeholder error — removed Umami script (GA4 already configured with G-QHP2QP8FHE)
- [x] Fix homepage performance — hero image preload + fetchpriority=high, CDN preconnect, vendor/motion/trpc code splitting for smaller initial JS bundle
- [x] Run all tests after changes (44 tests passing, 0 TypeScript errors)
- [x] Deploy to preview only (no GitHub push)

## Premium Social Sharing / OG Meta Tags (Apr 13)

- [x] Create 1200x630 OG images for each major page from existing photography, upload to CDN
- [x] Create favicon set (favicon.ico, apple-touch-icon 180x180, favicon-32x32, favicon-16x16) from logo, upload to CDN
- [x] Build server-side meta tag injection in Express (social crawlers don't execute JS)
- [x] Define per-route metadata: og:title, og:description, og:image, twitter:card, twitter:title, twitter:description, twitter:image
- [x] Routes needing unique meta: /, /about, /menus, /gallery, /pricing, /book, /faq, /contact, /admin (noindex), /private-chef-las-vegas, /catering-las-vegas, /meal-prep-las-vegas, /special-events-las-vegas, /corporate-catering-las-vegas
- [x] All OG images must be exactly 1200x630px for WhatsApp/iMessage preview
- [x] twitter:card must be summary_large_image on every page
- [x] Favicon links in HTML head for all sizes
- [x] Verify with curl that social crawlers see correct meta per route
- [x] Run all tests after changes (62 tests passing, 18 new ogMeta tests)
- [x] Deploy to preview only (no GitHub push)
