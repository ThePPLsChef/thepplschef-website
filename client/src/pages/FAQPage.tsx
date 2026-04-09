/**
 * FAQPage — Dedicated FAQ page for The PPL's Chef
 * Comprehensive accordion-style Q&A covering all service areas.
 * BRAND: Abril Fatface headings, DM Sans body.
 * Colors: Red #D82E2B, Gold #ECA241, Black #000, Cream #F3F1E9.
 */
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Plus, Minus, Phone, Mail } from "lucide-react";
import Layout from "@/components/Layout";

const fontBody = { fontFamily: "var(--font-body)" };

const faqCategories = [
  {
    title: "Booking & Process",
    faqs: [
      {
        question: "How far in advance should I book?",
        answer: "We recommend booking at least 2–4 weeks in advance for private chef experiences and small events. For large catering events (50+ guests), 4–8 weeks notice is ideal. However, we do our best to accommodate last-minute requests — reach out and we'll see what we can do.",
      },
      {
        question: "What happens after I submit an inquiry?",
        answer: "After you submit your inquiry through our website or call us, we'll reach out within 24 hours to schedule a consultation. During the consultation, we'll discuss your vision, finalize the menu, and provide a detailed quote. Once confirmed, we handle all the logistics — you just show up and enjoy.",
      },
      {
        question: "How does the booking timeline work?",
        answer: "Step 1: Submit your inquiry with event details. Step 2: We schedule a consultation within 24 hours. Step 3: We design a custom menu and provide a detailed quote. Step 4: You confirm and we lock in your date. Step 5: We handle everything on event day — setup, cooking, service, and cleanup.",
      },
    ],
  },
  {
    title: "Dietary & Menu Customization",
    faqs: [
      {
        question: "Do you accommodate dietary restrictions and allergies?",
        answer: "Absolutely. Every menu we create is fully customizable. We regularly prepare meals for guests with allergies, vegan/vegetarian preferences, gluten-free needs, halal requirements, keto diets, and more. Just let us know during the consultation and we'll design a menu that works for everyone.",
      },
      {
        question: "Can I customize the menu?",
        answer: "Every menu is 100% customizable. The sample menus on our website are starting points to inspire you. During your consultation, we'll discuss your preferences, dietary needs, flavor profiles, and event theme to create a menu that's uniquely yours.",
      },
      {
        question: "Do you offer tasting sessions before the event?",
        answer: "For larger events and weddings, we can arrange a tasting session so you can experience the menu firsthand before your event. Tasting sessions are available for an additional fee and are credited toward your final event cost.",
      },
    ],
  },
  {
    title: "Pricing & Payment",
    faqs: [
      {
        question: "How does pricing work?",
        answer: "Pricing varies based on the type of service, number of guests, menu complexity, and event duration. Private chef experiences start at $125 per person, catering starts at $45 per person for buffet service, and meal prep boxes start at $120 per week. We provide a detailed custom quote after your initial consultation — no hidden fees.",
      },
      {
        question: "Is a deposit required?",
        answer: "Yes, we require a 50% deposit to secure your date. The remaining balance is due 48 hours before the event. For meal prep subscriptions, payment is collected weekly in advance.",
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, debit cards, Zelle, Venmo, and CashApp. For corporate events, we can also accommodate invoicing with net-30 terms.",
      },
    ],
  },
  {
    title: "Service Area & Staffing",
    faqs: [
      {
        question: "What areas do you serve?",
        answer: "We serve the entire Las Vegas Valley, including Las Vegas, Henderson, North Las Vegas, Summerlin, and surrounding areas. For events outside the metro area, please contact us to discuss travel arrangements and availability.",
      },
      {
        question: "Do you provide service staff, equipment, and setup?",
        answer: "Yes. Our full-service catering includes professional service staff, equipment, table setup, and complete cleanup. For private chef experiences, Chef Stephen handles all cooking, plating, and kitchen cleanup. You don't need to lift a finger.",
      },
      {
        question: "How many staff members will be at my event?",
        answer: "Staffing depends on the size and style of your event. For intimate private chef dinners (2–10 guests), Chef Stephen typically handles everything personally. For larger catering events, we bring a full team — typically 1 server per 15–20 guests, plus kitchen support staff.",
      },
    ],
  },
  {
    title: "Meal Prep & Meal Boxes",
    faqs: [
      {
        question: "How does the meal prep / meal box service work?",
        answer: "Choose your proteins (chicken, shrimp, salmon, pork, or tamales), pick your flavor style (Mexican, Italian, Asian, or American), and select your plan size (5, 10, 15, or 20 meals). We prepare everything fresh and deliver it to your door. Available as a one-time order or weekly subscription.",
      },
      {
        question: "When are meal prep orders delivered?",
        answer: "Meal prep orders are prepared fresh and delivered every Sunday or Monday, depending on your location. Orders must be placed by Thursday at 5 PM for the following week's delivery.",
      },
      {
        question: "Can I change my meal selections each week?",
        answer: "Yes! Our menu rotates weekly, and you can customize your selections each week. We'll send you the upcoming menu options every Wednesday so you can choose your favorites before the Thursday cutoff.",
      },
      {
        question: "How long do the meals stay fresh?",
        answer: "All meals are prepared fresh and are designed to stay fresh for 4–5 days when refrigerated properly. Each container is labeled with reheating instructions for the best results.",
      },
    ],
  },
];

function FAQItem({ faq, index }: { faq: { question: string; answer: string }; index: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.04 }}
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
            <p className="text-[#F3F1E9]/50 text-sm leading-relaxed pb-6 pr-12" style={fontBody}>
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQPage() {
  useEffect(() => {
    document.title = "FAQ | The PPL's Chef | Las Vegas Private Chef";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Frequently asked questions about The PPL's Chef private chef and catering in Las Vegas. Covers booking, pricing, dietary needs, service areas, and more.");
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-black pt-32 pb-16">
        <div className="container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-[#ECA241]" />
              <span className="brand-label">Questions</span>
              <div className="w-8 h-[1px] bg-[#ECA241]" />
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-6xl text-[#F3F1E9] leading-tight mb-4">
              Frequently <span className="text-[#ECA241]">Asked</span>
            </h1>
            <p className="text-[#F3F1E9]/55 text-lg max-w-2xl mx-auto" style={fontBody}>
              Everything you need to know about our private chef, catering, and meal prep services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="bg-black py-12 lg:py-20">
        <div className="container max-w-3xl">
          {faqCategories.map((category, catIdx) => (
            <div key={category.title} className="mb-16 last:mb-0">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="font-[family-name:var(--font-display)] text-2xl text-[#ECA241] mb-6 flex items-center gap-3"
              >
                <div className="w-6 h-[2px] bg-[#D82E2B]" />
                {category.title}
              </motion.h2>
              <div className="border-t border-[#ECA241]/10">
                {category.faqs.map((faq, i) => (
                  <FAQItem key={i} faq={faq} index={catIdx * 4 + i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-[#0a0a0a] border-t border-white/5 py-16 lg:py-20">
        <div className="container text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl lg:text-4xl text-[#F3F1E9] leading-tight mb-4">
            Still Have <span className="text-[#ECA241]">Questions?</span>
          </h2>
          <p className="text-[#F3F1E9]/45 text-base mb-8 max-w-xl mx-auto" style={fontBody}>
            We're here to help. Reach out directly and we'll get back to you within 24 hours.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link href="/contact" className="btn-primary">Send an Inquiry</Link>
            <a href="tel:725-212-2236" className="btn-outline">Call 725-212-2236</a>
          </div>
          <div className="flex justify-center gap-8">
            <a href="tel:725-212-2236" className="flex items-center gap-2 text-[#F3F1E9]/40 hover:text-[#ECA241] transition-colors text-sm" style={fontBody}>
              <Phone size={16} /> 725-212-2236
            </a>
            <a href="mailto:info@thepplschef.com" className="flex items-center gap-2 text-[#F3F1E9]/40 hover:text-[#ECA241] transition-colors text-sm" style={fontBody}>
              <Mail size={16} /> info@thepplschef.com
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
