import type { AISummary } from '@/types'

export const MOCK_AI_SUMMARIES: AISummary[] = [
  // Mrs Tan — Daily summary
  {
    id: 'summary-001',
    patientId: 'patient-001',
    date: '2026-02-25',
    summaryType: 'daily',
    narrative:
      'Mrs Tan is having mild heartache at 09:05, stating "我胸口疼，是否应该向陈医生预约看诊？". Her latest vitals are within her usual range (BP 126/80 mmHg, HR 76 bpm). She missed her evening medication on the past 2 days but took her medication today. Given her recent cardiac history and new heartache symptom despite normal vitals, this remains a concern. Recommend contacting the family doctor (Dr. Chan) today to review symptoms and advise on next steps.',
    highlights: [
      // 'BP has increased from 130 to 148 mmHg (systolic) over the past 10 days',
      // 'Evening medication missed on Feb 23 and Feb 24 (2-day streak)',
      // 'Dizziness (moderate severity) reported on Feb 24',
      // 'Morning medication taken consistently for the past 14 days',
      // 'Check-in completed today at 09:05',
    ],
    keyDrivers: ['MISSED_MEDS_STREAK_2'],
    suggestedActions: [
      'Consider calling Mrs Tan to check in on how she is feeling today',
      'Reinforce medication adherence after the 2 missed evening doses',
      'Contact the family doctor (Dr. Chan) today to review the mild heartache even though current vitals are normal',
    ],
    confidence: 'high',
    dataCoverageRange: { from: '2026-02-18', to: '2026-02-25' },
    generatedAt: '2026-02-25T09:10:00Z',
  },
  // Mrs Tan — Clinical summary
  {
    id: 'summary-002',
    patientId: 'patient-001',
    date: '2026-02-25',
    summaryType: 'clinical',
    narrative:
      'Patient reports mild heartache this afternoon during today\'s check-in. Latest vitals remain within usual range (BP 126/80 mmHg, HR 76 bpm) with no current BP/HR instability. Medication adherence concern persists: evening doses missed on 2 consecutive days before today, with medication taken today. Given recent cardiac history, mild heartache warrants clinician review despite normal vitals and preserved engagement. Recommend same-day call to assess symptom characteristics and determine whether urgent evaluation is needed.',
    highlights: [
      'Mild heartache reported this afternoon during check-in',
      'Latest vitals: BP 126/80 mmHg, HR 76 bpm (within usual range)',
      'Missed evening antihypertensive: Feb 23–24 (2-day streak); dose taken today',
      'No current dyspnoea reported; engagement remains good',
      'Recent cardiac history increases risk despite normal vitals',
    ],
    keyDrivers: ['MISSED_MEDS_STREAK_2'],
    suggestedActions: [
      'Contact the family doctor (Dr. Chan) / clinician today for symptom review',
      'Clarify heartache onset, duration, severity, radiation, and associated symptoms',
      'Review adherence barriers for the 2 missed evening doses and reinforce plan',
    ],
    confidence: 'high',
    dataCoverageRange: { from: '2026-02-15', to: '2026-02-25' },
    generatedAt: '2026-02-25T09:10:00Z',
  },
  // Mr. Lim — Clinical summary (Red)
  {
    id: 'summary-003',
    patientId: 'patient-002',
    date: '2026-02-25',
    summaryType: 'clinical',
    narrative:
      'Patient has not responded to check-in for 2 consecutive days. Severe chest tightness reported on Feb 23 and Feb 24 prior to loss of contact. BP consistently elevated (155–170 mmHg systolic). Urgent follow-up required.',
    highlights: [
      'No check-in response: Feb 23–24 (2-day streak)',
      'Severe chest tightness reported on Feb 23 and Feb 24',
      'BP systolic 155–170 mmHg (persistently elevated)',
      'Missed morning medication on Feb 24 and Feb 25',
    ],
    keyDrivers: ['SYMPTOM_CHEST_TIGHTNESS_SEVERE', 'NO_RESPONSE_STREAK_2'],
    suggestedActions: [
      'Immediate phone follow-up required — patient unresponsive',
      'Consider home visit or emergency contact activation if unreachable',
      'Review BP trend and medication adherence at next contact',
    ],
    confidence: 'medium',
    dataCoverageRange: { from: '2026-02-18', to: '2026-02-25' },
    generatedAt: '2026-02-25T09:00:00Z',
  },
  // Mrs. Wong
  {
    id: 'summary-004',
    patientId: 'patient-003',
    date: '2026-02-25',
    summaryType: 'clinical',
    narrative:
      'Post-discharge patient (Feb 20) with elevated BP and poor medication adherence over the past week. Shortness of breath and leg swelling reported.',
    highlights: [
      'Post-discharge 5 days — adherence declining',
      'BP systolic >150 mmHg for 7 consecutive days',
      'Missed medication on 3 of last 7 days',
      'Shortness of breath (moderate) on Feb 24',
    ],
    keyDrivers: ['BP_UPTREND_5D', 'MISSED_MEDS_STREAK_2'],
    suggestedActions: ['Urgent post-discharge review', 'Medication adherence counselling'],
    confidence: 'high',
    dataCoverageRange: { from: '2026-02-18', to: '2026-02-25' },
    generatedAt: '2026-02-25T09:00:00Z',
  },
  // Generic summaries for other patients
  ...(['patient-004', 'patient-005', 'patient-006', 'patient-007', 'patient-008', 'patient-009', 'patient-010'] as const).map((id, i) => ({
    id: `summary-${String(i + 5).padStart(3, '0')}`,
    patientId: id,
    date: '2026-02-25',
    summaryType: 'clinical' as const,
    narrative: 'Patient check-in completed. Vitals within expected range. Continue current management.',
    highlights: ['Check-in completed', 'Vitals stable', 'Medication adherence satisfactory'],
    keyDrivers: [] as [],
    suggestedActions: ['Continue current care plan', 'Schedule routine follow-up if due'],
    confidence: 'high' as const,
    dataCoverageRange: { from: '2026-02-18', to: '2026-02-25' },
    generatedAt: '2026-02-25T09:00:00Z',
  })),
]
