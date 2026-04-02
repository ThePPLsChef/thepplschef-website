/**
 * Gallery — Premium rebuild
 * Masonry-style photo grid with lightbox.
 * BRAND: Abril Fatface headings, DM Sans body, Cormorant Garamond serif.
 * Colors: Red #D82E2B, Gold #ECA241, Black #000, Cream #F3F1E9.
 */
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { LOGO, GALLERY_IMAGES } from "@/lib/images";

export default function Gallery() {
  const headerRef = useRef(null);
  const isInView = useInView(headerRef, { once: true, margin: "-80px" });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex((prev) => (prev !== null ? (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length : null));
  const nextImage = () => setLightboxIndex((prev) => (prev !== null ? (prev + 1) % GALLERY_IMAGES.length : null));

  return (
    <section id="gallery" className="relative section-cream py-24 lg:py-32 overflow-hidden">
      {/* Gold divider top */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#ECA241]/40 to-transparent absolute top-0 left-0 right-0" />

      {/* Logo watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none z-0">
        <img src={LOGO} alt="" className="w-[500px] h-[500px] object-contain" />
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14 lg:mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-[#D82E2B]" />
            <span className="brand-label text-[#D82E2B]">Our Work</span>
            <div className="w-8 h-[1px] bg-[#D82E2B]" />
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl text-black leading-tight">
            Event <span className="text-[#D82E2B]">Gallery</span>
          </h2>
          <p className="mt-4 text-base lg:text-lg max-w-2xl mx-auto leading-relaxed text-black/55" style={{ fontFamily: "var(--font-body)" }}>
            A glimpse into the events, dishes, and experiences we've crafted for our clients.
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {GALLERY_IMAGES.map((img, i) => (
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
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm tracking-wider uppercase font-semibold" style={{ fontFamily: "var(--font-body)" }}>
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
              src={GALLERY_IMAGES[lightboxIndex].src}
              alt={GALLERY_IMAGES[lightboxIndex].alt}
              className="max-h-[85vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-6 text-white/50 text-sm" style={{ fontFamily: "var(--font-body)" }}>
              {lightboxIndex + 1} / {GALLERY_IMAGES.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gold divider bottom */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#ECA241]/40 to-transparent absolute bottom-0 left-0 right-0" />
    </section>
  );
}
