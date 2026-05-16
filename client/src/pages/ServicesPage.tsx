/**
 * ServicesPage — Overview of all services offered by The PPL's Chef.
 * Lists all five service categories with links to their dedicated SEO pages.
 * BRAND: Abril Fatface headings, DM Sans body, Cormorant Garamond serif accents.
 * Colors: Black #000, Cream #F3F1E9, Red #D82E2B, Gold #ECA241.
 */
import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { ChefHat, Users, UtensilsCrossed, PartyPopper, Building2, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { HERO_BG, PRIVATE_CHEF_HERO, CATERING_HERO, CORPORATE_HERO_ROTATED, MEAL_PREP_OVERHEAD_MULTI } from "@/lib/images";

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ";
const SPECIAL_EVENTS_HERO = `${CDN}/special-events-hero-clean_c0e5a047.png`;

const fontBody = { fontFamily: "var(--font-body)" };
const fontSerif = { fontFamily: "var(--font-serif)" };

function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 25 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const serviceList = [
  {
    icon: ChefHat,
    title: "Private Chef Experience",
    tagline: "Restaurant-level dining. Personal. Intimate. Unforgettable.",
    description:
      "Transform your home into a five-star restaurant. A dedicated chef prepares a multi-course meal crafted exclusively for you and your guests — from ingredient sourcing to plating and cleanup.",
    href: "/private-chef-las-vegas",
    image: PRIVATE_CHEF_HERO,
    highlights: ["Custom curated menu", "On-site preparation & cleanup", "Multi-course dining", "Ideal for 2–20 guests"],
  },
  {
    icon: Users,
    title: "Full-Service Catering",
    tagline: "Elevated catering for events of every scale.",
    description:
      "Whether you're hosting 30 guests or 300, our full-service catering delivers restaurant-quality food with seamless execution. Buffet, plated, or family-style — each menu is customized to your event.",
    href: "/catering-las-vegas",
    image: CATERING_HERO,
    highlights: ["Custom menu planning", "Buffet, plated, or family-style", "Professional service staff", "Setup & breakdown included"],
  },
  {
    icon: UtensilsCrossed,
    title: "Chef-Crafted Meal Boxes",
    tagline: "Restaurant-quality meals, ready when you are.",
    description:
      "Enjoy chef-crafted meals without the event. Our Meal Box service delivers freshly prepared, restaurant-quality dishes straight to your door — perfect for busy professionals and health-conscious families.",
    href: "/meal-prep-las-vegas",
    image: MEAL_PREP_OVERHEAD_MULTI,
    highlights: ["Weekly or one-time orders", "Custom dietary preferences", "Fresh, locally sourced ingredients", "Individual & family-sized portions"],
  },
  {
    icon: PartyPopper,
    title: "Special Events & Celebrations",
    tagline: "Make your milestone unforgettable.",
    description:
      "Birthdays, engagements, baby showers, retirements — whatever you're celebrating, we'll make it extraordinary. Custom menus with creative presentation for your milestone moments.",
    href: "/special-events-las-vegas",
    image: SPECIAL_EVENTS_HERO,
    highlights: ["Event consultation & theme coordination", "Custom celebration menu", "Dessert tables & specialty stations", "Themed presentation"],
  },
  {
    icon: Building2,
    title: "Corporate & Group Dining",
    tagline: "Impress your team. Elevate your brand.",
    description:
      "From executive lunches to company-wide celebrations, our Corporate Dining service brings premium food and professional service to your business events. Polished, punctual, and impressive.",
    href: "/corporate-catering-las-vegas",
    image: CORPORATE_HERO_ROTATED,
    highlights: ["Executive lunches & team events", "Custom corporate menus", "Dietary accommodations", "Seamless logistics"],
  },
];

function ServiceRow({ service, index }: { service: typeof serviceList[0]; index: number }) {
  const Icon = service.icon;
  const isEven = index % 2 === 0;
  return (
    <FadeIn delay={0.1}>
      <div
        className={`grid lg:grid-cols-2 gap-0 overflow-hidden border border-[#ECA241]/15 hover:border-[#ECA241]/40 transition-all duration-500 group ${
          isEven ? "" : "lg:flex-row-reverse"
        }`}
      >
        {/* Image — alternates left/right on desktop */}
        <div className={`relative h-64 lg:h-auto overflow-hidden ${!isEven ? "lg:order-2" : ""}`}>
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-black/40" />
          <div className="absolute top-4 left-4 w-12 h-12 bg-[#D82E2B] flex items-center justify-center shadow-lg shadow-[#D82E2B]/30">
            <Icon size={22} className="text-white" />
          </div>
        </div>

        {/* Content */}
        <div className={`bg-[#0a0a0a] p-8 lg:p-12 flex flex-col justify-center ${!isEven ? "lg:order-1" : ""}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-6 h-[1px] bg-[#ECA241]" />
            <span className="text-[#ECA241] text-xs font-semibold tracking-[0.3em] uppercase" style={fontBody}>
              Las Vegas
            </span>
          </div>
          <h2
            className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-[#F3F1E9] mb-2 group-hover:text-[#ECA241] transition-colors duration-300"
          >
            {service.title}
          </h2>
          <p className="text-[#ECA241]/80 text-sm mb-4 italic" style={fontSerif}>
            {service.tagline}
          </p>
          <p className="text-[#F3F1E9]/65 text-sm leading-relaxed mb-6" style={fontBody}>
            {service.description}
          </p>

          {/* Highlights */}
          <ul className="space-y-2 mb-8">
            {service.highlights.map((h) => (
              <li key={h} className="flex items-center gap-3 text-sm text-[#F3F1E9]/70" style={fontBody}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#ECA241] flex-shrink-0" />
                {h}
              </li>
            ))}
          </ul>

          <Link href={service.href}>
            <span className="inline-flex items-center gap-2 text-[#ECA241] text-xs font-semibold tracking-[0.2em] uppercase group/link hover:gap-3 transition-all duration-300" style={fontBody}>
              Learn More
              <ArrowRight size={14} className="transition-transform duration-300 group-hover/link:translate-x-1" />
            </span>
          </Link>
        </div>
      </div>
    </FadeIn>
  );
}

export default function ServicesPage() {
  useEffect(() => {
    document.title = "Our Services | The PPL's Chef | Las Vegas Private Chef & Catering";
    const meta = document.querySelector('meta[name="description"]');
    if (meta)
      meta.setAttribute(
        "content",
        "Explore all services offered by The PPL's Chef — private chef experiences, full-service catering, chef-crafted meal boxes, special events, and corporate dining in Las Vegas."
      );
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      {/* ─── HERO ─── */}
      <section className="relative min-h-[55vh] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_BG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
        <div className="relative z-10 container pb-16 pt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-[#ECA241]" />
              <span className="text-[#ECA241] text-xs font-semibold tracking-[0.3em] uppercase" style={fontBody}>
                What We Offer
              </span>
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-6xl text-[#F3F1E9] leading-tight mb-3">
              Our <span className="text-[#ECA241]">Services</span>
            </h1>
            <p className="text-[#F3F1E9]/60 text-lg max-w-xl" style={fontSerif}>
              From intimate private dinners to grand celebrations — restaurant-quality experiences delivered to your chosen venue.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── SERVICE LIST ─── */}
      <section className="bg-black py-20 lg:py-28">
        <div className="container">
          <div className="space-y-8">
            {serviceList.map((service, i) => (
              <ServiceRow key={service.href} service={service} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-[#0a0a0a] py-20 border-t border-[#ECA241]/10">
        <div className="container text-center">
          <FadeIn>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-[2px] bg-[#ECA241]" />
              <span className="text-[#ECA241] text-xs font-semibold tracking-[0.3em] uppercase" style={fontBody}>
                Ready to Begin?
              </span>
              <div className="w-10 h-[2px] bg-[#ECA241]" />
            </div>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F3F1E9] mb-4">
              Let's Create Something <span className="text-[#D82E2B]">Extraordinary</span>
            </h2>
            <p className="text-[#F3F1E9]/60 text-lg max-w-2xl mx-auto mb-10" style={fontSerif}>
              Every event is unique. Tell us your vision and we'll craft the perfect culinary experience for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book">
                <span
                  className="inline-block px-10 py-4 bg-[#D82E2B] text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#c02525] transition-colors duration-300"
                  style={fontBody}
                >
                  Book Your Experience
                </span>
              </Link>
              <Link href="/contact">
                <span
                  className="inline-block px-10 py-4 border border-[#ECA241]/50 text-[#ECA241] text-xs font-semibold tracking-[0.2em] uppercase hover:border-[#ECA241] hover:bg-[#ECA241]/5 transition-all duration-300"
                  style={fontBody}
                >
                  Get in Touch
                </span>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </Layout>
  );
}
