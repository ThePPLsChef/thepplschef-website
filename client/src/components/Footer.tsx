/*
 * Footer — Smokehouse Editorial Design
 * Black background with logo, nav links, social icons, copyright.
 * Gold accent dividers.
 */
import { Instagram, Facebook, Phone, Mail } from "lucide-react";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/photo_AQAD2gtrG-WvaEZ-_2eac18e2.jpg";

function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.16z" />
    </svg>
  );
}

function XIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const footerLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com/thepplschef", label: "Instagram" },
  { icon: TikTokIcon, href: "https://tiktok.com/@thepplschef", label: "TikTok", isCustom: true },
  { icon: Facebook, href: "https://facebook.com/thepplschef", label: "Facebook" },
  { icon: XIcon, href: "https://x.com/thepplschef", label: "X", isCustom: true },
];

export default function Footer() {
  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-black">
      {/* Gold line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#ECA241] to-transparent" />

      <div className="container py-16">
        <div className="grid md:grid-cols-3 gap-12 items-start">
          {/* Logo & Tagline */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={LOGO_URL}
                alt="The PPL's Chef Logo"
                className="h-12 w-12 rounded-full object-cover border-2 border-[#ECA241]"
              />
              <div>
                <span className="font-[family-name:var(--font-heading)] text-xl font-bold text-[#F3F1E9]">
                  The PPL's <span className="text-[#ECA241]">Chef</span>
                </span>
              </div>
            </div>
            <p className="text-[#F3F1E9]/50 text-sm leading-relaxed max-w-xs">
              Creating restaurant-quality dining experiences in the location of the host's choosing.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#ECA241] text-xs tracking-[0.3em] uppercase font-semibold mb-5">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  className="text-[#F3F1E9]/60 hover:text-[#ECA241] text-sm transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-[#ECA241] text-xs tracking-[0.3em] uppercase font-semibold mb-5">
              Reach Out
            </h4>
            <div className="space-y-3 mb-6">
              <a href="tel:725-212-2236" className="flex items-center gap-3 text-[#F3F1E9]/60 hover:text-[#ECA241] text-sm transition-colors">
                <Phone size={16} />
                725-212-2236
              </a>
              <a href="mailto:info@thepplschef.com" className="flex items-center gap-3 text-[#F3F1E9]/60 hover:text-[#ECA241] text-sm transition-colors">
                <Mail size={16} />
                info@thepplschef.com
              </a>
            </div>

            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-[#ECA241]/20 flex items-center justify-center text-[#F3F1E9]/60 hover:bg-[#D82E2B] hover:border-[#D82E2B] hover:text-white transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.isCustom ? (
                    <social.icon size={16} />
                  ) : (
                    <social.icon size={16} />
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[#ECA241]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#F3F1E9]/30 text-xs tracking-wider">
            &copy; {new Date().getFullYear()} The PPL's Chef. All rights reserved.
          </p>
          <p className="text-[#F3F1E9]/20 text-xs tracking-wider">
            Full-Service Catering &mdash; Las Vegas & Beyond
          </p>
        </div>
      </div>
    </footer>
  );
}
