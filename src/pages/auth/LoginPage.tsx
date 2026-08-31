import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../store/authStore'

function LoginPage() {
  const { t } = useTranslation()
  const { login, isLoading, error, clearError } = useAuth()
  const navigate = useNavigate()

  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const errors: Record<string, string> = {}
    if (!emailOrPhone.trim()) {
      errors.emailOrPhone = 'This field is required'
    }
    if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    clearError()
    if (!validate()) return
    await login({ emailOrPhone, password })
    navigate('/')
  }

  return (
    <section className="px-4 py-16">
      <div className="max-w-md mx-auto">
        <div className="p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-center text-gray-900">{t('login.title')}</h1>
          <p className="mt-1 text-sm text-center text-gray-500">
            {t('login.subtitle')}
          </p>

          {error && (
            <div className="p-3 mt-4 text-sm text-center text-red-700 border border-red-200 rounded-lg bg-red-50">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">{t('login.emailOrPhone')}</label>
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder={t('login.emailOrPhonePlaceholder')}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {fieldErrors.emailOrPhone && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.emailOrPhone}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">{t('login.password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('login.passwordPlaceholder')}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
              )}
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="rounded" />
                {t('login.rememberMe')}
              </label>
              <a href="#" className="text-green-700 hover:underline">{t('login.forgotPassword')}</a>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              {isLoading ? 'Logging in...' : t('login.loginButton')}
            </button>
          </form>
          <p className="mt-6 text-sm text-center text-gray-500">
            {t('login.noAccount')}{' '}
            <Link to="/register" className="font-medium text-green-700 hover:underline">{t('login.register')}</Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export default LoginPage