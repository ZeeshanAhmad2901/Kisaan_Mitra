import type { LoginResponse, MandiOwner, RegisterResponse } from '../types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function mandiOwnerLogin(emailOrPhone: string, _password: string): Promise<LoginResponse> {
  await delay(800)
  return {
    token: 'mock-jwt-token-mandi-owner-12345',
    user: {
      id: 'mo1', name: 'R.K. Gupta', email: 'rk.gupta@example.com', phone: '9876543210',
      role: 'mandiOwner' as const, createdAt: '2025-01-10T10:00:00Z',
      mandiName: 'Azadpur Mandi', mandiLocation: 'Delhi', licenseNumber: 'DL-2025-M001',
    } satisfies MandiOwner,
  }
}

export async function mandiOwnerRegister(name: string, email: string, phone: string, _password: string, mandiName: string, licenseNumber: string): Promise<RegisterResponse> {
  await delay(1000)
  return {
    token: 'mock-jwt-token-mandi-owner-new-67890',
    user: { id: 'mo2', name, email, phone, role: 'mandiOwner' as const, createdAt: new Date().toISOString() } as MandiOwner,
    message: 'Registration submitted for approval',
  }
}