import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { getCropPrices } from '../../api/mandiApi'
import type { CropPrice } from '../../types'
import { formatIndianCurrency } from '../../utils/formatters'

const bookingActivity = [
  { label: 'Mon', value: 2 },
  { label: 'Tue', value: 4 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 6 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 7 },
  { label: 'Sun', value: 4 },
]

const recentBookings = [
  {
    id: 'KM-2026-00421',
    mandi: 'Azadpur Mandi',
    crop: 'Wheat',
    date: '18 Sep 2026',
    time: '07:30 AM',
    status: 'Confirmed',
  },
  {
    id: 'KM-2026-00408',
    mandi: 'Azadpur Mandi',
    crop: 'Rice',
    date: '14 Sep 2026',
    time: '08:15 AM',
    status: 'Completed',
  },
  {
    id: 'KM-2026-00391',
    mandi: 'Jawaharlal Nehru Mandi',
    crop: 'Mustard',
    date: '08 Sep 2026',
    time: '09:00 AM',
    status: 'Completed',
  },
]

function FarmerDashboardPage() {
  const [prices, setPrices] = useState<CropPrice[]>([])
  const [loadingPrices, setLoadingPrices] = useState(true)

  const [farmerName, setFarmerName] = useState('Farmer')

  useEffect(() => {
    async function loadPrices() {
      try {
        const data = await getCropPrices()
        setPrices(data)
      } catch {
        setPrices([])
      } finally {
        setLoadingPrices(false)
      }
    }

    loadPrices()

    try {
      const storedUser = localStorage.getItem('user')

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)

        if (parsedUser?.name) {
          setFarmerName(parsedUser.name)
        }
      }
    } catch {
      // Keep fallback name
    }
  }, [])

  const highestPrice = useMemo(() => {
    if (!prices.length) return null

    return [...prices].sort(
      (a, b) => b.modalPrice - a.modalPrice,
    )[0]
  }, [prices])

  const chartPrices = useMemo(() => {
    return prices
      .slice(0, 5)
      .map((price) => ({
        name: price.cropName,
        value: price.modalPrice,
      }))
  }, [prices])

  const maxCropPrice = useMemo(() => {
    if (!chartPrices.length) return 1

    return Math.max(...chartPrices.map((item) => item.value))
  }, [chartPrices])

  return (
    <div className="min-h-screen bg-[#f4f7f3] text-gray-900">

      {/* =========================================================
          OFFICIAL HEADER
      ========================================================= */}
      <section className="bg-white border-b border-gray-200">
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>
              <div className="flex items-center gap-3">

                <div className="flex items-center justify-center text-xl text-white bg-green-800 shadow-sm h-11 w-11 rounded-xl">
                  🌾
                </div>

                <div>
                  <p className="text-xs font-semibold tracking-widest text-green-700 uppercase">
                    Government Digital Agriculture Service
                  </p>

                  <h1 className="mt-1 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                    Farmer Service Dashboard
                  </h1>
                </div>

              </div>

              <p className="mt-3 text-sm text-gray-500">
                Welcome back,{' '}
                <span className="font-semibold text-gray-800">
                  {farmerName}
                </span>
                . Manage your mandi visits and procurement activity from one place.
              </p>
            </div>

            <Link
              to="/farmer/book-slot"
              className="inline-flex items-center justify-center px-5 py-3 text-sm font-bold text-white transition bg-green-800 shadow-sm rounded-xl hover:bg-green-900"
            >
              + Book Mandi Slot
            </Link>

          </div>

        </div>
      </section>

      {/* =========================================================
          QUICK ACTIONS
      ========================================================= */}
      <section className="px-4 pt-6 mx-auto max-w-7xl sm:px-6 lg:px-8">

        <div className="grid gap-4 md:grid-cols-3">

          <Link
            to="/farmer/book-slot"
            className="group rounded-2xl border border-green-100 bg-green-50 p-5 transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md"
          >
            <div className="flex items-start justify-between">

              <div>
                <p className="text-xs font-bold tracking-wider text-green-700 uppercase">
                  Procurement
                </p>

                <h2 className="mt-2 text-lg font-black text-gray-900">
                  Book a Mandi Slot
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  Choose mandi, crop, vehicle and preferred time.
                </p>
              </div>

              <span className="text-2xl">📅</span>

            </div>
          </Link>

          <Link
            to="/farmer/bookings"
            className="group rounded-2xl border border-blue-100 bg-blue-50 p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex items-start justify-between">

              <div>
                <p className="text-xs font-bold tracking-wider text-blue-700 uppercase">
                  Records
                </p>

                <h2 className="mt-2 text-lg font-black text-gray-900">
                  My Bookings
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  View your confirmed and completed mandi visits.
                </p>
              </div>

              <span className="text-2xl">📋</span>

            </div>
          </Link>

          <Link
            to="/farmer/vehicles"
            className="group rounded-2xl border border-orange-100 bg-orange-50 p-5 transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
          >
            <div className="flex items-start justify-between">

              <div>
                <p className="text-xs font-bold tracking-wider text-orange-700 uppercase">
                  Transport
                </p>

                <h2 className="mt-2 text-lg font-black text-gray-900">
                  Manage Vehicles
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  Keep your registered vehicles ready for booking.
                </p>
              </div>

              <span className="text-2xl">🚜</span>

            </div>
          </Link>

        </div>

      </section>

      {/* =========================================================
          KEY INDICATORS
      ========================================================= */}
      <section className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                  Upcoming Visit
                </p>

                <p className="mt-3 text-2xl font-black text-green-800">
                  18 Sep
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Azadpur Mandi · 07:30 AM
                </p>
              </div>

              <div className="px-3 py-2 text-xl bg-green-100 rounded-xl">
                📅
              </div>
            </div>
          </div>

          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                  Completed Visits
                </p>

                <p className="mt-3 text-2xl font-black text-blue-800">
                  12
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Procurement visits completed
                </p>
              </div>

              <div className="px-3 py-2 text-xl bg-blue-100 rounded-xl">
                ✓
              </div>
            </div>
          </div>

          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                  Registered Vehicle
                </p>

                <p className="mt-3 text-2xl font-black text-orange-700">
                  01
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Vehicle ready for booking
                </p>
              </div>

              <div className="px-3 py-2 text-xl bg-orange-100 rounded-xl">
                🚜
              </div>
            </div>
          </div>

          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                  Current Crop Price
                </p>

                <p className="mt-3 text-2xl font-black text-green-800">
                  {loadingPrices
                    ? '...'
                    : highestPrice
                      ? formatIndianCurrency(highestPrice.modalPrice)
                      : '₹2,325'}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {highestPrice?.cropName ?? 'Wheat'} · modal price
                </p>
              </div>

              <div className="px-3 py-2 text-xl bg-green-100 rounded-xl">
                ₹
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* =========================================================
          MAIN ANALYTICS
      ========================================================= */}
      <section className="px-4 pb-6 mx-auto max-w-7xl sm:px-6 lg:px-8">

        <div className="grid gap-6 lg:grid-cols-5">

          {/* BOOKING ACTIVITY */}
          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl lg:col-span-3">

            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold tracking-widest text-green-700 uppercase">
                  Activity Overview
                </p>

                <h2 className="mt-2 text-xl font-black text-gray-900">
                  Mandi Visit Activity
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Recent booking activity across the current week.
                </p>
              </div>

              <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                This Week
              </span>
            </div>

            <div className="flex items-end h-64 gap-3 px-2 mt-8 border-b border-gray-200">

              {bookingActivity.map((item) => {
                const height = `${(item.value / 7) * 100}%`

                return (
                  <div
                    key={item.label}
                    className="flex flex-col items-center justify-end flex-1 h-full"
                  >
                    <span className="mb-2 text-xs font-bold text-gray-500">
                      {item.value}
                    </span>

                    <div
                      className="w-full transition-all bg-green-700 rounded-t-lg max-w-10 hover:bg-green-800"
                      style={{ height }}
                    />

                    <span className="mt-3 text-xs font-semibold text-gray-500">
                      {item.label}
                    </span>
                  </div>
                )
              })}

            </div>

            <div className="flex items-center gap-2 mt-5 text-xs text-gray-500">
              <span className="w-2 h-2 bg-green-700 rounded-full" />
              Number of scheduled mandi activities
            </div>

          </div>

          {/* CROP PRICE CHART */}
          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl lg:col-span-2">

            <div>
              <p className="text-xs font-bold tracking-widest text-green-700 uppercase">
                Market Information
              </p>

              <h2 className="mt-2 text-xl font-black text-gray-900">
                Current Crop Prices
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Latest available modal prices from connected mandis.
              </p>
            </div>

            <div className="space-y-5 mt-7">

              {loadingPrices ? (
                [1, 2, 3, 4].map((item) => (
                  <div key={item}>
                    <div className="w-20 h-3 mb-2 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 bg-gray-100 rounded animate-pulse" />
                  </div>
                ))
              ) : chartPrices.length > 0 ? (
                chartPrices.map((item) => {
                  const width = `${Math.max(
                    12,
                    (item.value / maxCropPrice) * 100,
                  )}%`

                  return (
                    <div key={item.name}>

                      <div className="flex items-center justify-between gap-3 mb-2">
                        <span className="text-sm font-bold text-gray-800">
                          {item.name}
                        </span>

                        <span className="text-sm font-black text-green-800">
                          {formatIndianCurrency(item.value)}
                        </span>
                      </div>

                      <div className="h-3 overflow-hidden bg-gray-100 rounded-full">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-green-700 to-emerald-500"
                          style={{ width }}
                        />
                      </div>

                    </div>
                  )
                })
              ) : (
                <div className="p-4 text-sm text-gray-500 rounded-xl bg-gray-50">
                  Crop price data is currently unavailable.
                </div>
              )}

            </div>

          </div>

        </div>

      </section>

      {/* =========================================================
          UPCOMING BOOKING + OFFICIAL NOTICE
      ========================================================= */}
      <section className="px-4 pb-6 mx-auto max-w-7xl sm:px-6 lg:px-8">

        <div className="grid gap-6 lg:grid-cols-3">

          {/* UPCOMING BOOKING */}
          <div className="p-6 border border-green-200 rounded-2xl bg-green-50 lg:col-span-2">

            <div className="flex items-start justify-between gap-4">

              <div>
                <p className="text-xs font-bold tracking-widest text-green-700 uppercase">
                  Next Scheduled Procurement
                </p>

                <h2 className="mt-2 text-2xl font-black text-gray-900">
                  Wheat · Azadpur Mandi
                </h2>
              </div>

              <span className="rounded-full bg-green-700 px-3 py-1.5 text-xs font-bold text-white">
                Confirmed
              </span>

            </div>

            <div className="grid gap-4 mt-6 sm:grid-cols-3">

              <div className="p-4 bg-white rounded-xl">
                <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  Date
                </p>
                <p className="mt-1 font-black text-gray-900">
                  18 Sep 2026
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl">
                <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  Time
                </p>
                <p className="mt-1 font-black text-gray-900">
                  07:30 AM
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl">
                <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  Token
                </p>
                <p className="mt-1 font-black text-gray-900">
                  KM-AZ-2741
                </p>
              </div>

            </div>

            <div className="flex flex-wrap gap-3 mt-5">

              <Link
                to="/farmer/bookings"
                className="rounded-xl bg-green-800 px-5 py-2.5 text-sm font-bold text-white hover:bg-green-900"
              >
                View Booking
              </Link>

              <Link
                to="/farmer/book-slot"
                className="rounded-xl border border-green-200 bg-white px-5 py-2.5 text-sm font-bold text-green-800 hover:bg-green-100"
              >
                Book Another Slot
              </Link>

            </div>

          </div>

          {/* NOTICE */}
          <div className="p-6 bg-white border border-orange-200 shadow-sm rounded-2xl">

            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-xl">
                📢
              </div>

              <div>
                <p className="text-xs font-bold tracking-widest text-orange-700 uppercase">
                  Farmer Notice
                </p>

                <h2 className="mt-1 font-black text-gray-900">
                  Important Information
                </h2>
              </div>
            </div>

            <div className="mt-5 space-y-4 text-sm leading-6 text-gray-600">

              <div className="pl-3 border-l-4 border-green-600">
                Carry your booking QR/token when visiting the mandi.
              </div>

              <div className="pl-3 border-l-4 border-orange-500">
                Reach the procurement centre during your assigned slot.
              </div>

              <div className="pl-3 border-l-4 border-blue-600">
                Keep your registered vehicle details up to date.
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =========================================================
          RECENT BOOKINGS
      ========================================================= */}
      <section className="px-4 pb-10 mx-auto max-w-7xl sm:px-6 lg:px-8">

        <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">

          <div className="flex flex-col gap-3 px-6 py-5 border-b border-gray-200 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-xs font-bold tracking-widest text-green-700 uppercase">
                Records
              </p>

              <h2 className="mt-1 text-xl font-black text-gray-900">
                Recent Mandi Bookings
              </h2>
            </div>

            <Link
              to="/farmer/bookings"
              className="text-sm font-bold text-green-700 hover:text-green-900"
            >
              View all →
            </Link>

          </div>

          <div className="overflow-x-auto">

            <table className="min-w-full text-left">

              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                    Booking ID
                  </th>

                  <th className="px-6 py-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                    Mandi
                  </th>

                  <th className="px-6 py-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                    Crop
                  </th>

                  <th className="px-6 py-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                    Date
                  </th>

                  <th className="px-6 py-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                    Time
                  </th>

                  <th className="px-6 py-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {recentBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="transition hover:bg-green-50/40"
                  >

                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      {booking.id}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {booking.mandi}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                      {booking.crop}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {booking.date}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {booking.time}
                    </td>

                    <td className="px-6 py-4">

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          booking.status === 'Confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {booking.status}
                      </span>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </section>

      {/* =========================================================
          FOOTER NOTE
      ========================================================= */}
      <section className="bg-white border-t border-gray-200">

        <div className="px-4 py-5 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <p className="text-xs text-gray-500">
            Kisaan Mitra · Digital Mandi Management Platform · Farmer Services
          </p>
        </div>

      </section>

    </div>
  )
}

export default FarmerDashboardPage