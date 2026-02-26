import { useEffect } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUIStore } from '@/store/useUIStore'
import { usePatient } from '@/hooks/usePatient'
import { useActionLogStore } from '@/store/useActionLogStore'
import { RiskBanner } from '@/components/shared/RiskBanner'
import { RiskScoreToggle } from './RiskScoreToggle'
import { DrillDownOverview } from './DrillDownOverview'
import { DrillDownCharts } from './DrillDownCharts'
import { DrillDownTimeline } from './DrillDownTimeline'
import { DoctorNotesEditor } from './DoctorNotesEditor'
import { MapPin, X } from 'lucide-react'
import { formatRelative } from '@/lib/dateUtils'

function DrillDownContent({ patientId }: { patientId: string }) {
  const { patient, latestAlert, latestVitals } = usePatient(patientId)
  const { showDetailedScoring, setSelectedPatient } = useUIStore()
  const { logAction } = useActionLogStore()

  useEffect(() => {
    logAction('user-dr-chan', 'doctor', patientId, 'patient_viewed', {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId])

  if (!patient) return null

  const dataFreshnessLabel = latestVitals
    ? `Latest check-in ${formatRelative(latestVitals.recordedAt)}`
    : 'No check-in data today'

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Patient header */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-200 shrink-0">
        <div className="flex items-start justify-between gap-3 mb-1">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-slate-900 truncate">{patient.name}</h2>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              Age {patient.age} · {patient.conditions.slice(0, 2).join(' · ')}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            {patient.location?.area && (
              <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-600 max-w-[220px]">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{patient.location.area}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <RiskScoreToggle />
              <button
                onClick={() => setSelectedPatient(null)}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Close patient panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Risk Banner (compact) */}
        {latestAlert ? (
          <div className="mt-3">
            <RiskBanner
              riskLevel={latestAlert.severity}
              reasonCodes={latestAlert.reasonCodes}
              evidencePointers={latestAlert.evidencePointers}
              lastUpdatedAt={latestAlert.createdAt}
              dataFreshnessLabel={dataFreshnessLabel}
              showDetailedScoring={showDetailedScoring}
              compact
            />
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2 border border-emerald-200">
            <span>🟢</span>
            <span>No active alerts · {dataFreshnessLabel}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="flex flex-col flex-1 overflow-hidden">
        <div className="px-5 pt-3 shrink-0 border-b border-slate-100">
          <TabsList className="bg-slate-100 w-full justify-start">
            <TabsTrigger value="overview" className="text-xs">
              Overview
            </TabsTrigger>
            <TabsTrigger value="charts" className="text-xs">
              Charts
            </TabsTrigger>
            <TabsTrigger value="timeline" className="text-xs">
              Timeline
            </TabsTrigger>
            <TabsTrigger value="notes" className="text-xs">
              Notes & Actions
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="overview" className="px-5 py-4 mt-0 focus-visible:outline-none">
            <DrillDownOverview patientId={patientId} />
          </TabsContent>
          <TabsContent value="charts" className="px-5 py-4 mt-0 focus-visible:outline-none">
            <DrillDownCharts patientId={patientId} />
          </TabsContent>
          <TabsContent value="timeline" className="px-5 py-4 mt-0 focus-visible:outline-none">
            <DrillDownTimeline patientId={patientId} />
          </TabsContent>
          <TabsContent value="notes" className="px-5 py-4 mt-0 focus-visible:outline-none">
            <DoctorNotesEditor patientId={patientId} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

export function DrillDownPanel() {
  const { selectedPatientId, setSelectedPatient } = useUIStore()
  const isOpen = selectedPatientId !== null

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && setSelectedPatient(null)}>
      <SheetContent
        side="right"
        className="!inset-y-auto !top-[4.5rem] !right-2 !bottom-2 !h-auto !w-[calc(100vw-1rem)] sm:!top-20 sm:!right-6 sm:!bottom-6 sm:!w-[680px] sm:!max-w-none p-0 flex flex-col rounded-2xl border border-slate-200 shadow-2xl overflow-hidden"
        aria-label="Patient details window"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Patient Details</SheetTitle>
        </SheetHeader>
        {selectedPatientId && <DrillDownContent patientId={selectedPatientId} />}
      </SheetContent>
    </Sheet>
  )
}
