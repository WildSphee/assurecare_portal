import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
} from 'recharts'
import { cn } from '@/lib/utils'
import { formatShortDate } from '@/lib/dateUtils'
import type { TrendDataPoint } from '@/types'

interface TrendChartProps {
  title: string
  data: TrendDataPoint[]
  unit: string
  color?: string
  timeRange: 7 | 14 | 30
  onTimeRangeChange: (range: 7 | 14 | 30) => void
  referenceBand?: { lower: number; upper: number; label: string }
  referenceLines?: { value: number; label: string; color?: string }[]
  viewMode?: 'daily' | 'rolling_avg'
  onViewModeChange?: (mode: 'daily' | 'rolling_avg') => void
  height?: number
  showViewToggle?: boolean
}

function computeRollingAvg(data: TrendDataPoint[], window = 3): TrendDataPoint[] {
  return data.map((point, i) => {
    if (point.value === null) return point
    const slice = data.slice(Math.max(0, i - window + 1), i + 1)
    const validValues = slice.filter((d) => d.value !== null).map((d) => d.value as number)
    if (validValues.length === 0) return { ...point, value: null }
    return {
      ...point,
      value: Math.round((validValues.reduce((s, v) => s + v, 0) / validValues.length) * 10) / 10,
    }
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomDot(props: any) {
  const { cx, cy, payload } = props
  if (payload?.value === null) return null
  if (payload?.isOutlier) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={5} fill="#DC2626" stroke="white" strokeWidth={1.5} />
        <text x={cx} y={cy - 8} textAnchor="middle" fill="#DC2626" fontSize={9} fontWeight="bold">!</text>
      </g>
    )
  }
  return null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label, unit }: any) {
  if (!active || !payload?.length) return null
  const val = payload[0]?.value
  const isOutlier = payload[0]?.payload?.isOutlier
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-slate-700 mb-1">{formatShortDate(label)}</p>
      {val !== null && val !== undefined ? (
        <p className="text-slate-900 font-medium">
          {val} {unit}
          {isOutlier && <span className="ml-1 text-red-500">⚠ Unverified</span>}
        </p>
      ) : (
        <p className="text-slate-400 italic">No data</p>
      )}
    </div>
  )
}

export function TrendChart({
  title,
  data,
  unit,
  color = '#1E40AF',
  timeRange,
  onTimeRangeChange,
  referenceBand,
  referenceLines = [],
  viewMode = 'daily',
  onViewModeChange,
  height = 220,
  showViewToggle = true,
}: TrendChartProps) {
  const displayData = viewMode === 'rolling_avg' ? computeRollingAvg(data) : data
  const hasHighlightedSegment =
    viewMode === 'daily' && displayData.some((point) => point.highlightValue !== null && point.highlightValue !== undefined)

  // X-axis tick: show every Nth label based on range
  const tickInterval = timeRange === 7 ? 0 : timeRange === 14 ? 1 : 4

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-700">{title}</p>
          <p className="text-xs text-slate-400">{unit}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          {showViewToggle && onViewModeChange && (
            <div className="flex items-center gap-1 bg-slate-100 rounded-full p-0.5">
              {(['daily', 'rolling_avg'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => onViewModeChange(mode)}
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
          )}

          {/* Time range toggle */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-full p-0.5">
            {([7, 14, 30] as const).map((range) => (
              <button
                key={range}
                onClick={() => onTimeRangeChange(range)}
                className={cn(
                  'px-2.5 py-0.5 rounded-full text-xs font-medium transition-all',
                  timeRange === range
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                )}
                aria-label={`Show last ${range} days`}
              >
                {range}D
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={displayData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            interval={tickInterval}
            tickFormatter={(v) => formatShortDate(v)}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip content={<CustomTooltip unit={unit} />} />

          {/* Reference band */}
          {referenceBand && (
            <ReferenceArea
              y1={referenceBand.lower}
              y2={referenceBand.upper}
              fill="#dcfce7"
              fillOpacity={0.4}
              label={{
                value: referenceBand.label,
                position: 'insideTopRight',
                fontSize: 9,
                fill: '#16a34a',
              }}
            />
          )}

          {/* Reference lines */}
          {referenceLines.map((rl, i) => (
            <ReferenceLine
              key={i}
              y={rl.value}
              stroke={rl.color ?? '#94a3b8'}
              strokeDasharray="4 4"
              label={{ value: rl.label, position: 'right', fontSize: 9, fill: rl.color ?? '#94a3b8' }}
            />
          ))}

          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={<CustomDot />}
            activeDot={{ r: 4, fill: color }}
            connectNulls={false}
          />
          {hasHighlightedSegment && (
            <Line
              type="monotone"
              dataKey="highlightValue"
              stroke="#DC2626"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: '#DC2626', stroke: 'white', strokeWidth: 1 }}
              activeDot={{ r: 4, fill: '#DC2626' }}
              connectNulls={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
