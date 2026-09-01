import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean
  mobileMenuOpen: boolean
  toasts: { id: string; message: string; type: 'success' | 'error' | 'info' }[]
  toggleSidebar: () => void
  toggleMobileMenu: () => void
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void
  removeToast: (id: string) => void
}

const useUIStore = create<UIState>()((set) => ({  // ← fixed here
  sidebarOpen: true,
  mobileMenuOpen: false,
  toasts: [],
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  addToast: (message, type = 'success') => {
    const id = Date.now().toString()
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }))
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    }, 4000)
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))

export default useUIStore