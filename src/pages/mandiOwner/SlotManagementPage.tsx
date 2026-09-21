import { useCallback, useEffect, useMemo, useState } from 'react'
import { getMandis, type BackendMandi } from '../../api/mandiApi'
import {
    createSlot,
    deactivateSlot,
    getSlots,
    type BackendSlot,
} from '../../api/slotApi'
import { useAuth } from '../../store/authStore'

function getTodayString() {
  const now = new Date()
  const localDate = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000,
  )

  return localDate.toISOString().split('T')[0]
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(':').map(Number)
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)

  return date.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function SlotManagementPage() {
  const { user } = useAuth()

  const [mandi, setMandi] = useState<BackendMandi | null>(null)
  const [slots, setSlots] = useState<BackendSlot[]>([])
  const [selectedDate, setSelectedDate] = useState(getTodayString())

  const [startTime, setStartTime] = useState('06:00')
  const [endTime, setEndTime] = useState('08:00')
  const [totalSlots, setTotalSlots] = useState('5')

  const [loading, setLoading] = useState(true)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [creating, setCreating] = useState(false)
  const [deactivatingId, setDeactivatingId] = useState<number | null>(null)

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const ownerId = Number(user?.id)

  const loadSlots = useCallback(async (mandiId: number, date: string) => {
    setLoadingSlots(true)
    setError(null)

    try {
      const data = await getSlots(String(mandiId), date)
      setSlots(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load slots.',
      )
      setSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }, [])

  const loadMandi = useCallback(async () => {
    if (!user || user.role !== 'mandiOwner') {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const mandis = await getMandis()

      const ownerMandi =
        mandis.find((item) => item.owner_id === ownerId) ?? null

      setMandi(ownerMandi)

      if (!ownerMandi) {
        setSlots([])
        setError('No active mandi is assigned to this account.')
        return
      }

      await loadSlots(ownerMandi.id, selectedDate)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load mandi information.',
      )
      setMandi(null)
      setSlots([])
    } finally {
      setLoading(false)
    }
  }, [loadSlots, ownerId, selectedDate, user])

  useEffect(() => {
    void loadMandi()
  }, [loadMandi])

  const activeSlots = useMemo(
    () => slots.filter((slot) => slot.is_active),
    [slots],
  )

  const totalCapacity = useMemo(
    () =>
      activeSlots.reduce(
        (total, slot) => total + slot.total_slots,
        0,
      ),
    [activeSlots],
  )

  const bookedCapacity = useMemo(
    () =>
      activeSlots.reduce(
        (total, slot) => total + slot.booked_slots,
        0,
      ),
    [activeSlots],
  )

  const availableCapacity = Math.max(
    totalCapacity - bookedCapacity,
    0,
  )

  const handleDateChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const date = event.target.value
    setSelectedDate(date)
    setSuccess(null)

    if (mandi) {
      await loadSlots(mandi.id, date)
    }
  }

  const handleCreateSlot = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    if (!mandi) {
      setError('No active mandi is assigned to this account.')
      return
    }

    if (!startTime || !endTime) {
      setError('Please select both start and end time.')
      return
    }

    if (endTime <= startTime) {
      setError('End time must be later than start time.')
      return
    }

    const capacity = Number(totalSlots)

    if (!Number.isInteger(capacity) || capacity <= 0) {
      setError('Total slots must be a positive whole number.')
      return
    }

    setCreating(true)
    setError(null)
    setSuccess(null)

    try {
      await createSlot({
        mandi_id: mandi.id,
        slot_date: selectedDate,
        start_time: `${startTime}:00`,
        end_time: `${endTime}:00`,
        total_slots: capacity,
      })

      setSuccess('Slot created successfully.')

      setStartTime('06:00')
      setEndTime('08:00')
      setTotalSlots('5')

      await loadSlots(mandi.id, selectedDate)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to create slot.',
      )
    } finally {
      setCreating(false)
    }
  }

  const handleDeactivate = async (slotId: number) => {
    const confirmed = window.confirm(
      'Are you sure you want to deactivate this slot?',
    )

    if (!confirmed) {
      return
    }

    setDeactivatingId(slotId)
    setError(null)
    setSuccess(null)

    try {
      await deactivateSlot(slotId)

      setSuccess('Slot deactivated successfully.')

      if (mandi) {
        await loadSlots(mandi.id, selectedDate)
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to deactivate slot.',
      )
    } finally {
      setDeactivatingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 via-white to-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto border-4 border-green-200 rounded-full border-t-green-700 animate-spin" />
          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading slot management...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-green-100">
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-semibold tracking-wide text-green-800 uppercase border border-green-200 rounded-full bg-green-50">
                Slot Operations
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Slot Management
              </h1>

              <p className="max-w-2xl mt-2 text-sm leading-6 text-slate-500">
                Create and manage real farmer arrival slots for your
                assigned mandi.
              </p>
            </div>

            {mandi && (
              <div className="p-4 bg-white border shadow-sm rounded-2xl border-slate-200">
                <p className="text-xs font-semibold tracking-widest uppercase text-slate-400">
                  Assigned Mandi
                </p>

                <p className="mt-1 text-lg font-bold text-green-800">
                  {mandi.name}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {mandi.location}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Messages */}
        {error && (
          <div className="flex items-start justify-between gap-4 p-4 mb-6 text-sm text-red-700 border border-red-200 rounded-xl bg-red-50">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError(null)}
              className="font-bold text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="flex items-start justify-between gap-4 p-4 mb-6 text-sm text-green-700 border border-green-200 rounded-xl bg-green-50">
            <span>{success}</span>

            <button
              type="button"
              onClick={() => setSuccess(null)}
              className="font-bold text-green-500 hover:text-green-700"
            >
              ×
            </button>
          </div>
        )}

        {!mandi ? (
          <div className="p-10 text-center bg-white border shadow-sm rounded-2xl border-slate-200">
            <div className="flex items-center justify-center w-16 h-16 mx-auto text-2xl rounded-2xl bg-amber-50">
              !
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              No Mandi Assigned
            </h2>

            <p className="max-w-md mx-auto mt-2 text-sm text-slate-500">
              This Mandi Owner account does not currently have an
              active mandi assigned to it.
            </p>
          </div>
        ) : (
          <>
            {/* Date + KPIs */}
            <section className="grid gap-4 mb-6 lg:grid-cols-[1fr_2fr]">
              <div className="p-5 bg-white border shadow-sm rounded-2xl border-slate-200">
                <label
                  htmlFor="slot-date"
                  className="block text-xs font-semibold tracking-widest uppercase text-slate-500"
                >
                  Slot Date
                </label>

                <input
                  id="slot-date"
                  type="date"
                  value={selectedDate}
                  min={getTodayString()}
                  onChange={handleDateChange}
                  className="w-full px-4 py-3 mt-3 text-sm font-semibold border rounded-xl border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <p className="mt-3 text-xs text-slate-400">
                  Managing slots for {formatDate(selectedDate)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <div className="p-5 bg-white border border-green-100 shadow-sm rounded-2xl">
                  <p className="text-xs font-semibold tracking-wide text-green-600 uppercase">
                    Active Slots
                  </p>

                  <p className="mt-2 text-3xl font-bold text-green-800">
                    {activeSlots.length}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Available time windows
                  </p>
                </div>

                <div className="p-5 bg-white border border-blue-100 shadow-sm rounded-2xl">
                  <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
                    Booked
                  </p>

                  <p className="mt-2 text-3xl font-bold text-blue-800">
                    {bookedCapacity}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Farmers currently booked
                  </p>
                </div>

                <div className="p-5 bg-white border shadow-sm rounded-2xl border-amber-100">
                  <p className="text-xs font-semibold tracking-wide uppercase text-amber-600">
                    Available
                  </p>

                  <p className="mt-2 text-3xl font-bold text-amber-800">
                    {availableCapacity}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Remaining capacity
                  </p>
                </div>
              </div>
            </section>

            {/* Create Slot */}
            <section className="p-6 mb-6 bg-white border shadow-sm rounded-2xl border-slate-200">
              <div className="mb-5">
                <p className="text-xs font-semibold tracking-widest text-green-700 uppercase">
                  Create Slot
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Add Arrival Window
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Create a real booking window that farmers can see
                  and book.
                </p>
              </div>

              <form
                onSubmit={handleCreateSlot}
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-5"
              >
                <div>
                  <label
                    htmlFor="start-time"
                    className="block text-xs font-semibold text-slate-600"
                  >
                    Start Time
                  </label>

                  <input
                    id="start-time"
                    type="time"
                    value={startTime}
                    onChange={(event) =>
                      setStartTime(event.target.value)
                    }
                    required
                    className="w-full px-3 py-3 mt-2 text-sm border rounded-xl border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="end-time"
                    className="block text-xs font-semibold text-slate-600"
                  >
                    End Time
                  </label>

                  <input
                    id="end-time"
                    type="time"
                    value={endTime}
                    onChange={(event) =>
                      setEndTime(event.target.value)
                    }
                    required
                    className="w-full px-3 py-3 mt-2 text-sm border rounded-xl border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="total-slots"
                    className="block text-xs font-semibold text-slate-600"
                  >
                    Capacity
                  </label>

                  <input
                    id="total-slots"
                    type="number"
                    min="1"
                    step="1"
                    value={totalSlots}
                    onChange={(event) =>
                      setTotalSlots(event.target.value)
                    }
                    required
                    className="w-full px-3 py-3 mt-2 text-sm border rounded-xl border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="lg:col-span-2">
                  <label
                    htmlFor="selected-mandi"
                    className="block text-xs font-semibold text-slate-600"
                  >
                    Mandi
                  </label>

                  <div
                    id="selected-mandi"
                    className="px-3 py-3 mt-2 text-sm font-semibold border rounded-xl border-slate-200 bg-slate-50 text-slate-700"
                  >
                    {mandi.name}
                  </div>
                </div>

                <div className="md:col-span-2 lg:col-span-5">
                  <button
                    type="submit"
                    disabled={creating}
                    className="w-full px-5 py-3 text-sm font-semibold text-white transition-colors bg-green-700 rounded-xl hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {creating ? 'Creating Slot...' : '+ Create Slot'}
                  </button>
                </div>
              </form>
            </section>

            {/* Slots */}
            <section>
              <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-slate-400">
                    Live Slots
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    {formatDate(selectedDate)}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    mandi && void loadSlots(mandi.id, selectedDate)
                  }
                  disabled={loadingSlots}
                  className="px-4 py-2.5 text-sm font-semibold text-green-700 border border-green-200 rounded-xl bg-green-50 hover:bg-green-100 disabled:opacity-50"
                >
                  {loadingSlots ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>

              {loadingSlots ? (
                <div className="p-10 text-center bg-white border shadow-sm rounded-2xl border-slate-200">
                  <div className="w-8 h-8 mx-auto border-4 border-green-200 rounded-full border-t-green-700 animate-spin" />
                  <p className="mt-3 text-sm text-slate-500">
                    Loading slots...
                  </p>
                </div>
              ) : slots.length === 0 ? (
                <div className="p-12 text-center bg-white border shadow-sm rounded-2xl border-slate-200">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto text-2xl rounded-2xl bg-green-50">
                    +
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-slate-900">
                    No slots for this date
                  </h3>

                  <p className="max-w-md mx-auto mt-1 text-sm text-slate-500">
                    Create a slot above and it will immediately become
                    available to farmers.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {slots.map((slot) => {
                    const remaining = Math.max(
                      slot.total_slots - slot.booked_slots,
                      0,
                    )

                    const utilization =
                      slot.total_slots > 0
                        ? Math.min(
                            Math.round(
                              (slot.booked_slots /
                                slot.total_slots) *
                                100,
                            ),
                            100,
                          )
                        : 0

                    return (
                      <div
                        key={slot.id}
                        className={`p-5 bg-white border shadow-sm rounded-2xl ${
                          slot.is_active
                            ? 'border-slate-200'
                            : 'border-slate-100 opacity-70'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-bold text-slate-900">
                                {formatTime(slot.start_time)} –{' '}
                                {formatTime(slot.end_time)}
                              </h3>

                              <span
                                className={`px-2.5 py-1 text-[11px] font-bold border rounded-full ${
                                  slot.is_active
                                    ? 'text-green-700 bg-green-50 border-green-200'
                                    : 'text-slate-500 bg-slate-50 border-slate-200'
                                }`}
                              >
                                {slot.is_active
                                  ? 'Active'
                                  : 'Inactive'}
                              </span>
                            </div>

                            <p className="mt-1 text-xs text-slate-400">
                              Slot #{slot.id}
                            </p>
                          </div>

                          {slot.is_active && (
                            <button
                              type="button"
                              onClick={() =>
                                void handleDeactivate(slot.id)
                              }
                              disabled={
                                deactivatingId === slot.id
                              }
                              className="px-3 py-2 text-xs font-semibold text-red-600 border border-red-100 rounded-lg hover:bg-red-50 disabled:opacity-50"
                            >
                              {deactivatingId === slot.id
                                ? 'Deactivating...'
                                : 'Deactivate'}
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-3 mt-5">
                          <div className="p-3 rounded-xl bg-slate-50">
                            <p className="text-[10px] font-semibold tracking-wide uppercase text-slate-400">
                              Capacity
                            </p>

                            <p className="mt-1 text-lg font-bold text-slate-800">
                              {slot.total_slots}
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-blue-50">
                            <p className="text-[10px] font-semibold tracking-wide uppercase text-blue-500">
                              Booked
                            </p>

                            <p className="mt-1 text-lg font-bold text-blue-800">
                              {slot.booked_slots}
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-green-50">
                            <p className="text-[10px] font-semibold tracking-wide uppercase text-green-500">
                              Remaining
                            </p>

                            <p className="mt-1 text-lg font-bold text-green-800">
                              {remaining}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-slate-500">
                              Utilization
                            </span>

                            <span className="text-xs font-bold text-slate-700">
                              {utilization}%
                            </span>
                          </div>

                          <div className="w-full h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full transition-all bg-green-600 rounded-full"
                              style={{
                                width: `${utilization}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default SlotManagementPage