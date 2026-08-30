function AboutPage() {
  return (
    <section className="px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900">About Kisaan Mitra</h1>
        <p className="mt-6 leading-relaxed text-center text-gray-600">
          Kisaan Mitra is a digital platform designed to empower Indian farmers
          by providing access to mandi prices, government schemes, and direct
          market connectivity — all in their own language.
        </p>
        <div className="grid grid-cols-1 gap-6 mt-10 md:grid-cols-3">
          <div className="p-6 text-center border border-green-100 rounded-lg bg-green-50">
            <span className="text-4xl">🌾</span>
            <h3 className="mt-3 font-bold text-gray-900">For Farmers</h3>
            <p className="mt-2 text-sm text-gray-600">Real-time mandi prices and schemes</p>
          </div>
          <div className="p-6 text-center border border-orange-100 rounded-lg bg-orange-50">
            <span className="text-4xl">🏪</span>
            <h3 className="mt-3 font-bold text-gray-900">For Mandi Owners</h3>
            <p className="mt-2 text-sm text-gray-600">Manage mandi operations digitally</p>
          </div>
          <div className="p-6 text-center border border-blue-100 rounded-lg bg-blue-50">
            <span className="text-4xl">🏛️</span>
            <h3 className="mt-3 font-bold text-gray-900">For Government</h3>
            <p className="mt-2 text-sm text-gray-600">Monitor and support agriculture</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutPage