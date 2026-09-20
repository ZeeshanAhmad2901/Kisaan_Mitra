import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { getMandiBookings, type MandiBooking } from '../../api/bookingApi'
import { getCropPrices, getMandis, type BackendMandi } from '../../api/mandiApi'
import { getSlots, type BackendSlot } from '../../api/slotApi'
import { useAuth } from '../../store/authStore'
import type { CropPrice } from '../../types'

function getTodayDate() {
  return new Date().toISOString().split('T')[0]
}

function formatTime(time: string) {
  return time.slice(0, 5)
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-IN').format(value)
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

function statusLabel(status: string) {
  return status
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export default function MandiOperatorDashboardPage() {
  const { user } = useAuth()

  const [mandis, setMandis] = useState<BackendMandi[]>([])
  const [bookings, setBookings] = useState<MandiBooking[]>([])
  const [slots, setSlots] = useState<BackendSlot[]>([])
  const [cropPrices, setCropPrices] = useState<CropPrice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const today = getTodayDate()

  useEffect(() => {
    async function loadDashboard() {
      if (!user?.mandiId) {
        setError('No active mandi is assigned to this operator account.')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const mandiData = await getMandis()
        setMandis(mandiData)

        const operatorMandi = mandiData.find(
          (mandi) => mandi.id === user.mandiId,
        )

        if (!operatorMandi) {
          setError('Assigned mandi could not be found or is inactive.')
          setBookings([])
          setSlots([])
          setIsLoading(false)
          return
        }

        const [bookingData, slotData, priceData] = await Promise.all([
          getMandiBookings(operatorMandi.id),
          getSlots(String(operatorMandi.id), today),
          getCropPrices(),
        ])

        setBookings(bookingData)
        setSlots(slotData)
        setCropPrices(priceData)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load operator dashboard.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboard()
  }, [user?.mandiId, today])

  const operatorMandi = useMemo(
    () => mandis.find((mandi) => mandi.id === user?.mandiId) ?? null,
    [mandis, user?.mandiId],
  )

  const todayBookings = useMemo(
    () => bookings.filter((booking) => booking.slot_date === today),
    [bookings, today],
  )

  const confirmedBookings = todayBookings.filter(
    (booking) => booking.status === 'confirmed',
  )

  const processingBookings = todayBookings.filter(
    (booking) => booking.status === 'processing',
  )

  const completedBookings = todayBookings.filter(
    (booking) => booking.status === 'completed',
  )

  const cancelledBookings = todayBookings.filter(
    (booking) => booking.status === 'cancelled',
  )

  const assistedBookings = todayBookings.filter(
    (booking) => booking.booking_source === 'assisted',
  )

  const walkInBookings = todayBookings.filter(
    (booking) => booking.booking_source === 'walk-in',
  )

  const totalBookedQuantity = todayBookings.reduce(
    (total, booking) => total + booking.quantity,
    0,
  )

  const completedQuantity = completedBookings.reduce(
    (total, booking) => total + booking.quantity,
    0,
  )

  const totalCapacity = slots.reduce(
    (total, slot) => total + slot.total_slots,
    0,
  )

  const totalBookedSlots = slots.reduce(
    (total, slot) => total + slot.booked_slots,
    0,
  )

  const utilization =
    totalCapacity > 0
      ? Math.round((totalBookedSlots / totalCapacity) * 100)
      : 0

  const nextBookings = [...confirmedBookings]
    .sort((a, b) => {
      const first = `${a.slot_date} ${a.start_time}`
      const second = `${b.slot_date} ${b.start_time}`
      return first.localeCompare(second)
    })
    .slice(0, 5)

  const activePrices = cropPrices.slice(0, 6)

  if (isLoading) {
    return (
      <div className="min-h-screen px-6 py-10 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <div className="p-10 text-center bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="w-10 h-10 mx-auto mb-4 border-4 border-gray-200 rounded-full animate-spin border-t-green-600" />
            <p className="text-gray-600">
              Loading mandi operations dashboard...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen px-6 py-10 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <div className="p-8 bg-white border border-red-200 rounded-2xl">
            <h2 className="text-xl font-bold text-red-700">
              Dashboard unavailable
            </h2>
            <p className="mt-2 text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-6 bg-gray-50 sm:px-6 lg:px-8">
      <div className="mx-auto space-y-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm font-medium text-green-600">
              MANDI OPERATOR
            </p>

            <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
              Operations Control Center
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {operatorMandi?.name ?? 'Assigned Mandi'} •{' '}
              {operatorMandi?.location}
            </p>
          </div>

          <div className="px-4 py-3 text-sm bg-white border border-gray-200 shadow-sm rounded-xl">
            <p className="text-gray-500">Operator</p>
            <p className="font-semibold text-gray-900">{user?.name}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Link
            to="/mandi-operator/assisted-booking"
            className="rounded-2xl border border-green-200 bg-green-50 p-5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-sm font-medium text-green-700">
              Assisted Booking
            </p>

            <p className="mt-2 text-lg font-bold text-gray-900">
              Book for Farmer
            </p>

            <p className="mt-1 text-sm text-gray-600">
              Create a booking through the help desk.
            </p>
          </Link>

          <Link
            to="/mandi-operator/walk-in-booking"
            className="rounded-2xl border border-orange-200 bg-orange-50 p-5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-sm font-medium text-orange-700">
              Walk-in Booking
            </p>

            <p className="mt-2 text-lg font-bold text-gray-900">
              Create Walk-in
            </p>

            <p className="mt-1 text-sm text-gray-600">
              Book farmers arriving without a prior slot.
            </p>
          </Link>

          <Link
            to="/mandi-operator/queue-management"
            className="rounded-2xl border border-blue-200 bg-blue-50 p-5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-sm font-medium text-blue-700">
              Queue
            </p>

            <p className="mt-2 text-lg font-bold text-gray-900">
              Manage Queue
            </p>

            <p className="mt-1 text-sm text-gray-600">
              Monitor and process today's bookings.
            </p>
          </Link>

          <div className="p-5 border border-purple-200 rounded-2xl bg-purple-50">
            <p className="text-sm font-medium text-purple-700">
              Today's Assisted
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {assistedBookings.length}
            </p>

            <p className="mt-1 text-sm text-gray-600">
              Help-desk bookings
            </p>
          </div>

          <div className="p-5 border border-orange-200 rounded-2xl bg-orange-50">
            <p className="text-sm font-medium text-orange-700">
              Walk-ins
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {walkInBookings.length}
            </p>

            <p className="mt-1 text-sm text-gray-600">
              Today's walk-in bookings
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <p className="text-sm text-gray-500">
              Today's Bookings
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {todayBookings.length}
            </p>
          </div>

          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <p className="text-sm text-gray-500">
              Waiting
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {confirmedBookings.length}
            </p>
          </div>

          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <p className="text-sm text-gray-500">
              Processing
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {processingBookings.length}
            </p>
          </div>

          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <p className="text-sm text-gray-500">
              Completed
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {completedBookings.length}
            </p>
          </div>

          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <p className="text-sm text-gray-500">
              Cancelled
            </p>

            <p className="mt-2 text-3xl font-bold text-red-600">
              {cancelledBookings.length}
            </p>
          </div>
        </div>

        {/* Main Operations */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Queue */}
          <div className="bg-white border border-gray-200 shadow-sm lg:col-span-2 rounded-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <div>
                <h2 className="font-bold text-gray-900">
                  Upcoming Queue
                </h2>

                <p className="text-sm text-gray-500">
                  Confirmed bookings waiting for processing
                </p>
              </div>

              <Link
                to="/mandi-operator/queue-management"
                className="text-sm font-medium text-green-600 hover:underline"
              >
                Open Queue
              </Link>
            </div>

            <div className="divide-y divide-gray-100">
              {nextBookings.length === 0 ? (
                <div className="px-5 py-10 text-sm text-center text-gray-500">
                  No confirmed bookings are currently waiting.
                </div>
              ) : (
                nextBookings.map((booking, index) => (
                  <div
                    key={booking.id}
                    className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 font-bold text-gray-700 bg-gray-100 rounded-full">
                        {index + 1}
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900">
                          {booking.farmer_name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {booking.crop_type} • {booking.quantity} units
                        </p>

                        <p className="text-xs text-gray-400">
                          {booking.booking_code}
                        </p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="font-medium text-gray-900">
                        {formatTime(booking.start_time)} -{' '}
                        {formatTime(booking.end_time)}
                      </p>

                      <span className="mt-1 inline-block rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700">
                        {statusLabel(booking.status)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Capacity */}
          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <h2 className="font-bold text-gray-900">
              Today's Capacity
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Active slots for {today}
            </p>

            <div className="flex items-center justify-center mt-6">
              <div className="flex flex-col items-center justify-center border-8 border-green-100 rounded-full h-36 w-36">
                <span className="text-3xl font-bold text-gray-900">
                  {utilization}%
                </span>

                <span className="text-xs text-gray-500">
                  utilized
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6 text-center">
              <div className="p-3 rounded-xl bg-gray-50">
                <p className="text-xl font-bold text-gray-900">
                  {totalBookedSlots}
                </p>

                <p className="text-xs text-gray-500">
                  Booked
                </p>
              </div>

              <div className="p-3 rounded-xl bg-gray-50">
                <p className="text-xl font-bold text-gray-900">
                  {totalCapacity}
                </p>

                <p className="text-xs text-gray-500">
                  Capacity
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Slot Overview */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="font-bold text-gray-900">
              Today's Slot Overview
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
            {slots.length === 0 ? (
              <p className="text-sm text-gray-500">
                No active slots available for today.
              </p>
            ) : (
              slots.map((slot) => {
                const percentage =
                  slot.total_slots > 0
                    ? Math.round(
                        (slot.booked_slots / slot.total_slots) * 100,
                      )
                    : 0

                return (
                  <div
                    key={slot.id}
                    className="p-4 border border-gray-200 rounded-xl"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900">
                        {formatTime(slot.start_time)} -{' '}
                        {formatTime(slot.end_time)}
                      </p>

                      <span className="text-xs font-medium text-gray-500">
                        {slot.booked_slots}/{slot.total_slots}
                      </span>
                    </div>

                    <div className="h-2 mt-3 overflow-hidden bg-gray-100 rounded-full">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{
                          width: `${Math.min(percentage, 100)}%`,
                        }}
                      />
                    </div>

                    <p className="mt-2 text-xs text-gray-500">
                      {percentage}% booked
                    </p>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Operational Summary */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <h2 className="font-bold text-gray-900">
              Quantity Summary
            </h2>

            <div className="grid grid-cols-2 gap-4 mt-5">
              <div>
                <p className="text-sm text-gray-500">
                  Booked quantity
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {formatNumber(totalBookedQuantity)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Completed quantity
                </p>

                <p className="mt-1 text-2xl font-bold text-green-600">
                  {formatNumber(completedQuantity)}
                </p>
              </div>
            </div>

            <p className="mt-5 text-xs text-gray-500">
              Quantities are based on booking records. Final procurement
              quantities should be taken from procurement records after
              weighing.
            </p>
          </div>

          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <h2 className="font-bold text-gray-900">
              Market Prices
            </h2>

            <div className="mt-4 divide-y divide-gray-100">
              {activePrices.length === 0 ? (
                <p className="py-4 text-sm text-gray-500">
                  No market price data available.
                </p>
              ) : (
                activePrices.map((price) => (
                  <div
                    key={price.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {price.cropName}
                      </p>

                      <p className="text-xs text-gray-500">
                        {price.mandiName}
                      </p>
                    </div>

                    <p className="font-semibold text-gray-900">
                      {formatCurrency(price.modalPrice)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer status */}
        <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-gray-900">
                Operations status
              </p>

              <p className="text-sm text-gray-500">
                Dashboard data is connected to the assigned mandi.
              </p>
            </div>

            <span className="inline-flex px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full w-fit">
              Live data
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}