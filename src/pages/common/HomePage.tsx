import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { getCropPrices } from '../../api/mandiApi'
import type { CropPrice } from '../../types'
import { formatIndianCurrency } from '../../utils/formatters'

const features = [
  {
    number: '01',
    title: 'smartSlotBooking',
    description: 'smartSlotBookingDesc',
  },
  {
    number: '02',
    title: 'digitalQrToken',
    description: 'digitalQrTokenDesc',
  },
  {
    number: '03',
    title: 'queueManagement',
    description: 'queueManagementDesc',
  },
  {
    number: '04',
    title: 'liveCropPrices',
    description: 'liveCropPricesDesc',
  },
  {
    number: '05',
    title: 'transparentOperations',
    description: 'transparentOperationsDesc',
  },
  {
    number: '06',
    title: 'fasterProcessing',
    description: 'fasterProcessingDesc',
  },
]

const steps = [
  {
    number: '01',
    title: 'selectMandi',
    description: 'selectMandiDesc',
  },
  {
    number: '02',
    title: 'chooseSlot',
    description: 'chooseSlotDesc',
  },
  {
    number: '03',
    title: 'addDetails',
    description: 'addDetailsDesc',
  },
  {
    number: '04',
    title: 'getQrToken',
    description: 'getQrTokenDesc',
  },
  {
    number: '05',
    title: 'reachProcess',
    description: 'reachProcessDesc',
  },
]

