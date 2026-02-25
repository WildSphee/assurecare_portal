import { useMemo, useState, useEffect } from 'react'
import { usePatientStore } from '@/store/usePatientStore'
import { useAppointmentStore } from '@/store/useAppointmentStore'
import { useUIStore } from '@/store/useUIStore'
import { useActionLogStore } from '@/store/useActionLogStore'
import { PatientCard } from './PatientCard'
import { SkeletonCard } from '@/components/shared/SkeletonCard'
import { getDateRange } from '@/lib/dateUtils'
import type { Patient, VitalsRecord, SymptomSignal, Alert, Appointment } from '@/types'
import { toast } from 'sonner'
import { Users } from 'lucide-react'

const RISK_ORDER: Record<string, number> = { red: 0, yellow: 1, green: 2 }

interface PatientRowData {
  patient: Patient
  latestVitals: VitalsRecord | null
  adherenceLast7Days: { status: 'taken' | 'missed' | 'no_data' }[]
  activeSymptoms: SymptomSignal[]
  latestAlert: Alert | null
  nextAppointment: Appointment | null
}

export function PatientCardGrid() {
  const { patients, alerts, vitals, adherence, symptoms } = usePatientStore()
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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      {filteredAndSorted.map(
        ({ patient, latestVitals, adherenceLast7Days, activeSymptoms, latestAlert, nextAppointment }) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            latestVitals={latestVitals}
            adherenceLast7Days={adherenceLast7Days}
            activeSymptoms={activeSymptoms}
            nextAppointment={nextAppointment}
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
        )
      )}
    </div>
  )
}
