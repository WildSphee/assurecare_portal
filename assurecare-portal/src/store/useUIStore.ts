import { create } from 'zustand'

type ViewMode = 'cards' | 'table' | 'map'
type SortOrder = 'risk_desc' | 'newest_alerts' | 'upcoming_appointments'

interface UIStore {
  activeRole: 'caregiver' | 'doctor'
  selectedPatientId: string | null
  doctorViewMode: ViewMode
  activeFilters: string[]
  sortOrder: SortOrder
  searchQuery: string
  showDetailedScoring: boolean

  setRole: (role: 'caregiver' | 'doctor') => void
  setSelectedPatient: (id: string | null) => void
  setViewMode: (mode: ViewMode) => void
  toggleFilter: (filter: string) => void
  clearFilters: () => void
  setSearch: (q: string) => void
  setSortOrder: (order: SortOrder) => void
  toggleDetailedScoring: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  activeRole: 'caregiver',
  selectedPatientId: null,
  doctorViewMode: 'cards',
  activeFilters: [],
  sortOrder: 'risk_desc',
  searchQuery: '',
  showDetailedScoring: false,

  setRole: (role) => set({ activeRole: role }),
  setSelectedPatient: (id) => set({ selectedPatientId: id }),
  setViewMode: (mode) => set({ doctorViewMode: mode }),

  toggleFilter: (filter) =>
    set((state) => ({
      activeFilters: state.activeFilters.includes(filter)
        ? state.activeFilters.filter((f) => f !== filter)
        : [...state.activeFilters, filter],
    })),

  clearFilters: () => set({ activeFilters: [], searchQuery: '' }),
  setSearch: (q) => set({ searchQuery: q }),
  setSortOrder: (order) => set({ sortOrder: order }),
  toggleDetailedScoring: () =>
    set((state) => ({ showDetailedScoring: !state.showDetailedScoring })),
}))
