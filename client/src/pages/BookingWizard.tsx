/**
 * BookingWizard — Multi-step "Find Your Chef Experience" wizard
 *
 * TWO PATHS:
 *  • Standard path (Private Chef, Catering, Special Event, Corporate): 7 steps + Review
 *  • Meal Prep path: 8 steps + Review
 *
 * VISUAL: Elevated luxury aesthetic — warm cream card surfaces (#FAF7F2 / #F5F0E8)
 * with soft shadow elevation, spacious padding, cinematic dark background with
 * food photography, gold as a guide accent (not dominant), generous breathing room.
 * Each card feels like a "section of an experience," not a UI component.
 */
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChefHat, Users, Utensils, PartyPopper, Building2,
  CalendarDays, Leaf, DollarSign, User,
  ArrowLeft, ArrowRight, Check, Sparkles, Phone, Mail,
  Heart, Cake, TreePine, Gem, HelpCircle,
  Target, Truck, UtensilsCrossed, Pencil,
} from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { LOGO_PRIMARY, HERO_BG, SEAFOOD_BOIL_OVERHEAD, ELEGANT_TABLE, BUFFET_SERVICE } from "@/lib/images";
import { submitInquiry } from "@/lib/submitInquiry";

/* ─── Types ─── */
type ServiceType = "private-chef" | "catering" | "meal-prep" | "special-event" | "corporate";
type SpecialEventType = "Birthday" | "Anniversary" | "Holiday" | "Proposal" | "Other";

interface WizardData {
  serviceType: ServiceType | null;
  name: string;
  email: string;
  phone: string;
  referralSource: string;
  guestCount: string;
  specialEventType: SpecialEventType | null;
  eventDate: string;
  dietaryNeeds: string[];
  budget: string;
  vision: string;
  mpHouseholdSize: string;
  mpGoal: string;
  mpDietaryNeeds: string[];
  mpDeliveryFrequency: string;
  mpMealsPerWeek: string;
  mpBudget: string;
}

const initialData: WizardData = {
  serviceType: null, name: "", email: "", phone: "", referralSource: "",
  guestCount: "", specialEventType: null, eventDate: "", dietaryNeeds: [],
  budget: "", vision: "",
  mpHouseholdSize: "", mpGoal: "", mpDietaryNeeds: [], mpDeliveryFrequency: "",
  mpMealsPerWeek: "", mpBudget: "",
};

/* ─── Step counts (review is an extra step before submit) ─── */
const STANDARD_TOTAL_STEPS = 7;   // 7 data steps + review
const MEAL_PREP_TOTAL_STEPS = 8;  // 8 data steps + review
const REVIEW_STEP_STANDARD = 8;
const REVIEW_STEP_MEAL_PREP = 9;

/* ─── Service config ─── */
const SERVICES: { id: ServiceType; label: string; icon: typeof ChefHat; desc: string; bg: string }[] = [
  { id: "private-chef",  label: "Private Chef",    icon: ChefHat,     desc: "Intimate, chef-driven dining in your home",              bg: ELEGANT_TABLE },
  { id: "catering",      label: "Catering Event",  icon: Utensils,    desc: "Full-service catering for events of every scale",        bg: BUFFET_SERVICE },
  { id: "meal-prep",     label: "Weekly Meal Prep", icon: Leaf,       desc: "Chef-crafted meals delivered fresh to your door",        bg: SEAFOOD_BOIL_OVERHEAD },
  { id: "special-event", label: "Special Event",   icon: PartyPopper, desc: "Unforgettable celebrations with bespoke menus",          bg: ELEGANT_TABLE },
  { id: "corporate",     label: "Corporate Dining", icon: Building2,  desc: "Elevate your business events with premium dining",       bg: BUFFET_SERVICE },
];

/* ─── Standard path config ─── */
const GUEST_OPTIONS: Record<ServiceType, { label: string; options: string[] }> = {
  "private-chef":  { label: "How many guests will you be serving?",   options: ["2–4 guests", "5–10 guests", "11–20 guests", "20+ guests"] },
  "catering":      { label: "How many guests are you expecting?",      options: ["10–25 guests", "25–50 guests", "50–100 guests", "100+ guests"] },
  "meal-prep":     { label: "How many people are you meal prepping for?", options: ["Just me", "Me + 1 partner", "Family of 3–4", "Family of 5+"] },
  "special-event": { label: "What type of special event?",             options: [] },
  "corporate":     { label: "How many employees/guests?",              options: ["10–25 people", "25–50 people", "50–100 people", "100+ people"] },
};

const SPECIAL_EVENT_TYPES: { id: SpecialEventType; icon: typeof Cake; label: string }[] = [
  { id: "Birthday",    icon: Cake,       label: "Birthday"    },
  { id: "Anniversary", icon: Heart,      label: "Anniversary" },
  { id: "Holiday",     icon: TreePine,   label: "Holiday"     },
  { id: "Proposal",    icon: Gem,        label: "Proposal"    },
  { id: "Other",       icon: HelpCircle, label: "Other"       },
];

