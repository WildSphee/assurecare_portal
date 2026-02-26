import { Phone, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useActionLogStore } from '@/store/useActionLogStore'

interface QuickActionsProps {
  onMessageClick: () => void
  onEscalateClick: () => void
}

export function QuickActions({ onMessageClick, onEscalateClick }: QuickActionsProps) {
  void onMessageClick
  const { logAction } = useActionLogStore()

  const handleCall = () => {
    logAction('user-ana', 'caregiver', 'patient-001', 'call_initiated', {
      note: 'Caregiver initiated call via portal',
    })
    window.location.href = 'tel:+6591112222'
  }

  return (
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
        onClick={onEscalateClick}
        className="gap-1.5 text-amber-700 border-amber-300 hover:bg-amber-50"
        aria-label="Escalate to Dr Chan"
      >
        <AlertCircle className="w-3.5 h-3.5" />
        Escalate to Dr Chan
      </Button>
    </div>
  )
}
