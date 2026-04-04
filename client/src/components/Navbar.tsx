/**
 * Navbar — Premium luxury navigation
 * Sticky, transparent → solid on scroll. Logo + links + CTA.
 * Multi-page aware: uses wouter Link for pages, smooth scroll for homepage anchors.
 * BRAND: Abril Fatface display, DM Sans nav, Gold/Red/Black/Cream palette.
 */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LOGO_PRIMARY } from "@/lib/images";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("/#")) {
      const id = href.slice(2);
      if (location === "/") {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = href;
      }
    } else if (href === "/") {
      if (location === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/98 backdrop-blur-lg py-3 shadow-xl shadow-black/20"
          : "bg-gradient-to-b from-black/60 to-transparent py-5"
      }`}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 group"
        >
          <img
            src={LOGO_PRIMARY}
            alt="The PPL's Chef"
            className={`object-contain transition-all duration-300 drop-shadow-lg ${
              scrolled ? "h-10 w-auto" : "h-12 w-auto"
            }`}
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) =>
            link.href.startsWith("/#") || link.href === "/" ? (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-[#F3F1E9]/75 hover:text-[#ECA241] text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors duration-300 relative after:absolute after:bottom-[-3px] after:left-0 after:w-0 after:h-[1px] after:bg-[#ECA241] after:transition-all after:duration-300 hover:after:w-full"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#F3F1E9]/75 hover:text-[#ECA241] text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors duration-300"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {link.label}
              </Link>
            )
          )}
          <Link
            href="/book"
            className="ml-3 px-7 py-2.5 bg-[#D82E2B] text-white text-[11px] font-bold tracking-[0.18em] uppercase hover:bg-[#ECA241] hover:text-black transition-all duration-300 shadow-lg shadow-[#D82E2B]/20"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Book Now
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-[#F3F1E9] hover:text-[#ECA241] transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 bg-black/99 z-40 flex flex-col items-center justify-center gap-7"
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 right-5 text-[#F3F1E9] hover:text-[#ECA241]"
              aria-label="Close menu"
            >
              <X size={30} />
            </button>

            <img src={LOGO_PRIMARY} alt="The PPL's Chef" className="h-20 w-auto object-contain mb-4 drop-shadow-lg" />

            {navLinks.map((link, i) => (
              <motion.button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="text-[#F3F1E9] text-xl font-[family-name:var(--font-display)] tracking-wide hover:text-[#ECA241] transition-colors"
              >
                {link.label}
              </motion.button>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.06 }}
            >
              <Link
                href="/book"
                onClick={() => setMobileOpen(false)}
                className="mt-4 px-10 py-3 bg-[#D82E2B] text-white text-sm font-bold tracking-wider uppercase hover:bg-[#ECA241] hover:text-black transition-all duration-300"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Book Now
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
