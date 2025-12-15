import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { RequireAdmin } from "@/components/auth/RequireAdmin";
import { RootLayout } from "@/components/layout/RootLayout";
import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import InstrumentsPage from "./pages/Instruments";
import InstrumentDetailPage from "./pages/InstrumentDetail";
import ServicesPage from "./pages/Services";
import ServiceDetailPage from "./pages/ServiceDetail";
import ComponentsPage from './pages/Components'
import ComponentDetailPage from './pages/ComponentDetail'
import ComponentsListPage from './pages/admin/ComponentsList'
import ComponentFormPage from './pages/admin/ComponentForm'

import FacilitiesPage from "./pages/Facilities";
import FacilityDetailPage from "./pages/FacilityDetail";
import LeaderDetailPage from "./pages/LeaderDetailPage";
import PricingPage from "./pages/Pricing";
import ContactPage from "./pages/Contact";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./components/admin/AdminLayout";
import InstrumentsListPage from "./pages/admin/InstrumentsList";
import InstrumentFormPage from "./pages/admin/InstrumentForm";
import PricesListPage from "./pages/admin/PricesList";
import PriceFormPage from "./pages/admin/PriceForm";
import AnnouncementsListPage from "./pages/admin/AnnouncementsList";
import AnnouncementFormPage from "./pages/admin/AnnouncementForm";
import InfoBlocksListPage from "./pages/admin/InfoBlocksList";
import InfoBlockFormPage from "./pages/admin/InfoBlockForm";
import EnquiriesListPage from "./pages/admin/EnquiriesList";
import DepartmentsListPage from "./pages/admin/DepartmentsList";
import DepartmentFormPage from "./pages/admin/DepartmentForm";
import ConsultancyPage from "./pages/Consultancy";
import DepartmentDetailPage from "./pages/DepartmentDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AdminAuthProvider>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/instruments" element={<InstrumentsPage />} />
              <Route path="/instruments/:id" element={<InstrumentDetailPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:id" element={<ServiceDetailPage />} />
              <Route path="/facilities" element={<FacilitiesPage />} />
              <Route path="/facilities/:id" element={<FacilityDetailPage />} />
              <Route path="/leadership/:id" element={<LeaderDetailPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/consultancy" element={<ConsultancyPage />} />
              <Route path="/departments/:slug" element={<DepartmentDetailPage />} />
              <Route path="/components" element={<ComponentsPage />} />
              <Route path="/components/:slug" element={<ComponentDetailPage />} />
            </Route>
            <Route path="/auth" element={<Auth />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
              <Route index element={<AdminDashboard />} />
              <Route path="instruments" element={<InstrumentsListPage />} />
              <Route path="instruments/:id" element={<InstrumentFormPage />} />
              <Route path="instruments/new" element={<InstrumentFormPage />} />
              <Route path="prices" element={<PricesListPage />} />
              <Route path="prices/new" element={<PriceFormPage />} />
              <Route path="prices/:id" element={<PriceFormPage />} />
              <Route path="announcements" element={<AnnouncementsListPage />} />
              <Route path="announcements/new" element={<AnnouncementFormPage />} />
              <Route path="announcements/:id" element={<AnnouncementFormPage />} />
              <Route path="info-blocks" element={<InfoBlocksListPage />} />
              <Route path="info-blocks/new" element={<InfoBlockFormPage />} />
              <Route path="info-blocks/:key" element={<InfoBlockFormPage />} />
              <Route path="enquiries" element={<EnquiriesListPage />} />
              <Route path="departments" element={<DepartmentsListPage />} />
              <Route path="departments/new" element={<DepartmentFormPage />} />
              <Route path="departments/:slug" element={<DepartmentFormPage />} />
              <Route path="components" element={<ComponentsListPage />} />
              <Route path="components/new" element={<ComponentFormPage />} />
              <Route path="components/:id" element={<ComponentFormPage />} />
              <Route path="settings" element={<div />} />
            </Route>
            {/* Catch-all - must be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AdminAuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

