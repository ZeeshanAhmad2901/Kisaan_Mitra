import apiClient from './client'

export interface Procurement {
  id: number
  booking_id: number
  farmer_id: number
  mandi_id: number
  crop_type: string
  booked_quantity: number
  weighed_quantity: number
  quality_grade: string
  procurement_amount: number
  procurement_status: string
  payment_status: string
  created_at: string
  updated_at: string
}

export interface CreateProcurementData {
  booking_id: number
  weighed_quantity: number
  quality_grade: string
  procurement_amount: number
}

export interface UpdateProcurementData {
  weighed_quantity?: number
  quality_grade?: string
  procurement_amount?: number
  procurement_status?: string
  payment_status?: string
}

export async function getBookingProcurement(
  bookingId: number,
): Promise<Procurement | null> {
  try {
    return await apiClient<Procurement>(
      `/procurements/booking/${bookingId}`,
    )
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'Procurement not found for this booking'
    ) {
      return null
    }

    throw error
  }
}

export async function createProcurement(
  data: CreateProcurementData,
): Promise<Procurement> {
  return apiClient<Procurement>(
    '/procurements/',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  )
}

export async function updateProcurement(
  procurementId: number,
  data: UpdateProcurementData,
): Promise<Procurement> {
  return apiClient<Procurement>(
    `/procurements/${procurementId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  )
}

export async function getMyProcurements(): Promise<Procurement[]> {
  return apiClient<Procurement[]>('/procurements/my')
}
