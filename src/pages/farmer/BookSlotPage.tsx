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

const STEPS = [
  'Select Mandi',
  'Select Slot',
  'Crop & Vehicle',
  'Confirm',
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

    setLoading(false)
    navigate('/farmer/booking-success')
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900">
          Book Mandi Slot
        </h1>

        <p className="mt-1 text-gray-500">
          Book a time slot at your nearest mandi
        </p>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mt-6">
          {STEPS.map((stepName, index) => (
            <div
              key={stepName}
              className="flex items-center flex-1 gap-2"
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  index <= step
                    ? 'bg-green-700 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index < step ? '✓' : index + 1}
              </div>

              <span
                className={`text-sm hidden sm:block ${
                  index <= step
                    ? 'text-green-700 font-medium'
                    : 'text-gray-400'
                }`}
              >
                {stepName}
              </span>

              {index < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 ${
                    index < step
                      ? 'bg-green-700'
                      : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="p-6 mt-8 bg-white border border-gray-200 rounded-lg">
          {/* Step 0: Select Mandi */}
          {step === 0 && (
            <div>
              <h2 className="mb-4 font-bold text-gray-900">
                Select a Mandi
              </h2>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {MOCK_MANDIS.map((mandi) => (
                  <button
                    key={mandi.id}
                    type="button"
                    onClick={() => handleMandiSelect(mandi.id)}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      selectedMandi === mandi.id
                        ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <p className="font-medium text-gray-900">
                      🏪 {mandi.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {mandi.location}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Select Slot */}
          {step === 1 && (
            <div>
              <h2 className="mb-4 font-bold text-gray-900">
                Select a Time Slot
              </h2>

              {selectedMandiData && (
                <p className="mb-4 text-sm text-gray-500">
                  Selected Mandi:{' '}
                  <span className="font-medium text-gray-700">
                    {selectedMandiData.name}
                  </span>
                </p>
              )}

              {filteredSlots.length === 0 ? (
                <p className="text-gray-500">
                  No slots available for this mandi.
                </p>
              ) : (
                <div className="space-y-3">
                  {filteredSlots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => {
                        if (slot.isAvailable) {
                          setSelectedSlot(slot.id)
                        }
                      }}
                      disabled={!slot.isAvailable}
                      className={`w-full p-4 rounded-lg border text-left transition-all ${
                        !slot.isAvailable
                          ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                          : selectedSlot === slot.id
                            ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                            : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            🕐 {slot.time}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            📅 {slot.date}
                          </p>
                        </div>

                        <div className="text-right">
                          {slot.isAvailable ? (
                            <span className="text-sm font-medium text-green-700">
                              {slot.totalSlots - slot.bookedSlots} left
                            </span>
                          ) : (
                            <span className="text-sm font-medium text-red-500">
                              Full
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Crop & Vehicle */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-bold text-gray-900">
                Crop & Vehicle Details
              </h2>

              {/* Crop */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Crop
                </label>

                <select
                  value={crop}
                  onChange={(event) => setCrop(event.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select crop</option>

                  {CROPS.map((cropName) => (
                    <option key={cropName} value={cropName}>
                      {cropName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Quantity (quintal)
                </label>

                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  placeholder="Enter quantity"
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Vehicle */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Vehicle
                </label>

                <div className="space-y-2">
                  {MOCK_VEHICLES.map((vehicle) => (
                    <button
                      key={vehicle.id}
                      type="button"
                      onClick={() => setVehicleId(vehicle.id)}
                      className={`w-full p-3 rounded-lg border text-left flex items-center gap-3 transition-all ${
                        vehicleId === vehicle.id
                          ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <span className="text-xl">
                        {vehicle.vehicleType === 'tractor'
                          ? '🚜'
                          : '🚛'}
                      </span>

                      <div>
                        <p className="font-medium text-gray-900 capitalize">
                          {vehicle.vehicleType} —{' '}
                          {vehicle.vehicleNumber}
                        </p>

                        <p className="text-sm text-gray-500">
                          Capacity: {vehicle.capacity}{' '}
                          {vehicle.capacityUnit}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div>
              <h2 className="mb-4 font-bold text-gray-900">
                Booking Summary
              </h2>

              <div className="p-5 space-y-3 border border-green-200 rounded-lg bg-green-50">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Mandi:</span>
                  <span className="font-medium text-right text-gray-900">
                    {selectedMandiData?.name}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium text-gray-900">
                    {selectedSlotData?.date}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium text-gray-900">
                    {selectedSlotData?.time}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Crop:</span>
                  <span className="font-medium text-gray-900">
                    {crop}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium text-gray-900">
                    {quantity} quintal
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Vehicle:</span>
                  <span className="font-medium text-gray-900">
                    {selectedVehicle?.vehicleNumber}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => setStep(Math.max(0, step - 1))}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                step === 0
                  ? 'invisible'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Back
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={!canNext()}
                className="px-6 py-2 text-sm font-medium text-white transition-colors bg-green-700 rounded-lg hover:bg-green-800 disabled:bg-gray-300"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleBook}
                disabled={loading}
                className="px-6 py-2 text-sm font-medium text-white transition-colors bg-green-700 rounded-lg hover:bg-green-800 disabled:bg-green-400"
              >
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookSlotPage