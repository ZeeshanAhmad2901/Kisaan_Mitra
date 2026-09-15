import { formatIndianCurrency } from '../../utils/formatters'

const MOCK_WEEKLY_DATA = [
  { day: 'Mon', arrivals: 8, revenue: 185000, quantity: 92 },
  { day: 'Tue', arrivals: 12, revenue: 310000, quantity: 118 },
  { day: 'Wed', arrivals: 10, revenue: 245000, quantity: 105 },
  { day: 'Thu', arrivals: 15, revenue: 420000, quantity: 132 },
  { day: 'Fri', arrivals: 11, revenue: 290000, quantity: 146 },
  { day: 'Sat', arrivals: 18, revenue: 510000, quantity: 125 },
  { day: 'Sun', arrivals: 5, revenue: 120000, quantity: 98 },
]

const MOCK_CROP_STATS = [
  {
    crop: 'Wheat',
    icon: '🌾',
    totalQty: 250,
    revenue: 581250,
    percentage: 35,
  },
  {
    crop: 'Rice',
    icon: '🌾',
    totalQty: 180,
    revenue: 585000,
    percentage: 28,
  },
  {
    crop: 'Potato',
    icon: '🥔',
    totalQty: 300,
    revenue: 300000,
    percentage: 18,
  },
  {
    crop: 'Mustard',
    icon: '🌼',
    totalQty: 90,
    revenue: 450000,
    percentage: 12,
  },
  {
    crop: 'Onion',
    icon: '🧅',
    totalQty: 60,
    revenue: 72000,
    percentage: 7,
  },
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

const SLOT_UTILIZATION = [
  { label: '6–8 AM', booked: 18, total: 20 },
  { label: '8–10 AM', booked: 20, total: 20 },
  { label: '10–12 PM', booked: 15, total: 20 },
  { label: '12–2 PM', booked: 11, total: 20 },
  { label: '2–4 PM', booked: 9, total: 20 },
]

const VEHICLE_MIX = [
  { type: 'Tractor', icon: '🚜', value: 48 },
  { type: 'Truck', icon: '🚛', value: 31 },
  { type: 'Tempo', icon: '🚐', value: 14 },
  { type: 'Other', icon: '🚗', value: 7 },
]

const MAX_REVENUE = Math.max(
  ...MOCK_WEEKLY_DATA.map((item) => item.revenue),
)

const MAX_ARRIVALS = Math.max(
  ...MOCK_WEEKLY_DATA.map((item) => item.arrivals),
)

const MAX_QUANTITY = Math.max(
  ...MOCK_WEEKLY_DATA.map((item) => item.quantity),
)

const MAX_WAIT_TIME = Math.max(
  ...WAIT_TIME_DATA.map((item) => item.value),
)

function ReportsPage() {
  const totalWeekRevenue = MOCK_WEEKLY_DATA.reduce(
    (sum, item) => sum + item.revenue,
    0,
  )

  const totalWeekArrivals = MOCK_WEEKLY_DATA.reduce(
    (sum, item) => sum + item.arrivals,
    0,
  )

  const totalWeekQuantity = MOCK_WEEKLY_DATA.reduce(
    (sum, item) => sum + item.quantity,
    0,
  )

  const avgRevenuePerFarmer = Math.round(
    totalWeekRevenue / totalWeekArrivals,
  )

  const avgDailyRevenue = Math.round(totalWeekRevenue / 7)

  const avgWaitTime = Math.round(
    WAIT_TIME_DATA.reduce((sum, item) => sum + item.value, 0) /
      WAIT_TIME_DATA.length,
  )

  const overallSlotUtilization = Math.round(
    (SLOT_UTILIZATION.reduce(
      (sum, item) => sum + item.booked,
      0,
    ) /
      SLOT_UTILIZATION.reduce(
        (sum, item) => sum + item.total,
        0,
      )) *
      100,
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-green-100">
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-semibold tracking-wide text-green-800 uppercase border border-green-200 rounded-full bg-green-50">
                <span>📊</span>
                Mandi Performance Center
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Reports & Analytics
              </h1>

              <p className="max-w-2xl mt-2 text-sm leading-6 text-slate-500">
                Review procurement performance, farmer arrivals, slot
                utilization, crop mix and operational efficiency.
              </p>
            </div>

            <div className="p-4 bg-white border shadow-sm rounded-2xl border-slate-200">
              <p className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
                Reporting Period
              </p>

              <p className="mt-1 text-sm font-bold text-slate-900">
                Last 7 Days
              </p>

              <p className="mt-1 text-xs text-green-700">
                Operational summary
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <div className="p-5 bg-white border border-green-100 shadow-sm rounded-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide text-green-600 uppercase">
                  Weekly Revenue
                </p>

                <p className="mt-2 text-3xl font-bold text-green-800">
                  {formatIndianCurrency(totalWeekRevenue)}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Across completed activity
                </p>
              </div>

              <div className="flex items-center justify-center text-lg w-11 h-11 rounded-xl bg-green-50">
                ₹
              </div>
            </div>
          </div>

          <div className="p-5 bg-white border border-blue-100 shadow-sm rounded-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
                  Weekly Arrivals
                </p>

                <p className="mt-2 text-3xl font-bold text-blue-800">
                  {totalWeekArrivals}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Farmer visits recorded
                </p>
              </div>

              <div className="flex items-center justify-center text-lg w-11 h-11 rounded-xl bg-blue-50">
                👨‍🌾
              </div>
            </div>
          </div>

          <div className="p-5 bg-white border border-purple-100 shadow-sm rounded-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide text-purple-600 uppercase">
                  Procurement Volume
                </p>

                <p className="mt-2 text-3xl font-bold text-purple-800">
                  {totalWeekQuantity}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Quintal processed
                </p>
              </div>

              <div className="flex items-center justify-center text-lg w-11 h-11 rounded-xl bg-purple-50">
                📦
              </div>
            </div>
          </div>

          <div className="p-5 bg-white border shadow-sm rounded-2xl border-amber-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide uppercase text-amber-600">
                  Avg. Wait Time
                </p>

                <p className="mt-2 text-3xl font-bold text-amber-800">
                  {avgWaitTime} min
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Average weekly wait
                </p>
              </div>

              <div className="flex items-center justify-center text-lg w-11 h-11 rounded-xl bg-amber-50">
                ⏱️
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid gap-4 mt-6 md:grid-cols-3">
          <div className="p-5 border border-green-100 rounded-2xl bg-green-50">
            <p className="text-xs font-semibold tracking-wide text-green-700 uppercase">
              Average Daily Revenue
            </p>

            <p className="mt-2 text-2xl font-bold text-green-900">
              {formatIndianCurrency(avgDailyRevenue)}
            </p>

            <p className="mt-1 text-xs text-green-700">
              Weekly revenue divided across 7 days
            </p>
          </div>

          <div className="p-5 border border-blue-100 rounded-2xl bg-blue-50">
            <p className="text-xs font-semibold tracking-wide text-blue-700 uppercase">
              Revenue / Farmer
            </p>

            <p className="mt-2 text-2xl font-bold text-blue-900">
              {formatIndianCurrency(avgRevenuePerFarmer)}
            </p>

            <p className="mt-1 text-xs text-blue-700">
              Average estimated value per arrival
            </p>
          </div>

          <div className="p-5 border border-purple-100 rounded-2xl bg-purple-50">
            <p className="text-xs font-semibold tracking-wide text-purple-700 uppercase">
              Slot Utilization
            </p>

            <p className="mt-2 text-2xl font-bold text-purple-900">
              {overallSlotUtilization}%
            </p>

            <p className="mt-1 text-xs text-purple-700">
              Across configured daily slots
            </p>
          </div>
        </div>

        {/* Revenue + Arrivals Charts */}
        <div className="grid gap-6 mt-8 lg:grid-cols-2">
          {/* Revenue chart */}
          <section className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold tracking-widest text-green-700 uppercase">
                  Revenue Trend
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Weekly Revenue
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Daily revenue generated from procurement activity
                </p>
              </div>

              <span className="px-3 py-1 text-xs font-semibold text-green-700 border border-green-100 rounded-full bg-green-50">
                7 Days
              </span>
            </div>

            <div className="flex items-end h-64 gap-3 mt-8">
              {MOCK_WEEKLY_DATA.map((item) => (
                <div
                  key={item.day}
                  className="flex flex-col items-center justify-end flex-1 h-full"
                >
                  <span className="mb-2 text-[10px] font-semibold text-slate-500">
                    ₹{Math.round(item.revenue / 1000)}k
                  </span>

                  <div className="flex items-end w-full h-full max-h-48">
                    <div
                      className="w-full transition-all bg-green-500 rounded-t-xl hover:bg-green-600"
                      style={{
                        height: `${(item.revenue / MAX_REVENUE) * 100}%`,
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

          {/* Arrivals chart */}
          <section className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
            <div>
              <p className="text-xs font-semibold tracking-widest text-blue-700 uppercase">
                Arrival Trend
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Daily Farmer Arrivals
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Number of scheduled or recorded farmer visits per day
              </p>
            </div>

            <div className="flex items-end h-64 gap-3 mt-8">
              {MOCK_WEEKLY_DATA.map((item) => (
                <div
                  key={item.day}
                  className="flex flex-col items-center justify-end flex-1 h-full"
                >
                  <span className="mb-2 text-[10px] font-semibold text-slate-500">
                    {item.arrivals}
                  </span>

                  <div className="flex items-end w-full h-full max-h-48">
                    <div
                      className="w-full transition-all bg-blue-500 rounded-t-xl hover:bg-blue-600"
                      style={{
                        height: `${(item.arrivals / MAX_ARRIVALS) * 100}%`,
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

        {/* Quantity + Wait Time */}
        <div className="grid gap-6 mt-6 lg:grid-cols-2">
          {/* Procurement volume */}
          <section className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
            <div>
              <p className="text-xs font-semibold tracking-widest text-purple-700 uppercase">
                Procurement Trend
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Weekly Quantity Processed
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Daily procurement volume in quintals
              </p>
            </div>

            <div className="flex items-end h-56 gap-3 mt-8">
              {MOCK_WEEKLY_DATA.map((item) => (
                <div
                  key={item.day}
                  className="flex flex-col items-center justify-end flex-1 h-full"
                >
                  <span className="mb-2 text-[10px] font-semibold text-slate-500">
                    {item.quantity}
                  </span>

                  <div className="flex items-end w-full h-full max-h-40">
                    <div
                      className="w-full bg-purple-500 rounded-t-xl"
                      style={{
                        height: `${(item.quantity / MAX_QUANTITY) * 100}%`,
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

          {/* Wait time */}
          <section className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-amber-700">
                Queue Efficiency
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Average Wait Time
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Daily average farmer waiting time in minutes
              </p>
            </div>

            <div className="relative h-56 mt-8">
              <div className="absolute inset-0 flex flex-col justify-between">
                {[0, 1, 2, 3, 4].map((line) => (
                  <div
                    key={line}
                    className="border-t border-dashed border-slate-200"
                  />
                ))}
              </div>

              <div className="relative flex items-end h-full gap-3 px-2 pb-6">
                {WAIT_TIME_DATA.map((item) => (
                  <div
                    key={item.day}
                    className="flex flex-col items-center justify-end flex-1 h-full"
                  >
                    <span className="mb-1 text-[10px] font-semibold text-amber-700">
                      {item.value}
                    </span>

                    <div
                      className="w-4 rounded-t-full bg-amber-400"
                      style={{
                        height: `${(item.value / MAX_WAIT_TIME) * 75}%`,
                      }}
                    />

                    <span className="absolute bottom-0 text-[10px] text-slate-400">
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3 text-xs text-amber-700">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Weekly average: {avgWaitTime} minutes
            </div>
          </section>
        </div>

        {/* Crop Breakdown + Vehicle Mix */}
        <div className="grid gap-6 mt-6 lg:grid-cols-[1.3fr_0.7fr]">
          {/* Crop breakdown */}
          <section className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
            <div>
              <p className="text-xs font-semibold tracking-widest text-green-700 uppercase">
                Crop Analysis
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Procurement by Crop
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Quantity and estimated revenue contribution
              </p>
            </div>

            <div className="mt-6 space-y-5">
              {MOCK_CROP_STATS.map((crop) => (
                <div key={crop.crop}>
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center rounded-lg w-9 h-9 bg-green-50">
                        {crop.icon}
                      </div>

                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {crop.crop}
                        </p>

                        <p className="text-[11px] text-slate-400">
                          {crop.totalQty} quintal
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">
                        {formatIndianCurrency(crop.revenue)}
                      </p>

                      <p className="text-[10px] text-slate-400">
                        {crop.percentage}% share
                      </p>
                    </div>
                  </div>

                  <div className="w-full h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full transition-all bg-green-500 rounded-full"
                      style={{ width: `${crop.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Vehicle mix */}
          <section className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
            <p className="text-xs font-semibold tracking-widest text-blue-700 uppercase">
              Transport Analysis
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Vehicle Mix
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Share of farmer arrivals by vehicle type
            </p>

            <div className="mt-6 space-y-5">
              {VEHICLE_MIX.map((vehicle) => (
                <div key={vehicle.type}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <span>{vehicle.icon}</span>
                      {vehicle.type}
                    </span>

                    <span className="text-xs font-bold text-slate-500">
                      {vehicle.value}%
                    </span>
                  </div>

                  <div className="w-full h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${vehicle.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 mt-6 border border-blue-100 rounded-xl bg-blue-50">
              <p className="text-xs font-bold text-blue-900">
                Transport insight
              </p>

              <p className="mt-1 text-[11px] leading-5 text-blue-700">
                Tractors and trucks account for the largest share of recorded
                farmer arrivals in this sample.
              </p>
            </div>
          </section>
        </div>

        {/* Slot Utilization */}
        <section className="p-6 mt-6 bg-white border shadow-sm rounded-2xl border-slate-200">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-widest text-green-700 uppercase">
                Slot Performance
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Time-Slot Utilization
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Booked slots compared with configured capacity
              </p>
            </div>

            <span className="text-xs text-slate-400">
              {overallSlotUtilization}% overall utilization
            </span>
          </div>

          <div className="mt-6 space-y-5">
            {SLOT_UTILIZATION.map((slot) => {
              const percentage = Math.round(
                (slot.booked / slot.total) * 100,
              )

              return (
                <div key={slot.label}>
                  <div className="flex items-center justify-between mb-2">
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

        {/* Daily breakdown */}
        <section className="mt-6 overflow-hidden bg-white border shadow-sm rounded-2xl border-slate-200">
          <div className="px-5 py-5 border-b border-slate-100">
            <p className="text-xs font-semibold tracking-widest uppercase text-slate-400">
              Detailed Records
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Daily Performance Breakdown
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-4 font-semibold text-left text-slate-500">
                    Day
                  </th>

                  <th className="px-5 py-4 font-semibold text-right text-slate-500">
                    Arrivals
                  </th>

                  <th className="px-5 py-4 font-semibold text-right text-slate-500">
                    Quantity
                  </th>

                  <th className="px-5 py-4 font-semibold text-right text-slate-500">
                    Revenue
                  </th>

                  <th className="px-5 py-4 font-semibold text-right text-slate-500">
                    Avg / Farmer
                  </th>

                  <th className="px-5 py-4 font-semibold text-right text-slate-500">
                    Revenue Index
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {MOCK_WEEKLY_DATA.map((item) => {
                  const averagePerFarmer = Math.round(
                    item.revenue / item.arrivals,
                  )

                  const revenueIndex = Math.round(
                    (item.revenue / MAX_REVENUE) * 100,
                  )

                  return (
                    <tr
                      key={item.day}
                      className="transition-colors hover:bg-green-50/40"
                    >
                      <td className="px-5 py-4 font-semibold text-slate-900">
                        {item.day}
                      </td>

                      <td className="px-5 py-4 text-right text-slate-600">
                        {item.arrivals}
                      </td>

                      <td className="px-5 py-4 text-right text-slate-600">
                        {item.quantity} q
                      </td>

                      <td className="px-5 py-4 font-semibold text-right text-slate-900">
                        {formatIndianCurrency(item.revenue)}
                      </td>

                      <td className="px-5 py-4 text-right text-slate-600">
                        {formatIndianCurrency(averagePerFarmer)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-3">
                          <div className="w-20 h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{
                                width: `${revenueIndex}%`,
                              }}
                            />
                          </div>

                          <span className="text-xs font-semibold text-slate-500">
                            {revenueIndex}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                })}

                <tr className="bg-slate-50">
                  <td className="px-5 py-4 font-bold text-slate-900">
                    Total
                  </td>

                  <td className="px-5 py-4 font-bold text-right text-slate-900">
                    {totalWeekArrivals}
                  </td>

                  <td className="px-5 py-4 font-bold text-right text-slate-900">
                    {totalWeekQuantity} q
                  </td>

                  <td className="px-5 py-4 font-bold text-right text-slate-900">
                    {formatIndianCurrency(totalWeekRevenue)}
                  </td>

                  <td className="px-5 py-4 font-bold text-right text-slate-900">
                    {formatIndianCurrency(avgRevenuePerFarmer)}
                  </td>

                  <td className="px-5 py-4 text-xs font-semibold text-right text-green-700">
                    100%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Operational note */}
        <div className="p-5 mt-6 border border-green-100 rounded-2xl bg-green-50/70">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-white rounded-xl">
              📈
            </div>

            <div>
              <p className="text-sm font-bold text-green-900">
                Mandi Performance Analytics
              </p>

              <p className="mt-1 text-xs leading-5 text-green-800">
                These visualizations provide an operational overview of
                arrivals, procurement quantity, revenue, queue efficiency,
                crop composition and slot utilization.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ReportsPage