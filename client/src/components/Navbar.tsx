/*
 * Navbar — Smokehouse Editorial Design
 * Sticky top nav with logo, links, and CTA.
 * Black bg with gold accents, transforms on scroll.
 * BRAND FONTS: Abril Fatface for brand name, DM Sans for nav links.
 * BRAND COLORS: Red #D82E2B, Gold #ECA241, Black #000, Cream #F3F1E9.
 */
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/photo_AQAD2gtrG-WvaEZ-_2eac18e2.jpg";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/97 backdrop-blur-md shadow-lg shadow-black/40 py-3 border-b border-[#ECA241]/10"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container flex items-center justify-between">
        {/* Logo + Brand Name */}
        <a
          href="#home"
          onClick={(e) => { e.preventDefault(); handleNavClick("#home"); }}
          className="flex items-center gap-3 group"
        >
          <div className="relative">
            <img
              src={LOGO_URL}
              alt="The PPL's Chef Logo"
              className="h-11 w-11 rounded-full object-cover border-2 border-[#ECA241] group-hover:border-[#D82E2B] transition-colors duration-300 shadow-md shadow-[#ECA241]/20"
            />
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="font-[family-name:var(--font-heading)] text-base font-bold text-[#F3F1E9] tracking-wide leading-tight">
              The PPL's <span className="text-[#ECA241]">Chef</span>
            </span>
            <span className="text-[#ECA241]/60 text-[10px] tracking-[0.2em] uppercase font-[family-name:var(--font-body)] mt-0.5">
              Full-Service Catering
            </span>
          </div>
        </a>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
              className="text-[#F3F1E9]/80 hover:text-[#ECA241] text-xs font-semibold tracking-widest uppercase font-[family-name:var(--font-body)] transition-colors duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#ECA241] after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); handleNavClick("#contact"); }}
            className="ml-2 px-6 py-2.5 bg-[#D82E2B] text-white text-xs font-bold tracking-wider uppercase font-[family-name:var(--font-body)] hover:bg-[#ECA241] hover:text-black transition-all duration-300 rounded-sm shadow-md shadow-[#D82E2B]/30"
          >
            Book Now
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-[#F3F1E9] hover:text-[#ECA241] transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 top-0 bg-black/99 z-40 flex flex-col items-center justify-center gap-8"
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 right-5 text-[#F3F1E9] hover:text-[#ECA241]"
              aria-label="Close menu"
            >
              <X size={32} />
            </button>

            {/* Mobile logo */}
            <img
              src={LOGO_URL}
              alt="The PPL's Chef Logo"
              className="h-20 w-20 rounded-full object-cover border-4 border-[#ECA241] mb-2"
            />

            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="text-[#F3F1E9] text-2xl font-[family-name:var(--font-heading)] font-bold tracking-wide hover:text-[#ECA241] transition-colors"
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href="#contact"
              onClick={(e) => { e.preventDefault(); handleNavClick("#contact"); }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.08 }}
              className="mt-4 px-10 py-3 bg-[#D82E2B] text-white text-lg font-bold tracking-wider uppercase font-[family-name:var(--font-body)] hover:bg-[#ECA241] hover:text-black transition-all duration-300"
            >
              Book Now
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
