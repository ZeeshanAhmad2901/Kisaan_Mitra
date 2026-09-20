import apiClient from './client'

export interface AuditLog {
  id: number
  actor_id: number | null
  actor_name: string | null
  actor_role: string | null
  action: string
  entity_type: string
  entity_id: string | null
  description: string
  details: Record<string, unknown> | null
  created_at: string
}

export interface AuditLogListResponse {
  items: AuditLog[]
  total: number
  page: number
  page_size: number
  pages: number
}

export interface AuditLogFilters {
  page?: number
  page_size?: number
  action?: string
  actor_role?: string
  entity_type?: string
}

export async function getAuditLogs(
  filters: AuditLogFilters = {},
): Promise<AuditLogListResponse> {
  const params = new URLSearchParams()

  params.set('page', String(filters.page ?? 1))
  params.set('page_size', String(filters.page_size ?? 20))

  if (filters.action?.trim()) {
    params.set('action', filters.action.trim())
  }

  if (filters.actor_role?.trim()) {
    params.set('actor_role', filters.actor_role.trim())
  }

  if (filters.entity_type?.trim()) {
    params.set('entity_type', filters.entity_type.trim())
  }

  return apiClient<AuditLogListResponse>(
    `/audit-logs/?${params.toString()}`,
  )
}