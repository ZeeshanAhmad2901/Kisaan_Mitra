import { useEffect, useMemo, useState } from 'react'

import {
  createAssistedBooking,
  type AssistedBookingCreate,
} from '../../api/bookingApi'
import { getMandis, type BackendMandi } from '../../api/mandiApi'
import { getSlots, type BackendSlot } from '../../api/slotApi'
import {
  searchFarmers,
  type FarmerSearchResult,
} from '../../api/userApi'
import {
  getFarmerVehicles,
  type BackendVehicle,
} from '../../api/vehicleApi'
import { useAuth } from '../../store/authStore'

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number)

  const date = new Date()
  date.setHours(hours, minutes, 0, 0)

  return date.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function AssistedBookingPage() {
  const { user } = useAuth()

  const [mandis, setMandis] = useState<BackendMandi[]>([])
  const [slots, setSlots] = useState<BackendSlot[]>([])
  const [farmers, setFarmers] = useState<FarmerSearchResult[]>([])
  const [vehicles, setVehicles] = useState<BackendVehicle[]>([])

  const [search, setSearch] = useState('')
  const [selectedFarmer, setSelectedFarmer] =
    useState<FarmerSearchResult | null>(null)
  const [selectedVehicleId, setSelectedVehicleId] =
    useState<number | null>(null)
  const [selectedSlotId, setSelectedSlotId] =
    useState<number | null>(null)

  const [cropType, setCropType] = useState('')
  const [quantity, setQuantity] = useState('')

  const [loadingMandis, setLoadingMandis] = useState(true)
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [loadingVehicles, setLoadingVehicles] = useState(false)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const operatorMandi = useMemo(() => {
    if (!user?.mandiId) return null

    return (
      mandis.find((mandi) => mandi.id === user.mandiId) ?? null
    )
  }, [mandis, user?.mandiId])

  useEffect(() => {
    let cancelled = false

    const loadMandi = async () => {
      try {
        setLoadingMandis(true)
        setError('')

        const data = await getMandis()

console.log(
  'MANDIS FROM API:',
  JSON.stringify(data, null, 2),
)

if (cancelled) return

setMandis(data)

        if (!user?.mandiId) {
          setError(
            'No mandi is assigned to this operator account.',
          )
        }
      } catch (err) {
        if (cancelled) return

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load mandi information.',
        )
      } finally {
        if (!cancelled) {
          setLoadingMandis(false)
        }
      }
    }

    void loadMandi()

    return () => {
      cancelled = true
    }
  }, [user?.mandiId])

  useEffect(() => {
    let cancelled = false

    const loadSlots = async () => {
      if (!operatorMandi) {
        setSlots([])
        return
      }

      try {
        setLoadingSlots(true)

        const data = await getSlots(
          String(operatorMandi.id),
        )

        if (cancelled) return

        setSlots(
          data.filter(
            (slot) =>
              slot.is_active &&
              slot.booked_slots < slot.total_slots,
          ),
        )
      } catch (err) {
        if (cancelled) return

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load available slots.',
        )
      } finally {
        if (!cancelled) {
          setLoadingSlots(false)
        }
      }
    }

    void loadSlots()

    return () => {
      cancelled = true
    }
  }, [operatorMandi])

  useEffect(() => {
    let cancelled = false

    const loadFarmers = async () => {
      const query = search.trim()

      if (!query) {
        setFarmers([])
        return
      }

      try {
        setLoadingSearch(true)

        const data = await searchFarmers(query)

        if (cancelled) return

        setFarmers(data)
      } catch (err) {
        if (cancelled) return

        setFarmers([])
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to search farmers.',
        )
      } finally {
        if (!cancelled) {
          setLoadingSearch(false)
        }
      }
    }

    const timer = window.setTimeout(() => {
      void loadFarmers()
    }, 300)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [search])

  useEffect(() => {
    let cancelled = false

    const loadVehicles = async () => {
      if (!selectedFarmer) {
        setVehicles([])
        setSelectedVehicleId(null)
        return
      }

      try {
        setLoadingVehicles(true)

        const data = await getFarmerVehicles(
  selectedFarmer.id,
)

        if (cancelled) return

        setVehicles(data)
        setSelectedVehicleId(null)
      } catch (err) {
        if (cancelled) return

        setVehicles([])
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load farmer vehicles.',
        )
      } finally {
        if (!cancelled) {
          setLoadingVehicles(false)
        }
      }
    }

    void loadVehicles()

    return () => {
      cancelled = true
    }
  }, [selectedFarmer])

  const selectedSlot = useMemo(
    () =>
      slots.find((slot) => slot.id === selectedSlotId) ??
      null,
    [slots, selectedSlotId],
  )

  const selectedVehicle = useMemo(
    () =>
      vehicles.find(
        (vehicle) => vehicle.id === selectedVehicleId,
      ) ?? null,
    [vehicles, selectedVehicleId],
  )

  const canSubmit =
    !!operatorMandi &&
    !!selectedFarmer &&
    !!selectedVehicle &&
    !!selectedSlot &&
    cropType.trim().length >= 2 &&
    Number(quantity) > 0 &&
    !submitting

  const handleFarmerSelect = (
    farmer: FarmerSearchResult,
  ) => {
    setSelectedFarmer(farmer)
    setSearch(farmer.name)
    setFarmers([])
    setError('')
    setSuccess('')
  }

  const handleSubmit = async () => {
    if (!operatorMandi) {
      setError('No mandi is assigned to this operator.')
      return
    }

    if (!selectedFarmer) {
      setError('Please select a farmer.')
      return
    }

    if (!selectedVehicle) {
      setError('Please select a farmer vehicle.')
      return
    }

    if (!selectedSlot) {
      setError('Please select an available slot.')
      return
    }

    const numericQuantity = Number(quantity)

    if (!cropType.trim()) {
      setError('Please enter the crop type.')
      return
    }

    if (!Number.isFinite(numericQuantity) || numericQuantity <= 0) {
      setError('Please enter a valid quantity greater than zero.')
      return
    }

    try {
      setSubmitting(true)
      setError('')
      setSuccess('')

      const payload: AssistedBookingCreate = {
        farmer_id: selectedFarmer.id,
        mandi_id: operatorMandi.id,
        slot_id: selectedSlot.id,
        vehicle_id: selectedVehicle.id,
        crop_type: cropType.trim(),
        quantity: numericQuantity,
      }

      const booking = await createAssistedBooking(payload)

setSuccess(
  `Booking ${booking.booking_code} created successfully for ${selectedFarmer.name}.`,
)

setSelectedVehicleId(null)
setSelectedSlotId(null)
setCropType('')
setQuantity('')

await new Promise((resolve) => setTimeout(resolve, 800))

window.location.href = '/mandi-operator/queue-management'
      setSelectedVehicleId(null)
      setSelectedSlotId(null)
      setCropType('')
      setQuantity('')

      const refreshedSlots = await getSlots(
        String(operatorMandi.id),
      )

      setSlots(
        refreshedSlots.filter(
          (slot) =>
            slot.is_active &&
            slot.booked_slots < slot.total_slots,
        ),
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to create assisted booking.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto space-y-8 max-w-7xl sm:px-6 lg:px-8">

        {/* Header */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 mb-3 text-xs font-bold text-green-700 border border-green-200 rounded-full bg-green-50">
                OPERATOR HELP DESK
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Assisted Booking
              </h1>

              <p className="max-w-3xl mt-2 text-sm leading-6 text-gray-500">
                Create a booking on behalf of a farmer using live
                farmer, vehicle and mandi slot data.
              </p>

              {operatorMandi && (
                <p className="mt-2 text-sm font-semibold text-green-700">
                  {operatorMandi.name}
                  {operatorMandi.location
                    ? ` • ${operatorMandi.location}`
                    : ''}
                </p>
              )}
            </div>

            <div className="p-4 border border-green-200 rounded-xl bg-green-50">
              <p className="text-xs font-semibold tracking-wide text-green-700 uppercase">
                Centre Status
              </p>

              <div className="flex items-center gap-2 mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="font-bold text-green-800">
                  {loadingMandis
                    ? 'Loading centre'
                    : 'Operator Desk Active'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="p-4 text-sm font-medium text-red-800 border border-red-200 rounded-xl bg-red-50">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 text-sm font-medium text-green-800 border border-green-200 rounded-xl bg-green-50">
            {success}
          </div>
        )}

        {/* Step 1 */}
        <section className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex items-center justify-center flex-shrink-0 font-bold text-white bg-green-700 rounded-full w-9 h-9">
              1
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Find Farmer
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Search using the farmer's name, phone number or
                email.
              </p>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setSelectedFarmer(null)
                setVehicles([])
                setSelectedVehicleId(null)
              }}
              placeholder="Search farmer by name, phone or email..."
              className="w-full px-4 py-3 text-sm bg-white border border-gray-300 outline-none rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />

            {loadingSearch && (
              <p className="mt-2 text-xs text-gray-500">
                Searching farmers...
              </p>
            )}

            {farmers.length > 0 && (
              <div className="absolute z-20 w-full mt-2 overflow-hidden bg-white border border-gray-200 shadow-lg rounded-xl">
                {farmers.map((farmer) => (
                  <button
                    key={farmer.id}
                    type="button"
                    onClick={() => handleFarmerSelect(farmer)}
                    className="w-full px-4 py-3 text-left border-b border-gray-100 last:border-b-0 hover:bg-green-50"
                  >
                    <p className="font-semibold text-gray-900">
                      {farmer.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {farmer.phone}
                      {farmer.email
                        ? ` • ${farmer.email}`
                        : ''}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedFarmer && (
            <div className="p-4 mt-4 border border-green-200 rounded-xl bg-green-50">
              <p className="text-xs font-semibold tracking-wide text-green-700 uppercase">
                Selected Farmer
              </p>

              <div className="flex flex-col justify-between gap-3 mt-2 sm:flex-row sm:items-center">
                <div>
                  <p className="font-bold text-gray-900">
                    {selectedFarmer.name}
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    {selectedFarmer.phone}
                  </p>
                </div>

                <span className="inline-flex px-3 py-1.5 text-xs font-bold text-green-700 border border-green-200 rounded-full bg-white">
                  Farmer ID: {selectedFarmer.id}
                </span>
              </div>
            </div>
          )}
        </section>

        {/* Step 2 */}
        <section className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex items-center justify-center flex-shrink-0 font-bold text-white bg-green-700 rounded-full w-9 h-9">
              2
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Select Vehicle
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Choose an active vehicle registered to the selected
                farmer.
              </p>
            </div>
          </div>

          {!selectedFarmer ? (
            <div className="p-5 text-sm text-center text-gray-500 border border-gray-200 border-dashed rounded-xl">
              Select a farmer first.
            </div>
          ) : loadingVehicles ? (
            <div className="p-5 text-sm text-center text-gray-500 border border-gray-200 rounded-xl">
              Loading farmer vehicles...
            </div>
          ) : vehicles.length === 0 ? (
            <div className="p-5 text-sm text-center text-gray-500 border border-gray-200 rounded-xl">
              No active vehicles are registered for this farmer.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {vehicles.map((vehicle) => {
                const selected =
                  vehicle.id === selectedVehicleId

                return (
                  <button
                    key={vehicle.id}
                    type="button"
                    onClick={() =>
                      setSelectedVehicleId(vehicle.id)
                    }
                    className={`p-5 text-left border rounded-xl transition ${
                      selected
                        ? 'border-green-500 bg-green-50 ring-2 ring-green-100'
                        : 'border-gray-200 bg-white hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-gray-900">
                          {vehicle.vehicle_number}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {vehicle.vehicle_type}
                        </p>
                      </div>

                      {selected && (
                        <span className="text-xs font-bold text-green-700">
                          Selected
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </section>

        {/* Step 3 */}
        <section className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex items-center justify-center flex-shrink-0 font-bold text-white bg-green-700 rounded-full w-9 h-9">
              3
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Select Mandi Slot
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Only available slots from the operator's assigned
                mandi are shown.
              </p>
            </div>
          </div>

          {loadingSlots ? (
            <div className="p-5 text-sm text-center text-gray-500 border border-gray-200 rounded-xl">
              Loading available slots...
            </div>
          ) : slots.length === 0 ? (
            <div className="p-5 text-sm text-center text-gray-500 border border-gray-200 rounded-xl">
              No available slots are currently configured for this
              mandi.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {slots.map((slot) => {
                const selected = slot.id === selectedSlotId
                const remaining =
                  slot.total_slots - slot.booked_slots

                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`p-5 text-left border rounded-xl transition ${
                      selected
                        ? 'border-green-500 bg-green-50 ring-2 ring-green-100'
                        : 'border-gray-200 bg-white hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-gray-900">
                          {formatDate(slot.slot_date)}
                        </p>

                        <p className="mt-1 text-sm font-semibold text-green-700">
                          {formatTime(slot.start_time)} -{' '}
                          {formatTime(slot.end_time)}
                        </p>
                      </div>

                      {selected && (
                        <span className="text-xs font-bold text-green-700">
                          Selected
                        </span>
                      )}
                    </div>

                    <div className="pt-3 mt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Available capacity
                      </p>

                      <p className="mt-1 font-bold text-gray-900">
                        {remaining} / {slot.total_slots}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </section>

        {/* Step 4 */}
        <section className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex items-center justify-center flex-shrink-0 font-bold text-white bg-green-700 rounded-full w-9 h-9">
              4
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Produce Details
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Enter the produce details provided by the farmer.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="crop-type"
                className="block mb-2 text-sm font-semibold text-gray-700"
              >
                Crop Type
              </label>

              <input
                id="crop-type"
                type="text"
                value={cropType}
                onChange={(event) =>
                  setCropType(event.target.value)
                }
                placeholder="e.g. Wheat"
                className="w-full px-4 py-3 text-sm bg-white border border-gray-300 outline-none rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label
                htmlFor="quantity"
                className="block mb-2 text-sm font-semibold text-gray-700"
              >
                Quantity (Quintals)
              </label>

              <input
                id="quantity"
                type="number"
                min="0.01"
                step="0.01"
                value={quantity}
                onChange={(event) =>
                  setQuantity(event.target.value)
                }
                placeholder="e.g. 25"
                className="w-full px-4 py-3 text-sm bg-white border border-gray-300 outline-none rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>
          </div>
        </section>

        {/* Review */}
        <section className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex items-center justify-center flex-shrink-0 font-bold text-white bg-green-700 rounded-full w-9 h-9">
              
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Review & Create Booking
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Verify the information before creating the live
                assisted booking.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Farmer
              </p>

              <p className="mt-1 font-bold text-gray-900">
                {selectedFarmer?.name ?? 'Not selected'}
              </p>
            </div>

            <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Vehicle
              </p>

              <p className="mt-1 font-bold text-gray-900">
                {selectedVehicle
                  ? `${selectedVehicle.vehicle_number} • ${selectedVehicle.vehicle_type}`
                  : 'Not selected'}
              </p>
            </div>

            <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Mandi Slot
              </p>

              <p className="mt-1 font-bold text-gray-900">
                {selectedSlot
                  ? `${formatDate(
                      selectedSlot.slot_date,
                    )} • ${formatTime(
                      selectedSlot.start_time,
                    )} - ${formatTime(selectedSlot.end_time)}`
                  : 'Not selected'}
              </p>
            </div>

            <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Produce
              </p>

              <p className="mt-1 font-bold text-gray-900">
                {cropType.trim() || 'Not entered'}
                {quantity
                  ? ` • ${quantity} Q`
                  : ''}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => {
                setSelectedFarmer(null)
                setSearch('')
                setVehicles([])
                setSelectedVehicleId(null)
                setSelectedSlotId(null)
                setCropType('')
                setQuantity('')
                setError('')
                setSuccess('')
              }}
              disabled={submitting}
              className="px-5 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50"
            >
              Clear Form
            </button>

            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={!canSubmit}
              className="px-6 py-3 text-sm font-bold text-white bg-green-700 rounded-xl hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting
                ? 'Creating Booking...'
                : 'Create Assisted Booking'}
            </button>
          </div>
        </section>

        {/* Live Data Note */}
        <div className="flex items-start gap-3 p-5 border border-green-200 rounded-2xl bg-green-50">
          <span className="mt-0.5 text-lg">✓</span>

          <div>
            <p className="text-sm font-bold text-green-900">
              Live booking workflow
            </p>

            <p className="mt-1 text-xs leading-5 text-green-800">
              Farmer search, registered vehicles, mandi slots and
              booking creation are connected to the backend APIs.
              The booking is created with the assisted booking
              source and the backend performs the final capacity
              validation.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssistedBookingPage