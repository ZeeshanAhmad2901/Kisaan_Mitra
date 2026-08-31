import { formatIndianCurrency } from '../../utils/formatters'

const MOCK_WEEKLY_DATA = [
  { day: 'Mon', arrivals: 8, revenue: 185000 },
  { day: 'Tue', arrivals: 12, revenue: 310000 },
  { day: 'Wed', arrivals: 10, revenue: 245000 },
  { day: 'Thu', arrivals: 15, revenue: 420000 },
  { day: 'Fri', arrivals: 11, revenue: 290000 },
  { day: 'Sat', arrivals: 18, revenue: 510000 },
  { day: 'Sun', arrivals: 5, revenue: 120000 },
]

const MOCK_CROP_STATS = [
  { crop: 'Wheat', totalQty: 250, revenue: 581250, percentage: 35 },
  { crop: 'Rice', totalQty: 180, revenue: 585000, percentage: 28 },
  { crop: 'Potato', totalQty: 300, revenue: 300000, percentage: 18 },
  { crop: 'Mustard', totalQty: 90, revenue: 450000, percentage: 12 },
  { crop: 'Onion', totalQty: 60, revenue: 72000, percentage: 7 },
]

const MAX_REVENUE = Math.max(...MOCK_WEEKLY_DATA.map((d) => d.revenue))

function ReportsPage() {
  const totalWeekRevenue = MOCK_WEEKLY_DATA.reduce((sum, d) => sum + d.revenue, 0)
  const totalWeekArrivals = MOCK_WEEKLY_DATA.reduce((sum, d) => sum + d.arrivals, 0)

  return (
    <div className="px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="mt-1 text-gray-500">Weekly performance overview</p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-3">
          <div className="p-5 bg-white border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-500">Weekly Revenue</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{formatIndianCurrency(totalWeekRevenue)}</p>
          </div>
          <div className="p-5 bg-white border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-500">Weekly Arrivals</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{totalWeekArrivals}</p>
          </div>
          <div className="p-5 bg-white border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-500">Avg. Per Day</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{formatIndianCurrency(Math.round(totalWeekRevenue / 7))}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-8 lg:grid-cols-2">
          {/* Weekly Bar Chart */}
          <div className="p-5 bg-white border border-gray-200 rounded-lg">
            <h2 className="mb-6 font-bold text-gray-900">Weekly Revenue</h2>
            <div className="flex items-end h-48 gap-3">
              {MOCK_WEEKLY_DATA.map((d) => (
                <div key={d.day} className="flex flex-col items-center flex-1 gap-1">
                  <span className="text-xs text-gray-500">{formatIndianCurrency(d.revenue / 1000)}k</span>
                  <div
                    className="w-full transition-all bg-green-500 rounded-t-md hover:bg-green-600"
                    style={{ height: `${(d.revenue / MAX_REVENUE) * 100}%` }}
                  />
                  <span className="text-xs font-medium text-gray-600">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Crop Breakdown */}
          <div className="p-5 bg-white border border-gray-200 rounded-lg">
            <h2 className="mb-6 font-bold text-gray-900">Crop Breakdown</h2>
            <div className="space-y-4">
              {MOCK_CROP_STATS.map((c) => (
                <div key={c.crop}>
                  <div className="flex items-center justify-between mb-1 text-sm">
                    <span className="font-medium text-gray-900">🌾 {c.crop}</span>
                    <span className="text-gray-500">{c.totalQty} quintal • {formatIndianCurrency(c.revenue)}</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full">
                    <div
                      className="h-3 transition-all bg-green-500 rounded-full"
                      style={{ width: `${c.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{c.percentage}% of total</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Daily Breakdown Table */}
        <div className="mt-8 overflow-hidden bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-bold text-gray-900">Daily Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-left text-gray-700">Day</th>
                  <th className="px-4 py-3 font-medium text-right text-gray-700">Arrivals</th>
                  <th className="px-4 py-3 font-medium text-right text-gray-700">Revenue</th>
                  <th className="px-4 py-3 font-medium text-right text-gray-700">Avg per Farmer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MOCK_WEEKLY_DATA.map((d) => (
                  <tr key={d.day} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{d.day}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{d.arrivals}</td>
                    <td className="px-4 py-3 font-medium text-right text-gray-900">{formatIndianCurrency(d.revenue)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{formatIndianCurrency(Math.round(d.revenue / d.arrivals))}</td>
                  </tr>
                ))}
                <tr className="font-bold bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">Total</td>
                  <td className="px-4 py-3 text-right text-gray-900">{totalWeekArrivals}</td>
                  <td className="px-4 py-3 text-right text-gray-900">{formatIndianCurrency(totalWeekRevenue)}</td>
                  <td className="px-4 py-3 text-right text-gray-900">{formatIndianCurrency(Math.round(totalWeekRevenue / totalWeekArrivals))}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportsPage