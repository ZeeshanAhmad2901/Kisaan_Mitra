import type { CropPrice } from '../types'
import apiClient from './client'

export interface BackendMandi {
  id: number
  name: string
  location: string
  owner_id: number
  is_active: boolean
}

interface MandiListResponse {
  items: BackendMandi[]
  total: number
  page: number
  page_size: number
  pages: number
}

interface BackendCropPrice {
  id: number
  mandi_id: number
  mandi_name: string
  crop_name: string
  min_price: number
  max_price: number
  modal_price: number
  unit: string
  price_date: string
  created_at: string
  updated_at: string
}

export async function getMandis(): Promise<BackendMandi[]> {
  const response = await apiClient<MandiListResponse>(
    '/mandis/?page=1&page_size=100',
  )

  return response.items.filter((mandi) => mandi.is_active)
}

export async function getCropPrices(): Promise<CropPrice[]> {
  const response = await apiClient<BackendCropPrice[]>('/crop-prices/')

  return response.map((price) => ({
    id: String(price.id),
    cropName: price.crop_name,
    mandiId: String(price.mandi_id),
    mandiName: price.mandi_name,
    minPrice: price.min_price,
    maxPrice: price.max_price,
    modalPrice: price.modal_price,
    unit: price.unit,
    date: price.price_date,
  }))
}