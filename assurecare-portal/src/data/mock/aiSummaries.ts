import type { AISummary } from '@/types'

export const MOCK_AI_SUMMARIES: AISummary[] = [
  // Ms. Tan — Daily summary
  {
    id: 'summary-001',
    patientId: 'patient-001',
    date: '2026-02-25',
    summaryType: 'daily',
    narrative:
      'Ms. Tan completed her check-in this morning at 09:05. Her blood pressure has been gradually increasing over the past 10 days, now measuring 148/92 mmHg — higher than her usual range. She missed her evening medication on both Feb 23 and Feb 24, which may be contributing to the rise. She also shared, \"I had some heartache last night, but it settled after I rested.\" This is concerning given her recent mild heart attack and elevated blood pressure trend. A moderate episode of dizziness was also reported yesterday. Morning medication adherence remains consistent. Recommend contacting Dr. Chan today to review her symptoms and decide if an earlier assessment is needed.',
    highlights: [
      // 'BP has increased from 130 to 148 mmHg (systolic) over the past 10 days',
      // 'Evening medication missed on Feb 23 and Feb 24 (2-day streak)',
      // 'Dizziness (moderate severity) reported on Feb 24',
      // 'Morning medication taken consistently for the past 14 days',
      // 'Check-in completed today at 09:05',
    ],
    keyDrivers: ['BP_UPTREND_5D', 'MISSED_MEDS_STREAK_2'],
    suggestedActions: [
      'Consider calling Ms. Tan to check in on how she is feeling today',
      'Gently remind Ms. Tan about her evening medication',
      'Contact Dr. Chan today if the heartache/chest discomfort recurs, worsens, or if BP remains elevated',
    ],
    confidence: 'high',
    dataCoverageRange: { from: '2026-02-18', to: '2026-02-25' },
    generatedAt: '2026-02-25T09:10:00Z',
  },
  // Ms. Tan — Clinical summary
  {
    id: 'summary-002',
    patientId: 'patient-001',
    date: '2026-02-25',
    summaryType: 'clinical',
    narrative:
      'Patient presents with a 10-day uptrend in systolic BP (130→148 mmHg) coinciding with 2 consecutive missed evening antihypertensive doses. Recurrent moderate dizziness noted. HR stable at 82 bpm. Post-MI (1 week) — close monitoring warranted. No acute chest pain or dyspnoea reported. Engagement remains good (daily check-ins). Recommend medication adherence review and BP reassessment within 48h.',
    highlights: [
      'Systolic BP: 130 → 148 mmHg over 10 days (uptrend)',
      'Missed evening antihypertensive: Feb 23–24 (2-day streak)',
      'Recurrent dizziness — moderate (Feb 21, Feb 24)',
      'HR: 82 bpm — stable, no significant HR uptrend',
      'Post-MI status (1 week) — elevated baseline risk',
    ],
    keyDrivers: ['BP_UPTREND_5D', 'MISSED_MEDS_STREAK_2'],
    suggestedActions: [
      'Review antihypertensive dose timing and adherence barriers',
      'Consider BP check within 48h given post-MI context',
      'Assess dizziness etiology — may be BP-related or medication side effect',
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
