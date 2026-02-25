import { useMemo } from 'react'
import { usePatientStore } from '@/store/usePatientStore'
import { getDateRange } from '@/lib/dateUtils'
import type { TrendDataPoint } from '@/types'

export function useVitalsHistory(patientId: string, days: 7 | 14 | 30) {
  const { vitals } = usePatientStore()

  return useMemo(() => {
    const patientVitals = vitals.filter((v) => v.patientId === patientId)
    const vitalsByDate = new Map(patientVitals.map((v) => [v.date, v]))
    const dateRange = getDateRange(days)

    const bpSystolic: TrendDataPoint[] = dateRange.map((date) => {
      const record = vitalsByDate.get(date)
      return {
        date,
        value: record ? record.bpSystolic : null,
        isOutlier: record?.qualityFlag === 'outlier',
      }
    })

    const bpDiastolic: TrendDataPoint[] = dateRange.map((date) => {
      const record = vitalsByDate.get(date)
      return {
        date,
        value: record ? record.bpDiastolic : null,
        isOutlier: record?.qualityFlag === 'outlier',
      }
    })

    const hrBpm: TrendDataPoint[] = dateRange.map((date) => {
      const record = vitalsByDate.get(date)
      return {
        date,
        value: record ? record.hrBpm : null,
        isOutlier: record?.qualityFlag === 'outlier',
      }
    })

    return { bpSystolic, bpDiastolic, hrBpm }
  }, [patientId, vitals, days])
}
