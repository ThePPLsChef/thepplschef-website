/**
 * BookingWizard — Multi-step "Find Your Chef Experience" wizard
 * 7 steps with service-specific branching, large clickable cards,
 * progress bar, smooth transitions, dark luxury aesthetic.
 */
import { useState, useCallback } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChefHat, Users, Utensils, PartyPopper, Building2,
  CalendarDays, Leaf, DollarSign, MessageSquare, User,
  ArrowLeft, ArrowRight, Check, Sparkles, Phone, Mail,
  Instagram, Facebook, Heart, Star, Cake, Gift, TreePine, Gem, HelpCircle
} from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { LOGO_PRIMARY } from "@/lib/images";
import { submitInquiry } from "@/lib/submitInquiry";

/* ─── Types ─── */
type ServiceType = "private-chef" | "catering" | "meal-prep" | "special-event" | "corporate";
type SpecialEventType = "Birthday" | "Anniversary" | "Holiday" | "Proposal" | "Other";

interface WizardData {
  serviceType: ServiceType | null;
  guestCount: string;
  specialEventType: SpecialEventType | null;
  eventDate: string;
  dietaryNeeds: string[];
  budget: string;
  vision: string;
  name: string;
  email: string;
  phone: string;
  referralSource: string;
}

const initialData: WizardData = {
  serviceType: null,
  guestCount: "",
  specialEventType: null,
  eventDate: "",
  dietaryNeeds: [],
  budget: "",
  vision: "",
  name: "",
  email: "",
  phone: "",
  referralSource: "",
};

