import { create } from 'zustand'
import type { Appointment } from '@/types'

interface AppointmentStore {
  appointments: Appointment[]
  seed: (appointments: Appointment[]) => void
  requestAppointment: (appt: Appointment) => void
  scheduleAppointment: (id: string, scheduledAt: string) => void
  cancelAppointment: (id: string) => void
}

export const useAppointmentStore = create<AppointmentStore>((set) => ({
  appointments: [],

  seed: (appointments) => set({ appointments }),

  requestAppointment: (appt) =>
    set((state) => ({ appointments: [appt, ...state.appointments] })),

  scheduleAppointment: (id, scheduledAt) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === id ? { ...a, status: 'scheduled' as const, scheduledAt } : a
      ),
    })),

  cancelAppointment: (id) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === id ? { ...a, status: 'cancelled' as const } : a
      ),
    })),
}))
