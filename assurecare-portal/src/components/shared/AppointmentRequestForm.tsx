import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useAppointmentStore } from '@/store/useAppointmentStore'
import { useActionLogStore } from '@/store/useActionLogStore'
import { toast } from 'sonner'
import type { AppointmentReason } from '@/types'
import { Calendar } from 'lucide-react'

interface AppointmentRequestFormProps {
  open: boolean
  onClose: () => void
  aiSummarySnippet?: string
  patientId?: string
  requesterId?: string
  requesterRole?: 'caregiver' | 'doctor'
}

const REASON_OPTIONS: { value: AppointmentReason; label: string }[] = [
  { value: 'routine_follow_up', label: 'Routine follow-up' },
  { value: 'bp_concern', label: 'Blood pressure concern' },
  { value: 'medication_review', label: 'Medication review' },
  { value: 'symptom_check', label: 'Symptom check' },
  { value: 'post_discharge', label: 'Post-discharge review' },
  { value: 'other', label: 'Other' },
]

const TIME_WINDOWS = [
  'Morning weekdays (8am–12pm)',
  'Afternoon weekdays (12pm–5pm)',
  'Weekend morning (9am–12pm)',
]

export function AppointmentRequestForm({
  open,
  onClose,
  aiSummarySnippet = '',
  patientId = 'patient-001',
  requesterId = 'user-ana',
  requesterRole = 'caregiver',
}: AppointmentRequestFormProps) {
  const [reason, setReason] = useState<AppointmentReason | ''>('')
  const [selectedWindows, setSelectedWindows] = useState<string[]>([])
  const [notes, setNotes] = useState(aiSummarySnippet)
  const [includeAI, setIncludeAI] = useState(true)
  const { requestAppointment } = useAppointmentStore()
  const { logAction } = useActionLogStore()

  const canSubmit = reason !== ''

  const toggleWindow = (w: string) => {
    setSelectedWindows((prev) =>
      prev.includes(w) ? prev.filter((x) => x !== w) : [...prev, w]
    )
  }

  const handleSubmit = () => {
    const id = `appt-${Date.now()}`
    requestAppointment({
      id,
      patientId,
      doctorId: 'user-dr-chan',
      status: 'requested',
      requestedAt: new Date().toISOString(),
      preferredWindows: selectedWindows,
      reason: reason as AppointmentReason,
      notes,
      aiSummarySnippet: includeAI ? aiSummarySnippet : undefined,
      initiatedBy: requesterId,
    })
    logAction(requesterId, requesterRole, patientId, 'appointment_requested', { appointmentId: id, reason })
    toast.success('Appointment request sent to Dr. Chan\'s clinic')
    onClose()
    setReason('')
    setSelectedWindows([])
    setNotes(aiSummarySnippet)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Request Appointment with Dr. Chan
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Reason for appointment <span className="text-red-500">*</span></Label>
            <Select value={reason} onValueChange={(v) => setReason(v as AppointmentReason)}>
              <SelectTrigger>
                <SelectValue placeholder="Select reason..." />
              </SelectTrigger>
              <SelectContent>
                {REASON_OPTIONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Preferred time windows</Label>
            <div className="space-y-2">
              {TIME_WINDOWS.map((w) => (
                <div key={w} className="flex items-center gap-2">
                  <Checkbox
                    id={w}
                    checked={selectedWindows.includes(w)}
                    onCheckedChange={() => toggleWindow(w)}
                  />
                  <label htmlFor={w} className="text-sm text-slate-600 cursor-pointer">{w}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Additional notes</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="include-ai"
                  checked={includeAI}
                  onCheckedChange={(v) => {
                    setIncludeAI(!!v)
                    setNotes(v ? aiSummarySnippet : '')
                  }}
                />
                <label htmlFor="include-ai" className="text-xs text-slate-500 cursor-pointer">
                  Include AI summary
                </label>
              </div>
            </div>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional context for Dr. Chan..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!canSubmit} className="gap-1.5">
              <Calendar className="w-4 h-4" />
              Send Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
