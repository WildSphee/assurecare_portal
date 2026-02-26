import { useUIStore } from '@/store/useUIStore'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LayoutGrid, List, Map, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function DoctorHeader() {
  const { searchQuery, setSearch, doctorViewMode, setViewMode, sortOrder, setSortOrder } =
    useUIStore()

  return (
    <div className="sticky top-16 z-40 bg-white border-b border-slate-200 shadow-sm px-6 py-3">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient name…"
            className="pl-9 text-sm"
            aria-label="Search patients"
          />
          {searchQuery && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as typeof sortOrder)}>
          <SelectTrigger className="w-44 text-sm" aria-label="Sort patients">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="risk_desc">Risk: High → Low</SelectItem>
            <SelectItem value="newest_alerts">Newest Alerts</SelectItem>
            <SelectItem value="upcoming_appointments">Upcoming Appointments</SelectItem>
          </SelectContent>
        </Select>

        {/* View toggles */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('cards')}
            className={cn('p-1.5 rounded-md transition-all', doctorViewMode === 'cards' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700')}
            aria-label="Card view"
            title="Card view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={cn('p-1.5 rounded-md transition-all', doctorViewMode === 'table' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700')}
            aria-label="Table view"
            title="Table view"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={cn('p-1.5 rounded-md transition-all', doctorViewMode === 'map' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700')}
            aria-label="Map view"
            title="Map view"
          >
            <Map className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
