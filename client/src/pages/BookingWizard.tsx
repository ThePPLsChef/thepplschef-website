/**
 * BookingWizard — Multi-step "Find Your Chef Experience" wizard
 *
 * TWO PATHS:
 *  • Standard path (Private Chef, Catering, Special Event, Corporate): 7 steps
 *  • Meal Prep path: 8 steps with completely different step 2–7 content
 *
 * VISUAL: Warm premium aesthetic matching homepage —
 * warm charcoal background (#1A1A1A), refined gold accents,
 * clean card borders (no neon glow), elegant typography.
 */
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChefHat, Users, Utensils, PartyPopper, Building2,
  CalendarDays, Leaf, DollarSign, User,
  ArrowLeft, ArrowRight, Check, Sparkles, Phone, Mail,
  Heart, Cake, TreePine, Gem, HelpCircle,
  Target, Truck, UtensilsCrossed, Repeat,
} from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { LOGO_PRIMARY } from "@/lib/images";
import { submitInquiry } from "@/lib/submitInquiry";

/* ─── Types ─── */
type ServiceType = "private-chef" | "catering" | "meal-prep" | "special-event" | "corporate";
type SpecialEventType = "Birthday" | "Anniversary" | "Holiday" | "Proposal" | "Other";

interface WizardData {
  // Shared
  serviceType: ServiceType | null;
  name: string;
  email: string;
  phone: string;
  referralSource: string;

  // Standard path fields
  guestCount: string;
  specialEventType: SpecialEventType | null;
  eventDate: string;
  dietaryNeeds: string[];
  budget: string;
  vision: string;

  // Meal Prep specific fields
  mpHouseholdSize: string;   // Step 2 MP
  mpGoal: string;            // Step 3 MP
  mpDietaryNeeds: string[];  // Step 4 MP (reuses dietary options)
  mpDeliveryFrequency: string; // Step 5 MP
  mpMealsPerWeek: string;    // Step 6 MP
  mpBudget: string;          // Step 7 MP
}

const initialData: WizardData = {
  serviceType: null,
  name: "",
  email: "",
  phone: "",
  referralSource: "",
  guestCount: "",
  specialEventType: null,
  eventDate: "",
  dietaryNeeds: [],
  budget: "",
  vision: "",
  mpHouseholdSize: "",
  mpGoal: "",
  mpDietaryNeeds: [],
  mpDeliveryFrequency: "",
  mpMealsPerWeek: "",
  mpBudget: "",
};

/* ─── Step counts ─── */
const STANDARD_TOTAL_STEPS = 7;
const MEAL_PREP_TOTAL_STEPS = 8;

/* ─── Service config ─── */
const SERVICES: { id: ServiceType; label: string; icon: typeof ChefHat; desc: string }[] = [
  { id: "private-chef", label: "Private Chef", icon: ChefHat, desc: "Intimate, chef-driven dining in your home" },
  { id: "catering", label: "Catering Event", icon: Utensils, desc: "Full-service catering for events of every scale" },
  { id: "meal-prep", label: "Weekly Meal Prep", icon: Leaf, desc: "Chef-crafted meals delivered fresh to your door" },
  { id: "special-event", label: "Special Event", icon: PartyPopper, desc: "Unforgettable celebrations with bespoke menus" },
  { id: "corporate", label: "Corporate Dining", icon: Building2, desc: "Elevate your business events with premium dining" },
];

/* ─── Standard path config ─── */
const GUEST_OPTIONS: Record<ServiceType, { label: string; options: string[] }> = {
  "private-chef": {
    label: "How many guests will you be serving?",
    options: ["2-4 guests", "5-10 guests", "11-20 guests", "20+ guests"],
  },
  "catering": {
    label: "How many guests are you expecting?",
    options: ["10-25 guests", "25-50 guests", "50-100 guests", "100+ guests"],
  },
  "meal-prep": {
    label: "How many people are you meal prepping for?",
    options: ["Just me", "Me + 1 partner", "Family of 3–4", "Family of 5+"],
  },
  "special-event": {
    label: "What type of special event?",
    options: [],
  },
  "corporate": {
    label: "How many employees/guests?",
    options: ["10-25 people", "25-50 people", "50-100 people", "100+ people"],
  },
};

