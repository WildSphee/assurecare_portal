import type { DoctorNote, CaregiverNote } from '@/types'

export const MOCK_DOCTOR_NOTES: DoctorNote[] = [
  {
    id: 'note-001',
    patientId: 'patient-001',
    authorId: 'user-dr-chan',
    content:
      'Post-MI follow-up: patient discharged last week. Started on ACE inhibitor + amlodipine. BP target < 130/80. Ana (daughter) to monitor daily via chatbot. Follow-up booked for Mar 3.',
    createdAt: '2026-02-18T14:30:00Z',
    updatedAt: '2026-02-18T14:30:00Z',
    visibility: 'caregiver_read_only',
  },
  {
    id: 'note-002',
    patientId: 'patient-001',
    authorId: 'user-dr-chan',
    content:
      'Reviewed BP trend — rising as noted by chatbot alerts. Advised Ana to remind patient about evening medication. Will reassess at Mar 3 appointment.',
    createdAt: '2026-02-22T09:30:00Z',
    updatedAt: '2026-02-22T09:30:00Z',
    visibility: 'caregiver_read_only',
  },
]

export const MOCK_CAREGIVER_NOTES: CaregiverNote[] = [
  {
    id: 'cnote-001',
    patientId: 'patient-001',
    authorId: 'user-ana',
    content: 'Called Mum this afternoon. She said she felt a bit dizzy in the morning but is okay now. Reminded her about the evening medication.',
    createdAt: '2026-02-24T16:00:00Z',
  },
  {
    id: 'cnote-002',
    patientId: 'patient-001',
    authorId: 'user-ana',
    content: 'Visited over the weekend. BP machine at home showing 148/90 — will ask the family doctor (Dr. Chan) about this at the appointment.',
    createdAt: '2026-02-22T20:00:00Z',
  },
]
