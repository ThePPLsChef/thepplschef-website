/**
 * seo.tsx — Reusable JSON-LD structured data helpers
 * Injects <script type="application/ld+json"> tags into the document head
 * using a React component that uses useEffect for client-side injection.
 */
import { useEffect } from "react";

/* ─── Generic JSON-LD injector ─── */
export function JsonLd({ id, data }: { id: string; data: object }) {
  useEffect(() => {
    // Remove any existing script with this id to avoid duplicates
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, [id, data]);

  return null;
}

/* ─── LocalBusiness schema ─── */
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  "name": "The PPL's Chef",
  "alternateName": "The PPL's Chef Las Vegas",
  "url": "https://thepplschef.com",
  "logo": "https://thepplschef.com/logo.png",
  "image": "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/FPcGgsvuUJ9d3gUJtCTgVQ/1000009782_5e250fdb.jpg",
  "description": "Las Vegas's premier private chef and catering service. Restaurant-quality dining experiences for private events, corporate functions, special celebrations, and weekly meal prep.",
  "telephone": "+17252122236",
  "email": "info@thepplschef.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Las Vegas",
    "addressRegion": "NV",
    "postalCode": "89101",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 36.1699,
    "longitude": -115.1398
  },
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": 36.1699,
      "longitude": -115.1398
    },
    "geoRadius": "80000"
  },
  "priceRange": "$$-$$$$",
  "servesCuisine": ["American", "Seafood", "Contemporary", "Southern"],
  "sameAs": [
    "https://www.instagram.com/thepplschef",
    "https://www.tiktok.com/@thepplschef",
    "https://www.facebook.com/thepplschef"
  ],
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "opens": "09:00",
    "closes": "21:00"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Chef Services",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Private Chef Experience" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Full-Service Catering" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Weekly Meal Prep" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Special Event Catering" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Corporate Dining" } }
    ]
  }
};

/* ─── Person schema (Chef Stephen Austin) ─── */
export const chefPersonSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Stephen Austin",
  "jobTitle": "Executive Chef & Founder",
  "worksFor": {
    "@type": "Organization",
    "name": "The PPL's Chef"
  },
  "description": "Chef Stephen Austin is the founder of The PPL's Chef, a Las Vegas-based private chef and catering company. With 25+ years of culinary experience and training from the College of Southern Nevada, Chef Stephen brings restaurant-quality dining to private homes and events throughout the Las Vegas Valley.",
  "url": "https://thepplschef.com/about",
  "image": "https://d2xsxph8kpxj0f.cloudfront.net/310519663502251693/chef-portrait.jpg",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Las Vegas",
    "addressRegion": "NV",
    "addressCountry": "US"
  },
  "alumniOf": {
    "@type": "CollegeOrUniversity",
    "name": "College of Southern Nevada"
  },
  "knowsAbout": ["Private Chef Services", "Catering", "Seafood", "Contemporary American Cuisine", "Meal Preparation", "Event Catering"]
};

/* ─── Service schema factory ─── */
export function createServiceSchema(params: {
  name: string;
  description: string;
  url: string;
  priceRange?: string;
  serviceType?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": params.name,
    "description": params.description,
    "url": params.url,
    "provider": {
      "@type": "LocalBusiness",
      "name": "The PPL's Chef",
      "telephone": "+17252122236",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Las Vegas",
        "addressRegion": "NV",
        "addressCountry": "US"
      }
    },
    "areaServed": {
      "@type": "City",
      "name": "Las Vegas"
    },
    "serviceType": params.serviceType || params.name,
    ...(params.priceRange ? { "offers": { "@type": "Offer", "priceSpecification": { "@type": "PriceSpecification", "description": params.priceRange } } } : {})
  };
}

/* ─── FAQ schema factory ─── */
export function createFaqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}
