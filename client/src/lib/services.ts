/**
 * Service data — The PPL's Chef
 * Defines all 5 service categories with content for dedicated pages.
 * SEO-friendly slugs for Las Vegas market.
 */
import {
  GEN_MEAL_BOX, GEN_CORPORATE,
  CHEF_PLATING, GRILLED_ROMAINE, PLATED_SALAD,
  BUFFET_SERVICE, CARVING_STATION, MEAT_CHAFER,
  SALAD_LINE, PREP_TABLE, SEAFOOD_BOWLS,
  DESSERT_TABLE, OUTDOOR_PARTY, ELEGANT_TABLE,
  GREEN_BEANS, MASHED_POTATOES, DESSERT_OVERHEAD,
  CHEF_PORTRAIT_1, CHEF_PORTRAIT_2,
  EVENT_2025_OCT, EVENT_2025_APR, EVENT_2025_SEP, EVENT_SPREAD_2020,
  NEW_FOOD_1, NEW_FOOD_2,
  NEW_EVENT_1, NEW_EVENT_2, NEW_EVENT_3, NEW_EVENT_4, NEW_EVENT_5, NEW_EVENT_6,
  CHEF_REAL_PORTRAIT_1, CHEF_REAL_PORTRAIT_2,
  BEET_SALAD_SIDE, BEET_SALAD_OVERHEAD, BEET_SALAD_CLOSE,
  DEVILED_EGGS_1, DEVILED_EGGS_2,
  PASTRY_TURNOVER, SHRIMP_CREAM_SAUCE, GLAZED_RIBS, CAST_IRON_DISH,
  MEAL_PREP_OVERHEAD_MULTI,
  MEAL_PREP_GRILLED_CHICKEN,
  MEAL_PREP_GLAZED_SALMON,
  MEAL_PREP_SHRIMP_FAJITA,
  MEAL_PREP_CHICKEN_FAJITA,
  MEAL_PREP_TAMALES,
  MEAL_PREP_4BOX_SPREAD,
} from "./images";

export interface ServiceData {
  slug: string;
  title: string;
  tagline: string;
  heroImage: string;
  overview: string;
  included: string[];
  bestFor: string[];
  sampleEvents: string[];
  galleryImages: { src: string; alt: string }[];
  metaTitle: string;
  metaDescription: string;
}

