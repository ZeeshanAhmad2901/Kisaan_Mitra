import { useEffect, useMemo, useState } from 'react'
import {
  getMandiRevenue,
  getPlatformSummary,
  type MandiRevenue,
  type PlatformSummary,
} from '../../api/analyticsApi'
import { formatIndianCurrency } from '../../utils/formatters'

function SuperAdminDashboardPage() {
  const [summary, setSummary] = useState<PlatformSummary | null>(null)
  const [mandiRevenue, setMandiRevenue] = useState<MandiRevenue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDashboard = async () => {
    try {
      setLoading(true)
      setError('')

      const [summaryData, mandiData] = await Promise.all([
        getPlatformSummary(),
        getMandiRevenue(),
      ])

      setSummary(summaryData)
      setMandiRevenue(mandiData)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load platform dashboard',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadDashboard()
  }, [])

  const maxMandiRevenue = useMemo(
    () =>
      Math.max(
        ...mandiRevenue.map((mandi) => mandi.revenue),
        1,
      ),
    [mandiRevenue],
  )

  const topMandis = useMemo(
    () => mandiRevenue.slice(0, 8),
    [mandiRevenue],
  )

  if (loading) {
    return (
      <div className="px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="p-8 text-center bg-white border border-gray-200 rounded-xl">
            <div className="w-10 h-10 mx-auto border-4 border-gray-200 rounded-full border-t-green-600 animate-spin" />
            <p className="mt-4 text-sm text-gray-500">
              Loading platform data...
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
              Unable to load dashboard
            </h2>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() => void loadDashboard()}
              className="px-4 py-2 mt-4 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!summary) {
    return null
  }

  const stats = [
    {
      label: 'Total Mandis',
      value: summary.totalMandis.toLocaleString('en-IN'),
      icon: '🏪',
    },
    {
      label: 'Total Farmers',
      value: summary.totalFarmers.toLocaleString('en-IN'),
      icon: '🌾',
    },
    {
      label: 'Mandi Owners',
      value: summary.totalMandiOwners.toLocaleString('en-IN'),
      icon: '👤',
    },
    {
      label: 'Transactions',
      value: summary.totalTransactions.toLocaleString('en-IN'),
      icon: '📋',
    },
    {
      label: 'Total Revenue',
      value: formatIndianCurrency(summary.totalRevenue),
      icon: '💰',
    },
    {
      label: 'Activity - 24h',
      value: summary.activeToday.toLocaleString('en-IN'),
      icon: '⚡',
    },
  ]

  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Super Admin Dashboard
            </h1>

            <p className="mt-1 text-gray-500">
              Real-time platform-wide overview
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 border border-green-200 rounded-lg bg-green-50">
              <p className="text-xs text-green-600">
                Activity · 24h
              </p>

              <p className="text-xl font-bold text-green-800">
                {summary.activeToday.toLocaleString('en-IN')}
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadDashboard()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mt-8 md:grid-cols-3 lg:grid-cols-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="p-4 bg-white border border-gray-200 rounded-xl"
            >
              <span className="text-2xl">
                {stat.icon}
              </span>

              <p className="mt-3 text-xl font-bold text-gray-900">
                {stat.value}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Revenue overview */}
        <div className="grid grid-cols-1 gap-6 mt-8 lg:grid-cols-3">
          <div className="p-6 bg-white border border-gray-200 rounded-xl lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold text-gray-900">
                  Mandi-wise Revenue
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Based on recorded procurement amounts
                </p>
              </div>

              <span className="px-3 py-1 text-xs font-medium text-green-700 rounded-full bg-green-50">
                Live data
              </span>
            </div>

            {topMandis.length === 0 ? (
              <div className="py-12 text-sm text-center text-gray-500">
                No procurement revenue recorded yet.
              </div>
            ) : (
              <div className="space-y-5">
                {topMandis.map((mandi) => (
                  <div key={mandi.mandi_id}>
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {mandi.mandi_name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {mandi.farmers.toLocaleString('en-IN')} farmers ·{' '}
                          {mandi.transactions.toLocaleString('en-IN')}{' '}
                          transactions
                        </p>
                      </div>

                      <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                        {formatIndianCurrency(mandi.revenue)}
                      </span>
                    </div>

                    <div className="w-full h-3 overflow-hidden bg-gray-100 rounded-full">
                      <div
                        className="h-full transition-all bg-green-500 rounded-full"
                        style={{
                          width: `${Math.max(
                            3,
                            (mandi.revenue / maxMandiRevenue) * 100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Platform health */}
          <div className="p-6 bg-white border border-gray-200 rounded-xl">
            <h2 className="font-bold text-gray-900">
              Platform Snapshot
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Current persisted records
            </p>

            <div className="mt-6 space-y-4">
              <div className="p-4 rounded-lg bg-gray-50">
                <p className="text-xs text-gray-500">
                  Revenue
                </p>

                <p className="mt-1 text-lg font-bold text-gray-900">
                  {formatIndianCurrency(summary.totalRevenue)}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-gray-50">
                <p className="text-xs text-gray-500">
                  Completed Transactions
                </p>

                <p className="mt-1 text-lg font-bold text-gray-900">
                  {summary.totalTransactions.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-gray-50">
                <p className="text-xs text-gray-500">
                  Active Mandis
                </p>

                <p className="mt-1 text-lg font-bold text-gray-900">
                  {summary.totalMandis.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="p-4 border border-green-100 rounded-lg bg-green-50">
                <p className="text-xs text-green-700">
                  Recent Activity
                </p>

                <p className="mt-1 text-lg font-bold text-green-900">
                  {summary.activeToday.toLocaleString('en-IN')}
                </p>

                <p className="mt-1 text-xs text-green-700">
                  bookings created during the last 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mandi table */}
        <div className="mt-8 overflow-hidden bg-white border border-gray-200 rounded-xl">
          <div className="flex flex-col gap-2 p-5 border-b border-gray-200 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-gray-900">
                Mandi Performance
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Live procurement and transaction records
              </p>
            </div>

            <span className="text-xs text-gray-500">
              {mandiRevenue.length.toLocaleString('en-IN')} active mandis
            </span>
          </div>

          {mandiRevenue.length === 0 ? (
            <div className="p-8 text-sm text-center text-gray-500">
              No mandi records available.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 font-medium text-left text-gray-700">
                      Mandi
                    </th>

                    <th className="px-5 py-3 font-medium text-right text-gray-700">
                      Farmers
                    </th>

                    <th className="px-5 py-3 font-medium text-right text-gray-700">
                      Transactions
                    </th>

                    <th className="px-5 py-3 font-medium text-right text-gray-700">
                      Revenue
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {mandiRevenue.map((mandi) => (
                    <tr
                      key={mandi.mandi_id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-5 py-4 font-medium text-gray-900">
                        {mandi.mandi_name}
                      </td>

                      <td className="px-5 py-4 text-right text-gray-600">
                        {mandi.farmers.toLocaleString('en-IN')}
                      </td>

                      <td className="px-5 py-4 text-right text-gray-600">
                        {mandi.transactions.toLocaleString('en-IN')}
                      </td>

                      <td className="px-5 py-4 font-semibold text-right text-gray-900">
                        {formatIndianCurrency(mandi.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SuperAdminDashboardPage