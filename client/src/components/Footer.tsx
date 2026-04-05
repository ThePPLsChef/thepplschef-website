/**
 * Footer — Premium luxury footer
 * Black bg, large logo signature, nav columns, social links, contact info.
 * BRAND: Abril Fatface, DM Sans, Gold/Red/Black/Cream.
 */
import { Link } from "wouter";
import { Instagram, Facebook, Phone, Mail, MapPin } from "lucide-react";
import { LOGO_PRIMARY } from "@/lib/images";

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.16z" />
    </svg>
  );
}

function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const services = [
  { label: "Private Chef", href: "/services/private-chef" },
  { label: "Catering", href: "/services/catering" },
  { label: "Meal Boxes", href: "/services/meal-boxes" },
  { label: "Special Events", href: "/services/special-events" },
  { label: "Corporate Dining", href: "/services/corporate" },
];

const socials = [
  { icon: Instagram, href: "https://instagram.com/thepplschef", label: "Instagram" },
  { icon: TikTokIcon, href: "https://tiktok.com/@thepplschef", label: "TikTok" },
  { icon: Facebook, href: "https://facebook.com/thepplschef", label: "Facebook" },
  { icon: XIcon, href: "https://x.com/thepplschef", label: "X" },
];

export default function Footer() {
  return (
    <footer className="bg-black pb-20 lg:pb-0">
      <div className="gold-divider" />

      {/* Logo signature */}
      <div className="flex flex-col items-center pt-16 pb-6">
        <img
          src={LOGO_PRIMARY}
          alt="The PPL's Chef"
          className="h-28 w-auto object-contain drop-shadow-xl mb-3"
        />
        <p className="text-[#ECA241]/50 text-[10px] tracking-[0.3em] uppercase mt-1" style={{ fontFamily: "var(--font-body)" }}>
          Las Vegas Private Chef & Catering
        </p>
      </div>

      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div>
            <p className="text-[#F3F1E9]/45 text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              Restaurant-quality dining experiences in the location of your choosing. From intimate dinners to grand celebrations, we bring the full culinary experience to you.
            </p>
          </div>

          {/* Services & Pages */}
          <div>
            <h4 className="text-[#ECA241] text-[11px] tracking-[0.25em] uppercase font-semibold mb-5" style={{ fontFamily: "var(--font-body)" }}>
              Services
            </h4>
            <nav className="flex flex-col gap-2.5">
              {services.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="text-[#F3F1E9]/55 hover:text-[#ECA241] text-sm transition-colors duration-300"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {s.label}
                </Link>
              ))}
              <Link
                href="/menus"
                className="text-[#F3F1E9]/55 hover:text-[#ECA241] text-sm transition-colors duration-300 mt-1"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Sample Menus
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[#ECA241] text-[11px] tracking-[0.25em] uppercase font-semibold mb-5" style={{ fontFamily: "var(--font-body)" }}>
              Contact
            </h4>
            <div className="space-y-3">
              <a href="tel:725-212-2236" className="flex items-center gap-3 text-[#F3F1E9]/55 hover:text-[#ECA241] text-sm transition-colors" style={{ fontFamily: "var(--font-body)" }}>
                <Phone size={14} className="shrink-0" /> 725-212-2236
              </a>
              <a href="mailto:info@thepplschef.com" className="flex items-center gap-3 text-[#F3F1E9]/55 hover:text-[#ECA241] text-sm transition-colors" style={{ fontFamily: "var(--font-body)" }}>
                <Mail size={14} className="shrink-0" /> info@thepplschef.com
              </a>
              <div className="flex items-start gap-3 text-[#F3F1E9]/55 text-sm" style={{ fontFamily: "var(--font-body)" }}>
                <MapPin size={14} className="shrink-0 mt-0.5" />
                <span>Las Vegas, NV 89101<br />Serving the entire Las Vegas Valley</span>
              </div>
            </div>
          </div>

          {/* Social + CTA */}
          <div>
            <h4 className="text-[#ECA241] text-[11px] tracking-[0.25em] uppercase font-semibold mb-5" style={{ fontFamily: "var(--font-body)" }}>
              Follow Us
            </h4>
            <div className="flex gap-2.5 mb-6">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 border border-[#ECA241]/20 flex items-center justify-center text-[#F3F1E9]/50 hover:bg-[#D82E2B] hover:border-[#D82E2B] hover:text-white transition-all duration-300"
                  aria-label={s.label}
                >
                  <s.icon size={14} />
                </a>
              ))}
            </div>
            <Link
              href="/book"
              className="inline-block px-6 py-2.5 bg-[#D82E2B] text-white text-[11px] font-bold tracking-[0.15em] uppercase hover:bg-[#ECA241] hover:text-black transition-all duration-300"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Book Now
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#F3F1E9]/25 text-xs tracking-wider" style={{ fontFamily: "var(--font-body)" }}>
            &copy; {new Date().getFullYear()} The PPL's Chef. All rights reserved.
          </p>
          <p className="text-[#F3F1E9]/15 text-xs tracking-wider" style={{ fontFamily: "var(--font-body)" }}>
            Private Chef & Luxury Catering &mdash; Las Vegas, NV
          </p>
        </div>
      </div>
    </footer>
  );
}
