import { useMemo } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { usePatientStore } from '@/store/usePatientStore'
import { useUIStore } from '@/store/useUIStore'
import { cn, getRiskLabel } from '@/lib/utils'
import { REASON_CODE_LABELS } from '@/lib/reasonCodes'
import { formatRelative } from '@/lib/dateUtils'

const RISK_COLORS: Record<string, string> = {
  red: '#DC2626',
  yellow: '#D97706',
  green: '#16A34A',
}

export function PatientMap() {
  const { patients, alerts, vitals } = usePatientStore()
  const { activeFilters, searchQuery, setSelectedPatient } = useUIStore()

  const alertByPatient = useMemo(
    () =>
      new Map(
        patients.map((p) => {
          const a = alerts
            .filter((al) => al.patientId === p.id && al.status === 'open')
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]
          return [p.id, a ?? null]
        })
      ),
    [patients, alerts]
  )

  const latestVitalsByPatient = useMemo(
    () =>
      new Map(
        patients.map((p) => {
          const v = vitals
            .filter((vr) => vr.patientId === p.id)
            .sort((a, b) => b.date.localeCompare(a.date))[0]
          return [p.id, v ?? null]
        })
      ),
    [patients, vitals]
  )

  const filteredPatients = useMemo(() => {
    let rows = patients.filter((p) => p.location)

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      rows = rows.filter((p) => p.name.toLowerCase().includes(q))
    }

    if (activeFilters.length > 0) {
      rows = rows.filter((p) =>
        activeFilters.every((f) => {
          if (f === 'Red') return p.riskStatus === 'red'
          if (f === 'Yellow') return p.riskStatus === 'yellow'
          if (f === 'No data >48h') return p.noResponseStreak >= 2
          if (f === 'Post-discharge')
            return p.conditions.some(
              (c) =>
                c.toLowerCase().includes('post-discharge') ||
                c.toLowerCase().includes('post discharge')
            )
          if (f === 'Hypertension')
            return p.conditions.some((c) => c.toLowerCase().includes('hypertension'))
          return true
        })
      )
    }

    return rows
  }, [patients, searchQuery, activeFilters])

  const excluded = patients.length - filteredPatients.length

  return (
    <div className="relative">
      <div className="mx-6 mt-4 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
        <MapContainer
          center={[1.3521, 103.8198]}
          zoom={12}
          style={{ height: 'calc(100vh - 280px)', minHeight: 480 }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredPatients.map((patient) => {
            const loc = patient.location!
            const latestAlert = alertByPatient.get(patient.id)
            const latestVitals = latestVitalsByPatient.get(patient.id)
            const topReason = latestAlert?.reasonCodes[0]
            const fillColor = RISK_COLORS[patient.riskStatus] ?? '#94a3b8'

            return (
              <CircleMarker
                key={patient.id}
                center={[loc.lat, loc.lng]}
                radius={14}
                pathOptions={{
                  color: fillColor,
                  fillColor,
                  fillOpacity: 0.85,
                  weight: 2,
                }}
                eventHandlers={{
                  click: () => setSelectedPatient(patient.id),
                }}
              >
                <Popup>
                  <div className="min-w-[180px] p-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: fillColor }}
                      />
                      <p className="font-semibold text-sm text-slate-900">{patient.name}</p>
                    </div>
                    <p
                      className={cn(
                        'text-xs font-medium mb-1',
                        patient.riskStatus === 'red'
                          ? 'text-red-600'
                          : patient.riskStatus === 'yellow'
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      )}
                    >
                      {getRiskLabel(patient.riskStatus)}
                    </p>

                    {topReason && (
                      <p className="text-xs text-slate-500 mb-1">
                        {REASON_CODE_LABELS[topReason]}
                      </p>
                    )}

                    {latestVitals && (
                      <p className="text-xs text-slate-500 mb-1">
                        BP {latestVitals.bpSystolic}/{latestVitals.bpDiastolic} · HR{' '}
                        {latestVitals.hrBpm} bpm
                      </p>
                    )}

                    <p className="text-xs text-slate-400 mb-2">
                      {formatRelative(patient.lastCheckinAt)}
                    </p>

                    <button
                      onClick={() => setSelectedPatient(patient.id)}
                      className="w-full text-xs text-white bg-primary rounded-md py-1.5 px-2 hover:bg-primary/90 transition-colors font-medium"
                    >
                      Open Details
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            )
          })}
        </MapContainer>
      </div>

      {/* Footer note */}
      {excluded > 0 && (
        <p className="text-xs text-slate-400 text-center mt-2 pb-2">
          {filteredPatients.length} of {patients.length} patients shown
          {excluded > 0 && ` (${excluded} ${excluded === 1 ? 'patient' : 'patients'} excluded by filters)`}
        </p>
      )}
    </div>
  )
}
