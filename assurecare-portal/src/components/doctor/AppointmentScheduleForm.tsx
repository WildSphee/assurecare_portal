import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useAppointmentStore } from '@/store/useAppointmentStore'
import { useActionLogStore } from '@/store/useActionLogStore'
import { usePatient } from '@/hooks/usePatient'
import { toast } from 'sonner'
import { Calendar } from 'lucide-react'
import type { AppointmentReason } from '@/types'

const REASON_LABELS: Record<AppointmentReason, string> = {
  routine_follow_up: 'Routine Follow-up',
  bp_concern: 'Blood Pressure Concern',
  medication_review: 'Medication Review',
  symptom_check: 'Symptom Check',
  post_discharge: 'Post-Discharge Review',
  other: 'Other',
}

interface AppointmentScheduleFormProps {
  open: boolean
  onClose: () => void
  patientId: string
  patientName: string
}

export function AppointmentScheduleForm({
  open,
  onClose,
  patientId,
  patientName,
}: AppointmentScheduleFormProps) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('09:00')
  const [reason, setReason] = useState<AppointmentReason>('routine_follow_up')
  const [notes, setNotes] = useState('')
  const [attachSummary, setAttachSummary] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const { requestAppointment } = useAppointmentStore()
  const { logAction } = useActionLogStore()
  const { clinicalSummary } = usePatient(patientId)

  const handleSubmit = () => {
    if (!date) {
      toast.error('Please select an appointment date')
      return
    }
    setSubmitting(true)

    const scheduledAt = `${date}T${time}:00.000Z`
    const aiSnippet =
      attachSummary && clinicalSummary
        ? clinicalSummary.highlights.slice(0, 2).join('; ')
        : undefined

    const newAppt = {
      id: `appt-${Date.now()}`,
      patientId,
      doctorId: 'user-dr-chan',
      status: 'scheduled' as const,
      requestedAt: new Date().toISOString(),
      scheduledAt,
      reason,
      notes,
      aiSummarySnippet: aiSnippet,
      initiatedBy: 'user-dr-chan',
    }

    requestAppointment(newAppt)
    logAction('user-dr-chan', 'doctor', patientId, 'appointment_scheduled', {
      appointmentId: newAppt.id,
      scheduledAt,
      reason,
    })

    toast.success(`Appointment scheduled for ${patientName} on ${date} at ${time}`)
    setSubmitting(false)
    setDate('')
    setTime('09:00')
    setNotes('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Schedule Appointment
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-slate-500 -mt-1">
          Scheduling for <span className="font-medium text-slate-700">{patientName}</span>
        </p>

        <div className="space-y-4">
          {/* Date & time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="appt-date" className="text-xs">
                Date
              </Label>
              <Input
                id="appt-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="appt-time" className="text-xs">
                Time
              </Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger id="appt-time" className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-1.5">
            <Label htmlFor="appt-reason" className="text-xs">
              Reason
            </Label>
            <Select
              value={reason}
              onValueChange={(v) => setReason(v as AppointmentReason)}
            >
              <SelectTrigger id="appt-reason" className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(REASON_LABELS) as [AppointmentReason, string][]).map(
                  ([val, label]) => (
                    <SelectItem key={val} value={val}>
                      {label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Pre-visit instructions */}
          <div className="space-y-1.5">
            <Label htmlFor="appt-notes" className="text-xs">
              Pre-visit instructions
            </Label>
            <Textarea
              id="appt-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Instructions for the patient before the visit..."
              className="text-sm resize-none"
              rows={3}
            />
          </div>

          {/* Attach AI summary */}
          {clinicalSummary && (
            <div className="flex items-center gap-2">
              <Checkbox
                id="attach-summary"
                checked={attachSummary}
                onCheckedChange={(v) => setAttachSummary(!!v)}
              />
              <Label htmlFor="attach-summary" className="text-xs text-slate-600 cursor-pointer">
                Attach AI clinical summary to appointment record
              </Label>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleSubmit}
            disabled={submitting || !date}
            className="flex-1"
          >
            {submitting ? 'Scheduling…' : 'Schedule Appointment'}
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
