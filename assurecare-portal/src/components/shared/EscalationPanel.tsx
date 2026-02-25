import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { usePatient } from '@/hooks/usePatient'
import { usePatientStore } from '@/store/usePatientStore'
import { useActionLogStore } from '@/store/useActionLogStore'
import { AppointmentRequestForm } from './AppointmentRequestForm'
import { toast } from 'sonner'
import { Calendar, ArrowUpCircle, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDateTime } from '@/lib/dateUtils'

interface EscalationPanelProps {
  open: boolean
  onClose: () => void
}

const STATUS_STYLES = {
  requested: 'bg-amber-50 text-amber-700 border-amber-200',
  scheduled: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  completed: 'bg-slate-50 text-slate-600 border-slate-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
}
const STATUS_ICONS = {
  requested: <Clock className="w-3.5 h-3.5" />,
  scheduled: <CheckCircle2 className="w-3.5 h-3.5" />,
  completed: <CheckCircle2 className="w-3.5 h-3.5" />,
  cancelled: <XCircle className="w-3.5 h-3.5" />,
}

export function EscalationPanel({ open, onClose }: EscalationPanelProps) {
  const [activeTab, setActiveTab] = useState<'appointments' | 'escalation'>('appointments')
  const [apptFormOpen, setApptFormOpen] = useState(false)
  const [escalating, setEscalating] = useState(false)

  const { nextAppointment, patientAppointments, patientEscalations, latestAlert, dailySummary } =
    usePatient('patient-001')
  const { addEscalation } = usePatientStore()
  const { logAction } = useActionLogStore()

  const handleEscalate = () => {
    setEscalating(true)
    const id = `esc-${Date.now()}`
    addEscalation({
      id,
      patientId: 'patient-001',
      initiatedBy: 'user-ana',
      escalationType: 'to_doctor',
      reasonCodes: latestAlert?.reasonCodes ?? [],
      outcome: 'pending',
      notes: 'Caregiver escalated via portal — requesting medical review.',
      createdAt: new Date().toISOString(),
    })
    logAction('user-ana', 'caregiver', 'patient-001', 'escalation_created', { escalationId: id })
    toast.success('Escalation sent to Dr. Chan')
    setEscalating(false)
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Escalation & Appointments</SheetTitle>
          </SheetHeader>

          {/* Tab switcher */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-full p-0.5 mt-4 mb-5">
            {(['appointments', 'escalation'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'flex-1 py-1.5 rounded-full text-sm font-medium transition-all capitalize',
                  activeTab === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'appointments' && (
            <div className="space-y-4">
              {nextAppointment && (
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Next Appointment</p>
                  <p className="font-semibold text-slate-900 text-sm">{nextAppointment.reason.replace(/_/g, ' ')}</p>
                  <p className="text-sm text-slate-600 mt-0.5">
                    {nextAppointment.scheduledAt
                      ? formatDateTime(nextAppointment.scheduledAt)
                      : 'Awaiting confirmation'}
                  </p>
                  <div className={cn('mt-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium w-fit', STATUS_STYLES[nextAppointment.status])}>
                    {STATUS_ICONS[nextAppointment.status]}
                    <span className="capitalize">{nextAppointment.status}</span>
                  </div>
                </div>
              )}

              <Button
                onClick={() => setApptFormOpen(true)}
                className="w-full gap-1.5"
                variant="outline"
              >
                <Calendar className="w-4 h-4" />
                Request Appointment with Dr. Chan
              </Button>

              {patientAppointments.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">All Appointments</p>
                  <div className="space-y-2">
                    {patientAppointments.map((appt) => (
                      <div key={appt.id} className="bg-white rounded-lg border border-slate-200 p-3">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-medium text-slate-800 capitalize">
                            {appt.reason.replace(/_/g, ' ')}
                          </p>
                          <div className={cn('flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium', STATUS_STYLES[appt.status])}>
                            {STATUS_ICONS[appt.status]}
                            <span className="capitalize">{appt.status}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {appt.scheduledAt ? formatDateTime(appt.scheduledAt) : `Requested ${formatDateTime(appt.requestedAt)}`}
                        </p>
                        {appt.notes && <p className="text-xs text-slate-500 mt-1">{appt.notes}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'escalation' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-amber-800 mb-1.5">Escalate to Dr. Chan (Non-urgent)</p>
                <p className="text-xs text-amber-700 mb-3">
                  This will notify Dr. Chan that Ms. Tan needs attention. He will review and follow up within the next business day.
                </p>
                <Button
                  onClick={handleEscalate}
                  disabled={escalating}
                  className="gap-1.5 bg-amber-600 hover:bg-amber-700 text-white"
                  size="sm"
                >
                  <ArrowUpCircle className="w-4 h-4" />
                  Escalate Now
                </Button>
              </div>

              {patientEscalations.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Escalation History</p>
                  <div className="space-y-2">
                    {patientEscalations.map((esc) => (
                      <div key={esc.id} className="bg-white rounded-lg border border-slate-200 p-3">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium capitalize text-slate-700">{esc.escalationType.replace(/_/g, ' ')}</p>
                          <span className={cn(
                            'text-xs px-2 py-0.5 rounded-full border',
                            esc.outcome === 'resolved' && 'bg-emerald-50 text-emerald-700 border-emerald-200',
                            esc.outcome === 'pending' && 'bg-amber-50 text-amber-700 border-amber-200',
                            esc.outcome === 'acknowledged' && 'bg-blue-50 text-blue-700 border-blue-200',
                          )}>
                            {esc.outcome}
                          </span>
                        </div>
                        {esc.notes && <p className="text-xs text-slate-500">{esc.notes}</p>}
                        <p className="text-xs text-slate-400 mt-1">{formatDateTime(esc.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      <AppointmentRequestForm
        open={apptFormOpen}
        onClose={() => setApptFormOpen(false)}
        aiSummarySnippet={dailySummary?.highlights.slice(0, 2).join('; ') ?? ''}
      />
    </>
  )
}
