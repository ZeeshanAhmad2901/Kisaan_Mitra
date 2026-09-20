import { useEffect, useState } from 'react'
import {
  getAuditLogs,
  type AuditLog,
} from '../../api/auditLogApi'

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

const formatRole = (role: string | null) => {
  if (!role) return 'Unknown'

  return role
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase())
}

const formatDetails = (details: Record<string, unknown> | null) => {
  if (!details || Object.keys(details).length === 0) {
    return 'No additional details'
  }

  return JSON.stringify(details, null, 2)
}

function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [action, setAction] = useState('')
  const [actorRole, setActorRole] = useState('')
  const [entityType, setEntityType] = useState('')

  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)

  const loadLogs = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await getAuditLogs({
        page,
        page_size: 20,
        action,
        actor_role: actorRole,
        entity_type: entityType,
      })

      setLogs(response.items)
      setPages(response.pages)
      setTotal(response.total)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load audit logs.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadLogs()
  }, [page, action, actorRole, entityType])

  const clearFilters = () => {
    setAction('')
    setActorRole('')
    setEntityType('')
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto space-y-6 max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 mb-3 text-xs font-bold text-blue-700 border border-blue-200 rounded-full bg-blue-50">
                SYSTEM AUDIT
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Audit Logs
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Track important actions performed across the
                Kisaan Mitra platform.
              </p>
            </div>

            <div className="px-4 py-3 border border-gray-200 rounded-xl bg-gray-50">
              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Total Records
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {total}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <section className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="flex-1">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Action
              </label>

              <select
                value={action}
                onChange={(event) => {
                  setAction(event.target.value)
                  setPage(1)
                }}
                className="w-full px-4 py-3 text-sm bg-white border border-gray-300 outline-none rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">All actions</option>
                <option value="CREATE_ASSISTED_BOOKING">
                  Create Assisted Booking
                </option>
                <option value="VERIFY_BOOKING">
                  Verify Booking
                </option>
                <option value="START_BOOKING_PROCESSING">
                  Start Booking Processing
                </option>
                <option value="COMPLETE_BOOKING_PROCESSING">
                  Complete Booking Processing
                </option>
                <option value="CREATE_PROCUREMENT">
                  Create Procurement
                </option>
                <option value="UPDATE_PROCUREMENT">
                  Update Procurement
                </option>
                <option value="UPDATE_SYSTEM_SETTINGS">
                  Update System Settings
                </option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Actor Role
              </label>

              <select
                value={actorRole}
                onChange={(event) => {
                  setActorRole(event.target.value)
                  setPage(1)
                }}
                className="w-full px-4 py-3 text-sm bg-white border border-gray-300 outline-none rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">All roles</option>
                <option value="superAdmin">Super Admin</option>
                <option value="mandiOwner">Mandi Owner</option>
                <option value="mandiOperator">Mandi Operator</option>
                <option value="farmer">Farmer</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Entity Type
              </label>

              <select
                value={entityType}
                onChange={(event) => {
                  setEntityType(event.target.value)
                  setPage(1)
                }}
                className="w-full px-4 py-3 text-sm bg-white border border-gray-300 outline-none rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">All entities</option>
                <option value="booking">Booking</option>
                <option value="procurement">Procurement</option>
                <option value="system_setting">
                  System Setting
                </option>
              </select>
            </div>

            <button
              type="button"
              onClick={clearFilters}
              className="px-5 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="p-4 text-sm font-medium text-red-800 border border-red-200 rounded-xl bg-red-50">
            {error}
          </div>
        )}

        {/* Logs */}
        <section className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">
              Activity History
            </h2>
          </div>

          {loading ? (
            <div className="p-10 text-sm text-center text-gray-500">
              Loading audit logs...
            </div>
          ) : logs.length === 0 ? (
            <div className="p-10 text-sm text-center text-gray-500">
              No audit logs found for the selected filters.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-6 hover:bg-gray-50"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 text-xs font-bold text-blue-700 border border-blue-200 rounded-full bg-blue-50">
                          {log.action}
                        </span>

                        <span className="px-2.5 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full">
                          {log.entity_type}
                          {log.entity_id
                            ? ` #${log.entity_id}`
                            : ''}
                        </span>
                      </div>

                      <p className="mt-3 text-sm font-semibold text-gray-900">
                        {log.description}
                      </p>

                      <div className="flex flex-wrap mt-2 text-xs text-gray-500 gap-x-5 gap-y-1">
                        <span>
                          Actor:{' '}
                          <strong className="text-gray-700">
                            {log.actor_name ?? 'Unknown'}
                          </strong>
                        </span>

                        <span>
                          Role:{' '}
                          <strong className="text-gray-700">
                            {formatRole(log.actor_role)}
                          </strong>
                        </span>

                        <span>
                          {formatDateTime(log.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {log.details && (
                    <details className="mt-4">
                      <summary className="text-xs font-semibold text-blue-700 cursor-pointer">
                        View details
                      </summary>

                      <pre className="p-4 mt-3 overflow-x-auto text-xs leading-5 text-gray-700 border border-gray-200 bg-gray-50 rounded-xl">
                        {formatDetails(log.details)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && pages > 1 && (
            <div className="flex items-center justify-between gap-4 p-5 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Page {page} of {pages}
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() =>
                    setPage((current) => current - 1)
                  }
                  className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={page >= pages}
                  onClick={() =>
                    setPage((current) => current + 1)
                  }
                  className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default AuditLogsPage