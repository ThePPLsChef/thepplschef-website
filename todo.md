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
