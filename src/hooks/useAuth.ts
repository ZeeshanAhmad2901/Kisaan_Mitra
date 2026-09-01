import { useAuth as useAuthContext } from '../store/authStore'

function useAuth() {
  const context = useAuthContext()
  return {
    user: context.user,
    token: context.token,
    isLoading: context.isLoading,
    error: context.error,
    isAuthenticated: !!context.user,
    isFarmer: context.user?.role === 'farmer',
    isMandiOwner: context.user?.role === 'mandiOwner',
    isSuperAdmin: context.user?.role === 'superAdmin',
    login: context.login,
    register: context.register,
    logout: context.logout,
    clearError: context.clearError,
  }
}

export default useAuth