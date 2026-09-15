import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'

type Booking = {
  id: string
  mandiName: string
  date: string
  time: string
  crop: string
  quantity: string
  status: string
  vehicleNumber: string
}

const FALLBACK_BOOKING: Booking = {
  id: 'KM-2025-00847',
  mandiName: 'Azadpur Mandi',
  date: '2025-09-01',
  time: '6:00 AM - 8:00 AM',
  crop: 'Wheat',
  quantity: '10 quintal',
  status: 'confirmed',
  vehicleNumber: 'UP-32-AB-1234',
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

function BookingSuccessPage() {
  const [booking, setBooking] = useState<Booking>(FALLBACK_BOOKING)

  useEffect(() => {
    try {
      const storedBookings = localStorage.getItem('kisaan_mitra_bookings')

      if (!storedBookings) return

      const parsedBookings = JSON.parse(storedBookings)

      if (!Array.isArray(parsedBookings) || parsedBookings.length === 0) {
        return
      }

      const latestBooking = parsedBookings[0]

      if (
        latestBooking &&
        typeof latestBooking === 'object'
      ) {
        setBooking({
          id: latestBooking.id ?? FALLBACK_BOOKING.id,
          mandiName:
            latestBooking.mandiName ??
            FALLBACK_BOOKING.mandiName,
          date: latestBooking.date ?? FALLBACK_BOOKING.date,
          time: latestBooking.time ?? FALLBACK_BOOKING.time,
          crop: latestBooking.crop ?? FALLBACK_BOOKING.crop,
          quantity:
            latestBooking.quantity ??
            FALLBACK_BOOKING.quantity,
          status:
            latestBooking.status ??
            FALLBACK_BOOKING.status,
          vehicleNumber:
            latestBooking.vehicleNumber ??
            FALLBACK_BOOKING.vehicleNumber,
        })
      }
    } catch {
      setBooking(FALLBACK_BOOKING)
    }
  }, [])

  const qrValue = JSON.stringify({
    bookingId: booking.id,
    mandi: booking.mandiName,
    date: booking.date,
    time: booking.time,
    crop: booking.crop,
    quantity: booking.quantity,
    vehicle: booking.vehicleNumber,
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
            <span className="text-4xl">✓</span>
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
                  {booking.mandiName}
                </h2>
              </div>

              <div className="px-4 py-2 bg-white rounded-xl">
                <p className="text-xs font-medium text-gray-500">
                  Booking ID
                </p>
                <p className="font-bold text-green-700">
                  {booking.id}
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
                {formatDate(booking.date)}
              </p>
            </div>

            <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50">
              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Time Slot
              </p>
              <p className="mt-2 font-bold text-gray-900">
                {booking.time}
              </p>
            </div>

            <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50">
              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Crop
              </p>
              <p className="mt-2 font-bold text-gray-900">
                🌾 {booking.crop}
              </p>
            </div>

            <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50">
              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Quantity
              </p>
              <p className="mt-2 font-bold text-gray-900">
                {booking.quantity}
              </p>
            </div>

            <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50">
              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Vehicle Number
              </p>
              <p className="mt-2 font-bold text-gray-900">
                {booking.vehicleNumber || 'Not provided'}
              </p>
            </div>

            <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50">
              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Status
              </p>

              <div className="mt-2">
                <span className="inline-flex px-3 py-1 text-xs font-bold text-green-700 capitalize bg-green-100 border border-green-200 rounded-full">
                  {booking.status}
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
                    {booking.id}
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