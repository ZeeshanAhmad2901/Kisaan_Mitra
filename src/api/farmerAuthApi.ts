import type { LoginResponse, User } from '../types'

export async function farmerLogin(
  phone: string,
  password: string
): Promise<LoginResponse> {
  const formData = new URLSearchParams()

  formData.append('username', phone)
  formData.append('password', password)

  const loginResponse = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/users/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    }
  )

  if (!loginResponse.ok) {
    const error = await loginResponse.json()
    throw error
  }

  const loginData: {
    access_token: string
    token_type: string
  } = await loginResponse.json()

  const meResponse = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/users/me`,
    {
      headers: {
        Authorization: `Bearer ${loginData.access_token}`,
      },
    }
  )

  if (!meResponse.ok) {
    const error = await meResponse.json()
    throw error
  }

  const userData: {
    id: number
    name: string
    phone: string
    email: string | null
    role: string
    is_active: boolean
  } = await meResponse.json()

  const user: User = {
    id: String(userData.id),
    name: userData.name,
    email: userData.email ?? '',
    phone: userData.phone,
    role: userData.role as User['role'],
    createdAt: new Date().toISOString(),
  }

  return {
    token: loginData.access_token,
    user,
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
    user: {
      ...MOCK_FARMER,
      id: '2',
      name,
      email,
      phone,
    },
    message: 'Registration successful',
  }
}