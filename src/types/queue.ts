export interface QueueEntry {
  id: string
  farmerName: string
  crop: string
  quantity: string
  vehicleNumber: string
  arrivalTime: string
  estimatedWait: string
  status: 'waiting' | 'in-progress' | 'completed'
  position: number
}