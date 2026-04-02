/**
 * CDN Image Constants — The PPL's Chef
 * All images served from CloudFront CDN.
 * Organized by category for easy reference across pages.
 */

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ";

// Brand
export const LOGO = `${CDN}/photo_AQAD2gtrG-WvaEZ-_2eac18e2.jpg`;

// Generated hero/feature images
export const HERO_BG = `${CDN}/hero-bg-XjpAAtRn8oMGwPsg6kzbmK.webp`;
export const ABOUT_CHEF = `${CDN}/about-chef-QVjiLWLps5DMyMxX7uAGJz.webp`;
export const GEN_PRIVATE = `${CDN}/services-private-TzcXY4W8pCFoiekAcqNa5M.webp`;
export const GEN_CORPORATE = `${CDN}/services-corporate-aKhbmwwfW9YkL5HLY6hDhV.webp`;
export const GEN_OUTDOOR = `${CDN}/services-outdoor-KvnaGeukpyF2Qwdef5sKdT.webp`;
export const GEN_PRIVATE_DINING = `${CDN}/private-dining-hero-HqMz6f5TpssaMBGyw9ythB.webp`;
export const GEN_MEAL_BOX = `${CDN}/meal-box-hero-jZegVfXTA3AJsmBZUgLuwS.webp`;
export const GEN_SPECIAL_EVENTS = `${CDN}/special-events-hero-WUQPQBmjP2AZDfBv6W8UHm.webp`;

// Real event photos — original batch
export const SEAFOOD_BOWLS = `${CDN}/photo_AQAD5QtrG-WvaEZ-_6f944946.jpg`;
export const PLATED_SALAD = `${CDN}/photo_AQAD5gtrG-WvaEZ-_0434f69d.jpg`;
export const SALAD_LINE = `${CDN}/photo_AQAD5wtrG-WvaEZ-_6f0837a6.jpg`;
export const OUTDOOR_COOKING = `${CDN}/photo_AQAD6AtrG-WvaEZ-_b91f04f8.jpg`;
export const CHEF_PLATING = `${CDN}/photo_AQAD6QtrG-WvaEZ-_fd290b00.jpg`;
export const ELEGANT_TABLE = `${CDN}/photo_AQAD6gtrG-WvaEZ-_90370ee0.jpg`;
export const PREP_TABLE = `${CDN}/photo_AQAD6wtrG-WvaEZ-_c236d98d.jpg`;
export const GRILLED_ROMAINE = `${CDN}/photo_AQAD7AtrG-WvaEZ-_a9f936ea.jpg`;
export const CHEF_OUTDOOR = `${CDN}/photo_AQAD7QtrG-WvaEZ-_6eac566c.jpg`;
export const GREEN_BEANS = `${CDN}/photo_AQAD7gtrG-WvaEZ-_d509ab84.jpg`;
export const MEAT_CHAFER = `${CDN}/photo_AQAD7wtrG-WvaEZ-_456232e8.jpg`;
export const OUTDOOR_PARTY = `${CDN}/photo_AQAD8AtrG-WvaEZ-_4ea0cc45.jpg`;
export const MASHED_POTATOES = `${CDN}/photo_AQAD8QtrG-WvaEZ-_7b9f1552.jpg`;
export const DESSERT_TABLE = `${CDN}/photo_AQAD8gtrG-WvaEZ-_aea8950c.jpg`;
export const DESSERT_OVERHEAD = `${CDN}/photo_AQAD8wtrG-WvaEZ-_af31db2b.jpg`;
export const CARVING_STATION = `${CDN}/photo_AQAD9AtrG-WvaEZ-_a36b8ed2.jpg`;
export const BUFFET_SERVICE = `${CDN}/photo_AQAD9QtrG-WvaEZ-_ee856e38.jpg`;

// ── NEW PHOTOS (batch 2) ──────────────────────────────────────────────────────

// Chef personal photos — use prominently in About section & Private Chef page
export const CHEF_PORTRAIT_1 = `${CDN}/1000006463_cba05171.jpg`;   // Chef photo 1
export const CHEF_PORTRAIT_2 = `${CDN}/1000006465_1e454661.jpg`;   // Chef photo 2

