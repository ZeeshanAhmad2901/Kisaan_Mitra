import apiClient from './client'

export interface FarmerSearchResult {
  id: number
  name: string
  phone: string
  email: string | null
  role: string
  mandi_id: number | null
  is_active: boolean
}

export async function searchFarmers(
  search: string,
): Promise<FarmerSearchResult[]> {
  const query = search.trim()

  if (!query) {
    return []
  }

  return apiClient<FarmerSearchResult[]>(
    `/users/farmers/search?search=${encodeURIComponent(query)}`,
  )
}