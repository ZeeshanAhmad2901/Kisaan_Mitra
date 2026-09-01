import { create } from 'zustand'

interface BookingState {
  currentStep: number
  selectedMandi: string
  selectedSlot: string
  selectedVehicle: string
  crop: string
  quantity: string
  isSubmitting: boolean
  setStep: (step: number) => void
  setMandi: (id: string) => void
  setSlot: (id: string) => void
  setVehicle: (id: string) => void
  setCrop: (crop: string) => void
  setQuantity: (qty: string) => void
  setSubmitting: (val: boolean) => void
  reset: () => void
}

const useBookingStore = create<BookingState>((set) => ({
  currentStep: 0,
  selectedMandi: '',
  selectedSlot: '',
  selectedVehicle: '',
  crop: '',
  quantity: '',
  isSubmitting: false,
  setStep: (step) => set({ currentStep: step }),
  setMandi: (id) => set({ selectedMandi: id }),
  setSlot: (id) => set({ selectedSlot: id }),
  setVehicle: (id) => set({ selectedVehicle: id }),
  setCrop: (crop) => set({ crop }),
  setQuantity: (qty) => set({ quantity: qty }),
  setSubmitting: (val) => set({ isSubmitting: val }),
  reset: () => set({ currentStep: 0, selectedMandi: '', selectedSlot: '', selectedVehicle: '', crop: '', quantity: '', isSubmitting: false }),
}))

export default useBookingStore