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
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: false,
    error: null,
  })

  const login = async (data: LoginRequest) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const response = await farmerLogin(data.emailOrPhone, data.password)
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
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const response = await farmerRegister(data.name, data.email, data.phone, data.password)
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
    setState({ user: null, token: null, isLoading: false, error: null })
  }

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }))
  }

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, clearError }}>
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

