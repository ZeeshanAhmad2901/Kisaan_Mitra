import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../store/authStore'

function Navbar() {
  const { t, i18n } = useTranslation()
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  const navLinks = user
  ? user.role === 'farmer'
    ? [
        { to: '/farmer/dashboard', label: 'Dashboard' },
        { to: '/farmer/book-slot', label: 'Book Slot' },
        { to: '/farmer/bookings', label: 'My Bookings' },
      ]
    : user.role === 'mandiOwner'
      ? [
          { to: '/mandi-owner/dashboard', label: 'Dashboard' },
          { to: '/mandi-owner/queue', label: 'Queue Management' },
          { to: '/mandi-owner/bookings', label: 'Bookings' },
          { to: '/mandi-owner/reports', label: 'Reports' },
        ]
      : [
          { to: '/', label: t('navbar.home') },
          { to: '/about', label: t('navbar.about') },
          { to: '/services', label: t('navbar.services') },
          { to: '/contact', label: t('navbar.contact') },
        ]
  : [
      { to: '/', label: t('navbar.home') },
      { to: '/about', label: t('navbar.about') },
      { to: '/services', label: t('navbar.services') },
      { to: '/contact', label: t('navbar.contact') },
    ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 mx-auto max-w-7xl h-14">

        {/* Kisaan Mitra Brand */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-green-700">
            🌾 Kisaan Mitra
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="items-center hidden gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-gray-700 transition-colors hover:text-green-700"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <select
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="hidden px-2 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded cursor-pointer sm:block"
          >
            <option value="en">{t('navbar.english')}</option>
            <option value="hi">{t('navbar.hindi')}</option>
          </select>

          {user ? (
            <button
              onClick={handleLogout}
              className="hidden px-4 py-1.5 text-sm font-medium text-white transition-colors bg-red-600 rounded sm:inline-block hover:bg-red-700"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="hidden px-4 py-1.5 text-sm font-medium text-white transition-colors bg-green-700 rounded sm:inline-block hover:bg-green-800"
            >
              {t('navbar.login')}
            </Link>
          )}

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1 text-gray-700 md:hidden"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="bg-white border-t border-gray-200 md:hidden">
          <div className="px-4 py-3 space-y-1">

            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-medium text-gray-700 transition-colors hover:text-green-700"
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-2 border-t border-gray-100">
              <select
                value={i18n.language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="w-full px-2 py-2 mb-2 text-sm text-gray-700 bg-white border border-gray-300 rounded cursor-pointer"
              >
                <option value="en">{t('navbar.english')}</option>
                <option value="hi">{t('navbar.hindi')}</option>
              </select>

              {user ? (
                <button
                  onClick={() => {
                    handleLogout()
                    setMobileOpen(false)
                  }}
                  className="block w-full px-4 py-2 text-sm font-medium text-center text-white bg-red-600 rounded hover:bg-red-700"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2 text-sm font-medium text-center text-white bg-green-700 rounded hover:bg-green-800"
                >
                  {t('navbar.login')}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar