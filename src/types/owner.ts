import type { MandiOwner } from './user'

export interface OwnerProfile extends MandiOwner {
  mandiId: number
  totalSlots: number
  availableSlots: number
}

export interface MandiStats {
  totalFarmers: number
  totalTransactions: number
  todayArrivals: number
  todayRevenue: number
}

export interface QueueEntry {
  id: string
  farmerId: string
  farmerName: string
  cropName: string
  quantity: number
  arrivalTime: string
  status: 'waiting' | 'in-progress' | 'completed'
}