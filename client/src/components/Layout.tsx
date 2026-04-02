/**
 * Layout — Shared wrapper for all pages.
 * Includes Navbar, Footer, and sticky mobile CTA.
 */
import { ReactNode, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useLocation } from "wouter";

export default function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);

  const scrollToBooking = () => {
    if (location === "/") {
      const el = document.querySelector("#contact");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/book";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <button
          onClick={scrollToBooking}
          className="w-full py-4 bg-[#D82E2B] text-white text-sm font-semibold tracking-widest uppercase font-[family-name:var(--font-body)] shadow-[0_-4px_20px_rgba(0,0,0,0.3)]"
        >
          Book Your Experience
        </button>
      </div>
    </div>
  );
}
