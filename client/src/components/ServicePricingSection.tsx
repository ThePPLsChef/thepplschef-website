/**
 * ServicePricingSection — Reusable tiered pricing block for individual service pages.
 * Matches the homepage Pricing component style exactly.
 * BRAND: Abril Fatface headings, DM Sans body, Red/Gold/Black/Cream palette.
 */
import { useRef } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";

const fontBody = { fontFamily: "var(--font-body)" };

export interface PricingTier {
  name: string;
  price: string;
  period: string;
  popular?: boolean;
  features: string[];
}

interface ServicePricingSectionProps {
  tiers: PricingTier[];
  /** Where the CTA button routes — defaults to /contact */
  ctaHref?: string;
  /** Label shown above the section title */
  label?: string;
}

export default function ServicePricingSection({
  tiers,
  ctaHref = "/contact",
  label = "Transparent Pricing",
}: ServicePricingSectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="section-dark py-20 lg:py-28">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14 lg:mb-18"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-[#ECA241]" />
            <span className="brand-label">{label}</span>
            <div className="w-8 h-[1px] bg-[#ECA241]" />
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl text-[#F3F1E9] leading-tight mb-4">
            Choose Your <span className="text-[#ECA241]">Experience</span>
          </h2>
          <p className="text-[#F3F1E9]/55 text-base max-w-xl mx-auto" style={fontBody}>
            All pricing starts at the rates below and is fully customizable based on your needs and vision.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="relative group transition-all duration-300"
            >
              <div
                className={`relative h-full border transition-all duration-300 ${
                  tier.popular
                    ? "bg-gradient-to-br from-[#D82E2B]/10 to-[#ECA241]/5 border-[#ECA241]/40 shadow-2xl shadow-[#ECA241]/10"
                    : "bg-[#0a0a0a] border-white/10 hover:border-[#ECA241]/30"
                }`}
              >
                {/* Most Popular Badge */}
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#D82E2B] text-white text-[10px] font-bold tracking-widest uppercase shadow-lg whitespace-nowrap">
                    Most Popular
                  </div>
                )}

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
                    <p className="text-[#F3F1E9]/35 text-xs mt-1" style={fontBody}>
                      Starting at
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8 flex-grow">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check size={15} className="text-[#ECA241] shrink-0 mt-0.5" />
                        <span className="text-[#F3F1E9]/70 text-sm leading-relaxed" style={fontBody}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href={ctaHref}
                    className={`w-full py-3.5 font-bold tracking-wider uppercase transition-all duration-300 text-center block ${
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

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-center text-[#F3F1E9]/35 text-sm mt-14 max-w-2xl mx-auto"
          style={fontBody}
        >
          All pricing is customizable based on your specific needs and vision. Contact us to discuss your unique requirements and receive a personalized quote.
        </motion.p>
      </div>
    </section>
  );
}
