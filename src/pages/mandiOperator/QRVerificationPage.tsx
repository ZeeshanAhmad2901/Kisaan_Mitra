import { useState } from 'react'
import {
    confirmBookingArrival,
    verifyBooking,
    type BookingVerificationResponse,
} from '../../api/bookingVerificationApi'

export default function QRVerificationPage() {
   const initialBookingCode =
  new URLSearchParams(window.location.search).get(
    'bookingCode',
  ) ?? ''

  const [bookingCode, setBookingCode] =
    useState(initialBookingCode)

  const [result, setResult] =
    useState<BookingVerificationResponse | null>(null)

  const [loading, setLoading] = useState(false)
  const [arrivalLoading, setArrivalLoading] = useState(false)
  const [error, setError] = useState('')
  const [arrivalSuccess, setArrivalSuccess] = useState('')

  async function handleVerify() {
    if (!bookingCode.trim()) {
      setError('Enter a booking code to continue.')
      setResult(null)
      setArrivalSuccess('')
      return
    }

    try {
      setLoading(true)
      setError('')
      setArrivalSuccess('')
      setResult(null)

      const response = await verifyBooking(bookingCode)
      setResult(response)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to verify booking.',
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleConfirmArrival() {
    if (!result?.booking_id) {
      setError(
        'Booking information is missing. Please verify the booking again.',
      )
      return
    }

    try {
      setArrivalLoading(true)
      setError('')
      setArrivalSuccess('')

      const response = await confirmBookingArrival(
        result.booking_id,
      )

      setResult(response)

      setArrivalSuccess(
        'Farmer arrival confirmed successfully. The booking can now enter queue processing.',
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to confirm farmer arrival.',
      )
    } finally {
      setArrivalLoading(false)
    }
  }

  function handleGoToQueue() {
  if (!result?.booking_id) {
    return
  }

  window.location.href =
    `/mandi-operator/queue-management?bookingId=${encodeURIComponent(
      String(result.booking_id),
    )}`
}

  const displayValue = (
    value: string | number | null | undefined,
  ) => value ?? '—'

  const formattedStatus =
    result?.status?.replace(/_/g, ' ') ?? '—'

  const arrivalVerified =
    result?.arrival_status === 'verified'

  return (
    <div className="min-h-screen px-4 py-6 bg-gray-50 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 text-sm font-medium text-green-700">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                OPERATOR HELP DESK
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                QR & Token Verification
              </h1>

              <p className="max-w-2xl mt-2 text-sm leading-6 text-gray-600">
                Verify a farmer&apos;s booking before mandi entry,
                arrival processing and queue management.
              </p>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-white border border-green-200 rounded-full shadow-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              Verification Desk Active
            </div>
          </div>
        </div>

        {/* Main verification panel */}
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">

          {/* Left panel */}
          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 text-2xl bg-green-100 shrink-0 rounded-xl">
                QR
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Verify Booking
                </h2>

                <p className="mt-1 text-sm leading-5 text-gray-500">
                  Enter the booking reference provided by the farmer.
                </p>
              </div>
            </div>

            <label className="block mb-2 text-sm font-semibold text-gray-800">
              Booking Code
            </label>

            <div className="p-2 border border-gray-200 rounded-xl bg-gray-50 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100">
              <input
                type="text"
                value={bookingCode}
                onChange={(event) => {
                  setBookingCode(
                    event.target.value.toUpperCase(),
                  )
                  setError('')
                  setArrivalSuccess('')
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    void handleVerify()
                  }
                }}
                placeholder="KM-2026-10530221"
                className="w-full px-3 py-3 text-base font-medium tracking-wide text-gray-900 bg-transparent outline-none placeholder:text-gray-400"
              />
            </div>

            <button
              type="button"
              onClick={() => void handleVerify()}
              disabled={loading || arrivalLoading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white rounded-full animate-spin border-t-transparent" />
                  Verifying Booking...
                </>
              ) : (
                <>
                  <span>✓</span>
                  Verify Booking
                </>
              )}
            </button>

            {error && (
              <div className="p-4 mt-5 border border-red-200 rounded-xl bg-red-50">
                <div className="flex gap-3">
                  <div className="flex items-center justify-center w-8 h-8 font-bold text-red-700 bg-red-100 rounded-full shrink-0">
                    !
                  </div>

                  <div>
                    <p className="font-semibold text-red-800">
                      Verification Error
                    </p>

                    <p className="mt-1 text-sm leading-5 text-red-700">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {arrivalSuccess && (
              <div className="p-4 mt-5 border border-green-200 rounded-xl bg-green-50">
                <div className="flex gap-3">
                  <div className="flex items-center justify-center w-8 h-8 font-bold text-white bg-green-600 rounded-full shrink-0">
                    ✓
                  </div>

                  <div>
                    <p className="font-semibold text-green-900">
                      Arrival Confirmed
                    </p>

                    <p className="mt-1 text-sm leading-5 text-green-800">
                      {arrivalSuccess}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Process guide */}
            <div className="pt-6 border-t border-gray-100 mt-7">
              <p className="mb-4 text-xs font-bold tracking-wider text-gray-400 uppercase">
                Mandi Entry Process
              </p>

              <div className="space-y-4">

                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center justify-center w-8 h-8 text-sm font-bold rounded-full ${
                      result?.valid
                        ? 'text-green-700 bg-green-100'
                        : 'text-gray-500 bg-gray-100'
                    }`}
                  >
                    {result?.valid ? '✓' : '1'}
                  </div>

                  <span className="text-sm text-gray-700">
                    Verify booking
                  </span>
                </div>

                <div className="h-5 ml-4 border-l border-gray-300 border-dashed" />

                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center justify-center w-8 h-8 text-sm font-bold rounded-full ${
                      arrivalVerified
                        ? 'text-green-700 bg-green-100'
                        : 'text-gray-500 bg-gray-100'
                    }`}
                  >
                    {arrivalVerified ? '✓' : '2'}
                  </div>

                  <span className="text-sm text-gray-700">
                    Confirm farmer arrival
                  </span>
                </div>

                <div className="h-5 ml-4 border-l border-gray-300 border-dashed" />

                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center justify-center w-8 h-8 text-sm font-bold rounded-full ${
                      arrivalVerified
                        ? 'text-green-700 bg-green-100'
                        : 'text-gray-500 bg-gray-100'
                    }`}
                  >
                    {arrivalVerified ? '3' : '3'}
                  </div>

                  <span className="text-sm text-gray-700">
                    Move to queue processing
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl">

            {!result && !error && (
              <div className="flex min-h-[480px] flex-col items-center justify-center px-6 py-12 text-center">
                <div className="flex items-center justify-center w-24 h-24 mb-5 border-2 border-green-200 border-dashed rounded-3xl bg-green-50">
                  <div className="text-3xl font-black tracking-tight text-green-700">
                    QR
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900">
                  Ready to Verify
                </h2>

                <p className="max-w-md mt-2 text-sm leading-6 text-gray-500">
                  Enter a valid booking code on the left to retrieve
                  the farmer&apos;s live booking information.
                </p>
              </div>
            )}

            {result && (
              <div>

                {/* Result header */}
                <div
                  className={`border-b px-6 py-5 ${
                    result.valid
                      ? 'border-green-100 bg-green-50'
                      : 'border-red-100 bg-red-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold ${
                          result.valid
                            ? 'bg-green-600 text-white'
                            : 'bg-red-600 text-white'
                        }`}
                      >
                        {result.valid ? '✓' : '!'}
                      </div>

                      <div>
                        <p
                          className={`text-xs font-bold uppercase tracking-wider ${
                            result.valid
                              ? 'text-green-700'
                              : 'text-red-700'
                          }`}
                        >
                          Verification Result
                        </p>

                        <h2
                          className={`mt-1 text-xl font-bold ${
                            result.valid
                              ? 'text-green-900'
                              : 'text-red-900'
                          }`}
                        >
                          {result.valid
                            ? 'Booking Verified'
                            : 'Verification Failed'}
                        </h2>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                        result.valid
                          ? 'bg-green-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      {result.valid ? 'VALID' : 'INVALID'}
                    </span>
                  </div>

                  <p
                    className={`mt-4 text-sm ${
                      result.valid
                        ? 'text-green-800'
                        : 'text-red-800'
                    }`}
                  >
                    {result.message}
                  </p>
                </div>

                {result.valid && (
                  <div className="p-6">

                    {/* Farmer card */}
                    <div className="p-5 mb-5 border border-gray-200 rounded-xl bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center text-xl font-bold text-green-700 bg-green-100 rounded-full h-14 w-14">
                          {result.farmer_name
                            ?.charAt(0)
                            .toUpperCase() ?? 'F'}
                        </div>

                        <div>
                          <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                            Farmer
                          </p>

                          <p className="mt-1 text-lg font-bold text-gray-900">
                            {displayValue(result.farmer_name)}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            Farmer ID #{displayValue(result.farmer_id)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Booking information */}
                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold tracking-wider text-gray-500 uppercase">
                          Booking Information
                        </h3>

                        <span className="px-3 py-1 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg">
                          ID #{displayValue(result.booking_id)}
                        </span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">

                        <div className="p-4 border border-gray-200 rounded-xl">
                          <p className="text-xs font-medium text-gray-400">
                            Booking Code
                          </p>

                          <p className="mt-2 font-bold tracking-wide text-gray-900">
                            {displayValue(result.booking_code)}
                          </p>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-xl">
                          <p className="text-xs font-medium text-gray-400">
                            Booking Status
                          </p>

                          <p className="mt-2 font-bold text-green-700 capitalize">
                            {formattedStatus}
                          </p>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-xl">
                          <p className="text-xs font-medium text-gray-400">
                            Crop
                          </p>

                          <p className="mt-2 font-bold text-gray-900">
                            {displayValue(result.crop_type)}
                          </p>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-xl">
                          <p className="text-xs font-medium text-gray-400">
                            Quantity
                          </p>

                          <p className="mt-2 font-bold text-gray-900">
                            {displayValue(result.quantity)}{' '}
                            <span className="text-sm font-medium text-gray-500">
                              quintals
                            </span>
                          </p>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-xl">
                          <p className="text-xs font-medium text-gray-400">
                            Mandi
                          </p>

                          <p className="mt-2 font-bold text-gray-900">
                            Mandi #{displayValue(result.mandi_id)}
                          </p>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-xl">
                          <p className="text-xs font-medium text-gray-400">
                            Arrival Status
                          </p>

                          <p
                            className={`mt-2 font-bold capitalize ${
                              arrivalVerified
                                ? 'text-green-700'
                                : 'text-amber-600'
                            }`}
                          >
                            {arrivalVerified
                              ? 'Verified'
                              : 'Pending'}
                          </p>
                        </div>

                      </div>
                    </div>

                    {/* Arrival action */}
                    {!arrivalVerified && (
                      <div className="p-5 mb-5 border border-blue-200 rounded-xl bg-blue-50">
                        <div className="flex items-start gap-4">
                          <div className="flex items-center justify-center w-10 h-10 font-bold text-blue-700 bg-blue-100 rounded-full shrink-0">
                            2
                          </div>

                          <div className="flex-1">
                            <h3 className="font-bold text-blue-900">
                              Confirm Farmer Arrival
                            </h3>

                            <p className="mt-1 text-sm leading-5 text-blue-800">
                              Verify that the farmer has physically
                              arrived at the mandi before moving the
                              booking into queue processing.
                            </p>

                            <button
                              type="button"
                              onClick={() =>
                                void handleConfirmArrival()
                              }
                              disabled={arrivalLoading}
                              className="flex items-center justify-center w-full gap-2 px-5 py-3 mt-4 font-semibold text-white transition bg-blue-700 shadow-sm rounded-xl hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                            >
                              {arrivalLoading ? (
                                <>
                                  <span className="w-4 h-4 border-2 border-white rounded-full animate-spin border-t-transparent" />
                                  Confirming Arrival...
                                </>
                              ) : (
                                <>
                                  <span>✓</span>
                                  Confirm Arrival
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Arrival verified */}
                    {arrivalVerified && (
                      <div className="p-5 mb-5 border border-green-200 rounded-xl bg-green-50">
                        <div className="flex items-start gap-4">
                          <div className="flex items-center justify-center w-10 h-10 font-bold text-white bg-green-600 rounded-full shrink-0">
                            ✓
                          </div>

                          <div className="flex-1">
                            <h3 className="font-bold text-green-900">
                              Farmer Arrival Confirmed
                            </h3>

                            <p className="mt-1 text-sm leading-5 text-green-800">
                              The farmer has been marked as arrived.
                              This booking is now eligible for queue
                              processing.
                            </p>

                            {result.arrival_verified_at && (
                              <p className="mt-2 text-xs font-medium text-green-700">
                                Verified at{' '}
                                {new Date(
                                  result.arrival_verified_at,
                                ).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Queue action */}
                    {arrivalVerified && (
                      <div className="p-5 bg-white border border-green-200 rounded-xl">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-bold text-gray-900">
                              Ready for Queue Processing
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              Continue to the operator queue to process
                              this farmer according to slot order.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={handleGoToQueue}
                            className="flex items-center justify-center gap-2 px-5 py-3 font-semibold text-white transition bg-green-700 shadow-sm rounded-xl hover:bg-green-800"
                          >
                            Go to Queue
                            <span>→</span>
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer note */}
        <div className="flex flex-col gap-2 px-5 py-4 mt-6 text-sm text-gray-500 bg-white border border-gray-200 rounded-xl sm:flex-row sm:items-center sm:justify-between">
          <span>
            Live verification uses the Kisaan Mitra booking service.
          </span>

          <span className="font-medium text-gray-700">
            Mandi Operator Console
          </span>
        </div>
      </div>
    </div>
  )
}