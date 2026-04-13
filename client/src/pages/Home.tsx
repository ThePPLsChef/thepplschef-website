/**
 * Home — Premium landing page for The PPL's Chef
 * Sections: Hero, Brand Intro, Services, Why Choose Us, Signature Experience,
 * Featured Dishes, 3-Step Process, Testimonials, Final CTA, About the Chef
 */
import Layout from "@/components/Layout";
import { JsonLd, localBusinessSchema, createFaqSchema } from "@/lib/seo";

import FAQ from "@/components/FAQ";
// Pricing component replaced with inline HomePricingTeaser on homepage
import ClientReviews from "@/components/ClientReviews";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "wouter";
import { Star, Quote, ChefHat, Users, Utensils, Clock, Award, Heart, ArrowRight, Phone, Mail, Instagram, Facebook, X, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { submitInquiry } from "@/lib/submitInquiry";
import {
  LOGO, LOGO_TRANSPARENT, LOGO_PRIMARY, LOGO_P_ICON, HERO_BG, ABOUT_CHEF, CHEF_OUTDOOR, CHEF_PLATING,
  SEAFOOD_BOWLS, PLATED_SALAD, GRILLED_ROMAINE, DESSERT_OVERHEAD,
  ELEGANT_TABLE, BUFFET_SERVICE, CARVING_STATION,
  GEN_PRIVATE_DINING, GEN_MEAL_BOX, GEN_SPECIAL_EVENTS, GEN_CORPORATE,
  OUTDOOR_PARTY, GALLERY_IMAGES,
  CHEF_PORTRAIT_1, CHEF_PORTRAIT_2,
  CHEF_REAL_PORTRAIT_1, CHEF_REAL_PORTRAIT_2,
  BEET_SALAD_SIDE, SHRIMP_CREAM_SAUCE, GLAZED_RIBS, PASTRY_TURNOVER,
  SEAFOOD_BOIL_CHEF, SEAFOOD_BOIL_CLOSE, SEAFOOD_BOIL_OVERHEAD, SEAFOOD_BOIL_CRAB,
  CHEF_BW_PORTRAIT
} from "@/lib/images";
import { AnimatePresence } from "framer-motion";

/* ─── Fade-in wrapper ─── */
function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Section Header ─── */
function SectionHeader({ label, title, titleAccent, subtitle, dark = false }: {
  label: string; title: string; titleAccent?: string; subtitle?: string; dark?: boolean;
}) {
  return (
    <FadeIn className="text-center mb-14 lg:mb-20">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className={`w-8 h-[1px] ${dark ? "bg-[#ECA241]" : "bg-[#D82E2B]"}`} />
        <span className={`brand-label ${dark ? "text-[#ECA241]" : "text-[#D82E2B]"}`}>{label}</span>
        <div className={`w-8 h-[1px] ${dark ? "bg-[#ECA241]" : "bg-[#D82E2B]"}`} />
      </div>
      <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl leading-tight">
        {title}{" "}
        {titleAccent && <span className={dark ? "text-[#ECA241]" : "text-[#D82E2B]"}>{titleAccent}</span>}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-base lg:text-lg max-w-2xl mx-auto leading-relaxed ${dark ? "text-[#F3F1E9]/55" : "text-black/55"}`} style={{ fontFamily: "var(--font-body)" }}>
          {subtitle}
        </p>
      )}
    </FadeIn>
  );
}

/* ─── TikTok / X icons ─── */
function TikTokIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.16z" /></svg>;
}
function XIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
}

/* ─── Service data ─── */
const serviceCards = [
  { title: "Private Chef", slug: "private-chef-las-vegas", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/1000009782_5e250fdb.jpg", desc: "Intimate, chef-driven dining in the comfort of your home." },
  { title: "Catering", slug: "catering-las-vegas", image: BUFFET_SERVICE, desc: "Full-service catering for events of every scale." },
  { title: "Meal Boxes", slug: "meal-prep-las-vegas", image: GEN_MEAL_BOX, desc: "Chef-crafted meals delivered fresh to your door." },
  { title: "Special Events", slug: "special-events-las-vegas", image: GEN_SPECIAL_EVENTS, desc: "Unforgettable celebrations with bespoke menus." },
  { title: "Corporate Dining", slug: "corporate-catering-las-vegas", image: GEN_CORPORATE, desc: "Elevate your business events with premium dining." },
];

/* ─── Why Choose Us data ─── */
const whyItems = [
  { icon: ChefHat, title: "Chef-Crafted Menus", desc: "Every menu is custom-designed by our chef to match your vision, dietary needs, and occasion." },
  { icon: Award, title: "Restaurant Quality", desc: "We bring five-star plating, flavor, and presentation to every event — no matter the venue." },
  { icon: Users, title: "Full-Service Team", desc: "From setup to cleanup, our professional team handles every detail so you can enjoy the moment." },
  { icon: Heart, title: "Personal Touch", desc: "We treat every event like it's our own. Your satisfaction and your guests' experience come first." },
];

/* ─── Testimonials ─── */
const testimonials = [
  { name: "Jessica M.", role: "40th Birthday Celebration", text: "The PPL's Chef transformed my birthday into an unforgettable culinary experience. Every dish was beautifully presented and absolutely delicious. Our guests are still talking about it weeks later.", rating: 5 },
  { name: "David & Sarah K.", role: "Anniversary Dinner", text: "We hired The PPL's Chef for an intimate anniversary dinner at home. The attention to detail — from the custom menu to the impeccable service — made us feel like we were at a five-star restaurant.", rating: 5 },
  { name: "Marcus T.", role: "Corporate Event Series", text: "Our company has used The PPL's Chef for three corporate events now, and each time they exceed expectations. The food quality is consistently outstanding, and the team is incredibly professional.", rating: 5 },
];

/* ─── Featured dishes ─── */
const featuredDishes = [
  { src: SEAFOOD_BOIL_CHEF, label: "Signature Seafood Boil" },
  { src: SEAFOOD_BOIL_CRAB, label: "Crab & Shrimp Boil" },
  { src: SEAFOOD_BOIL_OVERHEAD, label: "The Full Spread" },
  { src: SEAFOOD_BOIL_CLOSE, label: "Mussels & Clams" },
  { src: SHRIMP_CREAM_SAUCE, label: "Jumbo Shrimp" },
  { src: GLAZED_RIBS, label: "Signature Ribs" },
];

/* ─── HOMEPAGE GALLERY PREVIEW — Curated storytelling teaser ─── */
const galleryPreviewImages = [
  { src: BEET_SALAD_SIDE, title: "Roasted Beet Salad", desc: "Citrus-kissed beets with goat cheese and pistachios.", tag: "Private Dining" },
  { src: SHRIMP_CREAM_SAUCE, title: "Jumbo Shrimp", desc: "Pan-seared shrimp in house cream sauce.", tag: "Private Dining" },
  { src: SEAFOOD_BOIL_CHEF, title: "Signature Seafood Boil", desc: "Crab, shrimp, corn — served communal style.", tag: "Private Dining" },
  { src: GLAZED_RIBS, title: "Signature Glazed Ribs", desc: "Fall-off-the-bone ribs with house glaze.", tag: "Private Dining" },
  { src: PASTRY_TURNOVER, title: "Golden Pastry Turnover", desc: "Flaky pastry with savory filling.", tag: "Private Dining" },
  { src: ELEGANT_TABLE, title: "Private Dinner Setting", desc: "Elegant place settings for an intimate experience.", tag: "Private Dining" },
];

const previewAspects = ["aspect-[3/4]", "aspect-[4/5]", "aspect-square", "aspect-[4/5]", "aspect-[3/4]", "aspect-[5/4]"];

function HomepageGalleryPreview() {
  return (
    <section id="gallery" className="section-dark py-24 lg:py-32 relative overflow-hidden">
      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#ECA241]/40 to-transparent absolute top-0 left-0 right-0" />
      <div className="container relative z-10">
        <SectionHeader
          label="Our Work"
          title="Culinary"
          titleAccent="Gallery"
          subtitle="A curated collection of dishes, experiences, and moments crafted by The PPL's Chef."
          dark
        />
        <div className="columns-2 lg:columns-3 gap-4 space-y-4">
          {galleryPreviewImages.map((img, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div className="break-inside-avoid group relative overflow-hidden cursor-pointer">
                <div className={`relative overflow-hidden ${previewAspects[i]}`}>
                  <img src={img.src} alt={img.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" loading="lazy" />
                  <div className="absolute inset-0 bg-[#F3F1E9]/0 group-hover:bg-[#F3F1E9]/80 transition-all duration-300 ease-in-out flex flex-col items-start justify-end p-5">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                      <span className="text-[#D82E2B] text-[10px] font-semibold tracking-[0.15em] uppercase mb-1 block" style={{ fontFamily: "var(--font-body)" }}>{img.tag}</span>
                      <h3 className="text-black text-base font-semibold leading-tight mb-1" style={{ fontFamily: "var(--font-card-heading)" }}>{img.title}</h3>
                      <p className="text-black/60 text-sm leading-relaxed" style={{ fontFamily: "var(--font-card-body)" }}>{img.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn className="text-center mt-14" delay={0.4}>
          <Link href="/gallery" className="inline-flex items-center gap-3 px-10 py-4 bg-[#ECA241] text-black font-bold tracking-wider uppercase hover:bg-[#f0b050] transition-all duration-300 shadow-lg shadow-[#ECA241]/20" style={{ fontFamily: "var(--font-body)" }}>
            Explore Full Gallery <ArrowRight size={18} />
          </Link>
        </FadeIn>
      </div>
      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#ECA241]/40 to-transparent absolute bottom-0 left-0 right-0" />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HOME PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function Home() {
  const faqSchema = createFaqSchema([
    { question: "How far in advance should I book?", answer: "We recommend booking at least 2–4 weeks in advance for private chef experiences and small events. For large catering events (50+ guests), 4–8 weeks notice is ideal. However, we do our best to accommodate last-minute requests — reach out and we'll see what we can do." },
    { question: "Do you accommodate dietary restrictions and allergies?", answer: "Absolutely. Every menu we create is fully customizable. We regularly prepare meals for guests with allergies, vegan/vegetarian preferences, gluten-free needs, halal requirements, keto diets, and more. Just let us know during the consultation and we'll design a menu that works for everyone." },
    { question: "What areas do you serve?", answer: "We serve the entire Las Vegas Valley, including Las Vegas, Henderson, North Las Vegas, Summerlin, and surrounding areas. For events outside the metro area, please contact us to discuss travel arrangements and availability." },
    { question: "How does pricing work?", answer: "Pricing varies based on the type of service, number of guests, menu complexity, and event duration. Private chef experiences start at $125 per person, catering starts at $55 per person for buffet service, and meal prep boxes start at $75 for 5 meals. We provide a detailed custom quote after your initial consultation — no hidden fees." },
    { question: "Do you provide service staff, equipment, and setup?", answer: "Yes. Our full-service catering includes professional service staff, equipment, table setup, and complete cleanup. For private chef experiences, Chef Stephen handles all cooking, plating, and kitchen cleanup. You don't need to lift a finger." },
    { question: "Can I customize the menu?", answer: "Every menu is 100% customizable. The sample menus on our website are starting points to inspire you. During your consultation, we'll discuss your preferences, dietary needs, flavor profiles, and event theme to create a menu that's uniquely yours." },
    { question: "How does the meal prep / meal box service work?", answer: "Choose your proteins, pick your flavor style, and select your plan size. We prepare everything fresh and deliver it to your door. Available as a one-time order or weekly subscription." },
    { question: "What happens after I submit an inquiry?", answer: "After you submit your inquiry, we'll reach out within 24 hours to schedule a consultation. During the consultation, we'll discuss your vision, finalize the menu, and provide a detailed quote. Once confirmed, we handle all the logistics — you just show up and enjoy." },
  ]);

  return (
    <Layout>
      <JsonLd id="schema-local-business" data={localBusinessSchema} />
      <JsonLd id="schema-faq" data={faqSchema} />
      <HeroSection />
      <BrandIntro />
      <ServicesSection />
      <HomePricingTeaser />
      <WhyChooseUs />
      <SignatureExperience />
      <FeaturedDishes />
      <HomepageGalleryPreview />
      <BookingProcess />
      <ClientReviews />
      <FinalCTA />
      <AboutChef />
      <FAQ />
      <ContactSection />
    </Layout>
  );
}

/* ─── 1. HERO ─── */
function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background: overhead communal dining — people around table, hands reaching */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${HERO_BG})` }} />
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />
      {/* Gold accent line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ECA241]/60 to-transparent" />

      {/* Centered content */}
      <div className="relative z-10 container py-32 flex flex-col items-center text-center">
        {/* Transparent logo — no box, no border, no background */}
        <motion.img
          src={LOGO_PRIMARY}
          alt="The PPL's Chef"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="h-44 w-auto sm:h-60 object-contain mb-8 drop-shadow-2xl"
        />

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="flex items-center gap-3 mb-6">
          <div className="w-10 h-[1px] bg-[#ECA241]" />
          <span className="brand-label">Las Vegas Private Chef & Catering</span>
          <div className="w-10 h-[1px] bg-[#ECA241]" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] text-[#F3F1E9] leading-[1.05] mb-6 max-w-3xl"
        >
          Everybody Deserves to Have a{" "}
          <span className="text-[#ECA241]">Chef.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="text-[#F3F1E9]/80 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Las Vegas’s premier private chef and catering experience — restaurant-quality dining in the comfort of your chosen space.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.7 }} className="flex flex-wrap gap-4 justify-center">
          <Link href="/book" className="px-10 py-4 bg-[#ECA241] text-black text-base font-semibold tracking-wider uppercase hover:bg-[#f0b050] transition-all duration-300 shadow-lg shadow-[#ECA241]/30" style={{ fontFamily: "var(--font-body)" }}>
            Book Your Experience
          </Link>
          <a href="#services" onClick={(e) => { e.preventDefault(); document.getElementById("services")?.scrollIntoView({ behavior: "smooth" }); }} className="btn-outline">
            Our Services
          </a>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[#ECA241]/50 text-[10px] tracking-[0.3em] uppercase" style={{ fontFamily: "var(--font-body)" }}>Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-[1px] h-6 bg-gradient-to-b from-[#ECA241]/50 to-transparent" />
      </motion.div>
    </section>
  );
}

