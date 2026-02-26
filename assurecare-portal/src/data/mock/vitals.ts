import type { VitalsRecord } from '@/types'

// Helper to generate ISO date strings
function d(daysAgo: number): string {
  const dt = new Date('2026-02-25T09:00:00Z')
  dt.setDate(dt.getDate() - daysAgo)
  return dt.toISOString().split('T')[0]
}

function recordedAt(daysAgo: number, hour = 9): string {
  const dt = new Date('2026-02-25T09:00:00Z')
  dt.setDate(dt.getDate() - daysAgo)
  dt.setHours(hour, 5, 0, 0)
  return dt.toISOString()
}

// Mrs Tan: vitals currently within normal range
const msTanVitals: Omit<VitalsRecord, 'id'>[] = [
  // 30 days ago
  { patientId: 'patient-001', date: d(30), recordedAt: recordedAt(30), bpSystolic: 128, bpDiastolic: 80, hrBpm: 74, source: 'chatbot', qualityFlag: 'normal' },
  { patientId: 'patient-001', date: d(29), recordedAt: recordedAt(29), bpSystolic: 126, bpDiastolic: 79, hrBpm: 76, source: 'chatbot', qualityFlag: 'normal' },
  { patientId: 'patient-001', date: d(28), recordedAt: recordedAt(28), bpSystolic: 130, bpDiastolic: 82, hrBpm: 75, source: 'chatbot', qualityFlag: 'normal' },
  { patientId: 'patient-001', date: d(27), recordedAt: recordedAt(27), bpSystolic: 127, bpDiastolic: 80, hrBpm: 73, source: 'chatbot', qualityFlag: 'normal' },
  { patientId: 'patient-001', date: d(26), recordedAt: recordedAt(26), bpSystolic: 129, bpDiastolic: 81, hrBpm: 77, source: 'chatbot', qualityFlag: 'normal' },
  // Missing day 25 (no checkin)
  { patientId: 'patient-001', date: d(24), recordedAt: recordedAt(24), bpSystolic: 131, bpDiastolic: 83, hrBpm: 78, source: 'chatbot', qualityFlag: 'normal' },
  { patientId: 'patient-001', date: d(23), recordedAt: recordedAt(23), bpSystolic: 132, bpDiastolic: 84, hrBpm: 79, source: 'chatbot', qualityFlag: 'normal' },
  // Missing day 22
  { patientId: 'patient-001', date: d(21), recordedAt: recordedAt(21), bpSystolic: 133, bpDiastolic: 84, hrBpm: 80, source: 'chatbot', qualityFlag: 'normal' },
  { patientId: 'patient-001', date: d(20), recordedAt: recordedAt(20), bpSystolic: 220, bpDiastolic: 120, hrBpm: 110, source: 'chatbot', qualityFlag: 'outlier' }, // outlier
  { patientId: 'patient-001', date: d(19), recordedAt: recordedAt(19), bpSystolic: 134, bpDiastolic: 85, hrBpm: 80, source: 'chatbot', qualityFlag: 'normal' },
  { patientId: 'patient-001', date: d(18), recordedAt: recordedAt(18), bpSystolic: 135, bpDiastolic: 86, hrBpm: 81, source: 'chatbot', qualityFlag: 'normal' },
  { patientId: 'patient-001', date: d(17), recordedAt: recordedAt(17), bpSystolic: 136, bpDiastolic: 86, hrBpm: 82, source: 'chatbot', qualityFlag: 'normal' },
  { patientId: 'patient-001', date: d(16), recordedAt: recordedAt(16), bpSystolic: 137, bpDiastolic: 87, hrBpm: 82, source: 'chatbot', qualityFlag: 'normal' },
  // Missing day 15
  { patientId: 'patient-001', date: d(14), recordedAt: recordedAt(14), bpSystolic: 138, bpDiastolic: 88, hrBpm: 83, source: 'chatbot', qualityFlag: 'normal' },
  { patientId: 'patient-001', date: d(13), recordedAt: recordedAt(13), bpSystolic: 139, bpDiastolic: 88, hrBpm: 83, source: 'chatbot', qualityFlag: 'normal' },
  { patientId: 'patient-001', date: d(12), recordedAt: recordedAt(12), bpSystolic: 140, bpDiastolic: 89, hrBpm: 84, source: 'chatbot', qualityFlag: 'normal' },
  { patientId: 'patient-001', date: d(11), recordedAt: recordedAt(11), bpSystolic: 142, bpDiastolic: 90, hrBpm: 84, source: 'chatbot', qualityFlag: 'normal' },
  { patientId: 'patient-001', date: d(10), recordedAt: recordedAt(10), bpSystolic: 132, bpDiastolic: 84, hrBpm: 79, source: 'chatbot', qualityFlag: 'normal' },
  { patientId: 'patient-001', date: d(9), recordedAt: recordedAt(9), bpSystolic: 131, bpDiastolic: 83, hrBpm: 78, source: 'chatbot', qualityFlag: 'normal' },
  { patientId: 'patient-001', date: d(8), recordedAt: recordedAt(8), bpSystolic: 129, bpDiastolic: 82, hrBpm: 77, source: 'chatbot', qualityFlag: 'normal' },
  { patientId: 'patient-001', date: d(7), recordedAt: recordedAt(7), bpSystolic: 130, bpDiastolic: 82, hrBpm: 77, source: 'chatbot', qualityFlag: 'normal' },
  { patientId: 'patient-001', date: d(6), recordedAt: recordedAt(6), bpSystolic: 128, bpDiastolic: 81, hrBpm: 76, source: 'chatbot', qualityFlag: 'normal' },
  { patientId: 'patient-001', date: d(5), recordedAt: recordedAt(5), bpSystolic: 129, bpDiastolic: 82, hrBpm: 77, source: 'chatbot', qualityFlag: 'normal' },
  { patientId: 'patient-001', date: d(4), recordedAt: recordedAt(4), bpSystolic: 127, bpDiastolic: 80, hrBpm: 75, source: 'chatbot', qualityFlag: 'normal' },
  { patientId: 'patient-001', date: d(3), recordedAt: recordedAt(3), bpSystolic: 126, bpDiastolic: 80, hrBpm: 75, source: 'chatbot', qualityFlag: 'normal' },
  { patientId: 'patient-001', date: d(2), recordedAt: recordedAt(2), bpSystolic: 127, bpDiastolic: 81, hrBpm: 76, source: 'chatbot', qualityFlag: 'normal' },
  { patientId: 'patient-001', date: d(1), recordedAt: recordedAt(1), bpSystolic: 128, bpDiastolic: 81, hrBpm: 77, source: 'chatbot', qualityFlag: 'normal' },
  { patientId: 'patient-001', date: d(0), recordedAt: recordedAt(0), bpSystolic: 126, bpDiastolic: 80, hrBpm: 76, source: 'chatbot', qualityFlag: 'normal' },
]

