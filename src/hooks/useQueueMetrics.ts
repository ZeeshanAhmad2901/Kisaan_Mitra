import { useEffect, useState } from 'react'

interface QueueMetrics {
  inQueue: number
  inProgress: number
  completedToday: number
  avgWaitTime: string
  totalToday: number
}

const MOCK_METRICS: QueueMetrics = {
  inQueue: 5,
  inProgress: 1,
  completedToday: 7,
  avgWaitTime: '35 min',
  totalToday: 13,
}

function useQueueMetrics() {
  const [metrics, setMetrics] = useState<QueueMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMetrics(MOCK_METRICS)
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  return { metrics, loading }
}

export default useQueueMetrics