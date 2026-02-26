import { useUIStore } from '@/store/useUIStore'
import { DoctorHeader } from '@/components/doctor/DoctorHeader'
import { PatientCardGrid } from '@/components/doctor/PatientCardGrid'
import { PatientTable } from '@/components/doctor/PatientTable'
import { PatientMap } from '@/components/doctor/PatientMap'
import { DrillDownPanel } from '@/components/doctor/DrillDownPanel'

export function DoctorPage() {
  const { doctorViewMode } = useUIStore()

  return (
    <>
      {/* Sticky sub-header (below AppShell 64px) */}
      <DoctorHeader />

      {/* Main content */}
      <div className="min-h-[60vh]">
        {doctorViewMode === 'cards' && <PatientCardGrid />}
        {doctorViewMode === 'table' && <PatientTable />}
        {doctorViewMode === 'map' && <PatientMap />}
      </div>

      {/* DrillDown panel — right side Sheet, open when patient selected */}
      <DrillDownPanel />
    </>
  )
}
