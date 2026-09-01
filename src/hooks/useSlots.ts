import { useEffect, useState } from 'react'
import type { Slot } from '../types'

const MOCK_SLOTS: Slot[] = [
  { id: '1', mandiId: '1', mandiName: 'Azadpur Mandi', date: '2025-09-01', time: '6:00 AM - 8:00 AM', totalSlots: 20, bookedSlots: 14, isAvailable: true },
  { id: '2', mandiId: '1', mandiName: 'Azadpur Mandi', date: '2025-09-01', time: '8:00 AM - 10:00 AM', totalSlots: 20, bookedSlots: 20, isAvailable: false },
  { id: '3', mandiId: '1', mandiName: 'Azadpur Mandi', date: '2025-09-02', time: '6:00 AM - 8:00 AM', totalSlots: 20, bookedSlots: 8, isAvailable: true },
  { id: '4', mandiId: '2', mandiName: 'Krishna Mandi', date: '2025-09-01', time: '7:00 AM - 9:00 AM', totalSlots: 15, bookedSlots: 10, isAvailable: true },
  { id: '5', mandiId: '3', mandiName: 'Jawaharlal Nehru Mandi', date: '2025-09-01', time: '6:30 AM - 8:30 AM', totalSlots: 25, bookedSlots: 25, isAvailable: false },
]

function useSlots(mandiId?: string) {
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = mandiId ? MOCK_SLOTS.filter((s) => s.mandiId === mandiId) : MOCK_SLOTS
      setSlots(filtered)
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [mandiId])

  const availableSlots = slots.filter((s) => s.isAvailable)

  return { slots, availableSlots, loading }
}

export default useSlots