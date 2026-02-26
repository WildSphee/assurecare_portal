import { useEffect, useMemo, useRef, useState } from 'react'
import { Bot, Loader2, MessageCircle, Send, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { usePatient } from '@/hooks/usePatient'
import { formatRelative } from '@/lib/dateUtils'
import { usePatientStore } from '@/store/usePatientStore'
import { useUIStore } from '@/store/useUIStore'

type ChatRole = 'user' | 'assistant'

interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  createdAt: string
  isError?: boolean
}

const CAREGIVER_DEFAULT_PATIENT_ID = 'patient-001'
const DEFAULT_MODEL = 'gpt-4.1-mini'

function createMessage(role: ChatRole, content: string, isError = false): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    createdAt: new Date().toISOString(),
    ...(isError ? { isError: true } : {}),
  }
}

function truncate(text: string, max = 220): string {
  if (text.length <= max) return text
  return `${text.slice(0, max - 1)}…`
}

function buildPatientContext(params: {
  patient: ReturnType<typeof usePatient>['patient']
  latestVitals: ReturnType<typeof usePatient>['latestVitals']
  todayAdherence: ReturnType<typeof usePatient>['todayAdherence']
  activeAlerts: ReturnType<typeof usePatient>['activeAlerts']
  patientSymptoms: ReturnType<typeof usePatient>['patientSymptoms']
  dailySummary: ReturnType<typeof usePatient>['dailySummary']
  clinicalSummary: ReturnType<typeof usePatient>['clinicalSummary']
  patientDoctorNotes: ReturnType<typeof usePatient>['patientDoctorNotes']
  patientCaregiverNotes: ReturnType<typeof usePatient>['patientCaregiverNotes']
  patientCarePlan: ReturnType<typeof usePatient>['patientCarePlan']
  nextAppointment: ReturnType<typeof usePatient>['nextAppointment']
}) {
  const {
    patient,
    latestVitals,
    todayAdherence,
    activeAlerts,
    patientSymptoms,
    dailySummary,
    clinicalSummary,
    patientDoctorNotes,
    patientCaregiverNotes,
    patientCarePlan,
    nextAppointment,
  } = params

  if (!patient) return null

  return {
    patient: {
      id: patient.id,
      name: patient.name,
      age: patient.age,
      conditions: patient.conditions,
      riskStatus: patient.riskStatus,
      area: patient.location?.area ?? null,
      lastCheckinAt: patient.lastCheckinAt,
      noResponseStreak: patient.noResponseStreak,
    },
    latestVitals: latestVitals
      ? {
          date: latestVitals.date,
          recordedAt: latestVitals.recordedAt,
          bpSystolic: latestVitals.bpSystolic,
          bpDiastolic: latestVitals.bpDiastolic,
          hrBpm: latestVitals.hrBpm,
          qualityFlag: latestVitals.qualityFlag,
        }
      : null,
    todayAdherence,
    activeAlerts: activeAlerts.slice(0, 3).map((alert) => ({
      severity: alert.severity,
      reasonCodes: alert.reasonCodes,
      createdAt: alert.createdAt,
      evidence: alert.evidencePointers.slice(0, 3),
    })),
    recentSymptoms: patientSymptoms.slice(0, 5).map((symptom) => ({
      date: symptom.date,
      symptomType: symptom.symptomType,
      severity: symptom.severity,
    })),
    dailySummary: dailySummary
      ? {
          date: dailySummary.date,
          narrative: truncate(dailySummary.narrative, 500),
          highlights: dailySummary.highlights,
          suggestedActions: dailySummary.suggestedActions,
        }
      : null,
    clinicalSummary: clinicalSummary
      ? {
          date: clinicalSummary.date,
          narrative: truncate(clinicalSummary.narrative, 500),
          highlights: clinicalSummary.highlights,
          suggestedActions: clinicalSummary.suggestedActions,
        }
      : null,
    recentDoctorNotes: patientDoctorNotes.slice(0, 3).map((note) => ({
      createdAt: note.createdAt,
      visibility: note.visibility,
      content: truncate(note.content),
    })),
    recentCaregiverNotes: patientCaregiverNotes.slice(0, 3).map((note) => ({
      createdAt: note.createdAt,
      content: truncate(note.content),
    })),
    carePlan: patientCarePlan.slice(0, 8).map((item) => ({
      description: item.description,
      frequency: item.frequency,
      isCompleted: item.isCompleted ?? null,
    })),
    nextAppointment: nextAppointment
      ? {
          status: nextAppointment.status,
          reason: nextAppointment.reason,
          requestedAt: nextAppointment.requestedAt,
          scheduledAt: nextAppointment.scheduledAt ?? null,
          notes: truncate(nextAppointment.notes, 180),
        }
      : null,
  }
}

