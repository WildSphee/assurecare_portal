import { useMemo } from 'react'
import { usePatientStore } from '@/store/usePatientStore'
import { useAppointmentStore } from '@/store/useAppointmentStore'

export function usePatient(patientId: string) {
  const { patients, alerts, vitals, adherence, aiSummaries, symptoms, doctorNotes, caregiverNotes, escalations, messages, carePlan } =
    usePatientStore()
  const { appointments } = useAppointmentStore()

  return useMemo(() => {
    const patient = patients.find((p) => p.id === patientId)
    const patientVitals = vitals
      .filter((v) => v.patientId === patientId)
      .sort((a, b) => b.date.localeCompare(a.date))
    const patientAdherence = adherence
      .filter((a) => a.patientId === patientId)
      .sort((a, b) => b.date.localeCompare(a.date))
    const patientSymptoms = symptoms
      .filter((s) => s.patientId === patientId)
      .sort((a, b) => b.date.localeCompare(a.date))
    const patientAlerts = alerts
      .filter((a) => a.patientId === patientId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    const patientSummaries = aiSummaries
      .filter((s) => s.patientId === patientId)
      .sort((a, b) => b.date.localeCompare(a.date))
    const patientDoctorNotes = doctorNotes
      .filter((n) => n.patientId === patientId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    const patientCaregiverNotes = caregiverNotes
      .filter((n) => n.patientId === patientId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    const patientEscalations = escalations
      .filter((e) => e.patientId === patientId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    const patientMessages = messages
      .filter((m) => m.patientId === patientId)
      .sort((a, b) => b.sentAt.localeCompare(a.sentAt))
    const patientAppointments = appointments
      .filter((a) => a.patientId === patientId)
      .sort((a, b) => {
        const dateA = a.scheduledAt ?? a.requestedAt
        const dateB = b.scheduledAt ?? b.requestedAt
        return dateA.localeCompare(dateB)
      })
    const patientCarePlan = carePlan.filter((c) => c.patientId === patientId)

    const latestVitals = patientVitals[0] ?? null
    const todayAdherence = patientAdherence[0] ?? null
    const activeAlerts = patientAlerts.filter((a) => a.status === 'open')
    const latestAlert = activeAlerts[0] ?? null
    const dailySummary = patientSummaries.find((s) => s.summaryType === 'daily') ?? patientSummaries[0] ?? null
    const clinicalSummary = patientSummaries.find((s) => s.summaryType === 'clinical') ?? patientSummaries[0] ?? null
    const upcomingAppointments = patientAppointments.filter(
      (a) => a.status === 'scheduled' || a.status === 'requested'
    )
    const nextAppointment = upcomingAppointments[0] ?? null

    return {
      patient,
      latestVitals,
      todayAdherence,
      patientVitals,
      patientAdherence,
      patientSymptoms,
      patientAlerts,
      activeAlerts,
      latestAlert,
      dailySummary,
      clinicalSummary,
      patientDoctorNotes,
      patientCaregiverNotes,
      patientEscalations,
      patientMessages,
      patientAppointments,
      upcomingAppointments,
      nextAppointment,
      patientCarePlan,
    }
  }, [patientId, patients, vitals, adherence, symptoms, alerts, aiSummaries, doctorNotes, caregiverNotes, escalations, messages, appointments, carePlan])
}
