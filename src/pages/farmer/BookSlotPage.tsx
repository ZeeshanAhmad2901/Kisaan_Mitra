import { useState } from 'react'
import { useNavigate } from 'react-router'
import type { Slot, Vehicle } from '../../types'

interface MockMandi {
  id: string
  name: string
  location: string
}

const MOCK_MANDIS: MockMandi[] = [
  {
    id: '1',
    name: 'Azadpur Mandi',
    location: 'Delhi',
  },
  {
    id: '2',
    name: 'Krishna Mandi',
    location: 'Lucknow',
  },
  {
    id: '3',
    name: 'Jawaharlal Nehru Mandi',
    location: 'Jaipur',
  },
]

const MOCK_SLOTS: Slot[] = [
  {
    id: '1',
    mandiId: '1',
    mandiName: 'Azadpur Mandi',
    date: '2025-09-01',
    time: '6:00 AM - 8:00 AM',
    totalSlots: 20,
    bookedSlots: 14,
    isAvailable: true,
  },
  {
    id: '2',
    mandiId: '1',
    mandiName: 'Azadpur Mandi',
    date: '2025-09-01',
    time: '8:00 AM - 10:00 AM',
    totalSlots: 20,
    bookedSlots: 20,
    isAvailable: false,
  },
  {
    id: '3',
    mandiId: '1',
    mandiName: 'Azadpur Mandi',
    date: '2025-09-02',
    time: '6:00 AM - 8:00 AM',
    totalSlots: 20,
    bookedSlots: 8,
    isAvailable: true,
  },
  {
    id: '4',
    mandiId: '2',
    mandiName: 'Krishna Mandi',
    date: '2025-09-01',
    time: '7:00 AM - 9:00 AM',
    totalSlots: 15,
    bookedSlots: 10,
    isAvailable: true,
  },
  {
    id: '5',
    mandiId: '3',
    mandiName: 'Jawaharlal Nehru Mandi',
    date: '2025-09-01',
    time: '6:30 AM - 8:30 AM',
    totalSlots: 25,
    bookedSlots: 25,
    isAvailable: false,
  },
]

const MOCK_VEHICLES: Vehicle[] = [
  {
    id: '1',
    farmerId: '1',
    vehicleType: 'tractor',
    vehicleNumber: 'UP-32-AB-1234',
    capacity: 10,
    capacityUnit: 'quintal',
    isDefault: true,
  },
  {
    id: '2',
    farmerId: '1',
    vehicleType: 'truck',
    vehicleNumber: 'UP-32-CD-5678',
    capacity: 50,
    capacityUnit: 'quintal',
    isDefault: false,
  },
]

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

