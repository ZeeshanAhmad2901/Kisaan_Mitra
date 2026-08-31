import { useState } from 'react';
import { formatIndianCurrency } from '../../utils/formatters';

type PeriodType = 'week' | 'month' | 'year'

const MOCK_DATA: Record<PeriodType, { label: string; revenue: number; transactions: number; farmers: number; growth: number }> = {
  week: { label: 'This Week', revenue: 2080000, transactions: 79, farmers: 47, growth: 12 },
  month: { label: 'This Month', revenue: 8450000, transactions: 342, farmers: 189, growth: 8 },
  year: { label: 'This Year', revenue: 124500000, transactions: 8940, farmers: 24500, growth: 23 },
}

const MOCK_MONTHLY = [
  { month: 'Jan', revenue: 8500000 },
  { month: 'Feb', revenue: 9200000 },
  { month: 'Mar', revenue: 11000000 },
  { month: 'Apr', revenue: 12500000 },
  { month: 'May', revenue: 14000000 },
  { month: 'Jun', revenue: 13200000 },
  { month: 'Jul', revenue: 10500000 },
  { month: 'Aug', revenue: 12450000 },
]

const MOCK_CROPS = [
  { crop: 'Wheat', percentage: 35, trend: 'up' },
  { crop: 'Rice', percentage: 28, trend: 'up' },
  { crop: 'Potato', percentage: 18, trend: 'down' },
  { crop: 'Mustard', percentage: 12, trend: 'up' },
  { crop: 'Onion', percentage: 7, trend: 'down' },
]

const MAX_MONTHLY = Math.max(...MOCK_MONTHLY.map((m) => m.revenue))

function PlatformAnalyticsPage() {
  const [period, setPeriod] = useState<PeriodType>('month')
  const data = MOCK_DATA[period]

  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
        <p className="mt-1 text-gray-500">Comprehensive platform performance metrics</p>

        {/* Period Selector */}
        <div className="flex gap-2 mt-6">
          {(['week', 'month', 'year'] as PeriodType[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${period === p ? 'bg-green-700 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-4">
          <div className="p-5 bg-white border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-500">{data.label} Revenue</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{formatIndianCurrency(data.revenue)}</p>
            <p className="mt-1 text-xs text-green-600">↑ {data.growth}% vs last {period}</p>
          </div>
          <div className="p-5 bg-white border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-500">Transactions</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{data.transactions.toLocaleString('en-IN')}</p>
            <p className="mt-1 text-xs text-green-600">↑ {data.growth - 2}% vs last {period}</p>
          </div>
          <div className="p-5 bg-white border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-500">Active Farmers</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{data.farmers.toLocaleString('en-IN')}</p>
            <p className="mt-1 text-xs text-green-600">↑ {data.growth + 5}% vs last {period}</p>
          </div>
          <div className="p-5 bg-white border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-500">Avg Transaction</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{formatIndianCurrency(Math.round(data.revenue / data.transactions))}</p>
            <p className="mt-1 text-xs text-blue-600">→ Stable</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-8 lg:grid-cols-3">
          {/* Monthly Revenue Chart */}
          <div className="p-5 bg-white border border-gray-200 rounded-lg lg:col-span-2">
            <h2 className="mb-6 font-bold text-gray-900">Monthly Revenue Trend</h2>
            <div className="flex items-end gap-3 h-52">
              {MOCK_MONTHLY.map((m) => (
                <div key={m.month} className="flex flex-col items-center flex-1 gap-1">
                  <span className="text-xs text-gray-500">{formatIndianCurrency(m.revenue / 100000)}L</span>
                  <div
                    className="w-full transition-colors bg-blue-500 cursor-pointer rounded-t-md hover:bg-blue-600"
                    style={{ height: `${(m.revenue / MAX_MONTHLY) * 100}%` }}
                  />
                  <span className="text-xs font-medium text-gray-600">{m.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Crop Distribution */}
          <div className="p-5 bg-white border border-gray-200 rounded-lg">
            <h2 className="mb-6 font-bold text-gray-900">Crop Distribution</h2>
            <div className="space-y-4">
              {MOCK_CROPS.map((c) => (
                <div key={c.crop}>
                  <div className="flex items-center justify-between mb-1 text-sm">
                    <span className="font-medium text-gray-900">🌾 {c.crop}</span>
                    <span className="text-xs font-medium text-gray-500">{c.trend === 'up' ? '↑' : '↓'} {c.percentage}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full">
                    <div
                      className={`h-3 rounded-full transition-all ${c.trend === 'up' ? 'bg-green-500' : 'bg-red-400'}`}
                      style={{ width: `${c.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="pt-6 mt-6 space-y-3 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Peak Hour</span>
                <span className="font-medium text-gray-900">7:00 - 9:00 AM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Peak Day</span>
                <span className="font-medium text-gray-900">Thursday</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Avg Wait Time</span>
                <span className="font-medium text-gray-900">35 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlatformAnalyticsPage