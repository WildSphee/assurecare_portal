import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AppShell } from '@/components/layout/AppShell'
import { CaregiverPage } from '@/pages/CaregiverPage'
import { DoctorPage } from '@/pages/DoctorPage'
import { usePatientStore } from '@/store/usePatientStore'
import { useAppointmentStore } from '@/store/useAppointmentStore'
import { useActionLogStore } from '@/store/useActionLogStore'
import {
  MOCK_PATIENTS,
  MOCK_VITALS,
  MOCK_ADHERENCE,
  MOCK_SYMPTOMS,
  MOCK_ALERTS,
  MOCK_AI_SUMMARIES,
  MOCK_ACTION_LOG,
  MOCK_MESSAGES,
  MOCK_ESCALATIONS,
  MOCK_CARE_PLAN,
  MOCK_DOCTOR_NOTES,
  MOCK_CAREGIVER_NOTES,
  MOCK_APPOINTMENTS,
} from '@/data/mock'
import { shiftMockDatesDeep } from '@/lib/mockDate'

function App() {
  const { seed: seedPatients } = usePatientStore()
  const { seed: seedAppointments } = useAppointmentStore()
  const { seed: seedActionLog } = useActionLogStore()

  useEffect(() => {
    const seededPatients = shiftMockDatesDeep(MOCK_PATIENTS)
    const seededAlerts = shiftMockDatesDeep(MOCK_ALERTS)
    const seededSymptoms = shiftMockDatesDeep(MOCK_SYMPTOMS)
    const seededVitals = shiftMockDatesDeep(MOCK_VITALS)
    const seededAdherence = shiftMockDatesDeep(MOCK_ADHERENCE)
    const seededAiSummaries = shiftMockDatesDeep(MOCK_AI_SUMMARIES)
    const seededDoctorNotes = shiftMockDatesDeep(MOCK_DOCTOR_NOTES)
    const seededCaregiverNotes = shiftMockDatesDeep(MOCK_CAREGIVER_NOTES)
    const seededEscalations = shiftMockDatesDeep(MOCK_ESCALATIONS)
    const seededMessages = shiftMockDatesDeep(MOCK_MESSAGES)
    const seededCarePlan = shiftMockDatesDeep(MOCK_CARE_PLAN)
    const seededAppointments = shiftMockDatesDeep(MOCK_APPOINTMENTS)
    const seededActionLog = shiftMockDatesDeep(MOCK_ACTION_LOG)

    seedPatients({
      patients: seededPatients,
      alerts: seededAlerts,
      symptoms: seededSymptoms,
      vitals: seededVitals,
      adherence: seededAdherence,
      aiSummaries: seededAiSummaries,
      doctorNotes: seededDoctorNotes,
      caregiverNotes: seededCaregiverNotes,
      escalations: seededEscalations,
      messages: seededMessages,
      carePlan: seededCarePlan,
    })
    seedAppointments(seededAppointments)
    seedActionLog(seededActionLog)
  }, [seedPatients, seedAppointments, seedActionLog])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Navigate to="/caregiver" replace />} />
          <Route path="caregiver" element={<CaregiverPage />} />
          <Route path="doctor" element={<DoctorPage />} />
        </Route>
      </Routes>
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  )
}

export default App
