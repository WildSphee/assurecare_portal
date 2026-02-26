import { useMemo, useState, useEffect } from 'react'
import { usePatientStore } from '@/store/usePatientStore'
import { useAppointmentStore } from '@/store/useAppointmentStore'
import { useUIStore } from '@/store/useUIStore'
import { useActionLogStore } from '@/store/useActionLogStore'
import { PatientCard } from './PatientCard'
import { SkeletonCard } from '@/components/shared/SkeletonCard'
import { getDateRange } from '@/lib/dateUtils'
import { REASON_CODE_LABELS } from '@/lib/reasonCodes'
import { cn } from '@/lib/utils'
import type { Patient, VitalsRecord, SymptomSignal, Alert, Appointment, RiskLevel, AISummary } from '@/types'
import { toast } from 'sonner'
import { Sparkles, Users } from 'lucide-react'

const RISK_ORDER: Record<string, number> = { red: 0, yellow: 1, green: 2 }

const BOARD_COLUMNS: Array<{
  risk: RiskLevel
  title: string
  subtitle: string
  columnClass: string
  badgeClass: string
}> = [
  {
    risk: 'red',
    title: 'Priority Review',
    subtitle: 'Severe symptoms or high-risk signals',
    columnClass: 'border-red-300 bg-red-50',
    badgeClass: 'bg-red-100 text-red-700 border-red-300',
  },
  {
    risk: 'yellow',
    title: 'Monitor',
    subtitle: 'Needs follow-up soon',
    columnClass: 'border-amber-300 bg-amber-50',
    badgeClass: 'bg-amber-100 text-amber-700 border-amber-300',
  },
  {
    risk: 'green',
    title: 'Stable',
    subtitle: 'No immediate concerns',
    columnClass: 'border-emerald-300 bg-emerald-50',
    badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  },
]

interface PatientRowData {
  patient: Patient
  latestVitals: VitalsRecord | null
  adherenceLast7Days: { status: 'taken' | 'missed' | 'no_data' }[]
  activeSymptoms: SymptomSignal[]
  latestAlert: Alert | null
  nextAppointment: Appointment | null
}

export function PatientCardGrid() {
  const { patients, alerts, vitals, adherence, symptoms, aiSummaries } = usePatientStore()
  const { appointments } = useAppointmentStore()
  const { searchQuery, activeFilters, sortOrder, setSelectedPatient, clearFilters } = useUIStore()
  const { logAction } = useActionLogStore()

  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  const last7Dates = useMemo(() => getDateRange(7), [])

  const patientData = useMemo<PatientRowData[]>(() => {
    return patients.map((patient) => {
      const patientVitals = vitals
        .filter((v) => v.patientId === patient.id)
        .sort((a, b) => b.date.localeCompare(a.date))
      const latestVitals = patientVitals[0] ?? null

      const patientAdherence = adherence.filter((a) => a.patientId === patient.id)
      const adhByDate = new Map(patientAdherence.map((a) => [a.date, a]))
      const adherenceLast7Days = last7Dates.map((date) => {
        const record = adhByDate.get(date)
        if (!record) return { status: 'no_data' as const }
        const bothTaken = record.medsMorningTaken !== false && record.medsEveningTaken !== false
        return { status: bothTaken ? ('taken' as const) : ('missed' as const) }
      })

      const activeSymptoms = symptoms
        .filter((s) => s.patientId === patient.id)
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 3)

      const patientAlerts = alerts
        .filter((a) => a.patientId === patient.id && a.status === 'open')
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      const latestAlert = patientAlerts[0] ?? null

      const nextAppointment =
        appointments
          .filter(
            (a) =>
              a.patientId === patient.id &&
              (a.status === 'scheduled' || a.status === 'requested')
          )
          .sort((a, b) =>
            (a.scheduledAt ?? a.requestedAt).localeCompare(b.scheduledAt ?? b.requestedAt)
          )[0] ?? null

      return { patient, latestVitals, adherenceLast7Days, activeSymptoms, latestAlert, nextAppointment }
    })
  }, [patients, vitals, adherence, symptoms, alerts, appointments, last7Dates])

  const filteredAndSorted = useMemo<PatientRowData[]>(() => {
    let result = patientData

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter((d) => d.patient.name.toLowerCase().includes(q))
    }

    if (activeFilters.length > 0) {
      result = result.filter(({ patient }) =>
        activeFilters.every((filter) => {
          if (filter === 'Red') return patient.riskStatus === 'red'
          if (filter === 'Yellow') return patient.riskStatus === 'yellow'
          if (filter === 'No data >48h') return patient.noResponseStreak >= 2
          if (filter === 'Post-discharge')
            return patient.conditions.some(
              (c) =>
                c.toLowerCase().includes('post-discharge') ||
                c.toLowerCase().includes('post discharge')
            )
          if (filter === 'Hypertension')
            return patient.conditions.some((c) => c.toLowerCase().includes('hypertension'))
          return true
        })
      )
    }

    const sorted = [...result].sort((a, b) => {
      if (sortOrder === 'risk_desc')
        return (RISK_ORDER[a.patient.riskStatus] ?? 3) - (RISK_ORDER[b.patient.riskStatus] ?? 3)
      if (sortOrder === 'newest_alerts') {
        const aT = a.latestAlert?.createdAt ?? '0'
        const bT = b.latestAlert?.createdAt ?? '0'
        return bT.localeCompare(aT)
      }
      if (sortOrder === 'upcoming_appointments') {
        const aD = a.nextAppointment?.scheduledAt ?? a.nextAppointment?.requestedAt ?? '9999'
        const bD = b.nextAppointment?.scheduledAt ?? b.nextAppointment?.requestedAt ?? '9999'
        return aD.localeCompare(bD)
      }
      return 0
    })

    return sorted
  }, [patientData, searchQuery, activeFilters, sortOrder])

  const groupedPatients = useMemo(() => {
    return {
      red: filteredAndSorted.filter((item) => item.patient.riskStatus === 'red'),
      yellow: filteredAndSorted.filter((item) => item.patient.riskStatus === 'yellow'),
      green: filteredAndSorted.filter((item) => item.patient.riskStatus === 'green'),
    } as const
  }, [filteredAndSorted])

  const latestClinicalSummaryByPatient = useMemo(() => {
    const map = new Map<string, AISummary>()
    for (const summary of aiSummaries) {
      if (summary.summaryType !== 'clinical') continue
      const prev = map.get(summary.patientId)
      if (!prev || summary.generatedAt > prev.generatedAt) {
        map.set(summary.patientId, summary)
      }
    }
    return map
  }, [aiSummaries])

  const portfolioInsight = useMemo(() => {
    const total = filteredAndSorted.length
    const red = groupedPatients.red.length
    const yellow = groupedPatients.yellow.length
    const green = groupedPatients.green.length
    const noResponse = filteredAndSorted.filter(({ patient }) => patient.noResponseStreak >= 2).length
    const openAlerts = filteredAndSorted.filter(({ latestAlert }) => Boolean(latestAlert)).length
    const issueCount = filteredAndSorted.filter(
      ({ patient, latestAlert }) =>
        patient.riskStatus !== 'green' || Boolean(latestAlert) || patient.noResponseStreak >= 2
    ).length
    const stableCount = Math.max(0, total - issueCount)

    const topPriorityPatient =
      filteredAndSorted.find(({ patient }) => patient.riskStatus === 'red') ??
      filteredAndSorted.find(({ patient }) => patient.riskStatus === 'yellow') ??
      filteredAndSorted[0]

    const topSummary = topPriorityPatient
      ? latestClinicalSummaryByPatient.get(topPriorityPatient.patient.id) ?? null
      : null

    const topAlertReason = topPriorityPatient?.latestAlert?.reasonCodes[0]
      ? REASON_CODE_LABELS[topPriorityPatient.latestAlert.reasonCodes[0]]
      : null
    const topSymptom = topPriorityPatient?.activeSymptoms[0]

    const highlight =
      topSummary?.highlights[0] ??
      (topSymptom ? `${topSymptom.symptomType} (${topSymptom.severity}) reported` : null) ??
      topAlertReason ??
      (noResponse > 0 ? `${noResponse} patient${noResponse > 1 ? 's' : ''} with no response >48h` : null) ??
      'Most patients are stable with no urgent deterioration signal today.'

    const narrative =
      total === 0
        ? 'No patient records match the current filters.'
        : issueCount === 0
          ? `All ${total} visible patients are stable today with no open alert signals. Continue routine monitoring and scheduled follow-up.`
          : `${issueCount} of ${total} visible patients need attention (${red} priority, ${yellow} monitor). ${noResponse > 0 ? `${noResponse} have no response >48h. ` : ''}${topPriorityPatient ? `Top focus: ${topPriorityPatient.patient.name}.` : ''}`

    return {
      total,
      red,
      yellow,
      green,
      noResponse,
      openAlerts,
      issueCount,
      stableCount,
      highlight,
      narrative,
      generatedAt:
        filteredAndSorted
          .map(({ patient }) => latestClinicalSummaryByPatient.get(patient.id)?.generatedAt)
          .filter(Boolean)
          .sort()
          .at(-1) ?? null,
    }
  }, [filteredAndSorted, groupedPatients, latestClinicalSummaryByPatient])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5 sm:p-6 bg-slate-50">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (filteredAndSorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <Users className="w-12 h-12 mb-4 opacity-30" />
        <p className="text-base font-medium mb-1 text-slate-500">No patients match your filters</p>
        <p className="text-sm mb-4">Try adjusting search or filter criteria</p>
        <button
          onClick={clearFilters}
          className="text-sm text-primary hover:underline font-medium"
        >
          Clear all filters
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 bg-slate-50">
      <section className="mb-2 rounded-2xl border border-violet-300 bg-violet-50 p-3 shadow-[0_10px_28px_-20px_rgba(124,58,237,0.35)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/80 bg-white/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-violet-800">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Insight</span>
            </div>
            <p className="mt-1 text-sm text-violet-900/80">
              {portfolioInsight.narrative}
            </p>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-white/75 px-2.5 py-1 text-xs text-slate-700">
            Total <span className="font-semibold text-violet-950">{portfolioInsight.total}</span>
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-white/75 px-2.5 py-1 text-xs text-slate-700">
            Issues <span className="font-semibold text-red-700">{portfolioInsight.issueCount}</span>
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-white/75 px-2.5 py-1 text-xs text-slate-700">
            Stable <span className="font-semibold text-emerald-700">{portfolioInsight.stableCount}</span>
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-white/75 px-2.5 py-1 text-xs text-slate-700">
            No response &gt;48h <span className="font-semibold text-amber-700">{portfolioInsight.noResponse}</span>
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/75 px-2.5 py-1 text-xs text-slate-700">
            Open alerts <span className="font-semibold text-slate-900">{portfolioInsight.openAlerts}</span>
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/75 px-2.5 py-1 text-xs text-slate-700">
            Priority <span className="font-semibold text-red-700">{portfolioInsight.red}</span>
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/75 px-2.5 py-1 text-xs text-slate-700">
            Monitor <span className="font-semibold text-amber-700">{portfolioInsight.yellow}</span>
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/75 px-2.5 py-1 text-xs text-slate-700">
            Stable group <span className="font-semibold text-emerald-700">{portfolioInsight.green}</span>
          </span>
        </div>
      </section>

      <div className="mb-2 h-px bg-slate-300/80" aria-hidden="true" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {BOARD_COLUMNS.map((column) => {
          const columnPatients = groupedPatients[column.risk]

          return (
            <section
              key={column.risk}
              className={cn('rounded-2xl border p-4 shadow-md min-h-[520px]', column.columnClass)}
              aria-label={`${column.title} patient column`}
            >
              <div className="mb-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{column.title}</h3>
                    <p className="text-xs text-slate-500">{column.subtitle}</p>
                  </div>
                  <span
                    className={cn(
                      'inline-flex items-center justify-center min-w-7 h-7 rounded-full border px-2 text-xs font-semibold',
                      column.badgeClass
                    )}
                  >
                    {columnPatients.length}
                  </span>
                </div>
              </div>

              <div className="space-y-3 min-h-16">
                {columnPatients.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-400/70 bg-white/85 p-4 text-xs text-slate-600">
                    No patients in this category.
                  </div>
                ) : (
                  columnPatients.map(({ patient, latestVitals, adherenceLast7Days, activeSymptoms, latestAlert }) => (
                    <PatientCard
                      key={patient.id}
                      patient={patient}
                      latestVitals={latestVitals}
                      adherenceLast7Days={adherenceLast7Days}
                      activeSymptoms={activeSymptoms}
                      latestAlert={latestAlert}
                      onOpen={(id) => setSelectedPatient(id)}
                      onSchedule={(id) => {
                        setSelectedPatient(id)
                        toast.info('Opening patient details to schedule appointment')
                      }}
                      onAddNote={(id) => {
                        setSelectedPatient(id)
                        toast.info('Opening patient details to add note')
                      }}
                      onMarkReviewed={(id) => {
                        logAction('user-dr-chan', 'doctor', id, 'mark_reviewed', {})
                        toast.success(`${patient.name} marked as reviewed`)
                      }}
                      onFollowUp={(id) => {
                        setSelectedPatient(id)
                        toast.info('Opening patient details to send follow-up message')
                      }}
                    />
                  ))
                )}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
