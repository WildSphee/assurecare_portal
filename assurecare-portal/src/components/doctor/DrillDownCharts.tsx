import { useState } from 'react'
import { TrendChart } from '@/components/shared/TrendChart'
import { useVitalsHistory } from '@/hooks/useVitalsHistory'
import { useAdherenceHistory } from '@/hooks/useAdherenceHistory'
import { cn } from '@/lib/utils'

export function DrillDownCharts({ patientId }: { patientId: string }) {
  const [timeRange, setTimeRange] = useState<7 | 14 | 30>(14)
  const [viewMode, setViewMode] = useState<'daily' | 'rolling_avg'>('daily')

  const { bpSystolic, bpDiastolic, hrBpm } = useVitalsHistory(patientId, timeRange)
  const { adherencePct } = useAdherenceHistory(patientId, timeRange)

  return (
    <div className="space-y-4">
      {/* Global controls */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">Health Trends</p>
        <div className="flex items-center gap-2">
          {/* View mode */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-full p-0.5">
            {(['daily', 'rolling_avg'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-medium transition-all',
                  viewMode === mode
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                )}
              >
                {mode === 'daily' ? 'Daily' : '3-day avg'}
              </button>
            ))}
          </div>

          {/* Time range */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-full p-0.5">
            {([7, 14, 30] as const).map((d) => (
              <button
                key={d}
                onClick={() => setTimeRange(d)}
                className={cn(
                  'px-2.5 py-0.5 rounded-full text-xs font-medium transition-all',
                  timeRange === d
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                )}
                aria-label={`Show last ${d} days`}
              >
                {d}D
              </button>
            ))}
          </div>
        </div>
      </div>

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
        showViewToggle={false}
        height={180}
      />

      <TrendChart
        title="Blood Pressure (Diastolic)"
        data={bpDiastolic}
        unit="mmHg"
        color="#F97316"
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        referenceBand={{ lower: 60, upper: 85, label: 'Normal range' }}
        viewMode={viewMode}
        showViewToggle={false}
        height={180}
      />

      <TrendChart
        title="Heart Rate"
        data={hrBpm}
        unit="bpm"
        color="#8B5CF6"
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        referenceBand={{ lower: 60, upper: 100, label: 'Normal range' }}
        viewMode={viewMode}
        showViewToggle={false}
        height={180}
      />

      <TrendChart
        title="Medication Adherence"
        data={adherencePct}
        unit="%"
        color="#10B981"
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        referenceBand={{ lower: 80, upper: 100, label: 'Target ≥80%' }}
        viewMode={viewMode}
        showViewToggle={false}
        height={180}
      />
    </div>
  )
}
