import { useState } from 'react'
import { CaregiverHeader } from '@/components/caregiver/CaregiverHeader'
import { TodayGlance } from '@/components/caregiver/TodayGlance'
import { TrendChartsSection } from '@/components/caregiver/TrendChartsSection'
import { NotesPanel } from '@/components/caregiver/NotesPanel'
import { CarePlanChecklist } from '@/components/caregiver/CarePlanChecklist'
import { ScrollNav } from '@/components/caregiver/ScrollNav'
import { RiskBanner } from '@/components/shared/RiskBanner'
import { AISummary } from '@/components/shared/AISummary'
import { AlertTimeline } from '@/components/shared/AlertTimeline'
import { EscalationPanel } from '@/components/shared/EscalationPanel'
import { MessagingModal } from '@/components/shared/MessagingModal'
import { usePatient } from '@/hooks/usePatient'
import { useTimeline } from '@/hooks/useTimeline'
import { formatDateTime } from '@/lib/dateUtils'
import { InfoIcon } from 'lucide-react'

export function CaregiverPage() {
  const [messageOpen, setMessageOpen] = useState(false)
  const [escalateOpen, setEscalateOpen] = useState(false)
  const [timelineDays, setTimelineDays] = useState<7 | 14>(14)

  const { patient, latestAlert, dailySummary, latestVitals } = usePatient('patient-001')
  const timelineEvents = useTimeline('patient-001', timelineDays)

  if (!patient) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8 text-slate-400 text-sm">
        Loading patient data...
      </div>
    )
  }

  const dataFreshnessLabel = latestVitals
    ? `Latest check-in recorded today ${formatDateTime(latestVitals.recordedAt).split(' ').slice(-1)[0]}`
    : 'No check-in data today'

  return (
    <>
      {/* Floating scroll navigation (desktop only) */}
      <ScrollNav />

      {/* Sticky subheader */}
      <CaregiverHeader
        onMessageClick={() => setMessageOpen(true)}
        onEscalateClick={() => setEscalateOpen(true)}
      />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        {/* Risk Banner */}
        <section id="risk">
          {latestAlert ? (
            <RiskBanner
              riskLevel={latestAlert.severity}
              reasonCodes={latestAlert.reasonCodes}
              evidencePointers={latestAlert.evidencePointers}
              lastUpdatedAt={latestAlert.createdAt}
              dataFreshnessLabel={dataFreshnessLabel}
            />
          ) : (
            <div className="rounded-xl border-l-4 border-l-emerald-400 bg-emerald-50 p-5">
              <div className="flex items-center gap-3">
                <span className="text-lg">🟢</span>
                <div>
                  <p className="font-semibold text-emerald-800">All Clear</p>
                  <p className="text-sm text-emerald-700 mt-0.5">No active alerts today. {dataFreshnessLabel}.</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Today at a Glance */}
        <section id="today">
          <TodayGlance />
        </section>

        {/* AI Summary */}
        <section id="ai-summary">
          {dailySummary ? (
            <AISummary
              summary={dailySummary}
              riskLevel={latestAlert?.severity ?? 'green'}
              variant="caregiver"
            />
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-3 text-slate-400">
              <InfoIcon className="w-4 h-4" />
              <p className="text-sm">No AI summary available today.</p>
            </div>
          )}
        </section>

        {/* Trend Charts */}
        <section id="trends">
          <TrendChartsSection />
        </section>

        {/* Alert Timeline */}
        <section id="timeline">
          <AlertTimeline
            events={timelineEvents}
            daysBack={timelineDays}
            onDaysBackChange={setTimelineDays}
            role="caregiver"
          />
        </section>

        {/* Notes & Care Plan */}
        <section id="notes">
          <h2 className="text-xl font-semibold text-slate-900 border-b border-slate-200 pb-3 mb-6">
            Notes & Care Plan
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NotesPanel />
            <CarePlanChecklist />
          </div>
        </section>

        {/* Data freshness footer */}
        <div className="text-center text-xs text-slate-400 py-4 border-t border-slate-200">
          Data as of: 25 Feb 2026, 09:05 · Next check-in expected: 26 Feb 2026 ~08:00
        </div>
      </div>

      {/* Modals */}
      <MessagingModal
        open={messageOpen}
        onClose={() => setMessageOpen(false)}
        patientId="patient-001"
        patientName="Ms. Tan"
        senderRole="caregiver"
        senderId="user-ana"
      />
      <EscalationPanel open={escalateOpen} onClose={() => setEscalateOpen(false)} />
    </>
  )
}
