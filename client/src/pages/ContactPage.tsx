/**
 * ContactPage — Dedicated Contact / Booking page for The PPL's Chef
 * Full inquiry form with lead-qualifying fields.
 * BRAND: Abril Fatface headings, DM Sans body.
 * Colors: Red #D82E2B, Gold #ECA241, Black #000, Cream #F3F1E9.
 */
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Instagram, Facebook } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { LOGO_PRIMARY, HERO_BG } from "@/lib/images";
import { submitInquiry } from "@/lib/submitInquiry";

const fontBody = { fontFamily: "var(--font-body)" };

function TikTokIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.16z" /></svg>;
}
function XIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
}

function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay }} className={className}>
      {children}
    </motion.div>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", eventType: "", date: "", guestCount: "", location: "", message: "",
  });

  useEffect(() => {
    document.title = "Contact & Booking | The PPL's Chef | Las Vegas";
    window.scrollTo(0, 0);
  }, []);

  const SERVICE_TYPE_MAP: Record<string, string> = {
    "private-chef": "Private Chef",
    "catering": "Catering",
    "meal-prep": "Meal Prep",
    "special-events": "Special Events",
    "corporate": "Corporate Dining",
  };

  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      await submitInquiry({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        serviceType: SERVICE_TYPE_MAP[form.eventType] || form.eventType || undefined,
        eventDate: form.date || undefined,
        guestCount: form.guestCount || undefined,
        location: form.location || undefined,
        notes: form.message || undefined,
      });
      toast.success("Thank you! We'll be in touch within 24 hours to discuss your event.");
      setForm({ name: "", email: "", phone: "", eventType: "", date: "", guestCount: "", location: "", message: "" });
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again or call us directly.");
    } finally {
      setIsPending(false);
    }
  };

  const socials = [
    { icon: Instagram, href: "https://www.instagram.com/thepplschef", label: "Instagram" },
    { icon: TikTokIcon, href: "https://tiktok.com/@thepplschef", label: "TikTok" },
    { icon: Facebook, href: "https://facebook.com/thepplschef", label: "Facebook" },
    { icon: XIcon, href: "https://x.com/thepplschef", label: "X" },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HERO_BG})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />
        <div className="relative z-10 container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <img src={LOGO_PRIMARY} alt="The PPL's Chef" className="h-24 w-auto object-contain mx-auto mb-6 drop-shadow-xl" />
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-[#ECA241]" />
              <span className="brand-label">Get In Touch</span>
              <div className="w-8 h-[1px] bg-[#ECA241]" />
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-6xl text-[#F3F1E9] leading-tight mb-4">
              Book Your <span className="text-[#ECA241]">Experience</span>
            </h1>
            <p className="text-[#F3F1E9]/55 text-lg max-w-2xl mx-auto" style={fontBody}>
              Ready to create an unforgettable dining experience? Tell us about your event and we'll craft something extraordinary.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-dark py-20 lg:py-28">
        <div className="container">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Left — Contact Info */}
            <FadeIn className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-xl text-[#F3F1E9] mb-6">Contact Information</h3>
                <div className="space-y-5">
                  <a href="tel:725-212-2236" className="flex items-center gap-4 group">
                    <div className="w-11 h-11 bg-[#D82E2B] flex items-center justify-center group-hover:bg-[#ECA241] transition-colors duration-300">
                      <Phone size={18} className="text-white" />
                    </div>
                    <div>
                      <div className="text-[#F3F1E9]/40 text-[10px] tracking-wider uppercase" style={fontBody}>Phone</div>
                      <div className="text-[#F3F1E9] font-medium text-base" style={fontBody}>725-212-2236</div>
                    </div>
                  </a>
                  <a href="mailto:info@thepplschef.com" className="flex items-center gap-4 group">
                    <div className="w-11 h-11 bg-[#D82E2B] flex items-center justify-center group-hover:bg-[#ECA241] transition-colors duration-300">
                      <Mail size={18} className="text-white" />
                    </div>
                    <div>
                      <div className="text-[#F3F1E9]/40 text-[10px] tracking-wider uppercase" style={fontBody}>Email</div>
                      <div className="text-[#F3F1E9] font-medium text-base" style={fontBody}>info@thepplschef.com</div>
                    </div>
                  </a>
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-[#D82E2B] flex items-center justify-center">
                      <MapPin size={18} className="text-white" />
                    </div>
                    <div>
                      <div className="text-[#F3F1E9]/40 text-[10px] tracking-wider uppercase" style={fontBody}>Service Area</div>
                      <div className="text-[#F3F1E9] font-medium text-base" style={fontBody}>Las Vegas Valley & Surrounding Areas</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-[#D82E2B] flex items-center justify-center">
                      <Clock size={18} className="text-white" />
                    </div>
                    <div>
                      <div className="text-[#F3F1E9]/40 text-[10px] tracking-wider uppercase" style={fontBody}>Response Time</div>
                      <div className="text-[#F3F1E9] font-medium text-base" style={fontBody}>Within 24 Hours</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[#F3F1E9]/40 text-[10px] tracking-wider uppercase mb-3" style={fontBody}>Follow Us</h4>
                <div className="flex gap-2.5">
                  {socials.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-[#ECA241]/15 flex items-center justify-center text-[#F3F1E9]/50 hover:bg-[#D82E2B] hover:border-[#D82E2B] hover:text-white transition-all duration-300" aria-label={s.label}>
                      <s.icon size={16} />
                    </a>
                  ))}
                </div>
              </div>

              <div className="border-l-2 border-[#ECA241]/30 pl-5">
                <p className="font-[family-name:var(--font-serif)] text-[#F3F1E9]/40 italic text-base leading-relaxed">
                  "Everybody Deserves to Have a Chef."
                </p>
                <p className="text-[#ECA241] text-xs tracking-widest uppercase mt-2" style={{ ...fontBody, fontWeight: 600 }}>— The PPL's Chef</p>
              </div>
            </FadeIn>

            {/* Right — Inquiry Form */}
            <FadeIn className="lg:col-span-3" delay={0.2}>
              <form onSubmit={handleSubmit} className="bg-[#0a0a0a] border border-white/5 p-8 lg:p-10">
                <h3 className="font-[family-name:var(--font-display)] text-xl text-[#F3F1E9] mb-2">Send an Inquiry</h3>
                <p className="text-[#F3F1E9]/40 text-sm mb-8" style={fontBody}>Fill out the form below and we'll get back to you within 24 hours.</p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#F3F1E9]/40 text-[10px] tracking-wider uppercase block mb-2" style={fontBody}>Full Name *</label>
                    <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 bg-black border border-white/10 text-[#F3F1E9] focus:border-[#ECA241] focus:outline-none transition-colors text-sm" style={fontBody} placeholder="Your name" />
                  </div>
                  <div>
                    <label className="text-[#F3F1E9]/40 text-[10px] tracking-wider uppercase block mb-2" style={fontBody}>Email *</label>
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 bg-black border border-white/10 text-[#F3F1E9] focus:border-[#ECA241] focus:outline-none transition-colors text-sm" style={fontBody} placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="text-[#F3F1E9]/40 text-[10px] tracking-wider uppercase block mb-2" style={fontBody}>Phone</label>
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 bg-black border border-white/10 text-[#F3F1E9] focus:border-[#ECA241] focus:outline-none transition-colors text-sm" style={fontBody} placeholder="(555) 123-4567" />
                  </div>
                  <div>
                    <label className="text-[#F3F1E9]/40 text-[10px] tracking-wider uppercase block mb-2" style={fontBody}>Event Type</label>
                    <select value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })} className="w-full px-4 py-3 bg-black border border-white/10 text-[#F3F1E9] focus:border-[#ECA241] focus:outline-none transition-colors text-sm" style={fontBody}>
                      <option value="">Select type</option>
                      <option value="private-chef">Private Chef Experience</option>
                      <option value="catering">Catering</option>
                      <option value="meal-prep">Meal Prep / Meal Boxes</option>
                      <option value="special-events">Special Events</option>
                      <option value="corporate">Corporate Dining</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[#F3F1E9]/40 text-[10px] tracking-wider uppercase block mb-2" style={fontBody}>Preferred Date</label>
                    <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-4 py-3 bg-black border border-white/10 text-[#F3F1E9] focus:border-[#ECA241] focus:outline-none transition-colors text-sm" style={fontBody} />
                  </div>
                  <div>
                    <label className="text-[#F3F1E9]/40 text-[10px] tracking-wider uppercase block mb-2" style={fontBody}>Guest Count</label>
                    <input type="number" min="1" value={form.guestCount} onChange={(e) => setForm({ ...form, guestCount: e.target.value })} className="w-full px-4 py-3 bg-black border border-white/10 text-[#F3F1E9] focus:border-[#ECA241] focus:outline-none transition-colors text-sm" style={fontBody} placeholder="Number of guests" />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-[#F3F1E9]/40 text-[10px] tracking-wider uppercase block mb-2" style={fontBody}>Event Location</label>
                  <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-4 py-3 bg-black border border-white/10 text-[#F3F1E9] focus:border-[#ECA241] focus:outline-none transition-colors text-sm" style={fontBody} placeholder="Address or venue name" />
                </div>

                <div className="mt-4">
                  <label className="text-[#F3F1E9]/40 text-[10px] tracking-wider uppercase block mb-2" style={fontBody}>Event Details / Notes *</label>
                  <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 bg-black border border-white/10 text-[#F3F1E9] focus:border-[#ECA241] focus:outline-none transition-colors text-sm resize-none" style={fontBody} placeholder="Tell us about your event — dietary needs, vision, special requests..." />
                </div>

                <button type="submit" disabled={isPending} className="mt-6 w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed">{isPending ? "Sending..." : "Send Inquiry"}</button>
              </form>
            </FadeIn>
          </div>
        </div>
      </section>
    </Layout>
  );
}
