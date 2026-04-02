/*
 * Gallery — Smokehouse Editorial Design
 * Masonry-style photo grid on cream background.
 * Uses all provided real event photos.
 * Lightbox-style overlay on click.
 * LOGO appears as subtle watermark overlay on section.
 * BRAND FONTS: Abril Fatface for headings, DM Sans for body.
 * BRAND COLORS: Red #D82E2B, Gold #ECA241, Black #000, Cream #F3F1E9.
 */
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/photo_AQAD2gtrG-WvaEZ-_2eac18e2.jpg";

const galleryImages = [
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/photo_AQAD5QtrG-WvaEZ-_6f944946.jpg", alt: "Seafood bowls presentation" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/photo_AQAD6gtrG-WvaEZ-_90370ee0.jpg", alt: "Elegant table setting" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/photo_AQAD5gtrG-WvaEZ-_0434f69d.jpg", alt: "Plated salad course" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/photo_AQAD8AtrG-WvaEZ-_4ea0cc45.jpg", alt: "Outdoor party decor" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/photo_AQAD7AtrG-WvaEZ-_a9f936ea.jpg", alt: "Grilled romaine dish" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/photo_AQAD9AtrG-WvaEZ-_a36b8ed2.jpg", alt: "Carving station" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/photo_AQAD6wtrG-WvaEZ-_c236d98d.jpg", alt: "Prep table with fresh ingredients" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/photo_AQAD7wtrG-WvaEZ-_456232e8.jpg", alt: "Meat chafer dish" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/photo_AQAD8wtrG-WvaEZ-_af31db2b.jpg", alt: "Dessert table overhead" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/photo_AQAD5wtrG-WvaEZ-_6f0837a6.jpg", alt: "Salad line buffet" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/photo_AQAD6AtrG-WvaEZ-_b91f04f8.jpg", alt: "Outdoor cooking pot" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/photo_AQAD9QtrG-WvaEZ-_ee856e38.jpg", alt: "Buffet service spread" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/photo_AQAD7gtrG-WvaEZ-_d509ab84.jpg", alt: "Green beans chafer" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/photo_AQAD8QtrG-WvaEZ-_7b9f1552.jpg", alt: "Mashed potatoes chafer" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/photo_AQAD8gtrG-WvaEZ-_aea8950c.jpg", alt: "Dessert table display" },
  { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/photo_AQAD6QtrG-WvaEZ-_fd290b00.jpg", alt: "Chef plating in action" },
];

export default function Gallery() {
  const headerRef = useRef(null);
  const isInView = useInView(headerRef, { once: true, margin: "-100px" });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex((prev) => (prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : null));
  const nextImage = () => setLightboxIndex((prev) => (prev !== null ? (prev + 1) % galleryImages.length : null));

  return (
    <section id="gallery" className="relative bg-[#F3F1E9] py-24 lg:py-32 overflow-hidden">
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#ECA241] to-transparent absolute top-0 left-0 right-0" />

      {/* LOGO WATERMARK — subtle brand signature */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none z-0">
        <img
          src={LOGO_URL}
          alt=""
          className="w-[500px] h-[500px] object-contain"
        />
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-[2px] bg-[#D82E2B]" />
            <span className="text-[#D82E2B] text-sm font-semibold tracking-[0.3em] uppercase font-[family-name:var(--font-body)]">
              Our Work
            </span>
            <div className="w-10 h-[2px] bg-[#D82E2B]" />
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold text-black leading-tight">
            Event <span className="text-[#D82E2B]">Gallery</span>
          </h2>
          <p className="mt-5 text-black/60 text-lg max-w-2xl mx-auto font-[family-name:var(--font-body)]">
            A glimpse into the events, dishes, and experiences we've crafted for our clients.
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
              className="break-inside-avoid group cursor-pointer relative overflow-hidden border-2 border-transparent hover:border-[#ECA241] transition-all duration-300"
              onClick={() => openLightbox(i)}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm tracking-wider uppercase font-semibold font-[family-name:var(--font-body)]">
                  View
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

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
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
              aria-label="Close lightbox"
            >
              <X size={32} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={40} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronRight size={40} />
            </button>
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              src={galleryImages[lightboxIndex].src}
              alt={galleryImages[lightboxIndex].alt}
              className="max-h-[85vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-6 text-white/50 text-sm font-[family-name:var(--font-body)]">
              {lightboxIndex + 1} / {galleryImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#ECA241] to-transparent absolute bottom-0 left-0 right-0" />
    </section>
  );
}
