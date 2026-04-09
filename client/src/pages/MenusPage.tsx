/**
 * MenusPage — Sample menus for The PPL's Chef
 * 3 menus: Intimate Dinner (4-course), Celebration Catering (buffet/family), Weekly Meal Prep
 * BRAND: Abril Fatface headings, DM Sans body, Cormorant Garamond serif accents.
 * Colors: Black #000, Cream #F3F1E9, Red #D82E2B, Gold #ECA241.
 */
import { useRef, useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChefHat, Users, UtensilsCrossed } from "lucide-react";
import Layout from "@/components/Layout";
import Pricing from "@/components/Pricing";
import { LOGO_PRIMARY, HERO_BG } from "@/lib/images";

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

interface MenuItem {
  name: string;
  description: string;
}

interface MenuCourse {
  course: string;
  items: MenuItem[];
}

interface MenuData {
  id: string;
  icon: typeof ChefHat;
  title: string;
  subtitle: string;
  description: string;
  courses: MenuCourse[];
  note: string;
}

const menus: MenuData[] = [
  {
    id: "intimate",
    icon: ChefHat,
    title: "Intimate Dinner Menu",
    subtitle: "4-Course Private Chef Experience",
    description: "A curated four-course dining experience designed for intimate gatherings of 2–12 guests. Each course is prepared tableside by your personal chef using premium, locally sourced ingredients.",
    courses: [
      {
        course: "First Course — Amuse-Bouche",
        items: [
          { name: "Deviled Eggs with Tobiko & Chive Oil", description: "Elevated classic with Japanese flying fish roe and herb-infused oil" },
          { name: "Seared Ahi Tuna Bites", description: "Sesame-crusted, served on crispy wonton with wasabi aioli and pickled ginger" },
        ],
      },
      {
        course: "Second Course — Salad",
        items: [
          { name: "Roasted Beet & Citrus Salad", description: "Golden and red beets, whipped goat cheese, arugula, candied pecans, champagne vinaigrette" },
          { name: "Grilled Romaine Caesar", description: "Charred romaine hearts, house-made Caesar dressing, shaved Parmigiano, garlic croutons" },
        ],
      },
      {
        course: "Third Course — Entrée",
        items: [
          { name: "Pan-Seared Chilean Sea Bass", description: "Lemon beurre blanc, roasted fingerling potatoes, broccolini, micro herbs" },
          { name: "Herb-Crusted Rack of Lamb", description: "Dijon-herb crust, rosemary demi-glace, truffle mashed potatoes, grilled asparagus" },
          { name: "Jumbo Shrimp in House Cream Sauce", description: "Garlic-herb cream, angel hair pasta, sun-dried tomatoes, fresh basil" },
        ],
      },
      {
        course: "Fourth Course — Dessert",
        items: [
          { name: "Molten Chocolate Lava Cake", description: "Dark chocolate center, vanilla bean ice cream, raspberry coulis" },
          { name: "Crème Brûlée", description: "Classic vanilla custard with caramelized sugar crust, fresh berries" },
        ],
      },
    ],
    note: "Menu can be fully customized to dietary preferences and allergies. Wine pairing available upon request. Starting at $125 per person.",
  },
  {
    id: "celebration",
    icon: Users,
    title: "Celebration Catering Menu",
    subtitle: "Buffet & Family-Style Service",
    description: "Perfect for birthdays, graduations, holidays, and large gatherings of 25–200+ guests. Choose from buffet stations or elegant family-style platters served to each table.",
    courses: [
      {
        course: "Appetizer Station",
        items: [
          { name: "Charcuterie & Cheese Display", description: "Artisan cheeses, cured meats, seasonal fruits, honeycomb, crackers" },
          { name: "Shrimp Cocktail Tower", description: "Jumbo shrimp, house cocktail sauce, lemon wedges" },
          { name: "Bruschetta Trio", description: "Classic tomato-basil, whipped ricotta & honey, roasted pepper & olive tapenade" },
        ],
      },
      {
        course: "Main Stations",
        items: [
          { name: "Live Carving Station", description: "Slow-roasted prime rib with au jus and horseradish cream, or herb-roasted turkey" },
          { name: "Southern Comfort Station", description: "BBQ glazed ribs, mac & cheese, collard greens, cornbread" },
          { name: "Pasta Station", description: "Penne with vodka sauce, garlic bread, Caesar salad" },
        ],
      },
      {
        course: "Sides & Salads",
        items: [
          { name: "Truffle Mashed Potatoes", description: "Yukon gold, cream, truffle oil, chives" },
          { name: "Roasted Seasonal Vegetables", description: "Broccolini, carrots, bell peppers, herb butter" },
          { name: "Mixed Green Salad", description: "Baby greens, cherry tomatoes, cucumber, balsamic vinaigrette" },
        ],
      },
      {
        course: "Dessert Table",
        items: [
          { name: "Assorted Mini Pastries", description: "Éclairs, fruit tarts, chocolate truffles, macarons" },
          { name: "Custom Celebration Cake", description: "Flavor and design customized to your event theme" },
        ],
      },
    ],
    note: "Includes professional service staff, setup, and cleanup. Dietary accommodations available. Starting at $55 per person for buffet, $75 per person for plated service.",
  },
  {
    id: "mealprep",
    icon: UtensilsCrossed,
    title: "Weekly Meal Prep Menu",
    subtitle: "Protein + Sides — Your Choice",
    description: "Chef-crafted meals designed around your lifestyle. Choose your protein, select your flavor profile, and we deliver fresh, balanced meals ready to enjoy. Available as 5, 10, 15, or 20-meal plans.",
    courses: [
      {
        course: "Mexican-Inspired",
        items: [
          { name: "Grilled Chicken Fajita Bowl", description: "Seasoned chicken, peppers, onions, cilantro lime rice, pico de gallo, warm tortilla" },
          { name: "Shrimp Fajita Bowl", description: "Blackened shrimp, cilantro rice, black beans, roasted corn, chipotle crema" },
          { name: "House-Made Pork Tamales", description: "Slow-braised pork, fresh corn relish, elote salad, crema" },
        ],
      },
      {
        course: "American Classics",
        items: [
          { name: "Herb-Grilled Chicken", description: "Lemon-herb chicken breast, garlic green beans, roasted sweet potato" },
          { name: "Cajun Shrimp & Rice", description: "Blackened shrimp, vegetable fried rice, sautéed zucchini" },
          { name: "BBQ Glazed Salmon", description: "Sweet & smoky glaze, wild rice, roasted broccoli" },
        ],
      },
      {
        course: "Asian-Inspired",
        items: [
          { name: "Teriyaki Salmon Bowl", description: "Glazed salmon, sesame jasmine rice, edamame, pickled cucumber" },
          { name: "Ginger-Garlic Chicken Stir Fry", description: "Chicken, snap peas, bell peppers, brown rice, sesame" },
          { name: "Thai Basil Shrimp", description: "Shrimp, Thai basil, chili, jasmine rice, bok choy" },
        ],
      },
      {
        course: "Italian-Inspired",
        items: [
          { name: "Italian Herb Chicken", description: "Chicken breast, roasted vegetables, balsamic glaze, orzo pasta" },
          { name: "Garlic Butter Salmon", description: "Lemon-garlic butter, asparagus, parmesan risotto" },
          { name: "Pesto Chicken & Quinoa", description: "Basil pesto, sun-dried tomatoes, spinach, quinoa" },
        ],
      },
    ],
    note: "Available as weekly subscription or one-time order. Choose Regular or High Protein portions. Delivery included within the Las Vegas Valley. 5 meals starting at $75.",
  },
];

const tabs = menus.map((m) => ({ id: m.id, label: m.title, icon: m.icon }));

export default function MenusPage() {
  const [activeTab, setActiveTab] = useState("intimate");
  const activeMenu = menus.find((m) => m.id === activeTab)!;

  useEffect(() => {
    document.title = "Sample Menus | The PPL's Chef | Las Vegas Private Chef";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Browse sample menus from The PPL's Chef — Las Vegas private chef. Intimate dinners, celebration catering, and weekly meal prep menus by Chef Stephen Austin.");
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HERO_BG})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />

        <div className="relative z-10 container pb-14 pt-32">
          <Link href="/" className="inline-flex items-center gap-2 text-[#ECA241]/60 hover:text-[#ECA241] text-xs tracking-widest uppercase mb-6 transition-colors" style={fontBody}>
            <ChevronLeft size={14} /> Home
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-[#ECA241]" />
              <span className="brand-label">Sample Menus</span>
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-6xl text-[#F3F1E9] leading-tight mb-3">
              Our <span className="text-[#ECA241]">Menus</span>
            </h1>
            <p className="text-[#F3F1E9]/55 text-lg max-w-xl" style={fontBody}>
              Every menu is fully customizable. These are starting points to inspire your perfect dining experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="section-dark border-b border-white/5">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-2 py-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-6 py-3 text-[11px] font-semibold tracking-[0.15em] uppercase transition-all duration-300 border ${
                    isActive
                      ? "bg-[#D82E2B] border-[#D82E2B] text-white"
                      : "bg-transparent border-white/10 text-[#F3F1E9]/50 hover:border-[#ECA241]/40 hover:text-[#ECA241]"
                  }`}
                  style={fontBody}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Active Menu Content */}
      <section className="section-cream py-20 lg:py-28">
        <div className="container max-w-4xl">
          <FadeIn key={activeMenu.id}>
            {/* Menu Header */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-[1px] bg-[#D82E2B]" />
                <span className="brand-label text-[#D82E2B]">{activeMenu.subtitle}</span>
                <div className="w-8 h-[1px] bg-[#D82E2B]" />
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl text-black leading-tight mb-6">
                {activeMenu.title}
              </h2>
              <p className="text-black/55 text-base lg:text-lg max-w-2xl mx-auto leading-relaxed" style={fontSerif}>
                {activeMenu.description}
              </p>
            </div>

            {/* Menu Courses */}
            <div className="space-y-12">
              {activeMenu.courses.map((course, ci) => (
                <motion.div
                  key={course.course}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: ci * 0.1 }}
                >
                  {/* Course Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-[#D82E2B] flex items-center justify-center shrink-0">
                      <span className="text-white text-sm font-bold" style={fontBody}>{ci + 1}</span>
                    </div>
                    <h3 className="font-[family-name:var(--font-display)] text-xl lg:text-2xl text-black">
                      {course.course}
                    </h3>
                    <div className="flex-1 h-[1px] bg-[#D82E2B]/15" />
                  </div>

                  {/* Items */}
                  <div className="space-y-5 pl-14">
                    {course.items.map((item, ii) => (
                      <div key={ii} className="group">
                        <div className="flex items-baseline gap-3">
                          <h4 className="font-[family-name:var(--font-display)] text-base lg:text-lg text-black group-hover:text-[#D82E2B] transition-colors">
                            {item.name}
                          </h4>
                          <div className="flex-1 border-b border-dotted border-black/10 mb-1" />
                        </div>
                        <p className="text-black/45 text-sm mt-1 leading-relaxed" style={fontSerif}>
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Note */}
            <div className="mt-14 border-l-2 border-[#ECA241] pl-6 py-2">
              <p className="text-black/50 text-sm leading-relaxed italic" style={fontSerif}>
                {activeMenu.note}
              </p>
            </div>

            {/* CTA */}
            <div className="mt-14 text-center">
              <img src={LOGO_PRIMARY} alt="The PPL's Chef" className="h-20 w-auto object-contain mx-auto mb-5 drop-shadow-lg" />
              <p className="text-black/50 text-sm mb-6" style={fontBody}>
                All menus are fully customizable. Let us design the perfect menu for your event.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/contact" className="btn-primary">Book Your Experience</Link>
                <a href="tel:725-212-2236" className="btn-outline-dark">Call 725-212-2236</a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Pricing Section */}
      <Pricing />
    </Layout>
  );
}
