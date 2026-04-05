/*
 * FAQ — Frequently Asked Questions section for homepage
 * Accordion-style Q&A with 8 common questions.
 * BRAND FONTS: Abril Fatface for headings, DM Sans for body.
 * BRAND COLORS: Red #D82E2B, Gold #ECA241, Black #000, Cream #F3F1E9.
 */
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How far in advance should I book?",
    answer: "We recommend booking at least 2–4 weeks in advance for private chef experiences and small events. For large catering events (50+ guests), 4–8 weeks notice is ideal. However, we do our best to accommodate last-minute requests — reach out and we'll see what we can do.",
  },
  {
    question: "Do you accommodate dietary restrictions and allergies?",
    answer: "Absolutely. Every menu we create is fully customizable. We regularly prepare meals for guests with allergies, vegan/vegetarian preferences, gluten-free needs, halal requirements, keto diets, and more. Just let us know during the consultation and we'll design a menu that works for everyone.",
  },
  {
    question: "What areas do you serve?",
    answer: "We serve the entire Las Vegas Valley, including Las Vegas, Henderson, North Las Vegas, Summerlin, and surrounding areas. For events outside the metro area, please contact us to discuss travel arrangements and availability.",
  },
  {
    question: "How does pricing work?",
    answer: "Pricing varies based on the type of service, number of guests, menu complexity, and event duration. Private chef experiences start at $125 per person, catering starts at $55 per person for buffet service, and meal prep boxes start at $75 for 5 meals. We provide a detailed custom quote after your initial consultation — no hidden fees.",
  },
  {
    question: "Do you provide service staff, equipment, and setup?",
    answer: "Yes. Our full-service catering includes professional service staff, equipment, table setup, and complete cleanup. For private chef experiences, Chef Stephen handles all cooking, plating, and kitchen cleanup. You don't need to lift a finger.",
  },
  {
    question: "Can I customize the menu?",
    answer: "Every menu is 100% customizable. The sample menus on our website are starting points to inspire you. During your consultation, we'll discuss your preferences, dietary needs, flavor profiles, and event theme to create a menu that's uniquely yours.",
  },
  {
    question: "How does the meal prep / meal box service work?",
    answer: "Choose your proteins (chicken, shrimp, salmon, pork, or tamales), pick your flavor style (Mexican, Italian, Asian, or American), and select your plan size (5, 10, 15, or 20 meals). We prepare everything fresh and deliver it to your door. Available as a one-time order or weekly subscription.",
  },
  {
    question: "What happens after I submit an inquiry?",
    answer: "After you submit your inquiry through our website or call us, we'll reach out within 24 hours to schedule a consultation. During the consultation, we'll discuss your vision, finalize the menu, and provide a detailed quote. Once confirmed, we handle all the logistics — you just show up and enjoy.",
  },
];

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="border-b border-[#ECA241]/10 last:border-b-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <span className="font-[family-name:var(--font-display)] text-base lg:text-lg text-[#F3F1E9] pr-6 group-hover:text-[#ECA241] transition-colors duration-300">
          {faq.question}
        </span>
        <div className={`w-8 h-8 shrink-0 flex items-center justify-center border transition-all duration-300 ${
          open ? "bg-[#D82E2B] border-[#D82E2B]" : "border-white/10 group-hover:border-[#ECA241]/40"
        }`}>
          {open ? <Minus size={14} className="text-white" /> : <Plus size={14} className="text-[#ECA241]" />}
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-[#F3F1E9]/50 text-sm leading-relaxed pb-6 pr-12 font-[family-name:var(--font-body)]">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const headerRef = useRef(null);
  const isInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section id="faq" className="relative bg-black py-24 lg:py-32">
      <div className="container max-w-3xl">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-[2px] bg-[#ECA241]" />
            <span className="text-[#ECA241] text-sm font-semibold tracking-[0.3em] uppercase font-[family-name:var(--font-body)]">
              Questions
            </span>
            <div className="w-10 h-[2px] bg-[#ECA241]" />
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl font-bold text-[#F3F1E9] leading-tight">
            Frequently <span className="text-[#ECA241]">Asked</span>
          </h2>
        </motion.div>

        {/* FAQ Items */}
        <div className="border-t border-[#ECA241]/10">
          {faqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-[#F3F1E9]/35 text-sm mb-4 font-[family-name:var(--font-body)]">
            Still have questions? We'd love to hear from you.
          </p>
          <a
            href="tel:725-212-2236"
            className="inline-flex items-center gap-2 text-[#ECA241] text-sm font-semibold tracking-wider uppercase hover:text-[#D82E2B] transition-colors font-[family-name:var(--font-body)]"
          >
            Call 725-212-2236 →
          </a>
        </div>
      </div>
    </section>
  );
}
