/**
 * BookingPage — Premium inquiry form for The PPL's Chef
 * Collects: name, email, phone, event date, event time, location, guests,
 * service type, food wishlist, dietary restrictions, budget, notes.
 * BRAND: Abril Fatface headings, DM Sans body, Black/Cream/Red/Gold.
 */
import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Phone, Mail, Instagram, Facebook, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { LOGO_PRIMARY, HERO_BG } from "@/lib/images";

function TikTokIcon({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.16z" /></svg>;
}
function XIcon({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  eventTime: string;
  location: string;
  guests: string;
  serviceType: string;
  foodWishlist: string;
  dietary: string;
  budget: string;
  notes: string;
}

const initialForm: FormData = {
  name: "", email: "", phone: "", eventDate: "", eventTime: "",
  location: "", guests: "", serviceType: "", foodWishlist: "",
  dietary: "", budget: "", notes: "",
};

export default function BookingPage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const update = (key: keyof FormData, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Thank you! We'll be in touch within 24 hours to discuss your event.");
  };

  const inputClass = "w-full px-4 py-3.5 bg-black border border-white/10 text-[#F3F1E9] focus:border-[#ECA241] focus:outline-none transition-colors text-sm placeholder:text-white/20";
  const labelClass = "text-[#F3F1E9]/40 text-[10px] tracking-wider uppercase block mb-2";
  const fontBody = { fontFamily: "var(--font-body)" };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HERO_BG})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />

        <div className="relative z-10 container pb-14 pt-32">
          <Link href="/" className="inline-flex items-center gap-2 text-[#ECA241]/60 hover:text-[#ECA241] text-xs tracking-widest uppercase mb-6 transition-colors" style={fontBody}>
            <ChevronLeft size={14} /> Home
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-[#ECA241]" />
              <span className="brand-label">Book Your Experience</span>
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-6xl text-[#F3F1E9] leading-tight mb-3">
              Let's Plan Something <span className="text-[#ECA241]">Extraordinary</span>
            </h1>
            <p className="text-[#F3F1E9]/55 text-lg max-w-xl" style={fontBody}>
              Tell us about your event and we'll craft a custom culinary experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="section-dark py-20 lg:py-28">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Sidebar */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-8">
              <div>
                <img src={LOGO_PRIMARY} alt="The PPL's Chef" className="h-20 w-auto object-contain drop-shadow-xl mb-4" />
                <p className="text-[#F3F1E9]/40 text-sm leading-relaxed" style={fontBody}>
                  Fill out the form and we'll respond within 24 hours with a custom proposal for your event.
                </p>
              </div>

              <div className="space-y-4">
                <a href="tel:725-212-2236" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 bg-[#D82E2B] flex items-center justify-center group-hover:bg-[#ECA241] transition-colors">
                    <Phone size={16} className="text-white" />
                  </div>
                  <div>
                    <div className="text-[#F3F1E9]/35 text-[10px] tracking-wider uppercase" style={fontBody}>Phone</div>
                    <div className="text-[#F3F1E9] text-sm font-medium" style={fontBody}>725-212-2236</div>
                  </div>
                </a>
                <a href="mailto:info@thepplschef.com" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 bg-[#D82E2B] flex items-center justify-center group-hover:bg-[#ECA241] transition-colors">
                    <Mail size={16} className="text-white" />
                  </div>
                  <div>
                    <div className="text-[#F3F1E9]/35 text-[10px] tracking-wider uppercase" style={fontBody}>Email</div>
                    <div className="text-[#F3F1E9] text-sm font-medium" style={fontBody}>info@thepplschef.com</div>
                  </div>
                </a>
              </div>

              <div>
                <div className="text-[#F3F1E9]/35 text-[10px] tracking-wider uppercase mb-3" style={fontBody}>Follow Us</div>
                <div className="flex gap-2">
                  {[
                    { icon: Instagram, href: "https://instagram.com/thepplschef", label: "Instagram" },
                    { icon: TikTokIcon, href: "https://tiktok.com/@thepplschef", label: "TikTok" },
                    { icon: Facebook, href: "https://facebook.com/thepplschef", label: "Facebook" },
                    { icon: XIcon, href: "https://x.com/thepplschef", label: "X" },
                  ].map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-[#ECA241]/15 flex items-center justify-center text-[#F3F1E9]/40 hover:bg-[#D82E2B] hover:border-[#D82E2B] hover:text-white transition-all duration-300" aria-label={s.label}>
                      <s.icon size={14} />
                    </a>
                  ))}
                </div>
              </div>

              <div className="border-l-2 border-[#ECA241]/25 pl-4">
                <p className="font-[family-name:var(--font-serif)] text-[#F3F1E9]/35 italic text-sm leading-relaxed">
                  "We treat every event like it's our own. Your vision is our mission."
                </p>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
              {submitted ? (
                <div className="bg-[#0a0a0a] border border-white/5 p-12 text-center">
                  <div className="w-16 h-16 bg-[#D82E2B] flex items-center justify-center mx-auto mb-6">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] text-2xl text-[#F3F1E9] mb-3">Inquiry Received</h3>
                  <p className="text-[#F3F1E9]/50 text-base mb-8 max-w-md mx-auto" style={fontBody}>
                    Thank you for reaching out! Our team will review your event details and respond within 24 hours with a custom proposal.
                  </p>
                  <Link href="/" className="btn-outline">Return Home</Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-[#0a0a0a] border border-white/5 p-8 lg:p-10">
                  <h3 className="font-[family-name:var(--font-display)] text-xl text-[#F3F1E9] mb-2">Event Inquiry Form</h3>
                  <p className="text-[#F3F1E9]/35 text-sm mb-8" style={fontBody}>Fields marked with * are required.</p>

                  {/* Personal Info */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-5 h-[1px] bg-[#ECA241]" />
                      <span className="text-[#ECA241] text-[10px] tracking-[0.2em] uppercase font-semibold" style={fontBody}>Your Information</span>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className={labelClass} style={fontBody}>Full Name *</label>
                        <input type="text" required value={form.name} onChange={(e) => update("name", e.target.value)} className={inputClass} style={fontBody} placeholder="Your name" />
                      </div>
                      <div>
                        <label className={labelClass} style={fontBody}>Email *</label>
                        <input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} style={fontBody} placeholder="your@email.com" />
                      </div>
                      <div>
                        <label className={labelClass} style={fontBody}>Phone *</label>
                        <input type="tel" required value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} style={fontBody} placeholder="(555) 123-4567" />
                      </div>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-5 h-[1px] bg-[#ECA241]" />
                      <span className="text-[#ECA241] text-[10px] tracking-[0.2em] uppercase font-semibold" style={fontBody}>Event Details</span>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className={labelClass} style={fontBody}>Event Date *</label>
                        <input type="date" required value={form.eventDate} onChange={(e) => update("eventDate", e.target.value)} className={inputClass} style={fontBody} />
                      </div>
                      <div>
                        <label className={labelClass} style={fontBody}>Event Time</label>
                        <input type="time" value={form.eventTime} onChange={(e) => update("eventTime", e.target.value)} className={inputClass} style={fontBody} />
                      </div>
                      <div>
                        <label className={labelClass} style={fontBody}>Number of Guests *</label>
                        <input type="number" required min="1" value={form.guests} onChange={(e) => update("guests", e.target.value)} className={inputClass} style={fontBody} placeholder="e.g. 25" />
                      </div>
                      <div className="sm:col-span-2 lg:col-span-1">
                        <label className={labelClass} style={fontBody}>Event Location *</label>
                        <input type="text" required value={form.location} onChange={(e) => update("location", e.target.value)} className={inputClass} style={fontBody} placeholder="Address or venue name" />
                      </div>
                      <div>
                        <label className={labelClass} style={fontBody}>Service Type *</label>
                        <select required value={form.serviceType} onChange={(e) => update("serviceType", e.target.value)} className={inputClass} style={fontBody}>
                          <option value="">Select service</option>
                          <option value="private-chef">Private Chef Experience</option>
                          <option value="catering">Full-Service Catering</option>
                          <option value="meal-boxes">Meal Boxes</option>
                          <option value="special-events">Special Events</option>
                          <option value="corporate">Corporate / Group Dining</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelClass} style={fontBody}>Estimated Budget</label>
                        <select value={form.budget} onChange={(e) => update("budget", e.target.value)} className={inputClass} style={fontBody}>
                          <option value="">Select range</option>
                          <option value="under-500">Under $500</option>
                          <option value="500-1000">$500 – $1,000</option>
                          <option value="1000-2500">$1,000 – $2,500</option>
                          <option value="2500-5000">$2,500 – $5,000</option>
                          <option value="5000-10000">$5,000 – $10,000</option>
                          <option value="10000+">$10,000+</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Menu Preferences */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-5 h-[1px] bg-[#ECA241]" />
                      <span className="text-[#ECA241] text-[10px] tracking-[0.2em] uppercase font-semibold" style={fontBody}>Menu Preferences</span>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass} style={fontBody}>Food Wishlist</label>
                        <textarea rows={3} value={form.foodWishlist} onChange={(e) => update("foodWishlist", e.target.value)} className={`${inputClass} resize-none`} style={fontBody} placeholder="Dishes, cuisines, or flavors you'd love..." />
                      </div>
                      <div>
                        <label className={labelClass} style={fontBody}>Dietary Restrictions</label>
                        <textarea rows={3} value={form.dietary} onChange={(e) => update("dietary", e.target.value)} className={`${inputClass} resize-none`} style={fontBody} placeholder="Allergies, vegan, gluten-free, halal, etc." />
                      </div>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div className="mb-8">
                    <label className={labelClass} style={fontBody}>Additional Notes</label>
                    <textarea rows={4} value={form.notes} onChange={(e) => update("notes", e.target.value)} className={`${inputClass} resize-none`} style={fontBody} placeholder="Anything else we should know about your event..." />
                  </div>

                  <button type="submit" className="w-full btn-primary text-center justify-center py-4">
                    Submit Inquiry
                  </button>
                  <p className="text-[#F3F1E9]/20 text-xs text-center mt-4" style={fontBody}>
                    We'll respond within 24 hours with a custom proposal.
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
