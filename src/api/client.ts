import { apiConfig } from '../config/api'
import type { ApiError, ApiResponse } from '../types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  await delay(500)

  const url = `${apiConfig.baseURL}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      ...apiConfig.headers,
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const error: ApiError = await response.json()
    throw error
  }

  return response.json()
}

export default apiClient