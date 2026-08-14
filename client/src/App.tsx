import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { lazy, Suspense } from "react";

// Lazy-load all page components for code splitting
const Home = lazy(() => import("./pages/Home"));
const ServicePage = lazy(() => import("./pages/ServicePage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const BookingWizard = lazy(() => import("./pages/BookingWizard"));
const MealPrepPage = lazy(() => import("./pages/MealPrepPage"));
const MenusPage = lazy(() => import("./pages/MenusPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminPasswordGate = lazy(() => import("./components/AdminPasswordGate"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Minimal loading fallback — matches brand dark background
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#06060A] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#ECA241] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Switch>
        <Route path="/" component={Home} />
        {/* Dedicated pages */}
        <Route path="/about" component={AboutPage} />
        <Route path="/services" component={ServicesPage} />
        <Route path="/menus" component={MenusPage} />
        <Route path="/gallery" component={GalleryPage} />
        <Route path="/faq" component={FAQPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/pricing" component={PricingPage} />
        <Route path="/book" component={BookingWizard} />
        <Route path="/admin-nvz3ufj23jsv">{() => (
          <Suspense fallback={<LoadingFallback />}>
            <AdminPasswordGate><AdminDashboard /></AdminPasswordGate>
          </Suspense>
        )}</Route>
        {/* Service pages with SEO slugs */}
        <Route path="/meal-prep-las-vegas" component={MealPrepPage} />
        <Route path="/:slug">{(params) => {
          const servicePageSlugs = [
            "private-chef-las-vegas",
            "catering-las-vegas",
            "special-events-las-vegas",
            "corporate-catering-las-vegas",
          ];
          if (servicePageSlugs.includes(params.slug)) {
            return <ServicePage />;
          }
          return <NotFound />;
        }}</Route>
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
