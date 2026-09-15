import { useMemo, useState } from 'react'

type BookingStatus = 'confirmed' | 'completed' | 'cancelled'

type Booking = {
  id: string
  farmerName: string
  farmerPhone: string
  mandiName: string
  crop: string
  quantity: number
  vehicleNumber: string
  vehicleType: 'Tractor' | 'Truck' | 'Pickup'
  date: string
  time: string
  status: BookingStatus
  revenue: number
}

const BOOKINGS: Booking[] = [
  {
    id: 'KM-2025-00847',
    farmerName: 'Rajesh Kumar',
    farmerPhone: '98XXXXXX21',
    mandiName: 'Azadpur Mandi',
    crop: 'Wheat',
    quantity: 10,
    vehicleNumber: 'UP-32-AB-1234',
    vehicleType: 'Tractor',
    date: '2025-09-01',
    time: '6:00 AM - 8:00 AM',
    status: 'confirmed',
    revenue: 2500,
  },
  {
    id: 'KM-2025-00846',
    farmerName: 'Suresh Yadav',
    farmerPhone: '97XXXXXX42',
    mandiName: 'Azadpur Mandi',
    crop: 'Rice',
    quantity: 25,
    vehicleNumber: 'DL-01-CD-4521',
    vehicleType: 'Truck',
    date: '2025-09-01',
    time: '8:00 AM - 10:00 AM',
    status: 'completed',
    revenue: 6200,
  },
  {
    id: 'KM-2025-00845',
    farmerName: 'Amit Singh',
    farmerPhone: '96XXXXXX87',
    mandiName: 'Azadpur Mandi',
    crop: 'Maize',
    quantity: 15,
    vehicleNumber: 'UP-14-EF-7788',
    vehicleType: 'Pickup',
    date: '2025-09-02',
    time: '10:00 AM - 12:00 PM',
    status: 'completed',
    revenue: 3800,
  },
  {
    id: 'KM-2025-00844',
    farmerName: 'Vijay Sharma',
    farmerPhone: '95XXXXXX16',
    mandiName: 'Azadpur Mandi',
    crop: 'Wheat',
    quantity: 20,
    vehicleNumber: 'HR-26-GH-1190',
    vehicleType: 'Truck',
    date: '2025-09-02',
    time: '12:00 PM - 2:00 PM',
    status: 'confirmed',
    revenue: 5000,
  },
  {
    id: 'KM-2025-00843',
    farmerName: 'Mohan Lal',
    farmerPhone: '94XXXXXX55',
    mandiName: 'Azadpur Mandi',
    crop: 'Rice',
    quantity: 18,
    vehicleNumber: 'UP-16-JK-3344',
    vehicleType: 'Truck',
    date: '2025-09-03',
    time: '6:00 AM - 8:00 AM',
    status: 'completed',
    revenue: 4500,
  },
  {
    id: 'KM-2025-00842',
    farmerName: 'Ramesh Patel',
    farmerPhone: '93XXXXXX19',
    mandiName: 'Azadpur Mandi',
    crop: 'Wheat',
    quantity: 12,
    vehicleNumber: 'UP-32-LM-9087',
    vehicleType: 'Tractor',
    date: '2025-09-03',
    time: '8:00 AM - 10:00 AM',
    status: 'cancelled',
    revenue: 0,
  },
  {
    id: 'KM-2025-00841',
    farmerName: 'Anil Verma',
    farmerPhone: '92XXXXXX73',
    mandiName: 'Azadpur Mandi',
    crop: 'Vegetables',
    quantity: 8,
    vehicleNumber: 'DL-03-NP-2468',
    vehicleType: 'Pickup',
    date: '2025-09-04',
    time: '10:00 AM - 12:00 PM',
    status: 'confirmed',
    revenue: 2100,
  },
  {
    id: 'KM-2025-00840',
    farmerName: 'Deepak Gupta',
    farmerPhone: '91XXXXXX64',
    mandiName: 'Azadpur Mandi',
    crop: 'Maize',
    quantity: 22,
    vehicleNumber: 'UP-14-QR-5522',
    vehicleType: 'Truck',
    date: '2025-09-04',
    time: '2:00 PM - 4:00 PM',
    status: 'completed',
    revenue: 5400,
  },
]

const DAILY_BOOKINGS = [
  { day: 'Mon', bookings: 18 },
  { day: 'Tue', bookings: 24 },
  { day: 'Wed', bookings: 20 },
  { day: 'Thu', bookings: 29 },
  { day: 'Fri', bookings: 26 },
  { day: 'Sat', bookings: 32 },
  { day: 'Sun', bookings: 21 },
]

const DAILY_QUANTITY = [
  { day: 'Mon', quantity: 120 },
  { day: 'Tue', quantity: 165 },
  { day: 'Wed', quantity: 142 },
  { day: 'Thu', quantity: 190 },
  { day: 'Fri', quantity: 176 },
  { day: 'Sat', quantity: 218 },
  { day: 'Sun', quantity: 154 },
]

const CROP_BOOKINGS = [
  { crop: 'Wheat', value: 42 },
  { crop: 'Rice', value: 31 },
  { crop: 'Maize', value: 18 },
  { crop: 'Vegetables', value: 9 },
]

const VEHICLE_BOOKINGS = [
  { type: 'Truck', value: 45 },
  { type: 'Tractor', value: 35 },
  { type: 'Pickup', value: 20 },
]

const formatIndianCurrency = (amount: number) =>
  `₹${amount.toLocaleString('en-IN')}`

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

const getStatusStyles = (status: BookingStatus) => {
  switch (status) {
    case 'confirmed':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'completed':
      return 'bg-green-50 text-green-700 border-green-200'
    case 'cancelled':
      return 'bg-red-50 text-red-700 border-red-200'
  }
}

const getCropIcon = (crop: string) => {
  switch (crop) {
    case 'Wheat':
      return '🌾'
    case 'Rice':
      return '🌾'
    case 'Maize':
      return '🌽'
    case 'Vegetables':
      return '🥬'
    default:
      return '🌱'
  }
}

function SectionTitle({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
    </div>
  )
}

