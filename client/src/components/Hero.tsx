/*
 * Hero — Smokehouse Editorial Design
 * Full-viewport hero with dramatic food photography background,
 * LARGE CENTERED LOGO, bold serif headline, tagline, and CTA.
 * Dark overlay with warm gold accents.
 * BRAND FONTS: Abril Fatface for headline, DM Sans for body.
 * BRAND COLORS: Red #D82E2B, Gold #ECA241, Black #000, Cream #F3F1E9.
 */
import { motion } from "framer-motion";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/hero-homepage-dining_3730360c.webp";  // Overhead dining table — warm golden light, multiple dishes, hands reaching
const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/photo_AQAD2gtrG-WvaEZ-_2eac18e2.jpg";

export default function Hero() {
  const scrollToContact = () => {
    const el = document.querySelector("#contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-start overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

      {/* Gold accent line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ECA241] to-transparent" />

      {/* Content */}
      <div className="relative z-10 container py-32 lg:py-0">
        <div className="max-w-3xl">
          {/* LARGE LOGO — Brand Signature */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex justify-start mb-8"
          >
            <img
              src={LOGO_URL}
              alt="The PPL's Chef Logo"
              className="h-24 w-24 sm:h-32 sm:w-32 rounded-full object-cover border-4 border-[#ECA241] shadow-2xl shadow-[#ECA241]/30"
            />
          </motion.div>

          {/* Small decorative label */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-12 h-[2px] bg-[#ECA241]" />
            <span className="text-[#ECA241] text-sm font-semibold tracking-[0.3em] uppercase font-[family-name:var(--font-body)]">
              Full-Service Catering
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[#F3F1E9] leading-[0.95] mb-6"
          >
            The PPL's{" "}
            <span className="text-[#ECA241]">Chef</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-[#F3F1E9]/85 text-lg sm:text-xl md:text-2xl leading-relaxed mb-10 max-w-2xl font-light font-[family-name:var(--font-body)]"
          >
            At The PPL'S Chef, we focus on creating restaurant-quality dining
            experiences in the location of the host's choosing.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={scrollToContact}
              className="px-10 py-4 bg-[#D82E2B] text-white text-base font-semibold tracking-wider uppercase font-[family-name:var(--font-body)] hover:bg-[#ECA241] hover:text-black transition-all duration-400 shadow-lg shadow-[#D82E2B]/30 hover:shadow-[#ECA241]/30"
            >
              Book Your Event
            </button>
            <a
              href="#services"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-10 py-4 border-2 border-[#ECA241]/50 text-[#F3F1E9] text-base font-semibold tracking-wider uppercase font-[family-name:var(--font-body)] hover:border-[#ECA241] hover:bg-[#ECA241]/10 transition-all duration-400"
            >
              Our Services
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[#ECA241]/60 text-xs tracking-[0.3em] uppercase font-[family-name:var(--font-body)]">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-[1px] h-8 bg-gradient-to-b from-[#ECA241]/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}