const DIETARY_OPTIONS = [
  "No restrictions", "Vegetarian", "Vegan", "Gluten-Free", "Keto",
  "Halal", "Kosher", "Nut Allergy", "Dairy-Free", "Other",
];

const BUDGET_OPTIONS: Record<ServiceType, string[]> = {
  "private-chef":  ["Under $500", "$500 – $1,000", "$1,000 – $2,500", "$2,500+"],
  "catering":      ["Under $1,000", "$1,000 – $3,000", "$3,000 – $7,500", "$7,500+"],
  "meal-prep":     ["Under $150/week", "$150 – $250/week", "$250+/week"],
  "special-event": ["Under $1,000", "$1,000 – $3,000", "$3,000 – $7,500", "$7,500+"],
  "corporate":     ["Under $2,000", "$2,000 – $5,000", "$5,000 – $15,000", "$15,000+"],
};

/* ─── Meal Prep specific config ─── */
const MP_HOUSEHOLD_OPTIONS = [
  { label: "Just me",         desc: "Solo meal planning"       },
  { label: "Me + 1 partner",  desc: "Meals for two"            },
  { label: "Family of 3–4",   desc: "Family-sized portions"    },
  { label: "Family of 5+",    desc: "Large household"          },
];

const MP_GOAL_OPTIONS = [
  { label: "Weight loss & clean eating",   icon: Target,          desc: "Lean, balanced, calorie-conscious meals"  },
  { label: "Muscle building & high protein", icon: ChefHat,       desc: "High-protein, macro-optimized meals"      },
  { label: "Balanced everyday meals",      icon: UtensilsCrossed, desc: "Nutritious variety for everyday life"     },
  { label: "Specific dietary lifestyle",   icon: Leaf,            desc: "Keto, vegan, paleo, and more"             },
];

const MP_DELIVERY_OPTIONS = [
  { label: "Weekly",          desc: "Fresh delivery every week"       },
  { label: "Bi-weekly",       desc: "Delivery every two weeks"        },
  { label: "One-time order",  desc: "Try it before committing"        },
];

const MP_MEALS_OPTIONS = [
  { label: "5 meals",  desc: "Perfect for weekday lunches or dinners" },
  { label: "10 meals", desc: "Full weekday coverage"                  },
  { label: "15 meals", desc: "Lunch + dinner all week"                },
  { label: "Custom",   desc: "Tell us what works for you"             },
];

const MP_BUDGET_OPTIONS = [
  { label: "$120–$175/week", desc: "Great value, chef-quality meals" },
  { label: "$175–$250/week", desc: "Premium ingredients & variety"   },
  { label: "$250+/week",     desc: "Fully custom, no limits"         },
];

const REFERRAL_OPTIONS = ["Instagram", "TikTok", "Google", "Referral", "Facebook", "Other"];

const SERVICE_NAME_MAP: Record<ServiceType, string> = {
  "private-chef": "Private Chef", "catering": "Catering", "meal-prep": "Meal Prep",
  "special-event": "Special Events", "corporate": "Corporate Dining",
};

/* ─── Step labels ─── */
const STANDARD_STEP_LABELS  = ["Service", "Details", "Date", "Dietary", "Budget", "Vision", "Contact", "Review"];
const MEAL_PREP_STEP_LABELS = ["Service", "Household", "Goal", "Dietary", "Delivery", "Meals", "Budget", "Contact", "Review"];

