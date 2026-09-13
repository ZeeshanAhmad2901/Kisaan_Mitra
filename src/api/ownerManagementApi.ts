import type { MandiOwner } from '../types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const MOCK_OWNERS: MandiOwner[] = [
  {
    id: 'mo1',
    name: 'R.K. Gupta',
    email: 'rk.gupta@example.com',
    phone: '9876543210',
    role: 'mandiOwner' as const,
    createdAt: '2025-01-10T10:00:00Z',
    mandiName: 'Azadpur Mandi',
    mandiLocation: 'Delhi',
    licenseNumber: 'DL-2025-M001',
  },
  {
    id: 'mo2',
    name: 'A.K. Verma',
    email: 'ak.verma@example.com',
    phone: '9876543211',
    role: 'mandiOwner' as const,
    createdAt: '2025-02-15T10:00:00Z',
    mandiName: 'Krishna Mandi',
    mandiLocation: 'Lucknow',
    licenseNumber: 'UP-2025-M002',
  },
  {
    id: 'mo3',
    name: 'S.S. Sharma',
    email: 'ss.sharma@example.com',
    phone: '9876543212',
    role: 'mandiOwner' as const,
    createdAt: '2025-03-20T10:00:00Z',
    mandiName: 'Jawaharlal Nehru Mandi',
    mandiLocation: 'Jaipur',
    licenseNumber: 'RJ-2025-M003',
  },
  {
    id: 'mo4',
    name: 'P.K. Tiwari',
    email: 'pk.tiwari@example.com',
    phone: '9876543213',
    role: 'mandiOwner' as const,
    createdAt: '2025-08-25T10:00:00Z',
    mandiName: 'Tiwari Mandi',
    mandiLocation: 'Bhopal',
    licenseNumber: 'MP-2025-M004',
  },
]

export async function getOwners(): Promise<MandiOwner[]> {
  await delay(600)
  return MOCK_OWNERS
}

export async function approveOwner(_id: string): Promise<void> {
  await delay(500)
}

export async function rejectOwner(_id: string, _reason: string): Promise<void> {
  await delay(500)
}

export async function suspendOwner(_id: string): Promise<void> {
  await delay(400)
}