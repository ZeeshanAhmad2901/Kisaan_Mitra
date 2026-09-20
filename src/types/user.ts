export type UserRole = 'farmer' | 'mandiOwner' | 'mandiOperator' | 'superAdmin'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  mandiId?: number
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