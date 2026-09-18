import apiClient from './client'

export interface MandiBooking {
  id: number
  booking_code: string
  farmer_id: number
  farmer_name: string
  mandi_id: number
  mandi_name: string
  slot_id: number
  slot_date: string
  start_time: string
  end_time: string
  vehicle_id: number
  vehicle_number: string
  vehicle_type: string
  crop_type: string
  quantity: number
  booking_source: string
  status: string
  created_at: string
  updated_at: string
}

export async function getMandiBookings(
  mandiId: number,
): Promise<MandiBooking[]> {
  return apiClient<MandiBooking[]>(
    `/bookings/mandi/${mandiId}`,
  )
}

export async function getMyBookings(): Promise<MandiBooking[]> {
  return apiClient<MandiBooking[]>('/bookings/my')
}

export async function startBookingProcessing(
  bookingId: number,
): Promise<MandiBooking> {
  return apiClient<MandiBooking>(
    `/bookings/${bookingId}/start`,
    {
      method: 'PUT',
    },
  )
}

export async function completeBookingProcessing(
  bookingId: number,
): Promise<MandiBooking> {
  return apiClient<MandiBooking>(
    `/bookings/${bookingId}/complete`,
    {
      method: 'PUT',
    },
  )
}