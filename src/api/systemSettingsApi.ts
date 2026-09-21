import apiClient from './client'

export interface SystemSettings {
  id: number
  platform_name: string
  support_email: string
  support_phone: string

  max_bookings_per_farmer_per_day: number
  booking_window_days: number
  slot_duration_minutes: number

  enable_farmer_registration: boolean
  enable_mandi_owner_registration: boolean
  require_aadhaar_verification: boolean
  enable_sms_notifications: boolean
  maintenance_mode: boolean

  updated_at: string
}

export type SystemSettingsUpdate = Omit<SystemSettings, 'id' | 'updated_at'>

export async function getSystemSettings(): Promise<SystemSettings> {
  return apiClient<SystemSettings>('/system-settings/')
}

export async function updateSystemSettings(
  data: SystemSettingsUpdate,
): Promise<SystemSettings> {
  return apiClient<SystemSettings>('/system-settings/', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}