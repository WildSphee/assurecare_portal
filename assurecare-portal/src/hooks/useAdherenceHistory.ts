import { useMemo } from 'react'
import { usePatientStore } from '@/store/usePatientStore'
import { getDateRange } from '@/lib/dateUtils'
import type { TrendDataPoint } from '@/types'

export function useAdherenceHistory(patientId: string, days: 7 | 14 | 30) {
  const { adherence } = usePatientStore()

  return useMemo(() => {
    const patientAdherence = adherence.filter((a) => a.patientId === patientId)
    const adhByDate = new Map(patientAdherence.map((a) => [a.date, a]))
    const dateRange = getDateRange(days)

    const adherencePct: TrendDataPoint[] = dateRange.map((date) => {
      const record = adhByDate.get(date)
      if (!record) return { date, value: null }
      const total = 2
      const taken = [record.medsMorningTaken, record.medsEveningTaken].filter(Boolean).length
      const value = Math.round((taken / total) * 100)
      const missedDose = record.medsMorningTaken === false || record.medsEveningTaken === false
      return { date, value, highlightValue: missedDose ? value : null }
    })

    // Last 7-day adherence dots (for card display)
    const last7 = getDateRange(7).map((date) => {
      const record = adhByDate.get(date)
      if (!record) return 'no_data' as const
      const bothTaken = record.medsMorningTaken !== false && record.medsEveningTaken !== false
      return bothTaken ? ('taken' as const) : ('missed' as const)
    })

    return { adherencePct, last7 }
  }, [patientId, adherence, days])
}
