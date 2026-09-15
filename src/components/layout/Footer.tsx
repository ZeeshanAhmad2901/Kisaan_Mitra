import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="mt-auto bg-gray-950">
      <div className="px-4 py-10 mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-3">

          {/* Brand */}
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2"
            >
              <span className="text-xl font-extrabold text-lime-300">
                🌾 Kisaan Mitra
              </span>
            </Link>

            <p className="max-w-sm mt-3 text-sm leading-6 text-gray-400">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold tracking-wide text-white uppercase">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3 mt-4 text-sm">
              <Link
                to="/"
                className="text-gray-400 transition-colors hover:text-lime-300"
              >
                Home
              </Link>

              <Link
                to="/about"
                className="text-gray-400 transition-colors hover:text-lime-300"
              >
                About
              </Link>

              <Link
                to="/services"
                className="text-gray-400 transition-colors hover:text-lime-300"
              >
                Services
              </Link>

              <Link
                to="/contact"
                className="text-gray-400 transition-colors hover:text-lime-300"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-bold tracking-wide text-white uppercase">
              Legal
            </h3>

            <div className="flex flex-col gap-3 mt-4 text-sm">
              <Link
                to="/privacy-policy"
                className="text-gray-400 transition-colors hover:text-lime-300"
              >
                {t('footer.privacyPolicy')}
              </Link>

              <Link
                to="/terms-of-use"
                className="text-gray-400 transition-colors hover:text-lime-300"
              >
                {t('footer.termsOfUse')}
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-6 mt-8 border-t border-white/10">
          <p className="text-xs text-center text-gray-500">
            Digital Mandi Management Platform
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer