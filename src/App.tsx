import { BrowserRouter, Route, Routes } from 'react-router'
import Layout from './components/layout/Layout'
import LoginPage from './pages/auth/LoginPage'
import AboutPage from './pages/common/AboutPage'
import ContactPage from './pages/common/ContactPage'
import HomePage from './pages/common/HomePage'
import ServicesPage from './pages/common/ServicesPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout isHomePage={true}><HomePage /></Layout>} />
        <Route path="/about" element={<Layout isHomePage={false}><AboutPage /></Layout>} />
        <Route path="/services" element={<Layout isHomePage={false}><ServicesPage /></Layout>} />
        <Route path="/contact" element={<Layout isHomePage={false}><ContactPage /></Layout>} />
        <Route path="/login" element={<Layout isHomePage={false}><LoginPage /></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App