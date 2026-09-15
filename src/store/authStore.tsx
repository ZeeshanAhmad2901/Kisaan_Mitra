import { createContext, useContext, useState, type ReactNode } from 'react'
import { farmerLogin, farmerRegister } from '../api/farmerAuthApi'
import type { LoginRequest, RegisterRequest, User } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}

interface AuthContextType extends AuthState {
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const storedUser = localStorage.getItem('kisaan_mitra_user')
    const storedToken = localStorage.getItem('kisaan_mitra_token')

    return {
      user: storedUser ? JSON.parse(storedUser) : null,
      token: storedToken,
      isLoading: false,
      error: null,
    }
  })

  const login = async (data: LoginRequest) => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }))

    try {
      const response = await farmerLogin(
        data.emailOrPhone,
        data.password
      )

      localStorage.setItem(
        'kisaan_mitra_user',
        JSON.stringify(response.user)
      )

      localStorage.setItem(
        'kisaan_mitra_token',
        response.token
      )

      setState({
        user: response.user,
        token: response.token,
        isLoading: false,
        error: null,
      })
    } catch {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Invalid credentials. Please try again.',
      }))
    }
  }

  const register = async (data: RegisterRequest) => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }))

    try {
      const response = await farmerRegister(
        data.name,
        data.email,
        data.phone,
        data.password
      )

      localStorage.setItem(
        'kisaan_mitra_user',
        JSON.stringify(response.user)
      )

      localStorage.setItem(
        'kisaan_mitra_token',
        response.token
      )

      setState({
        user: response.user,
        token: response.token,
        isLoading: false,
        error: null,
      })
    } catch {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Registration failed. Please try again.',
      }))
    }
  }

  const logout = () => {
    localStorage.removeItem('kisaan_mitra_user')
    localStorage.removeItem('kisaan_mitra_token')

    setState({
      user: null,
      token: null,
      isLoading: false,
      error: null,
    })
  }

  const clearError = () => {
    setState((prev) => ({
      ...prev,
      error: null,
    }))
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

export { AuthProvider, useAuth }

