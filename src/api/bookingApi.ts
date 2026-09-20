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

export interface AssistedBookingCreate {
  farmer_id: number
  mandi_id: number
  slot_id: number
  vehicle_id: number
  crop_type: string
  quantity: number
}

export async function createAssistedBooking(
  bookingData: AssistedBookingCreate,
): Promise<MandiBooking> {
  return apiClient<MandiBooking>(
    '/bookings/assisted',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    },
  )
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