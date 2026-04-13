/**
 * GalleryPage — Curated Culinary Storytelling
 *
 * A premium editorial gallery that sells the experience before guests
 * reach the booking form. Four story-driven categories:
 *   All | Private Dining | Meal Prep | The Process
 *
 * Features:
 *  - Sticky experience filter bar with Gold active state + editorial font
 *  - CSS-column masonry with variable image heights
 *  - Hover reveal: soft Cream overlay with Chef's Note (title + description)
 *  - Full-screen lightbox on deep black with "Request This Experience" CTA
 *  - Smooth 300ms ease-in-out filter transitions (no flicker/snap)
 *
 * BRAND: Abril Fatface display, DM Sans body, Fredoka card headings, Outfit card body.
 * Colors: Red #D82E2B, Gold #ECA241, Black #000, Cream #F3F1E9.
 */
import { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import {
  ELEGANT_TABLE, CARVING_STATION,
  BEET_SALAD_SIDE, SHRIMP_CREAM_SAUCE, GLAZED_RIBS, PASTRY_TURNOVER,
  DEVILED_EGGS_1, DEVILED_EGGS_2, CAST_IRON_DISH,
  BEET_SALAD_OVERHEAD, BEET_SALAD_CLOSE,
  MEAL_PREP_OVERHEAD_MULTI, MEAL_PREP_GLAZED_SALMON,
  MEAL_PREP_SHRIMP_FAJITA, MEAL_PREP_4BOX_SPREAD,
  MEAL_PREP_GRILLED_CHICKEN, MEAL_PREP_CHICKEN_FAJITA, MEAL_PREP_TAMALES,
  SEAFOOD_BOIL_CHEF, SEAFOOD_BOIL_CLOSE, SEAFOOD_BOIL_OVERHEAD, SEAFOOD_BOIL_CRAB,
  CHEF_REAL_PORTRAIT_1, CHEF_REAL_PORTRAIT_2,
  OUTDOOR_COOKING, PREP_TABLE, CHEF_PLATING,
  BUFFET_SERVICE,
  NEW_EVENT_1, NEW_EVENT_2, NEW_EVENT_3,
  EVENT_2025_APR, EVENT_2025_OCT,
} from "@/lib/images";

/* ─── Additional image constants defined locally (already in GalleryPage) ─── */
const LOBSTER_ARUGULA_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/1000009782_5e250fdb.jpg";
const CAKE_STRAWBERRY_GOLD_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/1000009779_dba1ce09.jpg";
const SHORT_RIBS_MASH_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/1000009757_cbeaad6b.jpg";
const CHEF_CORN_ACTION = "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/1000009778_dd995839.jpg";
const DINING_TABLE_ROSES_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/1000009777_38884111.jpg";
const LOBSTER_SALAD_PLATES_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/1000009763_4409134e.jpg";
const CHEF_PLATING_ACTION = "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/1000009764_5d202dab.jpg";
const OYSTERS_LIME_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/1000009758_0917ba42.jpg";

/* ─── Types ─── */
type GalleryCategory = "All" | "Private Dining" | "Meal Prep" | "The Process";

interface GalleryItem {
  src: string;
  title: string;
  description: string;
  category: Exclude<GalleryCategory, "All">;
  /** Which booking service to link to from lightbox CTA */
  bookingService: string;
}

/* ─── Gallery Data with Chef's Notes ─── */
const galleryItems: GalleryItem[] = [
  // ═══ PRIVATE DINING ═══
  // Elegant plated experiences, intimate tablescapes, refined service
  {
    src: LOBSTER_ARUGULA_URL,
    title: "Whole Roasted Lobster",
    description: "Butter-poached lobster with arugula, feta, and citrus vinaigrette.",
    category: "Private Dining",
    bookingService: "private-chef",
  },
  {
    src: SHORT_RIBS_MASH_URL,
    title: "Braised Short Ribs",
    description: "Slow-braised short ribs with creamy mashed potatoes and roasted carrots.",
    category: "Private Dining",
    bookingService: "private-chef",
  },
  {
    src: OYSTERS_LIME_URL,
    title: "Oysters on the Half Shell",
    description: "Fresh oysters with mignonette, lime, and champagne granita.",
    category: "Private Dining",
    bookingService: "private-chef",
  },
  {
    src: DINING_TABLE_ROSES_URL,
    title: "Intimate Tablescape",
    description: "White roses, candlelight, and fine china — set for an unforgettable evening.",
    category: "Private Dining",
    bookingService: "private-chef",
  },
  {
    src: LOBSTER_SALAD_PLATES_URL,
    title: "Lobster Salad Course",
    description: "Chilled lobster with mixed greens, plated for a private dinner service.",
    category: "Private Dining",
    bookingService: "private-chef",
  },
  {
    src: BEET_SALAD_SIDE,
    title: "Roasted Beet Salad",
    description: "Citrus-kissed beets with goat cheese, pistachios, and balsamic reduction.",
    category: "Private Dining",
    bookingService: "private-chef",
  },
  {
    src: SHRIMP_CREAM_SAUCE,
    title: "Jumbo Shrimp",
    description: "Pan-seared jumbo shrimp in house cream sauce with charred citrus.",
    category: "Private Dining",
    bookingService: "private-chef",
  },
  {
    src: GLAZED_RIBS,
    title: "Signature Glazed Ribs",
    description: "Fall-off-the-bone ribs with our house glaze — a guest favorite.",
    category: "Private Dining",
    bookingService: "private-chef",
  },
  {
    src: PASTRY_TURNOVER,
    title: "Golden Pastry Turnover",
    description: "Flaky pastry with savory filling and red wine dipping sauce.",
    category: "Private Dining",
    bookingService: "private-chef",
  },
  {
    src: DEVILED_EGGS_2,
    title: "Elevated Deviled Eggs",
    description: "Tobiko, microgreens, and a touch of truffle oil on classic deviled eggs.",
    category: "Private Dining",
    bookingService: "private-chef",
  },
  {
    src: CAST_IRON_DISH,
    title: "Cast Iron Meatballs",
    description: "Rustic meatballs in marinara with artisan bread — comfort meets craft.",
    category: "Private Dining",
    bookingService: "private-chef",
  },
  {
    src: ELEGANT_TABLE,
    title: "Private Dinner Setting",
    description: "Elegant place settings for an intimate home dining experience.",
    category: "Private Dining",
    bookingService: "private-chef",
  },
  {
    src: CAKE_STRAWBERRY_GOLD_URL,
    title: "Celebration Cake",
    description: "White cake with fresh strawberries and gold candles — made for the moment.",
    category: "Private Dining",
    bookingService: "special-event",
  },
  {
    src: SEAFOOD_BOIL_CHEF,
    title: "Chef Stephen's Seafood Boil",
    description: "A signature spread of crab, shrimp, corn, and sausage — served communal style.",
    category: "Private Dining",
    bookingService: "private-chef",
  },
  {
    src: SEAFOOD_BOIL_OVERHEAD,
    title: "The Full Spread",
    description: "Overhead view of our signature boil — abundance and warmth on every table.",
    category: "Private Dining",
    bookingService: "private-chef",
  },
  {
    src: SEAFOOD_BOIL_CRAB,
    title: "Crab & Shrimp Boil",
    description: "King crab claws, jumbo shrimp, and lemon — fresh from the pot.",
    category: "Private Dining",
    bookingService: "private-chef",
  },
  {
    src: NEW_EVENT_1,
    title: "Catered Event Spread",
    description: "Full-service catering with elegant presentation for a private celebration.",
    category: "Private Dining",
    bookingService: "catering",
  },
  {
    src: EVENT_2025_OCT,
    title: "October Celebration",
    description: "A fall-inspired event with seasonal dishes and warm hospitality.",
    category: "Private Dining",
    bookingService: "catering",
  },
  {
    src: NEW_EVENT_2,
    title: "Premium Catering Service",
    description: "Plated courses and buffet stations crafted for a seamless guest experience.",
    category: "Private Dining",
    bookingService: "catering",
  },
  {
    src: CARVING_STATION,
    title: "Live Carving Station",
    description: "Chef-attended carving station — prime rib sliced to order for each guest.",
    category: "Private Dining",
    bookingService: "catering",
  },

  // ═══ MEAL PREP ═══
  // Clean, organized, abundant, practical luxury
  {
    src: MEAL_PREP_OVERHEAD_MULTI,
    title: "Weekly Meal Prep",
    description: "Chef-prepared containers — balanced, beautiful, and ready for the week.",
    category: "Meal Prep",
    bookingService: "meal-prep",
  },
  {
    src: MEAL_PREP_GLAZED_SALMON,
    title: "Glazed Salmon Bowl",
    description: "Honey-glazed salmon with sesame rice and seasonal vegetables.",
    category: "Meal Prep",
    bookingService: "meal-prep",
  },
  {
    src: MEAL_PREP_SHRIMP_FAJITA,
    title: "Shrimp Fajita Bowl",
    description: "Seasoned shrimp with peppers, rice, and warm tortilla on the side.",
    category: "Meal Prep",
    bookingService: "meal-prep",
  },
  {
    src: MEAL_PREP_4BOX_SPREAD,
    title: "Four-Box Spread",
    description: "Grilled proteins with fresh sides — variety and nutrition in every box.",
    category: "Meal Prep",
    bookingService: "meal-prep",
  },
  {
    src: MEAL_PREP_GRILLED_CHICKEN,
    title: "Grilled Chicken Plate",
    description: "Herb-marinated chicken with roasted vegetables and quinoa.",
    category: "Meal Prep",
    bookingService: "meal-prep",
  },
  {
    src: MEAL_PREP_CHICKEN_FAJITA,
    title: "Chicken Fajita Bowl",
    description: "Spiced chicken with sautéed peppers, cilantro lime rice, and pico.",
    category: "Meal Prep",
    bookingService: "meal-prep",
  },
  {
    src: MEAL_PREP_TAMALES,
    title: "Handmade Tamales",
    description: "Traditional tamales made from scratch — comfort food elevated.",
    category: "Meal Prep",
    bookingService: "meal-prep",
  },

  // ═══ THE PROCESS ═══
  // Behind-the-scenes chef work, prep, finishing, hospitality details
  {
    src: CHEF_CORN_ACTION,
    title: "Brushing the Corn",
    description: "Chef Stephen finishing corn on the cob with herb butter — hands-on craft.",
    category: "The Process",
    bookingService: "private-chef",
  },
  {
    src: CHEF_PLATING_ACTION,
    title: "Plating in Your Kitchen",
    description: "Precision plating of lobster dishes in a private home kitchen.",
    category: "The Process",
    bookingService: "private-chef",
  },
  {
    src: CHEF_PLATING,
    title: "The Art of Plating",
    description: "Every plate is composed with intention — color, texture, and balance.",
    category: "The Process",
    bookingService: "private-chef",
  },
  {
    src: PREP_TABLE,
    title: "Fresh Ingredients",
    description: "Sourced daily — the foundation of every dish starts with quality.",
    category: "The Process",
    bookingService: "private-chef",
  },
  {
    src: OUTDOOR_COOKING,
    title: "Outdoor Kitchen Setup",
    description: "Bringing the kitchen to you — grilling and prep in any setting.",
    category: "The Process",
    bookingService: "private-chef",
  },
  {
    src: CHEF_REAL_PORTRAIT_1,
    title: "Chef Stephen Austin",
    description: "The People's Chef — bringing restaurant-quality dining to your door.",
    category: "The Process",
    bookingService: "private-chef",
  },
  {
    src: CHEF_REAL_PORTRAIT_2,
    title: "Your Private Chef",
    description: "Branded, professional, and passionate about every plate.",
    category: "The Process",
    bookingService: "private-chef",
  },
  {
    src: SEAFOOD_BOIL_CLOSE,
    title: "The Details",
    description: "Mussels, clams, and lemon — every element placed with care.",
    category: "The Process",
    bookingService: "private-chef",
  },
  {
    src: BUFFET_SERVICE,
    title: "Full Service Setup",
    description: "From chafers to garnish — every detail of the buffet is handled.",
    category: "The Process",
    bookingService: "catering",
  },
  {
    src: BEET_SALAD_OVERHEAD,
    title: "Overhead Composition",
    description: "Arugula, beets, and pistachios — composed for the eye and the palate.",
    category: "The Process",
    bookingService: "private-chef",
  },
  {
    src: BEET_SALAD_CLOSE,
    title: "Finishing Touches",
    description: "Balsamic reduction drizzled with precision — the final brushstroke.",
    category: "The Process",
    bookingService: "private-chef",
  },
  {
    src: DEVILED_EGGS_1,
    title: "Caviar Garnish",
    description: "Gourmet deviled eggs crowned with caviar — small bites, big impact.",
    category: "The Process",
    bookingService: "private-chef",
  },
];

const categories: GalleryCategory[] = ["All", "Private Dining", "Meal Prep", "The Process"];

/* ─── Category descriptions for the hero area ─── */
const categoryDescriptions: Record<GalleryCategory, string> = {
  "All": "A curated collection of dishes, experiences, and moments crafted by The PPL's Chef.",
  "Private Dining": "Elegant plated experiences, intimate tablescapes, and refined service — dining reimagined in your space.",
  "Meal Prep": "Clean, organized, abundant — practical luxury delivered to your door every week.",
  "The Process": "Behind the scenes — the craft, the prep, the finishing touches that make every plate extraordinary.",
};

/* ─── Masonry height classes for visual variety ─── */
const heightClasses = [
  "aspect-[3/4]",   // tall portrait
  "aspect-[4/5]",   // medium portrait
  "aspect-square",   // square
  "aspect-[5/4]",   // slightly wide
  "aspect-[3/4]",   // tall portrait
  "aspect-[4/3]",   // landscape
  "aspect-[4/5]",   // medium portrait
  "aspect-square",   // square
];

function getHeightClass(index: number): string {
  return heightClasses[index % heightClasses.length];
}

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const filterBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Culinary Gallery | The PPL's Chef | Las Vegas";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Explore the curated culinary gallery of The PPL's Chef — private dining, meal prep, and behind-the-scenes moments from Las Vegas's premier private chef.");
    window.scrollTo(0, 0);
  }, []);

  const filtered = activeCategory === "All"
    ? galleryItems
    : galleryItems.filter(g => g.category === activeCategory);

  const handleCategoryChange = useCallback((cat: GalleryCategory) => {
    if (cat === activeCategory) return;
    setIsTransitioning(true);
    // Brief fade-out, then switch, then fade-in
    setTimeout(() => {
      setActiveCategory(cat);
      setIsTransitioning(false);
    }, 150);
  }, [activeCategory]);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex(prev => prev !== null ? (prev - 1 + filtered.length) % filtered.length : null);
  const nextImage = () => setLightboxIndex(prev => prev !== null ? (prev + 1) % filtered.length : null);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, filtered.length]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIndex]);

  return (
    <Layout>
      {/* ═══ HERO ═══ */}
      <section className="relative py-32 pb-20 bg-black overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-cover bg-center" style={{ backgroundImage: `url(${SEAFOOD_BOIL_OVERHEAD})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />
        <div className="relative z-10 container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="w-10 h-[1px] bg-[#ECA241]" />
              <span className="brand-label">Curated Collection</span>
              <div className="w-10 h-[1px] bg-[#ECA241]" />
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-6xl text-[#F3F1E9] leading-tight mb-5">
              Culinary <span className="text-[#ECA241]">Gallery</span>
            </h1>
            <p className="text-[#F3F1E9]/50 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              {categoryDescriptions[activeCategory]}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ STICKY EXPERIENCE FILTER BAR ═══ */}
      <div
        ref={filterBarRef}
        className="sticky top-[64px] z-40 bg-black/98 backdrop-blur-xl border-b border-[#ECA241]/10"
      >
        <div className="container">
          <div className="flex items-center justify-center gap-2 sm:gap-6 py-5 overflow-x-auto scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`relative px-4 sm:px-6 py-2 text-sm sm:text-base tracking-[0.08em] whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat
                    ? "text-[#ECA241] font-semibold"
                    : "text-[#F3F1E9]/40 hover:text-[#F3F1E9]/70 font-medium"
                }`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                {cat}
                {/* Gold underline for active state */}
                {activeCategory === cat && (
                  <motion.div
                    layoutId="gallery-filter-underline"
                    className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#ECA241]"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ MASONRY GALLERY ═══ */}
      <section className="section-dark py-16 lg:py-24 min-h-[60vh]">
        <div className="container">
          <div
            className={`transition-opacity duration-300 ease-in-out ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="columns-2 md:columns-3 gap-4 lg:gap-5 space-y-4 lg:space-y-5">
              {filtered.map((item, i) => (
                <motion.div
                  key={`${activeCategory}-${item.src}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.4), ease: "easeOut" }}
                  className="break-inside-avoid group cursor-pointer relative overflow-hidden"
                  onClick={() => openLightbox(i)}
                >
                  {/* Image */}
                  <div className={`relative overflow-hidden ${getHeightClass(i)}`}>
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      loading="lazy"
                    />

                    {/* Hover overlay — soft Cream at ~80% opacity with Chef's Note */}
                    <div className="absolute inset-0 bg-[#F3F1E9]/0 group-hover:bg-[#F3F1E9]/80 transition-all duration-300 ease-in-out flex flex-col items-start justify-end p-5 sm:p-7">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out transform translate-y-3 group-hover:translate-y-0">
                        <h3
                          className="text-black text-base sm:text-lg font-semibold leading-tight mb-1.5"
                          style={{ fontFamily: "var(--font-card-heading)" }}
                        >
                          {item.title}
                        </h3>
                        <p
                          className="text-black/60 text-sm leading-relaxed"
                          style={{ fontFamily: "var(--font-card-body)" }}
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-[#F3F1E9]/30 text-lg py-24" style={{ fontFamily: "var(--font-body)" }}>
              No images in this category yet.
            </p>
          )}
        </div>
      </section>

      {/* ═══ BOTTOM CTA ═══ */}
      <section className="section-cream py-16 lg:py-20">
        <div className="container text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-[1px] bg-[#D82E2B]" />
            <span className="brand-label text-[#D82E2B]">Your Turn</span>
            <div className="w-8 h-[1px] bg-[#D82E2B]" />
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-3xl lg:text-4xl text-black leading-tight mb-4">
            Ready to Create Your <span className="text-[#D82E2B]">Own Moments?</span>
          </h2>
          <p className="text-black/50 text-base mb-8 max-w-xl mx-auto leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
            Let us bring the same level of artistry and care to your next event.
          </p>
          <Link href="/book" className="btn-primary">
            Book Your Experience
          </Link>
        </div>
      </section>

      {/* ═══ FULL-SCREEN LIGHTBOX ═══ */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-5 right-5 sm:top-8 sm:right-8 text-white/50 hover:text-white transition-colors z-10 p-2"
              aria-label="Close lightbox"
            >
              <X size={28} />
            </button>

            {/* Prev / Next arrows */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/80 transition-colors z-10 p-2"
              aria-label="Previous image"
            >
              <ChevronLeft size={36} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/80 transition-colors z-10 p-2"
              aria-label="Next image"
            >
              <ChevronRight size={36} />
            </button>

            {/* Image */}
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              src={filtered[lightboxIndex].src}
              alt={filtered[lightboxIndex].title}
              className="max-h-[70vh] max-w-[90vw] sm:max-w-[80vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Chef's Note + CTA below image */}
            <div
              className="mt-6 sm:mt-8 text-center max-w-lg px-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3
                className="text-[#F3F1E9] text-lg sm:text-xl font-semibold mb-1.5"
                style={{ fontFamily: "var(--font-card-heading)" }}
              >
                {filtered[lightboxIndex].title}
              </h3>
              <p
                className="text-[#F3F1E9]/50 text-sm sm:text-base leading-relaxed mb-5"
                style={{ fontFamily: "var(--font-card-body)" }}
              >
                {filtered[lightboxIndex].description}
              </p>
              <Link
                href={`/book?service=${filtered[lightboxIndex].bookingService}`}
                className="inline-flex items-center gap-2.5 px-8 py-3 bg-[#ECA241] text-black text-sm font-semibold tracking-wider uppercase hover:bg-[#f0b050] transition-all duration-300"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Request This Experience <ArrowRight size={16} />
              </Link>
              <div className="mt-4 text-[#F3F1E9]/25 text-xs" style={{ fontFamily: "var(--font-body)" }}>
                {lightboxIndex + 1} / {filtered.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