function LineChart({
  data,
  valueKey,
}: {
  data: { day: string; [key: string]: string | number }[]
  valueKey: string
}) {
  const width = 700
  const height = 250
  const paddingX = 45
  const paddingY = 25

  const values = data.map((item) => Number(item[valueKey]))
  const maxValue = Math.max(...values, 1)

  const points = data.map((item, index) => {
    const x =
      paddingX +
      (index / Math.max(data.length - 1, 1)) *
        (width - paddingX * 2)

    const y =
      height -
      paddingY -
      (Number(item[valueKey]) / maxValue) *
        (height - paddingY * 2)

    return { x, y }
  })

  const path = points
    .map((point, index) =>
      index === 0
        ? `M ${point.x} ${point.y}`
        : `L ${point.x} ${point.y}`,
    )
    .join(' ')

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full min-w-[620px] h-64"
      >
        {[0, 1, 2, 3, 4].map((step) => {
          const y =
            paddingY +
            (step / 4) * (height - paddingY * 2)

          return (
            <line
              key={step}
              x1={paddingX}
              x2={width - paddingX}
              y1={y}
              y2={y}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          )
        })}

        <path
          d={path}
          fill="none"
          stroke="#15803d"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((point, index) => (
          <g key={data[index].day}>
            <circle
              cx={point.x}
              cy={point.y}
              r="5"
              fill="#15803d"
            />
            <text
              x={point.x}
              y={height - 5}
              textAnchor="middle"
              fontSize="12"
              fill="#6b7280"
            >
              {data[index].day}
            </text>
            <text
              x={point.x}
              y={point.y - 12}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill="#374151"
            >
              {data[index][valueKey]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

function DonutChart({
  items,
}: {
  items: { label: string; value: number; color: string }[]
}) {
  const total = items.reduce((sum, item) => sum + item.value, 0)

  let current = 0

  const gradient = items
    .map((item) => {
      const start = (current / total) * 360
      current += item.value
      const end = (current / total) * 360
      return `${item.color} ${start}deg ${end}deg`
    })
    .join(', ')

  return (
    <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
      <div
        className="relative flex items-center justify-center rounded-full w-44 h-44"
        style={{
          background: `conic-gradient(${gradient})`,
        }}
      >
        <div className="flex flex-col items-center justify-center bg-white rounded-full w-28 h-28">
          <span className="text-2xl font-bold text-gray-900">
            {total}
          </span>
          <span className="text-xs text-gray-500">Bookings</span>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between gap-5 text-sm"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-700">{item.label}</span>
            </div>

            <span className="font-bold text-gray-900">
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function HorizontalBars({
  items,
}: {
  items: { label: string; value: number; icon?: string }[]
}) {
  const max = Math.max(...items.map((item) => item.value), 1)

  return (
    <div className="space-y-5">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {item.icon && (
                <span className="text-lg">{item.icon}</span>
              )}
              <span className="text-sm font-medium text-gray-700">
                {item.label}
              </span>
            </div>

            <span className="text-sm font-bold text-gray-900">
              {item.value}%
            </span>
          </div>

          <div className="w-full h-3 overflow-hidden bg-gray-100 rounded-full">
            <div
              className="h-full bg-green-600 rounded-full"
              style={{
                width: `${(item.value / max) * 100}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function BookingsPage() {
  const [statusFilter, setStatusFilter] = useState<
    'all' | BookingStatus
  >('all')
  const [search, setSearch] = useState('')

  const filteredBookings = useMemo(() => {
    return BOOKINGS.filter((booking) => {
      const matchesStatus =
        statusFilter === 'all' ||
        booking.status === statusFilter

      const searchText = search.toLowerCase()

      const matchesSearch =
        booking.id.toLowerCase().includes(searchText) ||
        booking.farmerName.toLowerCase().includes(searchText) ||
        booking.crop.toLowerCase().includes(searchText) ||
        booking.vehicleNumber.toLowerCase().includes(searchText)

      return matchesStatus && matchesSearch
    })
  }, [search, statusFilter])

  const totalBookings = BOOKINGS.length

  const confirmedBookings = BOOKINGS.filter(
    (booking) => booking.status === 'confirmed',
  ).length

  const completedBookings = BOOKINGS.filter(
    (booking) => booking.status === 'completed',
  ).length

  const cancelledBookings = BOOKINGS.filter(
    (booking) => booking.status === 'cancelled',
  ).length

  const completedRevenue = BOOKINGS.filter(
    (booking) => booking.status === 'completed',
  ).reduce((sum, booking) => sum + booking.revenue, 0)

  const pendingValue = BOOKINGS.filter(
    (booking) => booking.status === 'confirmed',
  ).reduce((sum, booking) => sum + booking.revenue, 0)

  const procurementVolume = BOOKINGS.filter(
    (booking) => booking.status !== 'cancelled',
  ).reduce((sum, booking) => sum + booking.quantity, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto space-y-8 max-w-7xl sm:px-6 lg:px-8">

        {/* Header */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 mb-3 text-xs font-bold text-green-700 border border-green-200 rounded-full bg-green-50">
                MANDI OPERATIONS
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Booking Management
              </h1>

              <p className="max-w-3xl mt-2 text-sm leading-6 text-gray-500">
                Monitor farmer bookings, procurement activity,
                vehicle movement and booking performance from one place.
              </p>
            </div>

            <div className="p-4 border border-green-200 rounded-xl bg-green-50">
              <p className="text-xs font-semibold tracking-wide text-green-700 uppercase">
                Centre Status
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="font-bold text-green-800">
                  Booking System Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <p className="text-sm font-medium text-gray-500">
              Total Bookings
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {totalBookings}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Registered booking records
            </p>
          </div>

          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <p className="text-sm font-medium text-gray-500">
              Confirmed
            </p>
            <p className="mt-2 text-3xl font-bold text-blue-700">
              {confirmedBookings}
            </p>
            <p className="mt-2 text-xs text-blue-600">
              Upcoming farmer visits
            </p>
          </div>

          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <p className="text-sm font-medium text-gray-500">
              Completed
            </p>
            <p className="mt-2 text-3xl font-bold text-green-700">
              {completedBookings}
            </p>
            <p className="mt-2 text-xs text-green-600">
              Successfully processed
            </p>
          </div>

          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <p className="text-sm font-medium text-gray-500">
              Cancelled
            </p>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {cancelledBookings}
            </p>
            <p className="mt-2 text-xs text-red-500">
              Cancelled booking requests
            </p>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <p className="text-sm font-medium text-gray-500">
              Completed Revenue
            </p>
            <p className="mt-2 text-2xl font-bold text-green-700">
              {formatIndianCurrency(completedRevenue)}
            </p>
          </div>

          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <p className="text-sm font-medium text-gray-500">
              Pending Booking Value
            </p>
            <p className="mt-2 text-2xl font-bold text-orange-600">
              {formatIndianCurrency(pendingValue)}
            </p>
          </div>

          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <p className="text-sm font-medium text-gray-500">
              Procurement Volume
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {procurementVolume} Q
            </p>
          </div>
        </div>

        {/* Analytics */}
        <div>
          <SectionTitle
            title="Booking Analytics"
            description="Operational trends and booking distribution for the mandi."
          />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

            {/* Daily Bookings */}
            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900">
                    Daily Booking Trend
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Number of bookings received during the week
                  </p>
                </div>

                <span className="px-2.5 py-1 text-xs font-semibold text-green-700 rounded-full bg-green-50">
                  Weekly
                </span>
              </div>

              <LineChart
                data={DAILY_BOOKINGS}
                valueKey="bookings"
              />
            </div>

            {/* Status Distribution */}
            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
              <div className="mb-5">
                <h3 className="font-bold text-gray-900">
                  Booking Status Distribution
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Current status breakdown of all bookings
                </p>
              </div>

              <DonutChart
                items={[
                  {
                    label: 'Confirmed',
                    value: 50,
                    color: '#2563eb',
                  },
                  {
                    label: 'Completed',
                    value: 38,
                    color: '#16a34a',
                  },
                  {
                    label: 'Cancelled',
                    value: 12,
                    color: '#dc2626',
                  },
                ]}
              />
            </div>

            {/* Crop Distribution */}
            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
              <div className="mb-5">
                <h3 className="font-bold text-gray-900">
                  Crop-wise Bookings
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Share of bookings by crop category
                </p>
              </div>

              <HorizontalBars
  items={CROP_BOOKINGS.map((item) => ({
    label: item.crop,
    value: item.value,
    icon: getCropIcon(item.crop),
  }))}
/>
            </div>

            {/* Vehicle Distribution */}
            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
              <div className="mb-5">
                <h3 className="font-bold text-gray-900">
                  Vehicle Type Distribution
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Incoming farmer vehicles by type
                </p>
              </div>

              <HorizontalBars
                items={VEHICLE_BOOKINGS.map((item) => ({
                  label: item.type,
                  value: item.value,
                  icon:
                    item.type === 'Truck'
                      ? '🚛'
                      : item.type === 'Tractor'
                        ? '🚜'
                        : '🛻',
                }))}
              />
            </div>
          </div>

          {/* Procurement Trend */}
          <div className="p-6 mt-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900">
                  Daily Procurement Quantity
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Total agricultural produce booked per day
                </p>
              </div>

              <div className="px-3 py-1 text-xs font-semibold text-orange-700 rounded-full bg-orange-50">
                Quintals
              </div>
            </div>

            <LineChart
              data={DAILY_QUANTITY}
              valueKey="quantity"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All Bookings' },
                { key: 'confirmed', label: 'Confirmed' },
                { key: 'completed', label: 'Completed' },
                { key: 'cancelled', label: 'Cancelled' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() =>
                    setStatusFilter(
                      tab.key as 'all' | BookingStatus,
                    )
                  }
                  className={`px-4 py-2 text-sm font-semibold rounded-lg border transition ${
                    statusFilter === tab.key
                      ? 'bg-green-700 text-white border-green-700'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="w-full xl:w-80">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ID, farmer, crop or vehicle..."
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-300 rounded-lg outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>
          </div>
        </div>

        {/* Booking Registry */}
        <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Booking Registry
                </h2>
                <p className="text-sm text-gray-500">
                  Detailed farmer booking records
                </p>
              </div>

              <div className="text-sm font-semibold text-gray-500">
                Showing {filteredBookings.length} records
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="text-xs tracking-wide text-left text-gray-500 uppercase bg-gray-50">
                  <th className="px-6 py-4">Booking</th>
                  <th className="px-6 py-4">Farmer</th>
                  <th className="px-6 py-4">Crop</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Vehicle</th>
                  <th className="px-6 py-4">Visit</th>
                  <th className="px-6 py-4">Revenue</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-green-700">
                        {booking.id}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {booking.mandiName}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">
                        {booking.farmerName}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {booking.farmerPhone}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {getCropIcon(booking.crop)}
                        </span>
                        <span className="font-medium text-gray-800">
                          {booking.crop}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-800">
                        {booking.quantity} Q
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">
                        {booking.vehicleNumber}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {booking.vehicleType}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">
                        {formatDate(booking.date)}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {booking.time}
                      </p>
                    </td>

                    <td className="px-6 py-4 font-bold text-gray-900">
                      {booking.revenue
                        ? formatIndianCurrency(booking.revenue)
                        : '—'}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1.5 text-xs font-bold capitalize border rounded-full ${getStatusStyles(
                          booking.status,
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {filteredBookings.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-16 text-center"
                    >
                      <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center mb-4 text-2xl bg-gray-100 rounded-full w-14 h-14">
                          🔎
                        </div>

                        <h3 className="font-bold text-gray-900">
                          No bookings found
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Try changing the search text or status filter.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Note */}
        <div className="flex items-start gap-3 p-5 border border-orange-200 rounded-2xl bg-orange-50">
          <span className="mt-0.5 text-lg">ℹ️</span>

          <div>
            <p className="text-sm font-bold text-orange-900">
              Operations note
            </p>

            <p className="mt-1 text-xs leading-5 text-orange-800">
              Analytics on this screen are currently illustrative
              operational data. Connect the booking API/database to
              make the charts update automatically from live mandi
              records.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingsPage