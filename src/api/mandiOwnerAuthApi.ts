import type { LoginResponse, MandiOwner, RegisterResponse } from '../types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function mandiOwnerLogin(
  _emailOrPhone: string,
  _password: string
): Promise<LoginResponse> {
  await delay(800)

  const user: MandiOwner = {
    id: 'mo1',
    name: 'R.K. Gupta',
    email: 'rk.gupta@example.com',
    phone: '9876543210',
    role: 'mandiOwner',
    createdAt: '2025-01-10T10:00:00Z',
    mandiName: 'Azadpur Mandi',
    mandiLocation: 'Delhi',
    licenseNumber: 'DL-2025-M001',
  }

  return {
    token: 'mock-jwt-token-mandi-owner-12345',
    user,
  }
}

export async function mandiOwnerRegister(
  name: string,
  email: string,
  phone: string,
  _password: string,
  mandiName: string,
  licenseNumber: string
): Promise<RegisterResponse> {
  await delay(1000)

  const user: MandiOwner = {
    id: 'mo2',
    name,
    email,
    phone,
    role: 'mandiOwner',
    createdAt: new Date().toISOString(),
    mandiName,
    mandiLocation: 'Delhi',
    licenseNumber,
  }

  return {
    token: 'mock-jwt-token-mandi-owner-new-67890',
    user,
    message: 'Registration submitted for approval',
  }
}