import { useState } from 'react'
import { CaregiverHeader } from '@/components/caregiver/CaregiverHeader'
import { TodayGlance } from '@/components/caregiver/TodayGlance'
import { TrendChartsSection } from '@/components/caregiver/TrendChartsSection'
import { NotesPanel } from '@/components/caregiver/NotesPanel'
import { CarePlanChecklist } from '@/components/caregiver/CarePlanChecklist'
import { BotInsightPanel } from '@/components/caregiver/BotInsightPanel'
import { RiskBanner } from '@/components/shared/RiskBanner'
import { AISummary } from '@/components/shared/AISummary'
import { EscalationPanel } from '@/components/shared/EscalationPanel'
import { MessagingModal } from '@/components/shared/MessagingModal'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePatient } from '@/hooks/usePatient'
import { formatDateTime } from '@/lib/dateUtils'
import { getTodayIsoAtUtcTime } from '@/lib/mockDate'
import { ActivitySquare, ChevronsRight, FileText, InfoIcon } from 'lucide-react'
import { addDays, format } from 'date-fns'

export function CaregiverPage() {
  const [messageOpen, setMessageOpen] = useState(false)
  const [escalateOpen, setEscalateOpen] = useState(false)

  const { patient, latestAlert, dailySummary, latestVitals } = usePatient('patient-001')

  if (!patient) {
    return (
      <div className="w-full px-6 py-8 text-slate-400 text-sm">
        Loading patient data...
      </div>
    )
  }

  const dataFreshnessLabel = latestVitals
    ? `Latest check-in recorded today ${formatDateTime(latestVitals.recordedAt).split(' ').slice(-1)[0]}`
    : 'No check-in data today'
  const footerDataAsOf = getTodayIsoAtUtcTime('09:05:00')
  const nextCheckinExpected = addDays(new Date(getTodayIsoAtUtcTime('08:00:00')), 1)

  return (
    <>
      {/* Sticky subheader */}
      <CaregiverHeader
        onMessageClick={() => setMessageOpen(true)}
        onEscalateClick={() => setEscalateOpen(true)}
      />

      {/* Main content */}
      <div className="w-full px-3 sm:px-4 lg:px-5 py-5 sm:py-6">
        <Tabs defaultValue="overview" orientation="vertical" className="lg:grid lg:grid-cols-[72px_minmax(0,1fr)] lg:gap-4 xl:gap-5">
          <aside className="h-fit lg:sticky lg:top-36 lg:w-[72px] lg:overflow-visible">
            <div className="group relative z-20 rounded-2xl border border-slate-300 bg-white p-3 shadow-sm overflow-hidden transition-[width,box-shadow,border-color] duration-200 ease-out lg:w-[72px] lg:p-2 lg:hover:w-[220px] lg:focus-within:w-[220px] lg:hover:border-slate-400 lg:focus-within:border-slate-400 lg:hover:shadow-md lg:focus-within:shadow-md">
              <div className="pointer-events-none hidden lg:flex items-center justify-center absolute right-2 top-2 h-6 w-6 rounded-full border border-slate-200 bg-slate-50 text-slate-400 transition-opacity duration-150 group-hover:opacity-0 group-focus-within:opacity-0">
                <ChevronsRight className="h-3.5 w-3.5" />
              </div>
              <p className="overflow-hidden px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 transition-[max-height,opacity,padding] duration-150 lg:max-h-0 lg:pb-0 lg:opacity-0 lg:group-hover:max-h-8 lg:group-hover:pb-2 lg:group-hover:opacity-100 lg:group-focus-within:max-h-8 lg:group-focus-within:pb-2 lg:group-focus-within:opacity-100">
                Caregiver View
              </p>
              <TabsList className="h-auto w-full flex-col items-stretch justify-start gap-1 bg-transparent p-0">
                <TabsTrigger
                  value="overview"
                  className="w-full justify-center gap-2 rounded-lg px-3 py-2.5 text-left lg:px-2 lg:py-2.5 lg:group-hover:px-3 lg:group-focus-within:px-3 lg:justify-center lg:group-hover:justify-start lg:group-focus-within:justify-start data-[state=active]:bg-blue-50 data-[state=active]:text-blue-900 data-[state=active]:shadow-none"
                  aria-label="Care Overview"
                >
                  <ActivitySquare className="h-4 w-4" />
                  <span className="overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-150 lg:max-w-0 lg:opacity-0 lg:group-hover:max-w-[160px] lg:group-hover:opacity-100 lg:group-focus-within:max-w-[160px] lg:group-focus-within:opacity-100">
                    Care Overview
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="notes"
                  className="w-full justify-center gap-2 rounded-lg px-3 py-2.5 text-left lg:px-2 lg:py-2.5 lg:group-hover:px-3 lg:group-focus-within:px-3 lg:justify-center lg:group-hover:justify-start lg:group-focus-within:justify-start data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-900 data-[state=active]:shadow-none"
                  aria-label="Notes and Care Plan"
                >
                  <FileText className="h-4 w-4" />
                  <span className="overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-150 lg:max-w-0 lg:opacity-0 lg:group-hover:max-w-[160px] lg:group-hover:opacity-100 lg:group-focus-within:max-w-[160px] lg:group-focus-within:opacity-100">
                    Notes & Care Plan
                  </span>
                </TabsTrigger>
              </TabsList>
            </div>
          </aside>

          <div className="min-w-0 mt-4 lg:mt-0 xl:grid xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-4 xl:items-start">
            <div className="min-w-0">
              <TabsContent value="overview" className="mt-0 space-y-8">
                <section
                  id="overview-top"
                  className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)] gap-4 items-start"
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

              <TabsContent value="notes" className="mt-0 space-y-6">
                <section id="notes">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <NotesPanel />
                    <CarePlanChecklist />
                  </div>
                </section>
              </TabsContent>

              <div className="text-center text-xs text-slate-400 py-4 mt-8 border-t border-slate-200">
                Data as of: {format(new Date(footerDataAsOf), 'dd MMM yyyy, HH:mm')} · Next check-in expected: {format(nextCheckinExpected, 'dd MMM yyyy')} ~08:00
              </div>
            </div>

            <aside className="mt-6 xl:mt-0 xl:sticky xl:top-36">
              <BotInsightPanel />
            </aside>
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
