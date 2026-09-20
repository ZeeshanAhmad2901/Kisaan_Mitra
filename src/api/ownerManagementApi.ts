import apiClient from './client'

export interface OwnerUser {
  id: number
  name: string
  phone: string
  email: string | null
  role: string
  mandi_id: number | null
  is_active: boolean
}

interface UserListResponse {
  items: OwnerUser[]
  total: number
  page: number
  page_size: number
  pages: number
}

export interface UpdateOwnerData {
  name?: string
  phone?: string
  email?: string | null
  role?: string
  mandi_id?: number | null
  is_active?: boolean
}

export async function getOwners(): Promise<OwnerUser[]> {
  const response = await apiClient<UserListResponse>(
    '/users/?page=1&page_size=100',
  )

  return response.items.filter(
    (user) => user.role === 'mandiOwner',
  )
}

export async function updateOwner(
  id: number,
  data: UpdateOwnerData,
): Promise<OwnerUser> {
  return apiClient<OwnerUser>(`/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}

export async function deactivateOwner(
  id: number,
): Promise<void> {
  await apiClient(`/users/${id}`, {
    method: 'DELETE',
  })
}