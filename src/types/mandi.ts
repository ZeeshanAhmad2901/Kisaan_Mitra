export interface Mandi {
  id: string
  name: string
  location: string
  state: string
  district: string
  latitude: number
  longitude: number
  contactNumber: string
  operatingHours: string
}

export interface CropPrice {
  id: string
  cropName: string
  mandiId: string
  mandiName: string
  minPrice: number
  maxPrice: number
  modalPrice: number
  unit: string
  date: string
}

export interface Crop {
  id: string
  name: string
  nameHi: string
  category: string
  image?: string
}