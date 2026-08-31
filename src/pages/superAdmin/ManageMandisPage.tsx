import { useState } from 'react'

const MOCK_MANDIS = [
  { id: '1', name: 'Azadpur Mandi', location: 'Delhi', state: 'Delhi', district: 'North Delhi', owner: 'R.K. Gupta', status: 'active', totalSlots: 40, todayBookings: 18 },
  { id: '2', name: 'Krishna Mandi', location: 'Lucknow', state: 'Uttar Pradesh', district: 'Lucknow', owner: 'A.K. Verma', status: 'active', totalSlots: 30, todayBookings: 12 },
  { id: '3', name: 'Jawaharlal Nehru Mandi', location: 'Jaipur', state: 'Rajasthan', district: 'Jaipur', owner: 'S.S. Sharma', status: 'active', totalSlots: 25, todayBookings: 20 },
  { id: '4', name: 'Tiwari Mandi', location: 'Bhopal', state: 'Madhya Pradesh', district: 'Bhopal', owner: 'P.K. Tiwari', status: 'inactive', totalSlots: 20, todayBookings: 0 },
  { id: '5', name: 'Singh Mandi', location: 'Chandigarh', state: 'Punjab', district: 'Chandigarh', owner: 'G.S. Singh', status: 'active', totalSlots: 35, todayBookings: 22 },
]

function ManageMandisPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')

  const filtered = MOCK_MANDIS
    .filter((m) => filter === 'all' || m.status === filter)
    .filter((m) => m.name.toLowerCase().includes(search.toLowerCase()) || m.state.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Mandis</h1>
            <p className="mt-1 text-gray-500">{MOCK_MANDIS.length} mandis registered</p>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-white transition-colors bg-green-700 rounded-lg hover:bg-green-800">
            + Add Mandi
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col gap-3 mt-6 sm:flex-row">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or state..."
            className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <div className="flex gap-2">
            {(['all', 'active', 'inactive'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${filter === f ? 'bg-green-700 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Mandis Table */}
        <div className="mt-4 overflow-hidden bg-white border border-gray-200 rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-left text-gray-700">Mandi Name</th>
                  <th className="px-4 py-3 font-medium text-left text-gray-700">Location</th>
                  <th className="px-4 py-3 font-medium text-left text-gray-700">Owner</th>
                  <th className="px-4 py-3 font-medium text-right text-gray-700">Slots</th>
                  <th className="px-4 py-3 font-medium text-right text-gray-700">Today</th>
                  <th className="px-4 py-3 font-medium text-left text-gray-700">Status</th>
                  <th className="px-4 py-3 font-medium text-right text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">🏪 {m.name}</p>
                      <p className="text-xs text-gray-500">{m.district}, {m.state}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{m.location}</td>
                    <td className="px-4 py-3 text-gray-600">{m.owner}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{m.totalSlots}</td>
                    <td className="px-4 py-3 font-medium text-right text-gray-900">{m.todayBookings}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${m.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="mr-2 text-xs font-medium text-blue-600 hover:text-blue-800">Edit</button>
                      <button className="text-xs font-medium text-red-500 hover:text-red-700">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-gray-500">No mandis found.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ManageMandisPage