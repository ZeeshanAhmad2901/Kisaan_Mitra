import { useState } from 'react'
import { formatDate, formatIndianCurrency } from '../../utils/formatters'

const MOCK_BOOKINGS = [
  { id: 'KM-2025-00847', farmerName: 'Rajesh Kumar', crop: 'Wheat', quantity: '10 quintal', date: '2025-09-01', time: '6:00 AM', vehicle: 'UP-32-AB-1234', status: 'confirmed', estimatedValue: 23250 },
  { id: 'KM-2025-00845', farmerName: 'Suresh Yadav', crop: 'Rice', quantity: '25 quintal', date: '2025-09-01', time: '6:45 AM', vehicle: 'UP-32-EF-9012', status: 'confirmed', estimatedValue: 81250 },
  { id: 'KM-2025-00832', farmerName: 'Amit Singh', crop: 'Potato', quantity: '50 quintal', date: '2025-08-28', time: '7:00 AM', vehicle: 'UP-32-GH-3456', status: 'completed', estimatedValue: 50000 },
  { id: 'KM-2025-00830', farmerName: 'Vikram Pal', crop: 'Mustard', quantity: '15 quintal', date: '2025-08-28', time: '7:30 AM', vehicle: 'UP-32-IJ-7890', status: 'completed', estimatedValue: 75000 },
  { id: 'KM-2025-00819', farmerName: 'Ramesh Kushwaha', crop: 'Onion', quantity: '20 quintal', date: '2025-08-25', time: '8:00 AM', vehicle: 'UP-32-KL-2345', status: 'cancelled', estimatedValue: 24000 },
  { id: 'KM-2025-00810', farmerName: 'Dinesh Verma', crop: 'Wheat', quantity: '30 quintal', date: '2025-08-24', time: '6:30 AM', vehicle: 'UP-32-MN-1234', status: 'completed', estimatedValue: 69750 },
]

const STATUS_BADGE: Record<string, string> = {
  confirmed: 'bg-green-50 text-green-700',
  completed: 'bg-blue-50 text-blue-700',
  cancelled: 'bg-red-50 text-red-700',
  pending: 'bg-yellow-50 text-yellow-700',
}

type FilterType = 'all' | 'confirmed' | 'completed' | 'cancelled'

function BookingsPage() {
  const [filter, setFilter] = useState<FilterType>('all')

  const filtered = filter === 'all' ? MOCK_BOOKINGS : MOCK_BOOKINGS.filter((b) => b.status === filter)

  const totalValue = MOCK_BOOKINGS.filter((b) => b.status === 'completed').reduce((sum, b) => sum + b.estimatedValue, 0)

  return (
    <div className="px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Bookings</h1>
            <p className="mt-1 text-gray-500">Manage all mandi slot bookings</p>
          </div>
          <div className="px-4 py-2 text-right border border-green-200 rounded-lg bg-green-50">
            <p className="text-xs text-green-600">Total Revenue</p>
            <p className="text-lg font-bold text-green-800">{formatIndianCurrency(totalValue)}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 pb-1 mt-6 border-b border-gray-200">
          {(['all', 'confirmed', 'completed', 'cancelled'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors capitalize ${filter === f ? 'bg-green-700 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
            >
              {f} {f !== 'all' && `(${MOCK_BOOKINGS.filter((b) => b.status === f).length})`}
            </button>
          ))}
        </div>

        {/* Bookings Table */}
        <div className="mt-4 overflow-hidden bg-white border border-gray-200 rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-left text-gray-700">Booking ID</th>
                  <th className="px-4 py-3 font-medium text-left text-gray-700">Farmer</th>
                  <th className="px-4 py-3 font-medium text-left text-gray-700">Crop</th>
                  <th className="px-4 py-3 font-medium text-left text-gray-700">Quantity</th>
                  <th className="px-4 py-3 font-medium text-left text-gray-700">Date</th>
                  <th className="px-4 py-3 font-medium text-left text-gray-700">Time</th>
                  <th className="px-4 py-3 font-medium text-right text-gray-700">Est. Value</th>
                  <th className="px-4 py-3 font-medium text-left text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{b.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{b.farmerName}</td>
                    <td className="px-4 py-3 text-gray-600">{b.crop}</td>
                    <td className="px-4 py-3 text-gray-600">{b.quantity}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(b.date)}</td>
                    <td className="px-4 py-3 text-gray-600">{b.time}</td>
                    <td className="px-4 py-3 font-medium text-right text-gray-900">{formatIndianCurrency(b.estimatedValue)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_BADGE[b.status]}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-gray-500">No bookings found for this filter.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingsPage