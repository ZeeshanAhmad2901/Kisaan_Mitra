import type { Vehicle } from '../types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

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

export async function getVehicles(farmerId: string): Promise<Vehicle[]> {
  await delay(500)
  return MOCK_VEHICLES.filter((v) => v.farmerId === farmerId)
}

export async function addVehicle(
  vehicle: Omit<Vehicle, 'id' | 'farmerId' | 'isDefault'>
): Promise<Vehicle> {
  await delay(800)

  return {
    ...vehicle,
    id: String(Date.now()),
    farmerId: '1',
    isDefault: MOCK_VEHICLES.length === 0,
  }
}

export async function deleteVehicle(_id: string): Promise<void> {
  await delay(400)
}

export async function setDefaultVehicle(_id: string): Promise<void> {
  await delay(300)
}