function extractResponseText(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null

  const root = data as Record<string, unknown>
  if (typeof root.output_text === 'string' && root.output_text.trim()) {
    return root.output_text.trim()
  }

  if (Array.isArray(root.output)) {
    const parts: string[] = []

    for (const item of root.output) {
      if (!item || typeof item !== 'object') continue
      const outputItem = item as Record<string, unknown>
      if (!Array.isArray(outputItem.content)) continue

      for (const content of outputItem.content) {
        if (!content || typeof content !== 'object') continue
        const contentItem = content as Record<string, unknown>
        if (typeof contentItem.text === 'string' && contentItem.text.trim()) {
          parts.push(contentItem.text.trim())
        }
      }
    }

    if (parts.length > 0) return parts.join('\n\n')
  }

  if (Array.isArray(root.choices)) {
    const firstChoice = root.choices[0]
    if (firstChoice && typeof firstChoice === 'object') {
      const choice = firstChoice as Record<string, unknown>
      const message = choice.message
      if (message && typeof message === 'object') {
        const msg = message as Record<string, unknown>
        if (typeof msg.content === 'string' && msg.content.trim()) {
          return msg.content.trim()
        }
      }
    }
  }

  return null
}

function extractApiError(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null
  const root = data as Record<string, unknown>
  const error = root.error
  if (!error || typeof error !== 'object') return null
  const message = (error as Record<string, unknown>).message
  return typeof message === 'string' ? message : null
}

function buildWelcomeMessage(patientName?: string, reason?: 'missing_key' | 'no_patient'): ChatMessage {
  if (reason === 'missing_key') {
    return createMessage(
      'assistant',
      'Set `VITE_OPENAI_API_KEY` in `assurecare-portal/.env` and restart the app to enable patient Q&A.',
      true
    )
  }

  if (reason === 'no_patient') {
    return createMessage(
      'assistant',
      'Select a patient first, then ask questions here about their current status, recent alerts, and care plan.',
      true
    )
  }

  return createMessage(
    'assistant',
    `Hi, I can help explain ${patientName ?? 'the patient'}'s portal data. Ask about recent alerts, vitals, symptoms, adherence, or the care plan.`
  )
}

export function CaregiverChatWidget() {
  const { activeRole, selectedPatientId } = useUIStore()
  const patients = usePatientStore((state) => state.patients)

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY?.trim()
  const model = import.meta.env.VITE_OPENAI_MODEL?.trim() || DEFAULT_MODEL

  const resolvedPatientId = useMemo(() => {
    if (selectedPatientId) return selectedPatientId
    if (activeRole === 'caregiver') {
      return patients.find((p) => p.id === CAREGIVER_DEFAULT_PATIENT_ID)?.id ?? patients[0]?.id ?? null
    }
    return null
  }, [activeRole, patients, selectedPatientId])

  const patientData = usePatient(resolvedPatientId ?? '')
  const patientContext = useMemo(() => buildPatientContext(patientData), [patientData])
  const patientName = patientData.patient?.name

  const [isOpen, setIsOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const hasPatientContext = Boolean(patientContext)

  useEffect(() => {
    if (!apiKey) {
      setMessages([buildWelcomeMessage(undefined, 'missing_key')])
      return
    }

    if (!hasPatientContext) {
      setMessages([buildWelcomeMessage(undefined, 'no_patient')])
      return
    }

    setMessages([buildWelcomeMessage(patientName)])
  }, [apiKey, hasPatientContext, patientName, resolvedPatientId])

  useEffect(() => {
    if (!isOpen) return
    const node = scrollRef.current
    if (!node) return
    node.scrollTop = node.scrollHeight
  }, [isOpen, messages, isSending])

  const canSend = Boolean(apiKey && patientContext && draft.trim() && !isSending)

  async function handleSend() {
    const question = draft.trim()
    if (!question || !apiKey || !patientContext || isSending) return

    const userMessage = createMessage('user', question)
    const currentMessages = [...messages, userMessage]

    setDraft('')
    setMessages(currentMessages)
    setIsSending(true)

    const convoTranscript = currentMessages
      .slice(-8)
      .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
      .join('\n')

    const prompt = [
      'You are a caregiver support assistant inside AssureCare.',
      'Use only the patient context provided below and the conversation transcript.',
      'Be clear and practical for a caregiver. Do not invent facts.',
      'Reply in the same language as the user’s latest message (English to English, Chinese to Chinese). If mixed, prioritize the language used in the latest question.',
      'If the answer is not in the provided data, say so explicitly.',
      'You may summarize trends and explain possible significance, but do not diagnose.',
      'If there are severe symptoms, red alerts, or urgent concerns, advise contacting the doctor or emergency services as appropriate.',
      '',
      'PATIENT CONTEXT (JSON)',
      JSON.stringify(patientContext, null, 2),
      '',
      'CONVERSATION',
      convoTranscript,
      '',
      `Latest caregiver question: ${question}`,
    ].join('\n')

    try {
      const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          input: prompt,
        }),
      })

      const data = (await response.json()) as unknown
      const apiError = extractApiError(data)

      if (!response.ok) {
        throw new Error(apiError || `OpenAI request failed (${response.status})`)
      }

      const text = extractResponseText(data)
      if (!text) {
        throw new Error('No text response returned by the model.')
      }

      setMessages((prev) => [...prev, createMessage('assistant', text)])
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error while contacting OpenAI.'
      setMessages((prev) => [
        ...prev,
        createMessage(
          'assistant',
          `I couldn’t answer right now. ${message}. Please try again.`,
          true
        ),
      ])
    } finally {
      setIsSending(false)
    }
  }

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-[70] w-[calc(100vw-2rem)] max-w-[420px] rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" />
                Caregiver Assistant
              </p>
              <p className="truncate text-xs text-slate-500">
                {patientName
                  ? `Patient: ${patientName}`
                  : activeRole === 'doctor'
                    ? 'Select a patient in doctor view to start'
                    : 'Loading patient context...'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="max-h-[420px] min-h-[280px] overflow-y-auto px-4 py-3 space-y-3 bg-slate-50/70"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={[
                    'max-w-[88%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap',
                    message.role === 'user'
                      ? 'bg-primary text-white rounded-br-md'
                      : message.isError
                        ? 'bg-rose-50 text-rose-800 border border-rose-200 rounded-bl-md'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-md',
                  ].join(' ')}
                >
                  <p>{message.content}</p>
                  <p
                    className={`mt-1 text-[11px] ${
                      message.role === 'user'
                        ? 'text-blue-100/90'
                        : message.isError
                          ? 'text-rose-500'
                          : 'text-slate-400'
                    }`}
                  >
                    {formatRelative(message.createdAt)}
                  </p>
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 p-3 space-y-2">
            <Textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  void handleSend()
                }
              }}
              placeholder={
                apiKey
                  ? patientContext
                    ? 'Ask about alerts, vitals, symptoms, or care plan...'
                    : 'Select a patient to start...'
                  : 'Add VITE_OPENAI_API_KEY to .env to enable chat...'
              }
              className="min-h-[72px] max-h-36 resize-y bg-white"
              disabled={!apiKey || !patientContext || isSending}
              aria-label="Chat message"
            />

            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] text-slate-400">
                Uses current portal data for the active patient.
              </p>
              <Button
                type="button"
                size="sm"
                onClick={() => void handleSend()}
                disabled={!canSend}
              >
                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Send
              </Button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[70] h-14 w-14 rounded-full bg-primary text-white shadow-lg ring-4 ring-blue-100 transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-label={isOpen ? 'Close caregiver assistant chat' : 'Open caregiver assistant chat'}
      >
        {isOpen ? <X className="mx-auto h-6 w-6" /> : <MessageCircle className="mx-auto h-6 w-6" />}
      </button>
    </>
  )
}
