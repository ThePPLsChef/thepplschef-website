/**
 * GalleryPage — Dedicated Gallery page for The PPL's Chef
 * Full photo collection with category tabs and lightbox.
 * BRAND: Abril Fatface headings, DM Sans body.
 * Colors: Red #D82E2B, Gold #ECA241, Black #000, Cream #F3F1E9.
 */
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Layout from "@/components/Layout";
import {
  LOGO_PRIMARY, GALLERY_IMAGES,
  SEAFOOD_BOIL_CHEF, SEAFOOD_BOIL_CLOSE, SEAFOOD_BOIL_OVERHEAD, SEAFOOD_BOIL_CRAB,
  BEET_SALAD_SIDE, SHRIMP_CREAM_SAUCE, GLAZED_RIBS, PASTRY_TURNOVER,
  DEVILED_EGGS_1, DEVILED_EGGS_2, CAST_IRON_DISH, BEET_SALAD_OVERHEAD, BEET_SALAD_CLOSE,
  ELEGANT_TABLE, CARVING_STATION, CHEF_PLATING, BUFFET_SERVICE,
  MEAL_PREP_OVERHEAD_MULTI, MEAL_PREP_GLAZED_SALMON, MEAL_PREP_SHRIMP_FAJITA, MEAL_PREP_4BOX_SPREAD,
  NEW_EVENT_1, NEW_EVENT_2, NEW_EVENT_3, EVENT_2025_APR, EVENT_2025_OCT,
  CHEF_REAL_PORTRAIT_1, CHEF_REAL_PORTRAIT_2, OUTDOOR_COOKING, PREP_TABLE,
} from "@/lib/images";

const fontBody = { fontFamily: "var(--font-body)" };

type GalleryItem = { src: string; alt: string; category: string };

const galleryItems: GalleryItem[] = [
  // Signature Dishes
  { src: BEET_SALAD_SIDE, alt: "Roasted beet salad with citrus and goat cheese", category: "Signature Dishes" },
  { src: SHRIMP_CREAM_SAUCE, alt: "Jumbo shrimp in house cream sauce with charred citrus", category: "Signature Dishes" },
  { src: GLAZED_RIBS, alt: "Fall-off-the-bone glazed ribs", category: "Signature Dishes" },
  { src: PASTRY_TURNOVER, alt: "Golden pastry turnover with red wine dipping sauce", category: "Signature Dishes" },
  { src: DEVILED_EGGS_2, alt: "Elevated deviled eggs with tobiko and microgreens", category: "Signature Dishes" },
  { src: DEVILED_EGGS_1, alt: "Gourmet deviled eggs with caviar garnish", category: "Signature Dishes" },
  { src: CAST_IRON_DISH, alt: "Cast iron meatball dish with artisan bread", category: "Signature Dishes" },
  { src: BEET_SALAD_OVERHEAD, alt: "Overhead beet salad with arugula and pistachios", category: "Signature Dishes" },
  { src: BEET_SALAD_CLOSE, alt: "Close-up beet salad with balsamic reduction", category: "Signature Dishes" },
  // Private Dining
  { src: ELEGANT_TABLE, alt: "Elegant table setting for a private dinner event", category: "Private Dining" },
  { src: CARVING_STATION, alt: "Live carving station at a catered event", category: "Private Dining" },
  { src: CHEF_PLATING, alt: "Chef plating a dish with precision", category: "Private Dining" },
  // Catering Events
  { src: NEW_EVENT_1, alt: "Elegant catered event spread", category: "Catering Events" },
  { src: EVENT_2025_OCT, alt: "October 2025 catering event", category: "Catering Events" },
  { src: NEW_EVENT_2, alt: "Premium catering service", category: "Catering Events" },
  { src: EVENT_2025_APR, alt: "April 2025 private event", category: "Catering Events" },
  { src: NEW_EVENT_3, alt: "Full-service catering setup", category: "Catering Events" },
  { src: BUFFET_SERVICE, alt: "Full buffet service spread", category: "Catering Events" },
  // Meal Prep
  { src: MEAL_PREP_OVERHEAD_MULTI, alt: "Overhead view of chef-prepared meal containers", category: "Meal Prep" },
  { src: MEAL_PREP_GLAZED_SALMON, alt: "Glazed salmon with sesame rice and vegetables", category: "Meal Prep" },
  { src: MEAL_PREP_SHRIMP_FAJITA, alt: "Shrimp fajita bowl with rice and tortilla", category: "Meal Prep" },
  { src: MEAL_PREP_4BOX_SPREAD, alt: "Four-box spread of grilled protein meals", category: "Meal Prep" },
  // Seafood Boil
  { src: SEAFOOD_BOIL_CHEF, alt: "Chef Stephen behind a full seafood boil spread", category: "Seafood Boil" },
  { src: SEAFOOD_BOIL_OVERHEAD, alt: "Overhead view of shrimp, crab, and corn spread", category: "Seafood Boil" },
  { src: SEAFOOD_BOIL_CLOSE, alt: "Close-up of mussels, clams, and lemon", category: "Seafood Boil" },
  { src: SEAFOOD_BOIL_CRAB, alt: "Crab claws, shrimp, and lemon", category: "Seafood Boil" },
  // Behind the Scenes
  { src: CHEF_REAL_PORTRAIT_1, alt: "Chef Stephen in branded PPL's Chef coat", category: "Behind the Scenes" },
  { src: CHEF_REAL_PORTRAIT_2, alt: "Chef Stephen — front facing portrait", category: "Behind the Scenes" },
  { src: OUTDOOR_COOKING, alt: "Outdoor cooking setup", category: "Behind the Scenes" },
  { src: PREP_TABLE, alt: "Fresh ingredients on the prep table", category: "Behind the Scenes" },
];

const categories = ["All", ...Array.from(new Set(galleryItems.map(g => g.category)))];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    document.title = "Gallery | The PPL's Chef | Las Vegas";
    window.scrollTo(0, 0);
  }, []);

  const filtered = activeCategory === "All" ? galleryItems : galleryItems.filter(g => g.category === activeCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex(prev => prev !== null ? (prev - 1 + filtered.length) % filtered.length : null);
  const nextImage = () => setLightboxIndex(prev => prev !== null ? (prev + 1) % filtered.length : null);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-32 pb-16 bg-black overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: `url(${SEAFOOD_BOIL_OVERHEAD})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black" />
        <div className="relative z-10 container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-[#ECA241]" />
              <span className="brand-label">Our Work</span>
              <div className="w-8 h-[1px] bg-[#ECA241]" />
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-6xl text-[#F3F1E9] leading-tight mb-4">
              Event <span className="text-[#ECA241]">Gallery</span>
            </h1>
            <p className="text-[#F3F1E9]/55 text-lg max-w-2xl mx-auto" style={fontBody}>
              Browse our collection of signature dishes, private dining events, catering setups, and more.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="bg-black border-b border-white/5 sticky top-[72px] z-30">
        <div className="container">
          <div className="flex gap-1 overflow-x-auto py-4 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 text-xs tracking-widest uppercase font-semibold whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-[#D82E2B] text-white"
                    : "text-[#F3F1E9]/50 hover:text-[#ECA241] hover:bg-white/5"
                }`}
                style={fontBody}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-dark py-16 lg:py-24">
        <div className="container">
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            {filtered.map((img, i) => (
              <motion.div
                key={`${activeCategory}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.06 }}
                className="break-inside-avoid group cursor-pointer relative overflow-hidden border-2 border-transparent hover:border-[#ECA241] transition-all duration-300"
                onClick={() => openLightbox(i)}
              >
                <img src={img.src} alt={img.alt} className="w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-end justify-start p-4">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs tracking-wider uppercase font-semibold" style={fontBody}>
                    {img.alt}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-[#F3F1E9]/40 text-lg py-20" style={fontBody}>No images in this category yet.</p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section-cream py-16 lg:py-20">
        <div className="container text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl lg:text-4xl text-black leading-tight mb-4">
            Ready to Create Your <span className="text-[#D82E2B]">Own Moments?</span>
          </h2>
          <p className="text-black/50 text-base mb-8 max-w-xl mx-auto" style={fontBody}>
            Let us bring the same level of artistry and care to your next event.
          </p>
          <Link href="/contact" className="btn-primary">Book Your Experience</Link>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button onClick={closeLightbox} className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10" aria-label="Close lightbox">
              <X size={32} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-10" aria-label="Previous image">
              <ChevronLeft size={40} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-10" aria-label="Next image">
              <ChevronRight size={40} />
            </button>
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              src={filtered[lightboxIndex].src}
              alt={filtered[lightboxIndex].alt}
              className="max-h-[85vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
              <div className="text-white/80 text-sm mb-1" style={fontBody}>{filtered[lightboxIndex].alt}</div>
              <div className="text-white/40 text-xs" style={fontBody}>{lightboxIndex + 1} / {filtered.length}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
