export interface Vehicle {
  id: string
  farmerId: string
  vehicleType: 'tractor' | 'truck' | 'tempo' | 'bolero' | 'other'
  vehicleNumber: string
  capacity: number
  capacityUnit: 'quintal' | 'tonne'
  isDefault: boolean
}