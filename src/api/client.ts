import { apiConfig } from '../config/api'

interface FastApiError {
  detail?: string | Record<string, unknown> | unknown[]
  message?: string
}

async function apiClient<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${apiConfig.baseURL}${endpoint}`
  const token = localStorage.getItem('kisaan_mitra_token')

  const response = await fetch(url, {
    ...options,
    headers: {
      ...apiConfig.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })

  if (!response.ok) {
    let errorBody: FastApiError | null = null

    try {
      errorBody = await response.json()
    } catch {
      // Ignore invalid/empty error bodies.
    }

    const detail =
      errorBody?.detail ??
      errorBody?.message ??
      `Request failed with status ${response.status}`

    throw new Error(
      typeof detail === 'string' ? detail : JSON.stringify(detail),
    )
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export default apiClient