/* ─── Service config ─── */
const SERVICES: { id: ServiceType; label: string; icon: typeof ChefHat; desc: string }[] = [
  { id: "private-chef", label: "Private Chef", icon: ChefHat, desc: "Intimate, chef-driven dining in your home" },
  { id: "catering", label: "Catering Event", icon: Utensils, desc: "Full-service catering for events of every scale" },
  { id: "meal-prep", label: "Weekly Meal Prep", icon: Leaf, desc: "Chef-crafted meals delivered fresh to your door" },
  { id: "special-event", label: "Special Event", icon: PartyPopper, desc: "Unforgettable celebrations with bespoke menus" },
  { id: "corporate", label: "Corporate Dining", icon: Building2, desc: "Elevate your business events with premium dining" },
];

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
    options: ["1-2 people", "3-4 people", "5-6 people", "7+ people"],
  },
  "special-event": {
    label: "What type of special event?",
    options: [], // handled separately
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

const REFERRAL_OPTIONS = ["Instagram", "TikTok", "Google", "Referral", "Facebook", "Other"];

const SERVICE_NAME_MAP: Record<ServiceType, string> = {
  "private-chef": "Private Chef",
  "catering": "Catering",
  "meal-prep": "Meal Prep",
  "special-event": "Special Events",
  "corporate": "Corporate Dining",
};

const TOTAL_STEPS = 7;

/* ─── Animation variants ─── */
const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

/* ─── Reusable Card Button ─── */
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
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative group text-left w-full rounded-sm border transition-all duration-300
        ${small ? "p-4" : "p-6"}
        ${selected
          ? "border-[#ECA241] bg-[#ECA241]/10 shadow-[0_0_20px_rgba(236,162,65,0.15)]"
          : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
        }
      `}
    >
      {/* Selection indicator */}
      <div className={`
        absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300
        ${selected ? "border-[#ECA241] bg-[#ECA241]" : "border-white/20"}
      `}>
        {selected && <Check size={12} className="text-black" strokeWidth={3} />}
      </div>

      {Icon && (
        <div className={`
          w-12 h-12 flex items-center justify-center rounded-sm mb-4 transition-all duration-300
          ${selected ? "bg-[#ECA241]/20 text-[#ECA241]" : "bg-white/5 text-white/40 group-hover:text-white/60"}
        `}>
          <Icon size={24} />
        </div>
      )}
      <div className={`font-semibold ${selected ? "text-[#ECA241]" : "text-[#F3F1E9]"} ${small ? "text-sm" : "text-base"}`}
        style={{ fontFamily: "var(--font-body)" }}>
        {label}
      </div>
      {desc && (
        <div className="text-white/35 text-xs mt-1.5 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
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
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`
        relative px-5 py-3.5 rounded-sm border text-sm font-medium transition-all duration-300
        ${selected
          ? "border-[#ECA241] bg-[#ECA241]/10 text-[#ECA241]"
          : "border-white/10 bg-white/[0.02] text-[#F3F1E9]/60 hover:border-white/20 hover:text-[#F3F1E9]/80"
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
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<WizardData>(initialData);
  const [isPending, setIsPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fontBody = { fontFamily: "var(--font-body)" };

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

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };
  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 1: return data.serviceType !== null;
      case 2:
        if (data.serviceType === "special-event") return data.specialEventType !== null;
        return data.guestCount !== "";
      case 3: return data.eventDate !== "";
      case 4: return data.dietaryNeeds.length > 0;
      case 5: return data.budget !== "";
      case 6: return true; // optional
      case 7: return data.name.trim() !== "" && data.email.trim() !== "" && data.email.includes("@") && data.phone.trim() !== "";
      default: return false;
    }
  };

  const handleSubmit = async () => {
    if (!data.serviceType) return;
    setIsPending(true);

    const serviceLabel = SERVICE_NAME_MAP[data.serviceType];
    const specialEventNote = data.specialEventType ? `Event type: ${data.specialEventType}` : "";
    const referralNote = data.referralSource ? `Heard about us via: ${data.referralSource}` : "";
    const combinedNotes = [data.vision, specialEventNote, referralNote].filter(Boolean).join("\n");

    try {
      await submitInquiry({
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim() || undefined,
        serviceType: serviceLabel,
        eventDate: data.eventDate || undefined,
        guestCount: data.guestCount || undefined,
        budget: data.budget || undefined,
        foodPreferences: data.dietaryNeeds.join(", ") || undefined,
        notes: combinedNotes || undefined,
      });
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again or call us at (725) 212-2236.");
    } finally {
      setIsPending(false);
    }
  };

  /* ─── Step titles ─── */
  const stepTitles = [
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

  const stepSubtitles = [
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

  /* ─── Success Screen ─── */
  if (submitted) {
    return (
      <Layout>
        <section className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
          {/* Subtle radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(236,162,65,0.08)_0%,transparent_70%)]" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 max-w-lg mx-auto px-6 text-center"
          >
            {/* Animated check circle */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-gradient-to-br from-[#ECA241] to-[#D4922A] rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(236,162,65,0.3)]"
            >
              <Check size={40} className="text-black" strokeWidth={3} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl text-[#F3F1E9] mb-4">
                You're All Set, <span className="text-[#ECA241]">{data.name.split(" ")[0]}</span>!
              </h1>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <p className="text-[#F3F1E9]/55 text-lg leading-relaxed mb-3" style={fontBody}>
                We've received your inquiry for a{" "}
                <span className="text-[#ECA241] font-semibold">
                  {SERVICE_NAME_MAP[data.serviceType!]}
                </span>{" "}
                experience.
              </p>
              <p className="text-[#F3F1E9]/40 text-base leading-relaxed mb-10" style={fontBody}>
                Our chef will review your details and reach out within <strong className="text-[#F3F1E9]/60">24 hours</strong> to discuss your vision and craft a custom proposal.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="space-y-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-10 py-4 bg-[#ECA241] text-black font-semibold tracking-wider uppercase text-sm hover:bg-[#f0b050] transition-all duration-300 shadow-lg shadow-[#ECA241]/20"
                style={fontBody}
              >
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
    <Layout>
      <section className="min-h-screen bg-black relative overflow-hidden">
        {/* Subtle background texture */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(236,162,65,0.04)_0%,transparent_50%)]" />

        <div className="relative z-10 container max-w-3xl mx-auto px-4 pt-28 pb-20">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <Link href="/" className="inline-block mb-6">
              <img src={LOGO_PRIMARY} alt="The PPL's Chef" className="h-14 w-auto mx-auto object-contain" />
            </Link>
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-6 h-[1px] bg-[#ECA241]/50" />
              <span className="text-[#ECA241]/60 text-[10px] tracking-[0.25em] uppercase font-medium" style={fontBody}>
                Find Your Chef Experience
              </span>
              <div className="w-6 h-[1px] bg-[#ECA241]/50" />
            </div>
          </motion.div>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#F3F1E9]/30 text-xs tracking-wider uppercase" style={fontBody}>
                Step {step} of {TOTAL_STEPS}
              </span>
              <span className="text-[#ECA241]/50 text-xs" style={fontBody}>
                {Math.round((step / TOTAL_STEPS) * 100)}%
              </span>
            </div>
            <div className="h-[2px] bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#ECA241] to-[#D82E2B]"
                initial={{ width: 0 }}
                animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="min-h-[420px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                {/* Step Title */}
                <div className="mb-8">
                  <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl text-[#F3F1E9] leading-tight mb-2">
                    {stepTitles[step - 1]}
                  </h2>
                  <p className="text-[#F3F1E9]/35 text-sm" style={fontBody}>
                    {stepSubtitles[step - 1]}
                  </p>
                </div>

                {/* ─── STEP 1: Service Type ─── */}
                {step === 1 && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {SERVICES.map((s) => (
                      <SelectionCard
                        key={s.id}
                        selected={data.serviceType === s.id}
                        onClick={() => {
                          update("serviceType", s.id);
                          // Reset dependent fields when service changes
                          update("guestCount", "");
                          update("specialEventType", null);
                          update("budget", "");
                        }}
                        icon={s.icon}
                        label={s.label}
                        desc={s.desc}
                      />
                    ))}
                  </div>
                )}

                {/* ─── STEP 2: Guest Count / Event Type ─── */}
                {step === 2 && data.serviceType && (
                  <div>
                    {data.serviceType === "special-event" ? (
                      <div className="grid sm:grid-cols-3 gap-4">
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
                      <div className="grid sm:grid-cols-2 gap-4">
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

                {/* ─── STEP 3: Date ─── */}
                {step === 3 && (
                  <div className="max-w-sm">
                    <div className="relative">
                      <CalendarDays size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ECA241]/50 pointer-events-none" />
                      <input
                        type="date"
                        value={data.eventDate}
                        onChange={(e) => update("eventDate", e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 text-[#F3F1E9] focus:border-[#ECA241] focus:outline-none transition-colors text-base rounded-sm appearance-none [color-scheme:dark]"
                        style={fontBody}
                      />
                    </div>
                    <p className="text-white/25 text-xs mt-3" style={fontBody}>
                      Don't have an exact date? Pick an approximate date and we'll work with you.
                    </p>
                  </div>
                )}

                {/* ─── STEP 4: Dietary Needs ─── */}
                {step === 4 && (
                  <div className="flex flex-wrap gap-3">
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

                {/* ─── STEP 5: Budget ─── */}
                {step === 5 && data.serviceType && (
                  <div className="grid sm:grid-cols-2 gap-4">
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

                {/* ─── STEP 6: Vision ─── */}
                {step === 6 && (
                  <div>
                    <div className="relative">
                      <textarea
                        value={data.vision}
                        onChange={(e) => update("vision", e.target.value)}
                        rows={6}
                        placeholder="Tell us about your dream event — theme ideas, must-have dishes, special requests, anything that will help us create the perfect experience for you..."
                        className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 text-[#F3F1E9] focus:border-[#ECA241] focus:outline-none transition-colors text-sm leading-relaxed rounded-sm resize-none placeholder:text-white/15"
                        style={fontBody}
                      />
                    </div>
                    <p className="text-white/25 text-xs mt-3 flex items-center gap-1.5" style={fontBody}>
                      <Sparkles size={12} className="text-[#ECA241]/40" />
                      This is optional — you can skip this step if you prefer.
                    </p>
                  </div>
                )}

                {/* ─── STEP 7: Contact Info ─── */}
                {step === 7 && (
                  <div className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[#F3F1E9]/40 text-[10px] tracking-wider uppercase block mb-2" style={fontBody}>
                          Full Name *
                        </label>
                        <div className="relative">
                          <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ECA241]/40 pointer-events-none" />
                          <input
                            type="text"
                            required
                            value={data.name}
                            onChange={(e) => update("name", e.target.value)}
                            placeholder="Your full name"
                            className="w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border border-white/10 text-[#F3F1E9] focus:border-[#ECA241] focus:outline-none transition-colors text-sm rounded-sm placeholder:text-white/15"
                            style={fontBody}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[#F3F1E9]/40 text-[10px] tracking-wider uppercase block mb-2" style={fontBody}>
                          Phone *
                        </label>
                        <div className="relative">
                          <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ECA241]/40 pointer-events-none" />
                          <input
                            type="tel"
                            required
                            value={data.phone}
                            onChange={(e) => update("phone", e.target.value)}
                            placeholder="(555) 123-4567"
                            className="w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border border-white/10 text-[#F3F1E9] focus:border-[#ECA241] focus:outline-none transition-colors text-sm rounded-sm placeholder:text-white/15"
                            style={fontBody}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-[#F3F1E9]/40 text-[10px] tracking-wider uppercase block mb-2" style={fontBody}>
                        Email *
                      </label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ECA241]/40 pointer-events-none" />
                        <input
                          type="email"
                          required
                          value={data.email}
                          onChange={(e) => update("email", e.target.value)}
                          placeholder="your@email.com"
                          className="w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border border-white/10 text-[#F3F1E9] focus:border-[#ECA241] focus:outline-none transition-colors text-sm rounded-sm placeholder:text-white/15"
                          style={fontBody}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[#F3F1E9]/40 text-[10px] tracking-wider uppercase block mb-2" style={fontBody}>
                        How did you hear about us?
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {REFERRAL_OPTIONS.map((opt) => (
                          <motion.button
                            key={opt}
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => update("referralSource", data.referralSource === opt ? "" : opt)}
                            className={`
                              px-4 py-2 rounded-sm border text-xs font-medium transition-all duration-300
                              ${data.referralSource === opt
                                ? "border-[#ECA241] bg-[#ECA241]/10 text-[#ECA241]"
                                : "border-white/10 text-[#F3F1E9]/40 hover:border-white/20 hover:text-[#F3F1E9]/60"
                              }
                            `}
                            style={fontBody}
                          >
                            {opt}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-8 border-t border-white/5">
            {step > 1 ? (
              <motion.button
                type="button"
                onClick={goBack}
                whileHover={{ x: -3 }}
                className="flex items-center gap-2 text-[#F3F1E9]/40 hover:text-[#F3F1E9]/70 text-sm transition-colors"
                style={fontBody}
              >
                <ArrowLeft size={16} /> Back
              </motion.button>
            ) : (
              <Link href="/" className="flex items-center gap-2 text-[#F3F1E9]/40 hover:text-[#F3F1E9]/70 text-sm transition-colors" style={fontBody}>
                <ArrowLeft size={16} /> Home
              </Link>
            )}

            {step < TOTAL_STEPS ? (
              <motion.button
                type="button"
                onClick={goNext}
                disabled={!canProceed()}
                whileHover={canProceed() ? { x: 3 } : {}}
                className={`
                  flex items-center gap-2 px-8 py-3.5 text-sm font-semibold tracking-wider uppercase transition-all duration-300
                  ${canProceed()
                    ? "bg-[#ECA241] text-black hover:bg-[#f0b050] shadow-lg shadow-[#ECA241]/20"
                    : "bg-white/5 text-white/20 cursor-not-allowed"
                  }
                `}
                style={fontBody}
              >
                Continue <ArrowRight size={16} />
              </motion.button>
            ) : (
              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={!canProceed() || isPending}
                whileHover={canProceed() && !isPending ? { scale: 1.02 } : {}}
                className={`
                  flex items-center gap-2 px-10 py-4 text-sm font-bold tracking-wider uppercase transition-all duration-300
                  ${canProceed() && !isPending
                    ? "bg-gradient-to-r from-[#D82E2B] to-[#ECA241] text-white hover:shadow-lg hover:shadow-[#D82E2B]/30"
                    : "bg-white/5 text-white/20 cursor-not-allowed"
                  }
                `}
                style={fontBody}
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
                  <>
                    Submit Inquiry <Sparkles size={16} />
                  </>
                )}
              </motion.button>
            )}
          </div>

          {/* Step indicators (dots) */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div
                key={i}
                className={`
                  w-2 h-2 rounded-full transition-all duration-300
                  ${i + 1 === step ? "bg-[#ECA241] w-6" : i + 1 < step ? "bg-[#ECA241]/40" : "bg-white/10"}
                `}
              />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
