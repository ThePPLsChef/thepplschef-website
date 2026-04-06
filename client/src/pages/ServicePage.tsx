/**
 * ServicePage — Dedicated page for each of the 5 service categories.
 * Dynamic routing via /services/:slug
 * BRAND: Abril Fatface headings, DM Sans body, Cormorant Garamond serif accents.
 * Colors: Black #000, Cream #F3F1E9, Red #D82E2B, Gold #ECA241.
 */
import { useParams, Link, Redirect } from "wouter";
import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Check, Users, ChevronLeft } from "lucide-react";
import ServicePricingSection, { PricingTier } from "@/components/ServicePricingSection";
import Layout from "@/components/Layout";
import { getServiceBySlug, services } from "@/lib/services";
import { LOGO_PRIMARY, LOGO_P_ICON } from "@/lib/images";

function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay }} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── Per-service pricing data ─── */
const servicePricingData: Record<string, { tiers: PricingTier[]; ctaHref: string }> = {
  "private-chef-las-vegas": {
    ctaHref: "/contact",
    tiers: [
      {
        name: "Signature Experience",
        price: "$125",
        period: "/person",
        popular: false,
        features: [
          "Custom curated menu",
          "On-site preparation",
          "Professional plating",
          "Ideal for intimate gatherings",
        ],
      },
      {
        name: "Elevated Experience",
        price: "$165",
        period: "/person",
        popular: true,
        features: [
          "Multi-course dining experience",
          "Enhanced presentation",
          "Tableside finishing elements",
          "Premium ingredient options",
          "Ideal for special occasions",
        ],
      },
      {
        name: "Luxury Experience",
        price: "$225",
        period: "/person",
        popular: false,
        features: [
          "Fully customized tasting menu",
          "High-end ingredients (wagyu, lobster, etc.)",
          "Interactive dining experience",
          "VIP-level service and presentation",
          "Ideal for milestone celebrations",
        ],
      },
    ],
  },
  "catering-las-vegas": {
    ctaHref: "/contact",
    tiers: [
      {
        name: "Signature Catering",
        price: "$45",
        period: "/person",
        popular: false,
        features: [
          "Buffet or family-style service",
          "Crowd-pleasing menu selections",
        ],
      },
      {
        name: "Elevated Catering",
        price: "$65",
        period: "/person",
        popular: true,
        features: [
          "Upgraded menu options",
          "Enhanced presentation",
          "Mix of passed and displayed items",
        ],
      },
      {
        name: "Luxury Catering",
        price: "$95",
        period: "/person",
        popular: false,
        features: [
          "Fully customized menu",
          "High-end presentation",
          "Interactive stations or plated service",
          "Premium ingredients",
        ],
      },
    ],
  },
  "corporate-catering-las-vegas": {
    ctaHref: "/contact",
    tiers: [
      {
        name: "Signature Catering",
        price: "$45",
        period: "/person",
        popular: false,
        features: [
          "Buffet or family-style service",
          "Crowd-pleasing menu selections",
        ],
      },
      {
        name: "Elevated Catering",
        price: "$65",
        period: "/person",
        popular: true,
        features: [
          "Upgraded menu options",
          "Enhanced presentation",
          "Mix of passed and displayed items",
        ],
      },
      {
        name: "Luxury Catering",
        price: "$95",
        period: "/person",
        popular: false,
        features: [
          "Fully customized menu",
          "High-end presentation",
          "Interactive stations or plated service",
          "Premium ingredients",
        ],
      },
    ],
  },
};

