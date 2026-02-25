import { useState } from 'react'
import {
  Activity,
  Pill,
  AlertCircle,
  WifiOff,
  Phone,
  Stethoscope,
  Calendar,
  ArrowUpCircle,
  ChevronDown,
  ChevronUp,
  Lock,
  Bot,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TimelineEvent } from '@/types'
import { formatDayLabel, formatTime } from '@/lib/dateUtils'

interface AlertTimelineProps {
  events: TimelineEvent[]
  daysBack: 7 | 14
  onDaysBackChange?: (d: 7 | 14) => void
  role?: 'caregiver' | 'doctor'
}

const CATEGORY_ICON: Record<TimelineEvent['category'], React.ReactNode> = {
  vitals: <Activity className="w-4 h-4" />,
  meds: <Pill className="w-4 h-4" />,
  symptom: <AlertCircle className="w-4 h-4" />,
  no_response: <WifiOff className="w-4 h-4" />,
  caregiver_action: <Phone className="w-4 h-4" />,
  doctor_action: <Stethoscope className="w-4 h-4" />,
  appointment: <Calendar className="w-4 h-4" />,
  escalation: <ArrowUpCircle className="w-4 h-4" />,
  checkin: <Bot className="w-4 h-4" />,
}

const CATEGORY_COLOR: Record<string, string> = {
  vitals: 'bg-blue-100 text-blue-600',
  meds: 'bg-purple-100 text-purple-600',
  symptom: 'bg-amber-100 text-amber-600',
  no_response: 'bg-slate-100 text-slate-600',
  caregiver_action: 'bg-rose-100 text-rose-600',
  doctor_action: 'bg-primary/10 text-primary',
  appointment: 'bg-teal-100 text-teal-600',
  escalation: 'bg-orange-100 text-orange-600',
  checkin: 'bg-slate-100 text-slate-600',
}

const SEVERITY_BORDER: Record<string, string> = {
  red: 'border-l-red-400',
  yellow: 'border-l-amber-400',
  green: 'border-l-emerald-400',
  undefined: 'border-l-slate-200',
}

function groupByDay(events: TimelineEvent[]): Map<string, TimelineEvent[]> {
  const groups = new Map<string, TimelineEvent[]>()
  for (const event of events) {
    const day = event.timestamp.split('T')[0]
    if (!groups.has(day)) groups.set(day, [])
    groups.get(day)!.push(event)
  }
  return groups
}

function EventCard({ event, role }: { event: TimelineEvent; role: 'caregiver' | 'doctor' }) {
  const [expanded, setExpanded] = useState(false)
  const isDoctorAction = event.source === 'doctor'
  const isReadOnly = role === 'caregiver' && isDoctorAction

  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-slate-200 border-l-4 p-3 hover:shadow-sm transition-shadow',
        event.severity ? SEVERITY_BORDER[event.severity] : 'border-l-slate-200'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Category icon */}
        <div className={cn('w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5', CATEGORY_COLOR[event.category])}>
          {CATEGORY_ICON[event.category]}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-slate-900 leading-tight">{event.title}</p>
            <div className="flex items-center gap-1 shrink-0">
              {isReadOnly && (
                <span title="Doctor's note — read only" className="text-slate-400">
                  <Lock className="w-3 h-3" />
                </span>
              )}
              <span className="text-xs text-slate-400">{formatTime(event.timestamp)}</span>
              {event.expandable && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                  aria-expanded={expanded}
                  aria-label={expanded ? 'Collapse event details' : 'Expand event details'}
                >
                  {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-slate-500 truncate">{event.description}</p>
            <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded capitalize shrink-0">
              {event.source}
            </span>
          </div>

          {expanded && event.notes && (
            <div className="mt-2 pt-2 border-t border-slate-100">
              <p className="text-xs text-slate-600">{event.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function AlertTimeline({ events, daysBack, onDaysBackChange, role = 'caregiver' }: AlertTimelineProps) {
  const grouped = groupByDay(events)
  const sortedDays = Array.from(grouped.keys()).sort((a, b) => b.localeCompare(a))

  return (
    <div id="timeline">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Recent Activity</h2>
        {onDaysBackChange && (
          <div className="flex items-center gap-1 bg-slate-100 rounded-full p-0.5">
            {([7, 14] as const).map((d) => (
              <button
                key={d}
                onClick={() => onDaysBackChange(d)}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium transition-all',
                  daysBack === d ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                )}
                aria-label={`Show last ${d} days`}
              >
                {d} days
              </button>
            ))}
          </div>
        )}
      </div>

      {sortedDays.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <Activity className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No events in the last {daysBack} days</p>
        </div>
      )}

      <div className="space-y-6">
        {sortedDays.map((day) => (
          <div key={day}>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 ml-1">
              {formatDayLabel(day)}
            </p>
            <div className="space-y-2">
              {grouped.get(day)!.map((event) => (
                <EventCard key={event.id} event={event} role={role} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
