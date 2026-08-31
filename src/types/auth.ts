import type { User } from './user'

export interface LoginRequest {
  emailOrPhone: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface RegisterRequest {
  name: string
  email: string
  phone: string
  password: string
  role: 'farmer' | 'mandiOwner'
}

export interface RegisterResponse {
  token: string
  user: User
  message: string
}