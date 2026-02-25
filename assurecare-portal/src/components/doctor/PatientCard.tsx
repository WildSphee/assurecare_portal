import { cn, getRiskBorderColor, getRiskColor, getRiskLabel } from '@/lib/utils'
import { formatRelative } from '@/lib/dateUtils'
import { REASON_CODE_LABELS } from '@/lib/reasonCodes'
import type { Patient, VitalsRecord, Appointment, Alert, SymptomSignal } from '@/types'
import { Calendar, AlertTriangle, Pill, Activity, MoreHorizontal, CheckSquare, MessageSquare } from 'lucide-react'

interface AdherenceDot {
  status: 'taken' | 'missed' | 'no_data'
}

interface PatientCardProps {
  patient: Patient
  latestVitals?: VitalsRecord | null
  adherenceLast7Days: AdherenceDot[]
  activeSymptoms: SymptomSignal[]
  nextAppointment?: Appointment | null
  latestAlert?: Alert | null
  onOpen: (id: string) => void
  onSchedule: (id: string) => void
  onAddNote: (id: string) => void
  onMarkReviewed: (id: string) => void
  onFollowUp: (id: string) => void
}

const RISK_BG: Record<string, string> = {
  red: 'bg-red-500',
  yellow: 'bg-amber-400',
  green: 'bg-emerald-500',
}

export function PatientCard({
  patient,
  latestVitals,
  adherenceLast7Days,
  activeSymptoms,
  nextAppointment,
  latestAlert,
  onOpen,
  onSchedule,
  onAddNote,
  onMarkReviewed,
  onFollowUp,
}: PatientCardProps) {
  const aiLabel = latestAlert
    ? latestAlert.reasonCodes
        .slice(0, 2)
        .map((c) => REASON_CODE_LABELS[c])
        .join(' + ')
    : patient.riskStatus === 'green'
      ? 'Within normal range'
      : 'Monitoring in progress'

  const isNoData = patient.noResponseStreak >= 2

  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-slate-200 border-l-4 hover:shadow-md transition-shadow cursor-pointer flex flex-col',
        getRiskBorderColor(patient.riskStatus)
      )}
      onClick={() => onOpen(patient.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpen(patient.id)}
      aria-label={`Open patient details for ${patient.name}`}
    >
      <div className="p-4 flex-1">
        {/* Top row: name + risk badge */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <p className="font-semibold text-slate-900 text-sm leading-tight">{patient.name}</p>
            <p className="text-xs text-slate-500">Age {patient.age}</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <div className={cn('w-2.5 h-2.5 rounded-full', RISK_BG[patient.riskStatus])} />
            <span className={cn('text-xs font-semibold', getRiskColor(patient.riskStatus))}>
              {getRiskLabel(patient.riskStatus)}
            </span>
          </div>
        </div>

        {/* AI Label */}
        <p className="text-xs text-slate-500 italic mb-3 leading-tight">{aiLabel}</p>

        {/* No data warning */}
        {isNoData && (
          <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 rounded-lg px-2.5 py-1.5 mb-3">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>No check-in for {patient.noResponseStreak} days</span>
          </div>
        )}

        {/* Vitals snapshot */}
        {latestVitals && (
          <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-3">
            <Activity className="w-3.5 h-3.5 text-slate-400" />
            <span>BP {latestVitals.bpSystolic}/{latestVitals.bpDiastolic} · HR {latestVitals.hrBpm} bpm</span>
          </div>
        )}

        {/* 7-day adherence dots */}
        <div className="flex items-center gap-1 mb-3">
          <Pill className="w-3.5 h-3.5 text-slate-400" />
          <div className="flex gap-1">
            {adherenceLast7Days.map((dot, i) => (
              <div
                key={i}
                title={dot.status === 'taken' ? 'Meds taken' : dot.status === 'missed' ? 'Meds missed' : 'No data'}
                className={cn(
                  'w-3.5 h-3.5 rounded-full',
                  dot.status === 'taken' && 'bg-emerald-400',
                  dot.status === 'missed' && 'bg-red-400',
                  dot.status === 'no_data' && 'bg-slate-200',
                )}
              />
            ))}
          </div>
          <span className="text-xs text-slate-400 ml-0.5">7d</span>
        </div>

        {/* Symptoms */}
        {activeSymptoms.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-amber-600 mb-3">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>
              {activeSymptoms[0].symptomType} ({activeSymptoms[0].severity})
              {activeSymptoms.length > 1 && ` +${activeSymptoms.length - 1} more`}
            </span>
          </div>
        )}

        {/* Next appointment */}
        {nextAppointment && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Appt:{' '}
              {nextAppointment.scheduledAt
                ? new Date(nextAppointment.scheduledAt).toLocaleDateString('en-SG', { month: 'short', day: 'numeric' })
                : 'Requested'}
            </span>
          </div>
        )}
      </div>

      {/* Data freshness */}
      <div className="px-4 py-2 border-t border-slate-100">
        <p className="text-xs text-slate-400">Updated {formatRelative(patient.lastCheckinAt)}</p>
      </div>

      {/* Action row */}
      <div
        className="px-3 py-2 border-t border-slate-100 flex items-center gap-1 flex-wrap"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onOpen(patient.id)}
          className="text-xs text-primary hover:underline font-medium px-2 py-1"
          aria-label={`Open ${patient.name} details`}
        >
          Open
        </button>
        <button
          onClick={() => onFollowUp(patient.id)}
          className="text-xs text-slate-600 hover:text-primary transition-colors p-1 rounded hover:bg-slate-50"
          title="Send follow-up message"
          aria-label={`Send follow-up to ${patient.name}`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onSchedule(patient.id)}
          className="text-xs text-slate-600 hover:text-primary transition-colors p-1 rounded hover:bg-slate-50"
          title="Schedule appointment"
          aria-label={`Schedule appointment for ${patient.name}`}
        >
          <Calendar className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onAddNote(patient.id)}
          className="text-xs text-slate-600 hover:text-primary transition-colors p-1 rounded hover:bg-slate-50"
          title="Add note"
          aria-label={`Add note for ${patient.name}`}
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onMarkReviewed(patient.id)}
          className="text-xs text-slate-600 hover:text-emerald-600 transition-colors p-1 rounded hover:bg-slate-50"
          title="Mark reviewed"
          aria-label={`Mark ${patient.name} as reviewed`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
