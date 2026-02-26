import type { Alert } from '@/types'

export const MOCK_ALERTS: Alert[] = [
  // Ms. Tan — Red (heartache priority)
  {
    id: 'alert-001',
    patientId: 'patient-001',
    severity: 'red',
    reasonCodes: ['SYMPTOM_HEARTACHE_MILD', 'MISSED_MEDS_STREAK_2', 'ESCALATION_FROM_CAREGIVER'],
    evidencePointers: [
      {
        description: 'Evening medication missed on Feb 23 and Feb 24 (2-day streak)',
        dates: ['2026-02-23', '2026-02-24'],
        metric: 'medsEveningTaken',
      },
      {
        description: 'Mild heartache reported this afternoon; latest BP/HR remain within usual range',
        dates: ['2026-02-25'],
        metric: 'symptom',
      },
      {
        description: 'Caregiver escalated via portal requesting medical review',
        dates: ['2026-02-26'],
        metric: 'escalation',
      },
    ],
    createdAt: '2026-02-25T09:10:00Z',
    status: 'open',
  },
  // Mr. Lim — Red
  {
    id: 'alert-002',
    patientId: 'patient-002',
    severity: 'red',
    reasonCodes: ['SYMPTOM_CHEST_TIGHTNESS_SEVERE', 'NO_RESPONSE_STREAK_2'],
    evidencePointers: [
      {
        description: 'Severe chest tightness reported on Feb 23 and Feb 24 (recurring)',
        dates: ['2026-02-23', '2026-02-24'],
        metric: 'symptom',
      },
      {
        description: 'No check-in response for 2 consecutive days (Feb 23–24)',
        dates: ['2026-02-23', '2026-02-24'],
        metric: 'response',
      },
    ],
    createdAt: '2026-02-24T20:00:00Z',
    status: 'open',
  },
  // Mrs. Wong — Red
  {
    id: 'alert-003',
    patientId: 'patient-003',
    severity: 'red',
    reasonCodes: ['BP_UPTREND_5D', 'MISSED_MEDS_STREAK_2'],
    evidencePointers: [
      {
        description: 'BP systolic above 150 mmHg for 7 consecutive days',
        dates: ['2026-02-18', '2026-02-19', '2026-02-20', '2026-02-21', '2026-02-22', '2026-02-23', '2026-02-24'],
        metric: 'bp_systolic',
      },
      {
        description: 'Missed medication on 3 of last 7 days',
        dates: ['2026-02-22', '2026-02-23', '2026-02-24'],
        metric: 'medsEveningTaken',
      },
    ],
    createdAt: '2026-02-24T15:00:00Z',
    status: 'open',
  },
  // Mr. Kumar — Yellow
  {
    id: 'alert-004',
    patientId: 'patient-004',
    severity: 'yellow',
    reasonCodes: ['MISSED_MEDS_STREAK_2'],
    evidencePointers: [
      {
        description: 'Morning medication missed on Feb 23 and Feb 24',
        dates: ['2026-02-23', '2026-02-24'],
        metric: 'medsMorningTaken',
      },
    ],
    createdAt: '2026-02-24T18:00:00Z',
    status: 'open',
  },
  // Ms. Lee — Yellow
  {
    id: 'alert-005',
    patientId: 'patient-005',
    severity: 'yellow',
    reasonCodes: ['HR_UPTREND_5D'],
    evidencePointers: [
      {
        description: 'Heart rate has trended up from 76 to 92 bpm over 7 days',
        dates: ['2026-02-18', '2026-02-20', '2026-02-22', '2026-02-24'],
        metric: 'hr_bpm',
      },
    ],
    createdAt: '2026-02-24T09:00:00Z',
    status: 'open',
  },
  // Mr. Ang — Yellow
  {
    id: 'alert-006',
    patientId: 'patient-006',
    severity: 'yellow',
    reasonCodes: ['ENGAGEMENT_DROP_30PCT'],
    evidencePointers: [
      {
        description: 'Check-in completion rate dropped from 95% to 60% over 2 weeks',
        dates: ['2026-02-10', '2026-02-17', '2026-02-24'],
        metric: 'completion_rate',
      },
    ],
    createdAt: '2026-02-23T10:00:00Z',
    status: 'acknowledged',
  },
  // Resolved old alert for Ms. Tan (historical)
  {
    id: 'alert-007',
    patientId: 'patient-001',
    severity: 'yellow',
    reasonCodes: ['MISSED_MEDS_YESTERDAY'],
    evidencePointers: [
      {
        description: 'Evening medication missed on Feb 10',
        dates: ['2026-02-10'],
        metric: 'medsEveningTaken',
      },
    ],
    createdAt: '2026-02-10T21:00:00Z',
    status: 'resolved',
  },
]
