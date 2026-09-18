import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import apiClient from '../../api/client'
import {
  getMyProcurements,
  type Procurement,
} from '../../api/procurementApi'
import { formatDate } from '../../utils/formatters'

interface BackendBooking {
  id: number
  booking_code: string
  farmer_id: number
  mandi_id: number
  mandi_name: string
  mandi_location: string
  slot_id: number
  slot_date: string
  start_time: string
  end_time: string
  vehicle_id: number
  vehicle_number: string
  vehicle_type: string
  crop_type: string
  quantity: number
  status: string
  created_at: string
}

const STATUS_META: Record<
  string,
  {
    label: string
    className: string
    dot: string
    icon: string
  }
> = {
  confirmed: {
    label: 'Confirmed',
    className: 'bg-green-50 text-green-700 border-green-200',
    dot: 'bg-green-500',
    icon: '✓',
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    icon: '!',
  },
  completed: {
    label: 'Completed',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
    icon: '✓',
  },
}

const CROP_ICONS: Record<string, string> = {
  Wheat: '🌾',
  Rice: '🌾',
  Mustard: '🌼',
  Potato: '🥔',
  Onion: '🧅',
  Sugarcane: '🎋',
  Soybean: '🌱',
  Maize: '🌽',
}

function MyBookingsPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [bookings, setBookings] = useState<BackendBooking[]>([])
  const [procurements, setProcurements] = useState<Procurement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
  const loadBookings = async () => {
    try {
      setLoading(true)
      setError('')

      const [bookingData, procurementData] = await Promise.all([
        apiClient<BackendBooking[]>('/bookings/my'),
        getMyProcurements(),
      ])

      setBookings(bookingData)
      setProcurements(procurementData)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load your bookings.',
      )
    } finally {
      setLoading(false)
    }
  }

  void loadBookings()
}, [])

  const confirmedCount = bookings.filter(
    (booking) => booking.status === 'confirmed',
  ).length

  const inProgressCount = bookings.filter(
    (booking) => booking.status === 'in_progress',
  ).length

  const completedCount = bookings.filter(
    (booking) => booking.status === 'completed',
  ).length

  const filteredBookings = useMemo(() => {
    if (activeFilter === 'all') {
      return bookings
    }

    return bookings.filter((booking) => booking.status === activeFilter)
  }, [activeFilter, bookings])

  const upcomingBooking = useMemo(() => {
    return (
      bookings
        .filter(
          (booking) =>
            booking.status === 'confirmed' ||
            booking.status === 'in_progress',
        )
        .sort((a, b) => {
          const dateTimeA = new Date(
            `${a.slot_date}T${a.start_time}`,
          ).getTime()

          const dateTimeB = new Date(
            `${b.slot_date}T${b.start_time}`,
          ).getTime()

          return dateTimeA - dateTimeB
        })[0] ?? null
    )
  }, [bookings])

  const getStatusMeta = (status: string) =>
    STATUS_META[status] ?? {
      label: status,
      className: 'bg-slate-50 text-slate-700 border-slate-200',
      dot: 'bg-slate-400',
      icon: '•',
    }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-green-100">
        <div className="max-w-6xl px-4 py-6 mx-auto sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-semibold tracking-wide text-green-800 uppercase border border-green-200 rounded-full bg-green-50">
                <span>📋</span>
                Farmer Procurement Records
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                My Mandi Bookings
              </h1>

              <p className="max-w-2xl mt-2 text-sm leading-6 text-slate-500">
                View your scheduled mandi visits, procurement history and
                booking status in one place.
              </p>
            </div>

            <Link
              to="/farmer/book-slot"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white transition-all bg-green-700 shadow-sm rounded-xl hover:bg-green-800 hover:shadow-md"
            >
              <span className="text-lg">+</span>
              New Booking
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-6xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        {loading && (
          <div className="p-6 mb-8 text-sm text-center bg-white border rounded-2xl border-slate-200 text-slate-500">
            Loading your bookings...
          </div>
        )}

        {error && (
          <div className="p-4 mb-8 text-sm text-red-700 border border-red-200 rounded-2xl bg-red-50">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-4">
          <div className="p-5 bg-white border shadow-sm rounded-2xl border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide uppercase text-slate-400">
                  Total Bookings
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {bookings.length}
                </p>
              </div>

              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-slate-100">
                📋
              </div>
            </div>
          </div>

          <div className="p-5 bg-white border border-green-100 shadow-sm rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide text-green-600 uppercase">
                  Confirmed
                </p>

                <p className="mt-2 text-3xl font-bold text-green-800">
                  {confirmedCount}
                </p>
              </div>

              <div className="flex items-center justify-center text-green-700 w-11 h-11 bg-green-50 rounded-xl">
                ✓
              </div>
            </div>
          </div>

          <div className="p-5 bg-white border shadow-sm border-amber-100 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide uppercase text-amber-600">
                  In Progress
                </p>

                <p className="mt-2 text-3xl font-bold text-amber-800">
                  {inProgressCount}
                </p>
              </div>

              <div className="flex items-center justify-center text-amber-700 w-11 h-11 bg-amber-50 rounded-xl">
                !
              </div>
            </div>
          </div>

          <div className="p-5 bg-white border border-blue-100 shadow-sm rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
                  Completed
                </p>

                <p className="mt-2 text-3xl font-bold text-blue-800">
                  {completedCount}
                </p>
              </div>

              <div className="flex items-center justify-center text-blue-700 w-11 h-11 bg-blue-50 rounded-xl">
                ✓
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Booking */}
        {upcomingBooking && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-semibold tracking-widest text-green-700 uppercase">
                  Next Visit
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Your Upcoming Mandi Visit
                </h2>
              </div>

              {(() => {
                const status = getStatusMeta(upcomingBooking.status)

                return (
                  <span
                    className={`hidden px-3 py-1 text-xs font-semibold border rounded-full sm:inline-flex ${status.className}`}
                  >
                    {status.icon} {status.label}
                  </span>
                )
              })()}
            </div>

            <div className="relative overflow-hidden bg-white border border-green-200 shadow-sm rounded-2xl">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-green-700" />

              <div className="p-6">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center flex-shrink-0 text-2xl w-14 h-14 bg-green-50 rounded-2xl">
                      🏪
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-bold text-slate-900">
                          {upcomingBooking.mandi_name}
                        </h3>

                        {(() => {
                          const status = getStatusMeta(
                            upcomingBooking.status,
                          )

                          return (
                            <span
                              className={`px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase border rounded-full ${status.className}`}
                            >
                              {status.label}
                            </span>
                          )
                        })()}
                      </div>

                      <p className="mt-1 text-xs text-slate-500">
                        Booking ID: {upcomingBooking.booking_code}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5 sm:grid-cols-4 lg:min-w-[560px]">
                    <div>
                      <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                        Date
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-900">
                        {formatDate(upcomingBooking.slot_date)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                        Time
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-900">
                        {upcomingBooking.start_time} -{' '}
                        {upcomingBooking.end_time}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                        Produce
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-900">
                        {CROP_ICONS[upcomingBooking.crop_type] ?? '🌾'}{' '}
                        {upcomingBooking.crop_type}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                        Vehicle
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-900">
                        {upcomingBooking.vehicle_number}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-3 border-t border-green-100 bg-green-50/60">
                <div className="flex items-center gap-2 text-xs text-green-800">
                  <span>🛡️</span>

                  <span>
                    Keep this booking ID available when you arrive at the
                    procurement centre.
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Filter */}
        <div className="p-2 mb-5 overflow-x-auto bg-white border shadow-sm rounded-2xl border-slate-200">
          <div className="flex gap-2 min-w-max">
            {[
              {
                id: 'all',
                label: 'All Bookings',
                count: bookings.length,
              },
              {
                id: 'confirmed',
                label: 'Confirmed',
                count: confirmedCount,
              },
              {
                id: 'in_progress',
                label: 'In Progress',
                count: inProgressCount,
              },
              {
                id: 'completed',
                label: 'Completed',
                count: completedCount,
              },
            ].map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeFilter === filter.id
                    ? 'bg-green-700 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {filter.label}

                <span
                  className={`ml-2 text-xs ${
                    activeFilter === filter.id
                      ? 'text-green-100'
                      : 'text-slate-400'
                  }`}
                >
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Booking List */}
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center bg-white border shadow-sm rounded-2xl border-slate-200">
            <div className="flex items-center justify-center w-16 h-16 mx-auto text-3xl rounded-2xl bg-slate-100">
              📋
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              No bookings found
            </h3>

            <p className="max-w-sm mx-auto mt-2 text-sm leading-6 text-slate-500">
              There are no bookings under the selected filter.
            </p>

            <Link
              to="/farmer/book-slot"
              className="inline-flex items-center gap-2 px-5 py-3 mt-5 text-sm font-semibold text-white bg-green-700 rounded-xl hover:bg-green-800"
            >
              + Book a Mandi Slot
            </Link>
          </div>
        ) : (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-slate-400">
                  Procurement History
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Your Bookings
                </h2>
              </div>

              <span className="text-xs text-slate-400">
                {filteredBookings.length} record
                {filteredBookings.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="space-y-4">
              {filteredBookings.map((booking) => {
                const status = getStatusMeta(booking.status)

                const procurement = procurements.find(
                  (item) => item.booking_id === booking.id,
                )

                return (
                  <div
                    key={booking.booking_code}
                    className="overflow-hidden transition-all bg-white border shadow-sm rounded-2xl border-slate-200 hover:shadow-md hover:border-green-200"
                  >
                    {/* Card Header */}
                    <div className="p-5 border-b border-slate-100">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-4">
                          <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-lg rounded-xl bg-green-50">
                            🏪
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-bold text-slate-900">
                                {booking.mandi_name}
                              </h3>

                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold border rounded-full ${status.className}`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                                />

                                {status.label}
                              </span>
                            </div>

                            <p className="mt-1 text-xs text-slate-400">
                              Booking ID: {booking.booking_code}
                            </p>
                          </div>
                        </div>

                        <div className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-50 text-slate-600">
                          🚜 {booking.vehicle_number}
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-4 p-5 md:grid-cols-4">
                      <div>
                        <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                          Visit Date
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          📅 {formatDate(booking.slot_date)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                          Time Slot
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          🕐 {booking.start_time} - {booking.end_time}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                          Crop
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {CROP_ICONS[booking.crop_type] ?? '🌾'}{' '}
                          {booking.crop_type}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                          Quantity
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {booking.quantity} quintal
                        </p>
                      </div>
                    </div>

                    {booking.status === 'completed' && procurement && (
  <div className="grid grid-cols-2 gap-4 px-5 py-4 border-t border-green-100 bg-green-50/50 md:grid-cols-4">
    <div>
      <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
        Weighed Quantity
      </p>
      <p className="mt-1 text-sm font-bold text-slate-900">
        {procurement.weighed_quantity} quintal
      </p>
    </div>

    <div>
      <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
        Quality
      </p>
      <p className="mt-1 text-sm font-bold text-slate-900">
        {procurement.quality_grade}
      </p>
    </div>

    <div>
      <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
        Procurement Amount
      </p>
      <p className="mt-1 text-sm font-bold text-green-700">
        ₹{procurement.procurement_amount.toLocaleString('en-IN')}
      </p>
    </div>

    <div>
      <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
        Payment
      </p>
      <p
        className={`mt-1 text-sm font-bold capitalize ${
          procurement.payment_status === 'paid'
            ? 'text-green-700'
            : 'text-orange-600'
        }`}
      >
        {procurement.payment_status}
      </p>
    </div>
  </div>
)}

                    {/* Footer */}
                    <div className="flex flex-col gap-3 px-5 py-4 border-t bg-slate-50/70 border-slate-100 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs text-slate-500">
                        {booking.status === 'confirmed'
                          ? '✓ Your mandi visit is confirmed.'
                          : booking.status === 'in_progress'
                            ? 'Your procurement visit is currently in progress.'
                            : booking.status === 'completed'
                              ? '✓ Procurement visit completed.'
                              : 'Booking status is unavailable.'}
                      </p>

                      {booking.status === 'confirmed' && (
                        <button
                          type="button"
                          className="px-4 py-2 text-xs font-semibold text-green-700 transition-colors bg-white border border-green-200 rounded-lg hover:bg-green-50"
                        >
                          View Booking ID
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default MyBookingsPage
