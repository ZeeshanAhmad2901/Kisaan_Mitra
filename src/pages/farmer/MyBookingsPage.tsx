import { Link } from 'react-router'
import { formatDate } from '../../utils/formatters'

const MOCK_BOOKINGS = [
  { id: 'KM-2025-00847', mandiName: 'Azadpur Mandi', date: '2025-09-01', time: '6:00 AM - 8:00 AM', crop: 'Wheat', quantity: '10 quintal', status: 'confirmed', vehicleNumber: 'UP-32-AB-1234' },
  { id: 'KM-2025-00832', mandiName: 'Krishna Mandi', date: '2025-08-28', time: '7:00 AM - 9:00 AM', crop: 'Rice', quantity: '25 quintal', status: 'completed', vehicleNumber: 'UP-32-CD-5678' },
  { id: 'KM-2025-00819', mandiName: 'Azadpur Mandi', date: '2025-08-25', time: '8:00 AM - 10:00 AM', crop: 'Potato', quantity: '50 quintal', status: 'cancelled', vehicleNumber: 'UP-32-AB-1234' },
]

const STATUS_STYLES: Record<string, string> = {
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  completed: 'bg-blue-50 text-blue-700 border-blue-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
}

function MyBookingsPage() {
  return (
    <div className="px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
            <p className="mt-1 text-gray-500">View and manage your mandi bookings</p>
          </div>
          <Link
            to="/farmer/book-slot"
            className="px-4 py-2 text-sm font-medium text-white transition-colors bg-green-700 rounded-lg hover:bg-green-800"
          >
            + New Booking
          </Link>
        </div>

        {MOCK_BOOKINGS.length === 0 ? (
          <div className="py-12 mt-8 text-center border border-gray-200 rounded-lg bg-gray-50">
            <span className="text-4xl">📋</span>
            <p className="mt-3 text-gray-500">No bookings yet</p>
            <Link to="/farmer/book-slot" className="inline-block mt-1 text-sm text-green-700 hover:underline">
              Book your first slot
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {MOCK_BOOKINGS.map((booking) => (
              <div key={booking.id} className="p-5 transition-shadow bg-white border border-gray-200 rounded-lg hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">🏪 {booking.mandiName}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border capitalize ${STATUS_STYLES[booking.status]}`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Booking ID: {booking.id}</p>
                  </div>
                  <p className="text-sm text-gray-500">🚛 {booking.vehicleNumber}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-3 mt-3 text-sm border-t border-gray-100 md:grid-cols-4">
                  <div>
                    <p className="text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">{formatDate(booking.date)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Time</p>
                    <p className="font-medium text-gray-900">{booking.time}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Crop</p>
                    <p className="font-medium text-gray-900">{booking.crop}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Quantity</p>
                    <p className="font-medium text-gray-900">{booking.quantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyBookingsPage