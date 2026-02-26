import { MetricTile } from '@/components/shared/MetricTile'
import { usePatient } from '@/hooks/usePatient'
import { Pill, Activity, AlertCircle, CheckCircle2, Dumbbell, MessageCircle } from 'lucide-react'

interface TodayGlanceProps {
  hideHeader?: boolean
}

export function TodayGlance({ hideHeader = false }: TodayGlanceProps) {
  const { latestVitals, todayAdherence, patientAdherence, patientSymptoms } = usePatient('patient-001')

  // Calculate 7-day med adherence streak
  const last7Adherence = patientAdherence.slice(0, 7)
  const adherenceStreak = last7Adherence.filter(
    (a) => a.medsMorningTaken !== false && a.medsEveningTaken !== false
  ).length

  // Active symptoms
  const recentSymptoms = patientSymptoms.slice(0, 3)
  const hasSymptoms = recentSymptoms.length > 0
  const worstSymptom = recentSymptoms[0]

  // BP trend (latest vs 5 days ago)
  const bpTrend = latestVitals
    ? latestVitals.bpSystolic > 140
      ? 'up'
      : latestVitals.bpSystolic < 120
        ? 'down'
        : 'stable'
    : 'stable'

  const morningTaken = todayAdherence?.medsMorningTaken
  const eveningTaken = todayAdherence?.medsEveningTaken

  const medicationValue =
    morningTaken === null && eveningTaken === null
      ? 'Not reported'
      : `${morningTaken !== false ? '✓' : '✗'} Morning · ${eveningTaken !== false ? '✓' : '✗'} Evening`

  const medicationStatus: 'normal' | 'warning' | 'alert' =
    morningTaken === false || eveningTaken === false ? 'warning' : 'normal'

  const bpStatus: 'normal' | 'warning' | 'alert' = latestVitals
    ? latestVitals.bpSystolic >= 150
      ? 'alert'
      : latestVitals.bpSystolic >= 140
        ? 'warning'
        : 'normal'
    : 'normal'

  const now = new Date('2026-02-25T09:05:00Z').toISOString()

  return (
    <div>
      {!hideHeader && (
        <h2 className="text-xl font-semibold text-slate-900 border-b border-slate-200 pb-3 mb-6">
          Today at a Glance
        </h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Medication Adherence */}
        <MetricTile
          title="Medication Adherence"
          value={morningTaken === null ? 'Not reported' : medicationValue}
          lastUpdatedAt={todayAdherence ? `2026-02-25T08:30:00Z` : now}
          tooltipText="Tracks whether Ms. Tan has taken her prescribed blood pressure medications today. Morning and evening doses are recorded via the daily check-in."
          status={medicationStatus}
          streakLabel={`${adherenceStreak}/7 days this week`}
          icon={<Pill className="w-4 h-4" />}
        />

        {/* Blood Pressure */}
        <MetricTile
          title="Blood Pressure"
          value={latestVitals ? `${latestVitals.bpSystolic}/${latestVitals.bpDiastolic}` : '—'}
          unit="mmHg"
          trendArrow={bpTrend}
          trendColor={bpTrend === 'up' ? 'negative' : bpTrend === 'down' ? 'positive' : 'neutral'}
          lastUpdatedAt={latestVitals?.recordedAt ?? now}
          tooltipText="Blood pressure is a key indicator of cardiovascular health. The first number (systolic) measures pressure when the heart beats; the second (diastolic) measures pressure between beats. Target range: below 130/80 mmHg."
          status={bpStatus}
          icon={<Activity className="w-4 h-4" />}
          subValue={bpTrend === 'up' ? 'Trending up over 10 days' : undefined}
        />

        {/* Heart Rate */}
        <MetricTile
          title="Heart Rate"
          value={latestVitals?.hrBpm ?? '—'}
          unit="bpm"
          trendArrow="stable"
          trendColor="neutral"
          lastUpdatedAt={latestVitals?.recordedAt ?? now}
          tooltipText="Heart rate (beats per minute) measures how fast the heart is beating. A normal resting heart rate for adults is 60–100 bpm."
          status="normal"
          icon={<Activity className="w-4 h-4" />}
        />

        {/* Symptoms */}
        <MetricTile
          title="Symptoms"
          value={hasSymptoms ? worstSymptom.symptomType : 'None reported'}
          lastUpdatedAt={hasSymptoms ? `${worstSymptom.date}T09:00:00Z` : now}
          tooltipText="Symptoms reported by Ms. Tan during her daily check-in. Any symptoms, especially recurring or severe ones, should be monitored and discussed with Dr. Chan."
          status={hasSymptoms ? (worstSymptom.severity === 'severe' ? 'alert' : 'warning') : 'normal'}
          icon={hasSymptoms ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          subValue={hasSymptoms ? `${worstSymptom.severity} severity · ${worstSymptom.date}` : undefined}
        />

        {/* Exercise */}
        <MetricTile
          title="Exercise / Activity"
          value={todayAdherence?.exerciseDone ? 'Completed' : 'Not recorded'}
          lastUpdatedAt={todayAdherence ? `2026-02-25T08:30:00Z` : now}
          tooltipText="Whether Ms. Tan completed her daily exercise target (30-minute light walk) as part of her care plan. Regular activity helps manage blood pressure."
          status={todayAdherence?.exerciseDone ? 'normal' : 'warning'}
          icon={<Dumbbell className="w-4 h-4" />}
          subValue="Goal: 30-min light walk daily"
        />

        {/* Engagement */}
        <MetricTile
          title="Check-in Engagement"
          value="Completed"
          lastUpdatedAt="2026-02-25T09:05:00Z"
          tooltipText="Whether Ms. Tan completed her daily health check-in with the AssureCare chatbot. Regular check-ins ensure her data is up to date and she is safe."
          status="normal"
          icon={<MessageCircle className="w-4 h-4" />}
          streakLabel="Daily streak active"
          subValue="Responded at 09:05 today"
        />
      </div>
    </div>
  )
}
