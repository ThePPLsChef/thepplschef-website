import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ServicePage from "./pages/ServicePage";
import BookingPage from "./pages/BookingPage";
import MealPrepPage from "./pages/MealPrepPage";
import MenusPage from "./pages/MenusPage";
import AboutPage from "./pages/AboutPage";
import GalleryPage from "./pages/GalleryPage";
import FAQPage from "./pages/FAQPage";
import ContactPage from "./pages/ContactPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      {/* Dedicated pages */}
      <Route path="/about" component={AboutPage} />
      <Route path="/menus" component={MenusPage} />
      <Route path="/gallery" component={GalleryPage} />
      <Route path="/faq" component={FAQPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/book" component={BookingPage} />
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
