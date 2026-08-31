export type UserRole = 'farmer' | 'mandiOwner' | 'superAdmin'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  avatar?: string
  createdAt: string
}

export interface Farmer extends User {
  role: 'farmer'
  aadhaarNumber?: string
  state: string
  district: string
  village: string
}

export interface MandiOwner extends User {
  role: 'mandiOwner'
  mandiName: string
  mandiLocation: string
  licenseNumber: string
}

export interface SuperAdmin extends User {
  role: 'superAdmin'
  department: string
  accessLevel: 'state' | 'district' | 'national'
}