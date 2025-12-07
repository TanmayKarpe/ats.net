import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RootLayout } from "@/components/layout/RootLayout";
import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import InstrumentsPage from "./pages/Instruments";
import InstrumentDetailPage from "./pages/InstrumentDetail";
import ServicesPage from "./pages/Services";
import FacilitiesPage from "./pages/Facilities";
import PricingPage from "./pages/Pricing";
import ContactPage from "./pages/Contact";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/instruments" element={<InstrumentsPage />} />
            <Route path="/instruments/:id" element={<InstrumentDetailPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/facilities" element={<FacilitiesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>
          <Route path="/auth" element={<Auth />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
