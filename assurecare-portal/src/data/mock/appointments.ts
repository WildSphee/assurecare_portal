import type { Appointment } from '@/types'

export const MOCK_APPOINTMENTS: Appointment[] = [
  // Ms. Tan — scheduled
  {
    id: 'appt-001',
    patientId: 'patient-001',
    doctorId: 'user-dr-chan',
    status: 'scheduled',
    requestedAt: '2026-02-20T10:00:00Z',
    scheduledAt: '2026-03-03T10:00:00Z',
    preferredWindows: ['Morning weekdays'],
    reason: 'routine_follow_up',
    notes: 'Post-MI follow-up. BP has been trending upward. Review medication adherence.',
    aiSummarySnippet: 'BP increased from 130 to 148 mmHg over 10 days; evening meds missed Feb 23–24.',
    initiatedBy: 'user-ana',
  },
  // Mr. Kumar — scheduled
  {
    id: 'appt-002',
    patientId: 'patient-004',
    doctorId: 'user-dr-chan',
    status: 'scheduled',
    requestedAt: '2026-02-22T09:00:00Z',
    scheduledAt: '2026-03-05T14:00:00Z',
    reason: 'medication_review',
    notes: 'Review antihypertensive medication efficacy.',
    initiatedBy: 'user-dr-chan',
  },
  // Mrs. Wong — requested (not yet confirmed)
  {
    id: 'appt-003',
    patientId: 'patient-003',
    doctorId: 'user-dr-chan',
    status: 'requested',
    requestedAt: '2026-02-25T08:30:00Z',
    preferredWindows: ['Morning weekdays', 'Afternoon weekdays'],
    reason: 'post_discharge',
    notes: 'Post-discharge review needed urgently.',
    aiSummarySnippet: 'BP >150 mmHg for 7 days; missed meds 3/7 days; shortness of breath.',
    initiatedBy: 'user-dr-chan',
  },
  // Ms. Lee — scheduled
  {
    id: 'appt-004',
    patientId: 'patient-005',
    doctorId: 'user-dr-chan',
    status: 'scheduled',
    requestedAt: '2026-02-18T11:00:00Z',
    scheduledAt: '2026-03-07T09:30:00Z',
    reason: 'bp_concern',
    notes: 'HR uptrend — review AF management.',
    initiatedBy: 'user-dr-chan',
  },
  // Ms. Siti — completed (historical)
  {
    id: 'appt-005',
    patientId: 'patient-009',
    doctorId: 'user-dr-chan',
    status: 'completed',
    requestedAt: '2026-02-01T09:00:00Z',
    scheduledAt: '2026-02-10T10:00:00Z',
    reason: 'routine_follow_up',
    notes: 'Routine 3-month review.',
    initiatedBy: 'user-dr-chan',
  },
  // Mr. Chen — upcoming
  {
    id: 'appt-006',
    patientId: 'patient-010',
    doctorId: 'user-dr-chan',
    status: 'scheduled',
    requestedAt: '2026-02-10T09:00:00Z',
    scheduledAt: '2026-03-01T11:00:00Z',
    reason: 'routine_follow_up',
    notes: 'Annual review.',
    initiatedBy: 'user-dr-chan',
  },
]
