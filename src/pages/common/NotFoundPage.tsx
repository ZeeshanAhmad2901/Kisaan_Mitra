import { Link } from 'react-router'

function NotFoundPage() {
  return (
    <div className="px-4 py-24">
      <div className="max-w-md mx-auto text-center">
        <span className="text-8xl">🏛️</span>
        <h1 className="mt-6 text-6xl font-bold text-gray-900">404</h1>
        <p className="mt-3 text-lg text-gray-500">Page not found</p>
        <p className="mt-2 text-sm text-gray-400">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex justify-center gap-3 mt-8">
          <Link
            to="/"
            className="bg-green-700 hover:bg-green-800 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            Go Home
          </Link>
          <Link
            to="/contact"
            className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage