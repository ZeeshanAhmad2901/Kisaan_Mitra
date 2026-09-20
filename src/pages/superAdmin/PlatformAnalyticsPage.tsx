import { useEffect, useMemo, useState } from 'react'
import {
  getCropDistribution,
  getMonthlyRevenue,
  getWeeklyRevenue,
  type CropDistribution,
  type MonthlyAnalytics,
  type WeeklyAnalytics,
} from '../../api/analyticsApi'
import { formatIndianCurrency } from '../../utils/formatters'

type PeriodType = 'week' | 'month' | 'year'

function PlatformAnalyticsPage() {
  const [period, setPeriod] = useState<PeriodType>('month')
  const [weeklyData, setWeeklyData] = useState<WeeklyAnalytics[]>([])
  const [monthlyData, setMonthlyData] = useState<MonthlyAnalytics[]>([])
  const [cropData, setCropData] = useState<CropDistribution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      setError('')

      const [weekly, monthly, crops] = await Promise.all([
        getWeeklyRevenue(),
        getMonthlyRevenue(),
        getCropDistribution(),
      ])

      setWeeklyData(weekly)
      setMonthlyData(monthly)
      setCropData(crops)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load platform analytics',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadAnalytics()
  }, [])

  const periodData = useMemo(() => {
    if (period === 'week') {
      return {
        label: 'This Week',
        revenue: weeklyData.reduce((sum, item) => sum + item.revenue, 0),
        transactions: weeklyData.reduce(
          (sum, item) => sum + item.transactions,
          0,
        ),
        farmers: new Set(
          weeklyData
            .filter((item) => item.farmers > 0)
            .map((item) => item.date),
        ).size,
      }
    }

    if (period === 'month') {
      const latest = monthlyData[monthlyData.length - 1]

      return {
        label: latest
          ? `${latest.month} ${latest.year}`
          : 'This Month',
        revenue: latest?.revenue ?? 0,
        transactions: latest?.transactions ?? 0,
        farmers: latest?.farmers ?? 0,
      }
    }

    return {
      label: 'This Year',
      revenue: monthlyData.reduce((sum, item) => sum + item.revenue, 0),
      transactions: monthlyData.reduce(
        (sum, item) => sum + item.transactions,
        0,
      ),
      farmers: monthlyData.reduce(
        (sum, item) => sum + item.farmers,
        0,
      ),
    }
  }, [period, weeklyData, monthlyData])

  const averageTransaction =
    periodData.transactions > 0
      ? periodData.revenue / periodData.transactions
      : 0

  const maxMonthlyRevenue = useMemo(
    () =>
      Math.max(
        ...monthlyData.map((item) => item.revenue),
        1,
      ),
    [monthlyData],
  )

  const topCrops = useMemo(
    () => cropData.slice(0, 6),
    [cropData],
  )

  if (loading) {
    return (
      <div className="px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="p-10 text-center bg-white border border-gray-200 rounded-xl">
            <div className="w-10 h-10 mx-auto border-4 border-gray-200 rounded-full border-t-green-600 animate-spin" />
            <p className="mt-4 text-sm text-gray-500">
              Loading real platform analytics...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="p-6 border border-red-200 rounded-xl bg-red-50">
            <h2 className="font-semibold text-red-800">
              Unable to load analytics
            </h2>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() => void loadAnalytics()}
              className="px-4 py-2 mt-4 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Platform Analytics
            </h1>

            <p className="mt-1 text-gray-500">
              Real procurement and transaction analytics
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadAnalytics()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2 mt-6">
          {(['week', 'month', 'year'] as PeriodType[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPeriod(item)}
              className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition-colors ${
                period === item
                  ? 'bg-green-700 text-white'
                  : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-4">
          <div className="p-5 bg-white border border-gray-200 rounded-xl">
            <p className="text-sm text-gray-500">
              {periodData.label} Revenue
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-900">
              {formatIndianCurrency(periodData.revenue)}
            </p>

            <p className="mt-2 text-xs text-gray-500">
              From recorded procurement
            </p>
          </div>

          <div className="p-5 bg-white border border-gray-200 rounded-xl">
            <p className="text-sm text-gray-500">
              Transactions
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-900">
              {periodData.transactions.toLocaleString('en-IN')}
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Recorded procurement transactions
            </p>
          </div>

          <div className="p-5 bg-white border border-gray-200 rounded-xl">
            <p className="text-sm text-gray-500">
              Farmers
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-900">
              {periodData.farmers.toLocaleString('en-IN')}
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Farmers represented in analytics data
            </p>
          </div>

          <div className="p-5 bg-white border border-gray-200 rounded-xl">
            <p className="text-sm text-gray-500">
              Avg Transaction
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-900">
              {formatIndianCurrency(averageTransaction)}
            </p>

            <p className="mt-2 text-xs text-blue-600">
              Calculated from real records
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-8 lg:grid-cols-3">
          {/* Monthly Revenue */}
          <div className="p-5 bg-white border border-gray-200 rounded-xl lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold text-gray-900">
                  Monthly Revenue Trend
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Real procurement revenue recorded this year
                </p>
              </div>

              <span className="px-3 py-1 text-xs font-medium text-green-700 rounded-full bg-green-50">
                Live data
              </span>
            </div>

            {monthlyData.length === 0 ? (
              <div className="py-16 text-sm text-center text-gray-500">
                No monthly procurement data available.
              </div>
            ) : (
              <div className="flex items-end gap-3 h-60">
                {monthlyData.map((item) => (
                  <div
                    key={`${item.year}-${item.month}`}
                    className="flex flex-col items-center flex-1 h-full gap-2"
                  >
                    <span className="text-xs text-gray-500">
                      {formatIndianCurrency(item.revenue)}
                    </span>

                    <div className="flex items-end flex-1 w-full">
                      <div
                        className="w-full transition-all bg-blue-500 rounded-t-md hover:bg-blue-600"
                        style={{
                          height: `${Math.max(
                            4,
                            (item.revenue / maxMonthlyRevenue) * 100,
                          )}%`,
                        }}
                        title={`${item.month} ${item.year}: ${formatIndianCurrency(item.revenue)}`}
                      />
                    </div>

                    <span className="text-xs font-medium text-gray-600">
                      {item.month}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Crop Distribution */}
          <div className="p-5 bg-white border border-gray-200 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold text-gray-900">
                  Crop Distribution
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Based on procurement transactions
                </p>
              </div>

              <span className="text-xs text-gray-400">
                {cropData.length} crops
              </span>
            </div>

            {topCrops.length === 0 ? (
              <div className="py-12 text-sm text-center text-gray-500">
                No crop procurement data available.
              </div>
            ) : (
              <div className="space-y-5">
                {topCrops.map((crop) => (
                  <div key={crop.crop}>
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        🌾 {crop.crop}
                      </span>

                      <span className="text-xs font-semibold text-gray-600">
                        {crop.percentage.toFixed(1)}%
                      </span>
                    </div>

                    <div className="w-full h-3 overflow-hidden bg-gray-100 rounded-full">
                      <div
                        className="h-full transition-all bg-green-500 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, crop.percentage),
                          )}%`,
                        }}
                      />
                    </div>

                    <p className="mt-1 text-xs text-gray-400">
                      {crop.transactions.toLocaleString('en-IN')}{' '}
                      transactions ·{' '}
                      {formatIndianCurrency(crop.revenue)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Weekly Analytics */}
        <div className="mt-8 overflow-hidden bg-white border border-gray-200 rounded-xl">
          <div className="p-5 border-b border-gray-200">
            <h2 className="font-bold text-gray-900">
              Last 7 Days
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Daily procurement activity from real records
            </p>
          </div>

          {weeklyData.length === 0 ? (
            <div className="p-8 text-sm text-center text-gray-500">
              No weekly analytics available.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 font-medium text-left text-gray-700">
                      Day
                    </th>

                    <th className="px-5 py-3 font-medium text-left text-gray-700">
                      Date
                    </th>

                    <th className="px-5 py-3 font-medium text-right text-gray-700">
                      Revenue
                    </th>

                    <th className="px-5 py-3 font-medium text-right text-gray-700">
                      Transactions
                    </th>

                    <th className="px-5 py-3 font-medium text-right text-gray-700">
                      Farmers
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {weeklyData.map((item) => (
                    <tr
                      key={item.date}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-5 py-4 font-medium text-gray-900">
                        {item.day}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {item.date}
                      </td>

                      <td className="px-5 py-4 font-semibold text-right text-gray-900">
                        {formatIndianCurrency(item.revenue)}
                      </td>

                      <td className="px-5 py-4 text-right text-gray-600">
                        {item.transactions.toLocaleString('en-IN')}
                      </td>

                      <td className="px-5 py-4 text-right text-gray-600">
                        {item.farmers.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Data Note */}
        <div className="p-4 mt-6 border border-blue-100 rounded-xl bg-blue-50">
          <p className="text-sm font-medium text-blue-900">
            Analytics source
          </p>

          <p className="mt-1 text-xs leading-5 text-blue-700">
            All figures on this page are calculated from persisted
            procurement records through the FastAPI analytics endpoints.
            No mock or hardcoded business metrics are used.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PlatformAnalyticsPage