export const services: ServiceData[] = [
  {
    slug: "private-chef-las-vegas",
    title: "Private Chef Experience",
    tagline: "Fine dining, delivered to your doorstep.",
    heroImage: CHEF_REAL_PORTRAIT_2,
    overview: "Transform your home into a five-star restaurant. Our Private Chef Experience brings a dedicated chef to your space, where they'll prepare a multi-course meal crafted exclusively for you and your guests. From ingredient sourcing to plating and cleanup, we handle every detail — you simply enjoy the evening.",
    included: [
      "Personal consultation and custom menu design",
      "Fresh, premium ingredient sourcing",
      "Full kitchen setup at your location",
      "Multi-course meal preparation and plating",
      "Professional table service",
      "Complete kitchen cleanup"
    ],
    bestFor: [
      "Intimate dinner parties (2–20 guests)",
      "Date nights and anniversaries",
      "Family gatherings and holiday meals",
      "Wine pairing dinners",
      "Proposal and celebration dinners"
    ],
    sampleEvents: [
      "4-Course Anniversary Dinner for Two",
      "Holiday Family Feast for 12",
      "Wine & Dine Tasting Experience",
      "Brunch Party for 8"
    ],
    galleryImages: [
      { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/1000009782_5e250fdb.jpg", alt: "Whole roasted lobster with arugula and feta — signature private chef dish" },
      { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/1000009779_dba1ce09.jpg", alt: "White celebration cake with fresh strawberries and gold candles" },
      { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/1000009757_cbeaad6b.jpg", alt: "Braised short ribs with creamy mashed potatoes and roasted carrots" },
      { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/1000009778_dd995839.jpg", alt: "Chef Stephen Austin brushing corn on the cob — branded action shot" },
      { src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/1000009777_38884111.jpg", alt: "Elegant private dining table setup with white roses and candles" },
    ],
    metaTitle: "Private Chef Experience | The PPL's Chef | Las Vegas",
    metaDescription: "Hire a private chef in Las Vegas for an unforgettable in-home dining experience. Custom menus, premium ingredients, and full service. Book today."
  },
  {
    slug: "catering-las-vegas",
    title: "Full-Service Catering",
    tagline: "Elevated catering for events of every scale.",
    heroImage: NEW_EVENT_1,
    overview: "Whether you're hosting 30 guests or 300, our full-service catering delivers restaurant-quality food with seamless execution. We offer buffet-style, family-style, and plated service options — each customized to your event's theme, dietary requirements, and budget. Our team manages everything from setup to breakdown.",
    included: [
      "Custom menu planning and tastings",
      "Buffet, plated, or family-style service options",
      "Professional service staff",
      "Equipment, linens, and setup",
      "Dietary accommodation (vegan, gluten-free, halal, etc.)",
      "Full event breakdown and cleanup"
    ],
    bestFor: [
      "Weddings and receptions",
      "Large parties and celebrations",
      "Community events and fundraisers",
      "Holiday parties",
      "Graduation celebrations"
    ],
    sampleEvents: [
      "200-Guest Wedding Reception Buffet",
      "Backyard BBQ for 75",
      "Elegant Plated Dinner for 50",
      "Holiday Office Party for 100"
    ],
    galleryImages: [
      { src: NEW_EVENT_2, alt: "Premium catering service spread" },
      { src: CARVING_STATION, alt: "Live carving station" },
      { src: BUFFET_SERVICE, alt: "Full buffet spread" },
      { src: MEAT_CHAFER, alt: "Premium meat service" },
    ],
    metaTitle: "Catering Services | The PPL's Chef | Las Vegas",
    metaDescription: "Full-service catering in Las Vegas for weddings, parties, and large events. Custom menus, professional staff, and restaurant-quality food. Get a quote."
  },
  {
    slug: "meal-prep-las-vegas",
    title: "Chef-Crafted Meal Boxes",
    tagline: "Restaurant-quality meals, ready when you are.",
    heroImage: MEAL_PREP_OVERHEAD_MULTI,
    overview: "Enjoy chef-crafted meals without the event. Our Meal Box service delivers freshly prepared, restaurant-quality dishes straight to your door. Perfect for busy professionals, health-conscious families, or anyone who wants to eat exceptionally well without the hassle of cooking. Each box is prepared with the same care and quality as our catered events.",
    included: [
      "Weekly or one-time meal box options",
      "Custom menu based on dietary preferences",
      "Fresh, locally sourced ingredients",
      "Individual or family-sized portions",
      "Reheating instructions included",
      "Contactless delivery available"
    ],
    bestFor: [
      "Busy professionals and entrepreneurs",
      "Families seeking healthy, home-style meals",
      "Post-surgery or recovery meal plans",
      "Fitness and nutrition-focused individuals",
      "Gifts for loved ones"
    ],
    sampleEvents: [
      "Weekly Meal Prep (5 meals)",
      "Family Dinner Box (serves 4)",
      "Post-Op Recovery Meal Plan",
      "Date Night Dinner Box for Two"
    ],
    galleryImages: [
      { src: MEAL_PREP_4BOX_SPREAD, alt: "Chef-crafted meal prep — 4-box overhead spread of grilled protein meals" },
      { src: MEAL_PREP_GLAZED_SALMON, alt: "Glazed salmon with sesame rice and roasted vegetables" },
      { src: MEAL_PREP_GRILLED_CHICKEN, alt: "Grilled chicken with fresh lime and seasoned green beans" },
      { src: MEAL_PREP_SHRIMP_FAJITA, alt: "Shrimp fajita bowl with cilantro rice and warm tortilla" },
      { src: MEAL_PREP_CHICKEN_FAJITA, alt: "Grilled chicken fajita bowl with peppers and rice" },
      { src: MEAL_PREP_TAMALES, alt: "House-made tamales with elote corn salad" },
      { src: MEAL_PREP_OVERHEAD_MULTI, alt: "Weekly meal prep — overhead view of tamale, salmon, and chicken containers" },
    ],
    metaTitle: "Meal Boxes & Meal Prep | The PPL's Chef | Las Vegas",
    metaDescription: "Chef-crafted meal boxes delivered in Las Vegas. Fresh, healthy, restaurant-quality meals for busy professionals and families. Order your meal box today."
  },
  {
    slug: "special-events-las-vegas",
    title: "Special Events & Celebrations",
    tagline: "Make your milestone unforgettable.",
    heroImage: EVENT_2025_OCT,
    overview: "Birthdays, engagements, baby showers, retirements — whatever you're celebrating, we'll make it extraordinary. Our Special Events service combines custom menus with creative presentation to turn your celebration into a culinary experience your guests will remember. We work closely with you to design every detail.",
    included: [
      "Event consultation and theme coordination",
      "Custom celebration menu design",
      "Dessert tables and specialty stations",
      "Themed presentation and decor coordination",
      "Professional service staff",
      "Full setup and cleanup"
    ],
    bestFor: [
      "Birthday parties and milestone celebrations",
      "Baby showers and gender reveals",
      "Engagement parties and bridal showers",
      "Retirement celebrations",
      "Graduation parties"
    ],
    sampleEvents: [
      "50th Birthday Dinner Party for 40",
      "Baby Shower Brunch for 25",
      "Engagement Celebration for 60",
      "Sweet 16 Dessert & Dinner Experience"
    ],
    galleryImages: [
      { src: EVENT_2025_APR, alt: "April 2025 celebration event" },
      { src: DESSERT_TABLE, alt: "Elegant dessert display" },
      { src: OUTDOOR_PARTY, alt: "Outdoor celebration" },
      { src: ELEGANT_TABLE, alt: "Elegant table setting" },
    ],
    metaTitle: "Special Event Catering | The PPL's Chef | Las Vegas",
    metaDescription: "Special event catering in Las Vegas for birthdays, showers, engagements, and celebrations. Custom menus, dessert tables, and full-service hospitality."
  },
  {
    slug: "corporate-catering-las-vegas",
    title: "Corporate & Group Dining",
    tagline: "Impress your team. Elevate your brand.",
    heroImage: NEW_EVENT_3,
    overview: "From executive lunches to company-wide celebrations, our Corporate Dining service brings premium food and professional service to your business events. We understand that corporate events reflect your brand — that's why we deliver an experience that's polished, punctual, and impressive. Custom menus, dietary accommodations, and seamless logistics included.",
    included: [
      "Corporate menu planning and tastings",
      "Breakfast, lunch, or dinner service",
      "Boxed lunch and working lunch options",
      "Dietary accommodation for all guests",
      "Professional, uniformed service staff",
      "On-time delivery and setup guarantee"
    ],
    bestFor: [
      "Board meetings and executive lunches",
      "Team building events and retreats",
      "Product launches and client dinners",
      "Company holiday parties",
      "Conference and seminar catering"
    ],
    sampleEvents: [
      "Executive Board Lunch for 15",
      "Company Holiday Party for 200",
      "Client Appreciation Dinner for 30",
      "All-Day Conference Catering for 100"
    ],
    galleryImages: [
      { src: NEW_EVENT_4, alt: "Corporate catering spread" },
      { src: GLAZED_RIBS, alt: "Glazed ribs — signature dish" },
      { src: MASHED_POTATOES, alt: "Creamy mashed potatoes" },
      { src: CARVING_STATION, alt: "Carving station" },
    ],
    metaTitle: "Corporate Catering | The PPL's Chef | Las Vegas",
    metaDescription: "Premium corporate catering in Las Vegas for meetings, conferences, team events, and client dinners. Professional service, custom menus, and on-time delivery."
  },
];

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return services.find((s) => s.slug === slug);
}
