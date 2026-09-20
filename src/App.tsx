import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import Layout from './components/layout/Layout'
const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'))
const AboutPage = lazy(() => import('./pages/common/AboutPage'))
const ContactPage = lazy(() => import('./pages/common/ContactPage'))
const HomePage = lazy(() => import('./pages/common/HomePage'))
const NotFoundPage = lazy(() => import('./pages/common/NotFoundPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/common/PrivacyPolicyPage'))
const ServicesPage = lazy(() => import('./pages/common/ServicesPage'))
const TermsOfUsePage = lazy(() => import('./pages/common/TermsOfUsePage'))
const BookSlotPage = lazy(() => import('./pages/farmer/BookSlotPage'))
const BookingSuccessPage = lazy(() => import('./pages/farmer/BookingSuccessPage'))
const FarmerDashboardPage = lazy(() => import('./pages/farmer/FarmerDashboardPage'))
const MyBookingsPage = lazy(() => import('./pages/farmer/MyBookingsPage'))
const MyVehiclesPage = lazy(() => import('./pages/farmer/MyVehiclesPage'))
const AssistedBookingPage = lazy(() => import('./pages/mandiOperator/AssistedBookingPage'))
const MandiOperatorDashboardPage = lazy(() => import('./pages/mandiOperator/MandiOperatorDashboardPage'))
const ProcurementPage = lazy(() => import('./pages/mandiOperator/ProcurementPage'))
const QRVerificationPage = lazy(() => import('./pages/mandiOperator/QRVerificationPage'))
const MandiOperatorQueueManagementPage = lazy(() => import('./pages/mandiOperator/QueueManagementPage'))
const WalkInBookingPage = lazy(() => import('./pages/mandiOperator/WalkInBookingPage'))
const BookingsPage = lazy(() => import('./pages/mandiOwner/BookingsPage'))
const MandiOwnerDashboardPage = lazy(() => import('./pages/mandiOwner/MandiOwnerDashboardPage'))
const QueueManagementPage = lazy(() => import('./pages/mandiOwner/QueueManagementPage'))
const ReportsPage = lazy(() => import('./pages/mandiOwner/ReportsPage'))
const SlotManagementPage = lazy(() => import('./pages/mandiOwner/SlotManagementPage'))
const AuditLogsPage = lazy(() => import('./pages/superAdmin/AuditLogsPage'))
const ManageMandisPage = lazy(() => import('./pages/superAdmin/ManageMandisPage'))
const ManageOwnersPage = lazy(() => import('./pages/superAdmin/ManageOwnersPage'))
const PlatformAnalyticsPage = lazy(() => import('./pages/superAdmin/PlatformAnalyticsPage'))
const SuperAdminDashboardPage = lazy(() => import('./pages/superAdmin/SuperAdminDashboardPage'))
const SystemSettingsPage = lazy(() => import('./pages/superAdmin/SystemSettingsPage'))
import { AuthProvider } from './store/authStore'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <Routes>
          <Route path="/" element={<Layout isHomePage={true}><HomePage /></Layout>} />
          <Route path="/about" element={<Layout isHomePage={false}><AboutPage /></Layout>} />
          <Route path="/services" element={<Layout isHomePage={false}><ServicesPage /></Layout>} />
          <Route path="/contact" element={<Layout isHomePage={false}><ContactPage /></Layout>} />
          <Route path="/login" element={<Layout isHomePage={false}><LoginPage /></Layout>} />
          <Route path="/register" element={<Layout isHomePage={false}><RegisterPage /></Layout>} />
          <Route path="/farmer/dashboard" element={<Layout isHomePage={false}><FarmerDashboardPage /></Layout>} />
          <Route path="/farmer/vehicles" element={<Layout isHomePage={false}><MyVehiclesPage /></Layout>} />
          <Route path="/farmer/book-slot" element={<Layout isHomePage={false}><BookSlotPage /></Layout>} />
          <Route path="/farmer/booking-success" element={<Layout isHomePage={false}><BookingSuccessPage /></Layout>} />
          <Route path="/farmer/bookings" element={<Layout isHomePage={false}><MyBookingsPage /></Layout>} />
          <Route path="/mandi-owner/dashboard" element={<Layout isHomePage={false}><MandiOwnerDashboardPage /></Layout>} />
          <Route path="/mandi-owner/slots" element={<Layout isHomePage={false}><SlotManagementPage /></Layout>} />
          <Route path="/mandi-owner/queue" element={<Layout isHomePage={false}><QueueManagementPage /></Layout>} />
          <Route path="/mandi-owner/bookings" element={<Layout isHomePage={false}><BookingsPage /></Layout>} />
          <Route path="/mandi-owner/reports" element={<Layout isHomePage={false}><ReportsPage /></Layout>} />

          <Route
  path="/mandi-operator/assisted-booking"
  element={
    <Layout isHomePage={false}>
      <AssistedBookingPage />
    </Layout>
  }
/>
<Route
  path="/mandi-operator/walk-in-booking"
  element={<WalkInBookingPage />}
/>
<Route
  path="/mandi-operator/dashboard"
  element={
    <Layout isHomePage={false}>
      <MandiOperatorDashboardPage />
    </Layout>
  }
/>
<Route
  path="/mandi-operator/queue-management"
  element={
    <Layout isHomePage={false}>
      <MandiOperatorQueueManagementPage />
    </Layout>
  }
/>
<Route
  path="/mandi-operator/qr-verification"
  element={<QRVerificationPage />}
/>
<Route
  path="/mandi-operator/procurement"
  element={<ProcurementPage />}
/>
<Route
  path="/super-admin/audit-logs"
  element={<AuditLogsPage />}
/>
          <Route path="/super-admin/dashboard" element={<Layout isHomePage={false}><SuperAdminDashboardPage /></Layout>} />
          <Route path="/super-admin/mandis" element={<Layout isHomePage={false}><ManageMandisPage /></Layout>} />
          <Route path="/super-admin/owners" element={<Layout isHomePage={false}><ManageOwnersPage /></Layout>} />
          <Route path="/super-admin/analytics" element={<Layout isHomePage={false}><PlatformAnalyticsPage /></Layout>} />
          <Route path="/super-admin/settings" element={<Layout isHomePage={false}><SystemSettingsPage /></Layout>} />
          <Route path="*" element={<Layout isHomePage={false}><NotFoundPage /></Layout>} />

          <Route
  path="/privacy-policy"
  element={<PrivacyPolicyPage />}
/>

<Route
  path="/terms-of-use"
  element={<TermsOfUsePage />}
/>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
