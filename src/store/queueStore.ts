import { create } from 'zustand'

export interface QueueEntry {
  id: string
  farmerName: string
  crop: string
  quantity: string
  vehicleNumber: string
  arrivalTime: string
  status: 'waiting' | 'in-progress' | 'completed'
  estimatedWait: string
  position: number
}

interface QueueState {
  entries: QueueEntry[]
  setEntries: (entries: QueueEntry[]) => void
  startProcessing: (id: string) => void
  markCompleted: (id: string) => void
  removeEntry: (id: string) => void
  reorderEntries: (entries: QueueEntry[]) => void
}

const useQueueStore = create<QueueState>((set) => ({
  entries: [],
  setEntries: (entries) => set({ entries }),
  startProcessing: (id) =>
    set((state) => ({
      entries: state.entries.map((e) => (e.id === id ? { ...e, status: 'in-progress' } : e)),
    })),
  markCompleted: (id) =>
    set((state) => ({
      entries: state.entries.map((e) => (e.id === id ? { ...e, status: 'completed' } : e)),
    })),
  removeEntry: (id) =>
    set((state) => ({
      entries: state.entries.filter((e) => e.id !== id),
    })),
  reorderEntries: (entries) =>
    set(() => ({
      entries: entries.map((e, i) => ({ ...e, position: i + 1 })),
    })),
}))

export default useQueueStore