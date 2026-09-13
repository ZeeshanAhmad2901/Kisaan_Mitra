import { useState } from 'react'
import type { Vehicle } from '../../types'

const MOCK_VEHICLES: Vehicle[] = [
  { id: '1', farmerId: '1', vehicleType: 'tractor', vehicleNumber: 'UP-32-AB-1234', capacity: 10, capacityUnit: 'quintal', isDefault: true },
  { id: '2', farmerId: '1', vehicleType: 'truck', vehicleNumber: 'UP-32-CD-5678', capacity: 50, capacityUnit: 'quintal', isDefault: false },
]

const VEHICLE_ICONS: Record<string, string> = {
  tractor: '🚜',
  truck: '🚛',
  tempo: '🚐',
  bolero: '🚙',
  other: '🚗',
}

function MyVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ vehicleType: 'tractor' as Vehicle['vehicleType'], vehicleNumber: '', capacity: '', capacityUnit: 'quintal' as Vehicle['capacityUnit'] })

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
    setForm({ vehicleType: 'tractor', vehicleNumber: '', capacity: '', capacityUnit: 'quintal' })
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    setVehicles(vehicles.filter((v) => v.id !== id))
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Vehicles</h1>
            <p className="mt-1 text-gray-500">Manage your transport vehicles</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 text-sm font-medium text-white transition-colors bg-green-700 rounded-lg hover:bg-green-800"
          >
            {showForm ? 'Cancel' : '+ Add Vehicle'}
          </button>
        </div>

        {/* Add Vehicle Form */}
        {showForm && (
          <div className="p-6 mt-6 bg-white border border-gray-200 rounded-lg">
            <h2 className="mb-4 font-bold text-gray-900">Add New Vehicle</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Vehicle Type</label>
                <select
                  value={form.vehicleType}
                  onChange={(e) => setForm({ ...form, vehicleType: e.target.value as Vehicle['vehicleType'] })}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="tractor">🚜 Tractor</option>
                  <option value="truck">🚛 Truck</option>
                  <option value="tempo">🚐 Tempo</option>
                  <option value="bolero">🚙 Bolero</option>
                  <option value="other">🚗 Other</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Vehicle Number</label>
                <input
                  type="text"
                  value={form.vehicleNumber}
                  onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })}
                  placeholder="UP-32-AB-1234"
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Capacity</label>
                <input
                  type="number"
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                  placeholder="10"
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Unit</label>
                <select
                  value={form.capacityUnit}
                  onChange={(e) => setForm({ ...form, capacityUnit: e.target.value as Vehicle['capacityUnit'] })}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="quintal">Quintal</option>
                  <option value="tonne">Tonne</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleAdd}
              className="px-6 py-2 mt-4 text-sm font-medium text-white transition-colors bg-green-700 rounded-lg hover:bg-green-800"
            >
              Add Vehicle
            </button>
          </div>
        )}

        {/* Vehicle Cards */}
        {vehicles.length === 0 ? (
          <div className="py-12 mt-8 text-center border border-gray-200 rounded-lg bg-gray-50">
            <span className="text-4xl">🚜</span>
            <p className="mt-3 text-gray-500">No vehicles added yet</p>
            <p className="mt-1 text-sm text-gray-400">Add a vehicle to start booking mandi slots</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="p-5 transition-shadow bg-white border border-gray-200 rounded-lg hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{VEHICLE_ICONS[vehicle.vehicleType]}</span>
                    <div>
                      <h3 className="font-bold text-gray-900 capitalize">{vehicle.vehicleType}</h3>
                      <p className="text-sm text-gray-500">{vehicle.vehicleNumber}</p>
                    </div>
                  </div>
                  {vehicle.isDefault && (
                    <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">Default</span>
                  )}
                </div>
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-600">Capacity: <span className="font-medium text-gray-900">{vehicle.capacity} {vehicle.capacityUnit}</span></p>
                  <button
                    onClick={() => handleDelete(vehicle.id)}
                    className="text-sm text-red-500 transition-colors hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyVehiclesPage