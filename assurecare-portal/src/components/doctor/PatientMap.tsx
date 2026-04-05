import { useMemo } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { STATIC_MAP_POINTS } from '@/data/mock/mapPoints'
import { usePatientStore } from '@/store/usePatientStore'
import { useUIStore } from '@/store/useUIStore'
import { cn, getRiskLabel } from '@/lib/utils'
import { REASON_CODE_LABELS } from '@/lib/reasonCodes'
import { formatRelative } from '@/lib/dateUtils'

const RISK_STYLES = {
  red: {
    fillColor: '#dc2626',
    strokeColor: '#7f1d1d',
    radius: 10,
    fillOpacity: 0.96,
    weight: 2.2,
  },
  yellow: {
    fillColor: '#f59e0b',
    strokeColor: '#92400e',
    radius: 10,
    fillOpacity: 0.96,
    weight: 1.6,
  },
  green: {
    fillColor: '#22c55e',
    strokeColor: '#166534',
    radius: 10,
    fillOpacity: 0.96,
    weight: 1.1,
  },
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

  const mapPoints = useMemo(() => {
    if (filteredPatients.length === 0) return []

    const patientById = new Map(filteredPatients.map((patient) => [patient.id, patient]))

    return STATIC_MAP_POINTS
      .filter((point) => patientById.has(point.patientId))
      .map((point) => {
        const seedPatient = patientById.get(point.patientId)!
        const latestAlert = alertByPatient.get(seedPatient.id)
        const latestVitals = latestVitalsByPatient.get(seedPatient.id)

        return {
          ...point,
          riskStatus: seedPatient.riskStatus,
          topReason: latestAlert?.reasonCodes[0],
          latestVitals,
          lastCheckinAt: seedPatient.lastCheckinAt,
          style: RISK_STYLES[seedPatient.riskStatus],
        }
      })
      .sort((a, b) => {
        const order = { green: 0, yellow: 1, red: 2 }
        return order[a.riskStatus] - order[b.riskStatus]
      })
  }, [alertByPatient, filteredPatients, latestVitalsByPatient])

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

          {mapPoints.map((point) => {
            return (
              <CircleMarker
                key={point.id}
                center={[point.location.lat, point.location.lng]}
                radius={point.style.radius}
                pathOptions={{
                  color: point.style.strokeColor,
                  fillColor: point.style.fillColor,
                  fillOpacity: point.style.fillOpacity,
                  weight: point.style.weight,
                }}
                eventHandlers={{
                  click: () => setSelectedPatient(point.patientId),
                }}
              >
                <Popup>
                  <div className="min-w-[180px] p-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: point.style.fillColor }}
                      />
                      <p className="font-semibold text-sm text-slate-900">{point.displayName}</p>
                    </div>
                    <p
                      className={cn(
                        'text-xs font-medium mb-1',
                        point.riskStatus === 'red'
                          ? 'text-red-600'
                          : point.riskStatus === 'yellow'
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      )}
                    >
                      {getRiskLabel(point.riskStatus)}
                    </p>

                    {point.topReason && (
                      <p className="text-xs text-slate-500 mb-1">
                        {REASON_CODE_LABELS[point.topReason]}
                      </p>
                    )}

                    {point.latestVitals && (
                      <p className="text-xs text-slate-500 mb-1">
                        BP {point.latestVitals.bpSystolic}/{point.latestVitals.bpDiastolic} · HR{' '}
                        {point.latestVitals.hrBpm} bpm
                      </p>
                    )}

                    <p className="text-xs text-slate-400 mb-2">
                      {formatRelative(point.lastCheckinAt)}
                    </p>

                    <button
                      onClick={() => setSelectedPatient(point.patientId)}
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
          {mapPoints.length} map points generated from {filteredPatients.length} matching patients
          {` (${excluded} ${excluded === 1 ? 'patient' : 'patients'} excluded by filters)`}
        </p>
      )}
    </div>
  )
}
