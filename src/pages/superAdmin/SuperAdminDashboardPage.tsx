import { formatIndianCurrency } from '../../utils/formatters'

const MOCK_STATS = {
  totalMandis: 156,
  totalFarmers: 24500,
  totalMandiOwners: 312,
  totalTransactions: 8940,
  totalRevenue: 124500000,
  activeToday: 45,
}

const MOCK_STATE_STATS = [
  { state: 'Uttar Pradesh', mandis: 32, farmers: 5200, revenue: 25000000 },
  { state: 'Rajasthan', mandis: 28, farmers: 4100, revenue: 19000000 },
  { state: 'Madhya Pradesh', mandis: 24, farmers: 3800, revenue: 17000000 },
  { state: 'Punjab', mandis: 22, farmers: 3200, revenue: 15000000 },
  { state: 'Haryana', mandis: 18, farmers: 2800, revenue: 12000000 },
  { state: 'Maharashtra', mandis: 15, farmers: 2400, revenue: 10000000 },
]

const MAX_STATE_REVENUE = Math.max(...MOCK_STATE_STATS.map((s) => s.revenue))

function SuperAdminDashboardPage() {
  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
            <p className="mt-1 text-gray-500">Platform-wide overview</p>
          </div>
          <div className="px-4 py-2 border border-green-200 rounded-lg bg-green-50">
            <p className="text-xs text-green-600">Active Now</p>
            <p className="text-2xl font-bold text-green-800">{MOCK_STATS.activeToday}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mt-8 md:grid-cols-3 lg:grid-cols-6">
          {[
            { label: 'Total Mandis', value: String(MOCK_STATS.totalMandis), icon: '🏪' },
            { label: 'Total Farmers', value: MOCK_STATS.totalFarmers.toLocaleString('en-IN'), icon: '🌾' },
            { label: 'Mandi Owners', value: String(MOCK_STATS.totalMandiOwners), icon: '👤' },
            { label: 'Transactions', value: MOCK_STATS.totalTransactions.toLocaleString('en-IN'), icon: '📋' },
            { label: 'Total Revenue', value: formatIndianCurrency(MOCK_STATS.totalRevenue), icon: '💰' },
            { label: 'States Covered', value: '18', icon: '🇮🇳' },
          ].map((stat) => (
            <div key={stat.label} className="p-4 bg-white border border-gray-200 rounded-lg">
              <span className="text-2xl">{stat.icon}</span>
              <p className="mt-2 text-xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* State-wise Bar Chart */}
        <div className="p-5 mt-8 bg-white border border-gray-200 rounded-lg">
          <h2 className="mb-6 font-bold text-gray-900">State-wise Revenue</h2>
          <div className="flex items-end gap-4 h-52">
            {MOCK_STATE_STATS.map((s) => (
              <div key={s.state} className="flex flex-col items-center flex-1 gap-1">
                <span className="text-xs text-gray-500">{formatIndianCurrency(s.revenue / 100000)}L</span>
                <div
                  className="w-full transition-colors bg-blue-500 cursor-pointer rounded-t-md hover:bg-blue-600"
                  style={{ height: `${(s.revenue / MAX_STATE_REVENUE) * 100}%` }}
                  title={`${s.state}: ${MOCK_STATE_STATS.filter((x) => x.state === s.state)[0].mandis} mandis, ${s.farmers.toLocaleString('en-IN')} farmers`}
                />
                <span className="text-xs font-medium leading-tight text-center text-gray-600">{s.state.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* State Table */}
        <div className="mt-8 overflow-hidden bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-bold text-gray-900">State-wise Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-left text-gray-700">State</th>
                  <th className="px-4 py-3 font-medium text-right text-gray-700">Mandis</th>
                  <th className="px-4 py-3 font-medium text-right text-gray-700">Farmers</th>
                  <th className="px-4 py-3 font-medium text-right text-gray-700">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MOCK_STATE_STATS.map((s) => (
                  <tr key={s.state} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{s.state}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{s.mandis}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{s.farmers.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 font-medium text-right text-gray-900">{formatIndianCurrency(s.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminDashboardPage