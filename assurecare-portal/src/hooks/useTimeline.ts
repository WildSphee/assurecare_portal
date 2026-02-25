import { useMemo } from 'react'
import { usePatientStore } from '@/store/usePatientStore'
import { useActionLogStore } from '@/store/useActionLogStore'
import { useAppointmentStore } from '@/store/useAppointmentStore'
import type { TimelineEvent } from '@/types'
import { getDateRange } from '@/lib/dateUtils'

export function useTimeline(patientId: string, daysBack: 7 | 14): TimelineEvent[] {
  const { vitals, adherence, symptoms, alerts, messages, escalations, doctorNotes, caregiverNotes } =
    usePatientStore()
  const { entries: actionLog } = useActionLogStore()
  const { appointments } = useAppointmentStore()

  return useMemo(() => {
    const dateRange = new Set(getDateRange(daysBack))
    const events: TimelineEvent[] = []

    // Vitals events
    vitals
      .filter((v) => v.patientId === patientId && dateRange.has(v.date))
      .forEach((v) => {
        events.push({
          id: `tl-vitals-${v.id}`,
          timestamp: v.recordedAt,
          category: 'vitals',
          title: `BP ${v.bpSystolic}/${v.bpDiastolic} mmHg · HR ${v.hrBpm} bpm`,
          description: `Vitals recorded via chatbot check-in${v.qualityFlag === 'outlier' ? ' ⚠ Unverified reading' : ''}`,
          source: 'chatbot',
          severity: v.bpSystolic >= 150 ? 'red' : v.bpSystolic >= 140 ? 'yellow' : 'green',
          expandable: true,
          notes: v.qualityFlag === 'outlier' ? 'This reading has been flagged as potentially inaccurate.' : undefined,
        })
      })

    // Adherence events (only flagged misses)
    adherence
      .filter((a) => a.patientId === patientId && dateRange.has(a.date))
      .forEach((a) => {
        const missedMorning = a.medsMorningTaken === false
        const missedEvening = a.medsEveningTaken === false
        if (missedMorning || missedEvening) {
          events.push({
            id: `tl-adh-${a.id}`,
            timestamp: `${a.date}T08:30:00Z`,
            category: 'meds',
            title: missedMorning && missedEvening ? 'Both medications missed' : missedMorning ? 'Morning medication missed' : 'Evening medication missed',
            description: 'Medication not taken as reported during daily check-in',
            source: 'chatbot',
            severity: 'yellow',
            expandable: true,
          })
        } else if (a.medsMorningTaken && a.medsEveningTaken) {
          events.push({
            id: `tl-adh-ok-${a.id}`,
            timestamp: `${a.date}T08:30:00Z`,
            category: 'meds',
            title: 'All medications taken',
            description: 'Morning and evening medications confirmed via check-in',
            source: 'chatbot',
            severity: 'green',
            expandable: false,
          })
        }
      })

    // Symptom events
    symptoms
      .filter((s) => s.patientId === patientId && dateRange.has(s.date))
      .forEach((s) => {
        events.push({
          id: `tl-sym-${s.id}`,
          timestamp: `${s.date}T09:00:00Z`,
          category: 'symptom',
          title: `${s.symptomType} reported — ${s.severity}`,
          description: `Patient reported ${s.symptomType.toLowerCase()} (${s.severity} severity) during daily check-in`,
          source: 'chatbot',
          severity: s.severity === 'severe' ? 'red' : s.severity === 'moderate' ? 'yellow' : 'green',
          expandable: true,
        })
      })

    // Alert events
    alerts
      .filter((a) => a.patientId === patientId && dateRange.has(a.createdAt.split('T')[0]))
      .forEach((a) => {
        events.push({
          id: `tl-alert-${a.id}`,
          timestamp: a.createdAt,
          category: a.severity === 'red' ? 'escalation' : 'escalation',
          title: `Risk status changed to ${a.severity === 'red' ? 'Red' : 'Yellow'}`,
          description: a.evidencePointers.map((e) => e.description).join('; '),
          source: 'system',
          severity: a.severity,
          expandable: true,
        })
      })

    // Messages
    messages
      .filter((m) => m.patientId === patientId && dateRange.has(m.sentAt.split('T')[0]))
      .forEach((m) => {
        events.push({
          id: `tl-msg-${m.id}`,
          timestamp: m.sentAt,
          category: m.senderRole === 'doctor' ? 'doctor_action' : 'caregiver_action',
          title: `Message sent via chatbot device`,
          description: m.content,
          source: m.senderRole,
          expandable: true,
        })
      })

    // Escalations
    escalations
      .filter((e) => e.patientId === patientId && dateRange.has(e.createdAt.split('T')[0]))
      .forEach((e) => {
        events.push({
          id: `tl-esc-${e.id}`,
          timestamp: e.createdAt,
          category: 'escalation',
          title: `Escalation initiated`,
          description: e.notes ?? 'Case escalated for medical review',
          source: 'caregiver',
          severity: 'yellow',
          expandable: true,
        })
      })

    // Doctor notes
    doctorNotes
      .filter((n) => n.patientId === patientId && dateRange.has(n.createdAt.split('T')[0]))
      .forEach((n) => {
        events.push({
          id: `tl-dnote-${n.id}`,
          timestamp: n.createdAt,
          category: 'doctor_action',
          title: 'Doctor note added',
          description: n.content.slice(0, 120) + (n.content.length > 120 ? '...' : ''),
          source: 'doctor',
          expandable: true,
          notes: n.content,
        })
      })

    // Caregiver notes
    caregiverNotes
      .filter((n) => n.patientId === patientId && dateRange.has(n.createdAt.split('T')[0]))
      .forEach((n) => {
        events.push({
          id: `tl-cnote-${n.id}`,
          timestamp: n.createdAt,
          category: 'caregiver_action',
          title: 'Caregiver note added',
          description: n.content.slice(0, 120) + (n.content.length > 120 ? '...' : ''),
          source: 'caregiver',
          expandable: true,
        })
      })

    // Action log events
    actionLog
      .filter((e) => e.patientId === patientId && dateRange.has(e.timestamp.split('T')[0]))
      .forEach((e) => {
        if (e.actionType === 'call_initiated') {
          events.push({
            id: `tl-log-${e.id}`,
            timestamp: e.timestamp,
            category: 'caregiver_action',
            title: 'Call initiated by caregiver',
            description: (e.payload['note'] as string) ?? 'Caregiver called patient',
            source: 'caregiver',
            expandable: false,
          })
        }
      })

    // Appointments
    appointments
      .filter(
        (a) =>
          a.patientId === patientId &&
          (dateRange.has((a.scheduledAt ?? a.requestedAt).split('T')[0]) ||
            dateRange.has(a.requestedAt.split('T')[0]))
      )
      .forEach((a) => {
        events.push({
          id: `tl-appt-${a.id}`,
          timestamp: a.scheduledAt ?? a.requestedAt,
          category: 'appointment',
          title:
            a.status === 'scheduled'
              ? `Appointment scheduled — ${new Date(a.scheduledAt!).toLocaleDateString('en-SG', { month: 'short', day: 'numeric' })}`
              : 'Appointment requested',
          description: `Reason: ${a.reason.replace(/_/g, ' ')}. ${a.notes}`,
          source: a.initiatedBy === 'user-dr-chan' ? 'doctor' : 'caregiver',
          expandable: true,
        })
      })

    // Sort descending by timestamp
    return events.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
  }, [patientId, vitals, adherence, symptoms, alerts, messages, escalations, doctorNotes, caregiverNotes, actionLog, appointments, daysBack])
}