// New food & event photos
export const EVENT_SPREAD_2020 = `${CDN}/20200830_113203_b9c9d0e1.jpg`;   // Early event spread
export const EVENT_2025_APR   = `${CDN}/20250423_195811_d1d56ed5.jpg`;    // April 2025 event
export const EVENT_2025_SEP   = `${CDN}/20250926_120104_19d1e661.jpg`;    // Sept 2025 event
export const EVENT_2025_OCT   = `${CDN}/20251022_143618_7380c0ce.jpg`;    // Oct 2025 event
export const NEW_FOOD_1       = `${CDN}/1000007155_845a52b2.jpg`;          // New food photo
export const NEW_FOOD_2       = `${CDN}/1000007144_99cd73e5.jpg`;          // New food photo
export const NEW_EVENT_1      = `${CDN}/1000006918_cb89449a.jpg`;          // New event photo
export const NEW_EVENT_2      = `${CDN}/1000006916_da4038d0.jpg`;          // New event photo
export const NEW_EVENT_3      = `${CDN}/1000006910_bdea7a20.jpg`;          // New event photo
export const NEW_EVENT_4      = `${CDN}/1000006914_f99c87e7.jpg`;          // New event photo
export const NEW_EVENT_5      = `${CDN}/1000006917_b4d8f3cc.jpg`;          // New event photo
export const NEW_EVENT_6      = `${CDN}/1000006524_d9b753a5.jpg`;          // New event photo

// Gallery collection — all real photos (original 16 + 12 new food/event photos)
export const GALLERY_IMAGES = [
  // New batch first for freshness
  { src: NEW_EVENT_1,      alt: "Elegant catered event spread" },
  { src: EVENT_2025_OCT,   alt: "October 2025 catering event" },
  { src: NEW_FOOD_1,       alt: "Chef-crafted dish presentation" },
  { src: NEW_EVENT_2,      alt: "Premium catering service" },
  { src: EVENT_2025_APR,   alt: "April 2025 private event" },
  { src: NEW_FOOD_2,       alt: "Artisan food plating" },
  { src: NEW_EVENT_3,      alt: "Full-service catering setup" },
  { src: EVENT_2025_SEP,   alt: "September 2025 celebration" },
  { src: NEW_EVENT_4,      alt: "Catering spread with premium dishes" },
  { src: NEW_EVENT_5,      alt: "Event dining experience" },
  { src: EVENT_SPREAD_2020, alt: "Early catering event spread" },
  { src: NEW_EVENT_6,      alt: "Chef-driven catering event" },
  // Original batch
  { src: SEAFOOD_BOWLS,    alt: "Gourmet seafood bowls with fresh ingredients" },
  { src: ELEGANT_TABLE,    alt: "Elegant table setting for a private dinner event" },
  { src: PLATED_SALAD,     alt: "Beautifully plated salad course" },
  { src: OUTDOOR_PARTY,    alt: "Outdoor celebration with festive decor" },
  { src: GRILLED_ROMAINE,  alt: "Grilled romaine with artisan toppings" },
  { src: CARVING_STATION,  alt: "Live carving station at a catered event" },
  { src: PREP_TABLE,       alt: "Fresh ingredients on the prep table" },
  { src: MEAT_CHAFER,      alt: "Premium meat dish in a chafer" },
  { src: DESSERT_OVERHEAD, alt: "Overhead view of a curated dessert table" },
  { src: SALAD_LINE,       alt: "Fresh salad buffet line" },
  { src: OUTDOOR_COOKING,  alt: "Outdoor cooking setup" },
  { src: BUFFET_SERVICE,   alt: "Full buffet service spread" },
  { src: GREEN_BEANS,      alt: "Seasoned green beans in a chafer" },
  { src: MASHED_POTATOES,  alt: "Creamy mashed potatoes" },
  { src: DESSERT_TABLE,    alt: "Elegant dessert table display" },
  { src: CHEF_PLATING,     alt: "Chef plating a dish with precision" },
];
