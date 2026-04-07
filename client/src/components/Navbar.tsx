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
      } else {
        // Navigate to homepage from any other page
        window.location.href = "/";
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
            className="ml-1 px-6 py-2.5 bg-[#ECA241] text-black text-[11px] font-bold tracking-[0.18em] uppercase hover:bg-[#f0b050] hover:text-black transition-all duration-300 shadow-lg shadow-[#ECA241]/20"
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
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.97)",
            zIndex: 40,
            overflowY: "auto",
            paddingTop: "80px",
            paddingBottom: "40px",
          }}
          className="lg:hidden"
        >
          {/* Close button */}
          <button
            onClick={() => setMobileOpen(false)}
            style={{ position: "absolute", top: "20px", right: "20px", color: "#F3F1E9", background: "none", border: "none", cursor: "pointer" }}
            aria-label="Close menu"
          >
            <X size={30} />
          </button>

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <img src={LOGO_PRIMARY} alt="The PPL's Chef" style={{ height: "72px", width: "auto", display: "inline-block" }} />
          </div>

          {/* Nav items */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>

            {/* Home */}
            <a
              href="/"
              onClick={() => setMobileOpen(false)}
              style={{ color: "#F3F1E9", fontSize: "22px", fontFamily: "var(--font-display)", letterSpacing: "0.04em", textDecoration: "none", padding: "8px 0" }}
            >
              Home
            </a>

            {/* About */}
            <a
              href="/about"
              onClick={() => setMobileOpen(false)}
              style={{ color: "#F3F1E9", fontSize: "22px", fontFamily: "var(--font-display)", letterSpacing: "0.04em", textDecoration: "none", padding: "8px 0" }}
            >
              About
            </a>

            {/* Services accordion */}
            <div style={{ width: "100%", maxWidth: "320px" }}>
              <button
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  color: "#F3F1E9",
                  fontSize: "22px",
                  fontFamily: "var(--font-display)",
                  letterSpacing: "0.04em",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "8px 0",
                }}
              >
                Services
                <ChevronDown
                  size={18}
                  style={{ transform: mobileServicesOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                />
              </button>

              {mobileServicesOpen && (
                <div
                  style={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "4px",
                    marginTop: "8px",
                    overflow: "visible",
                  }}
                >
                  <a
                    href="/private-chef-las-vegas"
                    onClick={() => { setMobileOpen(false); setMobileServicesOpen(false); }}
                    style={{ display: "block", color: "#FAF7F2", padding: "14px 20px", fontSize: "15px", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    Private Chef Experience
                  </a>
                  <a
                    href="/catering-las-vegas"
                    onClick={() => { setMobileOpen(false); setMobileServicesOpen(false); }}
                    style={{ display: "block", color: "#FAF7F2", padding: "14px 20px", fontSize: "15px", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    Full-Service Catering
                  </a>
                  <a
                    href="/meal-prep-las-vegas"
                    onClick={() => { setMobileOpen(false); setMobileServicesOpen(false); }}
                    style={{ display: "block", color: "#FAF7F2", padding: "14px 20px", fontSize: "15px", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    Chef-Crafted Meal Prep
                  </a>
                  <a
                    href="/corporate-catering-las-vegas"
                    onClick={() => { setMobileOpen(false); setMobileServicesOpen(false); }}
                    style={{ display: "block", color: "#FAF7F2", padding: "14px 20px", fontSize: "15px", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    Corporate Dining
                  </a>
                  <a
                    href="/menus"
                    onClick={() => { setMobileOpen(false); setMobileServicesOpen(false); }}
                    style={{ display: "block", color: "#FAF7F2", padding: "14px 20px", fontSize: "15px", textDecoration: "none" }}
                  >
                    Menus
                  </a>
                </div>
              )}
            </div>

            {/* Menus */}
            <a
              href="/menus"
              onClick={() => setMobileOpen(false)}
              style={{ color: "#F3F1E9", fontSize: "22px", fontFamily: "var(--font-display)", letterSpacing: "0.04em", textDecoration: "none", padding: "8px 0" }}
            >
              Menus
            </a>

            {/* Gallery */}
            <a
              href="/gallery"
              onClick={() => setMobileOpen(false)}
              style={{ color: "#F3F1E9", fontSize: "22px", fontFamily: "var(--font-display)", letterSpacing: "0.04em", textDecoration: "none", padding: "8px 0" }}
            >
              Gallery
            </a>

            {/* FAQ */}
            <a
              href="/faq"
              onClick={() => setMobileOpen(false)}
              style={{ color: "#F3F1E9", fontSize: "22px", fontFamily: "var(--font-display)", letterSpacing: "0.04em", textDecoration: "none", padding: "8px 0" }}
            >
              FAQ
            </a>

            {/* Contact */}
            <a
              href="/contact"
              onClick={() => setMobileOpen(false)}
              style={{ color: "#F3F1E9", fontSize: "22px", fontFamily: "var(--font-display)", letterSpacing: "0.04em", textDecoration: "none", padding: "8px 0" }}
            >
              Contact
            </a>

            {/* Phone */}
            <a
              href="tel:725-212-2236"
              style={{ color: "#ECA241", fontSize: "15px", fontFamily: "var(--font-body)", letterSpacing: "0.1em", textDecoration: "none", marginTop: "16px", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <Phone size={14} />
              725-212-2236
            </a>

            {/* Book Now */}
            <a
              href="/contact"
              onClick={() => setMobileOpen(false)}
              style={{ marginTop: "16px", padding: "14px 40px", backgroundColor: "#D82E2B", color: "white", fontSize: "13px", fontFamily: "var(--font-body)", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none", display: "inline-block" }}
            >
              Book Now
            </a>

          </div>
        </div>
      )}

    </nav>
  );
}
