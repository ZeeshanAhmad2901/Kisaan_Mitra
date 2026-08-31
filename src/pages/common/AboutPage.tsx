import { useTranslation } from 'react-i18next'

function AboutPage() {
  const { t } = useTranslation()

  return (
    <section className="px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900">{t('about.title')}</h1>
        <p className="mt-6 leading-relaxed text-center text-gray-600">
          {t('about.description')}
        </p>
        <div className="grid grid-cols-1 gap-6 mt-10 md:grid-cols-3">
          <div className="p-6 text-center border border-green-100 rounded-lg bg-green-50">
            <span className="text-4xl">🌾</span>
            <h3 className="mt-3 font-bold text-gray-900">{t('about.forFarmers')}</h3>
            <p className="mt-2 text-sm text-gray-600">{t('about.forFarmersDesc')}</p>
          </div>
          <div className="p-6 text-center border border-orange-100 rounded-lg bg-orange-50">
            <span className="text-4xl">🏪</span>
            <h3 className="mt-3 font-bold text-gray-900">{t('about.forMandiOwners')}</h3>
            <p className="mt-2 text-sm text-gray-600">{t('about.forMandiOwnersDesc')}</p>
          </div>
          <div className="p-6 text-center border border-blue-100 rounded-lg bg-blue-50">
            <span className="text-4xl">🏛️</span>
            <h3 className="mt-3 font-bold text-gray-900">{t('about.forGovernment')}</h3>
            <p className="mt-2 text-sm text-gray-600">{t('about.forGovernmentDesc')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutPage