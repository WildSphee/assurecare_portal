import { useState } from 'react'
import { TodayGlance } from '@/components/caregiver/TodayGlance'
import { TrendChartsSection } from '@/components/caregiver/TrendChartsSection'
import { BotInsightPanel } from '@/components/caregiver/BotInsightPanel'
import { QuickActions } from '@/components/caregiver/QuickActions'
import { RiskBanner } from '@/components/shared/RiskBanner'
import { AISummary } from '@/components/shared/AISummary'
import { EscalationPanel } from '@/components/shared/EscalationPanel'
import { MessagingModal } from '@/components/shared/MessagingModal'
import { usePatient } from '@/hooks/usePatient'
import { formatDateTime } from '@/lib/dateUtils'
import { getTodayIsoAtUtcTime } from '@/lib/mockDate'
import { InfoIcon, User } from 'lucide-react'
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
      {/* Main content */}
      <div className="w-full px-3 sm:px-4 lg:px-5 py-5 sm:py-6">
        <div className="grid grid-cols-1 2xl:grid-cols-[340px_minmax(0,1fr)_360px] xl:grid-cols-[320px_minmax(0,1fr)_340px] gap-4 items-start">
          <aside className="space-y-4 xl:sticky xl:top-20">
            <section className="rounded-2xl border border-slate-300 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-base font-bold text-slate-900 leading-tight">{patient.name}</h1>
                  <p className="mt-0.5 text-sm text-slate-600">
                    Age {patient.age}
                    {patient.location?.area ? ` · ${patient.location.area.split(',')[0]}` : ''}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Last check-in {formatDateTime(patient.lastCheckinAt)}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                {patient.conditions.map((c) => (
                  <span
                    key={c}
                    className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200"
                  >
                    {c}
                  </span>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200">
                <QuickActions
                  onMessageClick={() => setMessageOpen(true)}
                  onEscalateClick={() => setEscalateOpen(true)}
                />
              </div>
            </section>

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

            <section id="ai-summary" className="min-w-0">
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
            </section>
          </aside>

          <main className="min-w-0 space-y-6">
            <section id="today">
              <TodayGlance hideHeader />
            </section>

            <section id="trends">
              <TrendChartsSection hideHeader />
            </section>

            <div className="text-center text-xs text-slate-400 py-4 mt-2 border-t border-slate-200">
              Data as of: {format(new Date(footerDataAsOf), 'dd MMM yyyy, HH:mm')} · Next check-in expected: {format(nextCheckinExpected, 'dd MMM yyyy')} ~08:00
            </div>
          </main>

          <aside className="xl:sticky xl:top-20">
            <BotInsightPanel />
          </aside>
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
