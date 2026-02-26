import { useState } from 'react'
import { CaregiverHeader } from '@/components/caregiver/CaregiverHeader'
import { TodayGlance } from '@/components/caregiver/TodayGlance'
import { TrendChartsSection } from '@/components/caregiver/TrendChartsSection'
import { NotesPanel } from '@/components/caregiver/NotesPanel'
import { CarePlanChecklist } from '@/components/caregiver/CarePlanChecklist'
import { RiskBanner } from '@/components/shared/RiskBanner'
import { AISummary } from '@/components/shared/AISummary'
import { AlertTimeline } from '@/components/shared/AlertTimeline'
import { EscalationPanel } from '@/components/shared/EscalationPanel'
import { MessagingModal } from '@/components/shared/MessagingModal'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePatient } from '@/hooks/usePatient'
import { useTimeline } from '@/hooks/useTimeline'
import { formatDateTime } from '@/lib/dateUtils'
import { ActivitySquare, FileText, InfoIcon, TimerReset } from 'lucide-react'

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
      {/* Sticky subheader */}
      <CaregiverHeader
        onMessageClick={() => setMessageOpen(true)}
        onEscalateClick={() => setEscalateOpen(true)}
      />

      {/* Main content */}
      <div className="w-full px-4 sm:px-6 py-6 sm:py-8">
        <Tabs defaultValue="overview" orientation="vertical" className="lg:grid lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-6 xl:gap-8">
          <aside className="lg:sticky lg:top-36 h-fit">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Caregiver View
              </p>
              <TabsList className="h-auto w-full flex-col items-stretch justify-start gap-1 bg-transparent p-0">
                <TabsTrigger
                  value="overview"
                  className="w-full justify-start gap-2 rounded-lg px-3 py-2.5 text-left data-[state=active]:bg-blue-50 data-[state=active]:text-blue-900 data-[state=active]:shadow-none"
                >
                  <ActivitySquare className="h-4 w-4" />
                  <span>Care Overview</span>
                </TabsTrigger>
                <TabsTrigger
                  value="timeline"
                  className="w-full justify-start gap-2 rounded-lg px-3 py-2.5 text-left data-[state=active]:bg-amber-50 data-[state=active]:text-amber-900 data-[state=active]:shadow-none"
                >
                  <TimerReset className="h-4 w-4" />
                  <span>Alert Timeline</span>
                </TabsTrigger>
                <TabsTrigger
                  value="notes"
                  className="w-full justify-start gap-2 rounded-lg px-3 py-2.5 text-left data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-900 data-[state=active]:shadow-none"
                >
                  <FileText className="h-4 w-4" />
                  <span>Notes & Care Plan</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </aside>

          <div className="min-w-0 mt-4 lg:mt-0 lg:max-w-[1220px]">
            <TabsContent value="overview" className="mt-0 space-y-8">
              <section
                id="overview-top"
                className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.6fr)_minmax(340px,0.95fr)] gap-6 items-start"
              >
                <div className="min-w-0 space-y-6">
                  <section id="risk">
                    {latestAlert ? (
                      <RiskBanner
                        riskLevel={latestAlert.severity}
                        reasonCodes={latestAlert.reasonCodes}
                        evidencePointers={latestAlert.evidencePointers}
                        lastUpdatedAt={latestAlert.createdAt}
                        dataFreshnessLabel={dataFreshnessLabel}
                        showExplainabilityToggle={false}
                      />
                    ) : (
                      <div className="rounded-xl border-l-4 border-l-emerald-400 bg-emerald-50 p-5">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">🟢</span>
                          <div>
                            <p className="font-semibold text-emerald-800">All Clear</p>
                            <p className="text-sm text-emerald-700 mt-0.5">
                              No active alerts today. {dataFreshnessLabel}.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </section>

                  <section id="today">
                    <TodayGlance hideHeader />
                  </section>
                </div>

                <div id="ai-summary" className="min-w-0">
                  {dailySummary ? (
                    <AISummary
                      summary={dailySummary}
                      riskLevel={latestAlert?.severity ?? 'green'}
                      variant="caregiver"
                    />
                  ) : (
                    <div className="rounded-xl border border-violet-300 bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100 p-5 flex items-center gap-3 text-violet-800 shadow-[0_8px_24px_-18px_rgba(124,58,237,0.45)]">
                      <InfoIcon className="w-4 h-4" />
                      <p className="text-sm">No AI insight available today.</p>
                    </div>
                  )}
                </div>
              </section>

              <section id="trends">
                <TrendChartsSection hideHeader />
              </section>
            </TabsContent>

            <TabsContent value="timeline" className="mt-0 space-y-6">
              <section id="timeline">
                <AlertTimeline
                  events={timelineEvents}
                  daysBack={timelineDays}
                  onDaysBackChange={setTimelineDays}
                  role="caregiver"
                  hideHeader
                />
              </section>
            </TabsContent>

            <TabsContent value="notes" className="mt-0 space-y-6">
              <section id="notes">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <NotesPanel />
                  <CarePlanChecklist />
                </div>
              </section>
            </TabsContent>

            <div className="text-center text-xs text-slate-400 py-4 mt-8 border-t border-slate-200">
              Data as of: 25 Feb 2026, 09:05 · Next check-in expected: 26 Feb 2026 ~08:00
            </div>
          </div>
        </Tabs>
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
