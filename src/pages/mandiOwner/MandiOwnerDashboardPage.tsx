import { useEffect, useMemo, useState } from 'react'
import {
  getMandiBookings,
  type MandiBooking,
} from '../../api/bookingApi'
import type { BackendMandi } from '../../api/mandiApi'
import { getCropPrices, getMandis } from '../../api/mandiApi'
import { getSlots, type BackendSlot } from '../../api/slotApi'
import type { CropPrice } from '../../types'
import { formatIndianCurrency } from '../../utils/formatters'

const STATUS_META: Record<
  string,
  {
    label: string
    badge: string
    dot: string
  }
> = {
  completed: {
    label: 'Completed',
    badge: 'bg-green-50 text-green-700 border-green-200',
    dot: 'bg-green-500',
  },
  in_progress: {
    label: 'Processing',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
  },
  confirmed: {
    label: 'In Queue',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  cancelled: {
    label: 'Cancelled',
    badge: 'bg-red-50 text-red-700 border-red-200',
    dot: 'bg-red-500',
  },
  pending: {
    label: 'Pending',
    badge: 'bg-slate-50 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
  },
}

const CROP_ICONS: Record<string, string> = {
  Wheat: '🌾',
  Rice: '🌾',
  Potato: '🥔',
  Mustard: '🌼',
  Onion: '🧅',
  Sugarcane: '🎋',
  Soybean: '🌱',
  Maize: '🌽',
}

function getTodayString() {
  return new Date().toISOString().split('T')[0]
}

function getDateDaysAgo(days: number) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString().split('T')[0]
}

function formatSlotTime(booking: MandiBooking) {
  const start = new Date(
    `1970-01-01T${booking.start_time}`,
  ).toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  })

  const end = new Date(
    `1970-01-01T${booking.end_time}`,
  ).toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  })

  return `${start} - ${end}`
}

function formatHour(hour: number) {
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12

  return `${displayHour} ${suffix}`
}

function MandiOwnerDashboardPage() {
  const [mandis, setMandis] = useState<BackendMandi[]>([])
  const [prices, setPrices] = useState<CropPrice[]>([])
  const [bookings, setBookings] = useState<MandiBooking[]>([])
  const [slots, setSlots] = useState<BackendSlot[]>([])

  const [loading, setLoading] = useState(true)
  const [loadingBookings, setLoadingBookings] = useState(true)
  const [loadingSlots, setLoadingSlots] = useState(true)

  const [bookingError, setBookingError] = useState('')
  const [slotError, setSlotError] = useState('')

  const currentMandi = mandis[0]

  useEffect(() => {
    async function fetchBaseData() {
      try {
        const [mandiData, priceData] = await Promise.all([
          getMandis(),
          getCropPrices(),
        ])

        setMandis(mandiData)
        setPrices(priceData)
      } catch {
        setMandis([])
        setPrices([])
      } finally {
        setLoading(false)
      }
    }

    fetchBaseData()
  }, [])

  useEffect(() => {
    if (!currentMandi) {
      setLoadingBookings(false)
      setLoadingSlots(false)
      return
    }

    async function fetchMandiData() {
      setLoadingBookings(true)
      setLoadingSlots(true)
      setBookingError('')
      setSlotError('')

      const today = getTodayString()

      const [bookingResult, slotResult] = await Promise.allSettled([
        getMandiBookings(currentMandi.id),
        getSlots(String(currentMandi.id), today),
      ])

      if (bookingResult.status === 'fulfilled') {
        setBookings(bookingResult.value)
      } else {
        setBookings([])
        setBookingError(
          bookingResult.reason instanceof Error
            ? bookingResult.reason.message
            : 'Failed to load mandi bookings.',
        )
      }

      if (slotResult.status === 'fulfilled') {
        setSlots(slotResult.value)
      } else {
        setSlots([])
        setSlotError(
          slotResult.reason instanceof Error
            ? slotResult.reason.message
            : 'Failed to load mandi slots.',
        )
      }

      setLoadingBookings(false)
      setLoadingSlots(false)
    }

    fetchMandiData()
  }, [currentMandi])

  const today = getTodayString()

  const todayBookings = useMemo(
    () =>
      bookings.filter(
        (booking) => booking.slot_date === today,
      ),
    [bookings, today],
  )

  const activeQueue = useMemo(
    () =>
      todayBookings.filter(
        (booking) =>
          booking.status === 'confirmed' ||
          booking.status === 'in_progress',
      ),
    [todayBookings],
  )

  const completedToday = useMemo(
    () =>
      todayBookings.filter(
        (booking) => booking.status === 'completed',
      ),
    [todayBookings],
  )

  const cancelledToday = useMemo(
    () =>
      todayBookings.filter(
        (booking) => booking.status === 'cancelled',
      ),
    [todayBookings],
  )

  const procurementToday = useMemo(
    () =>
      completedToday.reduce(
        (total, booking) => total + Number(booking.quantity || 0),
        0,
      ),
    [completedToday],
  )

  const arrivalProgress =
    todayBookings.length > 0
      ? Math.round(
          ((completedToday.length + activeQueue.length) /
            todayBookings.length) *
            100,
        )
      : 0

  const completionProgress =
    todayBookings.length > 0
      ? Math.round(
          (completedToday.length / todayBookings.length) * 100,
        )
      : 0

  const nextBooking = useMemo(
    () =>
      todayBookings.find(
        (booking) => booking.status === 'in_progress',
      ) ??
      todayBookings.find(
        (booking) => booking.status === 'confirmed',
      ),
    [todayBookings],
  )

  const hourlyArrivals = useMemo(() => {
    const hours = new Map<number, number>()

    todayBookings.forEach((booking) => {
      const hour = Number(
        booking.start_time.split(':')[0],
      )

      if (Number.isFinite(hour)) {
        hours.set(hour, (hours.get(hour) ?? 0) + 1)
      }
    })

    return Array.from({ length: 8 }, (_, index) => {
      const hour = 6 + index

      return {
        label: formatHour(hour),
        value: hours.get(hour) ?? 0,
      }
    })
  }, [todayBookings])

  const maxHourlyArrival = Math.max(
    ...hourlyArrivals.map((item) => item.value),
    1,
  )

  const weeklyProcurement = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = getDateDaysAgo(6 - index)

      const value = bookings
        .filter(
          (booking) =>
            booking.slot_date === date &&
            booking.status === 'completed',
        )
        .reduce(
          (total, booking) =>
            total + Number(booking.quantity || 0),
          0,
        )

      const dateObject = new Date(`${date}T00:00:00`)

      return {
        day: dateObject.toLocaleDateString('en-IN', {
          weekday: 'short',
        }),
        value,
      }
    })
  }, [bookings])

  const maxWeeklyValue = Math.max(
    ...weeklyProcurement.map((item) => item.value),
    1,
  )

  const cropDistribution = useMemo(() => {
    const cropTotals = new Map<string, number>()

    completedToday.forEach((booking) => {
      const crop = booking.crop_type || 'Other'
      const quantity = Number(booking.quantity || 0)

      cropTotals.set(
        crop,
        (cropTotals.get(crop) ?? 0) + quantity,
      )
    })

    const total = Array.from(cropTotals.values()).reduce(
      (sum, value) => sum + value,
      0,
    )

    return Array.from(cropTotals.entries())
      .map(([name, value]) => ({
        name,
        value:
          total > 0
            ? Math.round((value / total) * 100)
            : 0,
        quantity: value,
        icon: CROP_ICONS[name] ?? '🌱',
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)
  }, [completedToday])

  const totalSlotCapacity = useMemo(
    () =>
      slots.reduce(
        (total, slot) =>
          total + Number(slot.total_slots || 0),
        0,
      ),
    [slots],
  )

  const bookedSlotCapacity = useMemo(
    () =>
      slots.reduce(
        (total, slot) =>
          total + Number(slot.booked_slots || 0),
        0,
      ),
    [slots],
  )

  const slotUtilization = useMemo(
    () =>
      slots.map((slot) => ({
        id: slot.id,
        label: `${new Date(
          `1970-01-01T${slot.start_time}`,
        ).toLocaleTimeString('en-IN', {
          hour: 'numeric',
          minute: '2-digit',
        })} - ${new Date(
          `1970-01-01T${slot.end_time}`,
        ).toLocaleTimeString('en-IN', {
          hour: 'numeric',
          minute: '2-digit',
        })}`,
        booked: slot.booked_slots,
        total: slot.total_slots,
        percentage:
          slot.total_slots > 0
            ? Math.round(
                (slot.booked_slots / slot.total_slots) *
                  100,
              )
            : 0,
      })),
    [slots],
  )

  const recentActivity = useMemo(
    () =>
      [...todayBookings]
        .sort(
          (a, b) =>
            new Date(b.updated_at).getTime() -
            new Date(a.updated_at).getTime(),
        )
        .slice(0, 4),
    [todayBookings],
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-green-100">
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-semibold tracking-wide text-green-800 uppercase border border-green-200 rounded-full bg-green-50">
                <span>🏪</span>
                Mandi Operations Control Center
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {currentMandi?.name || 'Mandi'} Dashboard
              </h1>

              <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-slate-500">
                <span>
                  📍{' '}
                  {currentMandi?.location ||
                    'Location unavailable'}
                </span>

                <span>•</span>

                <span className="inline-flex items-center gap-1 text-green-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  {currentMandi?.is_active
                    ? 'Centre Active'
                    : 'Centre Inactive'}
                </span>

                <span>•</span>

                <span>Live operations monitoring</span>
              </div>
            </div>

            <div className="p-4 bg-white border shadow-sm rounded-2xl border-slate-200">
              <p className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
                Operations Date
              </p>

              <p className="mt-1 text-sm font-bold text-slate-900">
                {new Date().toLocaleDateString('en-IN', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>

              <p className="mt-1 text-xs text-green-700">
                Live data from mandi operations
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* KPI ROW */}
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <div className="p-5 bg-white border border-green-100 shadow-sm rounded-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide text-green-600 uppercase">
                  Today's Arrivals
                </p>

                <p className="mt-2 text-3xl font-bold text-green-800">
                  {todayBookings.length}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Real booking records for today
                </p>
              </div>

              <div className="flex items-center justify-center text-lg w-11 h-11 rounded-xl bg-green-50">
                👨‍🌾
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between mb-1 text-[11px] text-slate-400">
                <span>Processing progress</span>
                <span>{arrivalProgress}%</span>
              </div>

              <div className="w-full h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width: `${Math.min(
                      arrivalProgress,
                      100,
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="p-5 bg-white border border-blue-100 shadow-sm rounded-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
                  Today's Revenue
                </p>

                <p className="mt-2 text-2xl font-bold text-blue-800">
                  Not available
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  No financial amount is stored in booking data
                </p>
              </div>

              <div className="flex items-center justify-center text-lg w-11 h-11 rounded-xl bg-blue-50">
                ₹
              </div>
            </div>
          </div>

          <div className="p-5 bg-white border shadow-sm rounded-2xl border-amber-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide uppercase text-amber-600">
                  Active Queue
                </p>

                <p className="mt-2 text-3xl font-bold text-amber-800">
                  {activeQueue.length}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Confirmed + processing bookings
                </p>
              </div>

              <div className="flex items-center justify-center text-lg w-11 h-11 rounded-xl bg-amber-50">
                ⏳
              </div>
            </div>

            <p className="mt-4 text-xs font-semibold text-amber-700">
              {activeQueue.filter(
                (booking) =>
                  booking.status === 'confirmed',
              ).length}{' '}
              waiting •{' '}
              {activeQueue.filter(
                (booking) =>
                  booking.status === 'in_progress',
              ).length}{' '}
              processing
            </p>
          </div>

          <div className="p-5 bg-white border border-purple-100 shadow-sm rounded-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide text-purple-600 uppercase">
                  Procurement Volume
                </p>

                <p className="mt-2 text-3xl font-bold text-purple-800">
                  {procurementToday.toLocaleString('en-IN')}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Quintal completed today
                </p>
              </div>

              <div className="flex items-center justify-center text-lg w-11 h-11 rounded-xl bg-purple-50">
                📦
              </div>
            </div>
          </div>
        </div>

        {/* LIVE QUEUE + TODAY'S BOOKINGS */}
        <div className="grid gap-6 mt-8 lg:grid-cols-[1.6fr_0.9fr]">
          <section className="overflow-hidden bg-white border shadow-sm rounded-2xl border-slate-200">
            <div className="flex flex-col gap-3 px-5 py-5 border-b sm:flex-row sm:items-center sm:justify-between border-slate-100">
              <div>
                <p className="text-xs font-semibold tracking-widest text-green-700 uppercase">
                  Live Operations
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Today's Procurement Queue
                </h2>
              </div>

              <span className="inline-flex items-center self-start gap-2 px-3 py-1.5 text-xs font-bold text-green-700 border border-green-200 rounded-full bg-green-50">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                Live
              </span>
            </div>

            <div className="overflow-x-auto">
              {loadingBookings ? (
                <div className="p-8 text-sm text-center text-slate-500">
                  Loading live bookings...
                </div>
              ) : bookingError ? (
                <div className="p-8 text-sm text-center text-red-600">
                  {bookingError}
                </div>
              ) : todayBookings.length === 0 ? (
                <div className="p-8 text-sm text-center text-slate-500">
                  No bookings found for today.
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-5 py-3 font-semibold text-left text-slate-500">
                        Farmer
                      </th>

                      <th className="px-5 py-3 font-semibold text-left text-slate-500">
                        Crop
                      </th>

                      <th className="px-5 py-3 font-semibold text-left text-slate-500">
                        Vehicle
                      </th>

                      <th className="px-5 py-3 font-semibold text-left text-slate-500">
                        Slot
                      </th>

                      <th className="px-5 py-3 font-semibold text-left text-slate-500">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {todayBookings.map((booking) => {
                      const status =
                        STATUS_META[booking.status] ??
                        STATUS_META.pending

                      return (
                        <tr
                          key={booking.id}
                          className="transition-colors hover:bg-green-50/40"
                        >
                          <td className="px-5 py-4">
                            <p className="font-semibold text-slate-900">
                              {booking.farmer_name}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              #{booking.booking_code}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <p className="font-medium text-slate-800">
                              {CROP_ICONS[
                                booking.crop_type
                              ] ?? '🌾'}{' '}
                              {booking.crop_type}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              {booking.quantity} quintal
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <p className="font-mono text-xs text-slate-600">
                              {booking.vehicle_number}
                            </p>

                            <p className="mt-0.5 text-[10px] text-slate-400">
                              {booking.vehicle_type}
                            </p>
                          </td>

                          <td className="px-5 py-4 font-medium text-slate-700">
                            <p>{formatSlotTime(booking)}</p>

                            <p className="mt-0.5 text-[10px] text-slate-400">
                              {booking.slot_date}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold border rounded-full ${status.badge}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                              />
                              {status.label}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          {/* CURRENT PROCESS */}
          <section className="overflow-hidden bg-white border shadow-sm rounded-2xl border-slate-200">
            <div className="px-5 py-5 border-b border-slate-100">
              <p className="text-xs font-semibold tracking-widest text-blue-700 uppercase">
                Current Processing
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Queue Snapshot
              </h2>
            </div>

            <div className="p-5">
              {nextBooking ? (
                <div className="p-4 border border-blue-100 rounded-2xl bg-blue-50">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center flex-shrink-0 text-lg bg-white w-11 h-11 rounded-xl">
                      🚜
                    </div>

                    <div>
                      <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
                        {nextBooking.status ===
                        'in_progress'
                          ? 'Currently Processing'
                          : 'Next In Queue'}
                      </p>

                      <p className="mt-1 font-bold text-slate-900">
                        {nextBooking.farmer_name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {nextBooking.crop_type} •{' '}
                        {nextBooking.quantity} quintal
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 mt-4 border-t border-blue-100">
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase">
                        Vehicle
                      </p>

                      <p className="mt-1 font-mono text-xs font-bold text-slate-800">
                        {nextBooking.vehicle_number}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase">
                        Scheduled
                      </p>

                      <p className="mt-1 text-xs font-bold text-blue-700">
                        {formatSlotTime(nextBooking)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-sm text-center border border-slate-200 rounded-2xl bg-slate-50 text-slate-500">
                  No active booking is currently being processed.
                </div>
              )}

              <div className="p-4 mt-4 border border-green-100 rounded-2xl bg-green-50">
                <div className="flex justify-between">
                  <div>
                    <p className="text-xs font-semibold text-green-700">
                      Completion Rate
                    </p>

                    <p className="mt-1 text-2xl font-bold text-green-900">
                      {completionProgress}%
                    </p>
                  </div>

                  <div className="flex items-center justify-center w-12 h-12 text-lg bg-white rounded-xl">
                    ✓
                  </div>
                </div>

                <div className="h-2 mt-4 overflow-hidden bg-white rounded-full">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{
                      width: `${Math.min(
                        completionProgress,
                        100,
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="p-3 border bg-slate-50 rounded-xl border-slate-100">
                  <p className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                    Waiting
                  </p>

                  <p className="mt-1 text-lg font-bold text-amber-700">
                    {
                      activeQueue.filter(
                        (booking) =>
                          booking.status === 'confirmed',
                      ).length
                    }
                  </p>
                </div>

                <div className="p-3 border bg-slate-50 rounded-xl border-slate-100">
                  <p className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                    Processing
                  </p>

                  <p className="mt-1 text-lg font-bold text-blue-700">
                    {
                      activeQueue.filter(
                        (booking) =>
                          booking.status === 'in_progress',
                      ).length
                    }
                  </p>
                </div>

                <div className="p-3 border bg-slate-50 rounded-xl border-slate-100">
                  <p className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                    Completed
                  </p>

                  <p className="mt-1 text-lg font-bold text-green-700">
                    {completedToday.length}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* CHART ROW 1 */}
        <div className="grid gap-6 mt-6 lg:grid-cols-2">
          {/* Hourly arrivals */}
          <section className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold tracking-widest text-green-700 uppercase">
                  Traffic Pattern
                </p>

                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  Hourly Farmer Arrivals
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Based on today's real booking slot times
                </p>
              </div>

              <span className="px-3 py-1 text-xs font-semibold text-green-700 border border-green-100 rounded-full bg-green-50">
                Today
              </span>
            </div>

            {todayBookings.length === 0 ? (
              <div className="flex items-center justify-center h-56 mt-8 text-sm text-slate-400">
                No arrival data available.
              </div>
            ) : (
              <div className="flex items-end h-56 gap-3 mt-8">
                {hourlyArrivals.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center justify-end flex-1 h-full"
                  >
                    <span className="mb-2 text-[10px] font-semibold text-slate-500">
                      {item.value}
                    </span>

                    <div className="flex items-end w-full h-full max-h-40">
                      <div
                        className="w-full transition-all bg-green-500 rounded-t-xl hover:bg-green-600"
                        style={{
                          height: `${
                            item.value > 0
                              ? (item.value /
                                  maxHourlyArrival) *
                                100
                              : 2
                          }%`,
                        }}
                      />
                    </div>

                    <span className="mt-3 text-[10px] text-slate-400 whitespace-nowrap">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Weekly procurement */}
          <section className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold tracking-widest text-blue-700 uppercase">
                  Procurement Trend
                </p>

                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  7-Day Procurement Volume
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Completed booking quantities from the database
                </p>
              </div>

              <span className="px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100 rounded-full bg-blue-50">
                Quintal
              </span>
            </div>

            <div className="flex items-end h-56 gap-3 mt-8">
              {weeklyProcurement.map((item) => (
                <div
                  key={item.day}
                  className="flex flex-col items-center justify-end flex-1 h-full"
                >
                  <span className="mb-2 text-[10px] font-semibold text-slate-500">
                    {item.value}
                  </span>

                  <div className="flex items-end w-full h-full max-h-40">
                    <div
                      className="w-full bg-blue-500 rounded-t-xl"
                      style={{
                        height: `${
                          item.value > 0
                            ? (item.value /
                                maxWeeklyValue) *
                              100
                            : 2
                        }%`,
                      }}
                    />
                  </div>

                  <span className="mt-3 text-[10px] text-slate-400">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* CHART ROW 2 */}
        <div className="grid gap-6 mt-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Waiting time */}
          <section className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-amber-700">
                Queue Efficiency
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-900">
                Average Waiting Time
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Waiting-time tracking requires check-in timestamps,
                which are not currently stored by the backend.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center h-56 mt-6 border border-dashed rounded-2xl border-slate-200 bg-slate-50">
              <span className="text-3xl">⏱️</span>

              <p className="mt-3 text-sm font-semibold text-slate-600">
                Data not available
              </p>

              <p className="max-w-xs mt-1 text-xs text-center text-slate-400">
                No waiting-time value is fabricated. Backend
                check-in and completion timestamps would be needed.
              </p>
            </div>
          </section>

          {/* Crop distribution */}
          <section className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
            <p className="text-xs font-semibold tracking-widest text-purple-700 uppercase">
              Crop Mix
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900">
              Procurement Distribution
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Share of today's completed procurement by crop
            </p>

            {cropDistribution.length === 0 ? (
              <div className="flex items-center justify-center h-48 mt-6 text-sm text-slate-400">
                No completed procurement data available.
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {cropDistribution.map((crop) => (
                  <div key={crop.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <span>{crop.icon}</span>
                        {crop.name}
                      </span>

                      <span className="text-xs font-bold text-slate-600">
                        {crop.value}%
                      </span>
                    </div>

                    <div className="w-full h-3 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full transition-all bg-purple-500 rounded-full"
                        style={{
                          width: `${crop.value}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* SLOT UTILIZATION */}
        <section className="p-6 mt-6 bg-white border shadow-sm rounded-2xl border-slate-200">
          <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-widest text-green-700 uppercase">
                Slot Management
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Time-Slot Utilization
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Real slot capacity and booking utilization
              </p>
            </div>

            <span className="text-xs text-slate-400">
              {bookedSlotCapacity}/{totalSlotCapacity}{' '}
              capacity booked
            </span>
          </div>

          {loadingSlots ? (
            <div className="p-8 text-sm text-center text-slate-500">
              Loading slot data...
            </div>
          ) : slotError ? (
            <div className="p-8 text-sm text-center text-red-600">
              {slotError}
            </div>
          ) : slotUtilization.length === 0 ? (
            <div className="p-8 text-sm text-center text-slate-400">
              No active slots available for today.
            </div>
          ) : (
            <div className="space-y-5">
              {slotUtilization.map((slot) => (
                <div key={slot.id}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-700">
                      {slot.label}
                    </span>

                    <span className="text-xs font-semibold text-slate-500">
                      {slot.booked}/{slot.total} •{' '}
                      {slot.percentage}%
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${
                        slot.percentage >= 95
                          ? 'bg-red-400'
                          : slot.percentage >= 75
                            ? 'bg-amber-400'
                            : 'bg-green-500'
                      }`}
                      style={{
                        width: `${slot.percentage}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* MARKET + ALERTS + ACTIVITY */}
        <div className="grid gap-6 mt-6 lg:grid-cols-3">
          {/* Prices */}
          <section className="overflow-hidden bg-white border shadow-sm rounded-2xl border-slate-200">
            <div className="px-5 py-5 border-b border-slate-100">
              <p className="text-xs font-semibold tracking-widest text-green-700 uppercase">
                Market Watch
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-900">
                Today's Crop Prices
              </h2>
            </div>

            {loading ? (
              <div className="p-8 text-sm text-center text-slate-500">
                Loading market data...
              </div>
            ) : prices.length === 0 ? (
              <div className="p-8 text-sm text-center text-slate-400">
                No market price data available.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {prices.slice(0, 5).map((price) => (
                  <div
                    key={price.id}
                    className="flex items-center justify-between px-5 py-4 hover:bg-green-50/40"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center rounded-lg w-9 h-9 bg-green-50">
                        {CROP_ICONS[price.cropName] ??
                          '🌾'}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {price.cropName}
                        </p>

                        <p className="text-[11px] text-slate-400">
                          {price.mandiName}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-green-700">
                        {formatIndianCurrency(
                          price.modalPrice,
                        )}
                      </p>

                      <p className="text-[10px] text-slate-400">
                        {price.unit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Alerts */}
          <section className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
            <p className="text-xs font-semibold tracking-widest text-red-600 uppercase">
              Operations Alerts
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900">
              Current Status
            </h2>

            <div className="mt-5 space-y-3">
              {slots.some(
                (slot) =>
                  slot.total_slots > 0 &&
                  slot.booked_slots >=
                    slot.total_slots,
              ) && (
                <div className="p-4 border border-red-100 rounded-xl bg-red-50">
                  <div className="flex gap-3">
                    <span>🚨</span>

                    <div>
                      <p className="text-sm font-bold text-red-900">
                        One or more slots are full
                      </p>

                      <p className="mt-1 text-xs leading-5 text-red-700">
                        Current slot capacity has reached its
                        configured limit.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeQueue.length > 0 ? (
                <div className="p-4 border rounded-xl border-amber-100 bg-amber-50">
                  <div className="flex gap-3">
                    <span>⏳</span>

                    <div>
                      <p className="text-sm font-bold text-amber-900">
                        Queue requires monitoring
                      </p>

                      <p className="mt-1 text-xs leading-5 text-amber-700">
                        {activeQueue.length} booking
                        {activeQueue.length === 1
                          ? ''
                          : 's'} currently confirmed or
                        processing.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 border border-green-100 rounded-xl bg-green-50">
                  <div className="flex gap-3">
                    <span>✓</span>

                    <div>
                      <p className="text-sm font-bold text-green-900">
                        No active queue
                      </p>

                      <p className="mt-1 text-xs leading-5 text-green-700">
                        There are currently no confirmed or
                        processing bookings.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {cancelledToday.length > 0 && (
                <div className="p-4 border border-red-100 rounded-xl bg-red-50">
                  <div className="flex gap-3">
                    <span>⚠️</span>

                    <div>
                      <p className="text-sm font-bold text-red-900">
                        Cancelled bookings
                      </p>

                      <p className="mt-1 text-xs leading-5 text-red-700">
                        {cancelledToday.length} booking
                        {cancelledToday.length === 1
                          ? ''
                          : 's'} cancelled today.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeQueue.length === 0 &&
                cancelledToday.length === 0 &&
                !slots.some(
                  (slot) =>
                    slot.total_slots > 0 &&
                    slot.booked_slots >=
                      slot.total_slots,
                ) && (
                  <div className="p-4 border border-green-100 rounded-xl bg-green-50">
                    <div className="flex gap-3">
                      <span>✓</span>

                      <div>
                        <p className="text-sm font-bold text-green-900">
                          Operations data available
                        </p>

                        <p className="mt-1 text-xs leading-5 text-green-700">
                          No active booking or slot-capacity
                          alerts are currently present.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </section>

          {/* Activity */}
          <section className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
            <p className="text-xs font-semibold tracking-widest text-blue-700 uppercase">
              Recent Activity
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900">
              Operations Timeline
            </h2>

            {recentActivity.length === 0 ? (
              <div className="flex items-center justify-center h-48 mt-5 text-sm text-center text-slate-400">
                No booking activity recorded today.
              </div>
            ) : (
              <div className="mt-5 space-y-5">
                {recentActivity.map((booking) => {
                  const status =
                    STATUS_META[booking.status] ??
                    STATUS_META.pending

                  return (
                    <div
                      key={booking.id}
                      className="flex gap-3"
                    >
                      <div className="flex items-center justify-center text-sm rounded-full w-9 h-9 bg-green-50">
                        {booking.status ===
                        'completed'
                          ? '✓'
                          : booking.status ===
                              'in_progress'
                            ? '🚜'
                            : '📋'}
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900">
                          {booking.farmer_name}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {booking.crop_type} •{' '}
                          {booking.quantity} quintal •{' '}
                          {status.label}
                        </p>

                        <p className="mt-1 text-[10px] font-semibold text-slate-400">
                          Booking #{booking.booking_code}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </div>

        {/* Bottom operational summary */}
        <div className="grid gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-5 border border-green-100 rounded-2xl bg-green-50">
            <p className="text-xs font-semibold tracking-wide text-green-700 uppercase">
              Completion
            </p>

            <p className="mt-2 text-2xl font-bold text-green-900">
              {completionProgress}%
            </p>

            <p className="mt-1 text-xs text-green-700">
              {completedToday.length} of{' '}
              {todayBookings.length} bookings completed
            </p>
          </div>

          <div className="p-5 border border-blue-100 rounded-2xl bg-blue-50">
            <p className="text-xs font-semibold tracking-wide text-blue-700 uppercase">
              Revenue
            </p>

            <p className="mt-2 text-2xl font-bold text-blue-900">
              N/A
            </p>

            <p className="mt-1 text-xs text-blue-700">
              Booking records do not contain transaction amounts
            </p>
          </div>

          <div className="p-5 border rounded-2xl border-amber-100 bg-amber-50">
            <p className="text-xs font-semibold tracking-wide uppercase text-amber-700">
              Queue Load
            </p>

            <p className="mt-2 text-2xl font-bold text-amber-900">
              {activeQueue.length}
            </p>

            <p className="mt-1 text-xs text-amber-700">
              Current active bookings
            </p>
          </div>

          <div className="p-5 border border-purple-100 rounded-2xl bg-purple-50">
            <p className="text-xs font-semibold tracking-wide text-purple-700 uppercase">
              Slot Capacity
            </p>

            <p className="mt-2 text-2xl font-bold text-purple-900">
              {bookedSlotCapacity}/{totalSlotCapacity}
            </p>

            <p className="mt-1 text-xs text-purple-700">
              Today's booked slot capacity
            </p>
          </div>
        </div>

        {/* Footer note */}
        <div className="p-5 mt-6 border border-green-100 rounded-2xl bg-green-50/70">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-white rounded-xl">
              🛡️
            </div>

            <div>
              <p className="text-sm font-bold text-green-900">
                Digital Mandi Operations
              </p>

              <p className="mt-1 text-xs leading-5 text-green-800">
                Dashboard metrics are calculated from live booking,
                slot and market-price data available through the
                backend. Metrics requiring unsupported financial or
                waiting-time data are explicitly marked unavailable
                instead of using fabricated values.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default MandiOwnerDashboardPage