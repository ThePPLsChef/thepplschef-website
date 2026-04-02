/*
 * Contact — Smokehouse Editorial Design
 * Cream background with contact info and inquiry form.
 * Gold accents, social media icons.
 * BRAND FONTS: Abril Fatface for headings, DM Sans for body.
 * BRAND COLORS: Red #D82E2B, Gold #ECA241, Black #000, Cream #F3F1E9.
 */
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Phone, Mail, Instagram, Facebook } from "lucide-react";
import { toast } from "sonner";

// TikTok SVG icon
function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.16z" />
    </svg>
  );
}

// X (Twitter) SVG icon
function XIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com/thepplschef", label: "Instagram", isCustom: false },
  { icon: TikTokIcon, href: "https://tiktok.com/@thepplschef", label: "TikTok", isCustom: true },
  { icon: Facebook, href: "https://facebook.com/thepplschef", label: "Facebook", isCustom: false },
  { icon: XIcon, href: "https://x.com/thepplschef", label: "X", isCustom: true },
];

export default function Contact() {
  const headerRef = useRef(null);
  const isInView = useInView(headerRef, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for your inquiry! We'll be in touch within 24 hours.");
    setFormData({ name: "", email: "", phone: "", eventType: "", message: "" });
  };

  return (
    <section id="contact" className="relative bg-[#F3F1E9] py-24 lg:py-32">
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#ECA241] to-transparent absolute top-0 left-0 right-0" />

      <div className="container">
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
              Get In Touch
            </span>
            <div className="w-10 h-[2px] bg-[#D82E2B]" />
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold text-black leading-tight">
            Book Your <span className="text-[#D82E2B]">Event</span>
          </h2>
          <p className="mt-5 text-black/60 text-lg max-w-2xl mx-auto font-[family-name:var(--font-body)]">
            Ready to create an unforgettable dining experience? Reach out and let's start planning.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 space-y-8"
          >
            <div>
              <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-black mb-6">
                Contact Information
              </h3>

              <div className="space-y-5">
                <a
                  href="tel:725-212-2236"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 bg-[#D82E2B] flex items-center justify-center group-hover:bg-[#ECA241] transition-colors duration-300 shadow-md shadow-[#D82E2B]/20">
                    <Phone size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-black/50 text-xs tracking-wider uppercase font-[family-name:var(--font-body)]">Phone</div>
                    <div className="text-black font-semibold text-lg font-[family-name:var(--font-body)]">725-212-2236</div>
                  </div>
                </a>

                <a
                  href="mailto:info@thepplschef.com"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 bg-[#D82E2B] flex items-center justify-center group-hover:bg-[#ECA241] transition-colors duration-300 shadow-md shadow-[#D82E2B]/20">
                    <Mail size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-black/50 text-xs tracking-wider uppercase font-[family-name:var(--font-body)]">Email</div>
                    <div className="text-black font-semibold text-lg font-[family-name:var(--font-body)]">info@thepplschef.com</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-black/50 text-xs tracking-wider uppercase mb-4 font-[family-name:var(--font-body)]">Follow Us</h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 bg-black flex items-center justify-center text-[#F3F1E9] hover:bg-[#D82E2B] transition-all duration-300 shadow-md"
                    aria-label={social.label}
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Decorative quote */}
            <div className="border-l-4 border-[#ECA241] pl-5 mt-8">
              <p className="font-[family-name:var(--font-heading)] text-black/60 italic text-lg leading-relaxed">
                "Great food is the foundation of genuine happiness."
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="bg-white p-8 lg:p-10 shadow-xl shadow-black/5 border border-black/5">
              <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-black mb-8">
                Send an Inquiry
              </h3>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-black/60 text-xs tracking-wider uppercase block mb-2 font-[family-name:var(--font-body)]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#F3F1E9] border border-black/10 text-black focus:border-[#D82E2B] focus:outline-none transition-colors text-sm font-[family-name:var(--font-body)]"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-black/60 text-xs tracking-wider uppercase block mb-2 font-[family-name:var(--font-body)]">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-[#F3F1E9] border border-black/10 text-black focus:border-[#D82E2B] focus:outline-none transition-colors text-sm font-[family-name:var(--font-body)]"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="text-black/60 text-xs tracking-wider uppercase block mb-2 font-[family-name:var(--font-body)]">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-[#F3F1E9] border border-black/10 text-black focus:border-[#D82E2B] focus:outline-none transition-colors text-sm font-[family-name:var(--font-body)]"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="text-black/60 text-xs tracking-wider uppercase block mb-2 font-[family-name:var(--font-body)]">
                    Event Type
                  </label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full px-4 py-3 bg-[#F3F1E9] border border-black/10 text-black focus:border-[#D82E2B] focus:outline-none transition-colors text-sm font-[family-name:var(--font-body)]"
                  >
                    <option value="">Select event type</option>
                    <option value="private">Private Event</option>
                    <option value="corporate">Corporate Catering</option>
                    <option value="birthday">Birthday & Celebration</option>
                    <option value="personal">Personal Chef</option>
                    <option value="outdoor">Outdoor Event</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mt-5">
                <label className="text-black/60 text-xs tracking-wider uppercase block mb-2 font-[family-name:var(--font-body)]">
                  Tell Us About Your Event *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F3F1E9] border border-black/10 text-black focus:border-[#D82E2B] focus:outline-none transition-colors text-sm resize-none font-[family-name:var(--font-body)]"
                  placeholder="Date, number of guests, dietary preferences, vision for the event..."
                />
              </div>

              <button
                type="submit"
                className="mt-6 w-full py-4 bg-[#D82E2B] text-white font-bold tracking-wider uppercase text-sm font-[family-name:var(--font-body)] hover:bg-[#ECA241] hover:text-black transition-all duration-400 shadow-lg shadow-[#D82E2B]/20"
              >
                Send Inquiry
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
