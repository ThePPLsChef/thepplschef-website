/**
 * ClientReviews — Premium "What Our Clients Say" testimonials section
 * Elegant quote cards with 5-star ratings, no Google branding
 * BRAND: Abril Fatface headings, DM Sans body, Red/Gold/Black/Cream palette.
 */
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";

const fontBody = { fontFamily: "var(--font-body)" };
const fontDisplay = { fontFamily: "var(--font-display)" };

const reviews = [
  {
    quote: "Chef Stephen completely transformed our anniversary dinner. The tableside finishing, the presentation, the flavors — it felt like a 5-star restaurant in our own home.",
    author: "Danielle R.",
    eventType: "Private Chef Dinner",
    date: "March 2026",
    rating: 5,
  },
  {
    quote: "We hired The PPL's Chef for our corporate holiday event and the feedback from our team was incredible. Professional, punctual, and the food was outstanding.",
    author: "James W.",
    eventType: "Corporate Event",
    date: "December 2025",
    rating: 5,
  },
  {
    quote: "The Elevated catering package was perfect for my daughter's sweet 16. Every guest asked for the chef's contact info.",
    author: "Tanya M.",
    eventType: "Birthday Celebration",
    date: "February 2026",
    rating: 5,
  },
  {
    quote: "The weekly meal prep plan has completely changed how I eat. Chef-quality food every day without the effort. Worth every penny.",
    author: "Kevin L.",
    eventType: "Meal Prep Client",
    date: "January 2026",
    rating: 5,
  },
  {
    quote: "From the custom menu consultation to the last bite, everything was flawless. Chef Stephen has a gift for making people feel special through food.",
    author: "Priya S.",
    eventType: "Engagement Dinner",
    date: "November 2025",
    rating: 5,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? "fill-[#ECA241] text-[#ECA241]" : "text-[#ECA241]/20"}
        />
      ))}
    </div>
  );
}

export default function ClientReviews() {
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
            <span className="brand-label">Client Testimonials</span>
            <div className="w-8 h-[1px] bg-[#ECA241]" />
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-6xl text-[#F3F1E9] leading-tight mb-4">
            What Our <span className="text-[#ECA241]">Clients Say</span>
          </h2>
          <p className="text-[#F3F1E9]/55 text-lg max-w-2xl mx-auto" style={fontBody}>
            Real experiences from real clients across Las Vegas.
          </p>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {reviews.map((review, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              className="group"
            >
              {/* Review Card */}
              <div className="relative h-full bg-[#0a0a0a] rounded-2xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.25),0_10px_10px_-5px_rgba(0,0,0,0.10)] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.30),0_10px_10px_-5px_rgba(0,0,0,0.12),0_0_20px_rgba(236,162,65,0.10)] hover:-translate-y-2 transition-all duration-300 p-10 lg:p-12 flex flex-col">
                {/* Accent Top Border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D82E2B] via-[#ECA241] to-transparent group-hover:from-[#ECA241] group-hover:via-[#D82E2B] transition-all duration-300 rounded-t-2xl" />

                {/* Star Rating */}
                <div className="mb-6">
                  <StarRating rating={review.rating} />
                </div>

                {/* Quote */}
                <blockquote className="text-[#F3F1E9]/75 text-base leading-relaxed mb-8 flex-grow italic" style={{ fontFamily: "var(--font-card-body)" }}>
                  "{review.quote}"
                </blockquote>

                {/* Author Info */}
                <div className="border-t border-white/5 pt-6">
                  <div className="font-semibold text-[#F3F1E9] text-sm" style={{ fontFamily: "var(--font-card-heading)" }}>
                    {review.author}
                  </div>
                  <div className="text-[#ECA241] text-[11px] tracking-wider uppercase font-semibold mt-1" style={{ fontFamily: "var(--font-card-body)" }}>
                    {review.eventType}
                  </div>
                  <div className="text-[#F3F1E9]/35 text-xs mt-2" style={{ fontFamily: "var(--font-card-body)" }}>
                    {review.date}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-center mt-16 pt-12 border-t border-white/5"
        >
          <p className="text-[#F3F1E9]/55 text-lg mb-6" style={fontBody}>
            Ready to create your own unforgettable experience?
          </p>
          <a
            href="/book"
            className="inline-block px-10 py-4 bg-[#D82E2B] text-white font-bold tracking-wider uppercase hover:bg-[#ECA241] hover:text-black transition-all duration-300 shadow-lg shadow-[#D82E2B]/20"
            style={fontBody}
          >
            Book Your Experience
          </a>
        </motion.div>
      </div>
    </section>
  );
}
