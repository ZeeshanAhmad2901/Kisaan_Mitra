import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import apiClient from '../../api/client'
import { getMandis, type BackendMandi } from '../../api/mandiApi'
import { getSlots, type BackendSlot } from '../../api/slotApi'
import { getMyVehicles, type BackendVehicle } from '../../api/vehicleApi'

const CROPS = [
  'Wheat',
  'Rice',
  'Mustard',
  'Potato',
  'Onion',
  'Sugarcane',
  'Soybean',
  'Maize',
]

const CROP_ICONS: Record<string, string> = {
  Wheat: '🌾',
  Rice: '🌾',
  Mustard: '🌼',
  Potato: '🥔',
  Onion: '🧅',
  Sugarcane: '🎋',
  Soybean: '🌱',
  Maize: '🌽',
}

const STEPS = [
  {
    number: '01',
    title: 'Mandi',
    description: 'Choose centre',
    icon: '🏪',
  },
  {
    number: '02',
    title: 'Time Slot',
    description: 'Choose visit time',
    icon: '🕐',
  },
  {
    number: '03',
    title: 'Farm Details',
    description: 'Crop & vehicle',
    icon: '🌾',
  },
  {
    number: '04',
    title: 'Confirm',
    description: 'Review booking',
    icon: '✓',
  },
]

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

