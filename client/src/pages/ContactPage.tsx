/**
 * ContactPage — Contact / Reach Us page for The PPL's Chef
 * Primary CTA: guided booking wizard at /book
 * Secondary (fallback): simple inquiry form for edge cases
 * BRAND: Abril Fatface headings, DM Sans body.
 * Colors: Red #D82E2B, Gold #ECA241, Black #000, Cream #F3F1E9.
 */
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { LOGO_PRIMARY, HERO_BG } from "@/lib/images";
import { submitInquiry } from "@/lib/submitInquiry";
import { JsonLd, localBusinessSchema } from "@/lib/seo";

const fontBody = { fontFamily: "var(--font-body)" };

function TikTokIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.16z" /></svg>;
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
    document.title = "Contact | The PPL's Chef | Las Vegas";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Contact The PPL's Chef in Las Vegas. Book a private chef, catering, meal prep, special event, or corporate dining. Call 725-212-2236 or send an inquiry.");
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
    { icon: TikTokIcon, href: "https://www.tiktok.com/@thepplschef", label: "TikTok" },
    { icon: Facebook, href: "https://www.facebook.com/thepplschef", label: "Facebook" },
    // X/Twitter account not yet active
  ];

  return (
    <Layout>
      <JsonLd id="schema-local-business-contact" data={localBusinessSchema} />

      {/* ─── Hero ─── */}
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
              Let's Create Something <span className="text-[#ECA241]">Extraordinary</span>
            </h1>
            <p className="text-[#F3F1E9]/55 text-lg max-w-2xl mx-auto" style={fontBody}>
              Most guests start with our guided booking experience — it takes 3 minutes and gives us everything we need to design your perfect event.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── PRIMARY: Booking Wizard CTA ─── */}
      <section className="section-dark py-16 lg:py-20 border-b border-white/5">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#ECA241]/30 bg-[#ECA241]/5 mb-6">
                <Sparkles size={13} className="text-[#ECA241]" />
                <span className="text-[#ECA241] text-[11px] tracking-widest uppercase font-semibold" style={fontBody}>Recommended</span>
              </div>

              <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl text-[#F3F1E9] leading-tight mb-4">
                Ready to Book? <span className="text-[#ECA241]">Start Here.</span>
              </h2>
              <p className="text-[#F3F1E9]/60 text-base lg:text-lg max-w-xl mx-auto mb-8 leading-relaxed" style={fontBody}>
                Our guided booking experience walks you through every detail — service type, guest count, date, dietary needs, and budget — so we can design your experience before we ever speak.
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap justify-center gap-3 mb-10">
                {["Takes 3 minutes", "No commitment", "Custom quote within 24 hrs", "Curated to your event"].map((pill) => (
                  <span key={pill} className="px-3 py-1 text-xs border border-[#ECA241]/20 text-[#F3F1E9]/50 rounded-full" style={fontBody}>{pill}</span>
                ))}
              </div>

              <Link
                href="/book"
                className="inline-flex items-center gap-3 px-12 py-5 text-black font-bold tracking-wider uppercase text-sm shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-0.5"
                style={{ ...fontBody, background: "linear-gradient(135deg, #C49A3A 0%, #ECA241 60%, #F5A623 100%)" }}
              >
                Start Your Curated Experience
                <ArrowRight size={18} />
              </Link>

              <p className="mt-4 text-[#F3F1E9]/25 text-xs" style={fontBody}>
                Not a finalized booking — just the start of something great.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── Contact Info strip ─── */}
      <section className="section-dark py-10 border-b border-white/5">
        <div className="container">
          <FadeIn>
            <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
              <a href="tel:725-212-2236" className="flex items-center gap-3 group">
                <div className="w-9 h-9 bg-[#D82E2B]/80 flex items-center justify-center group-hover:bg-[#ECA241] transition-colors duration-300 shrink-0">
                  <Phone size={15} className="text-white" />
                </div>
                <div>
                  <div className="text-[#F3F1E9]/35 text-[9px] tracking-wider uppercase" style={fontBody}>Call Us</div>
                  <div className="text-[#F3F1E9]/80 font-medium text-sm" style={fontBody}>725-212-2236</div>
                </div>
              </a>
              <a href="mailto:info@thepplschef.com" className="flex items-center gap-3 group">
                <div className="w-9 h-9 bg-[#D82E2B]/80 flex items-center justify-center group-hover:bg-[#ECA241] transition-colors duration-300 shrink-0">
                  <Mail size={15} className="text-white" />
                </div>
                <div>
                  <div className="text-[#F3F1E9]/35 text-[9px] tracking-wider uppercase" style={fontBody}>Email</div>
                  <div className="text-[#F3F1E9]/80 font-medium text-sm" style={fontBody}>info@thepplschef.com</div>
                </div>
              </a>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#D82E2B]/80 flex items-center justify-center shrink-0">
                  <MapPin size={15} className="text-white" />
                </div>
                <div>
                  <div className="text-[#F3F1E9]/35 text-[9px] tracking-wider uppercase" style={fontBody}>Service Area</div>
                  <div className="text-[#F3F1E9]/80 font-medium text-sm" style={fontBody}>Las Vegas Valley</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#D82E2B]/80 flex items-center justify-center shrink-0">
                  <Clock size={15} className="text-white" />
                </div>
                <div>
                  <div className="text-[#F3F1E9]/35 text-[9px] tracking-wider uppercase" style={fontBody}>Response Time</div>
                  <div className="text-[#F3F1E9]/80 font-medium text-sm" style={fontBody}>Within 24 Hours</div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── SECONDARY: Fallback Inquiry Form ─── */}
      <section className="section-dark py-16 lg:py-20">
        <div className="container">
          <FadeIn className="max-w-2xl mx-auto">
            {/* Divider with label */}
            <div className="flex items-center gap-4 mb-10">
              <div className="flex-1 h-[1px] bg-white/8" />
              <div className="flex items-center gap-2 text-center">
                <ChevronDown size={14} className="text-[#F3F1E9]/20" />
                <span className="text-[#F3F1E9]/30 text-[10px] tracking-widest uppercase whitespace-nowrap" style={fontBody}>Have a unique request?</span>
                <ChevronDown size={14} className="text-[#F3F1E9]/20" />
              </div>
              <div className="flex-1 h-[1px] bg-white/8" />
            </div>

            <div className="bg-[#080808] rounded-2xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.25),0_10px_10px_-5px_rgba(0,0,0,0.10)] p-10 lg:p-12">
              <h3 className="text-xl text-[#F3F1E9]/70 mb-1" style={{ fontFamily: "var(--font-card-heading)" }}>Prefer to Reach Out Directly?</h3>
              <p className="text-[#F3F1E9]/30 text-sm mb-8 leading-relaxed" style={fontBody}>
                For unusual requests, large-scale events, or if you'd simply rather send a message — we're here. Otherwise, the booking wizard above is the fastest path to your custom quote.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#F3F1E9]/30 text-[10px] tracking-wider uppercase block mb-1.5" style={fontBody}>Full Name *</label>
                    <input
                      type="text" required value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 bg-black/60 border border-white/8 text-[#F3F1E9]/80 placeholder-[#F3F1E9]/20 focus:border-[#ECA241]/40 focus:outline-none transition-colors text-sm"
                      style={fontBody} placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-[#F3F1E9]/30 text-[10px] tracking-wider uppercase block mb-1.5" style={fontBody}>Email *</label>
                    <input
                      type="email" required value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 bg-black/60 border border-white/8 text-[#F3F1E9]/80 placeholder-[#F3F1E9]/20 focus:border-[#ECA241]/40 focus:outline-none transition-colors text-sm"
                      style={fontBody} placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="text-[#F3F1E9]/30 text-[10px] tracking-wider uppercase block mb-1.5" style={fontBody}>Phone</label>
                    <input
                      type="tel" value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-black/60 border border-white/8 text-[#F3F1E9]/80 placeholder-[#F3F1E9]/20 focus:border-[#ECA241]/40 focus:outline-none transition-colors text-sm"
                      style={fontBody} placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="text-[#F3F1E9]/30 text-[10px] tracking-wider uppercase block mb-1.5" style={fontBody}>Event Type</label>
                    <select
                      value={form.eventType}
                      onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                      className="w-full px-4 py-3 bg-black/60 border border-white/8 text-[#F3F1E9]/80 focus:border-[#ECA241]/40 focus:outline-none transition-colors text-sm"
                      style={fontBody}
                    >
                      <option value="">Select type</option>
                      <option value="private-chef">Private Chef Experience</option>
                      <option value="catering">Catering</option>
                      <option value="meal-prep">Meal Prep / Meal Boxes</option>
                      <option value="special-events">Special Events</option>
                      <option value="corporate">Corporate Dining</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[#F3F1E9]/30 text-[10px] tracking-wider uppercase block mb-1.5" style={fontBody}>Preferred Date</label>
                    <input
                      type="date" value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full px-4 py-3 bg-black/60 border border-white/8 text-[#F3F1E9]/80 focus:border-[#ECA241]/40 focus:outline-none transition-colors text-sm"
                      style={fontBody}
                    />
                  </div>
                  <div>
                    <label className="text-[#F3F1E9]/30 text-[10px] tracking-wider uppercase block mb-1.5" style={fontBody}>Guest Count</label>
                    <input
                      type="number" min="1" value={form.guestCount}
                      onChange={(e) => setForm({ ...form, guestCount: e.target.value })}
                      className="w-full px-4 py-3 bg-black/60 border border-white/8 text-[#F3F1E9]/80 placeholder-[#F3F1E9]/20 focus:border-[#ECA241]/40 focus:outline-none transition-colors text-sm"
                      style={fontBody} placeholder="Number of guests"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#F3F1E9]/30 text-[10px] tracking-wider uppercase block mb-1.5" style={fontBody}>Event Location</label>
                  <input
                    type="text" value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-4 py-3 bg-black/60 border border-white/8 text-[#F3F1E9]/80 placeholder-[#F3F1E9]/20 focus:border-[#ECA241]/40 focus:outline-none transition-colors text-sm"
                    style={fontBody} placeholder="Address or venue name"
                  />
                </div>

                <div>
                  <label className="text-[#F3F1E9]/30 text-[10px] tracking-wider uppercase block mb-1.5" style={fontBody}>Your Request / Notes *</label>
                  <textarea
                    required rows={4} value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 bg-black/60 border border-white/8 text-[#F3F1E9]/80 placeholder-[#F3F1E9]/20 focus:border-[#ECA241]/40 focus:outline-none transition-colors text-sm resize-none"
                    style={fontBody} placeholder="Tell us about your unique situation, dietary needs, or anything the booking wizard didn't cover..."
                  />
                </div>

                <button
                  type="submit" disabled={isPending}
                  className="w-full py-3.5 border border-[#ECA241]/25 text-[#F3F1E9]/60 text-sm font-semibold tracking-wider uppercase hover:border-[#ECA241]/50 hover:text-[#F3F1E9]/80 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={fontBody}
                >
                  {isPending ? "Sending..." : "Send Message"}
                </button>
              </form>

              {/* Social links */}
              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <p className="text-[#F3F1E9]/20 text-xs" style={fontBody}>Follow along</p>
                <div className="flex gap-2">
                  {socials.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                      className="w-8 h-8 border border-white/8 flex items-center justify-center text-[#F3F1E9]/30 hover:text-[#F3F1E9]/60 hover:border-white/20 transition-all duration-300"
                      aria-label={s.label}>
                      <s.icon size={14} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </Layout>
  );
}
