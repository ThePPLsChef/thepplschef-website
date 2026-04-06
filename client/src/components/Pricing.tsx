/**
 * Pricing — Premium tiered pricing section
 * Three service categories with 3 tiers each (Signature, Elevated, Luxury)
 * BRAND: Abril Fatface headings, DM Sans body, Red/Gold/Black/Cream palette.
 */
import { useRef } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";

const fontBody = { fontFamily: "var(--font-body)" };
const fontDisplay = { fontFamily: "var(--font-display)" };

const pricingTiers = [
  {
    category: "Private Chef Experience",
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
  {
    category: "Catering & Events",
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
  {
    category: "Meal Boxes",
    tiers: [
      {
        name: "Signature Meal Plan",
        price: "$120",
        period: "/week",
        popular: false,
        features: [
          "Weekly rotating menu",
          "Balanced, chef-prepared meals",
        ],
      },
      {
        name: "Elevated Meal Plan",
        price: "$160",
        period: "/week",
        popular: true,
        features: [
          "Expanded menu options",
          "Higher-end ingredients",
          "Greater customization",
        ],
      },
      {
        name: "Luxury Meal Plan",
        price: "$220",
        period: "/week",
        popular: false,
        features: [
          "Fully customized weekly plan",
          "Premium ingredients",
          "Personalized dietary optimization",
        ],
      },
    ],
  },
];

export default function Pricing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-dark py-20 lg:py-32">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 lg:mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-[#ECA241]" />
            <span className="brand-label">Transparent Pricing</span>
            <div className="w-8 h-[1px] bg-[#ECA241]" />
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-6xl text-[#F3F1E9] leading-tight mb-4">
            Premium Culinary <span className="text-[#ECA241]">Experiences</span>
          </h2>
          <p className="text-[#F3F1E9]/55 text-lg max-w-2xl mx-auto" style={fontBody}>
            All pricing is customizable based on your specific needs and vision.
          </p>
        </motion.div>

        {/* Pricing Tiers */}
        {pricingTiers.map((section, sectionIdx) => (
          <motion.div
            key={section.category}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: sectionIdx * 0.15 }}
            className="mb-20 lg:mb-24"
          >
            {/* Category Title */}
            <h3 className="font-[family-name:var(--font-display)] text-2xl lg:text-3xl text-[#F3F1E9] mb-10 text-center">
              {section.category}
            </h3>

            {/* Pricing Cards Grid */}
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {section.tiers.map((tier, tierIdx) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: sectionIdx * 0.15 + tierIdx * 0.1 }}
                  className={`relative group transition-all duration-300 ${
                    tier.popular ? "md:scale-105 md:-mt-4" : ""
                  }`}
                >
                  {/* Card Background */}
                  <div
                    className={`relative h-full border transition-all duration-300 ${
                      tier.popular
                        ? "bg-gradient-to-br from-[#D82E2B]/10 to-[#ECA241]/5 border-[#ECA241]/40 shadow-2xl shadow-[#ECA241]/10"
                        : "bg-[#0a0a0a] border-white/10 hover:border-[#ECA241]/30"
                    }`}
                  >
                    {/* Popular Badge */}
                    {tier.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#D82E2B] text-white text-[10px] font-bold tracking-widest uppercase shadow-lg">
                        Most Popular
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-8 lg:p-10 flex flex-col h-full">
                      {/* Tier Name */}
                      <h4 className="font-[family-name:var(--font-display)] text-xl text-[#F3F1E9] mb-2">
                        {tier.name}
                      </h4>

                      {/* Price */}
                      <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                          <span className="text-[#ECA241] text-4xl font-bold">{tier.price}</span>
                          <span className="text-[#F3F1E9]/40 text-sm" style={fontBody}>
                            {tier.period}
                          </span>
                        </div>
                        <p className="text-[#F3F1E9]/35 text-xs mt-2" style={fontBody}>
                          Starting at
                        </p>
                      </div>

                      {/* Features */}
                      <ul className="space-y-3 mb-8 flex-grow">
                        {tier.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <Check size={16} className="text-[#ECA241] shrink-0 mt-0.5" />
                            <span className="text-[#F3F1E9]/70 text-sm" style={fontBody}>
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      <Link
                        href={section.category === "Meal Boxes" ? "/meal-prep-las-vegas#order-form" : "/contact"}
                        className={`w-full py-3.5 font-bold tracking-wider uppercase transition-all duration-300 text-center ${
                          tier.popular
                            ? "bg-[#D82E2B] text-white hover:bg-[#ECA241] hover:text-black"
                            : "bg-transparent border border-[#ECA241]/40 text-[#ECA241] hover:bg-[#ECA241] hover:text-black hover:border-[#ECA241]"
                        }`}
                        style={fontBody}
                      >
                        Book This Experience
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-center mt-16 pt-12 border-t border-white/5"
        >
          <p className="text-[#F3F1E9]/45 text-sm max-w-2xl mx-auto" style={fontBody}>
            All pricing is customizable based on your specific needs and vision. Contact us to discuss your unique requirements and receive a personalized quote.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
