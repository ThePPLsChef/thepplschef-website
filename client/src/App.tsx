import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ServicePage from "./pages/ServicePage";
import BookingWizard from "./pages/BookingWizard";
import MealPrepPage from "./pages/MealPrepPage";
import MenusPage from "./pages/MenusPage";
import AboutPage from "./pages/AboutPage";
import GalleryPage from "./pages/GalleryPage";
import FAQPage from "./pages/FAQPage";
import ContactPage from "./pages/ContactPage";
import PricingPage from "./pages/PricingPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPasswordGate from "./components/AdminPasswordGate";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      {/* Dedicated pages */}
      <Route path="/about" component={AboutPage} />
      <Route path="/menus" component={MenusPage} />
      <Route path="/gallery" component={GalleryPage} />
      <Route path="/faq" component={FAQPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/book" component={BookingWizard} />
      <Route path="/admin">{() => <AdminPasswordGate><AdminDashboard /></AdminPasswordGate>}</Route>
      {/* Service pages with SEO slugs */}
      <Route path="/meal-prep-las-vegas" component={MealPrepPage} />
      <Route path="/:slug">{(params) => {
        // Handle service page slugs at top level
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
