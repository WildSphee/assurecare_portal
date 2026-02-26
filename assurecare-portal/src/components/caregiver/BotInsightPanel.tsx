import { useMemo, useState } from 'react'
import { Activity, AlertCircle, ArrowUpCircle, BatteryMedium, Bot, Calendar, MessageSquare, Pill, Stethoscope, Wifi, WifiOff } from 'lucide-react'
import { usePatient } from '@/hooks/usePatient'
import { useTimeline } from '@/hooks/useTimeline'
import { formatDayLabel, formatTime } from '@/lib/dateUtils'
import { getTodayIsoAtUtcTime } from '@/lib/mockDate'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { TimelineEvent } from '@/types'

type TranscriptActor = 'patient' | 'bot'

interface TranscriptEntry {
  id: string
  actor: TranscriptActor
  timestamp: string
  text: string
}

const EVENT_ICON: Record<TimelineEvent['category'], React.ReactNode> = {
  vitals: <Activity className="h-3.5 w-3.5" />,
  meds: <Pill className="h-3.5 w-3.5" />,
  symptom: <AlertCircle className="h-3.5 w-3.5" />,
  no_response: <WifiOff className="h-3.5 w-3.5" />,
  caregiver_action: <MessageSquare className="h-3.5 w-3.5" />,
  doctor_action: <Stethoscope className="h-3.5 w-3.5" />,
  appointment: <Calendar className="h-3.5 w-3.5" />,
  escalation: <ArrowUpCircle className="h-3.5 w-3.5" />,
  checkin: <Bot className="h-3.5 w-3.5" />,
}

function extractQuotedPatientText(narrative?: string | null): string | null {
  if (!narrative) return null
  const match = narrative.match(/"([^"]+)"/)
  return match?.[1] ?? null
}

function containsChinese(text: string): boolean {
  return /[\u3400-\u9fff]/.test(text)
}

function groupEventsByDay(events: TimelineEvent[]) {
  const map = new Map<string, TimelineEvent[]>()
  for (const event of events) {
    const day = event.timestamp.split('T')[0]
    if (!map.has(day)) map.set(day, [])
    map.get(day)!.push(event)
  }
  return map
}

export function BotInsightPanel() {
  const [daysBack, setDaysBack] = useState<7 | 14>(14)
  const { patient, dailySummary, patientMessages } = usePatient('patient-001')
  const events = useTimeline('patient-001', daysBack)
  const patientShortName = patient ? patient.name.split(' ').slice(0, 2).join(' ') : 'Ms Tan'

  const transcript = useMemo<TranscriptEntry[]>(() => {
    const patientQuote =
      extractQuotedPatientText(dailySummary?.narrative) ??
      '我今天胸口有一点痛。'
    const patientQuoteIsChinese = containsChinese(patientQuote)

    const botSymptomQuestion = patientQuoteIsChinese
      ? '今天有没有不舒服，比如胸口不适、头晕或呼吸急促？'
      : 'Any symptoms today, such as chest discomfort, dizziness, or shortness of breath?'

    const botFollowUp = patientQuoteIsChinese
      ? '我已记录你的症状，并会标记给护理人员和医生查看。如果胸痛加重或呼吸困难，请立刻寻求紧急帮助。'
      : 'I have logged the symptom and will flag this for review. Please rest and seek urgent help if pain worsens or breathing becomes difficult.'

    const entries: TranscriptEntry[] = [
      {
        id: 'bot-checkin-1',
        actor: 'bot',
        timestamp: getTodayIsoAtUtcTime('08:28:00'),
        text: 'Good morning Ms Tan. Have you taken your blood pressure medicine today?',
      },
      {
        id: 'pt-checkin-1',
        actor: 'patient',
        timestamp: getTodayIsoAtUtcTime('08:30:00'),
        text: 'I took my morning medicine.',
      },
      {
        id: 'bot-checkin-2',
        actor: 'bot',
        timestamp: getTodayIsoAtUtcTime('09:04:00'),
        text: botSymptomQuestion,
      },
      {
        id: 'pt-checkin-2',
        actor: 'patient',
        timestamp: getTodayIsoAtUtcTime('09:05:00'),
        text: patientQuote,
      },
      {
        id: 'bot-checkin-3',
        actor: 'bot',
        timestamp: getTodayIsoAtUtcTime('09:06:00'),
        text: botFollowUp,
      },
    ]

    const relayedMessages = patientMessages
      .slice(0, 2)
      .map((message) => ({
        id: `relay-${message.id}`,
        actor: 'bot' as const,
        timestamp: message.sentAt,
        text:
          message.senderRole === 'doctor'
            ? `Doctor message relayed: ${message.content}`
            : `Caregiver message relayed: ${message.content}`,
      }))

    return [...entries, ...relayedMessages].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 6)
  }, [dailySummary?.narrative, patientMessages])

  const recentEvents = useMemo(() => events.slice(0, 14), [events])
  const groupedEvents = useMemo(() => groupEventsByDay(recentEvents), [recentEvents])
  const sortedDays = useMemo(() => Array.from(groupedEvents.keys()).sort((a, b) => b.localeCompare(a)), [groupedEvents])

  const batteryPct = 78
  const batteryTone =
    batteryPct <= 20 ? 'text-red-600 bg-red-50 border-red-200' : batteryPct <= 40 ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200'

  return (
    <section className="rounded-2xl border border-slate-300 bg-white shadow-sm xl:max-h-[calc(100vh-10rem)] xl:overflow-hidden">
      <div className="border-b border-slate-200 p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600">
              <Bot className="h-3.5 w-3.5" />
              <span>Bot Insight</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-900 truncate">
              AssureBot Home Unit · {patientShortName}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">Connected via home bedside device</p>
          </div>
          <div className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium', batteryTone)}>
            <BatteryMedium className="h-3.5 w-3.5" />
            <span>{batteryPct}%</span>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between text-xs">
          <div className="inline-flex items-center gap-1 text-emerald-700">
            <Wifi className="h-3.5 w-3.5" />
            <span>Online</span>
          </div>
          <span className="text-slate-500">Last sync {formatTime(getTodayIsoAtUtcTime('09:08:00'))}</span>
        </div>

        <Button
          type="button"
          className="mt-3 w-full justify-center gap-2 bg-blue-600 hover:bg-blue-700"
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent('assurecare:chat-widget', {
                detail: { action: 'open' },
              })
            )
          }
        >
          <MessageSquare className="h-4 w-4" />
          Chat with Bot
        </Button>
      </div>

      <div className="space-y-3 p-3 xl:max-h-[calc(100vh-16rem)] xl:overflow-y-auto">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Bot Conversation
            </p>
            <div className="flex items-center gap-1 bg-slate-100 rounded-full p-0.5">
              {([7, 14] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDaysBack(d)}
                  className={cn(
                    'px-2 py-0.5 rounded-full text-[11px] font-medium transition-all',
                    daysBack === d ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  )}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {transcript.map((entry) => (
              <div key={entry.id} className="rounded-lg border border-slate-200 bg-slate-50/70 p-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700">
                    <span className={cn('inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px]',
                      entry.actor === 'patient'
                        ? 'border-slate-300 bg-white text-slate-700'
                        : 'border-blue-200 bg-blue-50 text-blue-700'
                    )}>
                      {entry.actor === 'patient' ? 'MT' : 'BOT'}
                    </span>
                    <span>{entry.actor === 'patient' ? 'Ms Tan' : 'AssureBot'}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{formatTime(entry.timestamp)}</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-700">
                  “{entry.text}”
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200 pt-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Device Activity (Compact)
          </p>

          {sortedDays.length === 0 ? (
            <p className="text-xs text-slate-400">No recent bot activity in the last {daysBack} days.</p>
          ) : (
            <div className="space-y-3">
              {sortedDays.map((day) => (
                <div key={day}>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    {formatDayLabel(day)}
                  </p>
                  <div className="space-y-1.5">
                    {groupedEvents.get(day)!.map((event) => (
                      <div key={event.id} className="rounded-md border border-slate-200 bg-white px-2 py-1.5">
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5 text-slate-400">
                            {EVENT_ICON[event.category]}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs font-medium text-slate-800 leading-tight">
                                {event.title}
                              </p>
                              <span className="shrink-0 text-[11px] text-slate-400">
                                {formatTime(event.timestamp)}
                              </span>
                            </div>
                            <p className="mt-0.5 text-[11px] leading-snug text-slate-500 line-clamp-2">
                              {event.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
