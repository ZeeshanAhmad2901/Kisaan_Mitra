import type { Slot } from '../types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const MOCK_SLOTS: Slot[] = [
  { id: '1', mandiId: '1', mandiName: 'Azadpur Mandi', date: '2025-09-01', time: '6:00 AM - 8:00 AM', totalSlots: 20, bookedSlots: 14, isAvailable: true },
  { id: '2', mandiId: '1', mandiName: 'Azadpur Mandi', date: '2025-09-01', time: '8:00 AM - 10:00 AM', totalSlots: 20, bookedSlots: 20, isAvailable: false },
  { id: '3', mandiId: '1', mandiName: 'Azadpur Mandi', date: '2025-09-02', time: '6:00 AM - 8:00 AM', totalSlots: 20, bookedSlots: 8, isAvailable: true },
  { id: '4', mandiId: '2', mandiName: 'Krishna Mandi', date: '2025-09-01', time: '7:00 AM - 9:00 AM', totalSlots: 15, bookedSlots: 10, isAvailable: true },
  { id: '5', mandiId: '3', mandiName: 'Jawaharlal Nehru Mandi', date: '2025-09-01', time: '6:30 AM - 8:30 AM', totalSlots: 25, bookedSlots: 25, isAvailable: false },
  { id: '6', mandiId: '1', mandiName: 'Azadpur Mandi', date: '2025-09-02', time: '8:00 AM - 10:00 AM', totalSlots: 20, bookedSlots: 5, isAvailable: true },
  { id: '7', mandiId: '2', mandiName: 'Krishna Mandi', date: '2025-09-02', time: '7:00 AM - 9:00 AM', totalSlots: 15, bookedSlots: 12, isAvailable: true },
]

export async function getSlots(mandiId?: string, date?: string): Promise<Slot[]> {
  await delay(600)

  let filtered = MOCK_SLOTS

  if (mandiId) {
    filtered = filtered.filter((s) => s.mandiId === mandiId)
  }

  if (date) {
    filtered = filtered.filter((s) => s.date === date)
  }

  return filtered
}

export async function bookSlot(
  _slotId: string,
  _vehicleId: string,
  _crop: string,
  _quantity: string
): Promise<{ bookingId: string }> {
  await delay(1000)

  return {
    bookingId: `KM-2025-${String(Math.floor(Math.random() * 90000) + 10000)}`,
  }
}

export async function cancelBooking(_bookingId: string): Promise<void> {
  await delay(500)
}