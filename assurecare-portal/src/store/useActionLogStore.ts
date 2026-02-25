import { create } from 'zustand'
import type { ActionLogEntry, ActionType } from '@/types'

interface ActionLogStore {
  entries: ActionLogEntry[]
  seed: (entries: ActionLogEntry[]) => void
  addEntry: (entry: ActionLogEntry) => void
  logAction: (
    actorUserId: string,
    actorRole: 'caregiver' | 'doctor',
    patientId: string,
    actionType: ActionType,
    payload: Record<string, unknown>
  ) => void
}

export const useActionLogStore = create<ActionLogStore>((set) => ({
  entries: [],

  seed: (entries) => set({ entries }),

  addEntry: (entry) =>
    set((state) => ({ entries: [entry, ...state.entries] })),

  logAction: (actorUserId, actorRole, patientId, actionType, payload) =>
    set((state) => ({
      entries: [
        {
          id: `log-${Date.now()}`,
          actorUserId,
          actorRole,
          patientId,
          actionType,
          payload,
          timestamp: new Date().toISOString(),
        },
        ...state.entries,
      ],
    })),
}))
