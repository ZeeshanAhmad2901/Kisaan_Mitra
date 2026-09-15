import { useEffect, useMemo, useState } from 'react'
import { getCropPrices, getMandis } from '../../api/mandiApi'
import type { CropPrice, Mandi } from '../../types'
import { formatIndianCurrency } from '../../utils/formatters'

const MOCK_TODAY_STATS = {
  totalFarmers: 47,
  todayArrivals: 12,
  todayRevenue: 345000,
  activeSlots: 8,
  pendingInQueue: 5,
  avgWaitTime: '35 min',
  completedToday: 7,
  totalProcurement: 184.5,
}

const MOCK_TODAY_BOOKINGS = [
  {
    id: '1',
    farmerName: 'Rajesh Kumar',
    crop: 'Wheat',
    quantity: '10 quintal',
    vehicle: 'UP-32-AB-1234',
    time: '6:15 AM',
    status: 'completed',
  },
  {
    id: '2',
    farmerName: 'Suresh Yadav',
    crop: 'Rice',
    quantity: '25 quintal',
    vehicle: 'UP-32-EF-9012',
    time: '6:45 AM',
    status: 'in-progress',
  },
  {
    id: '3',
    farmerName: 'Amit Singh',
    crop: 'Potato',
    quantity: '50 quintal',
    vehicle: 'UP-32-GH-3456',
    time: '7:00 AM',
    status: 'in-queue',
  },
  {
    id: '4',
    farmerName: 'Vikram Pal',
    crop: 'Mustard',
    quantity: '15 quintal',
    vehicle: 'UP-32-IJ-7890',
    time: '7:30 AM',
    status: 'in-queue',
  },
  {
    id: '5',
    farmerName: 'Ramesh Kushwaha',
    crop: 'Onion',
    quantity: '20 quintal',
    vehicle: 'UP-32-KL-2345',
    time: '8:00 AM',
    status: 'scheduled',
  },
]

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
  'in-progress': {
    label: 'Processing',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
  },
  'in-queue': {
    label: 'In Queue',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  scheduled: {
    label: 'Scheduled',
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

const HOURLY_ARRIVALS = [
  { label: '6 AM', value: 3 },
  { label: '7 AM', value: 6 },
  { label: '8 AM', value: 9 },
  { label: '9 AM', value: 12 },
  { label: '10 AM', value: 10 },
  { label: '11 AM', value: 14 },
  { label: '12 PM', value: 11 },
  { label: '1 PM', value: 8 },
]

const WEEKLY_PROCUREMENT = [
  { day: 'Mon', value: 92 },
  { day: 'Tue', value: 118 },
  { day: 'Wed', value: 105 },
  { day: 'Thu', value: 132 },
  { day: 'Fri', value: 146 },
  { day: 'Sat', value: 125 },
  { day: 'Sun', value: 98 },
]

const WAIT_TIME_DATA = [
  { day: 'Mon', value: 42 },
  { day: 'Tue', value: 38 },
  { day: 'Wed', value: 40 },
  { day: 'Thu', value: 34 },
  { day: 'Fri', value: 31 },
  { day: 'Sat', value: 35 },
  { day: 'Sun', value: 29 },
]

const CROP_DISTRIBUTION = [
  { name: 'Wheat', value: 42, icon: '🌾' },
  { name: 'Rice', value: 24, icon: '🌾' },
  { name: 'Potato', value: 16, icon: '🥔' },
  { name: 'Mustard', value: 11, icon: '🌼' },
  { name: 'Other', value: 7, icon: '🌱' },
]

const SLOT_UTILIZATION = [
  { label: '6–8 AM', booked: 18, total: 20 },
  { label: '8–10 AM', booked: 20, total: 20 },
  { label: '10–12 PM', booked: 15, total: 20 },
  { label: '12–2 PM', booked: 11, total: 20 },
  { label: '2–4 PM', booked: 9, total: 20 },
]

function MandiOwnerDashboardPage() {
  const [mandis, setMandis] = useState<Mandi[]>([])
  const [prices, setPrices] = useState<CropPrice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [mandiData, priceData] = await Promise.all([
          getMandis(),
          getCropPrices(),
        ])

        setMandis(mandiData)
        setPrices(priceData)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const currentMandi = mandis[0]

  const arrivalProgress = Math.round(
    (MOCK_TODAY_STATS.todayArrivals /
      MOCK_TODAY_STATS.totalFarmers) *
      100,
  )

  const completionProgress = Math.round(
    (MOCK_TODAY_STATS.completedToday /
      MOCK_TODAY_STATS.todayArrivals) *
      100,
  )

  const queueBookings = MOCK_TODAY_BOOKINGS.filter(
    (booking) =>
      booking.status === 'in-queue' || booking.status === 'in-progress',
  )

  const nextBooking = useMemo(
    () =>
      MOCK_TODAY_BOOKINGS.find(
        (booking) =>
          booking.status === 'in-queue' ||
          booking.status === 'in-progress',
      ),
    [],
  )

  const maxHourlyArrival = Math.max(
    ...HOURLY_ARRIVALS.map((item) => item.value),
  )

  const maxWeeklyValue = Math.max(
    ...WEEKLY_PROCUREMENT.map((item) => item.value),
  )

  const maxWaitTime = Math.max(...WAIT_TIME_DATA.map((item) => item.value))

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
                {currentMandi?.name || 'Azadpur Mandi'} Dashboard
              </h1>

              <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-slate-500">
                <span>
                  📍 {currentMandi?.location || 'New Delhi'}
                </span>

                <span>•</span>

                <span className="inline-flex items-center gap-1 text-green-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  Centre Active
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
                System status: Operational
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
                  {MOCK_TODAY_STATS.todayArrivals}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {MOCK_TODAY_STATS.totalFarmers} scheduled farmers
                </p>
              </div>

              <div className="flex items-center justify-center text-lg w-11 h-11 rounded-xl bg-green-50">
                👨‍🌾
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between mb-1 text-[11px] text-slate-400">
                <span>Arrival progress</span>
                <span>{arrivalProgress}%</span>
              </div>

              <div className="w-full h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${arrivalProgress}%` }}
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

                <p className="mt-2 text-3xl font-bold text-blue-800">
                  {formatIndianCurrency(MOCK_TODAY_STATS.todayRevenue)}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {MOCK_TODAY_STATS.completedToday} completed transactions
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
                  {MOCK_TODAY_STATS.pendingInQueue}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Avg. wait {MOCK_TODAY_STATS.avgWaitTime}
                </p>
              </div>

              <div className="flex items-center justify-center text-lg w-11 h-11 rounded-xl bg-amber-50">
                ⏳
              </div>
            </div>

            <p className="mt-4 text-xs font-semibold text-amber-700">
              {queueBookings.length} processing records
            </p>
          </div>

          <div className="p-5 bg-white border border-purple-100 shadow-sm rounded-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide text-purple-600 uppercase">
                  Procurement Volume
                </p>

                <p className="mt-2 text-3xl font-bold text-purple-800">
                  {MOCK_TODAY_STATS.totalProcurement}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Quintal processed today
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
                  {MOCK_TODAY_BOOKINGS.map((booking) => {
                    const status =
                      STATUS_META[booking.status] ?? STATUS_META.scheduled

                    return (
                      <tr
                        key={booking.id}
                        className="transition-colors hover:bg-green-50/40"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-900">
                            {booking.farmerName}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            #{booking.id}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-800">
                            {CROP_ICONS[booking.crop] ?? '🌾'} {booking.crop}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {booking.quantity}
                          </p>
                        </td>

                        <td className="px-5 py-4 font-mono text-xs text-slate-600">
                          {booking.vehicle}
                        </td>

                        <td className="px-5 py-4 font-medium text-slate-700">
                          {booking.time}
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
                        Active Record
                      </p>

                      <p className="mt-1 font-bold text-slate-900">
                        {nextBooking.farmerName}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {nextBooking.crop} • {nextBooking.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 mt-4 border-t border-blue-100">
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase">
                        Vehicle
                      </p>

                      <p className="mt-1 font-mono text-xs font-bold text-slate-800">
                        {nextBooking.vehicle}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase">
                        Scheduled
                      </p>

                      <p className="mt-1 text-xs font-bold text-blue-700">
                        {nextBooking.time}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

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
                    style={{ width: `${completionProgress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3 border bg-slate-50 rounded-xl border-slate-100">
                  <p className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                    Waiting
                  </p>
                  <p className="mt-1 text-lg font-bold text-amber-700">
                    {MOCK_TODAY_STATS.pendingInQueue}
                  </p>
                </div>

                <div className="p-3 border bg-slate-50 rounded-xl border-slate-100">
                  <p className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                    Completed
                  </p>
                  <p className="mt-1 text-lg font-bold text-green-700">
                    {MOCK_TODAY_STATS.completedToday}
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
                  Number of arrivals recorded by hour
                </p>
              </div>

              <span className="px-3 py-1 text-xs font-semibold text-green-700 border border-green-100 rounded-full bg-green-50">
                Today
              </span>
            </div>

            <div className="flex items-end h-56 gap-3 mt-8">
              {HOURLY_ARRIVALS.map((item) => (
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
                        height: `${(item.value / maxHourlyArrival) * 100}%`,
                      }}
                    />
                  </div>

                  <span className="mt-3 text-[10px] text-slate-400 whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
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
                  Daily processed quantity in quintals
                </p>
              </div>

              <span className="px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100 rounded-full bg-blue-50">
                Quintal
              </span>
            </div>

            <div className="flex items-end h-56 gap-3 mt-8">
              {WEEKLY_PROCUREMENT.map((item) => (
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
                        height: `${(item.value / maxWeeklyValue) * 100}%`,
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
          {/* Wait time trend */}
          <section className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-amber-700">
                Queue Efficiency
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-900">
                Average Waiting Time Trend
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Daily average farmer waiting time in minutes
              </p>
            </div>

            <div className="relative h-56 mt-8">
              {/* Grid */}
              <div className="absolute inset-0 flex flex-col justify-between">
                {[0, 1, 2, 3, 4].map((line) => (
                  <div
                    key={line}
                    className="border-t border-dashed border-slate-200"
                  />
                ))}
              </div>

              <div className="relative flex items-end h-full gap-3 pt-5 pb-6">
                {WAIT_TIME_DATA.map((item) => (
                  <div
                    key={item.day}
                    className="relative flex flex-col items-center justify-end flex-1 h-full"
                  >
                    <div
                      className="relative w-4 rounded-full bg-amber-400"
                      style={{
                        height: `${(item.value / maxWaitTime) * 80}%`,
                      }}
                    >
                      <div className="absolute w-3 h-3 -translate-x-1/2 border-2 border-white rounded-full left-1/2 -top-2 bg-amber-600" />
                    </div>

                    <span className="absolute bottom-0 text-[10px] text-slate-400">
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3 text-xs text-amber-700">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Current average: {MOCK_TODAY_STATS.avgWaitTime}
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
              Share of today's procurement by crop
            </p>

            <div className="mt-6 space-y-4">
              {CROP_DISTRIBUTION.map((crop) => (
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
                      style={{ width: `${crop.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
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
                Scheduled bookings versus available capacity
              </p>
            </div>

            <span className="text-xs text-slate-400">
              20 capacity per slot
            </span>
          </div>

          <div className="space-y-5">
            {SLOT_UTILIZATION.map((slot) => {
              const percentage = Math.round(
                (slot.booked / slot.total) * 100,
              )

              return (
                <div key={slot.label}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-700">
                      {slot.label}
                    </span>

                    <span className="text-xs font-semibold text-slate-500">
                      {slot.booked}/{slot.total} • {percentage}%
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
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
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
            ) : (
              <div className="divide-y divide-slate-100">
                {prices.slice(0, 5).map((price) => (
                  <div
                    key={price.id}
                    className="flex items-center justify-between px-5 py-4 hover:bg-green-50/40"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center rounded-lg w-9 h-9 bg-green-50">
                        {CROP_ICONS[price.cropName] ?? '🌾'}
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
                        {formatIndianCurrency(price.modalPrice)}
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
              Attention Required
            </h2>

            <div className="mt-5 space-y-3">
              <div className="p-4 border border-red-100 rounded-xl bg-red-50">
                <div className="flex gap-3">
                  <span>🚨</span>

                  <div>
                    <p className="text-sm font-bold text-red-900">
                      Morning slot nearly full
                    </p>

                    <p className="mt-1 text-xs leading-5 text-red-700">
                      The 8–10 AM slot is currently at full capacity.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-xl border-amber-100 bg-amber-50">
                <div className="flex gap-3">
                  <span>⏳</span>

                  <div>
                    <p className="text-sm font-bold text-amber-900">
                      Queue requires monitoring
                    </p>

                    <p className="mt-1 text-xs leading-5 text-amber-700">
                      {MOCK_TODAY_STATS.pendingInQueue} farmers are currently
                      waiting.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-green-100 rounded-xl bg-green-50">
                <div className="flex gap-3">
                  <span>✓</span>

                  <div>
                    <p className="text-sm font-bold text-green-900">
                      Centre operating normally
                    </p>

                    <p className="mt-1 text-xs leading-5 text-green-700">
                      No system-level operational issues detected.
                    </p>
                  </div>
                </div>
              </div>
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

            <div className="mt-5 space-y-5">
              {[
                {
                  icon: '✓',
                  title: 'Procurement completed',
                  text: 'Rajesh Kumar • Wheat • 10 quintal',
                  time: '6:32 AM',
                },
                {
                  icon: '🚜',
                  title: 'Farmer moved to processing',
                  text: 'Suresh Yadav • Rice • 25 quintal',
                  time: '6:48 AM',
                },
                {
                  icon: '📋',
                  title: 'New farmer checked in',
                  text: 'Amit Singh • Potato • 50 quintal',
                  time: '7:02 AM',
                },
                {
                  icon: '🕐',
                  title: 'Slot allocation updated',
                  text: 'Morning capacity refreshed',
                  time: '7:05 AM',
                },
              ].map((activity) => (
                <div
                  key={`${activity.time}-${activity.title}`}
                  className="flex gap-3"
                >
                  <div className="relative">
                    <div className="flex items-center justify-center text-sm rounded-full w-9 h-9 bg-green-50">
                      {activity.icon}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                      {activity.title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {activity.text}
                    </p>

                    <p className="mt-1 text-[10px] font-semibold text-slate-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
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
              {MOCK_TODAY_STATS.completedToday} of{' '}
              {MOCK_TODAY_STATS.todayArrivals} arrivals processed
            </p>
          </div>

          <div className="p-5 border border-blue-100 rounded-2xl bg-blue-50">
            <p className="text-xs font-semibold tracking-wide text-blue-700 uppercase">
              Avg Revenue / Visit
            </p>

            <p className="mt-2 text-2xl font-bold text-blue-900">
              {formatIndianCurrency(
                Math.round(
                  MOCK_TODAY_STATS.todayRevenue /
                    Math.max(MOCK_TODAY_STATS.completedToday, 1),
                ),
              )}
            </p>

            <p className="mt-1 text-xs text-blue-700">
              Based on today's completed transactions
            </p>
          </div>

          <div className="p-5 border rounded-2xl border-amber-100 bg-amber-50">
            <p className="text-xs font-semibold tracking-wide uppercase text-amber-700">
              Queue Load
            </p>

            <p className="mt-2 text-2xl font-bold text-amber-900">
              {MOCK_TODAY_STATS.pendingInQueue}/20
            </p>

            <p className="mt-1 text-xs text-amber-700">
              Current active capacity
            </p>
          </div>

          <div className="p-5 border border-purple-100 rounded-2xl bg-purple-50">
            <p className="text-xs font-semibold tracking-wide text-purple-700 uppercase">
              Centre Capacity
            </p>

            <p className="mt-2 text-2xl font-bold text-purple-900">
              {MOCK_TODAY_STATS.activeSlots}/20
            </p>

            <p className="mt-1 text-xs text-purple-700">
              Active time slots
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
                This dashboard provides a consolidated operational view of
                farmer arrivals, queue status, slot utilization, procurement
                volume and market information.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default MandiOwnerDashboardPage