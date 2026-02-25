# Mock Data Contracts: AssureCare Portal Frontend

**Date**: 2026-02-25

This document defines the interface contracts for all mock data modules in `src/data/mock/`. These are the shapes that UI components depend on — any mock data file must satisfy these contracts.

---

## `src/data/mock/patients.ts`

Exports an array of `Patient[]` with exactly 10 entries including Ms. Tan as `patient-001`.

Required fields per entry: `id`, `name`, `age`, `conditions`, `doctorId`, `caregiverIds`, `location`, `riskStatus`, `lastCheckinAt`, `noResponseStreak`.

Ms. Tan (`patient-001`) must have:
- `riskStatus: "yellow"`
- `conditions: ["Hypertension", "Mild heart attack (last week)"]`
- `caregiverIds: ["user-ana"]`
- `doctorId: "user-dr-chan"`

---

## `src/data/mock/vitals.ts`

Exports `VitalsRecord[]` covering the last 30 days for all 10 patients.

Ms. Tan's records must show:
- BP systolic increasing from ~130 to ~148 over 10 days (Feb 15–Feb 24)
- At least 3 days with missing records (represented by absence, not null fields)
- At least 1 record with `qualityFlag: "outlier"` for demo

---

## `src/data/mock/adherence.ts`

Exports `AdherenceRecord[]` covering the last 30 days per patient.

Ms. Tan's records must show:
- `medsEveningTaken: false` on Feb 23 and Feb 24 (triggers MISSED_MEDS_STREAK_2)
- `medsMorningTaken: true` on most days

---

## `src/data/mock/symptoms.ts`

Exports `SymptomSignal[]`.

Ms. Tan must have:
- `{ symptomType: "dizziness", severity: "moderate", date: "2026-02-24" }`

Mr. Lim (patient-002, Red) must have:
- `{ symptomType: "chest tightness", severity: "severe", date: "2026-02-24" }`

---

## `src/data/mock/alerts.ts`

Exports `Alert[]`.

Ms. Tan must have at least one open yellow alert with:
- `reasonCodes: ["BP_UPTREND_5D", "MISSED_MEDS_STREAK_2"]`
- `evidencePointers` containing at least 2 evidence items with real dates

Mr. Lim must have one open red alert with:
- `reasonCodes: ["SYMPTOM_CHEST_TIGHTNESS_SEVERE", "NO_RESPONSE_STREAK_2"]`

---

## `src/data/mock/aiSummaries.ts`

Exports `AISummary[]` with at least one `"daily"` summary and one `"clinical"` summary per patient.

Ms. Tan's daily summary highlights must include:
- "BP has increased from 130 to 148 mmHg over the past 10 days"
- "Evening medication missed on Feb 23 and Feb 24"
- "Dizziness reported on Feb 24 — moderate severity"

---

## `src/data/mock/appointments.ts`

Exports `Appointment[]`.

Must include:
- Ms. Tan: one `"scheduled"` appointment on March 3, 2026 (routine follow-up)
- At least 2 other patients with upcoming appointments for KPI counter display

---

## `src/data/mock/actionLog.ts`

Exports `ActionLogEntry[]` pre-seeded with representative historical actions.

Must include:
- Call initiated by Ana for Ms. Tan
- Message sent by Dr. Chan to Ms. Tan's device
- Appointment requested by Ana

---

## `src/data/mock/messages.ts`

Exports `ChatbotMessage[]` with 2–3 pre-seeded messages per patient (for timeline display).

---

## `src/data/mock/escalations.ts`

Exports `EscalationRecord[]` with at least one resolved and one pending escalation for demo.

---

## `src/data/mock/index.ts`

Re-exports all mock data and exports a `seedStores(usePatientStore, useAppointmentStore, useActionLogStore)` function called on app mount to hydrate Zustand stores.

---

## Component Interface Contracts

### RiskBanner props
```typescript
interface RiskBannerProps {
  riskLevel: RiskLevel;
  reasonCodes: ReasonCode[];
  evidencePointers: EvidencePointer[];
  lastUpdatedAt: string;
  dataFreshnessLabel: string;     // e.g. "Latest check-in recorded today 09:05"
  showDetailedScoring?: boolean;  // doctor-only toggle
}
```

### MetricTile props
```typescript
interface MetricTileProps {
  title: string;
  value: string | number;
  unit?: string;
  trendArrow?: "up" | "down" | "stable";
  trendColor?: "positive" | "negative" | "neutral";
  lastUpdatedAt: string;
  tooltipText: string;
  status?: "normal" | "warning" | "alert";
  streakLabel?: string;           // e.g. "5-day streak"
}
```

### TrendChart props
```typescript
interface TrendChartProps {
  data: TrendDataPoint[];
  metric: "bp_systolic" | "bp_diastolic" | "hr_bpm" | "adherence_pct";
  timeRange: 7 | 14 | 30;
  onTimeRangeChange: (range: 7 | 14 | 30) => void;
  referenceBand?: { lower: number; upper: number; label: string };
  viewMode: "daily" | "rolling_avg";
  onViewModeChange: (mode: "daily" | "rolling_avg") => void;
}

interface TrendDataPoint {
  date: string;                   // ISO date
  value: number | null;           // null = missing data
  isOutlier?: boolean;
}
```

### PatientCard props (Doctor)
```typescript
interface PatientCardProps {
  patient: Patient;
  latestVitals?: VitalsRecord;
  adherenceLast7Days: AdherenceRecord[];
  activeSymptoms: SymptomSignal[];
  nextAppointment?: Appointment;
  aiLabel: string;                // e.g. "BP rising + missed meds"
  onOpen: (patientId: string) => void;
  onSchedule: (patientId: string) => void;
  onAddNote: (patientId: string) => void;
  onMarkReviewed: (patientId: string) => void;
  onFollowUp: (patientId: string) => void;
}
```

### AlertTimeline props
```typescript
interface AlertTimelineProps {
  events: TimelineEvent[];
  daysBack: 7 | 14;
  role: "caregiver" | "doctor";
}

interface TimelineEvent {
  id: string;
  timestamp: string;
  category: "vitals" | "meds" | "symptom" | "no_response" | "caregiver_action" | "doctor_action" | "appointment" | "escalation";
  title: string;
  description: string;
  source: "chatbot" | "caregiver" | "doctor" | "system";
  severity?: RiskLevel;
  notes?: string;
  expandable: boolean;
}
```
