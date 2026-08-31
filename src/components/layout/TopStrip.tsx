import { useTranslation } from 'react-i18next'

interface TopStripProps {
  isHomePage: boolean
}

function TopStrip({ isHomePage }: TopStripProps) {
  const { t } = useTranslation()

  return (
    <div className="px-4 py-3 border-b border-orange-200 bg-orange-50">
      <div className="flex items-center justify-center h-24 mx-auto max-w-7xl">
        {isHomePage ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-20 h-20 bg-orange-100 border-4 border-orange-400 rounded-full shadow-md">
              <span className="text-5xl">🏛️</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-orange-800">
                {t('topStrip.ashokaStambh')}
              </span>
              <span className="text-sm text-orange-600">
                {t('topStrip.governmentOfIndia')}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-20 h-20 bg-gray-200 border-4 border-gray-300 rounded-full shadow-md">
              <span className="text-5xl">👤</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-700">
                {t('topStrip.pmModi')}
              </span>
              <span className="text-sm text-gray-500">
                {t('topStrip.primeMinister')}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TopStrip