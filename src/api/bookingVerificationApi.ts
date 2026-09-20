import apiClient from './client'

export interface BookingVerificationRequest {
  booking_code: string
}

export interface BookingVerificationResponse {
  valid: boolean
  message: string
  booking_id: number | null
  booking_code: string | null
  farmer_id: number | null
  farmer_name: string | null
  mandi_id: number | null
  crop_type: string | null
  quantity: number | null
  status: string | null
  arrival_status: string | null
arrival_verified_at: string | null
arrival_verified_by: number | null
}

export async function verifyBooking(
  bookingCode: string,
): Promise<BookingVerificationResponse> {
  return apiClient<BookingVerificationResponse>(
    '/bookings/verify',
    {
      method: 'POST',
      body: JSON.stringify({
        booking_code: bookingCode.trim(),
      }),
    },
  )
}

export async function confirmBookingArrival(
  bookingId: number,
): Promise<BookingVerificationResponse> {
  return apiClient<BookingVerificationResponse>(
    `/bookings/${bookingId}/arrival`,
    {
      method: 'POST',
    },
  )
}