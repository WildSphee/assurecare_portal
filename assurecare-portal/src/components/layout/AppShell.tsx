import { Outlet } from 'react-router-dom'
import { useUIStore } from '@/store/useUIStore'
import { RoleNav } from './RoleNav'
import { Activity } from 'lucide-react'

export function AppShell() {
  const { activeRole } = useUIStore()

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm h-16 flex items-center px-6">
        <div className="flex items-center gap-2 flex-1">
          <div className="flex items-center gap-2 text-primary font-bold text-xl">
            <Activity className="w-6 h-6" />
            <span>AssureCare</span>
          </div>
          <span className="text-slate-300 text-lg ml-1">|</span>
          <span className="text-slate-500 text-sm">Health Monitoring Portal</span>
        </div>

        <div className="flex-1 flex justify-center">
          <RoleNav />
        </div>

        <div className="flex-1 flex justify-end">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold">
              {activeRole === 'caregiver' ? 'A' : 'D'}
            </div>
            <span>
              {activeRole === 'caregiver' ? 'Ana Tan' : 'Dr. Chan Wei Ming'}
            </span>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