// Mr. Lim: elevated BP, more severe
function limVitals(): Omit<VitalsRecord, 'id'>[] {
  return Array.from({ length: 20 }, (_, i) => ({
    patientId: 'patient-002',
    date: d(20 - i),
    recordedAt: recordedAt(20 - i),
    bpSystolic: 155 + Math.round(Math.random() * 15),
    bpDiastolic: 95 + Math.round(Math.random() * 8),
    hrBpm: 88 + Math.round(Math.random() * 10),
    source: 'chatbot' as const,
    qualityFlag: 'normal' as const,
  }))
}

function genericVitals(patientId: string, baseSys: number, baseDia: number, baseHr: number): Omit<VitalsRecord, 'id'>[] {
  return Array.from({ length: 25 }, (_, i) => ({
    patientId,
    date: d(25 - i),
    recordedAt: recordedAt(25 - i),
    bpSystolic: baseSys + Math.round((Math.random() - 0.4) * 10),
    bpDiastolic: baseDia + Math.round((Math.random() - 0.4) * 6),
    hrBpm: baseHr + Math.round((Math.random() - 0.4) * 8),
    source: 'chatbot' as const,
    qualityFlag: 'normal' as const,
  }))
}

const allVitals: Omit<VitalsRecord, 'id'>[] = [
  ...msTanVitals,
  ...limVitals(),
  ...genericVitals('patient-003', 150, 92, 84),
  ...genericVitals('patient-004', 138, 86, 80),
  ...genericVitals('patient-005', 135, 84, 90),
  ...genericVitals('patient-006', 133, 82, 78),
  ...genericVitals('patient-007', 128, 80, 76),
  ...genericVitals('patient-008', 125, 78, 72),
  ...genericVitals('patient-009', 130, 80, 76),
  ...genericVitals('patient-010', 127, 79, 74),
]

export const MOCK_VITALS: VitalsRecord[] = allVitals.map((v, i) => ({
  ...v,
  id: `vitals-${String(i + 1).padStart(4, '0')}`,
}))
