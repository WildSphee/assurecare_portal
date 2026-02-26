import type { ReasonCode } from '@/types'

export const REASON_CODE_LABELS: Record<ReasonCode, string> = {
  BP_UPTREND_5D: 'Blood pressure trending upward',
  HR_UPTREND_5D: 'Heart rate trending upward',
  MISSED_MEDS_STREAK_2: 'Medication missed 2 days in a row',
  MISSED_MEDS_YESTERDAY: 'Medication missed yesterday',
  SYMPTOM_DIZZINESS_REPEAT: 'Dizziness reported (recurring)',
  SYMPTOM_HEARTACHE_MILD: 'Mild heartache reported',
  ESCALATION_FROM_CAREGIVER: 'Escalation from caregiver',
  SYMPTOM_CHEST_TIGHTNESS_SEVERE: 'Severe chest tightness reported',
  SYMPTOM_SHORTNESS_OF_BREATH: 'Shortness of breath reported',
  NO_RESPONSE_STREAK_2: 'No check-in response for 2+ days',
  ENGAGEMENT_DROP_30PCT: 'Engagement significantly reduced',
}

export const REASON_CODE_DESCRIPTIONS: Record<ReasonCode, string> = {
  BP_UPTREND_5D:
    'The average blood pressure over the last 5 days is higher than the 5 days before that, indicating a rising trend.',
  HR_UPTREND_5D:
    'Heart rate has been consistently higher over the last 5 days compared to the previous period.',
  MISSED_MEDS_STREAK_2:
    'Medication has been missed on 2 or more consecutive days. Missing doses can affect blood pressure control.',
  MISSED_MEDS_YESTERDAY:
    'A medication dose was missed yesterday. A single missed dose can affect effectiveness.',
  SYMPTOM_DIZZINESS_REPEAT:
    'Dizziness has been reported on multiple occasions recently. This may be related to blood pressure changes.',
  SYMPTOM_HEARTACHE_MILD:
    'Mild heartache has been reported. This is clinically important, especially with recent cardiac history, and should be reviewed promptly.',
  ESCALATION_FROM_CAREGIVER:
    'A caregiver has escalated this patient for clinician review via the portal, indicating concern that requires follow-up.',
  SYMPTOM_CHEST_TIGHTNESS_SEVERE:
    'Severe chest tightness has been reported, which may indicate a serious cardiovascular concern requiring prompt attention.',
  SYMPTOM_SHORTNESS_OF_BREATH:
    'Shortness of breath has been reported, which can be associated with cardiovascular or respiratory conditions.',
  NO_RESPONSE_STREAK_2:
    'No response has been received to the daily check-in for 2 or more days in a row, suggesting the person may not be reachable.',
  ENGAGEMENT_DROP_30PCT:
    'The rate of completing daily check-ins has dropped by more than 30%, suggesting reduced engagement with the monitoring programme.',
}

export const REASON_CODE_WEIGHTS: Record<ReasonCode, number> = {
  BP_UPTREND_5D: 3,
  HR_UPTREND_5D: 2,
  MISSED_MEDS_STREAK_2: 3,
  MISSED_MEDS_YESTERDAY: 2,
  SYMPTOM_DIZZINESS_REPEAT: 2,
  SYMPTOM_HEARTACHE_MILD: 3,
  ESCALATION_FROM_CAREGIVER: 2,
  SYMPTOM_CHEST_TIGHTNESS_SEVERE: 3,
  SYMPTOM_SHORTNESS_OF_BREATH: 2,
  NO_RESPONSE_STREAK_2: 2,
  ENGAGEMENT_DROP_30PCT: 1,
}
