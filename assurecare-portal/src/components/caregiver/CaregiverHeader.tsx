import { usePatient } from '@/hooks/usePatient'
import { QuickActions } from './QuickActions'
import { Stethoscope, Heart, User } from 'lucide-react'

interface CaregiverHeaderProps {
  onMessageClick: () => void
  onEscalateClick: () => void
}

export function CaregiverHeader({ onMessageClick, onEscalateClick }: CaregiverHeaderProps) {
  const { patient } = usePatient('patient-001')

  if (!patient) return null

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

        {/* Care team info */}
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-400" />
            <span>Caregiver: <strong>Ana Tan</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Stethoscope className="w-4 h-4 text-primary" />
            <span>Doctor: <strong>Dr. Chan</strong></span>
            <a href="tel:+6563334444" className="text-primary hover:underline text-xs">+65-6333-4444</a>
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions onMessageClick={onMessageClick} onEscalateClick={onEscalateClick} />
      </div>
    </div>
  )
}
