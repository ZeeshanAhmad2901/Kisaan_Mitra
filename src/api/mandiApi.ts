import type { CropPrice, Mandi } from '../types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const MOCK_MANDIS: Mandi[] = [
  { id: '1', name: 'Azadpur Mandi', location: 'Delhi', state: 'Delhi', district: 'North Delhi', latitude: 28.6993, longitude: 77.1586, contactNumber: '011-27672345', operatingHours: '6:00 AM - 8:00 PM' },
  { id: '2', name: 'Krishna Mandi', location: 'Lucknow', state: 'Uttar Pradesh', district: 'Lucknow', latitude: 26.8467, longitude: 80.9462, contactNumber: '0522-2234567', operatingHours: '7:00 AM - 7:00 PM' },
  { id: '3', name: 'Jawaharlal Nehru Mandi', location: 'Jaipur', state: 'Rajasthan', district: 'Jaipur', latitude: 26.9124, longitude: 75.7873, contactNumber: '0141-2345678', operatingHours: '6:30 AM - 7:30 PM' },
]

const MOCK_PRICES: CropPrice[] = [
  { id: '1', cropName: 'Wheat', mandiId: '1', mandiName: 'Azadpur Mandi', minPrice: 2200, maxPrice: 2450, modalPrice: 2325, unit: 'per quintal', date: '2025-08-30' },
  { id: '2', cropName: 'Rice', mandiId: '1', mandiName: 'Azadpur Mandi', minPrice: 3100, maxPrice: 3400, modalPrice: 3250, unit: 'per quintal', date: '2025-08-30' },
  { id: '3', cropName: 'Wheat', mandiId: '2', mandiName: 'Krishna Mandi', minPrice: 2100, maxPrice: 2350, modalPrice: 2250, unit: 'per quintal', date: '2025-08-30' },
  { id: '4', cropName: 'Mustard', mandiId: '3', mandiName: 'Jawaharlal Nehru Mandi', minPrice: 4800, maxPrice: 5200, modalPrice: 5000, unit: 'per quintal', date: '2025-08-30' },
  { id: '5', cropName: 'Potato', mandiId: '1', mandiName: 'Azadpur Mandi', minPrice: 800, maxPrice: 1200, modalPrice: 1000, unit: 'per quintal', date: '2025-08-30' },
]

export async function getMandis(): Promise<Mandi[]> {
  await delay(600)
  return MOCK_MANDIS
}

export async function getCropPrices(mandiId?: string): Promise<CropPrice[]> {
  await delay(700)
  if (mandiId) {
    return MOCK_PRICES.filter((p) => p.mandiId === mandiId)
  }
  return MOCK_PRICES
}