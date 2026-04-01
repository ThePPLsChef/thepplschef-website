/*
 * Testimonials — Smokehouse Editorial Design
 * Black background with elegant quote cards.
 * Gold star ratings and italic serif quotes.
 */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Jessica M.",
    role: "Birthday Celebration",
    text: "The PPL's Chef transformed my 40th birthday into an unforgettable culinary experience. Every dish was beautifully presented and absolutely delicious. Our guests are still raving about the food weeks later!",
    rating: 5,
  },
  {
    name: "David & Sarah K.",
    role: "Private Dinner Party",
    text: "We hired The PPL's Chef for an intimate anniversary dinner at home, and it was the best decision we ever made. The attention to detail, from the custom menu to the impeccable service, made us feel like we were dining at a five-star restaurant.",
    rating: 5,
  },
  {
    name: "Marcus T.",
    role: "Corporate Event",
    text: "Our company has used The PPL's Chef for three corporate events now, and each time they exceed expectations. The food quality is consistently outstanding, and the team is incredibly professional and easy to work with.",
    rating: 5,
  },
];

export default function Testimonials() {
  const headerRef = useRef(null);
  const isInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section id="testimonials" className="relative bg-black py-24 lg:py-32">
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
            <span className="text-[#ECA241] text-sm font-semibold tracking-[0.3em] uppercase">
              Client Love
            </span>
            <div className="w-10 h-[2px] bg-[#ECA241]" />
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F3F1E9] leading-tight">
            What Our <span className="text-[#ECA241] italic">Clients Say</span>
          </h2>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => {
            const cardRef = useRef(null);
            const cardInView = useInView(cardRef, { once: true, margin: "-50px" });

            return (
              <motion.div
                key={t.name}
                ref={cardRef}
                initial={{ opacity: 0, y: 40 }}
                animate={cardInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="relative bg-[#0a0a0a] border border-[#ECA241]/15 p-8 group hover:border-[#ECA241]/40 transition-all duration-500"
              >
                {/* Quote icon */}
                <Quote className="text-[#ECA241]/20 mb-4" size={40} />

                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} className="text-[#ECA241] fill-[#ECA241]" />
                  ))}
                </div>

                {/* Quote text */}
                <p className="font-[family-name:var(--font-heading)] text-[#F3F1E9]/80 text-base italic leading-relaxed mb-6">
                  "{t.text}"
                </p>

                {/* Author */}
                <div className="border-t border-[#ECA241]/15 pt-5">
                  <div className="font-semibold text-[#F3F1E9] text-sm tracking-wide">
                    {t.name}
                  </div>
                  <div className="text-[#ECA241]/70 text-xs tracking-wider uppercase mt-1">
                    {t.role}
                  </div>
                </div>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#D82E2B] group-hover:w-full transition-all duration-500" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
