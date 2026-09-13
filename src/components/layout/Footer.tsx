import { useTranslation } from 'react-i18next'

function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="mt-auto bg-gray-100 border-t border-gray-200">
      <div className="px-4 py-6 mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-center md:text-left">
            <span className="font-bold text-green-700">🌾 Kisaan Mitra</span>
            <p className="mt-1 text-xs text-gray-500">
              {t('footer.tagline')}
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <a href="#" className="transition-colors hover:text-green-700">
              {t('footer.privacyPolicy')}
            </a>
            <a href="#" className="transition-colors hover:text-green-700">
              {t('footer.termsOfUse')}
            </a>
            <a href="#" className="transition-colors hover:text-green-700">
              {t('footer.contactUs')}
            </a>
          </div>

          <div className="text-center md:text-right">
            <p className="text-xs text-gray-500">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer