import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useUIStore } from '@/store/useUIStore'
import { CaregiverChatWidget } from '@/components/shared/CaregiverChatWidget'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const { activeRole, setRole } = useUIStore()

  const isDoctorRoute = location.pathname === '/doctor' || location.pathname.startsWith('/doctor/')
  const routeRole = isDoctorRoute ? 'doctor' : 'caregiver'
  const nextRole = isDoctorRoute ? 'caregiver' : 'doctor'
  const nextRoute = nextRole === 'doctor' ? '/doctor' : '/caregiver'
  const nextRoleLabel = nextRole === 'doctor' ? 'Doctor view' : 'Caregiver view'
  const avatarImageSrc =
    routeRole === 'caregiver'
      ? '/images/caregiver_ana.png'
      : '/images/singapore_doctor_upper_body_square.png'
  const avatarAlt = routeRole === 'caregiver' ? 'Ana Tan profile' : 'Dr. Chan profile'

  useEffect(() => {
    if (activeRole !== routeRole) {
      setRole(routeRole)
    }
  }, [activeRole, routeRole, setRole])

  const handleRoleSwitch = () => {
    setRole(nextRole)
    navigate(nextRoute)
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm h-16 flex items-center px-6">
        <div className="flex items-center gap-2 flex-1">
          <div className="flex items-center gap-2 text-primary font-bold text-xl">
            <img src="/assurecare-logo.svg" alt="AssureCare logo" className="w-7 h-7 rounded-md" />
            <span>AssureCare</span>
          </div>
          <span className="text-slate-300 text-lg ml-1">|</span>
          <span className="text-slate-500 text-sm">
            {routeRole === 'caregiver' ? 'Caregiver Portal' : 'Doctor Portal'}
          </span>
        </div>

        <div className="ml-auto flex items-center">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={handleRoleSwitch}
                    className="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden border border-slate-300 bg-white hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    aria-label={`Switch to ${nextRoleLabel}`}
                  >
                    <img
                      src={avatarImageSrc}
                      alt={avatarAlt}
                      className="h-full w-full object-cover"
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Switch to {nextRoleLabel}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span>
              {routeRole === 'caregiver' ? 'Ana Tan' : 'Dr. Chan Wei Ming'}
            </span>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      <CaregiverChatWidget />
    </div>
  )
}