function BookSlotPage() {
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [selectedMandi, setSelectedMandi] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [crop, setCrop] = useState('')
  const [quantity, setQuantity] = useState('')
  const [vehicleId, setVehicleId] = useState('')
  const [loading, setLoading] = useState(false)

  const filteredSlots = selectedMandi
    ? MOCK_SLOTS.filter((slot) => slot.mandiId === selectedMandi)
    : []

  const selectedSlotData = MOCK_SLOTS.find(
    (slot) => slot.id === selectedSlot,
  )

  const selectedMandiData = MOCK_MANDIS.find(
    (mandi) => mandi.id === selectedMandi,
  )

  const selectedVehicle = MOCK_VEHICLES.find(
    (vehicle) => vehicle.id === vehicleId,
  )

  const canNext = () => {
    if (step === 0) {
      return Boolean(selectedMandi)
    }

    if (step === 1) {
      return Boolean(selectedSlot)
    }

    if (step === 2) {
      return Boolean(crop && quantity && vehicleId)
    }

    return true
  }

  const handleMandiSelect = (mandiId: string) => {
    setSelectedMandi(mandiId)
    setSelectedSlot('')
  }

  const handleBook = async () => {
    setLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const bookingId = `KM-2025-${String(
      Math.floor(Math.random() * 90000) + 10000,
    )}`

    const newBooking = {
      id: bookingId,
      mandiName: selectedMandiData?.name ?? 'Azadpur Mandi',
      date: selectedSlotData?.date ?? '2025-09-01',
      time: selectedSlotData?.time ?? '6:00 AM - 8:00 AM',
      crop,
      quantity: `${quantity} quintal`,
      status: 'confirmed',
      vehicleNumber: selectedVehicle?.vehicleNumber ?? '',
    }

    const existingBookings = JSON.parse(
      localStorage.getItem('kisaan_mitra_bookings') ?? '[]',
    )

    localStorage.setItem(
      'kisaan_mitra_bookings',
      JSON.stringify([newBooking, ...existingBookings]),
    )

    setLoading(false)
    navigate('/farmer/booking-success')
  }

  const getAvailability = (slot: Slot) => {
    const remaining = slot.totalSlots - slot.bookedSlots

    if (!slot.isAvailable) {
      return {
        label: 'Full',
        className: 'bg-red-50 text-red-700 border-red-200',
      }
    }

    if (remaining <= 5) {
      return {
        label: `${remaining} left`,
        className: 'bg-amber-50 text-amber-700 border-amber-200',
      }
    }

    return {
      label: `${remaining} available`,
      className: 'bg-green-50 text-green-700 border-green-200',
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
                Reserve a procurement slot in advance and arrive at your mandi
                at a planned time.
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
                          active ? 'text-slate-900' : 'text-slate-600'
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
                      Select the mandi where you want to bring your produce for
                      procurement.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {MOCK_MANDIS.map((mandi) => {
                      const selected = selectedMandi === mandi.id

                      return (
                        <button
                          key={mandi.id}
                          type="button"
                          onClick={() => handleMandiSelect(mandi.id)}
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
                      </div>
                    ) : (
                      filteredSlots.map((slot) => {
                        const selected = selectedSlot === slot.id
                        const availability = getAvailability(slot)
                        const remaining =
                          slot.totalSlots - slot.bookedSlots
                        const percentage =
                          (slot.bookedSlots / slot.totalSlots) * 100

                        return (
                          <button
                            key={slot.id}
                            type="button"
                            disabled={!slot.isAvailable}
                            onClick={() => {
                              if (slot.isAvailable) {
                                setSelectedSlot(slot.id)
                              }
                            }}
                            className={`w-full text-left rounded-2xl border p-5 transition-all ${
                              !slot.isAvailable
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
                                      {slot.time}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                      📅 {slot.date}
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
                                <span>Slot utilization</span>
                                <span>
                                  {slot.bookedSlots}/{slot.totalSlots} booked
                                </span>
                              </div>

                              <div className="w-full h-2 overflow-hidden rounded-full bg-slate-100">
                                <div
                                  className={`h-full rounded-full ${
                                    !slot.isAvailable
                                      ? 'bg-red-400'
                                      : remaining <= 5
                                        ? 'bg-amber-400'
                                        : 'bg-green-500'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          </button>
                        )
                      })
                    )}
                  </div>
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
                        value={quantity}
                        onChange={(event) => setQuantity(event.target.value)}
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

                    <div className="space-y-3">
                      {MOCK_VEHICLES.map((vehicle) => {
                        const selected = vehicleId === vehicle.id

                        return (
                          <button
                            key={vehicle.id}
                            type="button"
                            onClick={() => setVehicleId(vehicle.id)}
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
                                {vehicle.vehicleType === 'tractor'
                                  ? '🚜'
                                  : '🚛'}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="font-bold uppercase text-slate-900">
                                    {vehicle.vehicleNumber}
                                  </p>

                                  {vehicle.isDefault && (
                                    <span className="px-2 py-1 text-[10px] font-bold text-green-700 bg-white border border-green-200 rounded-full">
                                      DEFAULT
                                    </span>
                                  )}
                                </div>

                                <p className="mt-1 text-sm capitalize text-slate-500">
                                  {vehicle.vehicleType} • Capacity:{' '}
                                  {vehicle.capacity} {vehicle.capacityUnit}
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
                                  <span className="text-xs text-white">✓</span>
                                )}
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
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
                          Please verify the details below before confirming.
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
                      <div className="flex items-start justify-between gap-6 p-5">
                        <div>
                          <p className="text-xs text-slate-400">Mandi</p>
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

                      <div className="grid gap-5 p-5 sm:grid-cols-2">
                        <div>
                          <p className="text-xs text-slate-400">Date</p>
                          <p className="mt-1 font-semibold text-slate-900">
                            📅 {selectedSlotData?.date}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">Time</p>
                          <p className="mt-1 font-semibold text-slate-900">
                            🕐 {selectedSlotData?.time}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">Crop</p>
                          <p className="mt-1 font-semibold text-slate-900">
                            {CROP_ICONS[crop]} {crop}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">Quantity</p>
                          <p className="mt-1 font-semibold text-slate-900">
                            {quantity} quintal
                          </p>
                        </div>

                        <div className="sm:col-span-2">
                          <p className="text-xs text-slate-400">Vehicle</p>
                          <p className="mt-1 font-semibold text-slate-900">
                            {selectedVehicle?.vehicleNumber}
                          </p>
                          <p className="mt-1 text-xs capitalize text-slate-500">
                            {selectedVehicle?.vehicleType} •{' '}
                            {selectedVehicle?.capacity}{' '}
                            {selectedVehicle?.capacityUnit}
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
                  onClick={() => setStep(Math.max(0, step - 1))}
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
                    {loading ? 'Confirming Booking...' : '✓ Confirm Booking'}
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
                      {selectedSlotData?.time ?? 'Not selected'}
                    </p>

                    {selectedSlotData && (
                      <p className="text-xs text-slate-500">
                        {selectedSlotData.date}
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
                      {selectedVehicle?.vehicleNumber ?? 'Not selected'}
                    </p>

                    {selectedVehicle && (
                      <p className="text-xs capitalize text-slate-500">
                        {selectedVehicle.vehicleType}
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
                        Your booking details will be stored digitally and can
                        be viewed from My Bookings.
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
                Arrive during your confirmed slot to help maintain a smooth
                procurement queue.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default BookSlotPage