/* ─── 2. BRAND INTRO ─── */
function BrandIntro() {
  return (
    <section className="section-cream py-20 lg:py-28">
      <div className="container">
        <FadeIn className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-[#D82E2B]" />
            <span className="brand-label text-[#D82E2B]">Welcome</span>
            <div className="w-8 h-[1px] bg-[#D82E2B]" />
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl text-black leading-tight mb-6">
            The PPL's <span className="text-[#D82E2B]">Chef</span>
          </h2>
          <p className="text-black/60 text-lg lg:text-xl leading-relaxed mb-8" style={{ fontFamily: "var(--font-serif)", fontWeight: 400 }}>
            At The PPL'S Chef, we believe extraordinary food has the power to transform any gathering into a lasting memory. Based in Las Vegas, we specialize in bringing restaurant-quality dining directly to you — whether it's a private dinner for two, a corporate luncheon for fifty, or a celebration for hundreds.
          </p>
          <p className="text-black/50 text-base leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
            Every menu is custom-crafted. Every detail is considered. Every guest leaves impressed.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── 3. SERVICES ─── */
function ServicesSection() {
  return (
    <section id="services" className="section-dark py-24 lg:py-32">
      <div className="container">
        <SectionHeader
          label="Our Services"
          title="What We"
          titleAccent="Offer"
          subtitle="Five distinct culinary experiences, each tailored to your occasion and crafted with the same commitment to excellence."
          dark
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {serviceCards.slice(0, 3).map((s, i) => (
            <ServiceCard key={s.slug} s={s} i={i} />
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-5 mt-5 max-w-[calc(66.666%+0.625rem)] mx-auto">
          {serviceCards.slice(3).map((s, i) => (
            <ServiceCard key={s.slug} s={s} i={i + 3} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ s, i }: { s: typeof serviceCards[0]; i: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.08 }}>
      <Link href={`/${s.slug}`} className="group block relative overflow-hidden bg-[#0a0a0a] rounded-2xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.25),0_10px_10px_-5px_rgba(0,0,0,0.10)] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.30),0_10px_10px_-5px_rgba(0,0,0,0.12),0_0_20px_rgba(236,162,65,0.10)] transition-all duration-500 hover:-translate-y-2">
        <div className="relative h-56 overflow-hidden rounded-t-2xl">
          <img src={s.image} alt={s.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        </div>
        <div className="p-8 lg:p-10">
          <h3 className="text-lg lg:text-xl text-[#F3F1E9] mb-3 group-hover:text-[#ECA241] transition-colors duration-300" style={{ fontFamily: "var(--font-card-heading)" }}>{s.title}</h3>
          <p className="text-[#F3F1E9]/45 text-sm leading-relaxed mb-5" style={{ fontFamily: "var(--font-card-body)" }}>{s.desc}</p>
          <span className="text-[#ECA241]/60 group-hover:text-[#ECA241] text-xs tracking-widest uppercase font-semibold transition-colors flex items-center gap-2" style={{ fontFamily: "var(--font-card-body)" }}>
            Learn More <ArrowRight size={14} />
          </span>
        </div>
        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#ECA241] group-hover:w-full transition-all duration-500 rounded-b-2xl" />
      </Link>
    </motion.div>
  );
}

/* ─── 4. WHY CHOOSE US ─── */
function WhyChooseUs() {
  return (
    <section className="section-cream py-24 lg:py-32">
      <div className="container">
        <SectionHeader
          label="The Difference"
          title="Why Choose"
          titleAccent="The PPL's Chef"
          subtitle="Most people think a private chef is out of reach. We built The PPL'S Chef to change that — bringing restaurant-quality dining to everyday moments and once-in-a-lifetime celebrations alike. This is for the people."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {whyItems.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.1}>
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-6 rounded-xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.10),0_10px_10px_-5px_rgba(0,0,0,0.04)] bg-white flex items-center justify-center group-hover:bg-[#D82E2B] group-hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.12),0_0_16px_rgba(216,46,43,0.15)] transition-all duration-400">
                  <item.icon size={24} className="text-[#D82E2B] group-hover:text-white transition-colors duration-400" />
                </div>
                <h3 className="text-lg mb-3" style={{ fontFamily: "var(--font-card-heading)" }}>{item.title}</h3>
                <p className="text-black/50 text-sm leading-relaxed" style={{ fontFamily: "var(--font-card-body)" }}>{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 5. SIGNATURE EXPERIENCE ─── */
function SignatureExperience() {
  return (
    <section className="relative overflow-hidden">
      <div className="grid lg:grid-cols-2 min-h-[600px]">
        <div className="relative">
          <img src={ELEGANT_TABLE} alt="Elegant table setting by The PPL's Chef" className="w-full h-full object-cover min-h-[400px]" />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="bg-black flex items-center py-16 lg:py-0">
          <FadeIn className="px-8 lg:px-16 max-w-lg">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-[1px] bg-[#ECA241]" />
              <span className="brand-label">The Experience</span>
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl lg:text-4xl text-[#F3F1E9] leading-tight mb-6">
              More Than a Meal — It's a <span className="text-[#ECA241]">Moment</span>
            </h2>
            <p className="text-[#F3F1E9]/55 text-base leading-relaxed mb-5" style={{ fontFamily: "var(--font-serif)", fontWeight: 400 }}>
              What sets The PPL's Chef apart is our unwavering commitment to creating not just meals, but memories. Every ingredient is hand-selected. Every plate is composed with intention. Every guest is treated like family.
            </p>
            <p className="text-[#F3F1E9]/40 text-sm leading-relaxed mb-8" style={{ fontFamily: "var(--font-body)" }}>
              We bring the warmth of Southern hospitality, the precision of fine dining, and the creativity of a personal chef — all to the location of your choosing.
            </p>
            <Link href="/book" className="btn-primary">Start Planning</Link>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ─── 6. FEATURED DISHES ─── */
function FeaturedDishes() {
  return (
    <section className="section-cream py-24 lg:py-32">
      <div className="container">
        <SectionHeader
          label="From Our Kitchen"
          title="Signature"
          titleAccent="Dishes"
          subtitle="A glimpse into the culinary artistry we bring to every event."
        />
        <FadeIn className="text-center mb-10" delay={0.1}>
          <p className="text-black/60 text-base lg:text-lg mb-5" style={{ fontFamily: "var(--font-body)" }}>
            Every dish is crafted to your event. Tell us what you're craving.
          </p>
          <Link href="/book" className="btn-primary">
            Build Your Menu <ArrowRight size={16} className="inline ml-1" />
          </Link>
        </FadeIn>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredDishes.map((d, i) => (
            <FadeIn key={d.label} delay={i * 0.1}>
              <div className="group relative overflow-hidden aspect-[4/5]">
                <img src={d.src} alt={d.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-[#F3F1E9] text-sm font-semibold tracking-wider uppercase" style={{ fontFamily: "var(--font-body)" }}>{d.label}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 3.5. HOMEPAGE PRICING TEASER ─── */
const pricingTeasers = [
  {
    title: "Private Chef Experience",
    starting: "Experiences starting at $125/person",
    desc: "Fully customized. Professionally executed. Unforgettable.",
  },
  {
    title: "Catering & Events",
    starting: "Catering starting at $45/person",
    desc: "From intimate gatherings to large-scale celebrations \u2014 every event, handled.",
  },
  {
    title: "Meal Boxes",
    starting: "Weekly meal plans starting at $120/week",
    desc: "Chef-crafted meals delivered fresh to your door.",
  },
];

function HomePricingTeaser() {
  return (
    <section className="section-dark py-24 lg:py-32">
      <div className="container">
        <SectionHeader
          label="Pricing"
          title="Chef-Quality Dining"
          titleAccent="For Every Occasion"
          subtitle="Transparent, flexible pricing designed to bring restaurant-quality dining to your table."
          dark
        />
        <div className="grid sm:grid-cols-3 gap-6 lg:gap-8">
          {pricingTeasers.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.1}>
              <div className="rounded-2xl bg-white/[0.03] p-10 lg:p-12 flex flex-col h-full shadow-[0_20px_25px_-5px_rgba(0,0,0,0.25),0_10px_10px_-5px_rgba(0,0,0,0.10)] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.30),0_10px_10px_-5px_rgba(0,0,0,0.12),0_0_20px_rgba(236,162,65,0.10)] hover:-translate-y-2 transition-all duration-300">
                <h3
                  className="text-xl lg:text-2xl text-[#F3F1E9] mb-3"
                  style={{ fontFamily: "var(--font-card-heading)" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-[#ECA241] text-base font-semibold mb-3"
                  style={{ fontFamily: "var(--font-card-body)" }}
                >
                  {item.starting}
                </p>
                <p
                  className="text-[#F3F1E9]/50 text-sm leading-relaxed mb-8 flex-1"
                  style={{ fontFamily: "var(--font-card-body)" }}
                >
                  {item.desc}
                </p>
                <Link
                  href="/book"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#ECA241] text-black text-sm font-bold tracking-wider uppercase hover:bg-[#f0b050] transition-all duration-300 rounded-xl"
                  style={{ fontFamily: "var(--font-card-body)" }}
                >
                  Book Your Experience <ArrowRight size={15} />
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 7. BOOKING PROCESS ─── */
function BookingProcess() {
  const steps = [
    { num: "01", title: "Tell Us About Your Event", desc: "Share your vision, guest count, date, and any special requests through our inquiry form." },
    { num: "02", title: "We Craft the Experience", desc: "Our chef designs a custom menu and plan tailored to your event, preferences, and budget." },
    { num: "03", title: "You Enjoy the Moment", desc: "We handle everything — setup, cooking, service, and cleanup. You simply enjoy the experience." },
  ];

  return (
    <section className="section-dark py-24 lg:py-32">
      <div className="container">
        <SectionHeader
          label="How It Works"
          title="Three Simple"
          titleAccent="Steps"
          subtitle="Booking your culinary experience is effortless."
          dark
        />
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, i) => (
            <FadeIn key={step.num} delay={i * 0.15}>
              <div className="text-center">
                <div className="font-[family-name:var(--font-display)] text-5xl text-[#ECA241]/20 mb-4">{step.num}</div>
                <h3 className="font-[family-name:var(--font-display)] text-xl text-[#F3F1E9] mb-3">{step.title}</h3>
                <p className="text-[#F3F1E9]/45 text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{step.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn className="text-center mt-14" delay={0.4}>
          <Link href="/book" className="btn-primary">Get Started</Link>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── 8. TESTIMONIALS ─── */
function TestimonialsSection() {
  return (
    <section id="testimonials" className="section-cream py-24 lg:py-32">
      <div className="container">
        <SectionHeader
          label="Client Experiences"
          title="What Our Clients"
          titleAccent="Say"
        />
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.12}>
              <div className="bg-white rounded-2xl p-10 lg:p-12 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.10),0_10px_10px_-5px_rgba(0,0,0,0.04)] group hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.12),0_10px_10px_-5px_rgba(0,0,0,0.06),0_0_16px_rgba(236,162,65,0.08)] hover:-translate-y-2 transition-all duration-300 h-full flex flex-col">
                <Quote className="text-[#ECA241]/20 mb-4" size={36} />
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} className="text-[#ECA241] fill-[#ECA241]" />
                  ))}
                </div>
                <p className="text-black/65 leading-relaxed mb-8 flex-1" style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "0.95rem" }}>
                  "{t.text}"
                </p>
                <div className="border-t border-black/5 pt-5">
                  <div className="text-base text-black" style={{ fontFamily: "var(--font-card-heading)" }}>{t.name}</div>
                  <div className="text-[#D82E2B]/60 text-xs tracking-wider uppercase mt-1" style={{ fontFamily: "var(--font-card-body)" }}>{t.role}</div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 9. FINAL CTA ─── */
function FinalCTA() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${OUTDOOR_PARTY})` }} />
      <div className="absolute inset-0 bg-black/75" />
      <div className="relative z-10 container text-center">
        <FadeIn>
          <img src={LOGO_PRIMARY} alt="The PPL's Chef" className="h-44 w-auto sm:h-60 object-contain mx-auto mb-6 drop-shadow-xl" />
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl text-[#F3F1E9] leading-tight mb-5">
            Ready to Create Something <span className="text-[#ECA241]">Extraordinary?</span>
          </h2>
          <p className="text-[#F3F1E9]/55 text-base lg:text-lg max-w-xl mx-auto mb-10 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
            Let us bring the restaurant to you. Tell us about your event and we'll craft a custom experience your guests will never forget.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/book" className="btn-primary">Book Your Experience</Link>
            <a href="tel:725-212-2236" className="btn-outline">Call 725-212-2236</a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── 10. ABOUT THE CHEF ─── */
function AboutChef() {
  return (
    <section id="about" className="section-cream py-24 lg:py-32">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <FadeIn>
            <div className="relative">
              {/* Primary portrait: dramatic B&W headshot */}
              <img
                src={CHEF_BW_PORTRAIT}
                alt="Chef Stephen Austin — CEO & Director of Culinary Operations, The PPL's Chef"
                className="w-full h-[520px] lg:h-[640px] object-cover object-top"
              />
              {/* Gold corner accent */}
              <div className="absolute top-4 left-4 w-14 h-14 border-t-2 border-l-2 border-[#ECA241]" />
              {/* Red accent bar at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#D82E2B]" />
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="pb-10 lg:pb-0">
            <div className="flex items-center gap-4 mb-6">
              <img src={LOGO_PRIMARY} alt="The PPL's Chef" className="h-16 w-auto object-contain drop-shadow-lg" />
              <div>
                <div className="font-[family-name:var(--font-display)] text-lg text-black">The PPL's <span className="text-[#D82E2B]">Chef</span></div>
                <div className="text-[#D82E2B]/60 text-[10px] tracking-[0.25em] uppercase" style={{ fontFamily: "var(--font-body)" }}>The People's Chef</div>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-[#D82E2B]" />
              <span className="brand-label text-[#D82E2B]">Meet the Chef</span>
            </div>

            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl text-black leading-tight mb-2">
              Chef Stephen <span className="text-[#D82E2B]">Austin</span>
            </h2>
            <p className="text-[#ECA241] text-sm tracking-widest uppercase mb-6" style={{ fontFamily: "var(--font-body)", fontWeight: 600 }}>CEO &amp; Director of Culinary Operations</p>

            <div className="space-y-4 text-black/60 text-base leading-relaxed" style={{ fontFamily: "var(--font-serif)", fontWeight: 400 }}>
              <p>
                Chef Stephen Austin is the founder and culinary force behind The PPL's Chef — Las Vegas's premier private chef and catering experience. Born and raised in Georgia, Chef Stephen spent over 25 years immersed in professional kitchens, learning and mastering every aspect of the culinary craft from the ground up.
              </p>
              <p>
                After relocating to Las Vegas, he formalized his training at the College of Southern Nevada, where he sharpened his technical skills and deepened his passion for creating exceptional dining experiences. That passion became a mission: to bring restaurant-quality food directly to the people — in their homes, at their events, and in their most meaningful moments.
              </p>
              <p>
                Today, The PPL's Chef serves clients across the Las Vegas Valley with custom menus, full-service catering, and intimate private dining experiences that turn every occasion into an unforgettable memory.
              </p>
            </div>

            {/* Pull quote */}
            <blockquote className="mt-7 border-l-4 border-[#D82E2B] pl-5">
              <p className="text-black/70 text-base italic leading-relaxed" style={{ fontFamily: "var(--font-serif)", fontWeight: 400 }}>
                "I spent my life in kitchens learning and training so people can enjoy moments with food."
              </p>
              <footer className="mt-2 text-[#D82E2B] text-xs tracking-widest uppercase" style={{ fontFamily: "var(--font-body)", fontWeight: 600 }}>— Chef Stephen Austin</footer>
            </blockquote>

            <div className="mt-8 flex gap-10 lg:gap-14">
              {[
                { num: "25+", label: "Years Experience" },
                { num: "500+", label: "Events Served" },
                { num: "5★", label: "Client Rating" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-[family-name:var(--font-display)] text-2xl lg:text-3xl text-[#D82E2B]">{s.num}</div>
                  <div className="text-black/40 text-xs mt-1 tracking-wide" style={{ fontFamily: "var(--font-body)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ─── 11. CONTACT SECTION ─── */
const HOMEPAGE_SERVICE_MAP: Record<string, string> = {
  "private-chef": "Private Chef",
  "catering": "Catering",
  "meal-boxes": "Meal Prep",
  "special-events": "Special Events",
  "corporate": "Corporate Dining",
};
function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", eventType: "", message: "" });
  const [isPending, setIsPending] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      await submitInquiry({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        serviceType: HOMEPAGE_SERVICE_MAP[form.eventType] || form.eventType || undefined,
        notes: form.message || undefined,
      });
      toast.success("Thank you! We'll be in touch within 24 hours.");
      setForm({ name: "", email: "", phone: "", eventType: "", message: "" });
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <section id="contact" className="section-dark py-24 lg:py-32">
      <div className="container">
        {/* ─── PRIMARY: Wizard CTA ─── */}
        <FadeIn className="max-w-3xl mx-auto text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-[1px] bg-[#ECA241]" />
            <span className="brand-label">Get In Touch</span>
            <div className="w-8 h-[1px] bg-[#ECA241]" />
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl text-[#F3F1E9] leading-tight mb-4">
            Ready to Book? <span className="text-[#ECA241]">Start Here.</span>
          </h2>
          <p className="text-[#F3F1E9]/55 text-base lg:text-lg max-w-xl mx-auto mb-8 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
            Our guided booking experience walks you through every detail in 3 minutes — so we can design your event before we ever speak.
          </p>
          <Link
            href="/book"
            className="inline-flex items-center gap-3 px-12 py-5 text-black font-bold tracking-wider uppercase text-sm shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-0.5"
            style={{ fontFamily: "var(--font-body)", background: "linear-gradient(135deg, #C49A3A 0%, #ECA241 60%, #F5A623 100%)" }}
          >
            Start Your Curated Experience
            <ArrowRight size={18} />
          </Link>
          <p className="mt-4 text-[#F3F1E9]/25 text-xs" style={{ fontFamily: "var(--font-body)" }}>
            Not a finalized booking — just the start of something great.
          </p>
        </FadeIn>

        {/* ─── Contact info strip ─── */}
        <FadeIn className="flex flex-wrap justify-center gap-8 lg:gap-16 mb-14 pb-14 border-b border-white/5" delay={0.1}>
          <a href="tel:725-212-2236" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-[#D82E2B]/80 flex items-center justify-center group-hover:bg-[#ECA241] transition-colors duration-300 shrink-0">
              <Phone size={15} className="text-white" />
            </div>
            <div>
              <div className="text-[#F3F1E9]/35 text-[9px] tracking-wider uppercase" style={{ fontFamily: "var(--font-body)" }}>Call Us</div>
              <div className="text-[#F3F1E9]/80 font-medium text-sm" style={{ fontFamily: "var(--font-body)" }}>725-212-2236</div>
            </div>
          </a>
          <a href="mailto:info@thepplschef.com" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-[#D82E2B]/80 flex items-center justify-center group-hover:bg-[#ECA241] transition-colors duration-300 shrink-0">
              <Mail size={15} className="text-white" />
            </div>
            <div>
              <div className="text-[#F3F1E9]/35 text-[9px] tracking-wider uppercase" style={{ fontFamily: "var(--font-body)" }}>Email</div>
              <div className="text-[#F3F1E9]/80 font-medium text-sm" style={{ fontFamily: "var(--font-body)" }}>info@thepplschef.com</div>
            </div>
          </a>
        </FadeIn>

        {/* ─── SECONDARY: Fallback form (collapsed by default) ─── */}
        <FadeIn className="max-w-2xl mx-auto" delay={0.2}>
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="w-full flex items-center justify-center gap-2 py-3 text-[#F3F1E9]/25 text-xs tracking-widest uppercase hover:text-[#F3F1E9]/45 transition-colors duration-300"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <span>Have a unique request? Send a message instead</span>
            <motion.span animate={{ rotate: showForm ? 180 : 0 }} transition={{ duration: 0.3 }}>
              ▾
            </motion.span>
          </button>

          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="bg-[#080808] border border-white/[0.06] p-8 mt-3">
                  <p className="text-[#F3F1E9]/30 text-sm mb-6 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                    For unusual requests or if you'd simply rather send a message — we're here. Otherwise, the booking experience above is the fastest path to your custom quote.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { label: "Full Name", key: "name", type: "text", placeholder: "Your name", required: true },
                        { label: "Email", key: "email", type: "email", placeholder: "your@email.com", required: true },
                        { label: "Phone", key: "phone", type: "tel", placeholder: "(555) 123-4567", required: false },
                      ].map((f) => (
                        <div key={f.key}>
                          <label className="text-[#F3F1E9]/30 text-[10px] tracking-wider uppercase block mb-1.5" style={{ fontFamily: "var(--font-body)" }}>{f.label} {f.required && "*"}</label>
                          <input
                            type={f.type}
                            required={f.required}
                            value={(form as any)[f.key]}
                            onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                            className="w-full px-4 py-3 bg-black/60 border border-white/8 text-[#F3F1E9]/80 placeholder-[#F3F1E9]/20 focus:border-[#ECA241]/40 focus:outline-none transition-colors text-sm"
                            style={{ fontFamily: "var(--font-body)" }}
                            placeholder={f.placeholder}
                          />
                        </div>
                      ))}
                      <div>
                        <label className="text-[#F3F1E9]/30 text-[10px] tracking-wider uppercase block mb-1.5" style={{ fontFamily: "var(--font-body)" }}>Event Type</label>
                        <select
                          value={form.eventType}
                          onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                          className="w-full px-4 py-3 bg-black/60 border border-white/8 text-[#F3F1E9]/80 focus:border-[#ECA241]/40 focus:outline-none transition-colors text-sm"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          <option value="">Select type</option>
                          <option value="private-chef">Private Chef</option>
                          <option value="catering">Catering</option>
                          <option value="meal-boxes">Meal Boxes</option>
                          <option value="special-events">Special Events</option>
                          <option value="corporate">Corporate Dining</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[#F3F1E9]/30 text-[10px] tracking-wider uppercase block mb-1.5" style={{ fontFamily: "var(--font-body)" }}>Your Request / Notes *</label>
                      <textarea
                        required
                        rows={4}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full px-4 py-3 bg-black/60 border border-white/8 text-[#F3F1E9]/80 placeholder-[#F3F1E9]/20 focus:border-[#ECA241]/40 focus:outline-none transition-colors text-sm resize-none"
                        style={{ fontFamily: "var(--font-body)" }}
                        placeholder="Tell us about your unique situation or anything the booking wizard didn't cover..."
                      />
                    </div>
                    <button
                      type="submit" disabled={isPending}
                      className="w-full py-3.5 border border-[#ECA241]/25 text-[#F3F1E9]/60 text-sm font-semibold tracking-wider uppercase hover:border-[#ECA241]/50 hover:text-[#F3F1E9]/80 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {isPending ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </FadeIn>
      </div>
    </section>
  );
}
