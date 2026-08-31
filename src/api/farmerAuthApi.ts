import type { LoginResponse, RegisterResponse } from '../types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const MOCK_FARMER = {
  id: '1',
  name: 'Rajesh Kumar',
  email: 'rajesh@example.com',
  phone: '9876543210',
  role: 'farmer' as const,
  state: 'Uttar Pradesh',
  district: 'Varanasi',
  village: 'Sarnath',
  createdAt: '2025-01-15T10:00:00Z',
}

export async function farmerLogin(
  emailOrPhone: string,
  _password: string
): Promise<LoginResponse> {
  await delay(800)
  return {
    token: 'mock-jwt-token-farmer-12345',
    user: MOCK_FARMER,
  }
}

export async function farmerRegister(
  name: string,
  email: string,
  phone: string,
  _password: string
): Promise<RegisterResponse> {
  await delay(1000)
  return {
    token: 'mock-jwt-token-farmer-new-67890',
    user: { ...MOCK_FARMER, id: '2', name, email, phone },
    message: 'Registration successful',
  }
}