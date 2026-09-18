import apiClient from './client'

export interface BackendSlot {
  id: number
  mandi_id: number
  mandi_name: string
  slot_date: string
  start_time: string
  end_time: string
  total_slots: number
  booked_slots: number
  is_active: boolean
  is_available: boolean
  created_at: string
}

export interface CreateSlotPayload {
  mandi_id: number
  slot_date: string
  start_time: string
  end_time: string
  total_slots: number
}

export async function getSlots(
  mandiId?: string,
  date?: string,
): Promise<BackendSlot[]> {
  const params = new URLSearchParams()

  if (mandiId) {
    params.set('mandi_id', mandiId)
  }

  if (date) {
    params.set('slot_date', date)
  }

  const query = params.toString()

  return apiClient<BackendSlot[]>(
    `/slots/${query ? `?${query}` : ''}`,
  )
}

export async function createSlot(
  payload: CreateSlotPayload,
): Promise<BackendSlot> {
  return apiClient<BackendSlot>('/slots/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function deactivateSlot(
  slotId: number,
): Promise<{ message: string }> {
  return apiClient<{ message: string }>(
    `/slots/${slotId}`,
    {
      method: 'DELETE',
    },
  )
}