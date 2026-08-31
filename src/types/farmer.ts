import type { Farmer } from './user'

export interface FarmerProfile extends Farmer {
  crops: string[]
  totalArea: number
  areaUnit: 'acres' | 'hectares' | 'bigha'
}

export interface Scheme {
  id: string
  title: string
  titleHi: string
  description: string
  descriptionHi: string
  category: string
  eligibility: string
  benefit: string
  applyLink?: string
  isActive: boolean
}

export interface WeatherInfo {
  location: string
  temperature: number
  humidity: number
  description: string
  descriptionHi: string
  icon: string
  forecast: DailyForecast[]
}

export interface DailyForecast {
  date: string
  temperature: number
  description: string
  descriptionHi: string
  icon: string
}