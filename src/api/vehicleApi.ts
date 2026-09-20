import apiClient from './client'

export interface BackendVehicle {
  id: number
  farmer_id: number
  driver_id: number | null
  vehicle_number: string
  vehicle_type: string
  is_active: boolean
}

export interface VehicleCreateRequest {
  farmer_id: number
  driver_id?: number | null
  vehicle_number: string
  vehicle_type: string
}

export async function getMyVehicles(): Promise<BackendVehicle[]> {
  return apiClient<BackendVehicle[]>('/vehicles/my')
}

export async function getFarmerVehicles(
  farmerId: number,
): Promise<BackendVehicle[]> {
  return apiClient<BackendVehicle[]>(`/vehicles/farmer/${farmerId}`)
}

export async function createVehicle(
  vehicle: VehicleCreateRequest,
): Promise<BackendVehicle> {
  return apiClient<BackendVehicle>('/vehicles/', {
    method: 'POST',
    body: JSON.stringify(vehicle),
  })
}