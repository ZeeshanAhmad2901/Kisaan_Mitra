import apiClient from './client'

export interface NotificationItem {
  id: number
  user_id: number
  title: string
  message: string
  notification_type: string
  entity_type: string | null
  entity_id: string | null
  is_read: boolean
  created_at: string
}

export interface NotificationListResponse {
  items: NotificationItem[]
  total: number
  unread_count: number
  page: number
  page_size: number
  pages: number
}

export async function getNotifications(
  page = 1,
  pageSize = 20,
): Promise<NotificationListResponse> {
  return apiClient<NotificationListResponse>(
    `/notifications/?page=${page}&page_size=${pageSize}`,
  )
}

export async function markNotificationRead(
  notificationId: number,
): Promise<NotificationItem> {
  return apiClient<NotificationItem>(
    `/notifications/${notificationId}/read`,
    {
      method: 'PUT',
    },
  )
}

export async function markAllNotificationsRead(): Promise<{
  message: string
  updated: number
}> {
  return apiClient<{ message: string; updated: number }>(
    '/notifications/read-all',
    {
      method: 'PUT',
    },
  )
}
