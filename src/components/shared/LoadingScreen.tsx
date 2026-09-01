import { FullPageSpinner } from '../ui/Spinner'

function LoadingScreen({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <FullPageSpinner />
        <p className="mt-3 text-sm text-gray-500">{message}</p>
      </div>
    </div>
  )
}

export default LoadingScreen