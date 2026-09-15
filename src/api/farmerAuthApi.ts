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
  password: string,
  role: string
): Promise<RegisterResponse> {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/users/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        password,
        role,
      }),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw error
  }

  const userData = await response.json()

  return {
    token: '',
    user: {
      id: String(userData.id),
      name: userData.name,
      email: userData.email ?? '',
      phone: userData.phone,
      role: userData.role as User['role'],
      createdAt: new Date().toISOString(),
    },
    message: 'Registration successful',
  }
}