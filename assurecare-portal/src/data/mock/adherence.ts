import type { AdherenceRecord } from '@/types'

function d(daysAgo: number): string {
  const dt = new Date('2026-02-25')
  dt.setDate(dt.getDate() - daysAgo)
  return dt.toISOString().split('T')[0]
}

// Ms. Tan: missed evening meds Feb 23 (day 2) and Feb 24 (day 1)
const msTanAdherence: Omit<AdherenceRecord, 'id'>[] = Array.from({ length: 30 }, (_, i) => {
  const daysAgo = 29 - i
  const isMissedEvening = daysAgo === 1 || daysAgo === 2
  return {
    patientId: 'patient-001',
    date: d(daysAgo),
    medsMorningTaken: true,
    medsEveningTaken: isMissedEvening ? false : true,
    exerciseDone: daysAgo % 4 !== 0 ? true : false,
    hydrationDone: true,
    source: 'chatbot',
  }
})

// Mr. Lim: missed morning meds day 0 and day 1
const limAdherence: Omit<AdherenceRecord, 'id'>[] = Array.from({ length: 25 }, (_, i) => {
  const daysAgo = 24 - i
  const isMissedMorning = daysAgo === 0 || daysAgo === 1
  return {
    patientId: 'patient-002',
    date: d(daysAgo),
    medsMorningTaken: isMissedMorning ? false : true,
    medsEveningTaken: daysAgo === 3 ? false : true,
    exerciseDone: daysAgo % 3 !== 0,
    hydrationDone: true,
    source: 'chatbot',
  }
})

function genericAdherence(patientId: string, missRate = 0.1): Omit<AdherenceRecord, 'id'>[] {
  return Array.from({ length: 25 }, (_, i) => ({
    patientId,
    date: d(24 - i),
    medsMorningTaken: Math.random() > missRate,
    medsEveningTaken: Math.random() > missRate,
    exerciseDone: Math.random() > 0.3,
    hydrationDone: true,
    source: 'chatbot' as const,
  }))
}

const allAdherence = [
  ...msTanAdherence,
  ...limAdherence,
  ...genericAdherence('patient-003', 0.2),
  ...genericAdherence('patient-004', 0.25),
  ...genericAdherence('patient-005', 0.05),
  ...genericAdherence('patient-006', 0.15),
  ...genericAdherence('patient-007', 0.05),
  ...genericAdherence('patient-008', 0.05),
  ...genericAdherence('patient-009', 0.05),
  ...genericAdherence('patient-010', 0.05),
]

export const MOCK_ADHERENCE: AdherenceRecord[] = allAdherence.map((a, i) => ({
  ...a,
  id: `adh-${String(i + 1).padStart(4, '0')}`,
}))
