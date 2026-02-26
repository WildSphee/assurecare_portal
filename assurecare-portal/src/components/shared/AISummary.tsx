import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { AISummary as AISummaryType, RiskLevel } from '@/types'

interface AISummaryProps {
  summary: AISummaryType
  riskLevel: RiskLevel
  variant?: 'caregiver' | 'clinical'
}

const RISK_LEVEL_COPY: Record<RiskLevel, string> = {
  red: 'Status is <strong>Red (Urgent Attention)</strong> because multiple serious signals were detected that require prompt follow-up.',
  yellow: 'Status is <strong>Yellow (Needs Attention)</strong> because one or more health trends warrant monitoring and possible action.',
  green: 'Status is <strong>Green (All Clear)</strong> — all signals are within normal range. Continue current care plan.',
}

const HIGHLIGHT_ICONS: Record<string, string> = {
  bp: '🩺',
  blood: '🩺',
  medication: '💊',
  meds: '💊',
  missed: '⚠️',
  dizziness: '😵',
  chest: '❗',
  shortness: '😮‍💨',
  check: '✅',
  morning: '☀️',
  evening: '🌙',
}

function getHighlightIcon(text: string): string {
  const lower = text.toLowerCase()
  for (const [key, icon] of Object.entries(HIGHLIGHT_ICONS)) {
    if (lower.includes(key)) return icon
  }
  return '•'
}

function getConciseNarrative(text: string): string {
  const normalized = text.trim().replace(/\s+/g, ' ')
  if (normalized.length <= 340) return normalized

  const sentences = normalized.match(/[^.!?]+[.!?]?/g)?.map((s) => s.trim()).filter(Boolean) ?? []
  const firstThree = sentences.slice(0, 3).join(' ')
  if (firstThree && firstThree.length <= 420) return firstThree

  return `${normalized.slice(0, 360).trimEnd()}…`
}

export function AISummary({ summary, riskLevel, variant = 'caregiver' }: AISummaryProps) {
  const [showNarrative, setShowNarrative] = useState(false)
  const isCaregiver = variant === 'caregiver'
  const narrativeText = isCaregiver ? getConciseNarrative(summary.narrative) : summary.narrative

  return (
    <div
      className={cn(
        'rounded-xl border',
        isCaregiver
          ? 'border-violet-300 bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100 p-4 shadow-[0_8px_24px_-18px_rgba(124,58,237,0.45)]'
          : 'border-slate-200 bg-white p-5'
      )}
    >
      {/* Header */}
      <div className={cn('flex items-center justify-between', isCaregiver ? 'mb-3' : 'mb-4')}>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'w-7 h-7 rounded-lg flex items-center justify-center',
              isCaregiver ? 'bg-violet-200/90' : 'bg-primary/10'
            )}
          >
            <Sparkles className={cn('w-4 h-4', isCaregiver ? 'text-violet-800' : 'text-primary')} />
          </div>
          <h3 className="font-semibold text-slate-900">
            {variant === 'clinical' ? 'Clinical Summary' : 'AI Insight'}
          </h3>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">
            Confidence: <span className="font-medium capitalize text-slate-600">{summary.confidence}</span>
          </p>
          {/* <p className="text-xs text-slate-400">
            {formatDateTime(summary.generatedAt)}
          </p> */}
        </div>
      </div>

      {!isCaregiver && (
        <div
          className={cn(
            'rounded-lg p-3 mb-4 text-sm',
            riskLevel === 'red' && 'bg-red-50 border border-red-200 text-red-800',
            riskLevel === 'yellow' && 'bg-amber-50 border border-amber-200 text-amber-800',
            riskLevel === 'green' && 'bg-emerald-50 border border-emerald-200 text-emerald-800',
          )}
          dangerouslySetInnerHTML={{ __html: RISK_LEVEL_COPY[riskLevel] }}
        />
      )}

      {/* Highlights */}
      <div className={cn(isCaregiver ? 'space-y-1.5 mb-3' : 'space-y-2 mb-4')}>
        {summary.highlights.map((h, i) => (
          <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
            <span className="mt-0.5 shrink-0">{getHighlightIcon(h)}</span>
            <span>{h}</span>
          </div>
        ))}
      </div>

      {!isCaregiver && (
        <button
          onClick={() => setShowNarrative(!showNarrative)}
          className="text-xs text-primary font-medium flex items-center gap-1 hover:opacity-80 transition-opacity mb-3"
          aria-expanded={showNarrative}
        >
          {showNarrative ? 'Hide full summary' : 'Show full summary'}
          {showNarrative ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      )}

      {(isCaregiver || showNarrative) && (
        <p
          className={cn(
            'text-sm leading-relaxed',
            isCaregiver
              ? 'mb-3 text-slate-700'
              : 'mb-4 text-slate-600 rounded-lg p-3 bg-slate-50'
          )}
        >
          {narrativeText}
        </p>
      )}

      {/* Suggested actions (caregiver variant only) */}
      {variant === 'caregiver' && summary.suggestedActions.length > 0 && (
        <div className="border-t border-slate-100 pt-3">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
            Suggested actions
          </p>
          <div className="space-y-2">
            {summary.suggestedActions.map((action, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="text-primary mt-0.5">→</span>
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
