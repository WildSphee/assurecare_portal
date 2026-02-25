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

function App() {
  const { seed: seedPatients } = usePatientStore()
  const { seed: seedAppointments } = useAppointmentStore()
  const { seed: seedActionLog } = useActionLogStore()

  useEffect(() => {
    seedPatients({
      patients: MOCK_PATIENTS,
      alerts: MOCK_ALERTS,
      symptoms: MOCK_SYMPTOMS,
      vitals: MOCK_VITALS,
      adherence: MOCK_ADHERENCE,
      aiSummaries: MOCK_AI_SUMMARIES,
      doctorNotes: MOCK_DOCTOR_NOTES,
      caregiverNotes: MOCK_CAREGIVER_NOTES,
      escalations: MOCK_ESCALATIONS,
      messages: MOCK_MESSAGES,
      carePlan: MOCK_CARE_PLAN,
    })
    seedAppointments(MOCK_APPOINTMENTS)
    seedActionLog(MOCK_ACTION_LOG)
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
