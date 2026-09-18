import { useEffect, useMemo, useState } from 'react'
import { getMandiBookings, type MandiBooking } from '../../api/bookingApi'
import { getMandis, type BackendMandi } from '../../api/mandiApi'
import { useAuth } from '../../store/authStore'
import ProcurementCell from './ProcurementCell'

type BookingStatus =
  | 'confirmed'
  | 'in_progress'
  | 'completed'

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number)

  const date = new Date()
  date.setHours(hours, minutes, 0, 0)

  return date.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-blue-50 text-blue-700 border-blue-200'

    case 'in_progress':
      return 'bg-orange-50 text-orange-700 border-orange-200'

    case 'completed':
      return 'bg-green-50 text-green-700 border-green-200'

    default:
      return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

const getCropIcon = (crop: string) => {
  const normalizedCrop = crop.toLowerCase()

  if (normalizedCrop.includes('wheat')) return '🌾'
  if (normalizedCrop.includes('rice')) return '🌾'
  if (normalizedCrop.includes('maize')) return '🌽'
  if (
    normalizedCrop.includes('vegetable') ||
    normalizedCrop.includes('potato') ||
    normalizedCrop.includes('tomato')
  ) {
    return '🥬'
  }

  return '🌱'
}

function SectionTitle({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>

      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
    </div>
  )
}

function BookingsPage() {
  const { user } = useAuth()

  const [mandis, setMandis] = useState<BackendMandi[]>([])
  const [bookings, setBookings] = useState<MandiBooking[]>([])
  const [statusFilter, setStatusFilter] = useState<
    'all' | BookingStatus
  >('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const loadBookings = async () => {
      if (!user?.id) {
        setError('Unable to identify the logged-in mandi owner.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')

        const mandiData = await getMandis()

        if (cancelled) return

        setMandis(mandiData)

        const ownerMandi = mandiData.find(
          (mandi) => mandi.owner_id === Number(user.id),
        )

        if (!ownerMandi) {
          setBookings([])
          setError('No active mandi is assigned to your account.')
          return
        }

        const bookingData = await getMandiBookings(ownerMandi.id)

        if (cancelled) return

        setBookings(bookingData)
      } catch (err) {
        if (cancelled) return

        console.error('Failed to load mandi bookings:', err)

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load booking records.',
        )
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadBookings()

    return () => {
      cancelled = true
    }
  }, [user?.id])

  const currentMandi = useMemo(() => {
    if (!user?.id) return undefined

    return mandis.find(
      (mandi) => mandi.owner_id === Number(user.id),
    )
  }, [mandis, user?.id])

  const filteredBookings = useMemo(() => {
    const searchText = search.trim().toLowerCase()

    return bookings.filter((booking) => {
      const matchesStatus =
        statusFilter === 'all' ||
        booking.status === statusFilter

      if (!searchText) {
        return matchesStatus
      }

      const matchesSearch =
        booking.booking_code.toLowerCase().includes(searchText) ||
        booking.farmer_name.toLowerCase().includes(searchText) ||
        booking.crop_type.toLowerCase().includes(searchText) ||
        booking.vehicle_number.toLowerCase().includes(searchText)

      return matchesStatus && matchesSearch
    })
  }, [bookings, search, statusFilter])

  const totalBookings = bookings.length

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === 'confirmed',
  ).length

  const completedBookings = bookings.filter(
    (booking) => booking.status === 'completed',
  ).length

  const inProgressBookings = bookings.filter(
    (booking) => booking.status === 'in_progress',
  ).length

  const bookedQuantity = bookings.reduce(
  (sum, booking) => sum + booking.quantity,
  0,
)

  const sourceCounts = bookings.reduce(
    (counts, booking) => {
      const source = booking.booking_source || 'self'

      if (source === 'assisted') {
        counts.assisted += 1
      } else if (source === 'walk-in') {
        counts.walkIn += 1
      } else {
        counts.self += 1
      }

      return counts
    },
    {
      self: 0,
      assisted: 0,
      walkIn: 0,
    },
  )

  const statusTotal = bookings.length || 1

  const statusDistribution = [
    {
      label: 'Confirmed',
      value: Math.round(
        (confirmedBookings / statusTotal) * 100,
      ),
      count: confirmedBookings,
      className: 'bg-blue-600',
    },
    {
      label: 'In Progress',
      value: Math.round(
        (inProgressBookings / statusTotal) * 100,
      ),
      count: inProgressBookings,
      className: 'bg-orange-500',
    },
    {
      label: 'Completed',
      value: Math.round(
        (completedBookings / statusTotal) * 100,
      ),
      count: completedBookings,
      className: 'bg-green-600',
    },

  ]

  const cropDistribution = useMemo(() => {
    const counts = new Map<string, number>()

    bookings.forEach((booking) => {
      const crop = booking.crop_type || 'Other'
      counts.set(crop, (counts.get(crop) ?? 0) + 1)
    })

    return Array.from(counts.entries())
      .map(([label, count]) => ({
        label,
        count,
        percentage: Math.round(
          (count / (bookings.length || 1)) * 100,
        ),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
  }, [bookings])

  const vehicleDistribution = useMemo(() => {
    const counts = new Map<string, number>()

    bookings.forEach((booking) => {
      const vehicleType = booking.vehicle_type || 'Other'
      counts.set(
        vehicleType,
        (counts.get(vehicleType) ?? 0) + 1,
      )
    })

    return Array.from(counts.entries())
      .map(([label, count]) => ({
        label,
        count,
        percentage: Math.round(
          (count / (bookings.length || 1)) * 100,
        ),
      }))
      .sort((a, b) => b.count - a.count)
  }, [bookings])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto space-y-8 max-w-7xl sm:px-6 lg:px-8">

        {/* Header */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 mb-3 text-xs font-bold text-green-700 border border-green-200 rounded-full bg-green-50">
                MANDI OPERATIONS
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Booking Management
              </h1>

              <p className="max-w-3xl mt-2 text-sm leading-6 text-gray-500">
                Monitor live farmer bookings, vehicle movement,
                booking status and produce volume for your mandi.
              </p>

              {currentMandi && (
                <p className="mt-2 text-sm font-semibold text-green-700">
                  {currentMandi.name}
                  {currentMandi.location
                    ? ` • ${currentMandi.location}`
                    : ''}
                </p>
              )}
            </div>

            <div className="p-4 border border-green-200 rounded-xl bg-green-50">
              <p className="text-xs font-semibold tracking-wide text-green-700 uppercase">
                Centre Status
              </p>

              <div className="flex items-center gap-2 mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />

                <span className="font-bold text-green-800">
                  {loading
                    ? 'Loading bookings'
                    : 'Booking System Active'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 text-sm text-red-800 border border-red-200 rounded-xl bg-red-50">
            {error}
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <p className="text-sm font-medium text-gray-500">
              Total Bookings
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {loading ? '—' : totalBookings}
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Live booking records
            </p>
          </div>

          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <p className="text-sm font-medium text-gray-500">
              Confirmed
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-700">
              {loading ? '—' : confirmedBookings}
            </p>

            <p className="mt-2 text-xs text-blue-600">
              Upcoming farmer visits
            </p>
          </div>

          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <p className="text-sm font-medium text-gray-500">
              Completed
            </p>

            <p className="mt-2 text-3xl font-bold text-green-700">
              {loading ? '—' : completedBookings}
            </p>

            <p className="mt-2 text-xs text-green-600">
              Successfully processed
            </p>
          </div>
        </div>

        {/* Operational Summary */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <p className="text-sm font-medium text-gray-500">
              Booked Quantity
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {loading ? '—' : `${bookedQuantity} Q`}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Total quantity across live booking records
            </p>
          </div>

          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <p className="text-sm font-medium text-gray-500">
              In Progress
            </p>

            <p className="mt-2 text-2xl font-bold text-orange-600">
              {loading ? '—' : inProgressBookings}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Currently being processed
            </p>
          </div>

          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <p className="text-sm font-medium text-gray-500">
              Booking Sources
            </p>

            <div className="mt-3 space-y-1 text-sm">
              <p className="text-gray-700">
                Self: <span className="font-bold">{sourceCounts.self}</span>
              </p>

              <p className="text-gray-700">
                Assisted:{' '}
                <span className="font-bold">
                  {sourceCounts.assisted}
                </span>
              </p>

              <p className="text-gray-700">
                Walk-in:{' '}
                <span className="font-bold">
                  {sourceCounts.walkIn}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div>
          <SectionTitle
            title="Booking Analytics"
            description="Live distributions calculated from booking records returned by the mandi API."
          />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

            {/* Status Distribution */}
            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
              <div className="mb-5">
                <h3 className="font-bold text-gray-900">
                  Booking Status Distribution
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Current status breakdown of live bookings
                </p>
              </div>

              <div className="space-y-4">
                {statusDistribution.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-3 h-3 rounded-full ${item.className}`}
                        />

                        <span className="text-sm font-medium text-gray-700">
                          {item.label}
                        </span>
                      </div>

                      <span className="text-sm font-bold text-gray-900">
                        {item.count} ({item.value}%)
                      </span>
                    </div>

                    <div className="w-full h-2 overflow-hidden bg-gray-100 rounded-full">
                      <div
                        className={`h-full rounded-full ${item.className}`}
                        style={{
                          width: `${item.value}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Crop Distribution */}
            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
              <div className="mb-5">
                <h3 className="font-bold text-gray-900">
                  Crop-wise Bookings
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Distribution calculated from current booking records
                </p>
              </div>

              {cropDistribution.length === 0 ? (
                <p className="py-8 text-sm text-center text-gray-500">
                  No crop booking data available.
                </p>
              ) : (
                <div className="space-y-5">
                  {cropDistribution.map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {getCropIcon(item.label)}
                          </span>

                          <span className="text-sm font-medium text-gray-700">
                            {item.label}
                          </span>
                        </div>

                        <span className="text-sm font-bold text-gray-900">
                          {item.percentage}%
                        </span>
                      </div>

                      <div className="w-full h-3 overflow-hidden bg-gray-100 rounded-full">
                        <div
                          className="h-full bg-green-600 rounded-full"
                          style={{
                            width: `${item.percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Vehicle Distribution */}
            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl xl:col-span-2">
              <div className="mb-5">
                <h3 className="font-bold text-gray-900">
                  Vehicle Type Distribution
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Incoming farmer vehicles from live booking records
                </p>
              </div>

              {vehicleDistribution.length === 0 ? (
                <p className="py-8 text-sm text-center text-gray-500">
                  No vehicle booking data available.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {vehicleDistribution.map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {item.label}
                        </span>

                        <span className="text-sm font-bold text-gray-900">
                          {item.count} ({item.percentage}%)
                        </span>
                      </div>

                      <div className="w-full h-3 overflow-hidden bg-gray-100 rounded-full">
                        <div
                          className="h-full bg-green-600 rounded-full"
                          style={{
                            width: `${item.percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All Bookings' },
                { key: 'confirmed', label: 'Confirmed' },
                { key: 'in_progress', label: 'In Progress' },
                { key: 'completed', label: 'Completed' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() =>
                    setStatusFilter(
                      tab.key as 'all' | BookingStatus,
                    )
                  }
                  className={`px-4 py-2 text-sm font-semibold rounded-lg border transition ${
                    statusFilter === tab.key
                      ? 'bg-green-700 text-white border-green-700'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="w-full xl:w-80">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ID, farmer, crop or vehicle..."
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-300 rounded-lg outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>
          </div>
        </div>

        {/* Booking Registry */}
        <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Booking Registry
                </h2>

                <p className="text-sm text-gray-500">
                  Live farmer booking records
                </p>
              </div>

              <div className="text-sm font-semibold text-gray-500">
                Showing {filteredBookings.length} records
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead>
                <tr className="text-xs tracking-wide text-left text-gray-500 uppercase bg-gray-50">
                  <th className="px-6 py-4">Booking</th>
                  <th className="px-6 py-4">Farmer</th>
                  <th className="px-6 py-4">Crop</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Vehicle</th>
                  <th className="px-6 py-4">Visit</th>
                  <th className="px-6 py-4">Source</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Procurement</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-green-700">
                        {booking.booking_code}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Booking #{booking.id}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">
                        {booking.farmer_name}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Farmer ID: {booking.farmer_id}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {getCropIcon(booking.crop_type)}
                        </span>

                        <span className="font-medium text-gray-800">
                          {booking.crop_type}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-800">
                        {booking.quantity} Q
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">
                        {booking.vehicle_number}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {booking.vehicle_type}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">
                        {formatDate(booking.slot_date)}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {formatTime(booking.start_time)} -{' '}
                        {formatTime(booking.end_time)}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1.5 text-xs font-bold capitalize border rounded-full bg-gray-50 text-gray-700 border-gray-200">
                        {booking.booking_source.replace('-', ' ')}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1.5 text-xs font-bold capitalize border rounded-full ${getStatusStyles(
                          booking.status,
                        )}`}
                      >
                        {booking.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="px-6 py-4">
  {booking.status === 'completed' ? (
    <ProcurementCell
      bookingId={booking.id}
      bookedQuantity={booking.quantity}
    />
  ) : (
    <span className="text-xs text-gray-400">
      Available after completion
    </span>
  )}
</td>
                  </tr>
                ))}

                {filteredBookings.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-16 text-center"
                    >
                      <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center mb-4 text-2xl bg-gray-100 rounded-full w-14 h-14">
                          🔎
                        </div>

                        <h3 className="font-bold text-gray-900">
                          No bookings found
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {search
                            ? 'Try changing the search text or status filter.'
                            : 'No booking records are currently available for this mandi.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}

                {loading && (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-16 text-sm text-center text-gray-500"
                    >
                      Loading live booking records...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Note */}
        <div className="flex items-start gap-3 p-5 border border-green-200 rounded-2xl bg-green-50">
          <span className="mt-0.5 text-lg">✓</span>

          <div>
            <p className="text-sm font-bold text-green-900">
              Live operations data
            </p>

            <p className="mt-1 text-xs leading-5 text-green-800">
              Booking records, status counts, produce volume,
              booking sources, crop distribution and vehicle
              distribution are calculated from the live mandi
              booking API. Revenue and farmer phone data are not
              displayed because those fields are not currently
              provided by the backend booking API.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingsPage
