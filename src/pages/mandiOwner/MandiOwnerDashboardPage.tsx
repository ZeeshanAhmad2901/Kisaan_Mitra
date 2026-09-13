import { useEffect, useState } from 'react'
import { getCropPrices, getMandis } from '../../api/mandiApi'
import type { CropPrice, Mandi } from '../../types'
import { formatIndianCurrency } from '../../utils/formatters'

const MOCK_TODAY_STATS = {
  totalFarmers: 47,
  todayArrivals: 12,
  todayRevenue: 345000,
  activeSlots: 8,
  pendingInQueue: 5,
  avgWaitTime: '35 min',
  completedToday: 7,
}

const MOCK_TODAY_BOOKINGS = [
  {
    id: '1',
    farmerName: 'Rajesh Kumar',
    crop: 'Wheat',
    quantity: '10 quintal',
    vehicle: 'UP-32-AB-1234',
    time: '6:15 AM',
    status: 'completed',
  },
  {
    id: '2',
    farmerName: 'Suresh Yadav',
    crop: 'Rice',
    quantity: '25 quintal',
    vehicle: 'UP-32-EF-9012',
    time: '6:45 AM',
    status: 'in-progress',
  },
  {
    id: '3',
    farmerName: 'Amit Singh',
    crop: 'Potato',
    quantity: '50 quintal',
    vehicle: 'UP-32-GH-3456',
    time: '7:00 AM',
    status: 'in-queue',
  },
  {
    id: '4',
    farmerName: 'Vikram Pal',
    crop: 'Mustard',
    quantity: '15 quintal',
    vehicle: 'UP-32-IJ-7890',
    time: '7:30 AM',
    status: 'in-queue',
  },
  {
    id: '5',
    farmerName: 'Ramesh Kushwaha',
    crop: 'Onion',
    quantity: '20 quintal',
    vehicle: 'UP-32-KL-2345',
    time: '8:00 AM',
    status: 'scheduled',
  },
]

const STATUS_BADGE: Record<string, string> = {
  completed: 'bg-green-50 text-green-700',
  'in-progress': 'bg-blue-50 text-blue-700',
  'in-queue': 'bg-yellow-50 text-yellow-700',
  scheduled: 'bg-gray-100 text-gray-600',
}

function MandiOwnerDashboardPage() {
  const [mandis, setMandis] = useState<Mandi[]>([])
  const [prices, setPrices] = useState<CropPrice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [mandiData, priceData] = await Promise.all([
          getMandis(),
          getCropPrices(),
        ])

        setMandis(mandiData)
        setPrices(priceData)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const currentMandi = mandis[0]

  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Mandi Dashboard
            </h1>

            <p className="mt-1 text-gray-500">
              🏪 {currentMandi?.name || 'Azadpur Mandi'} —{' '}
              {currentMandi?.location || 'New Delhi'}
            </p>
          </div>

          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mt-8 md:grid-cols-4">
          <div className="p-4 border border-green-200 rounded-lg bg-green-50">
            <p className="text-sm text-green-700">Today's Arrivals</p>

            <p className="mt-1 text-3xl font-bold text-green-800">
              {MOCK_TODAY_STATS.todayArrivals}
            </p>

            <p className="mt-1 text-xs text-green-600">
              out of {MOCK_TODAY_STATS.totalFarmers} registered
            </p>
          </div>

          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <p className="text-sm text-blue-700">Today's Revenue</p>

            <p className="mt-1 text-3xl font-bold text-blue-800">
              {formatIndianCurrency(MOCK_TODAY_STATS.todayRevenue)}
            </p>

            <p className="mt-1 text-xs text-blue-600">
              {MOCK_TODAY_STATS.completedToday} transactions
            </p>
          </div>

          <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
            <p className="text-sm text-orange-700">In Queue</p>

            <p className="mt-1 text-3xl font-bold text-orange-800">
              {MOCK_TODAY_STATS.pendingInQueue}
            </p>

            <p className="mt-1 text-xs text-orange-600">
              avg wait: {MOCK_TODAY_STATS.avgWaitTime}
            </p>
          </div>

          <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
            <p className="text-sm text-purple-700">Active Slots</p>

            <p className="mt-1 text-3xl font-bold text-purple-800">
              {MOCK_TODAY_STATS.activeSlots}
            </p>

            <p className="mt-1 text-xs text-purple-600">
              of 20 total
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-8 lg:grid-cols-3">
          {/* Today's Bookings Table */}
          <div className="overflow-hidden bg-white border border-gray-200 rounded-lg lg:col-span-2">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="font-bold text-gray-900">
                Today's Bookings
              </h2>

              <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                {MOCK_TODAY_BOOKINGS.length} total
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 font-medium text-left text-gray-700">
                      Farmer
                    </th>
                    <th className="px-4 py-3 font-medium text-left text-gray-700">
                      Crop
                    </th>
                    <th className="px-4 py-3 font-medium text-left text-gray-700">
                      Qty
                    </th>
                    <th className="px-4 py-3 font-medium text-left text-gray-700">
                      Vehicle
                    </th>
                    <th className="px-4 py-3 font-medium text-left text-gray-700">
                      Time
                    </th>
                    <th className="px-4 py-3 font-medium text-left text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {MOCK_TODAY_BOOKINGS.map((booking) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {booking.farmerName}
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        {booking.crop}
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        {booking.quantity}
                      </td>

                      <td className="px-4 py-3 text-xs text-gray-500">
                        {booking.vehicle}
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        {booking.time}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${
                            STATUS_BADGE[booking.status]
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Today's Prices */}
          <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-bold text-gray-900">
                Today's Prices
              </h2>
            </div>

            {loading ? (
              <div className="p-6 text-sm text-center text-gray-500">
                Loading...
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {prices.slice(0, 6).map((price) => (
                  <div
                    key={price.id}
                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {price.cropName}
                      </p>

                      <p className="text-xs text-gray-500">
                        {price.mandiName}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-green-700">
                        {formatIndianCurrency(price.modalPrice)}
                      </p>

                      <p className="text-xs text-gray-400">
                        {price.unit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MandiOwnerDashboardPage