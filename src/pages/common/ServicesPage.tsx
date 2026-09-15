import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

const serviceNumbers = ['01', '02', '03', '04', '05', '06']

function ServicesPage() {
  const { t } = useTranslation()

  const services = [
    {
      number: serviceNumbers[0],
      title: t('services.livePrices'),
      desc: t('services.livePricesDesc'),
      accent: 'green',
    },
    {
      number: serviceNumbers[1],
      title: t('services.schemes'),
      desc: t('services.schemesDesc'),
      accent: 'blue',
    },
    {
      number: serviceNumbers[2],
      title: t('services.helpline'),
      desc: t('services.helplineDesc'),
      accent: 'orange',
    },
    {
      number: serviceNumbers[3],
      title: t('services.weather'),
      desc: t('services.weatherDesc'),
      accent: 'sky',
    },
    {
      number: serviceNumbers[4],
      title: t('services.equipment'),
      desc: t('services.equipmentDesc'),
      accent: 'purple',
    },
    {
      number: serviceNumbers[5],
      title: t('services.training'),
      desc: t('services.trainingDesc'),
      accent: 'emerald',
    },
  ]

  const accentClasses: Record<
    string,
    { badge: string; text: string; background: string }
  > = {
    green: {
      badge: 'bg-green-100 text-green-800',
      text: 'text-green-700',
      background: 'hover:border-green-300 hover:shadow-green-100',
    },
    blue: {
      badge: 'bg-blue-100 text-blue-800',
      text: 'text-blue-700',
      background: 'hover:border-blue-300 hover:shadow-blue-100',
    },
    orange: {
      badge: 'bg-orange-100 text-orange-800',
      text: 'text-orange-700',
      background: 'hover:border-orange-300 hover:shadow-orange-100',
    },
    sky: {
      badge: 'bg-sky-100 text-sky-800',
      text: 'text-sky-700',
      background: 'hover:border-sky-300 hover:shadow-sky-100',
    },
    purple: {
      badge: 'bg-purple-100 text-purple-800',
      text: 'text-purple-700',
      background: 'hover:border-purple-300 hover:shadow-purple-100',
    },
    emerald: {
      badge: 'bg-emerald-100 text-emerald-800',
      text: 'text-emerald-700',
      background: 'hover:border-emerald-300 hover:shadow-emerald-100',
    },
  }

  return (
    <main className="min-h-screen bg-[#f7faf6] text-gray-900">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-emerald-800">
        <div className="absolute rounded-full w-72 h-72 bg-lime-300/10 blur-3xl -top-24 -right-20" />
        <div className="absolute rounded-full w-96 h-96 bg-emerald-300/10 blur-3xl -bottom-48 -left-24" />

        <div className="relative px-4 py-20 mx-auto max-w-7xl sm:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex px-4 py-2 text-xs font-bold tracking-widest uppercase border rounded-full text-lime-200 border-white/15 bg-white/10">
              Kisaan Mitra Services
            </span>

            <h1 className="mt-6 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              Digital services for a
              <span className="block text-lime-300">
                smarter mandi journey.
              </span>
            </h1>

            <p className="max-w-2xl mt-6 text-base leading-7 text-green-100 sm:text-lg">
              {t('services.subtitle')}
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                to="/farmer/book-slot"
                className="px-6 py-3 text-sm font-bold text-green-950 transition-all bg-lime-300 rounded-xl hover:bg-lime-200 hover:-translate-y-0.5"
              >
                Book a Mandi Slot
              </Link>

              <Link
                to="/login"
                className="px-6 py-3 text-sm font-semibold text-white transition-all border rounded-xl border-white/20 bg-white/10 hover:bg-white/20"
              >
                Access Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="px-4 py-16 bg-white">
        <div className="grid items-center gap-10 mx-auto max-w-7xl lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold tracking-widest text-green-700 uppercase">
              Platform Services
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Everything you need in one connected platform.
            </h2>

            <p className="mt-5 leading-7 text-gray-600">
              Kisaan Mitra combines useful mandi information with digital
              workflows for farmers and mandi operators. Each service is
              designed to support a different part of the mandi journey.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 border border-green-100 rounded-2xl bg-green-50">
              <p className="text-3xl font-black text-green-800">06</p>
              <p className="mt-2 text-sm font-semibold text-gray-900">
                Core Services
              </p>
            </div>

            <div className="p-5 border border-orange-100 rounded-2xl bg-orange-50">
              <p className="text-3xl font-black text-orange-800">24/7</p>
              <p className="mt-2 text-sm font-semibold text-gray-900">
                Digital Access
              </p>
            </div>

            <div className="p-5 border border-blue-100 rounded-2xl bg-blue-50">
              <p className="text-3xl font-black text-blue-800">QR</p>
              <p className="mt-2 text-sm font-semibold text-gray-900">
                Digital Tokens
              </p>
            </div>

            <div className="p-5 border border-purple-100 rounded-2xl bg-purple-50">
              <p className="text-3xl font-black text-purple-800">Live</p>
              <p className="mt-2 text-sm font-semibold text-gray-900">
                Mandi Information
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold tracking-widest text-green-700 uppercase">
              What We Offer
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Services built around real mandi needs.
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Explore the major digital capabilities available through the
              Kisaan Mitra platform.
            </p>
          </div>

          <div className="grid gap-5 mt-10 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const colors = accentClasses[service.accent]

              return (
                <div
                  key={service.number}
                  className={`group p-6 bg-white border border-gray-200 rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${colors.background}`}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-2xl text-sm font-black ${colors.badge}`}
                    >
                      {service.number}
                    </div>

                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${colors.text}`}
                    >
                      Service
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-black text-gray-900">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {service.desc}
                  </p>

                  <div
                    className={`mt-6 text-sm font-bold transition-transform duration-200 ${colors.text} group-hover:translate-x-1`}
                  >
                    Learn more →
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FARMER SERVICES */}
      <section className="px-4 py-20 bg-white">
        <div className="grid items-center gap-10 mx-auto max-w-7xl lg:grid-cols-2">
          <div>
            <span className="inline-block px-3 py-1 text-xs font-bold tracking-wide text-green-700 uppercase bg-green-100 rounded-full">
              For Farmers
            </span>

            <h2 className="mt-4 text-3xl font-black sm:text-4xl">
              Plan the visit before you reach the mandi.
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Use digital services to prepare your mandi visit with better
              visibility of slots, prices, bookings and confirmation details.
            </p>

            <div className="grid grid-cols-1 gap-3 mt-7 sm:grid-cols-2">
              <div className="p-4 border border-gray-200 rounded-2xl bg-gray-50">
                <p className="font-bold text-gray-900">Slot Booking</p>
                <p className="mt-1 text-xs text-gray-500">
                  Reserve an arrival window.
                </p>
              </div>

              <div className="p-4 border border-gray-200 rounded-2xl bg-gray-50">
                <p className="font-bold text-gray-900">QR Confirmation</p>
                <p className="mt-1 text-xs text-gray-500">
                  Carry your digital token.
                </p>
              </div>

              <div className="p-4 border border-gray-200 rounded-2xl bg-gray-50">
                <p className="font-bold text-gray-900">Crop Prices</p>
                <p className="mt-1 text-xs text-gray-500">
                  Check available market information.
                </p>
              </div>

              <div className="p-4 border border-gray-200 rounded-2xl bg-gray-50">
                <p className="font-bold text-gray-900">Bookings</p>
                <p className="mt-1 text-xs text-gray-500">
                  Keep track of your visits.
                </p>
              </div>
            </div>

            <Link
              to="/farmer/book-slot"
              className="inline-block px-6 py-3 text-sm font-bold text-white bg-green-700 mt-7 rounded-xl hover:bg-green-800"
            >
              Book Your Slot
            </Link>
          </div>

          <div className="p-6 border border-green-100 rounded-3xl bg-green-50">
            <div className="p-6 bg-white shadow-sm rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold tracking-wide text-green-700 uppercase">
                    Farmer Journey
                  </p>
                  <h3 className="mt-1 text-xl font-black">
                    Simple digital flow
                  </h3>
                </div>

                <div className="px-3 py-1 text-xs font-bold text-green-700 bg-green-100 rounded-full">
                  Ready
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  'Select mandi',
                  'Choose time slot',
                  'Add crop & vehicle',
                  'Receive QR token',
                  'Reach and process',
                ].map((item, index) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex items-center justify-center text-xs font-black text-green-800 bg-green-100 rounded-full w-9 h-9">
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    <p className="text-sm font-semibold text-gray-800">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MANDI OWNER SERVICES */}
      <section className="px-4 py-20 bg-orange-50">
        <div className="grid items-center gap-10 mx-auto max-w-7xl lg:grid-cols-2">
          <div className="order-2 p-6 bg-white border border-orange-100 rounded-3xl lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-orange-50 rounded-2xl">
                <p className="text-xs text-orange-700">Today's Arrivals</p>
                <p className="mt-1 text-3xl font-black text-orange-900">
                  24
                </p>
              </div>

              <div className="p-5 bg-green-50 rounded-2xl">
                <p className="text-xs text-green-700">Active Queue</p>
                <p className="mt-1 text-3xl font-black text-green-900">
                  05
                </p>
              </div>

              <div className="p-5 bg-blue-50 rounded-2xl">
                <p className="text-xs text-blue-700">Bookings</p>
                <p className="mt-1 text-3xl font-black text-blue-900">
                  18
                </p>
              </div>

              <div className="p-5 bg-purple-50 rounded-2xl">
                <p className="text-xs text-purple-700">Completed</p>
                <p className="mt-1 text-3xl font-black text-purple-900">
                  12
                </p>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <span className="inline-block px-3 py-1 text-xs font-bold tracking-wide text-orange-700 uppercase bg-orange-100 rounded-full">
              For Mandi Owners
            </span>

            <h2 className="mt-4 text-3xl font-black sm:text-4xl">
              Coordinate mandi operations from one dashboard.
            </h2>

            <p className="mt-4 leading-7 text-gray-700">
              Keep track of arrivals, bookings, queue movement and processing
              status through an operational workflow designed for mandi teams.
            </p>

            <div className="space-y-3 mt-7">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 text-xs font-bold text-orange-800 bg-orange-100 rounded-full">
                  ✓
                </span>
                <span className="text-sm font-semibold text-gray-800">
                  Monitor today's arrivals
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 text-xs font-bold text-orange-800 bg-orange-100 rounded-full">
                  ✓
                </span>
                <span className="text-sm font-semibold text-gray-800">
                  Manage queue movement
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 text-xs font-bold text-orange-800 bg-orange-100 rounded-full">
                  ✓
                </span>
                <span className="text-sm font-semibold text-gray-800">
                  Track processing status
                </span>
              </div>
            </div>

            <Link
              to="/login"
              className="inline-block px-6 py-3 text-sm font-bold text-orange-900 bg-orange-300 mt-7 rounded-xl hover:bg-orange-200"
            >
              Mandi Owner Login
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20">
        <div className="max-w-6xl p-8 mx-auto text-center bg-gradient-to-r from-green-800 to-emerald-700 rounded-3xl sm:p-12">
          <p className="text-sm font-bold tracking-widest uppercase text-lime-300">
            Kisaan Mitra
          </p>

          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
            One platform for a more connected mandi experience.
          </h2>

          <p className="max-w-2xl mx-auto mt-4 text-green-100">
            Explore the services and start using the digital mandi workflow.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-7">
            <Link
              to="/farmer/book-slot"
              className="px-6 py-3 text-sm font-bold text-green-950 bg-lime-300 rounded-xl hover:bg-lime-200"
            >
              Start Booking
            </Link>

            <Link
              to="/about"
              className="px-6 py-3 text-sm font-semibold text-white border border-white/20 rounded-xl hover:bg-white/10"
            >
              Learn About Kisaan Mitra
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ServicesPage