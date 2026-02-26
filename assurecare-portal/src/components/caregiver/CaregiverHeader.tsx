import { usePatient } from '@/hooks/usePatient'
import { QuickActions } from './QuickActions'
import { User } from 'lucide-react'

interface CaregiverHeaderProps {
  onMessageClick: () => void
  onEscalateClick: () => void
}

export function CaregiverHeader({ onMessageClick, onEscalateClick }: CaregiverHeaderProps) {
  const { patient } = usePatient('patient-001')

  if (!patient) return null
  const shortArea = patient.location?.area?.split(',')[0]?.trim()

  return (
    <div className="sticky top-16 z-40 bg-white border-b border-slate-200 shadow-sm px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        {/* Patient Identity */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold text-slate-900">{patient.name}</h1>
              <span className="text-slate-400">·</span>
              <span className="text-slate-600 font-medium">Age {patient.age}</span>
              {shortArea && (
                <>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-600 font-medium">{shortArea}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
              {patient.conditions.map((c) => (
                <span
                  key={c}
                  className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions onMessageClick={onMessageClick} onEscalateClick={onEscalateClick} />
      </div>
    </div>
  )
}
