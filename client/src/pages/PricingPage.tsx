/**
 * PricingPage — Premium standalone pricing page
 * Explains starting points, package logic, and when custom quoting applies.
 * Dark/gold luxury hospitality aesthetic with clear CTAs.
 */
import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { Check, ArrowRight, Phone, Mail, ChefHat, Utensils, Leaf, Sparkles } from "lucide-react";
import Layout from "@/components/Layout";
import { HERO_BG, LOGO_PRIMARY } from "@/lib/images";

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

const fontBody = { fontFamily: "var(--font-body)" };
const fontDisplay = { fontFamily: "var(--font-display)" };

/* ─── Pricing data ─── */
const pricingCategories = [
  {
    icon: ChefHat,
    title: "Private Chef Experience",
    subtitle: "Intimate, chef-driven dining in the comfort of your home",
    tiers: [
      {
        name: "Signature",
        price: "$125",
        period: "/person",
        popular: false,
        desc: "A beautifully executed custom menu for intimate gatherings.",
        features: [
          "Custom curated menu designed for your occasion",
          "On-site preparation and professional plating",
          "Full kitchen cleanup included",
          "Ideal for 2–10 guests",
        ],
      },
      {
        name: "Elevated",
        price: "$165",
        period: "/person",
        popular: true,
        desc: "Multi-course dining with enhanced presentation and premium touches.",
        features: [
          "Multi-course dining experience",
          "Tableside finishing elements",
          "Premium ingredient upgrades available",
          "Enhanced plating and presentation",
          "Ideal for special occasions",
        ],
      },
      {
        name: "Luxury",
        price: "$225",
        period: "/person",
        popular: false,
        desc: "A fully bespoke tasting menu with VIP-level service.",
        features: [
          "Fully customized tasting menu",
          "High-end ingredients (wagyu, lobster, truffle)",
          "Interactive dining experience",
          "VIP-level service and presentation",
          "Ideal for milestone celebrations",
        ],
      },
    ],
    ctaService: "private-chef",
  },
  {
    icon: Utensils,
    title: "Catering & Events",
    subtitle: "Full-service catering for events of every scale",
    tiers: [
      {
        name: "Signature",
        price: "$45",
        period: "/person",
        popular: false,
        desc: "Crowd-pleasing menus with professional buffet or family-style service.",
        features: [
          "Buffet or family-style service",
          "Crowd-pleasing menu selections",
          "Professional setup and cleanup",
        ],
      },
      {
        name: "Elevated",
        price: "$65",
        period: "/person",
        popular: true,
        desc: "Upgraded menus with enhanced presentation and passed items.",
        features: [
          "Upgraded menu options",
          "Enhanced presentation",
          "Mix of passed and displayed items",
          "Service staff included",
        ],
      },
      {
        name: "Luxury",
        price: "$95",
        period: "/person",
        popular: false,
        desc: "Fully customized menus with interactive stations and premium ingredients.",
        features: [
          "Fully customized menu",
          "Interactive stations or plated service",
          "Premium ingredients",
          "High-end presentation",
          "Full-service team",
        ],
      },
    ],
    ctaService: "catering",
  },
  {
    icon: Leaf,
    title: "Chef-Crafted Meal Prep",
    subtitle: "Fresh, chef-prepared meals delivered to your door",
    tiers: [
      {
        name: "Signature",
        price: "$120",
        period: "/week",
        popular: false,
        desc: "Balanced, chef-prepared meals with a weekly rotating menu.",
        features: [
          "Weekly rotating menu",
          "Balanced, chef-prepared meals",
          "Fresh delivery to your door",
        ],
      },
      {
        name: "Elevated",
        price: "$160",
        period: "/week",
        popular: true,
        desc: "Expanded options with higher-end ingredients and greater customization.",
        features: [
          "Expanded menu options",
          "Higher-end ingredients",
          "Greater customization",
          "Flexible delivery schedule",
        ],
      },
      {
        name: "Luxury",
        price: "$220",
        period: "/week",
        popular: false,
        desc: "A fully personalized weekly plan with premium ingredients and dietary optimization.",
        features: [
          "Fully customized weekly plan",
          "Premium ingredients",
          "Personalized dietary optimization",
          "Priority scheduling",
        ],
      },
    ],
    ctaService: "meal-prep",
  },
];

