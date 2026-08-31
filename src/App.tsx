import { BrowserRouter, Route, Routes } from 'react-router'
import Layout from './components/layout/Layout'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import AboutPage from './pages/common/AboutPage'
import ContactPage from './pages/common/ContactPage'
import HomePage from './pages/common/HomePage'
import ServicesPage from './pages/common/ServicesPage'
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App