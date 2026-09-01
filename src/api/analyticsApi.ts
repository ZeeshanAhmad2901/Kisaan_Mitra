const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const MOCK_WEEKLY = [
  { day: 'Mon', revenue: 185000, transactions: 8, farmers: 12 },
  { day: 'Tue', revenue: 310000, transactions: 15, farmers: 18 },
  { day: 'Wed', revenue: 245000, transactions: 10, farmers: 11 },
  { day: 'Thu', revenue: 420000, transactions: 18, farmers: 15 },
  { day: 'Fri', revenue: 290000, transactions: 14, farmers: 11 },
  { day: 'Sat', revenue: 510000, transactions: 22, farmers: 18 },
  { day: 'Sun', revenue: 120000, transactions: 5, farmers: 3 },
]

const MOCK_MONTHLY = [
  { month: 'Jan', revenue: 8500000 },
  { month: 'Feb', revenue: 9200000 },
  { month: 'Mar', revenue: 11000000 },
  { month: 'Apr', revenue: 12500000 },
  { month: 'May', revenue: 14000000 },
  { month: 'Jun', revenue: 13200000 },
  { month: 'Jul', revenue: 10500000 },
  { month: 'Aug', revenue: 12450000 },
]

const MOCK_STATE_STATS = [
  { state: 'Uttar Pradesh', revenue: 25000000, farmers: 5200, mandis: 32 },
  { state: 'Rajasthan', revenue: 19000000, farmers: 4100, mandis: 28 },
  { state: 'Madhya Pradesh', revenue: 17000000, farmers: 3800, mandis: 24 },
  { state: 'Punjab', revenue: 15000000, farmers: 3200, mandis: 22 },
  { state: 'Haryana', revenue: 12000000, farmers: 2800, mandis: 18 },
  { state: 'Maharashtra', revenue: 10000000, farmers: 2400, mandis: 15 },
]

export async function getWeeklyRevenue() {
  await delay(500)
  return MOCK_WEEKLY
}

export async function getMonthlyRevenue() {
  await delay(500)
  return MOCK_MONTHLY
}

export async function getStateStats() {
  await delay(500)
  return MOCK_STATE_STATS
}

export async function getPlatformSummary() {
  await delay(600)
  return { totalMandis: 156, totalFarmers: 24500, totalMandiOwners: 312, totalTransactions: 8940, totalRevenue: 124500000, statesCovered: 18 }
}