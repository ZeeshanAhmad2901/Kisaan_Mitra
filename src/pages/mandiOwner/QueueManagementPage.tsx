import { useEffect, useMemo, useState } from 'react'
import {
  completeBookingProcessing,
  getMandiBookings,
  startBookingProcessing,
  type MandiBooking,
} from '../../api/bookingApi'
import { getMandis, type BackendMandi } from '../../api/mandiApi'
import { useAuth } from '../../store/authStore'

type QueueStatus =
  | 'next'
  | 'waiting'
  | 'in-progress'
  | 'completed'

interface QueueItem {
  id: number
  position: number
  farmerName: string
  farmerId: number
  crop: string
  quantity: number
  vehicle: string
  bookingCode: string
  slotDate: string
  startTime: string
  endTime: string
  bookingSource: string
  status: QueueStatus
}

const STATUS_META: Record<
  QueueStatus,
  {
    label: string
    className: string
    dot: string
  }
> = {
  next: {
    label: 'Next',
    className: 'bg-green-50 text-green-700 border-green-200',
    dot: 'bg-green-500',
  },
  waiting: {
    label: 'Waiting',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  'in-progress': {
    label: 'Processing',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
  },
  completed: {
    label: 'Completed',
    className: 'bg-slate-50 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
  },
}

function getQueueStatus(
  booking: MandiBooking,
  firstWaitingId: number | null,
): QueueStatus {
  if (booking.status === 'completed') {
    return 'completed'
  }

  if (booking.status === 'in_progress') {
    return 'in-progress'
  }

  if (
    booking.status === 'confirmed' &&
    booking.id === firstWaitingId
  ) {
    return 'next'
  }

  return 'waiting'
}

function formatTime(value: string) {
  return value.slice(0, 5)
}

function QueueManagementPage() {
  const { user } = useAuth()

  const [, setMandis] = useState<BackendMandi[]>([])
  const [bookings, setBookings] = useState<MandiBooking[]>([])
  const [selectedMandi, setSelectedMandi] =
    useState<BackendMandi | null>(null)

  const [search, setSearch] = useState('')
  const [filter, setFilter] =
    useState<'all' | QueueStatus>('all')

  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<number | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadMandis() {
      try {
        setLoading(true)
        setError('')

        const data = await getMandis()

        if (cancelled) {
          return
        }

        setMandis(data)

        const ownerMandi =
          data.find(
            (mandi) =>
              mandi.owner_id === Number(user?.id),
          ) ?? null

        setSelectedMandi(ownerMandi)

        if (!ownerMandi) {
          setBookings([])
          setError(
            'No active mandi is assigned to this account.',
          )
          return
        }

        const mandiBookings = await getMandiBookings(
          ownerMandi.id,
        )

        if (!cancelled) {
          setBookings(mandiBookings)
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load queue data.',
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadMandis()

    return () => {
      cancelled = true
    }
  }, [user?.id])

  const queue = useMemo<QueueItem[]>(() => {
    const confirmedBookings = bookings
      .filter((booking) => booking.status === 'confirmed')
      .sort((a, b) => {
        const timeDifference =
          new Date(a.created_at).getTime() -
          new Date(b.created_at).getTime()

        if (timeDifference !== 0) {
          return timeDifference
        }

        return a.id - b.id
      })

    const firstWaitingId =
      confirmedBookings[0]?.id ?? null

    return bookings
      .slice()
      .sort((a, b) => {
        const statusOrder: Record<string, number> = {
          in_progress: 0,
          confirmed: 1,
          completed: 2,
        }

        const statusDifference =
          (statusOrder[a.status] ?? 3) -
          (statusOrder[b.status] ?? 3)

        if (statusDifference !== 0) {
          return statusDifference
        }

        return (
          new Date(a.created_at).getTime() -
          new Date(b.created_at).getTime()
        )
      })
      .map((booking, index) => ({
        id: booking.id,
        position: index + 1,
        farmerName: booking.farmer_name,
        farmerId: booking.farmer_id,
        crop: booking.crop_type,
        quantity: booking.quantity,
        vehicle: booking.vehicle_number,
        bookingCode: booking.booking_code,
        slotDate: booking.slot_date,
        startTime: booking.start_time,
        endTime: booking.end_time,
        bookingSource: booking.booking_source,
        status: getQueueStatus(
          booking,
          firstWaitingId,
        ),
      }))
  }, [bookings])

  const activeQueue = queue.filter(
    (item) => item.status !== 'completed',
  )

  const waitingCount = queue.filter(
    (item) => item.status === 'waiting',
  ).length

  const processingCount = queue.filter(
    (item) => item.status === 'in-progress',
  ).length

  const completedCount = queue.filter(
    (item) => item.status === 'completed',
  ).length

  const nextItem =
    queue.find((item) => item.status === 'next') ??
    null

  const filteredQueue = useMemo(() => {
    const query = search.toLowerCase().trim()

    return queue.filter((item) => {
      const matchesFilter =
        filter === 'all' ? true : item.status === filter

      const matchesSearch =
        !query ||
        item.farmerName.toLowerCase().includes(query) ||
        item.vehicle.toLowerCase().includes(query) ||
        item.crop.toLowerCase().includes(query) ||
        item.bookingCode.toLowerCase().includes(query)

      return matchesFilter && matchesSearch
    })
  }, [queue, search, filter])

  async function handleStartProcessing(id: number) {
    try {
      setActionId(id)
      setError('')

      const updatedBooking =
        await startBookingProcessing(id)

      setBookings((current) =>
        current.map((booking) =>
          booking.id === id
            ? updatedBooking
            : booking,
        ),
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to start processing.',
      )
    } finally {
      setActionId(null)
    }
  }

  async function handleCompleteProcessing(id: number) {
    try {
      setActionId(id)
      setError('')

      const updatedBooking =
        await completeBookingProcessing(id)

      setBookings((current) => {
        const updated = current.map((booking) =>
          booking.id === id
            ? updatedBooking
            : booking,
        )

        return updated
      })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to complete processing.',
      )
    } finally {
      setActionId(null)
    }
  }

  async function handleProcessNext() {
    if (!nextItem) {
      return
    }

    await handleStartProcessing(nextItem.id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-slate-50">
      <div className="bg-white border-b border-green-100">
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-semibold tracking-wide text-green-800 uppercase border border-green-200 rounded-full bg-green-50">
                Mandi Queue Operations
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Queue Management
              </h1>

              <p className="max-w-2xl mt-2 text-sm leading-6 text-slate-500">
                Monitor real farmer bookings and control
                the processing order at your mandi.
              </p>

              {selectedMandi && (
                <p className="mt-2 text-xs font-semibold text-green-700">
                  Mandi: {selectedMandi.name}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 p-4 bg-white border shadow-sm rounded-2xl border-slate-200">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-green-50">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />
              </div>

              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-slate-400">
                  Centre Status
                </p>

                <p className="mt-1 text-sm font-bold text-green-700">
                  {selectedMandi
                    ? 'Gate Operational'
                    : 'Mandi Unavailable'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {error && (
          <div className="p-4 mb-6 text-sm font-medium text-red-700 border border-red-200 rounded-xl bg-red-50">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="p-5 bg-white border border-green-100 shadow-sm rounded-2xl">
            <p className="text-xs font-semibold tracking-wide text-green-600 uppercase">
              Active Queue
            </p>

            <p className="mt-2 text-3xl font-bold text-green-800">
              {activeQueue.length}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Real active bookings
            </p>
          </div>

          <div className="p-5 bg-white border shadow-sm rounded-2xl border-amber-100">
            <p className="text-xs font-semibold tracking-wide uppercase text-amber-600">
              Waiting
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-800">
              {waitingCount +
                (nextItem ? 1 : 0)}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Confirmed bookings
            </p>
          </div>

          <div className="p-5 bg-white border border-blue-100 shadow-sm rounded-2xl">
            <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
              Processing
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-800">
              {processingCount}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Currently processing
            </p>
          </div>

          <div className="p-5 bg-white border shadow-sm rounded-2xl border-slate-200">
            <p className="text-xs font-semibold tracking-wide uppercase text-slate-500">
              Completed
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {completedCount}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Completed bookings
            </p>
          </div>
        </div>

        <div className="grid gap-6 mt-6 lg:grid-cols-[1.5fr_0.8fr]">
          <section className="overflow-hidden bg-white border border-green-200 shadow-sm rounded-2xl">
            <div className="px-6 py-5 border-b border-green-100 bg-green-50/70">
              <p className="text-xs font-semibold tracking-widest text-green-700 uppercase">
                Priority Queue
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Next Farmer to Process
              </h2>
            </div>

            {loading ? (
              <div className="p-10 text-sm text-center text-slate-500">
                Loading live queue...
              </div>
            ) : nextItem ? (
              <div className="p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="flex items-center justify-center flex-shrink-0 w-20 h-20 text-2xl font-bold text-green-700 rounded-2xl bg-green-50">
                    #{nextItem.position}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-2xl font-bold text-slate-900">
                        {nextItem.farmerName}
                      </h3>

                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold border rounded-full bg-green-50 text-green-700 border-green-200">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        Next
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      Farmer ID: {nextItem.farmerId} •{' '}
                      {nextItem.crop} •{' '}
                      {nextItem.quantity} units
                    </p>

                    <div className="flex flex-wrap gap-3 mt-3">
                      <span className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg">
                        {nextItem.vehicle}
                      </span>

                      <span className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg">
                        {nextItem.bookingCode}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:min-w-[170px]">
                    <button
                      type="button"
                      onClick={() =>
                        void handleStartProcessing(
                          nextItem.id,
                        )
                      }
                      disabled={actionId === nextItem.id}
                      className="px-5 py-3 text-sm font-semibold text-white transition-all bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50"
                    >
                      {actionId === nextItem.id
                        ? 'Starting...'
                        : 'Start Processing'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-10 text-center">
                <h3 className="text-lg font-bold text-slate-900">
                  No confirmed booking is waiting
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  The live queue has no next farmer to
                  process.
                </p>
              </div>
            )}
          </section>

          <section className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
            <p className="text-xs font-semibold tracking-widest text-blue-700 uppercase">
              Quick Operations
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Queue Controls
            </h2>

            <button
              type="button"
              onClick={() => void handleProcessNext()}
              disabled={
                !nextItem ||
                actionId !== null
              }
              className="w-full p-4 mt-5 text-left transition-all border border-blue-100 rounded-xl bg-blue-50 hover:bg-blue-100 disabled:opacity-50"
            >
              <p className="text-sm font-bold text-blue-900">
                Process Next Farmer
              </p>

              <p className="mt-1 text-xs text-blue-700">
                Start the first confirmed booking in the
                live queue.
              </p>
            </button>

            <div className="p-4 mt-3 border border-green-100 rounded-xl bg-green-50">
              <p className="text-sm font-bold text-green-900">
                Queue Processing Active
              </p>

              <p className="mt-1 text-xs text-green-700">
                Status is synchronized with booking
                processing.
              </p>
            </div>
          </section>
        </div>

        <section className="p-4 mt-6 bg-white border shadow-sm rounded-2xl border-slate-200">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {[
                {
                  id: 'all',
                  label: 'All',
                  count: queue.length,
                },
                {
                  id: 'next',
                  label: 'Next',
                  count: queue.filter(
                    (q) => q.status === 'next',
                  ).length,
                },
                {
                  id: 'waiting',
                  label: 'Waiting',
                  count: waitingCount,
                },
                {
                  id: 'in-progress',
                  label: 'Processing',
                  count: processingCount,
                },
                {
                  id: 'completed',
                  label: 'Completed',
                  count: completedCount,
                },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setFilter(
                      item.id as
                        | 'all'
                        | QueueStatus,
                    )
                  }
                  className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                    filter === item.id
                      ? 'bg-green-700 text-white'
                      : 'text-slate-600 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  {item.label}

                  <span
                    className={`ml-2 text-xs ${
                      filter === item.id
                        ? 'text-green-100'
                        : 'text-slate-400'
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="relative lg:w-80">
              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search farmer, crop, vehicle or booking"
                className="w-full py-2.5 px-4 text-sm border rounded-xl border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </section>

        <section className="mt-6">
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-slate-400">
                Live Queue
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Farmer Processing Line
              </h2>
            </div>

            <span className="text-xs text-slate-400">
              {filteredQueue.length} record
              {filteredQueue.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center bg-white border shadow-sm rounded-2xl border-slate-200">
              <p className="text-sm text-slate-500">
                Loading live queue...
              </p>
            </div>
          ) : filteredQueue.length === 0 ? (
            <div className="p-12 text-center bg-white border shadow-sm rounded-2xl border-slate-200">
              <h3 className="font-bold text-slate-900">
                No matching records
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                There are no bookings matching the current
                search or status filter.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQueue.map((item) => {
                const status =
                  STATUS_META[item.status]

                return (
                  <div
                    key={item.id}
                    className={`relative overflow-hidden bg-white border shadow-sm rounded-2xl ${
                      item.status === 'in-progress'
                        ? 'border-blue-300 ring-2 ring-blue-50'
                        : item.status === 'next'
                          ? 'border-green-300 ring-2 ring-green-50'
                          : 'border-slate-200'
                    }`}
                  >
                    <div className="p-5 md:p-6">
                      <div className="flex flex-col gap-5 md:flex-row md:items-center">
                        <div className="flex items-center gap-3 md:w-36">
                          <div
                            className={`flex items-center justify-center flex-shrink-0 w-14 h-14 text-lg font-bold border-2 rounded-2xl ${
                              item.status ===
                              'completed'
                                ? 'bg-slate-50 border-slate-200 text-slate-400'
                                : item.status ===
                                    'in-progress'
                                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                                  : item.status ===
                                      'next'
                                    ? 'bg-green-50 border-green-300 text-green-700'
                                    : 'bg-amber-50 border-amber-200 text-amber-700'
                            }`}
                          >
                            {item.status ===
                            'completed'
                              ? '✓'
                              : `#${item.position}`}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="mb-2">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold border rounded-full ${status.className}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                              />
                              {status.label}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-bold text-slate-900">
                              {item.farmerName}
                            </h3>

                            <span className="text-sm font-semibold text-slate-600">
                              {item.crop}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 gap-2 mt-3 text-xs sm:grid-cols-2 lg:grid-cols-5">
                            <div className="p-2.5 rounded-lg bg-slate-50">
                              <p className="text-[10px] font-semibold text-slate-400 uppercase">
                                Quantity
                              </p>

                              <p className="mt-1 font-semibold text-slate-800">
                                {item.quantity}
                              </p>
                            </div>

                            <div className="p-2.5 rounded-lg bg-slate-50">
                              <p className="text-[10px] font-semibold text-slate-400 uppercase">
                                Vehicle
                              </p>

                              <p className="mt-1 font-mono font-semibold text-slate-800">
                                {item.vehicle}
                              </p>
                            </div>

                            <div className="p-2.5 rounded-lg bg-slate-50">
                              <p className="text-[10px] font-semibold text-slate-400 uppercase">
                                Booking
                              </p>

                              <p className="mt-1 font-semibold text-slate-800">
                                {item.bookingCode}
                              </p>
                            </div>

                            <div className="p-2.5 rounded-lg bg-slate-50">
                              <p className="text-[10px] font-semibold text-slate-400 uppercase">
                                Slot
                              </p>

                              <p className="mt-1 font-semibold text-slate-800">
                                {formatTime(
                                  item.startTime,
                                )}{' '}
                                -{' '}
                                {formatTime(
                                  item.endTime,
                                )}
                              </p>
                            </div>

                            <div className="p-2.5 rounded-lg bg-slate-50">
                              <p className="text-[10px] font-semibold text-slate-400 uppercase">
                                Source
                              </p>

                              <p className="mt-1 font-semibold text-slate-800">
                                {item.bookingSource}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 md:w-40">
                          {item.status === 'next' && (
                            <button
                              type="button"
                              onClick={() =>
                                void handleStartProcessing(
                                  item.id,
                                )
                              }
                              disabled={
                                actionId === item.id
                              }
                              className="w-full px-4 py-3 text-sm font-semibold text-white transition-all bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50"
                            >
                              {actionId === item.id
                                ? 'Starting...'
                                : 'Start Processing'}
                            </button>
                          )}

                          {item.status ===
                            'in-progress' && (
                            <button
                              type="button"
                              onClick={() =>
                                void handleCompleteProcessing(
                                  item.id,
                                )
                              }
                              disabled={
                                actionId === item.id
                              }
                              className="w-full px-4 py-3 text-sm font-semibold text-white transition-all bg-green-700 rounded-xl hover:bg-green-800 disabled:opacity-50"
                            >
                              {actionId === item.id
                                ? 'Completing...'
                                : 'Mark Done'}
                            </button>
                          )}

                          {item.status ===
                            'completed' && (
                            <div className="px-4 py-3 text-sm font-semibold text-center border text-slate-500 rounded-xl border-slate-200 bg-slate-50">
                              ✓ Processed
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        <div className="grid gap-4 mt-6 sm:grid-cols-3">
          <div className="p-5 border border-green-100 rounded-2xl bg-green-50">
            <p className="text-xs font-semibold tracking-wide text-green-700 uppercase">
              Queue Health
            </p>

            <p className="mt-2 text-xl font-bold text-green-900">
              {activeQueue.length > 0
                ? 'Active'
                : 'Clear'}
            </p>

            <p className="mt-1 text-xs text-green-700">
              Based on current booking states.
            </p>
          </div>

          <div className="p-5 border border-blue-100 rounded-2xl bg-blue-50">
            <p className="text-xs font-semibold tracking-wide text-blue-700 uppercase">
              Processing Status
            </p>

            <p className="mt-2 text-xl font-bold text-blue-900">
              {processingCount > 0
                ? 'In Progress'
                : 'Ready'}
            </p>

            <p className="mt-1 text-xs text-blue-700">
              {processingCount} booking currently
              processing.
            </p>
          </div>

          <div className="p-5 border rounded-2xl border-amber-100 bg-amber-50">
            <p className="text-xs font-semibold tracking-wide uppercase text-amber-700">
              Queue Source
            </p>

            <p className="mt-2 text-xl font-bold text-amber-900">
              Live Bookings
            </p>

            <p className="mt-1 text-xs text-amber-700">
              Queue records come directly from the backend.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default QueueManagementPage