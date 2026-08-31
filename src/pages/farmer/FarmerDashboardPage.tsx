import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getCropPrices } from '../../api/mandiApi'
import type { CropPrice } from '../../types'
import { formatDate, formatIndianCurrency } from '../../utils/formatters'

function FarmerDashboardPage() {
  const { t } = useTranslation()
  const [prices, setPrices] = useState<CropPrice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPrices() {
      const data = await getCropPrices()
      setPrices(data)
      setLoading(false)
    }
    fetchPrices()
  }, [])

  return (
    <div className="px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('home.title')} - Dashboard
        </h1>
        <p className="mt-1 text-gray-500">Welcome back, Rajesh</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-4">
          <div className="p-4 border border-green-200 rounded-lg bg-green-50">
            <p className="text-sm text-green-700">Today's Wheat Price</p>
            <p className="mt-1 text-2xl font-bold text-green-800">
              {formatIndianCurrency(2325)}
            </p>
            <p className="mt-1 text-xs text-green-600">per quintal</p>
          </div>
          <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
            <p className="text-sm text-orange-700">Active Bookings</p>
            <p className="mt-1 text-2xl font-bold text-orange-800">2</p>
            <p className="mt-1 text-xs text-orange-600">this week</p>
          </div>
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <p className="text-sm text-blue-700">Schemes Available</p>
            <p className="mt-1 text-2xl font-bold text-blue-800">12</p>
            <p className="mt-1 text-xs text-blue-600">for your crops</p>
          </div>
          <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
            <p className="text-sm text-purple-700">Weather</p>
            <p className="mt-1 text-2xl font-bold text-purple-800">32°C</p>
            <p className="mt-1 text-xs text-purple-600">Partly cloudy</p>
          </div>
        </div>

        {/* Crop Prices Table */}
        <div className="mt-8 overflow-hidden bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-bold text-gray-900">Latest Crop Prices</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading prices...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 font-medium text-left text-gray-700">Crop</th>
                    <th className="px-4 py-3 font-medium text-left text-gray-700">Mandi</th>
                    <th className="px-4 py-3 font-medium text-right text-gray-700">Min Price</th>
                    <th className="px-4 py-3 font-medium text-right text-gray-700">Max Price</th>
                    <th className="px-4 py-3 font-medium text-right text-gray-700">Modal Price</th>
                    <th className="px-4 py-3 font-medium text-left text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {prices.map((price) => (
                    <tr key={price.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{price.cropName}</td>
                      <td className="px-4 py-3 text-gray-600">{price.mandiName}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{formatIndianCurrency(price.minPrice)}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{formatIndianCurrency(price.maxPrice)}</td>
                      <td className="px-4 py-3 font-medium text-right text-green-700">{formatIndianCurrency(price.modalPrice)}</td>
                      <td className="px-4 py-3 text-gray-500">{formatDate(price.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FarmerDashboardPage