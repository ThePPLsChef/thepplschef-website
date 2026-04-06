/**
 * Navbar — Premium sticky navigation with phone number
 * Sticky on scroll, phone number always visible, Services dropdown, Menus link.
 * BRAND: Abril Fatface display, DM Sans nav, Gold/Red/Black/Cream palette.
 */
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LOGO_PRIMARY } from "@/lib/images";

const serviceLinks = [
  { label: "Private Chef Experience", href: "/private-chef-las-vegas" },
  { label: "Full-Service Catering", href: "/catering-las-vegas" },
  { label: "Chef-Crafted Meal Prep", href: "/meal-prep-las-vegas" },
  { label: "Special Events & Celebrations", href: "/special-events-las-vegas" },
  { label: "Corporate & Group Dining", href: "/corporate-catering-las-vegas" },
];

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/#services", hasDropdown: true },
  { label: "Menus", href: "/menus" },
  { label: "Gallery", href: "/gallery" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [location] = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    setMobileServicesOpen(false);
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

  const linkStyle = "text-[#F3F1E9]/75 hover:text-[#ECA241] text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors duration-300 relative after:absolute after:bottom-[-3px] after:left-0 after:w-0 after:h-[1px] after:bg-[#ECA241] after:transition-all after:duration-300 hover:after:w-full";
  const fontBody = { fontFamily: "var(--font-body)" };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/98 backdrop-blur-lg py-2 shadow-xl shadow-black/20"
          : "bg-gradient-to-b from-black/60 to-transparent py-4"
      }`}
    >
      {/* Top bar with phone — always visible */}
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
              scrolled ? "h-9 w-auto" : "h-11 w-auto"
            }`}
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => {
            // Services dropdown
            if (link.hasDropdown) {
              return (
                <div key={link.href} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => {
                      handleNavClick(link.href);
                      setServicesOpen(!servicesOpen);
                    }}
                    onMouseEnter={() => setServicesOpen(true)}
                    className={`${linkStyle} flex items-center gap-1`}
                    style={fontBody}
                  >
                    {link.label}
                    <ChevronDown size={12} className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {servicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        onMouseLeave={() => setServicesOpen(false)}
                        className="absolute top-full left-0 mt-3 w-64 bg-black/98 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40"
                      >
                        {serviceLinks.map((s) => (
                          <Link
                            key={s.href}
                            href={s.href}
                            onClick={() => setServicesOpen(false)}
                            className="block px-5 py-3 text-[#F3F1E9]/60 hover:text-[#ECA241] hover:bg-white/5 text-xs tracking-wider transition-all duration-200"
                            style={fontBody}
                          >
                            {s.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            // Direct page links (About, Menus, Gallery, FAQ, Contact)
            if (!link.href.startsWith("/#") && link.href !== "/") {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={linkStyle}
                  style={fontBody}
                >
                  {link.label}
                </Link>
              );
            }

            // Hash links and home
            return (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={linkStyle}
                style={fontBody}
              >
                {link.label}
              </button>
            );
          })}

          {/* Phone number */}
          <a
            href="tel:725-212-2236"
            className="flex items-center gap-1.5 text-[#ECA241] text-[11px] font-semibold tracking-wider hover:text-white transition-colors duration-300"
            style={fontBody}
          >
            <Phone size={12} />
            <span>725-212-2236</span>
          </a>

          {/* Book Now CTA */}
          <Link
            href="/contact"
            className="ml-1 px-6 py-2.5 bg-[#D82E2B] text-white text-[11px] font-bold tracking-[0.18em] uppercase hover:bg-[#ECA241] hover:text-black transition-all duration-300 shadow-lg shadow-[#D82E2B]/20"
            style={fontBody}
          >
            Book Now
          </Link>
        </div>

        {/* Mobile: Phone + Toggle */}
        <div className="lg:hidden flex items-center gap-3">
          <a
            href="tel:725-212-2236"
            className="flex items-center gap-1.5 text-[#ECA241] text-[10px] font-semibold tracking-wider"
            style={fontBody}
          >
            <Phone size={12} />
            <span className="hidden sm:inline">725-212-2236</span>
          </a>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-[#F3F1E9] hover:text-[#ECA241] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 bg-black/99 z-40 flex flex-col items-center justify-center gap-5 overflow-y-auto py-20"
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 right-5 text-[#F3F1E9] hover:text-[#ECA241]"
              aria-label="Close menu"
            >
              <X size={30} />
            </button>

            <img src={LOGO_PRIMARY} alt="The PPL's Chef" className="h-20 w-auto object-contain mb-4 drop-shadow-lg" />

            {navLinks.map((link, i) => {
              if (link.hasDropdown) {
                return (
                  <div key={link.href} className="flex flex-col items-center">
                    <motion.button
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className="text-[#F3F1E9] text-xl font-[family-name:var(--font-display)] tracking-wide hover:text-[#ECA241] transition-colors flex items-center gap-2"
                    >
                      Services
                      <ChevronDown size={16} className={`transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`} />
                    </motion.button>
                    <AnimatePresence>
                      {mobileServicesOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden flex flex-col items-center gap-2 mt-3"
                        >
                          {serviceLinks.map((s) => (
                            <Link
                              key={s.href}
                              href={s.href}
                              onClick={() => { setMobileOpen(false); setMobileServicesOpen(false); }}
                              className="text-[#F3F1E9]/60 text-sm hover:text-[#ECA241] transition-colors"
                              style={fontBody}
                            >
                              {s.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              // Direct page links
              if (!link.href.startsWith("/#") && link.href !== "/") {
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-[#F3F1E9] text-xl font-[family-name:var(--font-display)] tracking-wide hover:text-[#ECA241] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              }

              return (
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
              );
            })}

            {/* Mobile phone */}
            <a
              href="tel:725-212-2236"
              className="flex items-center gap-2 text-[#ECA241] text-sm font-semibold tracking-wider mt-2"
              style={fontBody}
            >
              <Phone size={14} />
              725-212-2236
            </a>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.06 }}
            >
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="mt-2 px-10 py-3 bg-[#D82E2B] text-white text-sm font-bold tracking-wider uppercase hover:bg-[#ECA241] hover:text-black transition-all duration-300"
                style={fontBody}
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
