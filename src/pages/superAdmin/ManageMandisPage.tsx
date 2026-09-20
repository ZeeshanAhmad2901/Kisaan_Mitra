import { useEffect, useMemo, useState } from 'react'
import { getMandis, type BackendMandi } from '../../api/mandiApi'

type FilterType = 'all' | 'active' | 'inactive'

function ManageMandisPage() {
  const [mandis, setMandis] = useState<BackendMandi[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadMandis = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getMandis()
      setMandis(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load mandis',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadMandis()
  }, [])

  const filteredMandis = useMemo(() => {
    const query = search.trim().toLowerCase()

    return mandis.filter((mandi) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && mandi.is_active) ||
        (filter === 'inactive' && !mandi.is_active)

      if (!query) {
        return matchesFilter
      }

      const matchesSearch =
        mandi.name.toLowerCase().includes(query) ||
        mandi.location.toLowerCase().includes(query) ||
        String(mandi.id).includes(query) ||
        String(mandi.owner_id).includes(query)

      return matchesFilter && matchesSearch
    })
  }, [mandis, search, filter])

  const activeCount = mandis.filter(
    (mandi) => mandi.is_active,
  ).length

  const inactiveCount = mandis.filter(
    (mandi) => !mandi.is_active,
  ).length

  if (loading) {
    return (
      <div className="px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="p-10 text-center bg-white border border-gray-200 rounded-xl">
            <div className="w-10 h-10 mx-auto border-4 border-gray-200 rounded-full border-t-green-600 animate-spin" />
            <p className="mt-4 text-sm text-gray-500">
              Loading mandi records...
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
              Unable to load mandis
            </h2>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() => void loadMandis()}
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
              Manage Mandis
            </h1>

            <p className="mt-1 text-gray-500">
              {mandis.length.toLocaleString('en-IN')} mandi records
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadMandis()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-3">
          <div className="p-5 bg-white border border-gray-200 rounded-xl">
            <p className="text-sm text-gray-500">
              Total Mandis
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-900">
              {mandis.length.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="p-5 border border-green-200 rounded-xl bg-green-50">
            <p className="text-sm text-green-700">
              Active Mandis
            </p>

            <p className="mt-1 text-2xl font-bold text-green-900">
              {activeCount.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="p-5 border border-red-200 rounded-xl bg-red-50">
            <p className="text-sm text-red-700">
              Inactive Mandis
            </p>

            <p className="mt-1 text-2xl font-bold text-red-900">
              {inactiveCount.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col gap-3 mt-8 sm:flex-row">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by mandi, location, ID or owner ID..."
            className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <div className="flex gap-2">
            {(['all', 'active', 'inactive'] as FilterType[]).map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition-colors ${
                    filter === item
                      ? 'bg-green-700 text-white'
                      : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-hidden bg-white border border-gray-200 rounded-xl">
          {filteredMandis.length === 0 ? (
            <div className="p-10 text-center">
              <div className="text-4xl">🏪</div>

              <h3 className="mt-3 font-semibold text-gray-900">
                No mandis found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Try changing your search or filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 font-medium text-left text-gray-700">
                      Mandi
                    </th>

                    <th className="px-5 py-3 font-medium text-left text-gray-700">
                      Location
                    </th>

                    <th className="px-5 py-3 font-medium text-right text-gray-700">
                      Mandi ID
                    </th>

                    <th className="px-5 py-3 font-medium text-right text-gray-700">
                      Owner ID
                    </th>

                    <th className="px-5 py-3 font-medium text-left text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredMandis.map((mandi) => (
                    <tr
                      key={mandi.id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 text-lg rounded-lg bg-green-50">
                            🏪
                          </div>

                          <div>
                            <p className="font-semibold text-gray-900">
                              {mandi.name}
                            </p>

                            <p className="text-xs text-gray-500">
                              Mandi #{mandi.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {mandi.location}
                      </td>

                      <td className="px-5 py-4 font-medium text-right text-gray-700">
                        {mandi.id}
                      </td>

                      <td className="px-5 py-4 font-medium text-right text-gray-700">
                        {mandi.owner_id}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                            mandi.is_active
                              ? 'bg-green-50 text-green-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {mandi.is_active
                            ? 'Active'
                            : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="px-5 py-3 text-xs text-gray-500 border-t border-gray-100 bg-gray-50">
            Showing{' '}
            {filteredMandis.length.toLocaleString('en-IN')} of{' '}
            {mandis.length.toLocaleString('en-IN')} mandis
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageMandisPage