/**
 * MealPrepPage — Premium meal ordering experience for The PPL's Chef
 * Complete overhaul: positioning headline, overview, how-it-works, ordering form,
 * sample meals, curated photo grid, and CTA.
 * BRAND: Abril Fatface headings, DM Sans body, Cormorant Garamond serif accents.
 * Colors: Black #000, Cream #F3F1E9, Red #D82E2B, Gold #ECA241.
 */
import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChefHat, Flame, CalendarCheck, Truck, Check } from "lucide-react";
import { toast } from "sonner";
import { submitInquiry } from "@/lib/submitInquiry";

import Layout from "@/components/Layout";
import ServicePricingSection from "@/components/ServicePricingSection";
import { LOGO_ALT_HORIZONTAL } from "@/lib/images";
import {
  MEAL_PREP_OVERHEAD_MULTI,
  MEAL_PREP_GRILLED_CHICKEN,
  MEAL_PREP_GLAZED_SALMON,
  MEAL_PREP_SHRIMP_FAJITA,
  MEAL_PREP_CHICKEN_FAJITA,
  MEAL_PREP_TAMALES,
  MEAL_PREP_4BOX_SPREAD,
} from "@/lib/images";

const fontBody = { fontFamily: "var(--font-body)" };
const fontSerif = { fontFamily: "var(--font-serif)" };

function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay }} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── HOW IT WORKS STEPS ─── */
const steps = [
  {
    icon: ChefHat,
    step: "01",
    title: "Choose Your Protein",
    desc: "Chicken, Shrimp, Salmon, Pork, or House Tamales",
  },
  {
    icon: Flame,
    step: "02",
    title: "Pick Your Style",
    desc: "Mexican \u2022 Italian \u2022 Asian \u2022 American",
  },
  {
    icon: CalendarCheck,
    step: "03",
    title: "Select Your Plan",
    desc: "Weekly or One-Time",
  },
  {
    icon: Truck,
    step: "04",
    title: "We Cook & Deliver",
    desc: "Fresh. Ready to enjoy.",
  },
];

/* ─── SAMPLE MEALS ─── */
const sampleMeals = [
  { name: "Mexican chicken fajita with Spanish rice, grilled veggies, and tortillas and salsa", img: MEAL_PREP_CHICKEN_FAJITA },
  { name: "Teriyaki salmon, furikaki rice, sweet and sour veg", img: MEAL_PREP_GLAZED_SALMON },
  { name: "Cajun shrimp with dirty rice and salted veg", img: MEAL_PREP_SHRIMP_FAJITA },
  { name: "Italian herbed chicken, garlic butter green beans", img: MEAL_PREP_GRILLED_CHICKEN },
];

/* ─── GALLERY IMAGES ─── */
const galleryImages = [
  { src: MEAL_PREP_4BOX_SPREAD, alt: "4-box overhead spread of grilled protein meals" },
  { src: MEAL_PREP_GLAZED_SALMON, alt: "Glazed salmon with sesame rice and vegetables" },
  { src: MEAL_PREP_GRILLED_CHICKEN, alt: "Grilled chicken with lime and green beans" },
  { src: MEAL_PREP_SHRIMP_FAJITA, alt: "Shrimp fajita bowl with rice" },
  { src: MEAL_PREP_TAMALES, alt: "House-made tamales with elote corn salad" },
  { src: MEAL_PREP_OVERHEAD_MULTI, alt: "Multiple meal prep containers overhead" },
];

/* ─── FORM COMPONENT ─── */
function MealOrderForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    numMeals: "5",
    proteins: [] as string[],
    styles: [] as string[],
    dietary: "",
    spice: "Medium",
    portion: "Regular",
    orderType: "one-time",
    delivery: "delivery",
    notes: "",
  });
  const [isPending, setIsPending] = useState(false);

  const proteinOptions = ["Chicken", "Shrimp", "Salmon", "Pork", "Tamales"];
  const styleOptions = ["Mexican", "Italian", "Asian", "American"];

  const toggleArray = (field: "proteins" | "styles", value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      toast.error("Please fill in your name, email, and phone number.");
      return;
    }
    if (form.proteins.length === 0) {
      toast.error("Please select at least one protein.");
      return;
    }
    if (form.styles.length === 0) {
      toast.error("Please select at least one flavor style.");
      return;
    }

    // Build a detailed notes field from the meal prep-specific fields
    const mealDetails = [
      `Meals per week: ${form.numMeals}`,
      `Proteins: ${form.proteins.join(", ")}`,
      `Flavor styles: ${form.styles.join(", ")}`,
      `Spice level: ${form.spice}`,
      `Portion size: ${form.portion}`,
      `Order type: ${form.orderType}`,
      `Delivery preference: ${form.delivery}`,
      form.address ? `Address: ${form.address}` : "",
      form.notes ? `Additional notes: ${form.notes}` : "",
    ].filter(Boolean).join("\n");

    setIsPending(true);
    try {
      await submitInquiry({
        name: form.name,
        email: form.email,
        phone: form.phone,
        serviceType: "Meal Prep",
        foodPreferences: form.styles.join(", "),
        allergies: form.dietary || undefined,
        notes: mealDetails,
      });
      toast.success("Your meal plan request has been submitted! We'll reach out within 24 hours.");
      setForm({
        name: "", phone: "", email: "", address: "", numMeals: "5",
        proteins: [], styles: [], dietary: "", spice: "Medium",
        portion: "Regular", orderType: "one-time", delivery: "delivery", notes: "",
      });
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  const inputClass =
    "w-full bg-[#0a0a0a] border border-white/10 text-[#F3F1E9] px-4 py-3 text-sm focus:outline-none focus:border-[#ECA241]/60 transition-colors placeholder:text-white/20";
  const labelClass = "text-[#ECA241] text-[11px] tracking-[0.15em] uppercase font-semibold mb-2 block";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Customer Info */}
      <div>
        <h3 className="font-[family-name:var(--font-display)] text-xl text-[#F3F1E9] mb-6">
          Your <span className="text-[#ECA241]">Information</span>
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} style={fontBody}>Full Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className={inputClass} style={fontBody} required />
          </div>
          <div>
            <label className={labelClass} style={fontBody}>Phone *</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(702) 555-0123" className={inputClass} style={fontBody} required />
          </div>
          <div>
            <label className={labelClass} style={fontBody}>Email *</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" className={inputClass} style={fontBody} required />
          </div>
          <div>
            <label className={labelClass} style={fontBody}>Delivery Address</label>
            <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Las Vegas, NV" className={inputClass} style={fontBody} />
          </div>
        </div>
      </div>

      {/* Meal Selection */}
      <div>
        <h3 className="font-[family-name:var(--font-display)] text-xl text-[#F3F1E9] mb-6">
          Meal <span className="text-[#ECA241]">Selection</span>
        </h3>

        {/* Number of Meals */}
        <div className="mb-6">
          <label className={labelClass} style={fontBody}>Number of Meals</label>
          <select value={form.numMeals} onChange={(e) => setForm({ ...form, numMeals: e.target.value })} className={inputClass + " appearance-none cursor-pointer"} style={fontBody}>
            <option value="5">5 Meals</option>
            <option value="10">10 Meals</option>
            <option value="15">15 Meals</option>
            <option value="20">20 Meals</option>
          </select>
        </div>

        {/* Proteins */}
        <div className="mb-6">
          <label className={labelClass} style={fontBody}>Proteins (select all that apply) *</label>
          <div className="flex flex-wrap gap-2">
            {proteinOptions.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => toggleArray("proteins", p)}
                className={`px-4 py-2 text-sm border transition-all duration-300 ${
                  form.proteins.includes(p)
                    ? "bg-[#D82E2B] border-[#D82E2B] text-white"
                    : "border-white/15 text-[#F3F1E9]/60 hover:border-[#ECA241]/40 hover:text-[#F3F1E9]"
                }`}
                style={fontBody}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Flavor Styles */}
        <div>
          <label className={labelClass} style={fontBody}>Flavor Style (select all that apply) *</label>
          <div className="flex flex-wrap gap-2">
            {styleOptions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleArray("styles", s)}
                className={`px-4 py-2 text-sm border transition-all duration-300 ${
                  form.styles.includes(s)
                    ? "bg-[#ECA241] border-[#ECA241] text-black font-semibold"
                    : "border-white/15 text-[#F3F1E9]/60 hover:border-[#ECA241]/40 hover:text-[#F3F1E9]"
                }`}
                style={fontBody}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div>
        <h3 className="font-[family-name:var(--font-display)] text-xl text-[#F3F1E9] mb-6">
          Your <span className="text-[#ECA241]">Preferences</span>
        </h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelClass} style={fontBody}>Spice Level</label>
            <select value={form.spice} onChange={(e) => setForm({ ...form, spice: e.target.value })} className={inputClass + " appearance-none cursor-pointer"} style={fontBody}>
              <option value="Mild">Mild</option>
              <option value="Medium">Medium</option>
              <option value="Spicy">Spicy</option>
            </select>
          </div>
          <div>
            <label className={labelClass} style={fontBody}>Portion Size</label>
            <select value={form.portion} onChange={(e) => setForm({ ...form, portion: e.target.value })} className={inputClass + " appearance-none cursor-pointer"} style={fontBody}>
              <option value="Regular">Regular</option>
              <option value="High Protein">High Protein</option>
            </select>
          </div>
        </div>
        <div>
          <label className={labelClass} style={fontBody}>Dietary Restrictions</label>
          <input type="text" value={form.dietary} onChange={(e) => setForm({ ...form, dietary: e.target.value })} placeholder="e.g., No dairy, gluten-free, nut allergy..." className={inputClass} style={fontBody} />
        </div>
      </div>

      {/* Order Type */}
      <div>
        <h3 className="font-[family-name:var(--font-display)] text-xl text-[#F3F1E9] mb-6">
          Order <span className="text-[#ECA241]">Type</span>
        </h3>
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          <button
            type="button"
            onClick={() => setForm({ ...form, orderType: "one-time" })}
            className={`p-4 border text-left transition-all duration-300 ${
              form.orderType === "one-time"
                ? "border-[#ECA241] bg-[#ECA241]/10"
                : "border-white/10 hover:border-white/20"
            }`}
          >
            <div className="text-[#F3F1E9] text-sm font-semibold mb-1" style={fontBody}>One-Time Order</div>
            <div className="text-[#F3F1E9]/40 text-xs" style={fontBody}>Try us out with a single order</div>
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, orderType: "weekly" })}
            className={`p-4 border text-left transition-all duration-300 ${
              form.orderType === "weekly"
                ? "border-[#ECA241] bg-[#ECA241]/10"
                : "border-white/10 hover:border-white/20"
            }`}
          >
            <div className="text-[#F3F1E9] text-sm font-semibold mb-1" style={fontBody}>Weekly Subscription</div>
            <div className="text-[#F3F1E9]/40 text-xs" style={fontBody}>Fresh meals delivered every week</div>
          </button>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setForm({ ...form, delivery: "delivery" })}
            className={`p-4 border text-left transition-all duration-300 ${
              form.delivery === "delivery"
                ? "border-[#D82E2B] bg-[#D82E2B]/10"
                : "border-white/10 hover:border-white/20"
            }`}
          >
            <div className="text-[#F3F1E9] text-sm font-semibold mb-1" style={fontBody}>Delivery</div>
            <div className="text-[#F3F1E9]/40 text-xs" style={fontBody}>We bring it to your door</div>
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, delivery: "pickup" })}
            className={`p-4 border text-left transition-all duration-300 ${
              form.delivery === "pickup"
                ? "border-[#D82E2B] bg-[#D82E2B]/10"
                : "border-white/10 hover:border-white/20"
            }`}
          >
            <div className="text-[#F3F1E9] text-sm font-semibold mb-1" style={fontBody}>Pickup</div>
            <div className="text-[#F3F1E9]/40 text-xs" style={fontBody}>Grab your meals ready-to-go</div>
          </button>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className={labelClass} style={fontBody}>Additional Notes (optional)</label>
        <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any special requests, allergies, or preferences..." rows={3} className={inputClass + " resize-none"} style={fontBody} />
      </div>

      {/* Submit */}
      <div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#ECA241] text-black font-bold text-sm tracking-[0.15em] uppercase py-4 hover:bg-[#d4912e] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          style={fontBody}
        >
          {isPending ? "Submitting..." : "Start My Meal Plan"}
        </button>
        <p className="text-[#F3F1E9]/30 text-xs text-center mt-3" style={fontBody}>
          We'll reach out within 24 hours to confirm your custom order.
        </p>
      </div>
    </form>
  );
}

/* ─── MAIN PAGE ─── */
export default function MealPrepPage() {
  useEffect(() => {
    document.title = "Chef-Crafted Meal Prep | The PPL's Chef | Las Vegas";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Chef-crafted meal prep in Las Vegas. Choose your protein, pick your flavor style, and let us handle the rest. Fresh, balanced, restaurant-quality meals delivered.");
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      {/* ─── HERO ─── */}
      <section className="relative min-h-[75vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${MEAL_PREP_4BOX_SPREAD})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />

        <div className="relative z-10 container pb-16 pt-32">
          <Link href="/#services" className="inline-flex items-center gap-2 text-[#ECA241]/60 hover:text-[#ECA241] text-xs tracking-widest uppercase mb-6 transition-colors" style={fontBody}>
            <ChevronLeft size={14} /> All Services
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-[#ECA241]" />
              <span className="brand-label">Meal Prep</span>
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-[#F3F1E9] leading-tight mb-4 max-w-3xl">
              Choose Your Protein. Choose Your Flavor. <span className="text-[#ECA241]">We Handle the Rest.</span>
            </h1>
            <p className="text-[#F3F1E9]/60 text-base lg:text-lg max-w-xl" style={fontSerif}>
              This isn't meal prep. This is having your own personal chef.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── OVERVIEW ─── */}
      <section className="section-cream py-20 lg:py-28">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <FadeIn>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[1px] bg-[#D82E2B]" />
                <span className="brand-label text-[#D82E2B]">The Experience</span>
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl lg:text-4xl text-black leading-tight mb-6">
                Chef-Crafted Meals, <span className="text-[#D82E2B]">Built for Real Life</span>
              </h2>
              <div className="space-y-4 text-black/60 text-base lg:text-lg leading-relaxed" style={fontSerif}>
                <p>
                  Enjoy chef-crafted meals designed around your lifestyle. Choose your protein, select your flavor profile, and let us handle the rest.
                </p>
                <p>
                  From bold Mexican flavors to comforting American classics, vibrant Asian-inspired dishes, and refined Italian favorites — every meal is prepared fresh, balanced, and built for real life.
                </p>
                <p className="font-semibold text-black/80 italic">
                  This isn't meal prep. This is having your own personal chef.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 h-56 overflow-hidden">
                  <img src={MEAL_PREP_OVERHEAD_MULTI} alt="Chef-crafted meal prep containers" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="h-40 overflow-hidden">
                  <img src={MEAL_PREP_GLAZED_SALMON} alt="Glazed salmon with rice" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="h-40 overflow-hidden">
                  <img src={MEAL_PREP_GRILLED_CHICKEN} alt="Grilled chicken with lime" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="section-dark py-20 lg:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-[1px] bg-[#ECA241]" />
                <span className="brand-label">How It Works</span>
                <div className="w-8 h-[1px] bg-[#ECA241]" />
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl lg:text-4xl text-[#F3F1E9]">
                Four Simple <span className="text-[#ECA241]">Steps</span>
              </h2>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <FadeIn key={s.step} delay={i * 0.1}>
                <div className="relative border border-white/8 bg-[#0a0a0a] p-8 text-center group hover:border-[#ECA241]/30 transition-all duration-500">
                  {/* Step number */}
                  <div className="absolute top-4 right-4 text-[#ECA241]/15 text-4xl font-[family-name:var(--font-display)]">
                    {s.step}
                  </div>
                  {/* Icon */}
                  <div className="w-14 h-14 border border-[#ECA241]/30 flex items-center justify-center mx-auto mb-5 group-hover:bg-[#ECA241]/10 transition-all duration-500">
                    <s.icon size={24} className="text-[#ECA241]" />
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg text-[#F3F1E9] mb-2">{s.title}</h3>
                  <p className="text-[#F3F1E9]/45 text-sm leading-relaxed" style={fontBody}>{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SAMPLE MEALS ─── */}
      <section className="section-cream py-20 lg:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-[1px] bg-[#D82E2B]" />
                <span className="brand-label text-[#D82E2B]">On the Menu</span>
                <div className="w-8 h-[1px] bg-[#D82E2B]" />
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl lg:text-4xl text-black">
                Sample <span className="text-[#D82E2B]">Meals</span>
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 gap-5">
            {sampleMeals.map((meal, i) => (
              <FadeIn key={meal.name} delay={i * 0.08}>
                <div className="group overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow duration-500">
                  <div className="h-52 overflow-hidden">
                    <img src={meal.img} alt={meal.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  </div>
                  <div className="p-5">
                    <h4 className="font-[family-name:var(--font-display)] text-base text-black leading-snug">{meal.name}</h4>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <ServicePricingSection
        ctaHref="/meal-prep-las-vegas#order-form"
        label="Meal Prep Pricing"
        tiers={[
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
        ]}
      />

      {/* ─── PHOTO GALLERY (6 images, clean grid) ─── */}
      <section className="section-dark py-20 lg:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-[1px] bg-[#ECA241]" />
                <span className="brand-label">Gallery</span>
                <div className="w-8 h-[1px] bg-[#ECA241]" />
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl lg:text-4xl text-[#F3F1E9]">
                Fresh From Our <span className="text-[#ECA241]">Kitchen</span>
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {galleryImages.map((img, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="overflow-hidden aspect-square">
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3}>
            <div className="text-center mt-10">
              <Link href="/gallery" className="inline-flex items-center gap-2 text-[#ECA241] text-sm tracking-widest uppercase hover:text-[#F3F1E9] transition-colors" style={fontBody}>
                View Full Gallery →
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── ORDER FORM ─── */}
      <section id="order-form" className="section-dark py-20 lg:py-28 border-t border-white/5">
        <div className="container">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Sidebar */}
            <div className="lg:col-span-2">
              <FadeIn>
                <img src={LOGO_ALT_HORIZONTAL} alt="The PPL's Chef" className="h-16 w-auto object-contain drop-shadow-xl mb-5" />
                <h2 className="font-[family-name:var(--font-display)] text-2xl lg:text-3xl text-[#F3F1E9] mb-4">
                  Start Your <span className="text-[#ECA241]">Meal Plan</span>
                </h2>
                <p className="text-[#F3F1E9]/45 text-sm leading-relaxed mb-8" style={fontBody}>
                  Fill out the form and we'll reach out within 24 hours to confirm your custom order and delivery schedule.
                </p>

                {/* Quick info */}
                <div className="space-y-4 border-t border-white/5 pt-8">
                  <div className="flex items-start gap-3">
                    <Check size={14} className="text-[#ECA241] mt-1 shrink-0" />
                    <span className="text-[#F3F1E9]/50 text-sm" style={fontBody}>Fresh, never frozen — prepared the day of delivery</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check size={14} className="text-[#ECA241] mt-1 shrink-0" />
                    <span className="text-[#F3F1E9]/50 text-sm" style={fontBody}>Custom menus based on your dietary needs</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check size={14} className="text-[#ECA241] mt-1 shrink-0" />
                    <span className="text-[#F3F1E9]/50 text-sm" style={fontBody}>Serving the entire Las Vegas Valley</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check size={14} className="text-[#ECA241] mt-1 shrink-0" />
                    <span className="text-[#F3F1E9]/50 text-sm" style={fontBody}>Weekly subscription or one-time orders available</span>
                  </div>
                </div>

                {/* Contact */}
                <div className="mt-8 border-t border-white/5 pt-8">
                  <p className="text-[#ECA241] text-[11px] tracking-[0.15em] uppercase font-semibold mb-3" style={fontBody}>Questions?</p>
                  <a href="tel:725-212-2236" className="text-[#F3F1E9]/60 hover:text-[#ECA241] text-sm transition-colors block mb-1" style={fontBody}>
                    Call 725-212-2236
                  </a>
                  <a href="mailto:info@thepplschef.com" className="text-[#F3F1E9]/60 hover:text-[#ECA241] text-sm transition-colors block" style={fontBody}>
                    info@thepplschef.com
                  </a>
                </div>
              </FadeIn>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <FadeIn delay={0.15}>
                <MealOrderForm />
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA ─── */}
      <section className="section-cream py-20 lg:py-28">
        <div className="container text-center">
          <FadeIn>
            <img src={LOGO_ALT_HORIZONTAL} alt="The PPL's Chef" className="h-16 w-auto object-contain drop-shadow-lg mx-auto mb-5" />
            <h2 className="font-[family-name:var(--font-display)] text-3xl lg:text-4xl text-black mb-4">
              Ready to Eat <span className="text-[#D82E2B]">Better?</span>
            </h2>
            <p className="text-black/50 text-base max-w-lg mx-auto mb-8 leading-relaxed" style={fontBody}>
              Stop settling for ordinary. Let a professional chef handle your meals so you can focus on what matters.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#order-form" onClick={(e) => { e.preventDefault(); document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary">
                Start My Meal Plan
              </a>
              <a href="tel:725-212-2236" className="btn-outline-dark">Call 725-212-2236</a>
            </div>
          </FadeIn>
        </div>
      </section>
    </Layout>
  );
}
