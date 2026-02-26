import { cn } from '@/lib/utils'
import { REASON_CODE_LABELS } from '@/lib/reasonCodes'
import type { Patient, VitalsRecord, Alert, SymptomSignal } from '@/types'
import { Calendar, AlertTriangle, Pill, Activity, MoreHorizontal, CheckSquare, MessageSquare, MapPin } from 'lucide-react'

interface AdherenceDot {
  status: 'taken' | 'missed' | 'no_data'
}

interface PatientCardProps {
  patient: Patient
  latestVitals?: VitalsRecord | null
  adherenceLast7Days: AdherenceDot[]
  activeSymptoms: SymptomSignal[]
  latestAlert?: Alert | null
  onOpen: (id: string) => void
  onSchedule: (id: string) => void
  onAddNote: (id: string) => void
  onMarkReviewed: (id: string) => void
  onFollowUp: (id: string) => void
}

export function PatientCard({
  patient,
  latestVitals,
  adherenceLast7Days,
  activeSymptoms,
  latestAlert,
  onOpen,
  onSchedule,
  onAddNote,
  onMarkReviewed,
  onFollowUp,
}: PatientCardProps) {
  const isNoData = patient.noResponseStreak >= 2
  const topReasonLabel = latestAlert?.reasonCodes[0]
    ? REASON_CODE_LABELS[latestAlert.reasonCodes[0]]
    : null
  const topSymptom = activeSymptoms[0]
  const prioritizedSymptom =
    activeSymptoms.find((symptom) => /chest|heart|shortness/i.test(symptom.symptomType)) ?? topSymptom

  let primaryIssue = 'Stable check-in, no active issue flagged'
  let issueMeta: string | null = null
  let issueToneClass = 'bg-white/90 text-slate-900 border border-slate-300 shadow-sm'

  const shouldPrioritizeSymptom =
    Boolean(prioritizedSymptom) &&
    (!topReasonLabel || /medication missed|blood pressure trending|heart rate trending/i.test(topReasonLabel))

  if (shouldPrioritizeSymptom && prioritizedSymptom) {
    primaryIssue = `${prioritizedSymptom.symptomType} (${prioritizedSymptom.severity})`
    issueMeta = activeSymptoms.length > 1 ? `+${activeSymptoms.length - 1} more reported symptom(s)` : null
    issueToneClass = 'bg-white/90 text-slate-900 border border-slate-300 shadow-sm'
  } else if (topReasonLabel) {
    primaryIssue = topReasonLabel
    issueMeta =
      latestAlert && latestAlert.reasonCodes.length > 1
        ? `+${latestAlert.reasonCodes.length - 1} additional signal${latestAlert.reasonCodes.length > 2 ? 's' : ''}`
        : null
    if (patient.riskStatus === 'red') {
      issueToneClass = 'bg-white/90 text-slate-900 border border-slate-300 shadow-sm'
    } else if (patient.riskStatus === 'yellow') {
      issueToneClass = 'bg-white/90 text-slate-900 border border-slate-300 shadow-sm'
    }
  } else if (topSymptom) {
    primaryIssue = `${topSymptom.symptomType} (${topSymptom.severity})`
    issueMeta = activeSymptoms.length > 1 ? `+${activeSymptoms.length - 1} more reported symptom(s)` : null
    issueToneClass = 'bg-white/90 text-slate-900 border border-slate-300 shadow-sm'
  } else if (isNoData) {
    primaryIssue = `No check-in for ${patient.noResponseStreak} days`
    issueMeta = 'Follow up to confirm patient status'
    issueToneClass = 'bg-white/90 text-slate-900 border border-slate-300 shadow-sm'
  }

  const highlightIssue = /chest|heart|shortness|severe/i.test(primaryIssue)
  const adherenceSummary = adherenceLast7Days.reduce(
    (acc, dot) => {
      if (dot.status === 'taken') acc.taken += 1
      if (dot.status === 'missed') acc.missed += 1
      return acc
    },
    { taken: 0, missed: 0 }
  )

  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-slate-300 hover:border-slate-400 hover:shadow-lg transition-all cursor-pointer flex flex-col p-4 gap-4 shadow-sm',
        highlightIssue && 'ring-1 ring-red-300 shadow-red-100/80'
      )}
      onClick={() => onOpen(patient.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpen(patient.id)}
      aria-label={`Open patient details for ${patient.name}`}
    >
      <div className="flex-1 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-slate-900 text-sm leading-tight">{patient.name}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Age {patient.age} · {patient.conditions.slice(0, 2).join(' · ')}
            </p>
          </div>
          {patient.location?.area && (
            <div className="shrink-0 inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-600 shadow-sm">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span className="max-w-[120px] truncate">{patient.location.area}</span>
            </div>
          )}
        </div>

        <div className={cn('rounded-xl px-3 py-3', issueToneClass)}>
          <p className={cn('leading-tight', highlightIssue ? 'text-base font-bold text-red-800' : 'text-[15px] font-semibold')}>
            {primaryIssue}
          </p>
          {issueMeta && (
            <p className="mt-1 text-xs text-slate-500">
              {issueMeta}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-2 text-xs text-slate-600">
          {latestVitals && (
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/90 px-2.5 py-2">
              <Activity className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>BP {latestVitals.bpSystolic}/{latestVitals.bpDiastolic} · HR {latestVitals.hrBpm}</span>
            </div>
          )}

          <div className="rounded-lg border border-slate-200 bg-slate-50/90 px-2.5 py-2">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium text-slate-700">Medication adherence (7d)</span>
              </div>
              <span className="text-slate-500">
                {adherenceSummary.taken} taken{adherenceSummary.missed > 0 ? ` · ${adherenceSummary.missed} missed` : ''}
              </span>
            </div>
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
          </div>

          {isNoData && !/no check-in/i.test(primaryIssue) && (
            <div className="flex items-center gap-2 rounded-lg bg-amber-50 text-amber-700 px-2.5 py-2">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>No check-in for {patient.noResponseStreak} days</span>
            </div>
          )}
        </div>
      </div>

      <div
        className="mt-auto flex items-center justify-end gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-1 justify-end">
          <button
            onClick={() => onFollowUp(patient.id)}
            className="text-xs text-slate-600 hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-slate-100"
            title="Send follow-up message"
            aria-label={`Send follow-up to ${patient.name}`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onSchedule(patient.id)}
            className="text-xs text-slate-600 hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-slate-100"
            title="Schedule appointment"
            aria-label={`Schedule appointment for ${patient.name}`}
          >
            <Calendar className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onAddNote(patient.id)}
            className="text-xs text-slate-600 hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-slate-100"
            title="Add note"
            aria-label={`Add note for ${patient.name}`}
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onMarkReviewed(patient.id)}
            className="text-xs text-slate-600 hover:text-emerald-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
            title="Mark reviewed"
            aria-label={`Mark ${patient.name} as reviewed`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
