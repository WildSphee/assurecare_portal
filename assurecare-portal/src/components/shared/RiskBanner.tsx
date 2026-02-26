import { useState } from 'react'
import { ChevronDown, ChevronUp, Info } from 'lucide-react'
import { cn, getRiskBgColor, getRiskBorderColor, getRiskColor, getRiskLabel } from '@/lib/utils'
import { REASON_CODE_LABELS, REASON_CODE_DESCRIPTIONS, REASON_CODE_WEIGHTS } from '@/lib/reasonCodes'
import type { RiskLevel, ReasonCode, EvidencePointer } from '@/types'

interface RiskBannerProps {
  riskLevel: RiskLevel
  reasonCodes: ReasonCode[]
  evidencePointers: EvidencePointer[]
  lastUpdatedAt: string
  dataFreshnessLabel: string
  showDetailedScoring?: boolean
  showExplainabilityToggle?: boolean
  compact?: boolean
}

const RISK_ICONS: Record<RiskLevel, string> = {
  red: '🔴',
  yellow: '🟡',
  green: '🟢',
}

export function RiskBanner({
  riskLevel,
  reasonCodes,
  evidencePointers,
  lastUpdatedAt,
  dataFreshnessLabel,
  showDetailedScoring = false,
  showExplainabilityToggle = true,
  compact = false,
}: RiskBannerProps) {
  const [expanded, setExpanded] = useState(false)

  const formattedTime = new Date(lastUpdatedAt).toLocaleString('en-SG', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div
      className={cn(
        'rounded-xl border-l-4 transition-all',
        getRiskBgColor(riskLevel),
        getRiskBorderColor(riskLevel),
        compact ? 'p-3' : 'p-5'
      )}
      role="status"
      aria-label={`Risk status: ${getRiskLabel(riskLevel)}`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left: Risk level badge + label */}
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold text-sm border',
              riskLevel === 'red' && 'bg-red-100 text-red-700 border-red-300',
              riskLevel === 'yellow' && 'bg-amber-100 text-amber-700 border-amber-300',
              riskLevel === 'green' && 'bg-emerald-100 text-emerald-700 border-emerald-300',
            )}
          >
            <span>{RISK_ICONS[riskLevel]}</span>
            <span>{getRiskLabel(riskLevel)}</span>
          </div>

          {/* Reason chips */}
          {reasonCodes.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {reasonCodes.slice(0, 3).map((code) => (
                <span
                  key={code}
                  title={REASON_CODE_DESCRIPTIONS[code]}
                  className={cn(
                    'text-xs px-2.5 py-1 rounded-full border font-medium',
                    riskLevel === 'red' && 'bg-red-50 text-red-600 border-red-200',
                    riskLevel === 'yellow' && 'bg-amber-50 text-amber-600 border-amber-200',
                    riskLevel === 'green' && 'bg-emerald-50 text-emerald-600 border-emerald-200',
                  )}
                >
                  {REASON_CODE_LABELS[code]}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right: timestamps */}
        <div className="text-right shrink-0">
          <p className="text-xs text-slate-500">Updated {formattedTime}</p>
          <p className="text-xs text-slate-400 mt-0.5">{dataFreshnessLabel}</p>
        </div>
      </div>

      {/* Explainability toggle */}
      {!compact && showExplainabilityToggle && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className={cn(
              'mt-3 flex items-center gap-1.5 text-xs font-medium transition-colors',
              getRiskColor(riskLevel),
              'hover:opacity-80'
            )}
            aria-expanded={expanded}
          >
            <Info className="w-3.5 h-3.5" />
            Why this status?
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {expanded && (
            <div className="mt-3 space-y-3 pt-3 border-t border-slate-200/60">
              {evidencePointers.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-1.5">Evidence</p>
                  <ul className="space-y-1.5">
                    {evidencePointers.map((ep, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                        <span className="mt-0.5 text-slate-400">•</span>
                        <span>{ep.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {showDetailedScoring && reasonCodes.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-1.5">Risk Score Breakdown</p>
                  <div className="space-y-1">
                    {reasonCodes.map((code) => (
                      <div key={code} className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">{REASON_CODE_LABELS[code]}</span>
                        <span className="font-semibold text-slate-700">+{REASON_CODE_WEIGHTS[code]}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between text-xs font-bold border-t border-slate-200 pt-1 mt-1">
                      <span className="text-slate-700">Total score</span>
                      <span className={getRiskColor(riskLevel)}>
                        {reasonCodes.reduce((s, c) => s + REASON_CODE_WEIGHTS[c], 0)} / 10
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