function BookSlotPage() {
  const navigate = useNavigate()

  const [step, setStep] = useState(0)

  const [selectedMandi, setSelectedMandi] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [crop, setCrop] = useState('')
  const [quantity, setQuantity] = useState('')
  const [vehicleId, setVehicleId] = useState('')

  const [mandis, setMandis] = useState<BackendMandi[]>([])
  const [slots, setSlots] = useState<BackendSlot[]>([])
  const [vehicles, setVehicles] = useState<BackendVehicle[]>([])

  const [loadingMandis, setLoadingMandis] = useState(true)
  const [loadingVehicles, setLoadingVehicles] = useState(true)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [loading, setLoading] = useState(false)

  const [error, setError] = useState('')

  const selectedMandiData = mandis.find(
    (mandi) => String(mandi.id) === selectedMandi,
  )

  const selectedSlotData = slots.find(
    (slot) => String(slot.id) === selectedSlot,
  )

  const selectedVehicle = vehicles.find(
    (vehicle) => String(vehicle.id) === vehicleId,
  )

  const filteredSlots = slots

  useEffect(() => {
    async function loadInitialData() {
      setError('')

      try {
        setLoadingMandis(true)

        const mandiData = await getMandis()

        setMandis(mandiData)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load mandis.',
        )
      } finally {
        setLoadingMandis(false)
      }

      try {
        setLoadingVehicles(true)

        const vehicleData = await getMyVehicles()

        setVehicles(
          vehicleData.filter((vehicle) => vehicle.is_active),
        )
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load your vehicles.',
        )
      } finally {
        setLoadingVehicles(false)
      }
    }

    loadInitialData()
  }, [])

  const canNext = () => {
    if (step === 0) {
      return Boolean(selectedMandi)
    }

    if (step === 1) {
      return Boolean(selectedSlot)
    }

    if (step === 2) {
      const numericQuantity = Number(quantity)

      return Boolean(
        crop &&
          quantity &&
          vehicleId &&
          Number.isFinite(numericQuantity) &&
          numericQuantity > 0,
      )
    }

    return true
  }

  const handleMandiSelect = async (mandiId: string) => {
  setSelectedMandi(mandiId)
  setSelectedSlot('')
  setSlots([])
  setError('')
  setLoadingSlots(true)

  try {
    const slotData = await getSlots(mandiId)

    console.log('SELECTED MANDI:', mandiId)
    console.log('SLOTS FROM API:', slotData)

    const availableSlots = slotData.filter(
      (slot) => slot.is_active && slot.is_available,
    )

    console.log('FILTERED SLOTS:', availableSlots)

    setSlots(availableSlots)
    setStep(1)
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : 'Failed to load available slots.',
    )
  } finally {
    setLoadingSlots(false)
  }
}

  const handleBook = async () => {
    if (
      !selectedMandi ||
      !selectedSlot ||
      !vehicleId ||
      !crop ||
      !quantity
    ) {
      return
    }

    const numericQuantity = Number(quantity)

    if (!Number.isFinite(numericQuantity) || numericQuantity <= 0) {
      setError('Please enter a valid quantity.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const booking = await apiClient<BookingResponse>(
        '/bookings/',
        {
          method: 'POST',
          body: JSON.stringify({
            mandi_id: Number(selectedMandi),
            slot_id: Number(selectedSlot),
            vehicle_id: Number(vehicleId),
            crop_type: crop,
            quantity: numericQuantity,
          }),
        },
      )

      navigate('/farmer/booking-success', {
  state: {
    bookingId: booking.booking_code,
    booking,
    mandi: selectedMandiData,
    slot: selectedSlotData,
    vehicle: selectedVehicle,
  },
})
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to create booking.',
      )
    } finally {
      setLoading(false)
    }
  }

  const getAvailability = (slot: BackendSlot) => {
    const remaining = Math.max(
      slot.total_slots - slot.booked_slots,
      0,
    )

    if (!slot.is_active || !slot.is_available || remaining === 0) {
      return {
        label: 'Full',
        className: 'bg-red-50 text-red-700 border-red-200',
      }
    }

    if (remaining <= 5) {
      return {
        label: `${remaining} left`,
        className:
          'bg-amber-50 text-amber-700 border-amber-200',
      }
    }

    return {
      label: `${remaining} available`,
      className:
        'bg-green-50 text-green-700 border-green-200',
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-slate-50">
      {/* Page Header */}
      <div className="bg-white border-b border-green-100">
        <div className="max-w-6xl px-4 py-6 mx-auto sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-semibold tracking-wide text-green-800 uppercase border border-green-200 rounded-full bg-green-50">
                <span>🌾</span>
                Government Digital Agriculture Service
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Book Your Mandi Visit
              </h1>

              <p className="max-w-2xl mt-2 text-sm leading-6 text-slate-500">
                Reserve a procurement slot in advance and arrive at your
                mandi at a planned time.
              </p>
            </div>

            <div className="flex items-center gap-3 p-3 border border-green-100 rounded-2xl bg-green-50/70">
              <div className="flex items-center justify-center text-lg bg-white border border-green-100 w-11 h-11 rounded-xl">
                🛡️
              </div>

              <div>
                <p className="text-xs font-semibold tracking-wide text-green-800 uppercase">
                  Secure Booking
                </p>

                <p className="mt-0.5 text-xs text-green-700">
                  Your visit is digitally recorded
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 p-4 mb-6 text-sm text-red-800 border border-red-200 rounded-xl bg-red-50">
            <span>⚠️</span>

            <div className="flex-1">
              <p className="font-semibold">Something went wrong</p>
              <p className="mt-1">{error}</p>
            </div>

            <button
              type="button"
              onClick={() => setError('')}
              className="text-red-600 hover:text-red-800"
            >
              ✕
            </button>
          </div>
        )}

        {/* Progress Stepper */}
        <div className="p-4 mb-8 bg-white border shadow-sm rounded-2xl border-slate-200">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {STEPS.map((item, index) => {
              const active = index === step
              const completed = index < step

              return (
                <div key={item.number} className="relative">
                  <div
                    className={`flex items-center gap-3 rounded-xl p-3 border transition-all ${
                      active
                        ? 'border-green-300 bg-green-50'
                        : completed
                          ? 'border-green-200 bg-green-50/50'
                          : 'border-slate-100 bg-slate-50'
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-xl text-sm font-bold ${
                        completed || active
                          ? 'bg-green-700 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {completed ? '✓' : item.icon}
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`text-xs font-bold uppercase tracking-wide ${
                          active || completed
                            ? 'text-green-800'
                            : 'text-slate-400'
                        }`}
                      >
                        Step {item.number}
                      </p>

                      <p
                        className={`text-sm font-semibold truncate ${
                          active
                            ? 'text-slate-900'
                            : 'text-slate-600'
                        }`}
                      >
                        {item.title}
                      </p>

                      <p className="hidden text-xs text-slate-400 sm:block">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main Wizard */}
          <div className="overflow-hidden bg-white border shadow-sm rounded-2xl border-slate-200">
            {/* Wizard top bar */}
            <div className="px-6 py-5 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold tracking-widest text-green-700 uppercase">
                    Step {String(step + 1).padStart(2, '0')} of 04
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    {step === 0 && 'Select Procurement Centre'}
                    {step === 1 && 'Choose Your Time Slot'}
                    {step === 2 && 'Enter Farm Details'}
                    {step === 3 && 'Review & Confirm'}
                  </h2>
                </div>

                <div className="items-center justify-center hidden w-12 h-12 text-lg rounded-xl bg-green-50 sm:flex">
                  {STEPS[step].icon}
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {/* STEP 0 */}
              {step === 0 && (
                <div>
                  <div className="mb-6">
                    <p className="text-sm text-slate-500">
                      Select the mandi where you want to bring your
                      produce for procurement.
                    </p>
                  </div>

                  {loadingMandis ? (
                    <div className="p-8 text-center border border-dashed rounded-2xl border-slate-300 bg-slate-50">
                      <div className="text-3xl animate-pulse">
                        🏪
                      </div>

                      <p className="mt-3 font-semibold text-slate-800">
                        Loading procurement centres...
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Fetching available mandis.
                      </p>
                    </div>
                  ) : mandis.length === 0 ? (
                    <div className="p-8 text-center border border-dashed rounded-2xl border-slate-300 bg-slate-50">
                      <div className="text-3xl">🏪</div>

                      <p className="mt-3 font-semibold text-slate-800">
                        No active mandis available
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Please try again later.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {mandis.map((mandi) => {
                        const selected =
                          selectedMandi === String(mandi.id)

                        return (
                          <button
                            key={mandi.id}
                            type="button"
                            onClick={() =>
                              handleMandiSelect(String(mandi.id))
                            }
                            className={`relative overflow-hidden text-left rounded-2xl border p-5 transition-all ${
                              selected
                                ? 'border-green-500 bg-green-50 shadow-md ring-2 ring-green-100'
                                : 'border-slate-200 bg-white hover:border-green-300 hover:shadow-md'
                            }`}
                          >
                            {selected && (
                              <div className="absolute top-0 right-0 px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase bg-green-700 rounded-bl-xl">
                                Selected
                              </div>
                            )}

                            <div className="flex items-start gap-4">
                              <div
                                className={`flex items-center justify-center flex-shrink-0 w-12 h-12 text-xl rounded-xl ${
                                  selected
                                    ? 'bg-green-700 text-white'
                                    : 'bg-green-50 text-green-700'
                                }`}
                              >
                                🏪
                              </div>

                              <div className="min-w-0">
                                <h3 className="font-bold text-slate-900">
                                  {mandi.name}
                                </h3>

                                <p className="flex items-center gap-1 mt-1 text-sm text-slate-500">
                                  <span>📍</span>
                                  {mandi.location}
                                </p>

                                <div className="flex items-center gap-2 mt-3">
                                  <span className="px-2.5 py-1 text-[11px] font-semibold text-green-700 bg-white border border-green-200 rounded-full">
                                    Procurement Centre
                                  </span>

                                  <span className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-full">
                                    Online Booking
                                  </span>
                                </div>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 1 */}
              {step === 1 && (
                <div>
                  {selectedMandiData && (
                    <div className="flex items-center justify-between gap-4 p-4 mb-6 border border-green-200 rounded-xl bg-green-50">
                      <div>
                        <p className="text-xs font-semibold tracking-wide text-green-700 uppercase">
                          Selected Centre
                        </p>

                        <p className="mt-1 font-bold text-slate-900">
                          {selectedMandiData.name}
                        </p>

                        <p className="text-xs text-slate-500">
                          📍 {selectedMandiData.location}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setStep(0)}
                        className="px-3 py-2 text-xs font-semibold text-green-700 bg-white border border-green-200 rounded-lg hover:bg-green-100"
                      >
                        Change
                      </button>
                    </div>
                  )}

                  {loadingSlots ? (
                    <div className="p-8 text-center border border-dashed rounded-2xl border-slate-300 bg-slate-50">
                      <div className="text-3xl animate-pulse">
                        🕐
                      </div>

                      <p className="mt-3 font-semibold text-slate-800">
                        Loading available slots...
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Checking the latest slot availability.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredSlots.length === 0 ? (
                        <div className="p-8 text-center border border-dashed rounded-2xl border-slate-300 bg-slate-50">
                          <div className="text-3xl">🕐</div>

                          <p className="mt-3 font-semibold text-slate-800">
                            No slots available
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            Try selecting another mandi.
                          </p>

                          <button
                            type="button"
                            onClick={() => setStep(0)}
                            className="px-4 py-2 mt-4 text-sm font-semibold text-white bg-green-700 rounded-xl hover:bg-green-800"
                          >
                            Choose Another Mandi
                          </button>
                        </div>
                      ) : (
                        filteredSlots.map((slot) => {
                          const selected =
                            selectedSlot === String(slot.id)

                          const availability =
                            getAvailability(slot)

                          const remaining = Math.max(
                            slot.total_slots -
                              slot.booked_slots,
                            0,
                          )

                          const percentage =
                            slot.total_slots > 0
                              ? Math.min(
                                  (slot.booked_slots /
                                    slot.total_slots) *
                                    100,
                                  100,
                                )
                              : 0

                          return (
                            <button
                              key={slot.id}
                              type="button"
                              disabled={
                                !slot.is_active ||
                                !slot.is_available
                              }
                              onClick={() => {
                                if (
                                  slot.is_active &&
                                  slot.is_available
                                ) {
                                  setSelectedSlot(
                                    String(slot.id),
                                  )
                                }
                              }}
                              className={`w-full text-left rounded-2xl border p-5 transition-all ${
                                !slot.is_active ||
                                !slot.is_available
                                  ? 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-60'
                                  : selected
                                    ? 'border-green-500 bg-green-50 shadow-sm ring-2 ring-green-100'
                                    : 'border-slate-200 hover:border-green-300 hover:shadow-sm'
                              }`}
                            >
                              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`flex items-center justify-center w-11 h-11 rounded-xl ${
                                        selected
                                          ? 'bg-green-700 text-white'
                                          : 'bg-slate-100 text-slate-700'
                                      }`}
                                    >
                                      🕐
                                    </div>

                                    <div>
                                      <p className="font-bold text-slate-900">
                                        {slot.start_time} -{' '}
                                        {slot.end_time}
                                      </p>

                                      <p className="mt-1 text-xs text-slate-500">
                                        📅 {slot.slot_date}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="sm:text-right">
                                  <span
                                    className={`inline-flex items-center px-3 py-1.5 text-xs font-bold border rounded-full ${availability.className}`}
                                  >
                                    {availability.label}
                                  </span>
                                </div>
                              </div>

                              <div className="mt-4">
                                <div className="flex justify-between mb-1.5 text-[11px] text-slate-500">
                                  <span>
                                    Slot utilization
                                  </span>

                                  <span>
                                    {slot.booked_slots}/
                                    {slot.total_slots} booked
                                  </span>
                                </div>

                                <div className="w-full h-2 overflow-hidden rounded-full bg-slate-100">
                                  <div
                                    className={`h-full rounded-full ${
                                      !slot.is_available
                                        ? 'bg-red-400'
                                        : remaining <= 5
                                          ? 'bg-amber-400'
                                          : 'bg-green-500'
                                    }`}
                                    style={{
                                      width: `${percentage}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </button>
                          )
                        })
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-8">
                  {/* Crop */}
                  <section>
                    <div className="mb-4">
                      <p className="text-xs font-semibold tracking-widest text-green-700 uppercase">
                        Produce Information
                      </p>

                      <h3 className="mt-1 text-lg font-bold text-slate-900">
                        What crop are you bringing?
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {CROPS.map((cropName) => {
                        const selected = crop === cropName

                        return (
                          <button
                            key={cropName}
                            type="button"
                            onClick={() => setCrop(cropName)}
                            className={`p-4 rounded-2xl border text-center transition-all ${
                              selected
                                ? 'border-green-500 bg-green-50 shadow-sm ring-2 ring-green-100'
                                : 'border-slate-200 hover:border-green-300 hover:bg-green-50/50'
                            }`}
                          >
                            <div className="text-2xl">
                              {CROP_ICONS[cropName]}
                            </div>

                            <p
                              className={`mt-2 text-sm font-semibold ${
                                selected
                                  ? 'text-green-800'
                                  : 'text-slate-700'
                              }`}
                            >
                              {cropName}
                            </p>
                          </button>
                        )
                      })}
                    </div>
                  </section>

                  {/* Quantity */}
                  <section>
                    <div className="mb-3">
                      <p className="text-xs font-semibold tracking-widest text-green-700 uppercase">
                        Quantity
                      </p>

                      <h3 className="mt-1 text-lg font-bold text-slate-900">
                        Expected produce quantity
                      </h3>
                    </div>

                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={quantity}
                        onChange={(event) =>
                          setQuantity(event.target.value)
                        }
                        placeholder="Enter quantity"
                        className="w-full px-4 py-4 pr-24 text-base border rounded-xl border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />

                      <span className="absolute text-sm font-semibold -translate-y-1/2 top-1/2 right-4 text-slate-500">
                        Quintal
                      </span>
                    </div>
                  </section>

                  {/* Vehicles */}
                  <section>
                    <div className="mb-4">
                      <p className="text-xs font-semibold tracking-widest text-green-700 uppercase">
                        Transport
                      </p>

                      <h3 className="mt-1 text-lg font-bold text-slate-900">
                        Select your vehicle
                      </h3>
                    </div>

                    {loadingVehicles ? (
                      <div className="p-6 text-center border border-dashed rounded-2xl border-slate-300 bg-slate-50">
                        <div className="text-2xl animate-pulse">
                          🚜
                        </div>

                        <p className="mt-2 text-sm font-semibold text-slate-800">
                          Loading your vehicles...
                        </p>
                      </div>
                    ) : vehicles.length === 0 ? (
                      <div className="p-6 text-center border border-dashed rounded-2xl border-slate-300 bg-slate-50">
                        <div className="text-2xl">🚜</div>

                        <p className="mt-2 font-semibold text-slate-800">
                          No active vehicles found
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Please register a vehicle before booking
                          a mandi slot.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {vehicles.map((vehicle) => {
                          const selected =
                            vehicleId === String(vehicle.id)

                          return (
                            <button
                              key={vehicle.id}
                              type="button"
                              onClick={() =>
                                setVehicleId(
                                  String(vehicle.id),
                                )
                              }
                              className={`w-full p-4 rounded-2xl border text-left transition-all ${
                                selected
                                  ? 'border-green-500 bg-green-50 shadow-sm ring-2 ring-green-100'
                                  : 'border-slate-200 hover:border-green-300'
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  className={`flex items-center justify-center w-12 h-12 text-2xl rounded-xl ${
                                    selected
                                      ? 'bg-green-700 text-white'
                                      : 'bg-slate-100'
                                  }`}
                                >
                                  {vehicle.vehicle_type
                                    .toLowerCase()
                                    .includes('tractor')
                                    ? '🚜'
                                    : '🚛'}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <p className="font-bold uppercase text-slate-900">
                                      {vehicle.vehicle_number}
                                    </p>
                                  </div>

                                  <p className="mt-1 text-sm capitalize text-slate-500">
                                    {vehicle.vehicle_type}
                                  </p>
                                </div>

                                <div
                                  className={`flex items-center justify-center w-6 h-6 rounded-full border-2 ${
                                    selected
                                      ? 'border-green-700 bg-green-700'
                                      : 'border-slate-300'
                                  }`}
                                >
                                  {selected && (
                                    <span className="text-xs text-white">
                                      ✓
                                    </span>
                                  )}
                                </div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </section>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div>
                  <div className="p-5 mb-6 border border-green-200 rounded-2xl bg-green-50">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-10 h-10 text-lg text-white bg-green-700 rounded-xl">
                        ✓
                      </div>

                      <div>
                        <h3 className="font-bold text-green-900">
                          Ready to confirm your mandi visit
                        </h3>

                        <p className="mt-1 text-sm text-green-700">
                          Please verify the details below before
                          confirming.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-hidden border rounded-2xl border-slate-200">
                    <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
                      <p className="text-xs font-semibold tracking-widest uppercase text-slate-500">
                        Booking Summary
                      </p>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {/* Mandi */}
                      <div className="flex items-start justify-between gap-6 p-5">
                        <div>
                          <p className="text-xs text-slate-400">
                            Mandi
                          </p>

                          <p className="mt-1 font-semibold text-slate-900">
                            {selectedMandiData?.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            📍 {selectedMandiData?.location}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setStep(0)}
                          className="text-xs font-semibold text-green-700"
                        >
                          Edit
                        </button>
                      </div>

                      {/* Date / Time */}
                      <div className="grid gap-5 p-5 sm:grid-cols-2">
                        <div>
                          <p className="text-xs text-slate-400">
                            Date
                          </p>

                          <p className="mt-1 font-semibold text-slate-900">
                            📅 {selectedSlotData?.slot_date}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">
                            Time
                          </p>

                          <p className="mt-1 font-semibold text-slate-900">
                            🕐 {selectedSlotData?.start_time} -{' '}
                            {selectedSlotData?.end_time}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">
                            Crop
                          </p>

                          <p className="mt-1 font-semibold text-slate-900">
                            {CROP_ICONS[crop]} {crop}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">
                            Quantity
                          </p>

                          <p className="mt-1 font-semibold text-slate-900">
                            {quantity} quintal
                          </p>
                        </div>

                        <div className="sm:col-span-2">
                          <p className="text-xs text-slate-400">
                            Vehicle
                          </p>

                          <p className="mt-1 font-semibold text-slate-900">
                            {selectedVehicle?.vehicle_number}
                          </p>

                          <p className="mt-1 text-xs capitalize text-slate-500">
                            {selectedVehicle?.vehicle_type}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 mt-8 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() =>
                    setStep(Math.max(0, step - 1))
                  }
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    step === 0
                      ? 'invisible'
                      : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  ← Back
                </button>

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    disabled={!canNext()}
                    className="py-3 text-sm font-semibold text-white transition-all bg-green-700 px-7 rounded-xl hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleBook}
                    disabled={loading}
                    className="py-3 text-sm font-semibold text-white transition-all bg-green-700 px-7 rounded-xl hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-green-400"
                  >
                    {loading
                      ? 'Confirming Booking...'
                      : '✓ Confirm Booking'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Side Summary */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="overflow-hidden bg-white border shadow-sm rounded-2xl border-slate-200">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
                <p className="text-xs font-semibold tracking-widest text-green-700 uppercase">
                  Your Booking
                </p>

                <h3 className="mt-1 font-bold text-slate-900">
                  Visit Summary
                </h3>
              </div>

              <div className="p-5 space-y-5">
                {/* Mandi */}
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center text-sm rounded-lg w-9 h-9 bg-green-50">
                    🏪
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase">
                      Mandi
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {selectedMandiData?.name ?? 'Not selected'}
                    </p>

                    {selectedMandiData && (
                      <p className="text-xs text-slate-500">
                        {selectedMandiData.location}
                      </p>
                    )}
                  </div>
                </div>

                {/* Slot */}
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center text-sm rounded-lg w-9 h-9 bg-green-50">
                    🕐
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase">
                      Visit Time
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {selectedSlotData
                        ? `${selectedSlotData.start_time} - ${selectedSlotData.end_time}`
                        : 'Not selected'}
                    </p>

                    {selectedSlotData && (
                      <p className="text-xs text-slate-500">
                        {selectedSlotData.slot_date}
                      </p>
                    )}
                  </div>
                </div>

                {/* Crop */}
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center text-sm rounded-lg w-9 h-9 bg-green-50">
                    🌾
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase">
                      Produce
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {crop || 'Not selected'}
                    </p>

                    {quantity && (
                      <p className="text-xs text-slate-500">
                        {quantity} quintal
                      </p>
                    )}
                  </div>
                </div>

                {/* Vehicle */}
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center text-sm rounded-lg w-9 h-9 bg-green-50">
                    🚜
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase">
                      Vehicle
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {selectedVehicle?.vehicle_number ??
                        'Not selected'}
                    </p>

                    {selectedVehicle && (
                      <p className="text-xs capitalize text-slate-500">
                        {selectedVehicle.vehicle_type}
                      </p>
                    )}
                  </div>
                </div>

                {/* Security note */}
                <div className="p-4 mt-2 border border-green-100 rounded-xl bg-green-50">
                  <div className="flex gap-2">
                    <span>🛡️</span>

                    <div>
                      <p className="text-xs font-bold text-green-800">
                        Secure digital booking
                      </p>

                      <p className="mt-1 text-[11px] leading-5 text-green-700">
                        Your booking details will be stored
                        digitally and can be viewed from My
                        Bookings.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Card */}
            <div className="p-5 mt-4 border bg-slate-900 rounded-2xl border-slate-800">
              <p className="text-xs font-semibold tracking-widest text-green-300 uppercase">
                Need help?
              </p>

              <p className="mt-2 text-sm font-semibold text-white">
                Bring your registered vehicle and produce details.
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                Arrive during your confirmed slot to help maintain a
                smooth procurement queue.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default BookSlotPage