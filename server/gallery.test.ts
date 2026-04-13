import { describe, expect, it } from "vitest";

/**
 * Gallery Page — Data & Logic Tests
 *
 * These tests verify the gallery data model, category filtering logic,
 * and image metadata integrity without rendering React components.
 */

// Re-create the gallery data types and filtering logic from GalleryPage.tsx
type GalleryCategory = "All" | "Private Dining" | "Meal Prep" | "The Process";

interface GalleryItem {
  src: string;
  title: string;
  description: string;
  category: Exclude<GalleryCategory, "All">;
  bookingService: string;
}

const categories: GalleryCategory[] = ["All", "Private Dining", "Meal Prep", "The Process"];

const categoryDescriptions: Record<GalleryCategory, string> = {
  All: "A curated collection of dishes, experiences, and moments crafted by The PPL's Chef.",
  "Private Dining":
    "Elegant plated experiences, intimate tablescapes, and refined service — designed for unforgettable evenings.",
  "Meal Prep":
    "Clean, organized, abundant, and practical luxury — chef-crafted meals ready for your week.",
  "The Process":
    "Behind the scenes — the craft, the prep, the finishing touches that make every plate extraordinary.",
};

// Simulated gallery items (subset matching the real data structure)
const testGalleryItems: GalleryItem[] = [
  {
    src: "https://example.com/lobster.jpg",
    title: "Whole Roasted Lobster",
    description: "Butter-poached lobster with arugula, feta, and citrus vinaigrette.",
    category: "Private Dining",
    bookingService: "private-chef",
  },
  {
    src: "https://example.com/ribs.jpg",
    title: "Braised Short Ribs",
    description: "Slow-braised short ribs with creamy mashed potatoes and roasted carrots.",
    category: "Private Dining",
    bookingService: "private-chef",
  },
  {
    src: "https://example.com/mealprep.jpg",
    title: "Weekly Meal Prep",
    description: "Chef-prepared containers — balanced, beautiful, and ready for the week.",
    category: "Meal Prep",
    bookingService: "meal-prep",
  },
  {
    src: "https://example.com/salmon.jpg",
    title: "Glazed Salmon Bowl",
    description: "Honey-glazed salmon with sesame rice and seasonal vegetables.",
    category: "Meal Prep",
    bookingService: "meal-prep",
  },
  {
    src: "https://example.com/corn.jpg",
    title: "Brushing the Corn",
    description: "Chef Stephen finishing corn on the cob with herb butter — hands-on craft.",
    category: "The Process",
    bookingService: "private-chef",
  },
  {
    src: "https://example.com/plating.jpg",
    title: "Plating in Your Kitchen",
    description: "Precision plating of lobster dishes in a private home kitchen.",
    category: "The Process",
    bookingService: "private-chef",
  },
];

// Filtering logic (mirrors GalleryPage.tsx)
function filterGallery(items: GalleryItem[], category: GalleryCategory): GalleryItem[] {
  if (category === "All") return items;
  return items.filter((g) => g.category === category);
}

describe("Gallery Data Model", () => {
  it("has exactly four categories including All", () => {
    expect(categories).toHaveLength(4);
    expect(categories).toContain("All");
    expect(categories).toContain("Private Dining");
    expect(categories).toContain("Meal Prep");
    expect(categories).toContain("The Process");
  });

  it("has a description for every category", () => {
    for (const cat of categories) {
      expect(categoryDescriptions[cat]).toBeDefined();
      expect(categoryDescriptions[cat].length).toBeGreaterThan(10);
    }
  });

  it("every gallery item has required fields", () => {
    for (const item of testGalleryItems) {
      expect(item.src).toBeTruthy();
      expect(item.title).toBeTruthy();
      expect(item.description).toBeTruthy();
      expect(item.category).toBeTruthy();
      expect(item.bookingService).toBeTruthy();
      // Category must be a valid non-All category
      expect(["Private Dining", "Meal Prep", "The Process"]).toContain(item.category);
    }
  });

  it("every gallery item has a valid booking service slug", () => {
    const validSlugs = ["private-chef", "catering", "meal-prep", "special-events", "corporate"];
    for (const item of testGalleryItems) {
      expect(validSlugs).toContain(item.bookingService);
    }
  });
});

describe("Gallery Filtering", () => {
  it("returns all items when category is All", () => {
    const result = filterGallery(testGalleryItems, "All");
    expect(result).toHaveLength(testGalleryItems.length);
  });

  it("filters Private Dining items correctly", () => {
    const result = filterGallery(testGalleryItems, "Private Dining");
    expect(result.length).toBeGreaterThan(0);
    for (const item of result) {
      expect(item.category).toBe("Private Dining");
    }
  });

  it("filters Meal Prep items correctly", () => {
    const result = filterGallery(testGalleryItems, "Meal Prep");
    expect(result.length).toBeGreaterThan(0);
    for (const item of result) {
      expect(item.category).toBe("Meal Prep");
    }
  });

  it("filters The Process items correctly", () => {
    const result = filterGallery(testGalleryItems, "The Process");
    expect(result.length).toBeGreaterThan(0);
    for (const item of result) {
      expect(item.category).toBe("The Process");
    }
  });

  it("filtered counts add up to total", () => {
    const privateDining = filterGallery(testGalleryItems, "Private Dining").length;
    const mealPrep = filterGallery(testGalleryItems, "Meal Prep").length;
    const theProcess = filterGallery(testGalleryItems, "The Process").length;
    expect(privateDining + mealPrep + theProcess).toBe(testGalleryItems.length);
  });

  it("returns empty array for category with no items", () => {
    const emptyItems: GalleryItem[] = [];
    const result = filterGallery(emptyItems, "Private Dining");
    expect(result).toHaveLength(0);
  });
});

describe("Gallery Booking CTA", () => {
  it("generates correct booking URL for each item", () => {
    for (const item of testGalleryItems) {
      const url = `/book?service=${item.bookingService}`;
      expect(url).toMatch(/^\/book\?service=[\w-]+$/);
    }
  });

  it("Private Dining items link to private-chef booking", () => {
    const privateDining = filterGallery(testGalleryItems, "Private Dining");
    for (const item of privateDining) {
      expect(item.bookingService).toBe("private-chef");
    }
  });

  it("Meal Prep items link to meal-prep booking", () => {
    const mealPrep = filterGallery(testGalleryItems, "Meal Prep");
    for (const item of mealPrep) {
      expect(item.bookingService).toBe("meal-prep");
    }
  });
});

describe("Gallery Height Classes", () => {
  // Mirrors the getHeightClass function from GalleryPage.tsx
  function getHeightClass(index: number): string {
    const heights = [
      "aspect-[3/4]",
      "aspect-[4/5]",
      "aspect-square",
      "aspect-[4/5]",
      "aspect-[3/4]",
      "aspect-[5/6]",
      "aspect-[4/5]",
      "aspect-[3/4]",
    ];
    return heights[index % heights.length];
  }

  it("cycles through height classes based on index", () => {
    expect(getHeightClass(0)).toBe("aspect-[3/4]");
    expect(getHeightClass(1)).toBe("aspect-[4/5]");
    expect(getHeightClass(2)).toBe("aspect-square");
  });

  it("wraps around after exhausting the array", () => {
    expect(getHeightClass(8)).toBe(getHeightClass(0));
    expect(getHeightClass(9)).toBe(getHeightClass(1));
  });

  it("always returns a valid aspect ratio class", () => {
    for (let i = 0; i < 20; i++) {
      const cls = getHeightClass(i);
      expect(cls).toMatch(/^aspect-/);
    }
  });
});
