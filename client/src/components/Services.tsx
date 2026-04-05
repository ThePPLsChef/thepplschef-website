/*
 * Services — Homepage service cards linking to dedicated pages
 * Each card navigates to /services/:slug
 * BRAND FONTS: Abril Fatface for headings, DM Sans for body.
 * BRAND COLORS: Red #D82E2B, Gold #ECA241, Black #000, Cream #F3F1E9.
 */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "wouter";
import { Users, Building2, PartyPopper, ChefHat, UtensilsCrossed } from "lucide-react";
import {
  CHEF_REAL_PORTRAIT_2, NEW_EVENT_1, MEAL_PREP_4BOX_SPREAD,
  EVENT_2025_OCT, NEW_EVENT_3,
} from "@/lib/images";

const services = [
  {
    icon: ChefHat,
    title: "Private Chef Experience",
    slug: "private-chef",
    description: "Fine dining in your own home. A dedicated chef prepares a multi-course meal exclusively for you and your guests.",
    image: CHEF_REAL_PORTRAIT_2,
  },
  {
    icon: Users,
    title: "Full-Service Catering",
    slug: "catering",
    description: "Buffet, plated, or family-style service for events of every scale — from 30 to 300+ guests.",
    image: NEW_EVENT_1,
  },
  {
    icon: UtensilsCrossed,
    title: "Chef-Crafted Meal Boxes",
    slug: "meal-boxes",
    description: "Restaurant-quality meals delivered to your door. Choose your protein, pick your style, and we handle the rest.",
    image: MEAL_PREP_4BOX_SPREAD,
  },
  {
    icon: PartyPopper,
    title: "Special Events & Celebrations",
    slug: "special-events",
    description: "Birthdays, engagements, baby showers — custom menus and creative presentation for your milestone moments.",
    image: EVENT_2025_OCT,
  },
  {
    icon: Building2,
    title: "Corporate & Group Dining",
    slug: "corporate",
    description: "Executive lunches, team events, and company celebrations with polished, professional service.",
    image: NEW_EVENT_3,
  },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const Icon = service.icon;

  return (
    <Link href={`/services/${service.slug}`}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="group relative overflow-hidden bg-[#0a0a0a] border border-[#ECA241]/15 hover:border-[#ECA241]/50 transition-all duration-500 cursor-pointer"
      >
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          {/* Icon badge */}
          <div className="absolute bottom-4 left-4 w-12 h-12 bg-[#D82E2B] flex items-center justify-center shadow-lg shadow-[#D82E2B]/30">
            <Icon size={22} className="text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-[#F3F1E9] mb-3 group-hover:text-[#ECA241] transition-colors duration-300">
            {service.title}
          </h3>
          <p className="text-[#F3F1E9]/60 text-sm leading-relaxed font-[family-name:var(--font-body)]">
            {service.description}
          </p>
          <div className="mt-5 flex items-center gap-2 text-[#ECA241]/70 group-hover:text-[#ECA241] transition-colors duration-300">
            <span className="text-xs tracking-widest uppercase font-semibold font-[family-name:var(--font-body)]">Learn More</span>
            <span className="text-base group-hover:translate-x-1 transition-transform duration-300">→</span>
          </div>
        </div>

        {/* Bottom gold accent line */}
        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#ECA241] group-hover:w-full transition-all duration-500" />
      </motion.div>
    </Link>
  );
}

export default function Services() {
  const headerRef = useRef(null);
  const isInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section id="services" className="relative bg-black py-24 lg:py-32">
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
            <div className="w-10 h-[2px] bg-[#ECA241]" />
            <span className="text-[#ECA241] text-sm font-semibold tracking-[0.3em] uppercase font-[family-name:var(--font-body)]">
              What We Offer
            </span>
            <div className="w-10 h-[2px] bg-[#ECA241]" />
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F3F1E9] leading-tight">
            Our <span className="text-[#D82E2B]">Services</span>
          </h2>
          <p className="mt-5 text-[#F3F1E9]/60 text-lg max-w-2xl mx-auto font-[family-name:var(--font-body)]">
            From intimate gatherings to grand celebrations, we bring the full restaurant experience to your chosen venue.
          </p>
        </motion.div>

        {/* Services Grid — top row 3, bottom row 2 centered */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.slice(0, 3).map((service, i) => (
            <ServiceCard key={service.slug} service={service} index={i} />
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-6 mt-6 max-w-[calc(66.666%+0.75rem)] mx-auto">
          {services.slice(3).map((service, i) => (
            <ServiceCard key={service.slug} service={service} index={i + 3} />
          ))}
        </div>
      </div>
    </section>
  );
}