const SPECIAL_EVENT_TYPES: { id: SpecialEventType; icon: typeof Cake; label: string }[] = [
  { id: "Birthday", icon: Cake, label: "Birthday" },
  { id: "Anniversary", icon: Heart, label: "Anniversary" },
  { id: "Holiday", icon: TreePine, label: "Holiday" },
  { id: "Proposal", icon: Gem, label: "Proposal" },
  { id: "Other", icon: HelpCircle, label: "Other" },
];

const DIETARY_OPTIONS = [
  "No restrictions", "Vegetarian", "Vegan", "Gluten-Free", "Keto",
  "Halal", "Kosher", "Nut Allergy", "Dairy-Free", "Other",
];

const BUDGET_OPTIONS: Record<ServiceType, string[]> = {
  "private-chef": ["Under $500", "$500 – $1,000", "$1,000 – $2,500", "$2,500+"],
  "catering": ["Under $1,000", "$1,000 – $3,000", "$3,000 – $7,500", "$7,500+"],
  "meal-prep": ["Under $150/week", "$150 – $250/week", "$250+/week"],
  "special-event": ["Under $1,000", "$1,000 – $3,000", "$3,000 – $7,500", "$7,500+"],
  "corporate": ["Under $2,000", "$2,000 – $5,000", "$5,000 – $15,000", "$15,000+"],
};

/* ─── Meal Prep specific config ─── */
const MP_HOUSEHOLD_OPTIONS = [
  { label: "Just me", desc: "Solo meal planning" },
  { label: "Me + 1 partner", desc: "Meals for two" },
  { label: "Family of 3–4", desc: "Family-sized portions" },
  { label: "Family of 5+", desc: "Large household" },
];

const MP_GOAL_OPTIONS = [
  { label: "Weight loss & clean eating", icon: Target, desc: "Lean, balanced, calorie-conscious meals" },
  { label: "Muscle building & high protein", icon: ChefHat, desc: "High-protein, macro-optimized meals" },
  { label: "Balanced everyday meals", icon: UtensilsCrossed, desc: "Nutritious variety for everyday life" },
  { label: "Specific dietary lifestyle", icon: Leaf, desc: "Keto, vegan, paleo, and more" },
];

const MP_DELIVERY_OPTIONS = [
  { label: "Weekly", desc: "Fresh delivery every week" },
  { label: "Bi-weekly", desc: "Delivery every two weeks" },
  { label: "One-time order", desc: "Try it before committing" },
];

const MP_MEALS_OPTIONS = [
  { label: "5 meals", desc: "Perfect for weekday lunches or dinners" },
  { label: "10 meals", desc: "Full weekday coverage" },
  { label: "15 meals", desc: "Lunch + dinner all week" },
  { label: "Custom", desc: "Tell us what works for you" },
];

const MP_BUDGET_OPTIONS = [
  { label: "$120–$175/week", desc: "Great value, chef-quality meals" },
  { label: "$175–$250/week", desc: "Premium ingredients & variety" },
  { label: "$250+/week", desc: "Fully custom, no limits" },
];

const REFERRAL_OPTIONS = ["Instagram", "TikTok", "Google", "Referral", "Facebook", "Other"];

const SERVICE_NAME_MAP: Record<ServiceType, string> = {
  "private-chef": "Private Chef",
  "catering": "Catering",
  "meal-prep": "Meal Prep",
  "special-event": "Special Events",
  "corporate": "Corporate Dining",
};

/* ─── Animation variants ─── */
const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

