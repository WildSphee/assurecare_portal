import { useState } from 'react'
import { Calendar, Phone, Mail, User, MessageSquare, MapPin, Bot } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDate, formatRelative } from '@/lib/dateUtils'
import { usePatient } from '@/hooks/usePatient'
import { useAdherenceHistory } from '@/hooks/useAdherenceHistory'
import { MessagingModal } from '@/components/shared/MessagingModal'
import { AppointmentScheduleForm } from './AppointmentScheduleForm'

const DOT_COLORS: Record<string, string> = {
  taken: 'bg-emerald-400',
  missed: 'bg-red-400',
  no_data: 'bg-slate-200',
}

const SEVERITY_CHIP: Record<string, string> = {
  severe: 'bg-red-100 text-red-700 border border-red-200',
  moderate: 'bg-amber-100 text-amber-700 border border-amber-200',
  mild: 'bg-slate-100 text-slate-600 border border-slate-200',
}

export function DrillDownOverview({ patientId }: { patientId: string }) {
  const [showMessage, setShowMessage] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)

  const { patient, latestVitals, upcomingAppointments, patientSymptoms } = usePatient(patientId)
  const { last7 } = useAdherenceHistory(patientId, 7)

  if (!patient) return null

  const activeSymptoms = patientSymptoms
    .filter((s) => s.severity !== undefined)
    .slice(0, 3)

  const hasCaregivers = patient.caregiverIds.length > 0

  return (
    <div className="space-y-5">
      {patient.location?.area && (
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Location</p>
            <p className="text-sm text-slate-700 truncate">{patient.location.area}</p>
          </div>
        </div>
      )}

      {/* Vitals snapshot */}
      {latestVitals ? (
        <div className="bg-slate-50 rounded-lg p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Latest Vitals
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Blood Pressure</p>
              <p className="text-lg font-bold text-slate-800">
                {latestVitals.bpSystolic}/{latestVitals.bpDiastolic}
                <span className="text-xs font-normal text-slate-500 ml-1">mmHg</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Heart Rate</p>
              <p className="text-lg font-bold text-slate-800">
                {latestVitals.hrBpm}
                <span className="text-xs font-normal text-slate-500 ml-1">bpm</span>
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Recorded {formatRelative(latestVitals.recordedAt)}
          </p>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-400 italic">
          No vitals data available
        </div>
      )}

      {/* 7-day adherence */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
          Medication Adherence — Last 7 Days
        </p>
        <div className="flex items-center gap-2">
          {last7.map((status, i) => (
            <div
              key={i}
              title={
                status === 'taken'
                  ? 'Meds taken'
                  : status === 'missed'
                  ? 'Meds missed'
                  : 'No data'
              }
              className={cn('w-6 h-6 rounded-full shrink-0', DOT_COLORS[status])}
            />
          ))}
          <span className="text-xs text-slate-400 ml-1">7d</span>
        </div>
      </div>

      {/* Active symptoms */}
      {activeSymptoms.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Active Symptoms
          </p>
          <div className="flex flex-wrap gap-2">
            {activeSymptoms.map((s) => (
              <span
                key={s.id}
                className={cn(
                  'text-xs px-2.5 py-1 rounded-full font-medium',
                  SEVERITY_CHIP[s.severity] ?? 'bg-slate-100 text-slate-600 border border-slate-200'
                )}
              >
                {s.symptomType} ({s.severity})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Caregiver info */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
        <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">
          Primary Caregiver
        </p>
        {hasCaregivers ? (
          <>
            <div className="flex items-center gap-2 mb-1">
              <User className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="text-sm text-blue-800 font-medium">Ana (Family Caregiver)</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <a href="tel:+6591112222" className="text-sm text-blue-700 hover:underline">
                +65-9111-2222
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <a href="mailto:rrr.chanhiulok@gmail.com" className="text-sm text-blue-700 hover:underline">
                ana.tan23423@gmail.com
              </a>
            </div>
          </>
        ) : (
          <p className="text-sm text-blue-700 italic">No caregiver assigned</p>
        )}
      </div>

      {/* Upcoming appointments */}
      {upcomingAppointments.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Upcoming Appointments
          </p>
          <div className="space-y-2">
            {upcomingAppointments.map((appt) => (
              <div
                key={appt.id}
                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200"
              >
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">
                    {appt.reason.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </p>
                  <p className="text-xs text-slate-500">
                    {appt.scheduledAt
                      ? formatDate(appt.scheduledAt)
                      : 'Requested — awaiting scheduling'}
                  </p>
                </div>
                <span
                  className={cn(
                    'text-xs px-2 py-0.5 rounded-full font-medium shrink-0',
                    appt.status === 'scheduled'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  )}
                >
                  {appt.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 pt-1">
        <button
          onClick={() => setShowSchedule(true)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          aria-label="Call the patient through AssureBot"
        >
          <Bot className="w-4 h-4" />
          Call the Patient through AssureBot
        </button>
        <button
          onClick={() => setShowMessage(true)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
          aria-label="Send follow-up message"
        >
          <MessageSquare className="w-4 h-4" />
          Send Follow-up
        </button>
      </div>

      <MessagingModal
        open={showMessage}
        onClose={() => setShowMessage(false)}
        patientId={patientId}
        patientName={patient.name}
        senderRole="doctor"
        senderId="user-dr-chan"
      />

      <AppointmentScheduleForm
        open={showSchedule}
        onClose={() => setShowSchedule(false)}
        patientId={patientId}
        patientName={patient.name}
      />
    </div>
  )
}
