import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { Watermark } from "@/components/layout/Watermark";

const AboutPage = lazy(() => import("@/pages/About"));
const AccountAuthPage = lazy(() => import("@/pages/AccountAuth"));
const AccountBookingsPage = lazy(() => import("@/pages/AccountBookings"));
const AccountDashboardPage = lazy(() => import("@/pages/AccountDashboard"));
const AccountProfilePage = lazy(() => import("@/pages/AccountProfile"));
const AdminLoginPage = lazy(() => import("@/pages/AdminLogin"));
const AdminPortalPage = lazy(() => import("@/pages/AdminPortal"));
const BlogDetailPage = lazy(() => import("@/pages/BlogDetail"));
const BlogPage = lazy(() => import("@/pages/Blog"));
const BookingLookupPage = lazy(() => import("@/pages/BookingLookup"));
const ContactPage = lazy(() => import("@/pages/Contact"));
const FAQPage = lazy(() => import("@/pages/FAQ"));
const FleetPage = lazy(() => import("@/pages/Fleet"));
const GalleryPage = lazy(() => import("@/pages/Gallery"));
const HomePage = lazy(() => import("@/pages/Home"));
const LocationsPage = lazy(() => import("@/pages/Locations"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));
const PrivacyPage = lazy(() => import("@/pages/Privacy"));
const RatesPage = lazy(() => import("@/pages/Rates"));
const ServicesPage = lazy(() => import("@/pages/Services"));
const ServiceDetailPage = lazy(() => import("@/pages/ServiceDetail"));
const TermsPage = lazy(() => import("@/pages/Terms"));
const VehicleDetailPage = lazy(() => import("@/pages/VehicleDetail"));
const BookingConfirmation = lazy(() => import("@/pages/booking/BookingConfirmation"));
const BookingWizard = lazy(() => import("@/pages/booking/BookingWizard"));

function AppRoutes() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const showPublicShell = !isAdmin;

  return (
    <>
      <ScrollToTop />
      {showPublicShell && <Navbar />}
      <main className={showPublicShell ? "min-h-screen" : ""}>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/fleet" element={<FleetPage />} />
            <Route path="/fleet/:slug" element={<VehicleDetailPage />} />
            <Route path="/pricing" element={<RatesPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/book/confirmation/:ref" element={<LegacyConfirmationRedirect />} />
            <Route path="/book/*" element={<BookingWizard />} />
            <Route path="/booking/confirmation/:ref" element={<BookingConfirmation />} />
            <Route path="/booking/lookup" element={<BookingLookupPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:slug" element={<ServiceDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/account/login" element={<AccountAuthPage />} />
            <Route path="/account/dashboard" element={<AccountDashboardPage />} />
            <Route path="/account/bookings" element={<AccountBookingsPage />} />
            <Route path="/account/profile" element={<AccountProfilePage />} />
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route path="/admin/*" element={<AdminPortalPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      {showPublicShell && <Footer />}
      <Watermark />
      <Toaster position="top-right" />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

function LegacyConfirmationRedirect() {
  const { ref } = useParams();
  return <Navigate to={`/booking/confirmation/${ref ?? ""}`} replace />;
}

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-[var(--color-gray-100)] px-4 pt-28">
      <div className="rounded-[28px] border border-[var(--color-gray-200)] bg-white px-6 py-5 text-sm font-medium text-[var(--color-gray-600)] shadow-[0_18px_60px_rgba(10,22,40,0.06)]">
        Loading interface...
      </div>
    </div>
  );
}
