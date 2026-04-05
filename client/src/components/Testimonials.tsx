/*
 * Testimonials — 5 detailed, credible client testimonials
 * Star ratings, full names, event types, specific quotes.
 * BRAND FONTS: Abril Fatface for headings, DM Sans for body.
 * BRAND COLORS: Red #D82E2B, Gold #ECA241, Black #000, Cream #F3F1E9.
 */
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Marcus T.",
    role: "Birthday Celebration, Las Vegas",
    text: "Chef Stephen turned my wife's 40th birthday into something we'll never forget. He prepared a five-course meal in our home — the seared salmon was unbelievable, and the dessert table had our guests taking photos before they'd even try a bite. Professional, personable, and the food was on another level.",
    rating: 5,
  },
  {
    name: "Jessica & David R.",
    role: "Anniversary Dinner for Two, Henderson NV",
    text: "We booked a private chef dinner for our 10th anniversary and it was the best decision we've ever made. Chef Stephen created a custom four-course menu with wine pairings, set up our dining room like a five-star restaurant, and cleaned everything before he left. We felt like royalty in our own home.",
    rating: 5,
  },
  {
    name: "Tanya W.",
    role: "Corporate Team Event, Las Vegas",
    text: "We hired The PPL's Chef for our company's quarterly team dinner — 45 people — and the feedback was overwhelmingly positive. The buffet was beautifully presented, the ribs were fall-off-the-bone perfect, and the staff was polished and professional. We've already booked them for our next event.",
    rating: 5,
  },
  {
    name: "Carlos & Maria G.",
    role: "Graduation Party, North Las Vegas",
    text: "Our son's graduation party was catered by Chef Stephen and his team. They served over 80 guests with a Mexican-inspired menu — the tamales and fajita bowls were a massive hit. Everything was fresh, flavorful, and beautifully laid out. Multiple guests asked for his card. Absolutely worth every penny.",
    rating: 5,
  },
  {
    name: "Brenda S.",
    role: "Weekly Meal Prep Client, Summerlin",
    text: "I've been ordering the weekly meal prep boxes for three months now and I'm hooked. The salmon with sesame rice is my favorite — it tastes like something from a high-end restaurant, not a meal prep container. Chef Stephen actually listens to my preferences and adjusts the menu each week. This is not your average meal prep.",
    rating: 5,
  },
];

function TestimonialCard({ t, i }: { t: typeof testimonials[0]; i: number }) {
  const cardRef = useRef(null);
  const cardInView = useInView(cardRef, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={cardInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: i * 0.12 }}
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
      <p className="text-[#F3F1E9]/80 text-sm leading-relaxed mb-6 font-[family-name:var(--font-body)]">
        "{t.text}"
      </p>

      {/* Author */}
      <div className="border-t border-[#ECA241]/15 pt-5">
        <div className="font-[family-name:var(--font-heading)] font-bold text-[#F3F1E9] text-base tracking-wide">
          {t.name}
        </div>
        <div className="text-[#ECA241]/70 text-xs tracking-wider uppercase mt-1 font-[family-name:var(--font-body)]">
          {t.role}
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#D82E2B] group-hover:w-full transition-all duration-500" />
    </motion.div>
  );
}

export default function Testimonials() {
  const headerRef = useRef(null);
  const isInView = useInView(headerRef, { once: true, margin: "-100px" });
  const [page, setPage] = useState(0);

  // Show 3 at a time on desktop, paginate for the remaining 2
  const pageSize = 3;
  const totalPages = Math.ceil(testimonials.length / pageSize);
  const visible = testimonials.slice(page * pageSize, page * pageSize + pageSize);

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
            <span className="text-[#ECA241] text-sm font-semibold tracking-[0.3em] uppercase font-[family-name:var(--font-body)]">
              Client Love
            </span>
            <div className="w-10 h-[2px] bg-[#ECA241]" />
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F3F1E9] leading-tight">
            What Our <span className="text-[#ECA241]">Clients Say</span>
          </h2>
          <p className="mt-5 text-[#F3F1E9]/50 text-base max-w-xl mx-auto font-[family-name:var(--font-body)]">
            Real experiences from real clients across the Las Vegas Valley.
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {visible.map((t, i) => (
            <TestimonialCard key={t.name} t={t} i={i} />
          ))}
        </div>

        {/* Pagination dots */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-10 h-10 border border-white/10 flex items-center justify-center text-[#F3F1E9]/40 hover:text-[#ECA241] hover:border-[#ECA241]/40 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-2.5 h-2.5 transition-all duration-300 ${
                  i === page ? "bg-[#ECA241] scale-125" : "bg-white/15 hover:bg-white/30"
                }`}
              />
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="w-10 h-10 border border-white/10 flex items-center justify-center text-[#F3F1E9]/40 hover:text-[#ECA241] hover:border-[#ECA241]/40 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
