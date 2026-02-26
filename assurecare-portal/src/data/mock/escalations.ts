import type { EscalationRecord } from '@/types'

export const MOCK_ESCALATIONS: EscalationRecord[] = [
  // Resolved escalation (Ana → family doctor Dr. Chan for Mrs Tan, Feb 23)
  {
    id: 'esc-001',
    patientId: 'patient-001',
    initiatedBy: 'user-ana',
    escalationType: 'to_doctor',
    reasonCodes: ['BP_UPTREND_5D', 'MISSED_MEDS_STREAK_2'],
    outcome: 'resolved',
    notes: 'Ana noticed BP rising and missed meds. Family doctor Dr. Chan reviewed and confirmed appointment.',
    createdAt: '2026-02-23T20:00:00Z',
    resolvedAt: '2026-02-24T09:00:00Z',
  },
  // Pending escalation (Mr. Lim, no response)
  {
    id: 'esc-002',
    patientId: 'patient-002',
    initiatedBy: 'user-dr-chan',
    escalationType: 'to_doctor',
    reasonCodes: ['SYMPTOM_CHEST_TIGHTNESS_SEVERE', 'NO_RESPONSE_STREAK_2'],
    outcome: 'pending',
    notes: 'Patient unresponsive for 2 days with prior severe chest pain report. Urgent follow-up needed.',
    createdAt: '2026-02-24T20:00:00Z',
  },
]