/* ─── Animation variants ─── */
const pageVariants = {
  enter:  (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

/* ═══════════════════════════════════════════════════════════════
   ELEVATED LUXURY CARD
   Warm cream surface, soft shadow, generous padding.
   Gold guides the eye on selection — never dominates.
   ═══════════════════════════════════════════════════════════════ */
function LuxCard({
  selected, onClick, icon: Icon, label, desc, small = false,
}: {
  selected: boolean; onClick: () => void; icon?: typeof ChefHat;
  label: string; desc?: string; small?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(0,0,0,0.28), 0 2px 8px rgba(236,162,65,0.10)" }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      className={`
        relative group text-left w-full rounded-2xl transition-all duration-300
        ${small ? "p-5 sm:p-6" : "p-7 sm:p-8"}
        ${selected
          ? "bg-[#FAF7F2] border border-[#D4A853]/50 shadow-[0_8px_32px_rgba(0,0,0,0.22),0_0_0_1px_rgba(212,168,83,0.25)] ring-1 ring-[#D4A853]/20"
          : "bg-[#F5F0E8] border border-[#E8E0D0]/60 shadow-[0_4px_20px_rgba(0,0,0,0.18)] hover:bg-[#FAF7F2] hover:border-[#D4A853]/30 hover:shadow-[0_8px_32px_rgba(0,0,0,0.22)]"
        }
      `}
    >
      {/* Selection indicator — subtle gold dot top-right */}
      <div className={`
        absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300
        ${selected
          ? "border-[#C49A3A] bg-[#D4A853]"
          : "border-[#C8BCA8]/50 group-hover:border-[#D4A853]/40"
        }
      `}>
        {selected && <Check size={11} className="text-white" strokeWidth={3} />}
      </div>

      {Icon && (
        <div className={`
          flex items-center justify-center rounded-xl mb-4 transition-all duration-300
          ${small ? "w-9 h-9" : "w-11 h-11"}
          ${selected
            ? "bg-[#D4A853]/12 text-[#B8892A]"
            : "bg-[#1A1A1A]/06 text-[#8A7A65] group-hover:bg-[#D4A853]/08 group-hover:text-[#B8892A]"
          }
        `}>
          <Icon size={small ? 19 : 22} strokeWidth={1.6} />
        </div>
      )}

      <div className={`
        font-semibold tracking-wide transition-colors duration-300 leading-snug
        ${selected ? "text-[#1A1A1A]" : "text-[#2C2416] group-hover:text-[#1A1A1A]"}
        ${small ? "text-sm" : "text-[15px]"}
      `} style={{ fontFamily: "var(--font-body)" }}>
        {label}
      </div>

      {desc && (
        <div className={`
          text-[13px] mt-2 leading-relaxed transition-colors duration-300
          ${selected ? "text-[#6B5E4A]" : "text-[#9A8E7E] group-hover:text-[#7A6E5E]"}
        `} style={{ fontFamily: "var(--font-body)" }}>
          {desc}
        </div>
      )}
    </motion.button>
  );
}

/* ─── Multi-select Pill (dietary) ─── */
function DietaryPill({ selected, onClick, label }: { selected: boolean; onClick: () => void; label: string }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`
        relative px-5 py-3 border rounded-xl text-sm font-medium tracking-wide transition-all duration-300
        ${selected
          ? "border-[#D4A853]/60 bg-[#FAF7F2] text-[#1A1A1A] shadow-[0_4px_16px_rgba(0,0,0,0.14),0_0_0_1px_rgba(212,168,83,0.20)]"
          : "border-[#E8E0D0]/50 bg-[#F0EBE0]/70 text-[#8A7A65] hover:bg-[#FAF7F2] hover:border-[#D4A853]/30 hover:text-[#2C2416] shadow-[0_2px_8px_rgba(0,0,0,0.10)]"
        }
      `}
      style={{ fontFamily: "var(--font-body)" }}
    >
      {selected && (
        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#D4A853] rounded-full flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.2)]">
          <Check size={9} className="text-white" strokeWidth={3} />
        </span>
      )}
      {label}
    </motion.button>
  );
}

/* ─── Elevated Input Field ─── */
function LuxInput({
  icon: Icon, label, required = false, ...props
}: {
  icon: typeof User; label: string; required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label
        className="text-[#8A7A65] text-[11px] tracking-[0.14em] uppercase block mb-2.5 font-semibold"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {label} {required && <span className="text-[#C49A3A]">*</span>}
      </label>
      <div className="relative">
        <Icon size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8A898] pointer-events-none" />
        <input
          {...props}
          className="w-full pl-11 pr-4 py-4 bg-[#FAF7F2] border border-[#E8E0D0]/70 rounded-xl text-[#1A1A1A] focus:border-[#D4A853]/60 focus:shadow-[0_0_0_3px_rgba(212,168,83,0.10)] focus:outline-none transition-all duration-300 text-[15px] placeholder:text-[#C8BCA8] shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
          style={{ fontFamily: "var(--font-body)" }}
        />
      </div>
    </div>
  );
}

/* ─── Progress Stepper ─── */
function ProgressStepper({ step, totalSteps, labels }: { step: number; totalSteps: number; labels: string[] }) {
  const progress = (step / totalSteps) * 100;
  return (
    <div className="mb-10 sm:mb-12">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[#F3F1E9]/30 text-xs tracking-[0.14em] uppercase font-medium" style={{ fontFamily: "var(--font-body)" }}>
          Step {step} of {totalSteps}
        </span>
        <span className="text-[#D4A853]/70 text-xs font-semibold tracking-wider" style={{ fontFamily: "var(--font-body)" }}>
          {Math.round(progress)}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-[3px] bg-[#F3F1E9]/[0.08] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #C49A3A 0%, #ECA241 50%, #F5A623 100%)" }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Step label dots */}
      <div className="hidden sm:flex items-center justify-between mt-3">
        {labels.map((lbl, i) => (
          <div key={i} className="flex flex-col items-center" style={{ width: `${100 / totalSteps}%` }}>
            <span
              className={`text-[10px] tracking-wider transition-colors duration-300 ${
                i + 1 === step
                  ? "text-[#D4A853] font-semibold"
                  : i + 1 < step
                    ? "text-[#D4A853]/40"
                    : "text-[#F3F1E9]/15"
              }`}
              style={{ fontFamily: "var(--font-body)" }}
            >
              {lbl}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Review Row ─── */
function ReviewRow({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between py-4 border-b border-[#E8E0D0]/60 last:border-0">
      <div className="flex-1 min-w-0 pr-4">
        <div className="text-[11px] tracking-[0.13em] uppercase text-[#8A7A65] font-semibold mb-1" style={{ fontFamily: "var(--font-body)" }}>
          {label}
        </div>
        <div className="text-[15px] text-[#1A1A1A] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
          {value}
        </div>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="flex items-center gap-1.5 text-[#C49A3A] hover:text-[#B8892A] text-xs font-medium tracking-wide transition-colors duration-200 shrink-0 mt-0.5"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <Pencil size={12} strokeWidth={2} />
        Edit
      </button>
    </div>
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

  useEffect(() => {
    if (wizardTopRef.current) {
      wizardTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step]);

  const fontBody = { fontFamily: "var(--font-body)" };
  const isMealPrep = data.serviceType === "meal-prep";
  const totalDataSteps = isMealPrep ? MEAL_PREP_TOTAL_STEPS : STANDARD_TOTAL_STEPS;
  const reviewStep = isMealPrep ? REVIEW_STEP_MEAL_PREP : REVIEW_STEP_STANDARD;
  const totalSteps = reviewStep; // includes review step
  const stepLabels = isMealPrep ? MEAL_PREP_STEP_LABELS : STANDARD_STEP_LABELS;

  const update = useCallback(<K extends keyof WizardData>(key: K, value: WizardData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleDietary = useCallback((item: string) => {
    setData((prev) => {
      const current = prev.dietaryNeeds;
      if (item === "No restrictions") return { ...prev, dietaryNeeds: current.includes(item) ? [] : [item] };
      const without = current.filter((d) => d !== "No restrictions");
      return { ...prev, dietaryNeeds: without.includes(item) ? without.filter((d) => d !== item) : [...without, item] };
    });
  }, []);

  const toggleMpDietary = useCallback((item: string) => {
    setData((prev) => {
      const current = prev.mpDietaryNeeds;
      if (item === "No restrictions") return { ...prev, mpDietaryNeeds: current.includes(item) ? [] : [item] };
      const without = current.filter((d) => d !== "No restrictions");
      return { ...prev, mpDietaryNeeds: without.includes(item) ? without.filter((d) => d !== item) : [...without, item] };
    });
  }, []);

  const goNext = () => { setDirection(1); setStep((s) => Math.min(s + 1, totalSteps)); };
  const goBack = () => { setDirection(-1); setStep((s) => Math.max(s - 1, 1)); };
  const goToStep = (s: number) => { setDirection(-1); setStep(s); };

  const isReviewStep = step === reviewStep;

  const canProceed = (): boolean => {
    if (isReviewStep) return true;
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
        name: data.name.trim(), email: data.email.trim(),
        phone: data.phone.trim() || undefined, serviceType: serviceLabel,
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
    if (isReviewStep) return "Review your request";
    if (step === 1) return "What type of experience are you looking for?";
    if (isMealPrep) {
      const titles = ["", "", "How many people are you meal prepping for?", "What's your goal?", "Any dietary restrictions or allergies?", "How often do you want delivery?", "How many meals per week?", "What's your budget range?", "Almost there — your details"];
      return titles[step] || "";
    }
    const titles = ["", "",
      data.serviceType === "special-event" ? "What type of special event?" : GUEST_OPTIONS[data.serviceType || "private-chef"]?.label || "Tell us more",
      "When is your event?", "Any dietary needs or preferences?", "What's your approximate budget?",
      "Tell us about your vision", "Almost there — your details"];
    return titles[step] || "";
  };

  const getStepSubtitle = (): string => {
    if (isReviewStep) return "Take a moment to confirm your details before we send your request to Chef Stephen.";
    if (step === 1) return "Select the service that best fits your occasion.";
    if (isMealPrep) {
      const subtitles = ["", "", "This helps us plan the right portion sizes and quantities.", "We'll build your menu around your health and lifestyle goals.", "Select all that apply — we'll accommodate every need.", "We'll set up your delivery schedule around your routine.", "Choose the plan that fits your weekly needs.", "We'll design the best plan within your budget.", "We'll reach out within 24 hours to finalize your meal plan."];
      return subtitles[step] || "";
    }
    const subtitles = ["", "",
      data.serviceType === "special-event" ? "We'll tailor the experience to your celebration." : "This helps us plan the perfect team and menu.",
      "Choose a date and we'll check availability.", "Select all that apply — we'll accommodate every need.",
      "This helps us design the right menu and experience.", "Optional — share any details about your dream event.",
      "We'll reach out within 24 hours to discuss your event."];
    return subtitles[step] || "";
  };

  /* ─── Background image per step ─── */
  const bgImage = step === 1 ? HERO_BG
    : data.serviceType === "meal-prep" ? SEAFOOD_BOIL_OVERHEAD
    : data.serviceType === "catering" || data.serviceType === "corporate" ? BUFFET_SERVICE
    : ELEGANT_TABLE;

  /* ═══════════════════════════════════════════════════════════════
     SUCCESS SCREEN
     ═══════════════════════════════════════════════════════════════ */
  if (submitted) {
    return (
      <Layout hideStickyCta hideFooter>
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden"
          style={{ background: "linear-gradient(160deg, #1A1714 0%, #0F0E0C 100%)" }}>
          <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${ELEGANT_TABLE})` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1714]/80 to-[#0F0E0C]" />

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
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
              style={{ background: "linear-gradient(135deg, #C49A3A 0%, #ECA241 50%, #F5A623 100%)" }}
            >
              <Check size={36} className="text-white" strokeWidth={2.5} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl text-[#FAF7F2] mb-4">
                You're All Set, <span className="text-[#ECA241]">{data.name.split(" ")[0]}</span>!
              </h1>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <p className="text-[#F3F1E9]/55 text-lg leading-relaxed mb-3" style={fontBody}>
                We've received your inquiry for a{" "}
                <span className="text-[#ECA241] font-semibold">{SERVICE_NAME_MAP[data.serviceType!]}</span>{" "}
                {isMealPrep ? "plan" : "experience"}.
              </p>
              <p className="text-[#F3F1E9]/35 text-base leading-relaxed mb-10" style={fontBody}>
                {isMealPrep
                  ? "Our chef will review your preferences and reach out within 24 hours to craft your custom meal plan."
                  : "Our chef will review your details and reach out within 24 hours to discuss your vision and craft a custom proposal."
                }
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="space-y-4">
              <Link href="/" className="btn-primary inline-flex items-center gap-2 rounded-lg">
                Return Home
              </Link>
              <div className="flex items-center justify-center gap-6 pt-4">
                <a href="tel:725-212-2236" className="flex items-center gap-2 text-[#F3F1E9]/35 hover:text-[#ECA241] text-sm transition-colors" style={fontBody}>
                  <Phone size={14} /> (725) 212-2236
                </a>
                <a href="mailto:info@thepplschef.com" className="flex items-center gap-2 text-[#F3F1E9]/35 hover:text-[#ECA241] text-sm transition-colors" style={fontBody}>
                  <Mail size={14} /> Email Us
                </a>
              </div>
            </motion.div>
          </motion.div>
        </section>
      </Layout>
    );
  }

  /* ═══════════════════════════════════════════════════════════════
     MAIN WIZARD
     ═══════════════════════════════════════════════════════════════ */
  return (
    <Layout hideStickyCta hideFooter>
      <section className="min-h-screen relative overflow-hidden" style={{ background: "#0F0E0C" }}>

        {/* ─── Cinematic background: food photography with rich overlay ─── */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        {/* Multi-layer overlay for depth and warmth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0E0C]/75 via-[#1A1714]/82 to-[#0F0E0C]/92" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F0E0C]/40 via-transparent to-[#0F0E0C]/40" />
        {/* Warm amber ambient glow from top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-[radial-gradient(ellipse,rgba(212,168,83,0.07)_0%,transparent_65%)] pointer-events-none" />

        <div ref={wizardTopRef} className="relative z-10 container max-w-2xl mx-auto px-5 sm:px-8 pt-28 pb-56 sm:pb-32">

          {/* ─── Header ─── */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10 sm:mb-12"
          >
            <Link href="/" className="inline-block mb-5">
              <img src={LOGO_PRIMARY} alt="The PPL's Chef" className="h-14 sm:h-16 w-auto mx-auto object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]" />
            </Link>
            <div className="flex items-center justify-center gap-3 mb-1">
              <div className="w-10 h-[1px] bg-gradient-to-r from-transparent to-[#D4A853]/35" />
              <span className="brand-label text-[#D4A853]" style={{ fontSize: "0.65rem" }}>
                {isMealPrep ? "Build Your Meal Plan" : "Find Your Chef Experience"}
              </span>
              <div className="w-10 h-[1px] bg-gradient-to-l from-transparent to-[#D4A853]/35" />
            </div>
          </motion.div>

          {/* ─── Progress Stepper ─── */}
          <ProgressStepper step={step} totalSteps={totalSteps} labels={stepLabels} />

          {/* ─── Step Content ─── */}
          <div className="min-h-[380px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`${step}-${isMealPrep ? "mp" : "std"}`}
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: "easeInOut" }}
              >
                {/* Step Title */}
                {!isReviewStep && (
                  <div className="mb-8 sm:mb-10">
                    <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-[1.85rem] text-[#FAF7F2] leading-tight mb-3 drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
                      {getStepTitle()}
                    </h2>
                    <p className="text-[#F3F1E9]/40 text-sm sm:text-[15px] leading-relaxed" style={fontBody}>
                      {getStepSubtitle()}
                    </p>
                  </div>
                )}

                {/* ─── STEP 1: Service Type ─── */}
                {step === 1 && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {SERVICES.map((s) => (
                      <LuxCard
                        key={s.id}
                        selected={data.serviceType === s.id}
                        onClick={() => {
                          update("serviceType", s.id);
                          update("guestCount", ""); update("specialEventType", null);
                          update("budget", ""); update("mpHouseholdSize", "");
                          update("mpGoal", ""); update("mpDietaryNeeds", []);
                          update("mpDeliveryFrequency", ""); update("mpMealsPerWeek", "");
                          update("mpBudget", "");
                        }}
                        icon={s.icon}
                        label={s.label}
                        desc={s.desc}
                      />
                    ))}
                  </div>
                )}

                {/* ════════ MEAL PREP PATH ════════ */}
                {isMealPrep && step === 2 && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {MP_HOUSEHOLD_OPTIONS.map((opt) => (
                      <LuxCard key={opt.label} selected={data.mpHouseholdSize === opt.label}
                        onClick={() => update("mpHouseholdSize", opt.label)} icon={Users} label={opt.label} desc={opt.desc} />
                    ))}
                  </div>
                )}

                {isMealPrep && step === 3 && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {MP_GOAL_OPTIONS.map((opt) => (
                      <LuxCard key={opt.label} selected={data.mpGoal === opt.label}
                        onClick={() => update("mpGoal", opt.label)} icon={opt.icon} label={opt.label} desc={opt.desc} />
                    ))}
                  </div>
                )}

                {isMealPrep && step === 4 && (
                  <div className="flex flex-wrap gap-2.5 sm:gap-3">
                    {DIETARY_OPTIONS.map((opt) => (
                      <DietaryPill key={opt} selected={data.mpDietaryNeeds.includes(opt)}
                        onClick={() => toggleMpDietary(opt)} label={opt} />
                    ))}
                  </div>
                )}

                {isMealPrep && step === 5 && (
                  <div className="grid sm:grid-cols-3 gap-4">
                    {MP_DELIVERY_OPTIONS.map((opt) => (
                      <LuxCard key={opt.label} selected={data.mpDeliveryFrequency === opt.label}
                        onClick={() => update("mpDeliveryFrequency", opt.label)} icon={Truck} label={opt.label} desc={opt.desc} />
                    ))}
                  </div>
                )}

                {isMealPrep && step === 6 && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {MP_MEALS_OPTIONS.map((opt) => (
                      <LuxCard key={opt.label} selected={data.mpMealsPerWeek === opt.label}
                        onClick={() => update("mpMealsPerWeek", opt.label)} icon={UtensilsCrossed} label={opt.label} desc={opt.desc} small />
                    ))}
                  </div>
                )}

                {isMealPrep && step === 7 && (
                  <div className="grid sm:grid-cols-3 gap-4">
                    {MP_BUDGET_OPTIONS.map((opt) => (
                      <LuxCard key={opt.label} selected={data.mpBudget === opt.label}
                        onClick={() => update("mpBudget", opt.label)} icon={DollarSign} label={opt.label} desc={opt.desc} />
                    ))}
                  </div>
                )}

                {/* ════════ STANDARD PATH ════════ */}
                {!isMealPrep && step === 2 && data.serviceType && (
                  <div>
                    {data.serviceType === "special-event" ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {SPECIAL_EVENT_TYPES.map((evt) => (
                          <LuxCard key={evt.id} selected={data.specialEventType === evt.id}
                            onClick={() => update("specialEventType", evt.id)} icon={evt.icon} label={evt.label} />
                        ))}
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-4">
                        {GUEST_OPTIONS[data.serviceType].options.map((opt) => (
                          <LuxCard key={opt} selected={data.guestCount === opt}
                            onClick={() => update("guestCount", opt)} icon={Users} label={opt} small />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {!isMealPrep && step === 3 && (
                  <div className="max-w-sm">
                    <div className="relative">
                      <CalendarDays size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8A898] pointer-events-none" />
                      <input
                        type="date"
                        value={data.eventDate}
                        onChange={(e) => update("eventDate", e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full pl-12 pr-4 py-4 bg-[#FAF7F2] border border-[#E8E0D0]/70 rounded-xl text-[#1A1A1A] focus:border-[#D4A853]/60 focus:shadow-[0_0_0_3px_rgba(212,168,83,0.10)] focus:outline-none transition-all duration-300 text-base shadow-[0_2px_8px_rgba(0,0,0,0.10)] [color-scheme:light]"
                        style={fontBody}
                      />
                    </div>
                    <p className="text-[#F3F1E9]/25 text-xs sm:text-sm mt-3 leading-relaxed" style={fontBody}>
                      Don't have an exact date? Pick an approximate date and we'll work with you.
                    </p>
                  </div>
                )}

                {!isMealPrep && step === 4 && (
                  <div className="flex flex-wrap gap-2.5 sm:gap-3">
                    {DIETARY_OPTIONS.map((opt) => (
                      <DietaryPill key={opt} selected={data.dietaryNeeds.includes(opt)}
                        onClick={() => toggleDietary(opt)} label={opt} />
                    ))}
                  </div>
                )}

                {!isMealPrep && step === 5 && data.serviceType && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {BUDGET_OPTIONS[data.serviceType].map((opt) => (
                      <LuxCard key={opt} selected={data.budget === opt}
                        onClick={() => update("budget", opt)} icon={DollarSign} label={opt} small />
                    ))}
                  </div>
                )}

                {!isMealPrep && step === 6 && (
                  <div>
                    <textarea
                      value={data.vision}
                      onChange={(e) => update("vision", e.target.value)}
                      rows={6}
                      placeholder="Tell us about your dream event — theme ideas, must-have dishes, special requests, anything that will help us create the perfect experience for you..."
                      className="w-full px-5 py-4 bg-[#FAF7F2] border border-[#E8E0D0]/70 rounded-xl text-[#1A1A1A] focus:border-[#D4A853]/60 focus:shadow-[0_0_0_3px_rgba(212,168,83,0.10)] focus:outline-none transition-all duration-300 text-[15px] leading-relaxed resize-none placeholder:text-[#C8BCA8] shadow-[0_2px_8px_rgba(0,0,0,0.10)]"
                      style={fontBody}
                    />
                    <p className="flex items-center gap-2 text-[#F3F1E9]/25 text-xs sm:text-sm mt-3" style={fontBody}>
                      <Sparkles size={12} className="text-[#D4A853]/30" />
                      This is optional — you can skip this step if you prefer.
                    </p>
                  </div>
                )}

                {/* ════════ CONTACT INFO — shared final data step ════════ */}
                {((isMealPrep && step === 8) || (!isMealPrep && step === 7)) && (
                  <div className="space-y-5 sm:space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                      <LuxInput icon={User} label="Full Name" required type="text"
                        value={data.name} onChange={(e) => update("name", e.target.value)} placeholder="Your full name" />
                      <LuxInput icon={Phone} label="Phone" required type="tel"
                        value={data.phone} onChange={(e) => update("phone", e.target.value)} placeholder="(555) 123-4567" />
                    </div>
                    <LuxInput icon={Mail} label="Email" required type="email"
                      value={data.email} onChange={(e) => update("email", e.target.value)} placeholder="your@email.com" />

                    {/* Referral source */}
                    <div>
                      <label className="text-[#8A7A65] text-[11px] tracking-[0.14em] uppercase block mb-2.5 font-semibold" style={fontBody}>
                        How did you hear about us?
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {REFERRAL_OPTIONS.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => update("referralSource", data.referralSource === opt ? "" : opt)}
                            className={`
                              px-4 py-2.5 border rounded-lg text-xs sm:text-sm font-medium transition-all duration-300
                              ${data.referralSource === opt
                                ? "border-[#D4A853]/60 bg-[#FAF7F2] text-[#1A1A1A] shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
                                : "border-[#E8E0D0]/50 bg-[#F0EBE0]/60 text-[#8A7A65] hover:bg-[#FAF7F2] hover:border-[#D4A853]/30 hover:text-[#2C2416] shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
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

                {/* ════════ REVIEW / SUMMARY STEP ════════ */}
                {isReviewStep && (
                  <div>
                    <div className="mb-7 sm:mb-8">
                      <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-[1.85rem] text-[#FAF7F2] leading-tight mb-2 drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
                        {getStepTitle()}
                      </h2>
                      <p className="text-[#F3F1E9]/40 text-sm sm:text-[15px] leading-relaxed" style={fontBody}>
                        {getStepSubtitle()}
                      </p>
                    </div>

                    {/* Summary card — elevated cream surface */}
                    <div className="rounded-2xl bg-[#FAF7F2] border border-[#E8E0D0]/70 shadow-[0_8px_40px_rgba(0,0,0,0.28),0_2px_8px_rgba(0,0,0,0.12)] overflow-hidden">
                      {/* Card header */}
                      <div className="px-6 py-4 border-b border-[#E8E0D0]/60" style={{ background: "linear-gradient(135deg, #F5F0E8 0%, #FAF7F2 100%)" }}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #C49A3A 0%, #ECA241 100%)" }}>
                            <ChefHat size={16} className="text-white" strokeWidth={1.8} />
                          </div>
                          <div>
                            <div className="text-[11px] tracking-[0.13em] uppercase text-[#8A7A65] font-semibold" style={fontBody}>Your Request</div>
                            <div className="text-[15px] font-semibold text-[#1A1A1A]" style={fontBody}>
                              {data.serviceType ? SERVICE_NAME_MAP[data.serviceType] : ""}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Review rows */}
                      <div className="px-6 divide-y divide-[#E8E0D0]/50">
                        {/* Contact */}
                        <ReviewRow label="Name"  value={data.name}  onEdit={() => goToStep(isMealPrep ? 8 : 7)} />
                        <ReviewRow label="Email" value={data.email} onEdit={() => goToStep(isMealPrep ? 8 : 7)} />
                        <ReviewRow label="Phone" value={data.phone} onEdit={() => goToStep(isMealPrep ? 8 : 7)} />

                        {/* Standard path fields */}
                        {!isMealPrep && (
                          <>
                            {data.serviceType === "special-event"
                              ? <ReviewRow label="Event Type"   value={data.specialEventType || ""} onEdit={() => goToStep(2)} />
                              : <ReviewRow label="Guest Count"  value={data.guestCount}             onEdit={() => goToStep(2)} />
                            }
                            <ReviewRow label="Event Date"         value={data.eventDate ? new Date(data.eventDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : ""} onEdit={() => goToStep(3)} />
                            <ReviewRow label="Dietary Needs"      value={data.dietaryNeeds.join(", ")} onEdit={() => goToStep(4)} />
                            <ReviewRow label="Budget"             value={data.budget}                  onEdit={() => goToStep(5)} />
                            {data.vision && <ReviewRow label="Vision / Notes" value={data.vision}     onEdit={() => goToStep(6)} />}
                          </>
                        )}

                        {/* Meal prep path fields */}
                        {isMealPrep && (
                          <>
                            <ReviewRow label="Household Size"     value={data.mpHouseholdSize}           onEdit={() => goToStep(2)} />
                            <ReviewRow label="Goal"               value={data.mpGoal}                    onEdit={() => goToStep(3)} />
                            <ReviewRow label="Dietary Needs"      value={data.mpDietaryNeeds.join(", ")} onEdit={() => goToStep(4)} />
                            <ReviewRow label="Delivery Frequency" value={data.mpDeliveryFrequency}       onEdit={() => goToStep(5)} />
                            <ReviewRow label="Meals per Week"     value={data.mpMealsPerWeek}            onEdit={() => goToStep(6)} />
                            <ReviewRow label="Budget"             value={data.mpBudget}                  onEdit={() => goToStep(7)} />
                          </>
                        )}

                        {data.referralSource && (
                          <ReviewRow label="Heard About Us Via" value={data.referralSource} onEdit={() => goToStep(isMealPrep ? 8 : 7)} />
                        )}
                      </div>

                      {/* Footer note */}
                      <div className="px-6 py-4 border-t border-[#E8E0D0]/60" style={{ background: "#F5F0E8" }}>
                        <p className="text-[13px] text-[#8A7A65] leading-relaxed" style={fontBody}>
                          By submitting, you agree to be contacted by The PPL's Chef within 24 hours to discuss your experience.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

          {/* ─── Navigation Bar ─── */}
          <div
            className="fixed bottom-0 left-0 right-0 z-50 px-5 py-4 border-t border-[#F3F1E9]/[0.07] backdrop-blur-xl flex items-center justify-between sm:static sm:z-auto sm:px-0 sm:py-0 sm:border-t sm:border-[#F3F1E9]/[0.07] sm:mt-12 sm:pt-8 sm:backdrop-blur-none"
            style={{ background: "linear-gradient(180deg, rgba(15,14,12,0.94) 0%, rgba(10,9,8,0.98) 100%)" }}
          >
            {step > 1 ? (
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-2 text-[#F3F1E9]/30 hover:text-[#D4A853] text-sm transition-colors duration-300"
                style={fontBody}
              >
                <ArrowLeft size={16} /> Back
              </button>
            ) : (
              <Link href="/" className="flex items-center gap-2 text-[#F3F1E9]/30 hover:text-[#D4A853] text-sm transition-colors duration-300" style={fontBody}>
                <ArrowLeft size={16} /> Home
              </Link>
            )}

            {!isReviewStep ? (
              <motion.button
                type="button"
                onClick={goNext}
                disabled={!canProceed()}
                whileHover={canProceed() ? { scale: 1.02 } : {}}
                whileTap={canProceed() ? { scale: 0.98 } : {}}
                className={`
                  flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold tracking-wider uppercase transition-all duration-300
                  ${canProceed()
                    ? "text-white shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_28px_rgba(0,0,0,0.4)]"
                    : "bg-[#F3F1E9]/[0.05] text-[#F3F1E9]/12 cursor-not-allowed"
                  }
                `}
                style={canProceed() ? { ...fontBody, background: "linear-gradient(135deg, #C49A3A 0%, #ECA241 60%, #F5A623 100%)" } : fontBody}
              >
                Continue <ArrowRight size={16} />
              </motion.button>
            ) : (
              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                whileHover={!isPending ? { scale: 1.02 } : {}}
                whileTap={!isPending ? { scale: 0.98 } : {}}
                className={`
                  flex items-center gap-2 px-10 py-4 rounded-xl text-sm font-bold tracking-wider uppercase transition-all duration-300
                  ${!isPending
                    ? "text-white shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_28px_rgba(0,0,0,0.4)]"
                    : "bg-[#F3F1E9]/[0.05] text-[#F3F1E9]/12 cursor-not-allowed"
                  }
                `}
                style={!isPending ? { ...fontBody, background: "linear-gradient(135deg, #C49A3A 0%, #ECA241 60%, #F5A623 100%)" } : fontBody}
              >
                {isPending ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Submitting...
                  </>
                ) : (
                  <>Submit Request <ArrowRight size={16} /></>
                )}
              </motion.button>
            )}
          </div>

          {/* ─── Step indicator dots ─── */}
          <div className="flex items-center justify-center gap-2 mt-8 sm:mt-10">
            {Array.from({ length: totalSteps }, (_, i) => (
              <motion.div
                key={i}
                animate={{
                  width: i + 1 === step ? 24 : 6,
                  backgroundColor: i + 1 === step ? "#D4A853" : i + 1 < step ? "rgba(212,168,83,0.35)" : "rgba(243,241,233,0.07)",
                }}
                transition={{ duration: 0.3 }}
                className="h-1.5 rounded-full"
              />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