export default function ServicePage() {
  const params = useParams<{ slug: string }>();
  const service = getServiceBySlug(params.slug || "");

  useEffect(() => {
    if (service) {
      document.title = service.metaTitle;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", service.metaDescription);
    }
  }, [service]);

  if (!service) return <Redirect to="/404" />;

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${service.heroImage})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ECA241]/30 to-transparent" />

        <div className="relative z-10 container pb-16 pt-32">
          <Link href="/#services" className="inline-flex items-center gap-2 text-[#ECA241]/60 hover:text-[#ECA241] text-xs tracking-widest uppercase mb-6 transition-colors" style={{ fontFamily: "var(--font-body)" }}>
            <ChevronLeft size={14} /> All Services
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-[#ECA241]" />
              <span className="brand-label">Our Services</span>
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-6xl text-[#F3F1E9] leading-tight mb-4">
              {service.title}
            </h1>
            <p className="text-[#ECA241] text-lg font-[family-name:var(--font-serif)] italic max-w-lg">{service.tagline}</p>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section className="section-cream py-20 lg:py-28">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <FadeIn>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[1px] bg-[#D82E2B]" />
                <span className="brand-label text-[#D82E2B]">Overview</span>
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl lg:text-4xl text-black leading-tight mb-6">
                The <span className="text-[#D82E2B]">Experience</span>
              </h2>
              <p className="text-black/60 text-base lg:text-lg leading-relaxed" style={{ fontFamily: "var(--font-serif)", fontWeight: 400 }}>
                {service.overview}
              </p>
              <Link href="/contact" className="btn-primary mt-8 inline-flex">
                Inquire About This Service
              </Link>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="grid grid-cols-2 gap-3">
                {service.galleryImages.map((img, i) => (
                  <div key={i} className={`overflow-hidden ${i === 0 ? "col-span-2 h-52" : "h-40"}`}>
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* What's Included + Best For */}
      <section className="section-dark py-20 lg:py-28">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <FadeIn>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[1px] bg-[#ECA241]" />
                <span className="brand-label">What's Included</span>
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-2xl lg:text-3xl text-[#F3F1E9] mb-8">
                Everything You <span className="text-[#ECA241]">Need</span>
              </h3>
              <ul className="space-y-4">
                {service.included.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-5 h-5 bg-[#D82E2B] flex items-center justify-center mt-0.5 shrink-0">
                      <Check size={12} className="text-white" />
                    </div>
                    <span className="text-[#F3F1E9]/65 text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[1px] bg-[#ECA241]" />
                <span className="brand-label">Best For</span>
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-2xl lg:text-3xl text-[#F3F1E9] mb-8">
                Who It's <span className="text-[#ECA241]">For</span>
              </h3>
              <ul className="space-y-4">
                {service.bestFor.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <Users size={14} className="text-[#ECA241] mt-1 shrink-0" />
                    <span className="text-[#F3F1E9]/65 text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{item}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-10 border border-white/5 bg-[#0a0a0a] p-6">
                <h4 className="text-[#ECA241] text-[11px] tracking-[0.2em] uppercase font-semibold mb-4" style={{ fontFamily: "var(--font-body)" }}>Sample Events</h4>
                <ul className="space-y-2">
                  {service.sampleEvents.map((e, i) => (
                    <li key={i} className="text-[#F3F1E9]/50 text-sm flex items-center gap-2" style={{ fontFamily: "var(--font-body)" }}>
                      <ArrowRight size={10} className="text-[#D82E2B]" /> {e}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Pricing */}
      {servicePricingData[service.slug] && (
        <ServicePricingSection
          tiers={servicePricingData[service.slug].tiers}
          ctaHref={servicePricingData[service.slug].ctaHref}
        />
      )}

      {/* CTA */}
      <section className="section-cream py-20 lg:py-28">
        <div className="container text-center">
          <FadeIn>
            <img src={LOGO_P_ICON} alt="The PPL's Chef" className="h-14 w-14 object-contain drop-shadow-lg mx-auto mb-5" />
            <h2 className="font-[family-name:var(--font-display)] text-3xl lg:text-4xl text-black mb-4">
              Ready to Book Your <span className="text-[#D82E2B]">{service.title}?</span>
            </h2>
            <p className="text-black/50 text-base max-w-lg mx-auto mb-8 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              Tell us about your event and we'll create a custom proposal tailored to your needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-primary">Book This Service</Link>
              <a href="tel:725-212-2236" className="btn-outline-dark">Call 725-212-2236</a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Other Services */}
      <section className="section-dark py-16">
        <div className="container">
          <div className="text-center mb-10">
            <span className="brand-label">Explore More</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {services.filter((s) => s.slug !== service.slug).map((s) => (
              <Link key={s.slug} href={`/${s.slug}`} className="group relative overflow-hidden h-36 sm:h-44">
                <img src={s.heroImage} alt={s.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center p-3">
                  <span className="font-[family-name:var(--font-display)] text-[#F3F1E9] text-sm sm:text-base text-center group-hover:text-[#ECA241] transition-colors duration-300">{s.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
