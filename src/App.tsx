import { BrowserRouter, Route, Routes } from 'react-router'
import Layout from './components/layout/Layout'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import AboutPage from './pages/common/AboutPage'
import ContactPage from './pages/common/ContactPage'
import HomePage from './pages/common/HomePage'
import ServicesPage from './pages/common/ServicesPage'
import BookSlotPage from './pages/farmer/BookSlotPage'
import BookingSuccessPage from './pages/farmer/BookingSuccessPage'
import FarmerDashboardPage from './pages/farmer/FarmerDashboardPage'
import MyBookingsPage from './pages/farmer/MyBookingsPage'
import MyVehiclesPage from './pages/farmer/MyVehiclesPage'
import BookingsPage from './pages/mandiOwner/BookingsPage'
import MandiOwnerDashboardPage from './pages/mandiOwner/MandiOwnerDashboardPage'
import QueueManagementPage from './pages/mandiOwner/QueueManagementPage'
import ReportsPage from './pages/mandiOwner/ReportsPage'
import ManageMandisPage from './pages/superAdmin/ManageMandisPage'
import ManageOwnersPage from './pages/superAdmin/ManageOwnersPage'
import PlatformAnalyticsPage from './pages/superAdmin/PlatformAnalyticsPage'
import SuperAdminDashboardPage from './pages/superAdmin/SuperAdminDashboardPage'
import SystemSettingsPage from './pages/superAdmin/SystemSettingsPage'
import { AuthProvider } from './store/authStore'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
          <Route path="/mandi-owner/queue" element={<Layout isHomePage={false}><QueueManagementPage /></Layout>} />
          <Route path="/mandi-owner/bookings" element={<Layout isHomePage={false}><BookingsPage /></Layout>} />
          <Route path="/mandi-owner/reports" element={<Layout isHomePage={false}><ReportsPage /></Layout>} />
          <Route path="/super-admin/dashboard" element={<Layout isHomePage={false}><SuperAdminDashboardPage /></Layout>} />
          <Route path="/super-admin/mandis" element={<Layout isHomePage={false}><ManageMandisPage /></Layout>} />
          <Route path="/super-admin/owners" element={<Layout isHomePage={false}><ManageOwnersPage /></Layout>} />
          <Route path="/super-admin/analytics" element={<Layout isHomePage={false}><PlatformAnalyticsPage /></Layout>} />
          <Route path="/super-admin/settings" element={<Layout isHomePage={false}><SystemSettingsPage /></Layout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App