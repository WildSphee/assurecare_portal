import { create } from 'zustand'
import type {
  Patient,
  Alert,
  SymptomSignal,
  VitalsRecord,
  AdherenceRecord,
  AISummary,
  DoctorNote,
  CaregiverNote,
  EscalationRecord,
  ChatbotMessage,
  CheckinSession,
  CarePlanItem,
} from '@/types'

interface PatientStore {
  patients: Patient[]
  alerts: Alert[]
  symptoms: SymptomSignal[]
  vitals: VitalsRecord[]
  adherence: AdherenceRecord[]
  aiSummaries: AISummary[]
  doctorNotes: DoctorNote[]
  caregiverNotes: CaregiverNote[]
  escalations: EscalationRecord[]
  messages: ChatbotMessage[]
  checkins: CheckinSession[]
  carePlan: CarePlanItem[]

  seed: (data: {
    patients: Patient[]
    alerts: Alert[]
    symptoms: SymptomSignal[]
    vitals: VitalsRecord[]
    adherence: AdherenceRecord[]
    aiSummaries: AISummary[]
    doctorNotes: DoctorNote[]
    caregiverNotes: CaregiverNote[]
    escalations: EscalationRecord[]
    messages: ChatbotMessage[]
    carePlan: CarePlanItem[]
  }) => void

  addDoctorNote: (note: DoctorNote) => void
  addCaregiverNote: (note: CaregiverNote) => void
  updateAlertStatus: (alertId: string, status: Alert['status']) => void
  addEscalation: (esc: EscalationRecord) => void
  addMessage: (msg: ChatbotMessage) => void
}

export const usePatientStore = create<PatientStore>((set) => ({
  patients: [],
  alerts: [],
  symptoms: [],
  vitals: [],
  adherence: [],
  aiSummaries: [],
  doctorNotes: [],
  caregiverNotes: [],
  escalations: [],
  messages: [],
  checkins: [],
  carePlan: [],

  seed: (data) => set({ ...data }),

  addDoctorNote: (note) =>
    set((state) => ({ doctorNotes: [note, ...state.doctorNotes] })),

  addCaregiverNote: (note) =>
    set((state) => ({ caregiverNotes: [note, ...state.caregiverNotes] })),

  updateAlertStatus: (alertId, status) =>
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === alertId ? { ...a, status } : a)),
    })),

  addEscalation: (esc) =>
    set((state) => ({ escalations: [esc, ...state.escalations] })),

  addMessage: (msg) =>
    set((state) => ({ messages: [msg, ...state.messages] })),
}))
