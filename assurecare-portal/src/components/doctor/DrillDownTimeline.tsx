import { useState } from 'react'
import { AlertTimeline } from '@/components/shared/AlertTimeline'
import { useTimeline } from '@/hooks/useTimeline'
import { useActionLogStore } from '@/store/useActionLogStore'
import { toast } from 'sonner'
import { CheckSquare } from 'lucide-react'

export function DrillDownTimeline({ patientId }: { patientId: string }) {
  const [daysBack, setDaysBack] = useState<7 | 14>(14)
  const { logAction } = useActionLogStore()
  const events = useTimeline(patientId, daysBack)

  const handleMarkReviewed = () => {
    logAction('user-dr-chan', 'doctor', patientId, 'mark_reviewed', { daysBack })
    toast.success('Patient timeline marked as reviewed')
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">Recent Activity</p>
        <button
          onClick={handleMarkReviewed}
          className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
          aria-label="Mark timeline as reviewed"
        >
          <CheckSquare className="w-3.5 h-3.5" />
          Mark reviewed
        </button>
      </div>

      <AlertTimeline
        events={events}
        daysBack={daysBack}
        onDaysBackChange={setDaysBack}
        role="doctor"
      />
    </div>
  )
}
