interface TopStripProps {
  isHomePage: boolean
}

function TopStrip({ isHomePage }: TopStripProps) {
  return (
    <div className="px-4 py-3 border-b border-orange-200 bg-orange-50">
      <div className="flex items-center justify-center h-24 mx-auto max-w-7xl">
        {isHomePage ? (
          // Ashoka Stambh placeholder - only on home page
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-20 h-20 bg-orange-100 border-4 border-orange-400 rounded-full shadow-md">
              <span className="text-5xl">🏛️</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-orange-800">
                Government of India
              </span>
              <span className="text-sm text-orange-600">
              </span>
            </div>
          </div>
        ) : (
          // PM Modi placeholder - on all other pages
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-20 h-20 bg-gray-200 border-4 border-gray-300 rounded-full shadow-md">
              <span className="text-5xl">👤</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-700">
                PM Modi
              </span>
              <span className="text-sm text-gray-500">
                Prime Minister of India
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TopStrip