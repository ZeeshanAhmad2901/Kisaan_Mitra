import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import type { MandiBooking } from '../../api/bookingApi'
import { getMyBookings } from '../../api/bookingApi'
import { getCropPrices } from '../../api/mandiApi'
import type { BackendVehicle } from '../../api/vehicleApi'
import { getMyVehicles } from '../../api/vehicleApi'
import type { CropPrice } from '../../types'
import { formatIndianCurrency } from '../../utils/formatters'

function FarmerDashboardPage() {
  const [prices, setPrices] = useState<CropPrice[]>([])
  const [loadingPrices, setLoadingPrices] = useState(true)

  const [vehicles, setVehicles] = useState<BackendVehicle[]>([])
  const [loadingVehicles, setLoadingVehicles] = useState(true)

  const [bookings, setBookings] = useState<MandiBooking[]>([])
  const [loadingBookings, setLoadingBookings] = useState(true)

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

    async function loadBookings() {
      try {
        const data = await getMyBookings()
        setBookings(data)
      } catch {
        setBookings([])
      } finally {
        setLoadingBookings(false)
      }
    }

    async function loadVehicles() {
      try {
        const data = await getMyVehicles()
        setVehicles(data)
      } catch {
        setVehicles([])
      } finally {
        setLoadingVehicles(false)
      }
    }

    loadPrices()
    loadBookings()
    loadVehicles()

    try {
      const storedUser = localStorage.getItem('kisaan_mitra_user')

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

  const upcomingBooking = useMemo(() => {
    return (
      bookings
        .filter((booking) => booking.status !== 'completed')
        .sort(
          (a, b) =>
            new Date(
              `${a.slot_date}T${a.start_time}`,
            ).getTime() -
            new Date(
              `${b.slot_date}T${b.start_time}`,
            ).getTime(),
        )[0] ?? null
    )
  }, [bookings])

  const bookingActivity = useMemo(() => {
    const today = new Date()
    const startOfWeek = new Date(today)

    const day = today.getDay()
    const mondayOffset = day === 0 ? -6 : 1 - day

    startOfWeek.setDate(today.getDate() + mondayOffset)
    startOfWeek.setHours(0, 0, 0, 0)

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + index)

      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const dayOfMonth = String(date.getDate()).padStart(2, '0')

      const dateKey = `${year}-${month}-${dayOfMonth}`

      const value = bookings.filter(
        (booking) => booking.slot_date === dateKey,
      ).length

      return {
        label: date.toLocaleDateString('en-IN', {
          weekday: 'short',
        }),
        value,
      }
    })
  }, [bookings])

  const maxBookingActivity = useMemo(() => {
    return Math.max(
      1,
      ...bookingActivity.map((item) => item.value),
    )
  }, [bookingActivity])

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

    return Math.max(
      ...chartPrices.map((item) => item.value),
    )
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

          {/* UPCOMING VISIT */}
          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="flex items-start justify-between">

              <div>
                <p className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                  Upcoming Visit
                </p>

                <p className="mt-3 text-2xl font-black text-green-800">
                  {loadingBookings
                    ? '...'
                    : upcomingBooking
                      ? new Date(
                          upcomingBooking.slot_date,
                        ).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                        })
                      : 'N/A'}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {upcomingBooking
                    ? `${upcomingBooking.mandi_name} · ${upcomingBooking.start_time.slice(0, 5)}`
                    : 'No upcoming visit'}
                </p>
              </div>

              <div className="px-3 py-2 text-xl bg-green-100 rounded-xl">
                📅
              </div>

            </div>
          </div>

          {/* COMPLETED VISITS */}
          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="flex items-start justify-between">

              <div>
                <p className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                  Completed Visits
                </p>

                <p className="mt-3 text-2xl font-black text-blue-800">
                  {loadingBookings
                    ? '...'
                    : bookings.filter(
                        (booking) =>
                          booking.status === 'completed',
                      ).length}
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

          {/* REGISTERED VEHICLES */}
