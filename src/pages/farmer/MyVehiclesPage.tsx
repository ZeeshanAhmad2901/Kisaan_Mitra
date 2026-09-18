import { useEffect, useState } from 'react'
import type { BackendVehicle } from '../../api/vehicleApi'
import { createVehicle, getMyVehicles } from '../../api/vehicleApi'
import { useAuth } from '../../store/authStore'

const VEHICLE_ICONS: Record<string, string> = {
  tractor: '🚜',
  truck: '🚛',
  tempo: '🚐',
  bolero: '🚙',
  pickup: '🛻',
  other: '🚗',
}

const VEHICLE_LABELS: Record<string, string> = {
  tractor: 'Tractor',
  truck: 'Truck',
  tempo: 'Tempo',
  bolero: 'Bolero',
  pickup: 'Pickup',
  other: 'Other Vehicle',
}

function MyVehiclesPage() {
  const { user } = useAuth()

  const [vehicles, setVehicles] = useState<BackendVehicle[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    vehicleType: 'tractor',
    vehicleNumber: '',
  })

  const loadVehicles = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getMyVehicles()
      setVehicles(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load your vehicles.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadVehicles()
  }, [])

  const handleAdd = async () => {
    const vehicleNumber = form.vehicleNumber.trim().toUpperCase()

    if (!vehicleNumber) {
      setError('Please enter a vehicle registration number.')
      return
    }

    if (vehicleNumber.length < 3) {
      setError('Vehicle registration number must be at least 3 characters.')
      return
    }

    if (!user?.id) {
      setError('User information is unavailable. Please log in again.')
      return
    }

    try {
      setSubmitting(true)
      setError('')
      setSuccess('')

      const newVehicle = await createVehicle({
        farmer_id: Number(user.id),
        driver_id: null,
        vehicle_number: vehicleNumber,
        vehicle_type: form.vehicleType,
      })

      setVehicles((currentVehicles) => [
        ...currentVehicles,
        newVehicle,
      ])

      setForm({
        vehicleType: 'tractor',
        vehicleNumber: '',
      })

      setShowForm(false)
      setSuccess('Vehicle registered successfully.')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to register the vehicle.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const activeVehicles = vehicles.filter((vehicle) => vehicle.is_active)

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-green-100">
        <div className="max-w-6xl px-4 py-6 mx-auto sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-semibold tracking-wide text-green-800 uppercase border border-green-200 rounded-full bg-green-50">
                <span>🚜</span>
                Farmer Transport Registry
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                My Vehicles
              </h1>

              <p className="max-w-2xl mt-2 text-sm leading-6 text-slate-500">
                Manage the vehicles you use to transport your produce to
                procurement centres.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowForm(!showForm)
                setError('')
                setSuccess('')
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white transition-all bg-green-700 shadow-sm rounded-xl hover:bg-green-800 hover:shadow-md"
            >
              <span className="text-lg">{showForm ? '×' : '+'}</span>
              {showForm ? 'Close Form' : 'Add Vehicle'}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        {/* Messages */}
        {error && (
          <div className="p-4 mb-6 text-sm font-medium text-red-800 border border-red-200 rounded-xl bg-red-50">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 mb-6 text-sm font-medium text-green-800 border border-green-200 rounded-xl bg-green-50">
            {success}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2">
          <div className="p-5 bg-white border shadow-sm rounded-2xl border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide uppercase text-slate-400">
                  Registered Vehicles
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {loading ? '—' : activeVehicles.length}
                </p>
              </div>

              <div className="flex items-center justify-center w-12 h-12 text-xl rounded-xl bg-green-50">
                🚜
              </div>
            </div>
          </div>

          <div className="p-5 bg-white border border-green-100 shadow-sm rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide text-green-600 uppercase">
                  Registration Status
                </p>

                <p className="mt-2 text-lg font-bold text-green-800">
                  {loading
                    ? 'Loading...'
                    : activeVehicles.length > 0
                      ? 'Active'
                      : 'No Vehicle'}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {activeVehicles.length > 0
                    ? 'Ready for mandi booking'
                    : 'Register a vehicle to continue'}
                </p>
              </div>

              <div className="flex items-center justify-center w-12 h-12 text-xl rounded-xl bg-green-50">
                ✓
              </div>
            </div>
          </div>
        </div>

        {/* Add Vehicle Form */}
        {showForm && (
          <section className="mb-8 overflow-hidden bg-white border border-green-200 shadow-sm rounded-2xl">
            <div className="px-6 py-5 border-b border-green-100 bg-green-50">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center text-xl bg-white w-11 h-11 rounded-xl">
                  ➕
                </div>

                <div>
                  <p className="text-xs font-semibold tracking-widest text-green-700 uppercase">
                    Vehicle Registration
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-slate-900">
                    Add New Vehicle
                  </h2>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Vehicle Type */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">
                    Vehicle Type
                  </label>

                  <select
                    value={form.vehicleType}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        vehicleType: event.target.value,
                      })
                    }
                    className="w-full px-4 py-3 text-sm bg-white border rounded-xl border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="tractor">🚜 Tractor</option>
                    <option value="truck">🚛 Truck</option>
                    <option value="tempo">🚐 Tempo</option>
                    <option value="bolero">🚙 Bolero</option>
                    <option value="pickup">🛻 Pickup</option>
                    <option value="other">🚗 Other</option>
                  </select>
                </div>

                {/* Vehicle Number */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">
                    Vehicle Registration Number
                  </label>

                  <input
                    type="text"
                    value={form.vehicleNumber}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        vehicleNumber: event.target.value.toUpperCase(),
                      })
                    }
                    placeholder="WB39KM1234"
                    maxLength={20}
                    className="w-full px-4 py-3 text-sm uppercase border rounded-xl border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-6 mt-6 border-t border-slate-100 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setError('')
                  }}
                  disabled={submitting}
                  className="px-5 py-3 text-sm font-semibold transition-colors border rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => void handleAdd()}
                  disabled={submitting}
                  className="px-6 py-3 text-sm font-semibold text-white transition-all bg-green-700 rounded-xl hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Registering...' : '✓ Register Vehicle'}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Vehicle list */}
        <section>
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-slate-400">
                Transport Registry
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Registered Vehicles
              </h2>
            </div>

            <span className="text-xs text-slate-400">
              {loading
                ? 'Loading...'
                : `${activeVehicles.length} vehicle${activeVehicles.length !== 1 ? 's' : ''}`}
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center bg-white border shadow-sm rounded-2xl border-slate-200">
              <div className="text-4xl animate-pulse">🚜</div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Loading vehicles...
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Fetching your registered vehicles.
              </p>
            </div>
          ) : activeVehicles.length === 0 ? (
            <div className="p-12 text-center bg-white border shadow-sm rounded-2xl border-slate-200">
              <div className="flex items-center justify-center w-20 h-20 mx-auto text-4xl rounded-2xl bg-green-50">
                🚜
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                No vehicles registered
              </h3>

              <p className="max-w-md mx-auto mt-2 text-sm leading-6 text-slate-500">
                Register a vehicle to use it while booking mandi procurement
                slots.
              </p>

              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-5 py-3 mt-5 text-sm font-semibold text-white bg-green-700 rounded-xl hover:bg-green-800"
              >
                + Add Your First Vehicle
              </button>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {activeVehicles.map((vehicle) => {
                const vehicleType = vehicle.vehicle_type.toLowerCase()

                return (
                  <div
                    key={vehicle.id}
                    className="relative overflow-hidden transition-all bg-white border shadow-sm rounded-2xl border-slate-200 hover:border-green-200 hover:shadow-md"
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center flex-shrink-0 w-16 h-16 text-3xl rounded-2xl bg-green-50">
                          {VEHICLE_ICONS[vehicleType] ?? '🚗'}
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-semibold tracking-widest text-green-700 uppercase">
                            Registered Vehicle
                          </p>

                          <h3 className="mt-1 text-xl font-bold text-slate-900">
                            {VEHICLE_LABELS[vehicleType] ??
                              vehicle.vehicle_type}
                          </h3>

                          <div className="inline-flex items-center gap-2 px-3 py-1.5 mt-2 font-mono text-sm font-bold tracking-wide bg-slate-100 rounded-lg text-slate-800">
                            {vehicle.vehicle_number}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-5 mt-5 border-t border-slate-100">
                        <div className="p-3 border rounded-xl border-slate-100 bg-slate-50">
                          <p className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                            Vehicle ID
                          </p>

                          <p className="mt-1 font-bold text-slate-900">
                            #{vehicle.id}
                          </p>

                          <p className="text-xs text-slate-500">
                            Registered in system
                          </p>
                        </div>

                        <div className="p-3 border rounded-xl border-slate-100 bg-slate-50">
                          <p className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                            Status
                          </p>

                          <p className="mt-1 font-bold text-green-700">
                            Active
                          </p>

                          <p className="text-xs text-slate-500">
                            Ready for booking
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-4 mt-4 text-xs text-green-700 border-t border-slate-100">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        Active registration
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Information panel */}
        <div className="p-5 mt-8 border border-green-100 rounded-2xl bg-green-50/70">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-white rounded-xl">
              💡
            </div>

            <div>
              <p className="text-sm font-bold text-green-900">
                Why register your vehicle?
              </p>

              <p className="mt-1 text-xs leading-5 text-green-800">
                Your registered vehicles can be selected directly while
                booking a mandi slot, making the procurement visit faster and
                reducing repeated data entry.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default MyVehiclesPage