/* ─── Reusable Selection Card ─── */
function SelectionCard({
  selected,
  onClick,
  icon: Icon,
  label,
  desc,
  small = false,
}: {
  selected: boolean;
  onClick: () => void;
  icon?: typeof ChefHat;
  label: string;
  desc?: string;
  small?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`
        relative group text-left w-full transition-all duration-300
        ${small ? "p-5 sm:p-6" : "p-6 sm:p-8"}
        ${selected
          ? "border border-[#ECA241] bg-[#ECA241]/[0.07]"
          : "border border-white/[0.08] bg-white/[0.02] hover:border-[#ECA241]/30 hover:bg-white/[0.04]"
        }
      `}
    >
      <div className={`
        absolute top-4 right-4 w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300
        ${selected
          ? "border-[#ECA241] bg-[#ECA241]"
          : "border-white/15 group-hover:border-white/25"
        }
      `}>
        {selected && <Check size={12} className="text-black" strokeWidth={3} />}
      </div>

      {Icon && (
        <div className={`
          flex items-center justify-center mb-4 transition-colors duration-300
          ${small ? "w-10 h-10" : "w-12 h-12"}
          ${selected
            ? "text-[#ECA241]"
            : "text-[#F3F1E9]/40 group-hover:text-[#F3F1E9]/60"
          }
        `}>
          <Icon size={small ? 22 : 26} strokeWidth={1.5} />
        </div>
      )}
      <div
        className={`font-semibold tracking-wide transition-colors duration-300
          ${selected ? "text-[#ECA241]" : "text-[#F3F1E9]/90 group-hover:text-[#F3F1E9]"}
          ${small ? "text-sm" : "text-base"}
        `}
        style={{ fontFamily: "var(--font-body)" }}
      >
        {label}
      </div>
      {desc && (
        <div
          className={`text-[13px] mt-2 leading-relaxed transition-colors duration-300
            ${selected ? "text-[#F3F1E9]/50" : "text-[#F3F1E9]/30 group-hover:text-[#F3F1E9]/45"}
          `}
          style={{ fontFamily: "var(--font-body)" }}
        >
          {desc}
        </div>
      )}
    </motion.button>
  );
}

/* ─── Multi-select Card (for dietary) ─── */
function MultiSelectCard({
  selected,
  onClick,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`
        relative px-5 py-3.5 sm:px-6 sm:py-4 border text-sm font-medium tracking-wide transition-all duration-300
        ${selected
          ? "border-[#ECA241] bg-[#ECA241]/[0.07] text-[#ECA241]"
          : "border-white/[0.08] bg-white/[0.02] text-[#F3F1E9]/50 hover:border-[#ECA241]/25 hover:text-[#F3F1E9]/75 hover:bg-white/[0.04]"
        }
      `}
      style={{ fontFamily: "var(--font-body)" }}
    >
      {selected && (
        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#ECA241] rounded-full flex items-center justify-center">
          <Check size={10} className="text-black" strokeWidth={3} />
        </span>
      )}
      {label}
    </motion.button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN WIZARD COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function BookingWizard() {
  useEffect(() => {
    document.title = "Book a Chef | The PPL's Chef | Las Vegas Private Chef & Catering";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Book The PPL's Chef for your Las Vegas event. Use our step-by-step wizard to request a private chef, catering, meal prep, or special event experience.");
    window.scrollTo(0, 0);
  }, []);

  // Read ?service= URL param to pre-select service and skip to step 2
  const preselectedService = useMemo((): ServiceType | null => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get("service");
    const valid: ServiceType[] = ["private-chef", "catering", "meal-prep", "special-event", "corporate"];
    return valid.includes(s as ServiceType) ? (s as ServiceType) : null;
  }, []);

  const [step, setStep] = useState(() => preselectedService ? 2 : 1);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<WizardData>(() =>
    preselectedService ? { ...initialData, serviceType: preselectedService } : initialData
  );
  const [isPending, setIsPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const wizardTopRef = useRef<HTMLDivElement>(null);

  // Smooth scroll to wizard top on every step change
  useEffect(() => {
    if (wizardTopRef.current) {
      wizardTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step]);

  const fontBody = { fontFamily: "var(--font-body)" };

  // Derived: which path are we on?
  const isMealPrep = data.serviceType === "meal-prep";
  const totalSteps = isMealPrep ? MEAL_PREP_TOTAL_STEPS : STANDARD_TOTAL_STEPS;

  const update = useCallback(<K extends keyof WizardData>(key: K, value: WizardData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleDietary = useCallback((item: string) => {
    setData((prev) => {
      const current = prev.dietaryNeeds;
      if (item === "No restrictions") {
        return { ...prev, dietaryNeeds: current.includes(item) ? [] : [item] };
      }
      const without = current.filter((d) => d !== "No restrictions");
      return {
        ...prev,
        dietaryNeeds: without.includes(item)
          ? without.filter((d) => d !== item)
          : [...without, item],
      };
    });
  }, []);

  const toggleMpDietary = useCallback((item: string) => {
    setData((prev) => {
      const current = prev.mpDietaryNeeds;
      if (item === "No restrictions") {
        return { ...prev, mpDietaryNeeds: current.includes(item) ? [] : [item] };
      }
      const without = current.filter((d) => d !== "No restrictions");
      return {
        ...prev,
        mpDietaryNeeds: without.includes(item)
          ? without.filter((d) => d !== item)
          : [...without, item],
      };
    });
  }, []);

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, totalSteps));
  };
  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  /* ─── canProceed — handles both paths ─── */
  const canProceed = (): boolean => {
    if (step === 1) return data.serviceType !== null;

    if (isMealPrep) {
      switch (step) {
        case 2: return data.mpHouseholdSize !== "";
        case 3: return data.mpGoal !== "";
        case 4: return data.mpDietaryNeeds.length > 0;
        case 5: return data.mpDeliveryFrequency !== "";
        case 6: return data.mpMealsPerWeek !== "";
        case 7: return data.mpBudget !== "";
        case 8: return data.name.trim() !== "" && data.email.trim() !== "" && data.email.includes("@") && data.phone.trim() !== "";
        default: return false;
      }
    }

    // Standard path
    switch (step) {
      case 2:
        if (data.serviceType === "special-event") return data.specialEventType !== null;
        return data.guestCount !== "";
      case 3: return data.eventDate !== "";
      case 4: return data.dietaryNeeds.length > 0;
      case 5: return data.budget !== "";
      case 6: return true;
      case 7: return data.name.trim() !== "" && data.email.trim() !== "" && data.email.includes("@") && data.phone.trim() !== "";
      default: return false;
    }
  };

  /* ─── Submit ─── */
  const handleSubmit = async () => {
    if (!data.serviceType) return;
    setIsPending(true);

    const serviceLabel = SERVICE_NAME_MAP[data.serviceType];

    let notes = "";
    if (isMealPrep) {
      const parts = [
        data.mpGoal ? `Goal: ${data.mpGoal}` : "",
        data.mpDeliveryFrequency ? `Delivery: ${data.mpDeliveryFrequency}` : "",
        data.mpMealsPerWeek ? `Meals/week: ${data.mpMealsPerWeek}` : "",
        data.referralSource ? `Heard about us via: ${data.referralSource}` : "",
      ].filter(Boolean);
      notes = parts.join("\n");
    } else {
      const specialEventNote = data.specialEventType ? `Event type: ${data.specialEventType}` : "";
      const referralNote = data.referralSource ? `Heard about us via: ${data.referralSource}` : "";
      notes = [data.vision, specialEventNote, referralNote].filter(Boolean).join("\n");
    }

    try {
      await submitInquiry({
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim() || undefined,
        serviceType: serviceLabel,
        eventDate: isMealPrep ? undefined : (data.eventDate || undefined),
        guestCount: isMealPrep ? data.mpHouseholdSize || undefined : (data.guestCount || undefined),
        budget: isMealPrep ? data.mpBudget || undefined : (data.budget || undefined),
        foodPreferences: isMealPrep
          ? data.mpDietaryNeeds.join(", ") || undefined
          : data.dietaryNeeds.join(", ") || undefined,
        notes: notes || undefined,
      });
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again or call us at (725) 212-2236.");
    } finally {
      setIsPending(false);
    }
  };

  /* ─── Step titles ─── */
  const getStepTitle = (): string => {
    if (step === 1) return "What type of experience are you looking for?";
    if (isMealPrep) {
      const titles = [
        "",
        "What type of experience are you looking for?",
        "How many people are you meal prepping for?",
        "What's your goal?",
        "Any dietary restrictions or allergies?",
        "How often do you want delivery?",
        "How many meals per week?",
        "What's your budget range?",
        "Your contact information",
      ];
      return titles[step] || "";
    }
    const titles = [
      "",
      "What type of experience are you looking for?",
      data.serviceType === "special-event"
        ? "What type of special event?"
        : GUEST_OPTIONS[data.serviceType || "private-chef"]?.label || "Tell us more",
      data.serviceType === "meal-prep" ? "When would you like to start?" : "When is your event?",
      "Any dietary needs or preferences?",
      "What's your approximate budget?",
      "Tell us about your vision",
      "Your contact information",
    ];
    return titles[step] || "";
  };

  const getStepSubtitle = (): string => {
    if (step === 1) return "Select the service that best fits your occasion.";
    if (isMealPrep) {
      const subtitles = [
        "",
        "Select the service that best fits your occasion.",
        "This helps us plan the right portion sizes and quantities.",
        "We'll build your menu around your health and lifestyle goals.",
        "Select all that apply — we'll accommodate every need.",
        "We'll set up your delivery schedule around your routine.",
        "Choose the plan that fits your weekly needs.",
        "We'll design the best plan within your budget.",
        "We'll reach out within 24 hours to finalize your meal plan.",
      ];
      return subtitles[step] || "";
    }
    const subtitles = [
      "",
      "Select the service that best fits your occasion.",
      data.serviceType === "special-event"
        ? "We'll tailor the experience to your celebration."
        : "This helps us plan the perfect team and menu.",
      "Choose a date and we'll check availability.",
      "Select all that apply — we'll accommodate every need.",
      "This helps us design the right menu and experience.",
      "Optional — share any details about your dream event.",
      "We'll reach out within 24 hours to discuss your event.",
    ];
    return subtitles[step] || "";
  };

  /* ─── Success Screen ─── */  if (submitted) {
    return (
      <Layout hideStickyCta hideFooter>
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: "#1A1A1A" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-10 max-w-lg mx-auto px-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-[#ECA241] rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <Check size={36} className="text-black" strokeWidth={2.5} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl text-[#F3F1E9] mb-4">
                You're All Set, <span className="text-[#ECA241]">{data.name.split(" ")[0]}</span>!
              </h1>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <p className="text-[#F3F1E9]/60 text-lg leading-relaxed mb-3" style={fontBody}>
                We've received your inquiry for a{" "}
                <span className="text-[#ECA241] font-semibold">
                  {SERVICE_NAME_MAP[data.serviceType!]}
                </span>{" "}
                {isMealPrep ? "plan" : "experience"}.
              </p>
              <p className="text-[#F3F1E9]/40 text-base leading-relaxed mb-10" style={fontBody}>
                {isMealPrep
                  ? "Our chef will review your preferences and reach out within 24 hours to craft your custom meal plan."
                  : "Our chef will review your details and reach out within 24 hours to discuss your vision and craft a custom proposal."
                }
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="space-y-4">
              <Link href="/" className="btn-primary inline-flex items-center gap-2">
                Return Home
              </Link>
              <div className="flex items-center justify-center gap-6 pt-4">
                <a href="tel:725-212-2236" className="flex items-center gap-2 text-[#F3F1E9]/40 hover:text-[#ECA241] text-sm transition-colors" style={fontBody}>
                  <Phone size={14} /> (725) 212-2236
                </a>
                <a href="mailto:info@thepplschef.com" className="flex items-center gap-2 text-[#F3F1E9]/40 hover:text-[#ECA241] text-sm transition-colors" style={fontBody}>
                  <Mail size={14} /> Email Us
                </a>
              </div>
            </motion.div>
          </motion.div>
        </section>
      </Layout>
    );
  }
  /* ─── Main Wizard ─── */
  return (
    <Layout hideStickyCta hideFooter>
      <section className="min-h-screen relative overflow-hidden" style={{ backgroundColor: "#1A1A1A" }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(236,162,65,0.04)_0%,transparent_60%)]" />

        <div ref={wizardTopRef} className="relative z-10 container max-w-2xl mx-auto px-5 sm:px-6 pt-28 pb-56 sm:pb-24">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Link href="/" className="inline-block mb-6">
              <img src={LOGO_PRIMARY} alt="The PPL's Chef" className="h-16 w-auto mx-auto object-contain" />
            </Link>
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-8 h-[1px] bg-[#ECA241]/40" />
              <span className="brand-label text-[#ECA241]" style={{ fontSize: "0.65rem" }}>
                {isMealPrep ? "Build Your Meal Plan" : "Find Your Chef Experience"}
              </span>
              <div className="w-8 h-[1px] bg-[#ECA241]/40" />
            </div>
          </motion.div>

          {/* Progress Bar — dynamic total steps */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#F3F1E9]/40 text-xs tracking-wider uppercase font-medium" style={fontBody}>
                Step {step} of {totalSteps}
              </span>
              <span className="text-[#ECA241]/80 text-xs font-semibold" style={fontBody}>
                {Math.round((step / totalSteps) * 100)}%
              </span>
            </div>
            <div className="h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#ECA241] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(step / totalSteps) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`${step}-${isMealPrep ? "mp" : "std"}`}
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {/* Step Title */}
                <div className="mb-8 sm:mb-10">
                  <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl text-[#F3F1E9] leading-tight mb-3">
                    {getStepTitle()}
                  </h2>
                  <p className="text-[#F3F1E9]/40 text-sm sm:text-base leading-relaxed" style={fontBody}>
                    {getStepSubtitle()}
                  </p>
                </div>

                {/* ─── STEP 1: Service Type (shared) ─── */}
                {step === 1 && (
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    {SERVICES.map((s) => (
                      <SelectionCard
                        key={s.id}
                        selected={data.serviceType === s.id}
                        onClick={() => {
                          update("serviceType", s.id);
                          update("guestCount", "");
                          update("specialEventType", null);
                          update("budget", "");
                          update("mpHouseholdSize", "");
                          update("mpGoal", "");
                          update("mpDietaryNeeds", []);
                          update("mpDeliveryFrequency", "");
                          update("mpMealsPerWeek", "");
                          update("mpBudget", "");
                        }}
                        icon={s.icon}
                        label={s.label}
                        desc={s.desc}
                      />
                    ))}
                  </div>
                )}

                {/* ════════════════════════════════════════
                    MEAL PREP PATH — Steps 2–7
                    ════════════════════════════════════════ */}

                {/* MP Step 2: Household Size */}
                {isMealPrep && step === 2 && (
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    {MP_HOUSEHOLD_OPTIONS.map((opt) => (
                      <SelectionCard
                        key={opt.label}
                        selected={data.mpHouseholdSize === opt.label}
                        onClick={() => update("mpHouseholdSize", opt.label)}
                        icon={Users}
                        label={opt.label}
                        desc={opt.desc}
                      />
                    ))}
                  </div>
                )}

                {/* MP Step 3: Goal */}
                {isMealPrep && step === 3 && (
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    {MP_GOAL_OPTIONS.map((opt) => (
                      <SelectionCard
                        key={opt.label}
                        selected={data.mpGoal === opt.label}
                        onClick={() => update("mpGoal", opt.label)}
                        icon={opt.icon}
                        label={opt.label}
                        desc={opt.desc}
                      />
                    ))}
                  </div>
                )}

                {/* MP Step 4: Dietary Restrictions */}
                {isMealPrep && step === 4 && (
                  <div className="flex flex-wrap gap-2.5 sm:gap-3">
                    {DIETARY_OPTIONS.map((opt) => (
                      <MultiSelectCard
                        key={opt}
                        selected={data.mpDietaryNeeds.includes(opt)}
                        onClick={() => toggleMpDietary(opt)}
                        label={opt}
                      />
                    ))}
                  </div>
                )}

                {/* MP Step 5: Delivery Frequency */}
                {isMealPrep && step === 5 && (
                  <div className="grid sm:grid-cols-3 gap-3 sm:gap-4">
                    {MP_DELIVERY_OPTIONS.map((opt) => (
                      <SelectionCard
                        key={opt.label}
                        selected={data.mpDeliveryFrequency === opt.label}
                        onClick={() => update("mpDeliveryFrequency", opt.label)}
                        icon={Truck}
                        label={opt.label}
                        desc={opt.desc}
                      />
                    ))}
                  </div>
                )}

                {/* MP Step 6: Meals Per Week */}
                {isMealPrep && step === 6 && (
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    {MP_MEALS_OPTIONS.map((opt) => (
                      <SelectionCard
                        key={opt.label}
                        selected={data.mpMealsPerWeek === opt.label}
                        onClick={() => update("mpMealsPerWeek", opt.label)}
                        icon={UtensilsCrossed}
                        label={opt.label}
                        desc={opt.desc}
                        small
                      />
                    ))}
                  </div>
                )}

                {/* MP Step 7: Budget */}
                {isMealPrep && step === 7 && (
                  <div className="grid sm:grid-cols-3 gap-3 sm:gap-4">
                    {MP_BUDGET_OPTIONS.map((opt) => (
                      <SelectionCard
                        key={opt.label}
                        selected={data.mpBudget === opt.label}
                        onClick={() => update("mpBudget", opt.label)}
                        icon={DollarSign}
                        label={opt.label}
                        desc={opt.desc}
                      />
                    ))}
                  </div>
                )}

                {/* MP Step 8 / Standard Step 7: Contact Info (shared layout) */}
                {((isMealPrep && step === 8) || (!isMealPrep && step === 7)) && (
                  <div className="space-y-5 sm:space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                      <div>
                        <label className="text-[#F3F1E9]/40 text-[11px] tracking-wider uppercase block mb-2 font-medium" style={fontBody}>
                          Full Name *
                        </label>
                        <div className="relative">
                          <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ECA241]/30 pointer-events-none" />
                          <input
                            type="text"
                            required
                            value={data.name}
                            onChange={(e) => update("name", e.target.value)}
                            placeholder="Your full name"
                            className="w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border border-white/[0.08] text-[#F3F1E9] focus:border-[#ECA241]/60 focus:outline-none transition-colors text-sm sm:text-base placeholder:text-[#F3F1E9]/15"
                            style={fontBody}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[#F3F1E9]/40 text-[11px] tracking-wider uppercase block mb-2 font-medium" style={fontBody}>
                          Phone *
                        </label>
                        <div className="relative">
                          <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ECA241]/30 pointer-events-none" />
                          <input
                            type="tel"
                            required
                            value={data.phone}
                            onChange={(e) => update("phone", e.target.value)}
                            placeholder="(555) 123-4567"
                            className="w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border border-white/[0.08] text-[#F3F1E9] focus:border-[#ECA241]/60 focus:outline-none transition-colors text-sm sm:text-base placeholder:text-[#F3F1E9]/15"
                            style={fontBody}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-[#F3F1E9]/40 text-[11px] tracking-wider uppercase block mb-2 font-medium" style={fontBody}>
                        Email *
                      </label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ECA241]/30 pointer-events-none" />
                        <input
                          type="email"
                          required
                          value={data.email}
                          onChange={(e) => update("email", e.target.value)}
                          placeholder="your@email.com"
                          className="w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border border-white/[0.08] text-[#F3F1E9] focus:border-[#ECA241]/60 focus:outline-none transition-colors text-sm sm:text-base placeholder:text-[#F3F1E9]/15"
                          style={fontBody}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[#F3F1E9]/40 text-[11px] tracking-wider uppercase block mb-2 font-medium" style={fontBody}>
                        How did you hear about us?
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {REFERRAL_OPTIONS.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => update("referralSource", data.referralSource === opt ? "" : opt)}
                            className={`
                              px-4 py-2.5 border text-xs sm:text-sm font-medium transition-all duration-300
                              ${data.referralSource === opt
                                ? "border-[#ECA241] bg-[#ECA241]/[0.07] text-[#ECA241]"
                                : "border-white/[0.08] text-[#F3F1E9]/35 hover:border-white/15 hover:text-[#F3F1E9]/55"
                              }
                            `}
                            style={fontBody}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ════════════════════════════════════════
                    STANDARD PATH — Steps 2–6
                    ════════════════════════════════════════ */}

                {/* Standard Step 2: Guest Count / Event Type */}
                {!isMealPrep && step === 2 && data.serviceType && (
                  <div>
                    {data.serviceType === "special-event" ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                        {SPECIAL_EVENT_TYPES.map((evt) => (
                          <SelectionCard
                            key={evt.id}
                            selected={data.specialEventType === evt.id}
                            onClick={() => update("specialEventType", evt.id)}
                            icon={evt.icon}
                            label={evt.label}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                        {GUEST_OPTIONS[data.serviceType].options.map((opt) => (
                          <SelectionCard
                            key={opt}
                            selected={data.guestCount === opt}
                            onClick={() => update("guestCount", opt)}
                            icon={Users}
                            label={opt}
                            small
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Standard Step 3: Date */}
                {!isMealPrep && step === 3 && (
                  <div className="max-w-sm">
                    <div className="relative">
                      <CalendarDays size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ECA241]/40 pointer-events-none" />
                      <input
                        type="date"
                        value={data.eventDate}
                        onChange={(e) => update("eventDate", e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/[0.08] text-[#F3F1E9] focus:border-[#ECA241]/60 focus:outline-none transition-colors text-base [color-scheme:dark]"
                        style={fontBody}
                      />
                    </div>
                    <p className="text-[#F3F1E9]/25 text-xs sm:text-sm mt-3 leading-relaxed" style={fontBody}>
                      Don't have an exact date? Pick an approximate date and we'll work with you.
                    </p>
                  </div>
                )}

                {/* Standard Step 4: Dietary Needs */}
                {!isMealPrep && step === 4 && (
                  <div className="flex flex-wrap gap-2.5 sm:gap-3">
                    {DIETARY_OPTIONS.map((opt) => (
                      <MultiSelectCard
                        key={opt}
                        selected={data.dietaryNeeds.includes(opt)}
                        onClick={() => toggleDietary(opt)}
                        label={opt}
                      />
                    ))}
                  </div>
                )}

                {/* Standard Step 5: Budget */}
                {!isMealPrep && step === 5 && data.serviceType && (
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    {BUDGET_OPTIONS[data.serviceType].map((opt) => (
                      <SelectionCard
                        key={opt}
                        selected={data.budget === opt}
                        onClick={() => update("budget", opt)}
                        icon={DollarSign}
                        label={opt}
                        small
                      />
                    ))}
                  </div>
                )}

                {/* Standard Step 6: Vision */}
                {!isMealPrep && step === 6 && (
                  <div>
                    <textarea
                      value={data.vision}
                      onChange={(e) => update("vision", e.target.value)}
                      rows={6}
                      placeholder="Tell us about your dream event — theme ideas, must-have dishes, special requests, anything that will help us create the perfect experience for you..."
                      className="w-full px-5 py-4 bg-white/[0.03] border border-white/[0.08] text-[#F3F1E9] focus:border-[#ECA241]/60 focus:outline-none transition-colors text-sm sm:text-base leading-relaxed resize-none placeholder:text-[#F3F1E9]/15"
                      style={fontBody}
                    />
                    <p className="text-[#F3F1E9]/25 text-xs sm:text-sm mt-3 flex items-center gap-1.5" style={fontBody}>
                      <Sparkles size={12} className="text-[#ECA241]/30" />
                      This is optional — you can skip this step if you prefer.
                    </p>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          {/* On mobile: fixed bottom bar so CONTINUE is always visible without scrolling */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A1A] px-5 py-4 shadow-[0_-4px_24px_rgba(0,0,0,0.5)] border-t border-white/[0.08] flex items-center justify-between sm:static sm:z-auto sm:bg-transparent sm:px-0 sm:py-0 sm:shadow-none sm:border-t sm:border-white/[0.06] sm:mt-10 sm:pt-8">
            {step > 1 ? (
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-2 text-[#F3F1E9]/35 hover:text-[#F3F1E9]/60 text-sm transition-colors"
                style={fontBody}
              >
                <ArrowLeft size={16} /> Back
              </button>
            ) : (
              <Link href="/" className="flex items-center gap-2 text-[#F3F1E9]/35 hover:text-[#F3F1E9]/60 text-sm transition-colors" style={fontBody}>
                <ArrowLeft size={16} /> Home
              </Link>
            )}

            {step < totalSteps ? (
              <button
                type="button"
                onClick={goNext}
                disabled={!canProceed()}
                className={`
                  flex items-center gap-2 px-8 py-3.5 text-sm font-semibold tracking-wider uppercase transition-all duration-300
                  ${canProceed()
                    ? "bg-[#ECA241] text-black hover:bg-[#f0b050]"
                    : "bg-white/[0.04] text-[#F3F1E9]/15 cursor-not-allowed"
                  }
                `}
                style={fontBody}
              >
                Continue <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canProceed() || isPending}
                className={`
                  flex items-center gap-2 px-10 py-4 text-sm font-bold tracking-wider uppercase transition-all duration-300
                  ${canProceed() && !isPending
                    ? "bg-[#ECA241] text-black hover:bg-[#f0b050]"
                    : "bg-white/[0.04] text-[#F3F1E9]/15 cursor-not-allowed"
                  }
                `}
                style={fontBody}
              >
                {isPending ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                    />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Inquiry <ArrowRight size={16} />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Step indicator dots — dynamic count */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`
                  h-1.5 rounded-full transition-all duration-300
                  ${i + 1 === step ? "bg-[#ECA241] w-6" : i + 1 < step ? "bg-[#ECA241]/30 w-1.5" : "bg-white/[0.08] w-1.5"}
                `}
              />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
