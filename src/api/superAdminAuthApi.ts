import type { LoginResponse } from '../types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function superAdminLogin(emailOrPhone: string, _password: string): Promise<LoginResponse> {
  await delay(800)
  return {
    token: 'mock-jwt-token-super-admin-99999',
    user: { id: 'sa1', name: 'Admin User', email: 'admin@kisaanmitra.gov.in', phone: '9876543200', role: 'superAdmin', createdAt: '2024-06-01T10:00:00Z', department: 'Agriculture Ministry', accessLevel: 'national' },
  }
}