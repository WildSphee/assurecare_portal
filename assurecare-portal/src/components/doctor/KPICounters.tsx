import { usePatientStore } from '@/store/usePatientStore'
import { useAppointmentStore } from '@/store/useAppointmentStore'
import { useUIStore } from '@/store/useUIStore'
import { AlertTriangle, Eye, WifiOff, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { addDays, parseISO, startOfDay } from 'date-fns'

export function KPICounters() {
  const { alerts, patients } = usePatientStore()
  const { appointments } = useAppointmentStore()
  const { toggleFilter, activeFilters } = useUIStore()

  const today = startOfDay(new Date())

  const redAlerts = alerts.filter((a) => a.severity === 'red' && a.status === 'open').length
  const yellowAlerts = alerts.filter((a) => a.severity === 'yellow' && a.status === 'open').length
  const noDataCount = patients.filter((p) => p.noResponseStreak >= 2).length
  const upcomingAppts = appointments.filter((a) => {
    if (a.status !== 'scheduled') return false
    const apptDate = parseISO(a.scheduledAt!)
    return apptDate >= today && apptDate <= addDays(today, 7)
  }).length

  const counters = [
    {
      label: 'Red Alerts Today',
      value: redAlerts,
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      activeBorder: 'border-red-500',
      filter: 'Red',
    },
    {
      label: 'Yellow Watchlist',
      value: yellowAlerts,
      icon: <Eye className="w-5 h-5" />,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      activeBorder: 'border-amber-500',
      filter: 'Yellow',
    },
    {
      label: 'No Data >48h',
      value: noDataCount,
      icon: <WifiOff className="w-5 h-5" />,
      color: 'text-slate-600',
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      activeBorder: 'border-slate-500',
      filter: 'No data >48h',
    },
    {
      label: 'Appointments Next 7 Days',
      value: upcomingAppts,
      icon: <Calendar className="w-5 h-5" />,
      color: 'text-primary',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      activeBorder: 'border-blue-500',
      filter: '',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-6 py-4 bg-white border-b border-slate-200">
      {counters.map((c) => {
        const isActive = c.filter && activeFilters.includes(c.filter)
        return (
          <button
            key={c.label}
            onClick={() => c.filter && toggleFilter(c.filter)}
            className={cn(
              'flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left',
              c.bg,
              isActive ? c.activeBorder : c.border,
              c.filter ? 'cursor-pointer hover:shadow-sm' : 'cursor-default'
            )}
            aria-label={`${c.label}: ${c.value}${c.filter ? '. Click to filter.' : ''}`}
            disabled={!c.filter}
          >
            <div className={cn('shrink-0', c.color)}>{c.icon}</div>
            <div>
              <p className={cn('text-2xl font-bold leading-none', c.color)}>{c.value}</p>
              <p className="text-xs text-slate-500 mt-0.5 leading-tight">{c.label}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
