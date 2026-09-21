import { QRCodeSVG } from 'qrcode.react'
import { Link, useLocation } from 'react-router'

import type { BackendMandi } from '../../api/mandiApi'
import type { BackendSlot } from '../../api/slotApi'
import type { BackendVehicle } from '../../api/vehicleApi'

interface BookingResponse {
  id: number
  booking_code: string
  farmer_id: number
  mandi_id: number
  slot_id: number
  vehicle_id: number
  crop_type: string
  quantity: number
  status: string
  created_at: string
}

interface BookingSuccessState {
  bookingId: string
  booking: BookingResponse
  mandi?: BackendMandi
  slot?: BackendSlot
  vehicle?: BackendVehicle
}

const formatDate = (date: string) => {
  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return date
  }

  return parsedDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number)

  if (
    !Number.isFinite(hours) ||
    !Number.isFinite(minutes)
  ) {
    return time
  }

  const date = new Date()
  date.setHours(hours, minutes, 0, 0)

  return date.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function BookingSuccessPage() {
  const location = useLocation()

  const state = location.state as BookingSuccessState | null
  const booking = state?.booking

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-2xl px-4 py-20 mx-auto text-center">
          <div className="p-8 bg-white border border-gray-200 shadow-sm rounded-3xl">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-5 text-2xl bg-orange-100 rounded-full">
              !
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Booking details unavailable
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              This booking confirmation page was opened without
              booking information. Please create a booking first.
            </p>

            <Link
              to="/farmer/book-slot"
              className="inline-flex items-center justify-center px-6 py-3 mt-6 text-sm font-bold text-white transition bg-green-700 rounded-xl hover:bg-green-800"
            >
              Book a Mandi Slot
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const mandi = state?.mandi
  const slot = state?.slot
  const vehicle = state?.vehicle

  const bookingId = state?.bookingId || booking.booking_code

  const qrValue = JSON.stringify({
    bookingId: booking.booking_code,
    bookingDatabaseId: booking.id,
    farmerId: booking.farmer_id,
    mandiId: booking.mandi_id,
    slotId: booking.slot_id,
    vehicleId: booking.vehicle_id,
    crop: booking.crop_type,
    quantity: booking.quantity,
    status: booking.status,
  })

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Government Header */}
      <div className="bg-green-800 border-b border-green-200">
        <div className="px-4 py-3 mx-auto max-w-7xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full">
              <span className="text-xl">🇮🇳</span>
            </div>

            <div>
              <p className="text-sm font-bold text-white">
                Government Digital Agriculture Service
              </p>

              <p className="text-xs text-green-100">
                Kisaan Mitra • Mandi Procurement Management
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl px-4 py-10 mx-auto">
        {/* Success Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-5 bg-green-100 rounded-full">
            <span className="text-4xl text-green-700">✓</span>
          </div>

          <p className="mb-2 text-sm font-bold tracking-wider text-green-700 uppercase">
            Booking Confirmed
          </p>

          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Your Mandi Visit Is Confirmed
          </h1>

          <p className="max-w-2xl mx-auto mt-3 text-sm leading-6 text-gray-500">
            Your digital booking pass has been generated successfully.
            Keep this QR code ready when you arrive at the mandi.
          </p>
        </div>

        {/* Main Receipt */}
        <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-3xl">
          {/* Receipt Header */}
          <div className="px-6 py-6 bg-gradient-to-r from-green-700 to-green-600 sm:px-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-medium text-green-100">
                  Digital Booking Pass
                </p>

                <h2 className="mt-1 text-2xl font-bold text-white">
                  {mandi?.name ?? `Mandi #${booking.mandi_id}`}
                </h2>

                {mandi?.location && (
                  <p className="mt-1 text-sm text-green-100">
                    {mandi.location}
                  </p>
                )}
              </div>

              <div className="px-4 py-2 bg-white rounded-xl">
                <p className="text-xs font-medium text-gray-500">
                  Booking ID
                </p>

                <p className="font-bold text-green-700">
                  {bookingId}
                </p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3 sm:p-8">
            <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50">
              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Visit Date
              </p>

              <p className="mt-2 font-bold text-gray-900">
                {slot
                  ? formatDate(slot.slot_date)
                  : 'Not available'}
              </p>
            </div>

            <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50">
              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Time Slot
              </p>

              <p className="mt-2 font-bold text-gray-900">
                {slot
                  ? `${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}`
                  : 'Not available'}
              </p>
            </div>

            <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50">
              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Crop
              </p>

              <p className="mt-2 font-bold text-gray-900">
                🌾 {booking.crop_type}
              </p>
            </div>

            <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50">
              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Quantity
              </p>

              <p className="mt-2 font-bold text-gray-900">
                {booking.quantity} quintal
              </p>
            </div>

            <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50">
              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Vehicle Number
              </p>

              <p className="mt-2 font-bold text-gray-900">
                {vehicle?.vehicle_number ??
                  `Vehicle #${booking.vehicle_id}`}
              </p>

              {vehicle?.vehicle_type && (
                <p className="mt-1 text-xs text-gray-500">
                  {vehicle.vehicle_type}
                </p>
              )}
            </div>

            <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50">
              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Status
              </p>

              <div className="mt-2">
                <span className="inline-flex px-3 py-1 text-xs font-bold text-green-700 capitalize bg-green-100 border border-green-200 rounded-full">
                  {booking.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* QR Section */}
          <div className="px-6 pb-8 sm:px-8">
            <div className="grid grid-cols-1 gap-6 p-6 border border-green-200 rounded-2xl bg-green-50 md:grid-cols-[auto_1fr] md:items-center">
              <div className="flex justify-center">
                <div className="p-4 bg-white border border-gray-200 rounded-2xl">
                  <QRCodeSVG
                    value={qrValue}
                    size={190}
                    level="H"
                    includeMargin
                  />
                </div>
              </div>

              <div>
                <p className="text-xs font-bold tracking-wider text-green-700 uppercase">
                  Scan at Mandi Entry
                </p>

                <h3 className="mt-2 text-xl font-bold text-gray-900">
                  Digital Entry QR
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Present this QR code at the mandi gate for booking
                  verification and queue entry.
                </p>

                <div className="p-3 mt-4 bg-white border border-green-100 rounded-xl">
                  <p className="text-xs text-gray-500">
                    Booking Reference
                  </p>

                  <p className="mt-1 font-bold text-green-700">
                    {booking.booking_code}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="px-6 pb-8 sm:px-8">
            <div className="p-5 border border-orange-200 rounded-2xl bg-orange-50">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-lg">ℹ️</span>

                <div>
                  <h3 className="font-bold text-orange-900">
                    Important Instructions
                  </h3>

                  <ul className="mt-2 space-y-1 text-sm leading-6 text-orange-800">
                    <li>
                      Arrive during your selected time slot.
                    </li>

                    <li>
                      Keep your booking QR code available at entry.
                    </li>

                    <li>
                      Carry the required farmer and vehicle documents.
                    </li>

                    <li>
                      Follow the mandi queue instructions after verification.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 mt-6 sm:flex-row sm:justify-center">
          <Link
            to="/farmer/bookings"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white transition bg-green-700 rounded-xl hover:bg-green-800"
          >
            View My Bookings
          </Link>

          <Link
            to="/farmer/dashboard"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-gray-700 transition bg-white border border-gray-300 rounded-xl hover:bg-gray-50"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BookingSuccessPage