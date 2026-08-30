function ServicesPage() {
  const services = [
    { icon: '📊', title: 'Live Mandi Prices', desc: 'Check real-time crop prices across all mandis' },
    { icon: '📋', title: 'Government Schemes', desc: 'Browse and apply for farmer welfare schemes' },
    { icon: '📞', title: 'Helpline Support', desc: '24/7 support in Hindi and English' },
    { icon: '🌤️', title: 'Weather Updates', desc: 'Local weather forecasts for better planning' },
    { icon: '🚜', title: 'Equipment Sharing', desc: 'Rent or share farming equipment nearby' },
    { icon: '🎓', title: 'Training & Guides', desc: 'Learn modern farming techniques' },
  ]

  return (
    <section className="px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900">Our Services</h1>
        <p className="mt-3 text-center text-gray-600">
          Everything a farmer needs, in one place
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