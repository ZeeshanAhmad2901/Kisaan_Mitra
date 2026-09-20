import { useEffect, useMemo, useState } from 'react'
import {
  getMandiBookings,
  type MandiBooking,
} from '../../api/bookingApi'
import {
  createProcurement,
  getBookingProcurement,
  updateProcurement,
  type Procurement,
} from '../../api/procurementApi'
import useAuth from '../../hooks/useAuth'

type FilterType = 'all' | 'pending' | 'payment' | 'paid'

export default function ProcurementPage() {
  const { user } = useAuth()

  const [bookings, setBookings] = useState<MandiBooking[]>([])
  const [procurements, setProcurements] = useState<
    Record<number, Procurement | null>
  >({})

  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<number | null>(null)

  const [formBookingId, setFormBookingId] = useState<number | null>(null)
  const [weighedQuantity, setWeighedQuantity] = useState('')
  const [qualityGrade, setQualityGrade] = useState('')
  const [procurementAmount, setProcurementAmount] = useState('')

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')

  const loadData = async () => {
    if (!user?.mandiId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      const mandiBookings = await getMandiBookings(user.mandiId)

      setBookings(mandiBookings)

      const procurementResults = await Promise.all(
        mandiBookings.map(async (booking) => {
          try {
            const procurement = await getBookingProcurement(booking.id)

            return [booking.id, procurement] as const
          } catch (error) {
            console.error(
              `Failed to load procurement for booking ${booking.id}:`,
              error,
            )

            return [booking.id, null] as const
          }
        }),
      )

      setProcurements(Object.fromEntries(procurementResults))
    } catch (error) {
      console.error('Failed to load procurement page:', error)

      alert(
        error instanceof Error
          ? error.message
          : 'Failed to load procurement data.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [user?.mandiId])

  const eligibleBookings = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          booking.status === 'in_progress' ||
          booking.status === 'completed',
      ),
    [bookings],
  )

  /*
   * Important:
   * procurements[booking.id] can temporarily be undefined
   * before the API result exists.
   *
   * `item != null` safely removes both null and undefined.
   */
  const stats = useMemo(() => {
    const records = eligibleBookings
      .map((booking) => procurements[booking.id])
      .filter((item): item is Procurement => item != null)

    const paid = records.filter(
      (item) => item.payment_status === 'paid',
    )

    const pendingPayment = records.filter(
      (item) => item.payment_status !== 'paid',
    )

    const totalValue = records.reduce(
      (sum, item) => sum + item.procurement_amount,
      0,
    )

    const paidValue = paid.reduce(
      (sum, item) => sum + item.procurement_amount,
      0,
    )

    return {
      processed: eligibleBookings.length,
      recorded: records.length,
      pendingProcurement:
        eligibleBookings.length - records.length,
      pendingPayment: pendingPayment.length,
      paid: paid.length,
      totalValue,
      paidValue,
    }
  }, [eligibleBookings, procurements])

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase()

    return eligibleBookings.filter((booking) => {
      const procurement = procurements[booking.id]

      const matchesSearch =
        !query ||
        booking.booking_code.toLowerCase().includes(query) ||
        booking.farmer_name.toLowerCase().includes(query) ||
        booking.crop_type.toLowerCase().includes(query)

      let matchesFilter = true

      if (filter === 'pending') {
        matchesFilter = procurement == null
      }

      if (filter === 'payment') {
        matchesFilter =
          procurement != null &&
          procurement.payment_status !== 'paid'
      }

      if (filter === 'paid') {
        matchesFilter =
          procurement != null &&
          procurement.payment_status === 'paid'
      }

      return matchesSearch && matchesFilter
    })
  }, [eligibleBookings, procurements, search, filter])

  const openCreateForm = (booking: MandiBooking) => {
    setFormBookingId(booking.id)
    setWeighedQuantity(String(booking.quantity))
    setQualityGrade('')
    setProcurementAmount('')
  }

  const closeCreateForm = () => {
    setFormBookingId(null)
    setWeighedQuantity('')
    setQualityGrade('')
    setProcurementAmount('')
  }

  const handleCreate = async (booking: MandiBooking) => {
    const weighed = Number(weighedQuantity)
    const amount = Number(procurementAmount)

    if (!weighed || weighed <= 0) {
      alert('Enter a valid weighed quantity.')
      return
    }

    if (weighed > booking.quantity) {
      alert('Weighed quantity cannot exceed booked quantity.')
      return
    }

    if (!qualityGrade.trim()) {
      alert('Enter the quality grade.')
      return
    }

    if (Number.isNaN(amount) || amount < 0) {
      alert('Enter a valid procurement amount.')
      return
    }

    try {
      setSavingId(booking.id)

      const created = await createProcurement({
        booking_id: booking.id,
        weighed_quantity: weighed,
        quality_grade: qualityGrade.trim(),
        procurement_amount: amount,
      })

      setProcurements((current) => ({
        ...current,
        [booking.id]: created,
      }))

      closeCreateForm()
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to record procurement.',
      )
    } finally {
      setSavingId(null)
    }
  }

  const handleMarkPaid = async (procurement: Procurement) => {
    try {
      setSavingId(procurement.booking_id)

      const updated = await updateProcurement(procurement.id, {
        payment_status: 'paid',
      })

      setProcurements((current) => ({
        ...current,
        [procurement.booking_id]: updated,
      }))
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to update payment status.',
      )
    } finally {
      setSavingId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-slate-50">
        <div className="mx-auto space-y-5 max-w-7xl">
          <div className="h-32 bg-white shadow-sm animate-pulse rounded-2xl" />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white shadow-sm h-28 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user?.mandiId) {
    return (
      <div className="min-h-screen p-6 bg-slate-50">
        <div className="mx-auto max-w-7xl">
          <div className="p-6 border border-red-200 rounded-2xl bg-red-50">
            <h2 className="text-lg font-bold text-red-700">
              Mandi assignment missing
            </h2>

            <p className="mt-1 text-sm text-red-600">
              This operator is not assigned to a mandi.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 bg-slate-50 md:p-6">
      <div className="mx-auto space-y-6 max-w-7xl">

        {/* Header */}
        <div className="p-6 overflow-hidden text-white shadow-lg rounded-3xl bg-gradient-to-r from-emerald-700 via-green-700 to-teal-700 md:p-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                🌾 Mandi Operations
              </div>

              <h1 className="text-2xl font-black tracking-tight md:text-3xl">
                Procurement Center
              </h1>

              <p className="max-w-2xl mt-2 text-sm text-green-50 md:text-base">
                Manage weighing, quality inspection, procurement values and
                farmer payments from one place.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadData()}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-green-700 transition bg-white shadow-sm rounded-xl hover:bg-green-50 disabled:opacity-60"
            >
              ↻ Refresh Data
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Processed */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="p-3 text-xl rounded-xl bg-blue-50">
                📦
              </div>

              <span className="text-xs font-semibold text-slate-400">
                PROCESSED
              </span>
            </div>

            <p className="mt-4 text-3xl font-black text-slate-900">
              {stats.processed}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Completed bookings
            </p>
          </div>

          {/* Total value */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="p-3 text-xl rounded-xl bg-emerald-50">
                💰
              </div>

              <span className="text-xs font-semibold text-slate-400">
                VALUE
              </span>
            </div>

            <p className="mt-4 text-3xl font-black text-slate-900">
              ₹{stats.totalValue.toLocaleString('en-IN')}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Total procurement
            </p>
          </div>

          {/* Paid */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="p-3 text-xl rounded-xl bg-green-50">
                ✓
              </div>

              <span className="text-xs font-semibold text-slate-400">
                PAID
              </span>
            </div>

            <p className="mt-4 text-3xl font-black text-green-700">
              {stats.paid}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              ₹{stats.paidValue.toLocaleString('en-IN')} paid
            </p>
          </div>

          {/* Action */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="p-3 text-xl rounded-xl bg-amber-50">
                ⏳
              </div>

              <span className="text-xs font-semibold text-slate-400">
                ACTION
              </span>
            </div>

            <p className="mt-4 text-3xl font-black text-amber-600">
              {stats.pendingProcurement + stats.pendingPayment}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Items requiring attention
            </p>
          </div>
        </div>

        {/* Search and filters */}
        <div className="p-4 bg-white border shadow-sm rounded-2xl border-slate-200 md:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="relative w-full lg:max-w-md">
              <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2 text-slate-400">
                🔎
              </span>

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search booking, farmer or crop..."
                className="w-full py-3 pr-4 text-sm transition border outline-none rounded-xl border-slate-200 bg-slate-50 pl-11 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                ['all', 'All'],
                ['pending', 'Procurement Pending'],
                ['payment', 'Payment Pending'],
                ['paid', 'Paid'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value as FilterType)}
                  className={`rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                    filter === value
                      ? 'bg-green-700 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Empty state */}
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center bg-white border shadow-sm rounded-2xl border-slate-200">
            <div className="flex items-center justify-center w-16 h-16 mx-auto text-2xl rounded-full bg-slate-100">
              🔎
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-800">
              No matching bookings
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or selected filter.
            </p>
          </div>
        ) : (
          <div className="space-y-4">

            {/* Section heading */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Procurement Records
                </h2>

                <p className="text-sm text-slate-500">
                  {filteredBookings.length} booking
                  {filteredBookings.length !== 1 ? 's' : ''} shown
                </p>
              </div>
            </div>

            {/* Procurement cards */}
            {filteredBookings.map((booking) => {
              const procurement = procurements[booking.id]
              const isSaving = savingId === booking.id
              const isFormOpen = formBookingId === booking.id

              return (
                <div
                  key={booking.id}
                  className="overflow-hidden transition bg-white border shadow-sm rounded-2xl border-slate-200 hover:border-green-200 hover:shadow-md"
                >

                  {/* Card header */}
                  <div className="flex flex-col gap-4 p-5 border-b border-slate-100 md:flex-row md:items-center md:justify-between md:p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-12 h-12 text-xl shrink-0 rounded-2xl bg-green-50">
                        🌾
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-black text-slate-900">
                            {booking.booking_code}
                          </h3>

                          <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-green-700">
                            {booking.status}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          {booking.farmer_name}
                        </p>
                      </div>
                    </div>

                    {procurement?.payment_status === 'paid' && (
                      <div className="inline-flex items-center self-start gap-2 px-3 py-2 text-xs font-bold text-green-700 rounded-full bg-green-50 md:self-auto">
                        ✓ Payment Completed
                      </div>
                    )}
                  </div>

                  {/* Information */}
                  <div className="grid grid-cols-2 gap-4 p-5 border-b border-slate-100 sm:grid-cols-4 md:p-6">

                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Crop
                      </p>

                      <p className="mt-1 font-bold capitalize text-slate-800">
                        {booking.crop_type}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Booked
                      </p>

                      <p className="mt-1 font-bold text-slate-800">
                        {booking.quantity}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Weighed
                      </p>

                      <p className="mt-1 font-bold text-slate-800">
                        {procurement
                          ? procurement.weighed_quantity
                          : '—'}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Quality
                      </p>

                      <p className="mt-1 font-bold text-slate-800">
                        {procurement?.quality_grade || '—'}
                      </p>
                    </div>
                  </div>

                  {/* Card bottom */}
                  <div className="p-5 md:p-6">

                    {/* Existing procurement */}
                    {procurement ? (
                      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Procurement Amount
                          </p>

                          <p className="mt-1 text-2xl font-black text-slate-900">
                            ₹
                            {procurement.procurement_amount.toLocaleString(
                              'en-IN',
                            )}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <span
                            className={`rounded-xl px-4 py-2.5 text-xs font-black ${
                              procurement.payment_status === 'paid'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {procurement.payment_status === 'paid'
                              ? '✓ PAID'
                              : '⏳ PAYMENT PENDING'}
                          </span>

                          {procurement.payment_status !== 'paid' && (
                            <button
                              type="button"
                              onClick={() =>
                                void handleMarkPaid(procurement)
                              }
                              disabled={isSaving}
                              className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-black text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isSaving
                                ? 'Updating...'
                                : 'Mark Payment Paid'}
                            </button>
                          )}
                        </div>
                      </div>

                    ) : isFormOpen ? (

                      /* Create form */
                      <div className="p-4 border border-green-100 rounded-2xl bg-green-50/50 md:p-5">
                        <div className="mb-4">
                          <h4 className="font-black text-slate-900">
                            Record Procurement
                          </h4>

                          <p className="mt-1 text-xs text-slate-500">
                            Enter the actual weighing, quality grade and
                            procurement amount.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

                          <div>
                            <label className="mb-1.5 block text-xs font-bold text-slate-600">
                              Weighed Quantity
                            </label>

                            <input
                              type="number"
                              min="0.01"
                              max={booking.quantity}
                              step="0.01"
                              value={weighedQuantity}
                              onChange={(event) =>
                                setWeighedQuantity(event.target.value)
                              }
                              className="w-full px-3 py-3 text-sm bg-white border outline-none rounded-xl border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                            />
                          </div>

                          <div>
                            <label className="mb-1.5 block text-xs font-bold text-slate-600">
                              Quality Grade
                            </label>

                            <input
                              type="text"
                              value={qualityGrade}
                              onChange={(event) =>
                                setQualityGrade(event.target.value)
                              }
                              placeholder="e.g. Grade A"
                              className="w-full px-3 py-3 text-sm bg-white border outline-none rounded-xl border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                            />
                          </div>

                          <div>
                            <label className="mb-1.5 block text-xs font-bold text-slate-600">
                              Procurement Amount
                            </label>

                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={procurementAmount}
                              onChange={(event) =>
                                setProcurementAmount(event.target.value)
                              }
                              placeholder="₹ Amount"
                              className="w-full px-3 py-3 text-sm bg-white border outline-none rounded-xl border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                            />
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                          <button
                            type="button"
                            onClick={() => void handleCreate(booking)}
                            disabled={isSaving}
                            className="px-5 py-3 text-xs font-black text-white transition bg-green-700 rounded-xl hover:bg-green-800 disabled:opacity-50"
                          >
                            {isSaving
                              ? 'Saving...'
                              : '✓ Save Procurement'}
                          </button>

                          <button
                            type="button"
                            onClick={closeCreateForm}
                            disabled={isSaving}
                            className="px-5 py-3 text-xs font-bold transition bg-white border rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>

                    ) : (

                      /* Pending procurement */
                      <div className="flex flex-col gap-4 p-4 border border-dashed rounded-2xl border-amber-200 bg-amber-50/50 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-bold text-slate-800">
                            Procurement not recorded
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Complete weighing and quality inspection to record
                            the procurement.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => openCreateForm(booking)}
                          className="px-5 py-3 text-xs font-black text-white transition bg-green-700 shadow-sm rounded-xl hover:bg-green-800"
                        >
                          + Record Procurement
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}