function HomePage() {
  const { t } = useTranslation()

  const [prices, setPrices] = useState<CropPrice[]>([])
  const [loadingPrices, setLoadingPrices] = useState(true)

  useEffect(() => {
    async function loadPrices() {
      try {
        const data = await getCropPrices()
        setPrices(data.slice(0, 3))
      } catch {
        setPrices([])
      } finally {
        setLoadingPrices(false)
      }
    }

    loadPrices()
  }, [])

  return (
    <div className="min-h-screen bg-[#f7faf6] text-gray-900">

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden bg-green-950">
  {/* Full responsive banner */}
  <div className="relative w-full">
    <img
      src="/kisaan-mitra-farmer-green.jpeg"
      alt="Kisaan Mitra farmer banner"
      className="block w-full h-auto"
    />

    {/* Dark green overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-green-950/95 via-green-950/65 to-green-950/10" />

    {/* Decorative glow */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute w-64 h-64 rounded-full bg-lime-400/10 -top-24 -right-20 blur-3xl" />
      <div className="absolute rounded-full w-72 h-72 bg-emerald-300/10 -bottom-40 left-10 blur-3xl" />
    </div>

    {/* Hero content */}
    <div className="absolute inset-0 flex items-center">
      <div className="w-full px-4 py-10 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-3xl">

          <div className="inline-flex items-center px-3 py-1.5 text-xs font-semibold tracking-wide text-lime-200 uppercase border rounded-full border-white/15 bg-white/5 backdrop-blur-sm">
            {t('home.platform')}
          </div>

          <h1 className="mt-6 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
            {t('home.heroTitle')}

            <span className="block text-lime-300">
              {t('home.heroHighlight')}
            </span>
          </h1>

          <p className="max-w-2xl mt-6 text-base leading-7 text-green-100 sm:text-lg">
            {t('home.heroDescription')}
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            <Link
              to="/login"
              className="px-6 py-3 text-sm font-bold text-green-950 transition-all bg-lime-300 rounded-xl hover:bg-lime-200 hover:-translate-y-0.5 shadow-lg shadow-green-950/20"
            >
              Get Started
            </Link>

            <a
              href="#mandi-snapshot"
              className="px-6 py-3 text-sm font-semibold text-white transition-all border rounded-xl border-white/20 bg-white/10 hover:bg-white/15 backdrop-blur-sm"
            >
              {t('home.exploreMandis')}
            </a>
          </div>

          <div className="flex flex-wrap gap-6 mt-8 text-sm text-green-100">
            <span>✓ {t('home.digitalBooking')}</span>
            <span>✓ {t('home.qrToken')}</span>
            <span>✓ {t('home.organizedQueue')}</span>
          </div>

        </div>
      </div>
    </div>
  </div>
</section>

      {/* =========================================================
          IMPACT STATS
      ========================================================= */}
      <section className="px-4 py-8 bg-white border-b border-gray-100">
        <div className="grid max-w-6xl grid-cols-1 gap-4 mx-auto sm:grid-cols-3">

          <div className="p-6 text-center border border-gray-100 rounded-2xl bg-gray-50">
            <p className="text-3xl font-black text-green-800">500+</p>
            <p className="mt-1 text-sm text-gray-500">
              {t('home.farmersServed')}
            </p>
          </div>

          <div className="p-6 text-center border border-gray-100 rounded-2xl bg-gray-50">
            <p className="text-3xl font-black text-green-800">25+</p>
            <p className="mt-1 text-sm text-gray-500">
              {t('home.mandisConnected')}
            </p>
          </div>

          <div className="p-6 text-center border border-gray-100 rounded-2xl bg-gray-50">
            <p className="text-3xl font-black text-green-800">10K+</p>
            <p className="mt-1 text-sm text-gray-500">
              {t('home.slotsManaged')}
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================
          WHY KISAAN MITRA
      ========================================================= */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">

          <div className="max-w-2xl">
            <p className="text-sm font-bold tracking-widest text-green-700 uppercase">
              {t('home.whyLabel')}
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              {t('home.whyTitle')}
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              {t('home.whyDescription')}
            </p>
          </div>

          <div className="grid gap-4 mt-10 sm:grid-cols-2 lg:grid-cols-3">

            {features.map((feature) => (
              <div
                key={feature.number}
                className="p-6 transition-all bg-white border border-gray-200 rounded-2xl hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-center w-10 h-10 text-sm font-black text-green-800 bg-green-100 rounded-xl">
                  {feature.number}
                </div>

                <h3 className="mt-5 text-lg font-bold text-gray-900">
                  {t(`home.${feature.title}`)}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {t(`home.${feature.description}`)}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}
      <section className="px-4 py-20 bg-white">
        <div className="mx-auto max-w-7xl">

          <div className="text-center">
            <p className="text-sm font-bold tracking-widest text-green-700 uppercase">
              {t('home.howLabel')}
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              {t('home.howTitle')}
            </h2>
          </div>

          <div className="grid gap-5 mt-12 md:grid-cols-5">

            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative"
              >
                <div className="h-full p-5 border border-gray-200 rounded-2xl bg-gray-50">

                  <div className="text-sm font-black text-green-700">
                    {step.number}
                  </div>

                  <h3 className="mt-3 font-bold text-gray-900">
                    {t(`home.${step.title}`)}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {t(`home.${step.description}`)}
                  </p>

                </div>

                {index < steps.length - 1 && (
                  <div className="absolute hidden text-xl text-green-400 md:block top-12 -right-3">
                    →
                  </div>
                )}

              </div>
            ))}

          </div>
        </div>
      </section>

      {/* =========================================================
          LIVE MANDI SNAPSHOT
      ========================================================= */}
      <section
        id="mandi-snapshot"
        className="px-4 py-20 bg-gradient-to-br from-green-950 to-green-900"
      >
        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

            <div>
              <p className="text-sm font-bold tracking-widest uppercase text-lime-300">
                {t('home.snapshotLabel')}
              </p>

              <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                {t('home.snapshotTitle')}
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-green-100">
              {t('home.snapshotDescription')}
            </p>

          </div>

          <div className="grid gap-4 mt-10 md:grid-cols-3">

            {loadingPrices ? (
              [1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-36 bg-white/10 rounded-2xl animate-pulse"
                />
              ))
            ) : prices.length > 0 ? (
              prices.map((price) => (
                <div
                  key={price.id}
                  className="p-6 border rounded-2xl border-white/10 bg-white/10"
                >

                  <div className="flex items-start justify-between">

                    <div>
                      <p className="text-lg font-bold text-white">
                        {price.cropName}
                      </p>

                      <p className="mt-1 text-sm text-green-200">
                        {price.mandiName}
                      </p>
                    </div>

                    <span className="px-2 py-1 text-xs font-semibold rounded-full text-lime-900 bg-lime-300">
                      {t('home.modal')}
                    </span>

                  </div>

                  <p className="mt-6 text-2xl font-black text-white">
                    {formatIndianCurrency(price.modalPrice)}
                  </p>

                  <p className="mt-1 text-xs text-green-200">
                    {price.unit}
                  </p>

                </div>
              ))
            ) : (
              <>

              </>
            )}

          </div>
        </div>
      </section>

      {/* =========================================================
          FARMER + MANDI OWNER
      ========================================================= */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">

          <div className="text-center">
            <p className="text-sm font-bold tracking-widest text-green-700 uppercase">
              {t('home.builtLabel')}
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              {t('home.builtTitle')}
            </h2>
          </div>

          <div className="grid gap-6 mt-10 md:grid-cols-2">

            {/* FARMER */}
            <div className="p-8 bg-white border border-gray-200 rounded-3xl">

              <p className="text-sm font-bold text-green-700 uppercase">
                {t('home.forFarmers')}
              </p>

              <h3 className="mt-3 text-2xl font-black">
                {t('home.farmerTitle')}
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                {t('home.farmerDescription')}
              </p>

              <div className="grid grid-cols-2 gap-3 mt-6">

                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">
                    {t('home.booking')}
                  </p>

                  <p className="mt-1 text-sm font-bold text-gray-900">
                    {t('home.slotBased')}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">
                    {t('home.token')}
                  </p>

                  <p className="mt-1 text-sm font-bold text-gray-900">
                    {t('home.digital')}
                  </p>
                </div>

              </div>

              {/* ROLE-SPECIFIC FARMER CTA */}
              <Link
                to="/farmer/book-slot"
                className="inline-block px-5 py-3 mt-6 text-sm font-bold text-white bg-green-700 rounded-xl hover:bg-green-800"
              >
                {t('home.bookYourSlot')}
              </Link>

            </div>

            {/* MANDI OWNER */}
            <div className="p-8 border border-orange-200 rounded-3xl bg-orange-50">

              <p className="text-sm font-bold text-orange-700 uppercase">
                {t('home.forMandiOwners')}
              </p>

              <h3 className="mt-3 text-2xl font-black">
                {t('home.mandiOwnerTitle')}
              </h3>

              <p className="mt-3 leading-7 text-gray-700">
                {t('home.mandiOwnerDescription')}
              </p>

              <div className="grid grid-cols-2 gap-3 mt-6">

                <div className="p-3 bg-white/70 rounded-xl">
                  <p className="text-xs text-gray-500">
                    {t('home.queue')}
                  </p>

                  <p className="mt-1 text-sm font-bold text-gray-900">
                    {t('home.liveStatus')}
                  </p>
                </div>

                <div className="p-3 bg-white/70 rounded-xl">
                  <p className="text-xs text-gray-500">
                    {t('home.arrivals')}
                  </p>

                  <p className="mt-1 text-sm font-bold text-gray-900">
                    {t('home.organized')}
                  </p>
                </div>

              </div>

              <Link
                to="/login"
                className="inline-block px-5 py-3 mt-6 text-sm font-bold text-orange-900 bg-orange-300 rounded-xl hover:bg-orange-200"
              >
                {t('home.mandiOwnerLogin')}
              </Link>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <section className="px-4 pb-20">

        <div className="max-w-6xl p-8 mx-auto overflow-hidden text-center bg-gradient-to-r from-green-800 to-emerald-700 rounded-3xl sm:p-12">

          <p className="text-sm font-bold tracking-widest uppercase text-lime-300">
            {t('home.ctaLabel')}
          </p>

          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
            {t('home.ctaTitle')}

            <span className="block text-lime-300">
              {t('home.ctaHighlight')}
            </span>
          </h2>

          <p className="max-w-2xl mx-auto mt-4 text-green-100">
            Access Kisaan Mitra services for farmers and mandi operators.
          </p>

          {/* PUBLIC CTA */}
          <Link
            to="/login"
            className="inline-block px-7 py-3 mt-7 text-sm font-bold text-green-950 transition-all bg-lime-300 rounded-xl hover:bg-lime-200 hover:-translate-y-0.5"
          >
            Get Started
          </Link>

        </div>

      </section>

    </div>
  )
}

export default HomePage
