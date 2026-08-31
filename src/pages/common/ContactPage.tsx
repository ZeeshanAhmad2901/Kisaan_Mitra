import { useTranslation } from 'react-i18next'

function ContactPage() {
  const { t } = useTranslation()

  return (
    <section className="px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900">{t('contact.title')}</h1>
        <p className="mt-3 text-center text-gray-600">
          {t('contact.subtitle')}
        </p>
        <div className="p-8 mt-10 bg-white border border-gray-200 rounded-lg">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">{t('contact.name')}</label>
              <input
                type="text"
                placeholder={t('contact.namePlaceholder')}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">{t('contact.email')}</label>
              <input
                type="email"
                placeholder={t('contact.emailPlaceholder')}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="mt-6">
            <label className="block mb-1 text-sm font-medium text-gray-700">{t('contact.message')}</label>
            <textarea
              rows={5}
              placeholder={t('contact.messagePlaceholder')}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button className="mt-6 bg-green-700 hover:bg-green-800 text-white font-medium px-6 py-2.5 rounded-lg transition-colors">
            {t('contact.send')}
          </button>
        </div>
      </div>
    </section>
  )
}

export default ContactPage