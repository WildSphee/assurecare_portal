import { useState } from 'react'
import { Phone, MessageSquare, AlertCircle, Siren } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmergencyGuidanceDialog } from '@/components/shared/EmergencyGuidanceDialog'
import { useActionLogStore } from '@/store/useActionLogStore'

interface QuickActionsProps {
  onMessageClick: () => void
  onEscalateClick: () => void
}

export function QuickActions({ onMessageClick, onEscalateClick }: QuickActionsProps) {
  const [emergencyOpen, setEmergencyOpen] = useState(false)
  const { logAction } = useActionLogStore()

  const handleCall = () => {
    logAction('user-ana', 'caregiver', 'patient-001', 'call_initiated', {
      note: 'Caregiver initiated call via portal',
    })
    window.location.href = 'tel:+6591112222'
  }

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCall}
          className="gap-1.5 text-emerald-700 border-emerald-300 hover:bg-emerald-50"
          aria-label="Call Ms. Tan"
        >
          <Phone className="w-3.5 h-3.5" />
          Call Ms. Tan
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onMessageClick}
          className="gap-1.5 text-blue-700 border-blue-300 hover:bg-blue-50"
          aria-label="Send message via chatbot"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Message
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onEscalateClick}
          className="gap-1.5 text-amber-700 border-amber-300 hover:bg-amber-50"
          aria-label="Escalate or book appointment"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          Escalate / Book
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setEmergencyOpen(true)}
          className="gap-1.5 text-red-700 border-red-300 hover:bg-red-50"
          aria-label="Open emergency guidance"
        >
          <Siren className="w-3.5 h-3.5" />
          Emergency
        </Button>
      </div>

      <EmergencyGuidanceDialog open={emergencyOpen} onClose={() => setEmergencyOpen(false)} />
    </>
  )
}
