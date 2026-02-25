import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useUIStore } from '@/store/useUIStore'

export function RiskScoreToggle() {
  const { showDetailedScoring, toggleDetailedScoring } = useUIStore()

  return (
    <div className="flex items-center gap-2">
      <Switch
        id="score-toggle"
        checked={showDetailedScoring}
        onCheckedChange={toggleDetailedScoring}
        aria-label="Toggle risk score breakdown detail"
      />
      <Label
        htmlFor="score-toggle"
        className="text-xs text-slate-500 cursor-pointer select-none"
      >
        Score detail
      </Label>
    </div>
  )
}
