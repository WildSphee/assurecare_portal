import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { usePatientStore } from '@/store/usePatientStore'
import { useActionLogStore } from '@/store/useActionLogStore'
import { toast } from 'sonner'
import { MessageSquare } from 'lucide-react'

interface MessagingModalProps {
  open: boolean
  onClose: () => void
  patientId?: string
  patientName?: string
  senderRole?: 'caregiver' | 'doctor'
  senderId?: string
}

const TEMPLATES = [
  { id: 'tpl-evening-meds', label: 'Evening medication reminder', text: 'Please remember to take your evening medication.' },
  { id: 'tpl-checkin', label: 'Check-in reminder', text: 'Your check-in is due — please respond when you are ready.' },
  { id: 'tpl-dr-message', label: 'Family doctor message', text: 'Your family doctor has sent you a message — please check in tomorrow morning.' },
  { id: 'tpl-call', label: 'Call notice', text: 'Your caregiver would like to speak with you. Please expect a phone call.' },
]

export function MessagingModal({
  open,
  onClose,
  patientId = 'patient-001',
  patientName = 'Mrs Tan',
  senderRole = 'caregiver',
  senderId = 'user-ana',
}: MessagingModalProps) {
  const [messageType, setMessageType] = useState<'free_text' | 'template'>('template')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [freeText, setFreeText] = useState('')
  const { addMessage } = usePatientStore()
  const { logAction } = useActionLogStore()

  const MAX_CHARS = 280
  const currentText = messageType === 'template' ? (TEMPLATES.find((t) => t.id === selectedTemplate)?.text ?? '') : freeText
  const canSend = currentText.trim().length > 0

  const handleSend = () => {
    const content = currentText.trim()
    addMessage({
      id: `msg-${Date.now()}`,
      senderId,
      senderRole,
      patientId,
      content,
      messageType,
      templateId: messageType === 'template' ? selectedTemplate : undefined,
      deliveryStatus: 'sent',
      sentAt: new Date().toISOString(),
    })
    logAction(senderId, senderRole, patientId, 'message_sent', { content, deliveryStatus: 'sent' })
    toast.success(`Message sent to ${patientName}'s device`)
    onClose()
    setFreeText('')
    setSelectedTemplate('')
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Send Message to {patientName}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Compose and send a message to the patient&apos;s AssureCare home device.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Type toggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 rounded-full p-0.5 w-full">
              {(['template', 'free_text'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setMessageType(type)}
                  className={`flex-1 py-1.5 rounded-full text-sm font-medium transition-all ${
                    messageType === type ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  {type === 'template' ? 'Use Template' : 'Free Text'}
                </button>
              ))}
            </div>
          </div>

          {messageType === 'template' ? (
            <div className="space-y-2">
              <Label>Choose a template</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a message template..." />
                </SelectTrigger>
                <SelectContent>
                  {TEMPLATES.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedTemplate && (
                <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-600 border border-slate-200">
                  <p className="text-xs font-medium text-slate-400 mb-1">Preview</p>
                  {TEMPLATES.find((t) => t.id === selectedTemplate)?.text}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                value={freeText}
                onChange={(e) => setFreeText(e.target.value.slice(0, MAX_CHARS))}
                placeholder="Type a message for Mrs Tan's device..."
                rows={3}
              />
              <p className="text-xs text-slate-400 text-right">{freeText.length}/{MAX_CHARS}</p>
            </div>
          )}

          <p className="text-xs text-slate-400 bg-slate-50 rounded-lg p-2">
            This message will be delivered to {patientName}'s AssureCare home device and read aloud at the next interaction.
          </p>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSend} disabled={!canSend} className="gap-1.5">
              <MessageSquare className="w-4 h-4" />
              Send Message
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