export default function PricingPage() {
  useEffect(() => {
    document.title = "Pricing | The PPL's Chef | Las Vegas Private Chef & Catering";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Transparent pricing for The PPL's Chef — private chef experiences starting at $125/person, catering from $45/person, and meal prep from $120/week. Every menu is custom-designed.");
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      {/* ─── HERO ─── */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${HERO_BG})` }} />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ECA241]/60 to-transparent" />

        <div className="relative z-10 container py-32 text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="flex items-center justify-center gap-3 mb-5">
            <div className="w-10 h-[1px] bg-[#ECA241]" />
            <span className="brand-label">Transparent Pricing</span>
            <div className="w-10 h-[1px] bg-[#ECA241]" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-6xl text-[#F3F1E9] leading-tight mb-5"
          >
            Premium Culinary <span className="text-[#ECA241]">Experiences</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-[#F3F1E9]/60 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
            style={fontBody}
          >
            Every experience is custom-designed. These starting points give you a clear picture of what to expect — your final quote is always tailored to your vision.
          </motion.p>
        </div>
      </section>

      {/* ─── HOW PRICING WORKS ─── */}
      <section className="section-cream py-16 lg:py-20">
        <div className="container max-w-4xl">
          <FadeIn className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl text-black leading-tight mb-4">
              How Our Pricing <span className="text-[#D82E2B]">Works</span>
            </h2>
            <p className="text-black/55 text-base lg:text-lg max-w-2xl mx-auto leading-relaxed" style={fontBody}>
              We believe in transparency. Every price listed below is a starting point — your final quote is customized based on guest count, menu complexity, ingredients, and event details. No hidden fees, ever.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Browse Starting Points", desc: "Review our three service categories and tier options below to understand the range." },
              { step: "02", title: "Share Your Vision", desc: "Tell us about your event, guest count, dietary needs, and any special requests." },
              { step: "03", title: "Receive a Custom Quote", desc: "We'll design a menu and provide a detailed, transparent quote within 24 hours." },
            ].map((item, i) => (
              <FadeIn key={item.step} delay={i * 0.1}>
                <div className="text-center">
                  <div className="text-[#D82E2B] text-3xl font-bold mb-3" style={fontDisplay}>{item.step}</div>
                  <h3 className="text-lg font-semibold text-black mb-2" style={{ fontFamily: "var(--font-card-heading)" }}>{item.title}</h3>
                  <p className="text-black/50 text-sm leading-relaxed" style={fontBody}>{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING TIERS ─── */}
      {pricingCategories.map((category, catIdx) => (
        <section
          key={category.title}
          className={catIdx % 2 === 0 ? "section-dark py-20 lg:py-28" : "section-cream py-20 lg:py-28"}
        >
          <div className="container">
            <FadeIn className="text-center mb-14 lg:mb-18">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className={`w-8 h-[1px] ${catIdx % 2 === 0 ? "bg-[#ECA241]" : "bg-[#D82E2B]"}`} />
                <category.icon size={20} className={catIdx % 2 === 0 ? "text-[#ECA241]" : "text-[#D82E2B]"} />
                <div className={`w-8 h-[1px] ${catIdx % 2 === 0 ? "bg-[#ECA241]" : "bg-[#D82E2B]"}`} />
              </div>
              <h2 className={`font-[family-name:var(--font-display)] text-3xl sm:text-4xl leading-tight mb-3 ${catIdx % 2 === 0 ? "text-[#F3F1E9]" : "text-black"}`}>
                {category.title}
              </h2>
              <p className={`text-base max-w-xl mx-auto ${catIdx % 2 === 0 ? "text-[#F3F1E9]/50" : "text-black/50"}`} style={fontBody}>
                {category.subtitle}
              </p>
            </FadeIn>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {category.tiers.map((tier, tierIdx) => {
                const isDark = catIdx % 2 === 0;
                return (
                  <FadeIn key={tier.name} delay={tierIdx * 0.1}>
                    <div className={`relative group h-full transition-all duration-300 ${tier.popular ? "md:scale-105 md:-mt-4" : ""}`}>
                      <div className={`relative h-full rounded-2xl transition-all duration-300 ${
                        isDark
                          ? tier.popular
                            ? "bg-gradient-to-br from-[#D82E2B]/10 to-[#ECA241]/5 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.30),0_10px_10px_-5px_rgba(0,0,0,0.12),0_0_24px_rgba(236,162,65,0.18)]"
                            : "bg-[#0a0a0a] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.25),0_10px_10px_-5px_rgba(0,0,0,0.10)] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.30),0_0_20px_rgba(236,162,65,0.10)]"
                          : tier.popular
                            ? "bg-white shadow-[0_20px_25px_-5px_rgba(0,0,0,0.12),0_10px_10px_-5px_rgba(0,0,0,0.06),0_0_24px_rgba(216,46,43,0.10)]"
                            : "bg-white/80 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.08),0_10px_10px_-5px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.12),0_0_16px_rgba(216,46,43,0.06)]"
                      }`}>
                        {/* Popular Badge */}
                        {tier.popular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-[#D82E2B] text-white text-[10px] font-bold tracking-widest uppercase rounded-full shadow-[0_4px_12px_rgba(216,46,43,0.3)]">
                            Most Popular
                          </div>
                        )}

                        <div className="p-10 lg:p-12 flex flex-col h-full">
                          {/* Tier Name */}
                          <h3 className={`text-xl mb-1 ${isDark ? "text-[#F3F1E9]" : "text-black"}`} style={{ fontFamily: "var(--font-card-heading)" }}>
                            {tier.name}
                          </h3>
                          <p className={`text-sm mb-5 ${isDark ? "text-[#F3F1E9]/40" : "text-black/40"}`} style={fontBody}>
                            {tier.desc}
                          </p>

                          {/* Price */}
                          <div className="mb-6">
                            <div className="flex items-baseline gap-1">
                              <span className="text-[#ECA241] text-4xl font-bold">{tier.price}</span>
                              <span className={`text-sm ${isDark ? "text-[#F3F1E9]/40" : "text-black/40"}`} style={fontBody}>
                                {tier.period}
                              </span>
                            </div>
                            <p className={`text-xs mt-1 ${isDark ? "text-[#F3F1E9]/30" : "text-black/30"}`} style={fontBody}>
                              Starting at
                            </p>
                          </div>

                          {/* Features */}
                          <ul className="space-y-3 mb-8 flex-grow">
                            {tier.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <Check size={16} className="text-[#ECA241] shrink-0 mt-0.5" />
                                <span className={`text-sm ${isDark ? "text-[#F3F1E9]/65" : "text-black/60"}`} style={fontBody}>
                                  {feature}
                                </span>
                              </li>
                            ))}
                          </ul>

                          {/* CTA */}
                          <Link
                            href={`/book?service=${category.ctaService}`}
                            className={`w-full py-4 font-bold tracking-wider uppercase transition-all duration-300 text-center rounded-xl text-sm ${
                              tier.popular
                                ? "bg-[#D82E2B] text-white hover:bg-[#ECA241] hover:text-black shadow-[0_8px_16px_rgba(216,46,43,0.25)]"
                                : isDark
                                  ? "bg-transparent text-[#ECA241] hover:bg-[#ECA241] hover:text-black shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-[#ECA241]/20"
                                  : "bg-transparent text-[#D82E2B] hover:bg-[#D82E2B] hover:text-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-[#D82E2B]/20"
                            }`}
                            style={{ fontFamily: "var(--font-card-body)" }}
                          >
                            Book This Experience
                          </Link>
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      {/* ─── CUSTOM QUOTE CTA ─── */}
      <section className="section-dark py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${HERO_BG})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/95" />
        <div className="relative z-10 container max-w-3xl text-center">
          <FadeIn>
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="w-8 h-[1px] bg-[#ECA241]" />
              <Sparkles size={18} className="text-[#ECA241]" />
              <div className="w-8 h-[1px] bg-[#ECA241]" />
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl text-[#F3F1E9] leading-tight mb-5">
              Need Something <span className="text-[#ECA241]">Custom?</span>
            </h2>
            <p className="text-[#F3F1E9]/55 text-lg leading-relaxed mb-4 max-w-2xl mx-auto" style={fontBody}>
              Every event is unique. If your vision doesn't fit neatly into a tier, that's exactly what we're here for. Tell us what you're imagining and we'll design an experience — and a price — that's built around you.
            </p>
            <p className="text-[#F3F1E9]/35 text-sm leading-relaxed mb-10 max-w-xl mx-auto" style={fontBody}>
              Large events, multi-day experiences, corporate contracts, and unique concepts are all welcome. We love a challenge.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/book"
                className="px-10 py-4 bg-[#ECA241] text-black text-base font-semibold tracking-wider uppercase hover:bg-[#f0b050] transition-all duration-300 shadow-lg shadow-[#ECA241]/30"
                style={fontBody}
              >
                Request a Custom Quote
              </Link>
              <a
                href="tel:725-212-2236"
                className="px-10 py-4 border-2 border-[#F3F1E9]/20 text-[#F3F1E9] text-base font-semibold tracking-wider uppercase hover:border-[#ECA241] hover:text-[#ECA241] transition-all duration-300 flex items-center gap-2"
                style={fontBody}
              >
                <Phone size={16} /> Call Us
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── FAQ-STYLE PRICING NOTES ─── */}
      <section className="section-cream py-16 lg:py-20">
        <div className="container max-w-3xl">
          <FadeIn className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl text-black leading-tight mb-3">
              Common <span className="text-[#D82E2B]">Questions</span>
            </h2>
          </FadeIn>
          <div className="space-y-6">
            {[
              {
                q: "Are these prices fixed or starting points?",
                a: "All prices listed are starting points. Your final quote is customized based on your specific guest count, menu selections, ingredient preferences, and event details. We provide a detailed, transparent quote after your consultation — no surprises.",
              },
              {
                q: "What's included in the price?",
                a: "Private chef experiences include menu design, grocery shopping, on-site preparation, professional plating, and full kitchen cleanup. Catering includes setup, service staff, equipment, and cleanup. Meal prep includes preparation, packaging, and delivery.",
              },
              {
                q: "Do you require a deposit?",
                a: "Yes, we require a 50% deposit to secure your date. The remaining balance is due on the day of your event. For meal prep subscriptions, payment is collected weekly.",
              },
              {
                q: "What if my event doesn't fit a standard tier?",
                a: "That's perfectly fine — most of our clients receive custom quotes. Use the booking form or call us directly, and we'll design a package that matches your vision and budget.",
              },
              {
                q: "Is there a minimum guest count?",
                a: "Private chef experiences have a minimum of 2 guests. Catering events typically start at 10 guests. Meal prep is available for individuals and families of any size.",
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="bg-white rounded-xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                  <h3 className="text-base font-semibold text-black mb-2" style={{ fontFamily: "var(--font-card-heading)" }}>{item.q}</h3>
                  <p className="text-black/55 text-sm leading-relaxed" style={fontBody}>{item.a}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
