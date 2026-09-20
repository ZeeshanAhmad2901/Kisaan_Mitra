import { useEffect, useMemo, useState } from 'react'
import { getMandis, type BackendMandi } from '../../api/mandiApi'
import {
  deactivateOwner,
  getOwners,
  type OwnerUser,
} from '../../api/ownerManagementApi'

type FilterType = 'all' | 'active' | 'inactive'

function ManageOwnersPage() {
  const [owners, setOwners] = useState<OwnerUser[]>([])
  const [mandis, setMandis] = useState<BackendMandi[]>([])
  const [filter, setFilter] = useState<FilterType>('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionId, setActionId] = useState<number | null>(null)

  const loadOwners = async () => {
    try {
      setLoading(true)
      setError('')

      const [ownerData, mandiData] = await Promise.all([
        getOwners(),
        getMandis(),
      ])

      setOwners(ownerData)
      setMandis(mandiData)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load mandi owners',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadOwners()
  }, [])

  const mandiMap = useMemo(
    () =>
      new Map(
        mandis.map((mandi) => [mandi.id, mandi]),
      ),
    [mandis],
  )

  const filteredOwners = useMemo(() => {
    const query = search.trim().toLowerCase()

    return owners.filter((owner) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && owner.is_active) ||
        (filter === 'inactive' && !owner.is_active)

      if (!query) {
        return matchesFilter
      }

      const mandi = owner.mandi_id
        ? mandiMap.get(owner.mandi_id)
        : undefined

      const matchesSearch =
        owner.name.toLowerCase().includes(query) ||
        owner.phone.toLowerCase().includes(query) ||
        (owner.email ?? '').toLowerCase().includes(query) ||
        String(owner.id).includes(query) ||
        (mandi?.name ?? '').toLowerCase().includes(query) ||
        (mandi?.location ?? '').toLowerCase().includes(query)

      return matchesFilter && matchesSearch
    })
  }, [owners, search, filter, mandiMap])

  const activeCount = owners.filter(
    (owner) => owner.is_active,
  ).length

  const inactiveCount = owners.filter(
    (owner) => !owner.is_active,
  ).length

  const handleDeactivate = async (owner: OwnerUser) => {
    const confirmed = window.confirm(
      `Deactivate ${owner.name}? This will disable their account.`,
    )

    if (!confirmed) {
      return
    }

    try {
      setActionId(owner.id)
      setError('')

      await deactivateOwner(owner.id)

      setOwners((current) =>
        current.map((item) =>
          item.id === owner.id
            ? { ...item, is_active: false }
            : item,
        ),
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to deactivate owner',
      )
    } finally {
      setActionId(null)
    }
  }

  if (loading) {
    return (
      <div className="px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="p-10 text-center bg-white border border-gray-200 rounded-xl">
            <div className="w-10 h-10 mx-auto border-4 border-gray-200 rounded-full border-t-green-600 animate-spin" />

            <p className="mt-4 text-sm text-gray-500">
              Loading owner records...
            </p>
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
              Manage Mandi Owners
            </h1>

            <p className="mt-1 text-gray-500">
              Real mandi owner accounts from the platform database
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadOwners()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 mt-6 border border-red-200 rounded-xl bg-red-50">
            <p className="text-sm font-medium text-red-800">
              {error}
            </p>
          </div>
        )}

        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-3">
          <div className="p-5 bg-white border border-gray-200 rounded-xl">
            <p className="text-sm text-gray-500">
              Total Owners
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-900">
              {owners.length.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="p-5 border border-green-200 rounded-xl bg-green-50">
            <p className="text-sm text-green-700">
              Active Owners
            </p>

            <p className="mt-1 text-2xl font-bold text-green-900">
              {activeCount.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="p-5 border border-red-200 rounded-xl bg-red-50">
            <p className="text-sm text-red-700">
              Inactive Owners
            </p>

            <p className="mt-1 text-2xl font-bold text-red-900">
              {inactiveCount.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col gap-3 mt-8 sm:flex-row">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, phone, email or mandi..."
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

        {/* Owners Table */}
        <div className="mt-4 overflow-hidden bg-white border border-gray-200 rounded-xl">
          {filteredOwners.length === 0 ? (
            <div className="p-10 text-center">
              <div className="text-4xl">👤</div>

              <h3 className="mt-3 font-semibold text-gray-900">
                No owners found
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
                      Owner
                    </th>

                    <th className="px-5 py-3 font-medium text-left text-gray-700">
                      Mandi
                    </th>

                    <th className="px-5 py-3 font-medium text-left text-gray-700">
                      Contact
                    </th>

                    <th className="px-5 py-3 font-medium text-right text-gray-700">
                      Owner ID
                    </th>

                    <th className="px-5 py-3 font-medium text-left text-gray-700">
                      Status
                    </th>

                    <th className="px-5 py-3 font-medium text-right text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredOwners.map((owner) => {
                    const mandi = owner.mandi_id
                      ? mandiMap.get(owner.mandi_id)
                      : undefined

                    return (
                      <tr
                        key={owner.id}
                        className="transition-colors hover:bg-gray-50"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-900">
                            {owner.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            {owner.email || 'No email'}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          {mandi ? (
                            <>
                              <p className="font-medium text-gray-900">
                                🏪 {mandi.name}
                              </p>

                              <p className="text-xs text-gray-500">
                                {mandi.location}
                              </p>
                            </>
                          ) : (
                            <span className="text-gray-400">
                              No mandi assigned
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-gray-700">
                            {owner.phone}
                          </p>
                        </td>

                        <td className="px-5 py-4 font-medium text-right text-gray-700">
                          {owner.id}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                              owner.is_active
                                ? 'bg-green-50 text-green-700'
                                : 'bg-red-50 text-red-700'
                            }`}
                          >
                            {owner.is_active
                              ? 'Active'
                              : 'Inactive'}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          {owner.is_active ? (
                            <button
                              type="button"
                              disabled={actionId === owner.id}
                              onClick={() =>
                                void handleDeactivate(owner)
                              }
                              className="text-xs font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                            >
                              {actionId === owner.id
                                ? 'Processing...'
                                : 'Deactivate'}
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400">
                              Deactivated
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="px-5 py-3 text-xs text-gray-500 border-t border-gray-100 bg-gray-50">
            Showing{' '}
            {filteredOwners.length.toLocaleString('en-IN')} of{' '}
            {owners.length.toLocaleString('en-IN')} owners
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageOwnersPage