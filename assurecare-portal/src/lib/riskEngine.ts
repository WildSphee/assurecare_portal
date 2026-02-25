import type {
  RiskLevel,
  ReasonCode,
  VitalsRecord,
  AdherenceRecord,
  SymptomSignal,
  RiskScoreBreakdown,
} from '@/types'

export function computeRiskStatus(
  _patientId: string,
  vitals: VitalsRecord[],
  adherence: AdherenceRecord[],
  symptoms: SymptomSignal[],
): RiskScoreBreakdown {
  const scoreBreakdown: Record<string, number> = {}
  const reasonCodes: ReasonCode[] = []
  let total = 0

  // Sort by date desc for recency checks
  const sortedVitals = [...vitals].sort((a, b) => b.date.localeCompare(a.date))
  const sortedAdherence = [...adherence].sort((a, b) => b.date.localeCompare(a.date))
  const sortedSymptoms = [...symptoms].sort((a, b) => b.date.localeCompare(a.date))

  // BP uptrend over last 5 days vs prior 5 days
  const recent5 = sortedVitals.slice(0, 5)
  const prior5 = sortedVitals.slice(5, 10)
  if (recent5.length >= 3 && prior5.length >= 3) {
    const recentAvg = recent5.reduce((s, v) => s + v.bpSystolic, 0) / recent5.length
    const priorAvg = prior5.reduce((s, v) => s + v.bpSystolic, 0) / prior5.length
    if (recentAvg - priorAvg > 5) {
      scoreBreakdown['BP_UPTREND_5D'] = 3
      total += 3
      reasonCodes.push('BP_UPTREND_5D')
    }
  }

  // HR uptrend over last 5 days
  if (recent5.length >= 3 && prior5.length >= 3) {
    const recentHr = recent5.reduce((s, v) => s + v.hrBpm, 0) / recent5.length
    const priorHr = prior5.reduce((s, v) => s + v.hrBpm, 0) / prior5.length
    if (recentHr - priorHr > 8) {
      scoreBreakdown['HR_UPTREND_5D'] = 2
      total += 2
      reasonCodes.push('HR_UPTREND_5D')
    }
  }

  // Missed meds streak ≥ 2
  const last2Adh = sortedAdherence.slice(0, 2)
  if (
    last2Adh.length === 2 &&
    last2Adh.every((a) => a.medsEveningTaken === false || a.medsMorningTaken === false)
  ) {
    scoreBreakdown['MISSED_MEDS_STREAK_2'] = 3
    total += 3
    reasonCodes.push('MISSED_MEDS_STREAK_2')
  } else if (last2Adh.length >= 1 && (last2Adh[0].medsEveningTaken === false || last2Adh[0].medsMorningTaken === false)) {
    scoreBreakdown['MISSED_MEDS_YESTERDAY'] = 2
    total += 2
    reasonCodes.push('MISSED_MEDS_YESTERDAY')
  }

  // Severe symptom (any recent)
  const recentSevere = sortedSymptoms.filter((s) => s.severity === 'severe').slice(0, 2)
  if (recentSevere.length > 0) {
    const code = recentSevere[0].symptomType.toLowerCase().includes('chest')
      ? 'SYMPTOM_CHEST_TIGHTNESS_SEVERE'
      : recentSevere[0].symptomType.toLowerCase().includes('dizziness')
        ? 'SYMPTOM_DIZZINESS_REPEAT'
        : 'SYMPTOM_SHORTNESS_OF_BREATH'
    scoreBreakdown[code] = 3
    total += 3
    reasonCodes.push(code as ReasonCode)
  }

  // Repeated moderate dizziness
  const dizziness = sortedSymptoms.filter(
    (s) => s.symptomType.toLowerCase().includes('dizziness') && s.severity !== 'severe'
  )
  if (dizziness.length >= 2 && !reasonCodes.includes('SYMPTOM_DIZZINESS_REPEAT')) {
    scoreBreakdown['SYMPTOM_DIZZINESS_REPEAT'] = 2
    total += 2
    reasonCodes.push('SYMPTOM_DIZZINESS_REPEAT')
  }

  // No response streak ≥ 2 — derived from vitals gaps (simplified)
  const missedDays = getMissingDaysCount(sortedVitals, 3)
  if (missedDays >= 2) {
    scoreBreakdown['NO_RESPONSE_STREAK_2'] = 2
    total += 2
    reasonCodes.push('NO_RESPONSE_STREAK_2')
  }

  // Risk level mapping
  let level: RiskLevel = 'green'
  if (total >= 6) level = 'red'
  else if (total >= 3) level = 'yellow'

  return { level, reasonCodes, score: total, scoreBreakdown }
}

function getMissingDaysCount(vitals: VitalsRecord[], lookback: number): number {
  if (vitals.length === 0) return lookback
  const today = new Date()
  let missing = 0
  for (let i = 1; i <= lookback; i++) {
    const target = new Date(today)
    target.setDate(target.getDate() - i)
    const targetStr = target.toISOString().split('T')[0]
    if (!vitals.find((v) => v.date === targetStr)) missing++
  }
  return missing
}
