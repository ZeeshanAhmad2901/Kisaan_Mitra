import { useEffect, useMemo, useState } from 'react'
import {
  getMandiBookings,
  type MandiBooking,
} from '../../api/bookingApi'
import { getMandis, type BackendMandi } from '../../api/mandiApi'
import { getSlots, type BackendSlot } from '../../api/slotApi'
import { useAuth } from '../../store/authStore'

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function formatDay(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
    weekday: 'short',
  })
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-IN').format(value)
}

function ReportsPage() {
  const { user } = useAuth()

  const [mandis, setMandis] = useState<BackendMandi[]>([])
  const [bookings, setBookings] = useState<MandiBooking[]>([])
  const [slots, setSlots] = useState<BackendSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const ownerMandi = useMemo(
    () =>
      mandis.find(
        (mandi) => mandi.owner_id === Number(user?.id),
      ),
    [mandis, user?.id],
  )

  const loadReports = async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')

      const mandiData = await getMandis()
      setMandis(mandiData)

      const currentMandi = mandiData.find(
        (mandi) => mandi.owner_id === Number(user.id),
      )

      if (!currentMandi) {
        setBookings([])
        setSlots([])
        return
      }

      const [bookingData, slotData] = await Promise.all([
        getMandiBookings(currentMandi.id),
        getSlots(String(currentMandi.id)),
      ])

      setBookings(bookingData)
      setSlots(slotData)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load reports',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadReports()
  }, [user?.id])

  const stats = useMemo(() => {
    const total = bookings.length

    const confirmed = bookings.filter(
      (booking) => booking.status === 'confirmed',
    ).length

    const processing = bookings.filter(
      (booking) => booking.status === 'in_progress',
    ).length

    const completed = bookings.filter(
      (booking) => booking.status === 'completed',
    ).length

    const totalQuantity = bookings.reduce(
      (sum, booking) => sum + booking.quantity,
      0,
    )

    const completedQuantity = bookings
      .filter((booking) => booking.status === 'completed')
      .reduce((sum, booking) => sum + booking.quantity, 0)

    const utilizationTotal = slots.reduce(
      (sum, slot) => sum + slot.total_slots,
      0,
    )

    const utilizationBooked = slots.reduce(
      (sum, slot) => sum + slot.booked_slots,
      0,
    )

    const utilization =
      utilizationTotal > 0
        ? Math.round(
            (utilizationBooked / utilizationTotal) * 100,
          )
        : 0

    return {
      total,
      confirmed,
      processing,
      completed,
      totalQuantity,
      completedQuantity,
      utilization,
    }
  }, [bookings, slots])

  const cropStats = useMemo(() => {
    const map = new Map<string, number>()

    bookings.forEach((booking) => {
      map.set(
        booking.crop_type,
        (map.get(booking.crop_type) ?? 0) +
          booking.quantity,
      )
    })

    const totalQuantity = Array.from(map.values()).reduce(
      (sum, quantity) => sum + quantity,
      0,
    )

    return Array.from(map.entries())
      .map(([crop, quantity]) => ({
        crop,
        quantity,
        percentage:
          totalQuantity > 0
            ? Math.round((quantity / totalQuantity) * 100)
            : 0,
      }))
      .sort((a, b) => b.quantity - a.quantity)
  }, [bookings])

  const vehicleStats = useMemo(() => {
    const map = new Map<string, number>()

    bookings.forEach((booking) => {
      map.set(
        booking.vehicle_type,
        (map.get(booking.vehicle_type) ?? 0) + 1,
      )
    })

    const total = bookings.length

    return Array.from(map.entries())
      .map(([type, count]) => ({
        type,
        count,
        percentage:
          total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
  }, [bookings])

  const sourceStats = useMemo(() => {
    const map = new Map<string, number>()

    bookings.forEach((booking) => {
      map.set(
        booking.booking_source,
        (map.get(booking.booking_source) ?? 0) + 1,
      )
    })

    const total = bookings.length

    return Array.from(map.entries())
      .map(([source, count]) => ({
        source,
        count,
        percentage:
          total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
  }, [bookings])

  const dailyStats = useMemo(() => {
    const today = new Date()

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today)
      date.setDate(today.getDate() - (6 - index))

      const dateString = formatDate(date)

      const dayBookings = bookings.filter(
        (booking) => booking.slot_date === dateString,
      )

      return {
        date: dateString,
        day: formatDay(dateString),
        bookings: dayBookings.length,
        quantity: dayBookings.reduce(
          (sum, booking) => sum + booking.quantity,
          0,
        ),
      }
    })
  }, [bookings])

  const maxDailyBookings = Math.max(
    ...dailyStats.map((item) => item.bookings),
    1,
  )

  const maxDailyQuantity = Math.max(
    ...dailyStats.map((item) => item.quantity),
    1,
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="px-4 py-10 mx-auto max-w-7xl">
          <div className="p-8 text-center bg-white border rounded-2xl border-slate-200">
            <p className="text-sm text-slate-500">
              Loading reports...
            </p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="px-4 py-10 mx-auto max-w-7xl">
          <div className="p-6 border border-red-200 bg-red-50 rounded-2xl">
            <p className="font-semibold text-red-800">
              Unable to load reports
            </p>
            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>
            <button
              type="button"
              onClick={() => void loadReports()}
              className="px-4 py-2 mt-4 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="px-4 py-8 mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest text-green-700 uppercase">
              Mandi Reports
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Operational Analytics
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {ownerMandi
                ? `${ownerMandi.name} • ${ownerMandi.location}`
                : 'No mandi assigned to this account'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadReports()}
            className="px-4 py-2 text-sm font-semibold text-green-700 border border-green-200 rounded-lg bg-green-50 hover:bg-green-100"
          >
            Refresh Data
          </button>
        </div>

        {!ownerMandi ? (
          <div className="p-8 text-center bg-white border rounded-2xl border-slate-200">
            <p className="font-semibold text-slate-800">
              No active mandi found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              This account does not currently own an active mandi.
            </p>
          </div>
        ) : (
          <>
            {/* Main Metrics */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="p-5 bg-white border border-blue-100 shadow-sm rounded-2xl">
                <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
                  Total Bookings
                </p>
                <p className="mt-2 text-3xl font-bold text-blue-900">
                  {formatNumber(stats.total)}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  All recorded bookings
                </p>
              </div>

              <div className="p-5 bg-white border shadow-sm border-amber-100 rounded-2xl">
                <p className="text-xs font-semibold tracking-wide uppercase text-amber-600">
                  Active Queue
                </p>
                <p className="mt-2 text-3xl font-bold text-amber-900">
                  {formatNumber(
                    stats.confirmed + stats.processing,
                  )}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Waiting + processing
                </p>
              </div>

              <div className="p-5 bg-white border border-green-100 shadow-sm rounded-2xl">
                <p className="text-xs font-semibold tracking-wide text-green-600 uppercase">
                  Completed
                </p>
                <p className="mt-2 text-3xl font-bold text-green-900">
                  {formatNumber(stats.completed)}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Completed bookings
                </p>
              </div>

              <div className="p-5 bg-white border border-purple-100 shadow-sm rounded-2xl">
                <p className="text-xs font-semibold tracking-wide text-purple-600 uppercase">
                  Total Quantity
                </p>
                <p className="mt-2 text-3xl font-bold text-purple-900">
                  {formatNumber(stats.totalQuantity)}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Quantity across bookings
                </p>
              </div>
            </div>

            {/* Status Breakdown */}
            <section className="p-6 mt-6 bg-white border shadow-sm rounded-2xl border-slate-200">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-slate-400">
                  Booking Status
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Current Booking Distribution
                </h2>
              </div>

              <div className="grid gap-4 mt-6 sm:grid-cols-3">
                <div className="p-4 rounded-xl bg-blue-50">
                  <p className="text-xs font-semibold text-blue-700 uppercase">
                    Confirmed
                  </p>
                  <p className="mt-2 text-2xl font-bold text-blue-900">
                    {stats.confirmed}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50">
                  <p className="text-xs font-semibold uppercase text-amber-700">
                    Processing
                  </p>
                  <p className="mt-2 text-2xl font-bold text-amber-900">
                    {stats.processing}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-green-50">
                  <p className="text-xs font-semibold text-green-700 uppercase">
                    Completed
                  </p>
                  <p className="mt-2 text-2xl font-bold text-green-900">
                    {stats.completed}
                  </p>
                </div>
              </div>
            </section>

            {/* Daily Activity */}
            <div className="grid gap-6 mt-6 lg:grid-cols-2">
              <section className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
                <p className="text-xs font-semibold tracking-widest text-blue-700 uppercase">
                  Booking Activity
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Last 7 Days
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Actual bookings grouped by slot date
                </p>

                <div className="flex items-end h-56 gap-3 mt-8">
                  {dailyStats.map((item) => (
                    <div
                      key={item.date}
                      className="flex flex-col items-center justify-end flex-1 h-full"
                    >
                      <span className="mb-2 text-[10px] font-semibold text-slate-500">
                        {item.bookings}
                      </span>

                      <div className="flex items-end w-full h-full max-h-40">
                        <div
                          className="w-full transition-all bg-blue-500 rounded-t-xl"
                          style={{
                            height: `${
                              (item.bookings /
                                maxDailyBookings) *
                              100
                            }%`,
                          }}
                        />
                      </div>

                      <span className="mt-3 text-[10px] font-semibold text-slate-400">
                        {item.day}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
                <p className="text-xs font-semibold tracking-widest text-purple-700 uppercase">
                  Quantity Activity
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Last 7 Days
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Actual booked quantity by slot date
                </p>

                <div className="flex items-end h-56 gap-3 mt-8">
                  {dailyStats.map((item) => (
                    <div
                      key={item.date}
                      className="flex flex-col items-center justify-end flex-1 h-full"
                    >
                      <span className="mb-2 text-[10px] font-semibold text-slate-500">
                        {item.quantity}
                      </span>

                      <div className="flex items-end w-full h-full max-h-40">
                        <div
                          className="w-full transition-all bg-purple-500 rounded-t-xl"
                          style={{
                            height: `${
                              (item.quantity /
                                maxDailyQuantity) *
                              100
                            }%`,
                          }}
                        />
                      </div>

                      <span className="mt-3 text-[10px] font-semibold text-slate-400">
                        {item.day}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Crop + Vehicle */}
            <div className="grid gap-6 mt-6 lg:grid-cols-2">
              <section className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
                <p className="text-xs font-semibold tracking-widest text-green-700 uppercase">
                  Crop Analysis
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Quantity by Crop
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Based on actual booking quantities
                </p>

                <div className="mt-6 space-y-5">
                  {cropStats.length === 0 ? (
                    <p className="text-sm text-slate-400">
                      No crop data available.
                    </p>
                  ) : (
                    cropStats.map((crop) => (
                      <div key={crop.crop}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-slate-700">
                            {crop.crop}
                          </span>

                          <span className="text-xs font-semibold text-slate-500">
                            {formatNumber(crop.quantity)} •{' '}
                            {crop.percentage}%
                          </span>
                        </div>

                        <div className="w-full h-3 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full transition-all bg-green-500 rounded-full"
                            style={{
                              width: `${crop.percentage}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
                <p className="text-xs font-semibold tracking-widest text-blue-700 uppercase">
                  Transport Analysis
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Vehicle Type
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Distribution across actual bookings
                </p>

                <div className="mt-6 space-y-5">
                  {vehicleStats.length === 0 ? (
                    <p className="text-sm text-slate-400">
                      No vehicle data available.
                    </p>
                  ) : (
                    vehicleStats.map((vehicle) => (
                      <div key={vehicle.type}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-slate-700">
                            {vehicle.type}
                          </span>

                          <span className="text-xs font-semibold text-slate-500">
                            {vehicle.count} •{' '}
                            {vehicle.percentage}%
                          </span>
                        </div>

                        <div className="w-full h-3 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{
                              width: `${vehicle.percentage}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>

            {/* Booking Source */}
            <section className="p-6 mt-6 bg-white border shadow-sm rounded-2xl border-slate-200">
              <p className="text-xs font-semibold tracking-widest text-indigo-700 uppercase">
                Booking Sources
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                How Bookings Entered the System
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Self, assisted and walk-in booking distribution
              </p>

              <div className="grid gap-4 mt-6 sm:grid-cols-3">
                {sourceStats.length === 0 ? (
                  <p className="text-sm text-slate-400">
                    No booking source data available.
                  </p>
                ) : (
                  sourceStats.map((item) => (
                    <div
                      key={item.source}
                      className="p-4 border rounded-xl border-slate-100 bg-slate-50"
                    >
                      <p className="text-xs font-semibold uppercase text-slate-500">
                        {item.source}
                      </p>

                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        {item.count}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {item.percentage}% of bookings
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Slot Utilization */}
            <section className="p-6 mt-6 bg-white border shadow-sm rounded-2xl border-slate-200">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold tracking-widest text-green-700 uppercase">
                    Slot Performance
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    Slot Utilization
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Actual booked slots compared with configured
                    capacity
                  </p>
                </div>

                <span className="text-sm font-semibold text-green-700">
                  {stats.utilization}% overall
                </span>
              </div>

              <div className="mt-6 space-y-5">
                {slots.length === 0 ? (
                  <p className="text-sm text-slate-400">
                    No slots configured.
                  </p>
                ) : (
                  slots.map((slot) => {
                    const percentage =
                      slot.total_slots > 0
                        ? Math.round(
                            (slot.booked_slots /
                              slot.total_slots) *
                              100,
                          )
                        : 0

                    return (
                      <div key={slot.id}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-slate-700">
                            {slot.slot_date} •{' '}
                            {slot.start_time.slice(0, 5)}–
                            {slot.end_time.slice(0, 5)}
                          </span>

                          <span className="text-xs font-semibold text-slate-500">
                            {slot.booked_slots}/
                            {slot.total_slots} •{' '}
                            {percentage}%
                          </span>
                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${
                              percentage >= 95
                                ? 'bg-red-400'
                                : percentage >= 75
                                  ? 'bg-amber-400'
                                  : 'bg-green-500'
                            }`}
                            style={{
                              width: `${Math.min(
                                percentage,
                                100,
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </section>

            {/* Operational Summary */}
            <section className="p-6 mt-6 bg-white border shadow-sm rounded-2xl border-slate-200">
              <p className="text-xs font-semibold tracking-widest uppercase text-slate-400">
                Operational Summary
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Current Mandi Data
              </h2>

              <div className="grid gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="p-4 rounded-xl bg-slate-50">
                  <p className="text-xs text-slate-500">
                    Configured Slots
                  </p>
                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {slots.length}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50">
                  <p className="text-xs text-slate-500">
                    Booked Capacity
                  </p>
                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {formatNumber(
                      slots.reduce(
                        (sum, slot) => sum + slot.booked_slots,
                        0,
                      ),
                    )}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50">
                  <p className="text-xs text-slate-500">
                    Completed Quantity
                  </p>
                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {formatNumber(stats.completedQuantity)}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50">
                  <p className="text-xs text-slate-500">
                    Active Slots
                  </p>
                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {slots.filter((slot) => slot.is_active).length}
                  </p>
                </div>
              </div>
            </section>

            {/* Data limitation note */}
            <div className="p-5 mt-6 border border-amber-100 rounded-2xl bg-amber-50">
              <p className="text-sm font-bold text-amber-900">
                Report data scope
              </p>

              <p className="mt-1 text-xs leading-5 text-amber-800">
                These reports use live booking and slot data from
                the backend. Revenue, payment amounts, procurement
                financials and actual farmer wait times are not
                displayed because the current backend does not
                provide those values.
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default ReportsPage