import { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { usePatientStore } from '@/store/usePatientStore'
import { useAppointmentStore } from '@/store/useAppointmentStore'
import { useUIStore } from '@/store/useUIStore'
import { useActionLogStore } from '@/store/useActionLogStore'
import { cn, getRiskColor, getRiskLabel } from '@/lib/utils'
import { formatRelative, formatDate } from '@/lib/dateUtils'
import { REASON_CODE_LABELS } from '@/lib/reasonCodes'
import { MessagingModal } from '@/components/shared/MessagingModal'
import { Calendar, MessageSquare, StickyNote, CheckSquare } from 'lucide-react'
import { toast } from 'sonner'
import type { Patient } from '@/types'

const RISK_DOT: Record<string, string> = {
  red: 'bg-red-500',
  yellow: 'bg-amber-400',
  green: 'bg-emerald-500',
}

const RISK_ORDER: Record<string, number> = { red: 0, yellow: 1, green: 2 }

export function PatientTable() {
  const { patients, alerts } = usePatientStore()
  const { appointments } = useAppointmentStore()
  const { searchQuery, activeFilters, sortOrder, setSelectedPatient, clearFilters } = useUIStore()
  const { logAction } = useActionLogStore()

  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkMessageOpen, setBulkMessageOpen] = useState(false)
  const [bulkMessagePatient, setBulkMessagePatient] = useState<Patient | null>(null)

  const alertByPatient = useMemo(
    () =>
      new Map(
        patients.map((p) => {
          const a = alerts
            .filter((al) => al.patientId === p.id && al.status === 'open')
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]
          return [p.id, a ?? null]
        })
      ),
    [patients, alerts]
  )

  const nextApptByPatient = useMemo(
    () =>
      new Map(
        patients.map((p) => {
          const appt = appointments
            .filter(
              (a) =>
                a.patientId === p.id &&
                (a.status === 'scheduled' || a.status === 'requested')
            )
            .sort((a, b) =>
              (a.scheduledAt ?? a.requestedAt).localeCompare(b.scheduledAt ?? b.requestedAt)
            )[0]
          return [p.id, appt ?? null]
        })
      ),
    [patients, appointments]
  )

  const filteredRows = useMemo(() => {
    let rows = patients

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      rows = rows.filter((p) => p.name.toLowerCase().includes(q))
    }

    if (activeFilters.length > 0) {
      rows = rows.filter((p) =>
        activeFilters.every((f) => {
          if (f === 'Red') return p.riskStatus === 'red'
          if (f === 'Yellow') return p.riskStatus === 'yellow'
          if (f === 'No data >48h') return p.noResponseStreak >= 2
          if (f === 'Post-discharge')
            return p.conditions.some(
              (c) =>
                c.toLowerCase().includes('post-discharge') ||
                c.toLowerCase().includes('post discharge')
            )
          if (f === 'Hypertension')
            return p.conditions.some((c) => c.toLowerCase().includes('hypertension'))
          return true
        })
      )
    }

    return [...rows].sort((a, b) => {
      if (sortOrder === 'risk_desc')
        return (RISK_ORDER[a.riskStatus] ?? 3) - (RISK_ORDER[b.riskStatus] ?? 3)
      if (sortOrder === 'newest_alerts') {
        const aT = alertByPatient.get(a.id)?.createdAt ?? '0'
        const bT = alertByPatient.get(b.id)?.createdAt ?? '0'
        return bT.localeCompare(aT)
      }
      if (sortOrder === 'upcoming_appointments') {
        const aAppt = nextApptByPatient.get(a.id)
        const bAppt = nextApptByPatient.get(b.id)
        const aD = aAppt?.scheduledAt ?? aAppt?.requestedAt ?? '9999'
        const bD = bAppt?.scheduledAt ?? bAppt?.requestedAt ?? '9999'
        return aD.localeCompare(bD)
      }
      return 0
    })
  }, [patients, searchQuery, activeFilters, sortOrder, alertByPatient, nextApptByPatient])

  const allSelected = filteredRows.length > 0 && filteredRows.every((p) => selected.has(p.id))
  const someSelected = selected.size > 0

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filteredRows.map((p) => p.id)))
    }
  }

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleBulkReviewed = () => {
    selected.forEach((id) => {
      logAction('user-dr-chan', 'doctor', id, 'mark_reviewed', {})
    })
    toast.success(`${selected.size} patients marked as reviewed`)
    setSelected(new Set())
  }

  if (filteredRows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400 px-6">
        <p className="text-base font-medium mb-1 text-slate-500">No patients match your filters</p>
        <button onClick={clearFilters} className="text-sm text-primary hover:underline font-medium mt-2">
          Clear all filters
        </button>
      </div>
    )
  }

  return (
    <div className="px-6 py-4">
      {/* Bulk action bar */}
      {someSelected && (
        <div className="mb-3 flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-lg px-4 py-2.5">
          <span className="text-sm font-medium text-slate-700">
            {selected.size} patient{selected.size > 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => {
                const firstId = [...selected][0]
                const firstPatient = patients.find((p) => p.id === firstId)
                if (firstPatient) {
                  setBulkMessagePatient(firstPatient)
                  setBulkMessageOpen(true)
                }
              }}
              className="flex items-center gap-1.5 text-xs bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-50 transition-colors font-medium"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Message selected ({selected.size})
            </button>
            <button
              onClick={handleBulkReviewed}
              className="flex items-center gap-1.5 text-xs bg-emerald-50 border border-emerald-300 text-emerald-700 px-3 py-1.5 rounded-md hover:bg-emerald-100 transition-colors font-medium"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              Mark reviewed
            </button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-10 pl-4">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={toggleAll}
                  aria-label="Select all patients"
                />
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase text-slate-500">
                Patient
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase text-slate-500">
                Risk Reason
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase text-slate-500">
                Last Update
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase text-slate-500">
                Next Appointment
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase text-slate-500 text-right pr-4">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRows.map((patient) => {
              const latestAlert = alertByPatient.get(patient.id)
              const nextAppt = nextApptByPatient.get(patient.id)
              const topReason = latestAlert?.reasonCodes[0]
              const isSelected = selected.has(patient.id)

              return (
                <TableRow
                  key={patient.id}
                  className={cn(
                    'cursor-pointer hover:bg-slate-50 transition-colors',
                    isSelected && 'bg-primary/5'
                  )}
                  onClick={() => setSelectedPatient(patient.id)}
                >
                  <TableCell
                    className="pl-4"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleOne(patient.id)
                    }}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleOne(patient.id)}
                      aria-label={`Select ${patient.name}`}
                    />
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn('w-2.5 h-2.5 rounded-full shrink-0', RISK_DOT[patient.riskStatus])}
                      />
                      <div>
                        <p className="font-medium text-sm text-slate-900">{patient.name}</p>
                        <p className="text-xs text-slate-500">
                          Age {patient.age} ·{' '}
                          <span className={cn('font-medium', getRiskColor(patient.riskStatus))}>
                            {getRiskLabel(patient.riskStatus)}
                          </span>
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    {topReason ? (
                      <span className="text-xs text-slate-600">
                        {REASON_CODE_LABELS[topReason]}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No active alerts</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <span className="text-xs text-slate-500">
                      {formatRelative(patient.lastCheckinAt)}
                    </span>
                  </TableCell>

                  <TableCell>
                    {nextAppt ? (
                      <span className="text-xs text-slate-600">
                        {nextAppt.scheduledAt
                          ? formatDate(nextAppt.scheduledAt)
                          : 'Requested'}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </TableCell>

                  <TableCell
                    className="text-right pr-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedPatient(patient.id)}
                        className="text-xs text-primary hover:underline font-medium px-2 py-1"
                        aria-label={`Open ${patient.name} details`}
                      >
                        Open
                      </button>
                      <button
                        onClick={() => setSelectedPatient(patient.id)}
                        className="p-1.5 text-slate-400 hover:text-primary rounded hover:bg-slate-100 transition-colors"
                        title="Schedule appointment"
                        aria-label={`Schedule appointment for ${patient.name}`}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setSelectedPatient(patient.id)}
                        className="p-1.5 text-slate-400 hover:text-primary rounded hover:bg-slate-100 transition-colors"
                        title="Add note"
                        aria-label={`Add note for ${patient.name}`}
                      >
                        <StickyNote className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Bulk messaging modal */}
      {bulkMessagePatient && (
        <MessagingModal
          open={bulkMessageOpen}
          onClose={() => {
            setBulkMessageOpen(false)
            setBulkMessagePatient(null)
          }}
          patientId={bulkMessagePatient.id}
          patientName={`${selected.size} selected patients`}
          senderRole="doctor"
          senderId="user-dr-chan"
        />
      )}
    </div>
  )
}
