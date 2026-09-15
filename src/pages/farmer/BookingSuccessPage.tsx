import { QRCodeSVG } from 'qrcode.react'
import { Link } from 'react-router'

function BookingSuccessPage() {
  return (
    <div className="px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="flex items-center justify-center w-20 h-20 mx-auto bg-green-100 rounded-full">
          <span className="text-4xl">✅</span>
        </div>
        <h1 className="mt-6 text-2xl font-bold text-gray-900">Booking Confirmed!</h1>
        <p className="mt-2 text-gray-500">Your mandi slot has been booked successfully.</p>

        <div className="p-6 mt-8 text-left bg-white border border-gray-200 rounded-lg">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Booking ID</span>
              <span className="font-medium text-gray-900">KM-2025-00847</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Mandi</span>
              <span className="font-medium text-gray-900">Azadpur Mandi</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date</span>
              <span className="font-medium text-gray-900">01 Sep 2025</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Time</span>
              <span className="font-medium text-gray-900">6:00 AM - 8:00 AM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full text-xs">Confirmed</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
  <QRCodeSVG
    value="KM-2025-00847"
    size={180}
    level="H"
  />
</div>

        <div className="flex justify-center gap-3 mt-6">
          <Link
            to="/farmer/bookings"
            className="bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            View My Bookings
          </Link>
          <Link
            to="/farmer/dashboard"
            className="border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BookingSuccessPage