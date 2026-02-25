import { usePatient } from '@/hooks/usePatient'
import { Stethoscope, CheckCircle2, Circle, Clock } from 'lucide-react'

const FREQ_COLOR: Record<string, string> = {
  'Twice daily': 'bg-blue-50 text-blue-600',
  'Daily': 'bg-emerald-50 text-emerald-600',
  '5× per week': 'bg-purple-50 text-purple-600',
  'As needed': 'bg-slate-100 text-slate-500',
}

export function CarePlanChecklist() {
  const { patientCarePlan } = usePatient('patient-001')

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Stethoscope className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-slate-700">Care Plan</h3>
        <span className="text-xs text-slate-400">Set by Dr. Chan</span>
      </div>

      <div className="space-y-2">
        {patientCarePlan.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-white"
          >
            <span className="mt-0.5 shrink-0">
              {item.isCompleted ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <Circle className="w-4 h-4 text-slate-300" />
              )}
            </span>
            <div className="flex-1">
              <p className="text-sm text-slate-700 leading-snug">{item.description}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 flex items-center gap-1 ${FREQ_COLOR[item.frequency] ?? 'bg-slate-100 text-slate-500'}`}>
              <Clock className="w-2.5 h-2.5" />
              {item.frequency}
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-400 mt-3">
        To update the care plan, please contact Dr. Chan.
      </p>
    </div>
  )
}
