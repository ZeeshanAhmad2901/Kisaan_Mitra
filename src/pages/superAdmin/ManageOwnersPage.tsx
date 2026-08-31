import { useState } from 'react'

const MOCK_OWNERS = [
  { id: '1', name: 'R.K. Gupta', email: 'rk.gupta@example.com', phone: '9876543210', mandi: 'Azadpur Mandi', state: 'Delhi', status: 'approved', joinedOn: '2025-01-10' },
  { id: '2', name: 'A.K. Verma', email: 'ak.verma@example.com', phone: '9876543211', mandi: 'Krishna Mandi', state: 'Uttar Pradesh', status: 'approved', joinedOn: '2025-02-15' },
  { id: '3', name: 'S.S. Sharma', email: 'ss.sharma@example.com', phone: '9876543212', mandi: 'Jawaharlal Nehru Mandi', state: 'Rajasthan', status: 'approved', joinedOn: '2025-03-20' },
  { id: '4', name: 'P.K. Tiwari', email: 'pk.tiwari@example.com', phone: '9876543213', mandi: 'Tiwari Mandi', state: 'Madhya Pradesh', status: 'pending', joinedOn: '2025-08-25' },
  { id: '5', name: 'G.S. Singh', email: 'gs.singh@example.com', phone: '9876543214', mandi: 'Singh Mandi', state: 'Punjab', status: 'rejected', joinedOn: '2025-08-20' },
]

function ManageOwnersPage() {
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all')

  const filtered = filter === 'all' ? MOCK_OWNERS : MOCK_OWNERS.filter((o) => o.status === filter)

  const STATUS_BADGE: Record<string, string> = {
    approved: 'bg-green-50 text-green-700',
    pending: 'bg-yellow-50 text-yellow-700',
    rejected: 'bg-red-50 text-red-700',
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900">Manage Mandi Owners</h1>
        <p className="mt-1 text-gray-500">{MOCK_OWNERS.length} owners registered</p>

        {/* Filter Tabs */}
        <div className="flex gap-2 pb-1 mt-6 border-b border-gray-200">
          {(['all', 'approved', 'pending', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors capitalize ${filter === f ? 'bg-green-700 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
            >
              {f} {f !== 'all' && `(${MOCK_OWNERS.filter((o) => o.status === f).length})`}
            </button>
          ))}
        </div>

        {/* Owners Table */}
        <div className="mt-4 overflow-hidden bg-white border border-gray-200 rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-left text-gray-700">Name</th>
                  <th className="px-4 py-3 font-medium text-left text-gray-700">Mandi</th>
                  <th className="px-4 py-3 font-medium text-left text-gray-700">State</th>
                  <th className="px-4 py-3 font-medium text-left text-gray-700">Contact</th>
                  <th className="px-4 py-3 font-medium text-left text-gray-700">Joined</th>
                  <th className="px-4 py-3 font-medium text-left text-gray-700">Status</th>
                  <th className="px-4 py-3 font-medium text-right text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{o.name}</p>
                      <p className="text-xs text-gray-500">{o.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">🏪 {o.mandi}</td>
                    <td className="px-4 py-3 text-gray-600">{o.state}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{o.phone}</td>
                    <td className="px-4 py-3 text-gray-600">{o.joinedOn}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_BADGE[o.status]}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 space-x-1 text-right">
                      {o.status === 'pending' && (
                        <>
                          <button className="text-xs font-medium text-green-600 hover:text-green-800">Approve</button>
                          <button className="ml-1 text-xs font-medium text-red-500 hover:text-red-700">Reject</button>
                        </>
                      )}
                      <button className="ml-1 text-xs font-medium text-blue-600 hover:text-blue-800">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-gray-500">No owners found for this filter.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ManageOwnersPage