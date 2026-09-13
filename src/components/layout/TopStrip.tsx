import { useTranslation } from 'react-i18next'

interface TopStripProps {
  isHomePage?: boolean
}

function TopStrip({}: TopStripProps) {
  const { t } = useTranslation()

  return (
    <div className="border-b border-orange-200 bg-orange-50">
      <div className="flex items-center justify-between h-24 px-6 mx-auto max-w-7xl">
        
        {/* Government of India */}
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 bg-orange-100 border-2 border-orange-300 rounded-full shadow-sm">
            <span className="text-3xl">🇮🇳</span>
          </div>

          <div className="flex flex-col">
            <span className="text-lg font-bold text-orange-800">
              {t('topStrip.governmentOfIndia')}
            </span>
            <span className="text-sm text-orange-600">
              {t('topStrip.ashokaStambh')}
            </span>
          </div>
        </div>

        {/* Prime Minister */}
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 overflow-hidden bg-gray-200 border-2 border-gray-300 rounded-full shadow-sm">
            <span className="text-3xl">👤</span>
          </div>

          <div className="flex flex-col text-right">
            <span className="text-lg font-bold text-gray-700">
              {t('topStrip.pmModi')}
            </span>
            <span className="text-sm text-gray-500">
              {t('topStrip.primeMinister')}
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}

export default TopStrip