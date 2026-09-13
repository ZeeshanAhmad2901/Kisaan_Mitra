import { Link } from 'react-router'
import Button from '../ui/Button'

interface ErrorScreenProps {
  message?: string
  resetError?: () => void
}

function ErrorScreen({ message = 'Something went wrong', resetError }: ErrorScreenProps) {
  return (
    <div className="px-4 py-24">
      <div className="max-w-md mx-auto text-center">
        <span className="text-6xl">⚠️</span>
        <h1 className="mt-6 text-2xl font-bold text-gray-900">Oops!</h1>
        <p className="mt-3 text-gray-500">{message}</p>

        <div className="flex justify-center gap-3 mt-6">
          <Link to="/">
            <Button>Go Home</Button>
          </Link>

          {resetError && (
            <Button variant="secondary" onClick={resetError}>
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ErrorScreen