import { useState } from 'react'
import type { Vehicle } from '../../types'

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

const VEHICLE_ICONS: Record<string, string> = {
  tractor: '🚜',
  truck: '🚛',
  tempo: '🚐',
  bolero: '🚙',
  other: '🚗',
}

const VEHICLE_LABELS: Record<string, string> = {
  tractor: 'Tractor',
  truck: 'Truck',
  tempo: 'Tempo',
  bolero: 'Bolero',
  other: 'Other Vehicle',
}

function MyVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES)
  const [showForm, setShowForm] = useState(false)

  const [form, setForm] = useState({
    vehicleType: 'tractor' as Vehicle['vehicleType'],
    vehicleNumber: '',
    capacity: '',
    capacityUnit: 'quintal' as Vehicle['capacityUnit'],
  })

  const handleAdd = () => {
    if (!form.vehicleNumber.trim() || !form.capacity) return

    const newVehicle: Vehicle = {
      id: String(vehicles.length + 1),
      farmerId: '1',
      vehicleType: form.vehicleType,
      vehicleNumber: form.vehicleNumber.toUpperCase(),
      capacity: Number(form.capacity),
      capacityUnit: form.capacityUnit,
      isDefault: vehicles.length === 0,
    }

    setVehicles([...vehicles, newVehicle])

    setForm({
      vehicleType: 'tractor',
      vehicleNumber: '',
      capacity: '',
      capacityUnit: 'quintal',
    })

    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    setVehicles(vehicles.filter((vehicle) => vehicle.id !== id))
  }

  const totalCapacity = vehicles.reduce(
    (total, vehicle) => total + vehicle.capacity,
    0,
  )

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
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white transition-all bg-green-700 shadow-sm rounded-xl hover:bg-green-800 hover:shadow-md"
            >
              <span className="text-lg">{showForm ? '×' : '+'}</span>
              {showForm ? 'Close Form' : 'Add Vehicle'}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-3">
          <div className="p-5 bg-white border shadow-sm rounded-2xl border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide uppercase text-slate-400">
                  Registered Vehicles
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {vehicles.length}
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
                  Default Vehicle
                </p>

                <p className="mt-2 text-lg font-bold text-green-800">
                  {vehicles.find((vehicle) => vehicle.isDefault)
                    ?.vehicleNumber ?? 'Not set'}
                </p>
              </div>

              <div className="flex items-center justify-center w-12 h-12 text-xl rounded-xl bg-green-50">
                ⭐
              </div>
            </div>
          </div>

          <div className="p-5 bg-white border border-blue-100 shadow-sm rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
                  Total Capacity
                </p>

                <p className="mt-2 text-3xl font-bold text-blue-800">
                  {totalCapacity}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Combined registered capacity
                </p>
              </div>

              <div className="flex items-center justify-center w-12 h-12 text-xl rounded-xl bg-blue-50">
                📦
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
                        vehicleType: event.target.value as Vehicle['vehicleType'],
                      })
                    }
                    className="w-full px-4 py-3 text-sm bg-white border rounded-xl border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="tractor">🚜 Tractor</option>
                    <option value="truck">🚛 Truck</option>
                    <option value="tempo">🚐 Tempo</option>
                    <option value="bolero">🚙 Bolero</option>
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
                        vehicleNumber: event.target.value,
                      })
                    }
                    placeholder="UP-32-AB-1234"
                    className="w-full px-4 py-3 text-sm uppercase border rounded-xl border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                {/* Capacity */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">
                    Loading Capacity
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={form.capacity}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        capacity: event.target.value,
                      })
                    }
                    placeholder="10"
                    className="w-full px-4 py-3 text-sm border rounded-xl border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">
                    Capacity Unit
                  </label>

                  <select
                    value={form.capacityUnit}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        capacityUnit:
                          event.target.value as Vehicle['capacityUnit'],
                      })
                    }
                    className="w-full px-4 py-3 text-sm bg-white border rounded-xl border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="quintal">Quintal</option>
                    <option value="tonne">Tonne</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-6 mt-6 border-t border-slate-100 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-3 text-sm font-semibold transition-colors border rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleAdd}
                  className="px-6 py-3 text-sm font-semibold text-white transition-all bg-green-700 rounded-xl hover:bg-green-800"
                >
                  ✓ Register Vehicle
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
              {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}
            </span>
          </div>

          {vehicles.length === 0 ? (
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
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="relative overflow-hidden transition-all bg-white border shadow-sm rounded-2xl border-slate-200 hover:border-green-200 hover:shadow-md"
                >
                  {vehicle.isDefault && (
                    <div className="absolute top-0 right-0 px-3 py-1.5 text-[10px] font-bold tracking-wide text-white uppercase bg-green-700 rounded-bl-xl">
                      Default Vehicle
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center flex-shrink-0 w-16 h-16 text-3xl rounded-2xl bg-green-50">
                        {VEHICLE_ICONS[vehicle.vehicleType] ?? '🚗'}
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-semibold tracking-widest text-green-700 uppercase">
                          Registered Vehicle
                        </p>

                        <h3 className="mt-1 text-xl font-bold text-slate-900">
                          {VEHICLE_LABELS[vehicle.vehicleType] ??
                            vehicle.vehicleType}
                        </h3>

                        <div className="inline-flex items-center gap-2 px-3 py-1.5 mt-2 font-mono text-sm font-bold tracking-wide bg-slate-100 rounded-lg text-slate-800">
                          {vehicle.vehicleNumber}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-5 mt-5 border-t border-slate-100">
                      <div className="p-3 border rounded-xl border-slate-100 bg-slate-50">
                        <p className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                          Capacity
                        </p>

                        <p className="mt-1 font-bold text-slate-900">
                          {vehicle.capacity}
                        </p>

                        <p className="text-xs capitalize text-slate-500">
                          {vehicle.capacityUnit}
                        </p>
                      </div>

                      <div className="p-3 border rounded-xl border-slate-100 bg-slate-50">
                        <p className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                          Booking Status
                        </p>

                        <p className="mt-1 font-bold text-green-700">
                          Available
                        </p>

                        <p className="text-xs text-slate-500">
                          Ready for booking
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-xs text-green-700">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        Active registration
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDelete(vehicle.id)}
                        className="px-3 py-2 text-xs font-semibold text-red-600 transition-colors border border-red-100 rounded-lg hover:bg-red-50"
                      >
                        Remove Vehicle
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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