import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { HelpCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricTileProps {
  title: string
  value: string | number
  unit?: string
  trendArrow?: 'up' | 'down' | 'stable'
  trendColor?: 'positive' | 'negative' | 'neutral'
  lastUpdatedAt: string
  tooltipText: string
  status?: 'normal' | 'warning' | 'alert'
  streakLabel?: string
  icon?: React.ReactNode
  subValue?: string
}

const STATUS_BORDER: Record<string, string> = {
  normal: 'border-l-emerald-400',
  warning: 'border-l-amber-400',
  alert: 'border-l-red-400',
}

const TREND_COLOR: Record<string, string> = {
  positive: 'text-emerald-600',
  negative: 'text-red-500',
  neutral: 'text-slate-400',
}

export function MetricTile({
  title,
  value,
  unit,
  trendArrow,
  trendColor = 'neutral',
  lastUpdatedAt,
  tooltipText,
  status = 'normal',
  streakLabel,
  icon,
  subValue,
}: MetricTileProps) {
  const valueText = String(value)
  const isLongValue = valueText.length > 14
  const isTroubleValue = status === 'warning' || status === 'alert'
  const formattedTime = new Date(lastUpdatedAt).toLocaleString('en-SG', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <TooltipProvider>
      <div
        className={cn(
          'bg-white rounded-xl border border-slate-200 border-l-4 p-3 hover:shadow-md transition-shadow',
          STATUS_BORDER[status]
        )}
      >
        <div className="flex items-start justify-between mb-1.5">
          <div className="flex items-center gap-1">
            {icon && <span className="text-slate-400">{icon}</span>}
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button aria-label={`Learn more about ${title}`} className="text-slate-300 hover:text-slate-500 transition-colors">
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-60 text-xs">
              {tooltipText}
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex items-end gap-1.5 mb-1 min-w-0">
          <span
            className={cn(
              'font-bold leading-tight break-words',
              isLongValue ? 'text-base sm:text-lg' : 'text-xl',
              isTroubleValue ? 'text-red-700' : 'text-slate-900'
            )}
          >
            {value}
          </span>
          {unit && (
            <span className={cn('text-sm mb-0.5', isTroubleValue ? 'text-red-500' : 'text-slate-500')}>
              {unit}
            </span>
          )}
          {trendArrow && (
            <span className={cn('mb-0.5', TREND_COLOR[trendColor])}>
              {trendArrow === 'up' && <TrendingUp className="w-4 h-4" />}
              {trendArrow === 'down' && <TrendingDown className="w-4 h-4" />}
              {trendArrow === 'stable' && <Minus className="w-4 h-4" />}
            </span>
          )}
        </div>

        {subValue && <p className="text-xs text-slate-500 mb-1">{subValue}</p>}

        <div className="flex items-center justify-between mt-1.5">
          {streakLabel && (
            <span className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full font-medium">
              {streakLabel}
            </span>
          )}
          {!streakLabel && <span />}
          <span className="text-xs text-slate-400">{formattedTime}</span>
        </div>
      </div>
    </TooltipProvider>
  )
}
