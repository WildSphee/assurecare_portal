import { useState } from 'react'
import { TrendChart } from '@/components/shared/TrendChart'
import { useVitalsHistory } from '@/hooks/useVitalsHistory'
import { useAdherenceHistory } from '@/hooks/useAdherenceHistory'

export function TrendChartsSection() {
  const [timeRange, setTimeRange] = useState<7 | 14 | 30>(14)
  const [viewMode, setViewMode] = useState<'daily' | 'rolling_avg'>('daily')

  const { bpSystolic, hrBpm } = useVitalsHistory('patient-001', timeRange)
  const { adherencePct } = useAdherenceHistory('patient-001', timeRange)

  return (
    <div id="trends">
      <h2 className="text-xl font-semibold text-slate-900 border-b border-slate-200 pb-3 mb-6">
        Health Trends
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TrendChart
          title="Blood Pressure (Systolic)"
          data={bpSystolic}
          unit="mmHg"
          color="#1E40AF"
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          referenceBand={{ lower: 90, upper: 130, label: 'Target range' }}
          referenceLines={[{ value: 140, label: 'High', color: '#ef4444' }]}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        <TrendChart
          title="Heart Rate"
          data={hrBpm}
          unit="bpm"
          color="#0891b2"
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          referenceBand={{ lower: 60, upper: 100, label: 'Normal range' }}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        <TrendChart
          title="Medication Adherence"
          data={adherencePct}
          unit="%"
          color="#16A34A"
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          referenceBand={{ lower: 80, upper: 100, label: 'Target ≥80%' }}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>
    </div>
  )
}
