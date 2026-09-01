import { useEffect, useState } from 'react'
import type { Vehicle } from '../types'

const MOCK_VEHICLES: Vehicle[] = [
  { id: '1', farmerId: '1', vehicleType: 'tractor', vehicleNumber: 'UP-32-AB-1234', capacity: 10, capacityUnit: 'quintal', isDefault: true },
  { id: '2', farmerId: '1', vehicleType: 'truck', vehicleNumber: 'UP-32-CD-5678', capacity: 50, capacityUnit: 'quintal', isDefault: false },
]

function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVehicles(MOCK_VEHICLES)
      setLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  const addVehicle = (vehicle: Omit<Vehicle, 'id' | 'farmerId' | 'isDefault'>) => {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: String(Date.now()),
      farmerId: '1',
      isDefault: vehicles.length === 0,
    }
    setVehicles((prev) => [...prev, newVehicle])
  }

  const removeVehicle = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id))
  }

  const setDefault = (id: string) => {
    setVehicles((prev) => prev.map((v) => ({ ...v, isDefault: v.id === id })))
  }

  return { vehicles, loading, addVehicle, removeVehicle, setDefault }
}

export default useVehicles