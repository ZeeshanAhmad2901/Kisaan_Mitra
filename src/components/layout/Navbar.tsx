import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

function Navbar() {
  const { t, i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 mx-auto max-w-7xl h-14">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-green-700">🌾 Kisaan Mitra</span>
        </Link>

        {/* Nav Items */}
        <div className="items-center hidden gap-6 md:flex">
          <Link to="/" className="text-sm font-medium text-gray-700 transition-colors hover:text-green-700">
            {t('navbar.home')}
          </Link>
          <Link to="/about" className="text-sm font-medium text-gray-700 transition-colors hover:text-green-700">
            {t('navbar.about')}
          </Link>
          <Link to="/services" className="text-sm font-medium text-gray-700 transition-colors hover:text-green-700">
            {t('navbar.services')}
          </Link>
          <Link to="/contact" className="text-sm font-medium text-gray-700 transition-colors hover:text-green-700">
            {t('navbar.contact')}
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Language Chooser */}
          <select
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="px-2 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded cursor-pointer"
          >
            <option value="en">{t('navbar.english')}</option>
            <option value="hi">{t('navbar.hindi')}</option>
          </select>

          {/* Login Button */}
          <Link to="/login" className="bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-4 py-1.5 rounded transition-colors">
            {t('navbar.login')}
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar