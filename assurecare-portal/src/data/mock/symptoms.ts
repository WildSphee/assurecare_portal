import type { SymptomSignal } from '@/types'

export const MOCK_SYMPTOMS: SymptomSignal[] = [
  // Ms. Tan
  { id: 'sym-001', patientId: 'patient-001', date: '2026-02-24', symptomType: 'Dizziness', severity: 'moderate', source: 'chatbot' },
  { id: 'sym-002', patientId: 'patient-001', date: '2026-02-21', symptomType: 'Dizziness', severity: 'mild', source: 'chatbot' },
  { id: 'sym-003', patientId: 'patient-001', date: '2026-02-18', symptomType: 'Mild headache', severity: 'mild', source: 'chatbot' },
  // Mr. Lim (red)
  { id: 'sym-004', patientId: 'patient-002', date: '2026-02-24', symptomType: 'Chest tightness', severity: 'severe', source: 'chatbot' },
  { id: 'sym-005', patientId: 'patient-002', date: '2026-02-23', symptomType: 'Chest tightness', severity: 'severe', source: 'chatbot' },
  { id: 'sym-006', patientId: 'patient-002', date: '2026-02-22', symptomType: 'Shortness of breath', severity: 'moderate', source: 'chatbot' },
  // Mrs. Wong (red)
  { id: 'sym-007', patientId: 'patient-003', date: '2026-02-24', symptomType: 'Shortness of breath', severity: 'moderate', source: 'chatbot' },
  { id: 'sym-008', patientId: 'patient-003', date: '2026-02-23', symptomType: 'Leg swelling', severity: 'mild', source: 'chatbot' },
  // Mr. Kumar (yellow)
  { id: 'sym-009', patientId: 'patient-004', date: '2026-02-22', symptomType: 'Dizziness', severity: 'mild', source: 'chatbot' },
  // Ms. Lee (yellow)
  { id: 'sym-010', patientId: 'patient-005', date: '2026-02-23', symptomType: 'Palpitations', severity: 'mild', source: 'chatbot' },
]