<div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
  <div className="flex items-start justify-between gap-4">
    <div>
      <p className="text-xs font-bold tracking-wider text-gray-500 uppercase">
        Registered Vehicles
      </p>

      <p className="mt-2 text-2xl font-black text-orange-700">
        {loadingVehicles
          ? '...'
          : vehicles.filter((vehicle) => vehicle.is_active).length
              .toString()
              .padStart(2, '0')}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        Active vehicles ready for booking
      </p>
    </div>

    <div className="px-3 py-2 text-xl bg-orange-100 rounded-xl">
      🚜
    </div>
  </div>

  {loadingVehicles ? (
    <div className="p-4 mt-5 text-sm text-gray-500 bg-gray-50 rounded-xl">
      Loading vehicle details...
    </div>
  ) : vehicles.filter((vehicle) => vehicle.is_active).length === 0 ? (
    <div className="p-4 mt-5 border border-orange-100 bg-orange-50 rounded-xl">
      <p className="text-sm font-semibold text-gray-800">
        No active vehicle registered
      </p>

      <p className="mt-1 text-xs text-gray-500">
        Register a vehicle before booking a mandi slot.
      </p>

      <Link
        to="/farmer/vehicles"
        className="inline-block mt-3 text-xs font-bold text-orange-700 hover:text-orange-800"
      >
        Manage Vehicles →
      </Link>
    </div>
  ) : (
    <div className="mt-5 space-y-3">
      {vehicles
        .filter((vehicle) => vehicle.is_active)
        .map((vehicle) => (
          <div
            key={vehicle.id}
            className="flex items-center justify-between gap-3 p-4 border border-orange-100 rounded-xl bg-orange-50"
          >
            <div className="min-w-0">
              <p className="text-sm font-black text-gray-900">
                {vehicle.vehicle_number}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {vehicle.vehicle_type} · Vehicle ID #{vehicle.id}
              </p>
            </div>

            <span className="px-2.5 py-1 text-[10px] font-bold text-green-700 bg-green-100 rounded-full">
              ACTIVE
            </span>
          </div>
        ))}

      <Link
        to="/farmer/vehicles"
        className="block text-xs font-bold text-center text-orange-700 hover:text-orange-800"
      >
        Manage Vehicles →
      </Link>
    </div>
  )}
</div>

          {/* CURRENT CROP PRICE */}
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
                      ? formatIndianCurrency(
                          highestPrice.modalPrice,
                        )
                      : 'N/A'}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {highestPrice?.cropName ?? 'No data'} · modal price
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
                const height =
                  item.value === 0
                    ? '0%'
                    : `${Math.max(
                        8,
                        (item.value / maxBookingActivity) * 100,
                      )}%`

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
                  {upcomingBooking
                    ? `${upcomingBooking.crop_type} · ${upcomingBooking.mandi_name}`
                    : 'No upcoming procurement'}
                </h2>
              </div>

              <span className="rounded-full bg-green-700 px-3 py-1.5 text-xs font-bold text-white">
                {upcomingBooking?.status ?? 'No booking'}
              </span>

            </div>

            <div className="grid gap-4 mt-6 sm:grid-cols-3">

              <div className="p-4 bg-white rounded-xl">
                <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  Date
                </p>

                <p className="mt-1 font-black text-gray-900">
                  {loadingBookings
                    ? '...'
                    : upcomingBooking
                      ? new Date(
                          upcomingBooking.slot_date,
                        ).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'N/A'}
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl">
                <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  Time
                </p>

                <p className="mt-1 font-black text-gray-900">
                  {upcomingBooking
                    ? `${upcomingBooking.start_time.slice(0, 5)} - ${upcomingBooking.end_time.slice(0, 5)}`
                    : 'N/A'}
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl">
                <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  Token
                </p>

                <p className="mt-1 font-black text-gray-900">
                  {upcomingBooking?.booking_code ?? 'N/A'}
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

                {loadingBookings ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-sm text-center text-gray-500"
                    >
                      Loading your bookings...
                    </td>
                  </tr>
                ) : bookings.length > 0 ? (
                  bookings.slice(0, 5).map((booking) => (
                    <tr
                      key={booking.id}
                      className="transition hover:bg-green-50/40"
                    >

                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        {booking.booking_code}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {booking.mandi_name}
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                        {booking.crop_type}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(
                          booking.slot_date,
                        ).toLocaleDateString('en-IN')}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {booking.start_time.slice(0, 5)} -{' '}
                        {booking.end_time.slice(0, 5)}
                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'completed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {booking.status}
                        </span>

                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-sm text-center text-gray-500"
                    >
                      No bookings found.
                    </td>
                  </tr>
                )}

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