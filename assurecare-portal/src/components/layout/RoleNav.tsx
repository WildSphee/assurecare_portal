import { useNavigate, useLocation } from 'react-router-dom'
import { useUIStore } from '@/store/useUIStore'
import { Stethoscope, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

export function RoleNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setRole } = useUIStore()

  const isCaregiver = location.pathname === '/caregiver'
  const isDoctor = location.pathname === '/doctor' || location.pathname.startsWith('/doctor/')

  const handleCaregiver = () => {
    setRole('caregiver')
    navigate('/caregiver')
  }

  const handleDoctor = () => {
    setRole('doctor')
    navigate('/doctor')
  }

  return (
    <div className="flex items-center gap-1 bg-slate-100 rounded-full p-1">
      <button
        onClick={handleCaregiver}
        className={cn(
          'flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all',
          isCaregiver
            ? 'bg-white text-primary shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        )}
        aria-label="Switch to Caregiver view"
      >
        <Heart className="w-4 h-4" />
        Caregiver (Ana)
      </button>
      <button
        onClick={handleDoctor}
        className={cn(
          'flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all',
          isDoctor
            ? 'bg-white text-primary shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        )}
        aria-label="Switch to Doctor view"
      >
        <Stethoscope className="w-4 h-4" />
        Doctor (Dr. Chan)
      </button>
    </div>
  )
}
