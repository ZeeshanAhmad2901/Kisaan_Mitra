import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useAuth } from '../../store/authStore'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute