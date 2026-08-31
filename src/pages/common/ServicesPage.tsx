import { useTranslation } from 'react-i18next'

function ServicesPage() {
  const { t } = useTranslation()

  const services = [
    { icon: '📊', title: t('services.livePrices'), desc: t('services.livePricesDesc') },
    { icon: '📋', title: t('services.schemes'), desc: t('services.schemesDesc') },
    { icon: '📞', title: t('services.helpline'), desc: t('services.helplineDesc') },
    { icon: '🌤️', title: t('services.weather'), desc: t('services.weatherDesc') },
    { icon: '🚜', title: t('services.equipment'), desc: t('services.equipmentDesc') },
    { icon: '🎓', title: t('services.training'), desc: t('services.trainingDesc') },
  ]

  return (
    <section className="px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900">{t('services.title')}</h1>
        <p className="mt-3 text-center text-gray-600">
          {t('services.subtitle')}
        </p>
        <div className="grid grid-cols-1 gap-6 mt-10 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="p-6 transition-all bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-green-300"
            >
              <span className="text-4xl">{service.icon}</span>
              <h3 className="mt-3 font-bold text-gray-900">{service.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesPage