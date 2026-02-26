import { useEffect, useMemo, useRef, useState } from 'react'
import { Loader2, Send, X } from 'lucide-react'
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
const CHAT_WIDGET_EVENT = 'assurecare:chat-widget'

type ChatWidgetEventDetail = {
  action?: 'open' | 'close' | 'toggle'
}

function createMessage(role: ChatRole, content: string, isError = false): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    createdAt: new Date().toISOString(),
    ...(isError ? { isError: true } : {}),
  }
}

function buildMsTanMockReply(msTanData: ReturnType<typeof usePatient>): string {
  const patientName = msTanData.patient?.name ?? 'Ms. Tan'
  const vitals = msTanData.latestVitals
  const symptom = msTanData.patientSymptoms[0]
  const symptomsLabel = symptom
    ? `${symptom.symptomType} (${symptom.severity})`
    : 'No new symptom logged'
  const vitalsLabel = vitals
    ? `BP ${vitals.bpSystolic}/${vitals.bpDiastolic}, HR ${vitals.hrBpm}`
    : 'Vitals not available'

  const statusLines = [
    `${patientName} today: mild heartache reported; currently engaged and being monitored.`,
    `Latest check: ${vitalsLabel}.`,
    `Most recent symptom: ${symptomsLabel}.`,
  ]

  const recommendedActions = [
    'Call Ms. Tan now to check pain severity, duration, and any worsening symptoms.',
    'Update Dr. Chan today for same-day symptom review.',
    'If chest pain worsens or breathing difficulty starts, seek urgent/emergency care immediately.',
  ]

  return [
    ...statusLines,
    '',
    'What to do now:',
    ...recommendedActions.map((action, index) => `${index + 1}. ${action}`),
  ].join('\n')
}

function buildWelcomeMessage(): ChatMessage {
  return createMessage(
    'assistant',
    "Mock chat mode is enabled. Whatever you ask, I'll reply with Ms. Tan's today's status and recommended action."
  )
}

export function CaregiverChatWidget() {
  const { activeRole, selectedPatientId } = useUIStore()
  const patients = usePatientStore((state) => state.patients)

  const resolvedPatientId = useMemo(() => {
    if (selectedPatientId) return selectedPatientId
    if (activeRole === 'caregiver') {
      return patients.find((p) => p.id === CAREGIVER_DEFAULT_PATIENT_ID)?.id ?? patients[0]?.id ?? null
    }
    return null
  }, [activeRole, patients, selectedPatientId])

  const patientData = usePatient(resolvedPatientId ?? '')
  const msTanData = usePatient(CAREGIVER_DEFAULT_PATIENT_ID)
  const patientName = patientData.patient?.name

  const [isOpen, setIsOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    setMessages([buildWelcomeMessage()])
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const node = scrollRef.current
    if (!node) return
    node.scrollTop = node.scrollHeight
  }, [isOpen, messages, isSending])

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null
      if (!target) return
      if (panelRef.current?.contains(target)) return
      setIsOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
    }
  }, [isOpen])

  useEffect(() => {
    const handleChatWidgetEvent = (event: Event) => {
      const customEvent = event as CustomEvent<ChatWidgetEventDetail>
      const action = customEvent.detail?.action ?? 'toggle'

      if (action === 'open') setIsOpen(true)
      else if (action === 'close') setIsOpen(false)
      else setIsOpen((open) => !open)
    }

    window.addEventListener(CHAT_WIDGET_EVENT, handleChatWidgetEvent as EventListener)
    return () => window.removeEventListener(CHAT_WIDGET_EVENT, handleChatWidgetEvent as EventListener)
  }, [])

  const canSend = Boolean(draft.trim() && !isSending)

  async function handleSend() {
    const question = draft.trim()
    if (!question || isSending) return

    const userMessage = createMessage('user', question)
    setDraft('')
    setMessages((prev) => [...prev, userMessage])
    setIsSending(true)

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 3000))
      setMessages((prev) => [...prev, createMessage('assistant', buildMsTanMockReply(msTanData))])
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error while generating mock response.'
      setMessages((prev) => [
        ...prev,
        createMessage(
          'assistant',
          `I couldn’t return the mock response right now. ${message}. Please try again.`,
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
        <div
          ref={panelRef}
          className="fixed bottom-24 right-4 sm:right-6 z-[70] w-[calc(100vw-2rem)] max-w-[420px] rounded-2xl border border-slate-200 bg-white shadow-2xl"
        >
          <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <img
                  src="/images/bot.png"
                  alt="Chatbot"
                  className="h-4 w-4 rounded-sm object-contain"
                />
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
                  Reloading...
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
                'Ask me anything...'
              }
              className="min-h-[72px] max-h-36 resize-y bg-white"
              disabled={isSending}
              aria-label="Chat message"
            />

            <div className="flex items-center justify-between gap-3">
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

      {activeRole !== 'caregiver' && (
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[70] h-14 w-14 rounded-full bg-primary text-white shadow-lg ring-4 ring-blue-100 transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label={isOpen ? 'Close caregiver assistant chat' : 'Open caregiver assistant chat'}
        >
          {isOpen ? (
            <X className="mx-auto h-6 w-6" />
          ) : (
            <img
              src="/images/bot.png"
              alt=""
              className="h-full w-full rounded-full object-cover"
            />
          )}
        </button>
      )}
    </>
  )
}
