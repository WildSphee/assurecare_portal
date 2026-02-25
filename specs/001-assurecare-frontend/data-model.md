# Data Model: AssureCare Portal Frontend

**Date**: 2026-02-25
**Feature**: 001-assurecare-frontend

All entities are mock data only — no database. TypeScript interfaces defined in `src/types/index.ts`.

---

## Core Entities

### Patient
```typescript
interface Patient {
  id: string;                    // e.g. "patient-001"
  name: string;                  // e.g. "Ms. Tan"
  age: number;                   // e.g. 68
  conditions: string[];          // e.g. ["hypertension", "mild heart attack (1 week ago)"]
  doctorId: string;              // ref to User (doctor)
  caregiverIds: string[];        // refs to Users (caregivers)
  location?: {                   // approximate mock coordinates
    lat: number;
    lng: number;
    area: string;                // e.g. "Toa Payoh, Singapore"
  };
  riskStatus: RiskLevel;         // computed from risk engine
  lastCheckinAt: string;         // ISO datetime
  noResponseStreak: number;      // consecutive missed check-ins
}

type RiskLevel = "green" | "yellow" | "red";
```

### User (Caregiver or Doctor)
```typescript
interface User {
  id: string;
  role: "caregiver" | "doctor";
  name: string;
  contact: {
    phone?: string;
    email?: string;
  };
}
```

### Daily Check-in Session
```typescript
interface CheckinSession {
  id: string;
  patientId: string;
  date: string;                  // ISO date "YYYY-MM-DD"
  status: "completed" | "partial" | "missed";
  createdAt: string;             // ISO datetime
}
```

### Vitals Record
```typescript
interface VitalsRecord {
  id: string;
  patientId: string;
  date: string;                  // ISO date "YYYY-MM-DD"
  recordedAt: string;            // ISO datetime
  bpSystolic: number;            // mmHg
  bpDiastolic: number;           // mmHg
  hrBpm: number;                 // beats per minute
  source: "chatbot";
  qualityFlag: "normal" | "unverified" | "outlier";
}
```

### Adherence Record
```typescript
interface AdherenceRecord {
  id: string;
  patientId: string;
  date: string;                  // ISO date "YYYY-MM-DD"
  medsMorningTaken: boolean | null;    // null = not reported
  medsEveningTaken: boolean | null;
  exerciseDone: boolean | null;
  hydrationDone: boolean | null;
  source: "chatbot";
}
```

### Symptom Signal
```typescript
interface SymptomSignal {
  id: string;
  patientId: string;
  date: string;                  // ISO date "YYYY-MM-DD"
  symptomType: string;           // e.g. "dizziness", "chest tightness", "shortness of breath"
  severity: "mild" | "moderate" | "severe";
  source: "chatbot";
}
```

### Alert
```typescript
interface Alert {
  id: string;
  patientId: string;
  severity: RiskLevel;
  reasonCodes: ReasonCode[];
  evidencePointers: EvidencePointer[];
  createdAt: string;             // ISO datetime
  status: "open" | "acknowledged" | "resolved";
  assignedTo?: string;           // User id
}

type ReasonCode =
  | "BP_UPTREND_5D"
  | "HR_UPTREND_5D"
  | "MISSED_MEDS_STREAK_2"
  | "MISSED_MEDS_YESTERDAY"
  | "SYMPTOM_DIZZINESS_REPEAT"
  | "SYMPTOM_CHEST_TIGHTNESS_SEVERE"
  | "NO_RESPONSE_STREAK_2"
  | "ENGAGEMENT_DROP_30PCT";

interface EvidencePointer {
  description: string;           // e.g. "BP increased from 130 to 148 over last 5 days"
  dates: string[];               // ISO dates referenced
  metric?: string;               // e.g. "bp_systolic"
}
```

### AI Summary
```typescript
interface AISummary {
  id: string;
  patientId: string;
  date: string;                  // ISO date — the summary is "for" this date
  summaryType: "daily" | "clinical" | "pre-visit";
  narrative: string;             // full paragraph
  highlights: string[];          // 3–5 bullet points
  keyDrivers: ReasonCode[];
  suggestedActions: string[];    // caregiver-friendly prompts
  confidence: "low" | "medium" | "high";
  dataCoverageRange: {
    from: string;                // ISO date
    to: string;                  // ISO date
  };
  generatedAt: string;           // ISO datetime
}
```

### Appointment
```typescript
interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  status: "requested" | "scheduled" | "completed" | "cancelled";
  requestedAt: string;           // ISO datetime
  scheduledAt?: string;          // ISO datetime (when confirmed)
  preferredWindows?: string[];   // e.g. ["2026-03-01 AM", "2026-03-02 PM"]
  reason: AppointmentReason;
  notes: string;
  aiSummarySnippet?: string;     // auto-populated from latest AI summary
  initiatedBy: string;           // User id
}

type AppointmentReason =
  | "routine_follow_up"
  | "bp_concern"
  | "medication_review"
  | "symptom_check"
  | "post_discharge"
  | "other";
```

### Action Log (Audit)
```typescript
interface ActionLogEntry {
  id: string;
  actorUserId: string;
  actorRole: "caregiver" | "doctor";
  patientId: string;
  actionType: ActionType;
  payload: Record<string, unknown>;  // action-specific details
  timestamp: string;                 // ISO datetime
}

type ActionType =
  | "call_initiated"
  | "message_sent"
  | "appointment_requested"
  | "appointment_scheduled"
  | "escalation_created"
  | "note_added"
  | "note_edited"
  | "patient_viewed"        // doctor role
  | "mark_reviewed"
  | "follow_up_requested";
```

### Doctor Note
```typescript
interface DoctorNote {
  id: string;
  patientId: string;
  authorId: string;              // doctor user id
  content: string;
  createdAt: string;             // ISO datetime
  updatedAt: string;             // ISO datetime
  visibility: "caregiver_read_only" | "doctor_only";
}
```

### Caregiver Note
```typescript
interface CaregiverNote {
  id: string;
  patientId: string;
  authorId: string;              // caregiver user id
  content: string;
  createdAt: string;             // ISO datetime
}
```

### Message (to chatbot device)
```typescript
interface ChatbotMessage {
  id: string;
  senderId: string;              // User id
  senderRole: "caregiver" | "doctor";
  patientId: string;
  content: string;
  messageType: "free_text" | "template";
  templateId?: string;
  deliveryStatus: "queued" | "sent" | "failed";
  sentAt: string;                // ISO datetime
}
```

### Escalation Record
```typescript
interface EscalationRecord {
  id: string;
  patientId: string;
  initiatedBy: string;           // User id
  escalationType: "to_doctor" | "to_backup_contact";
  reasonCodes: ReasonCode[];
  outcome: "pending" | "acknowledged" | "resolved";
  notes?: string;
  createdAt: string;             // ISO datetime
  resolvedAt?: string;           // ISO datetime
}
```

### Care Plan Item
```typescript
interface CarePlanItem {
  id: string;
  patientId: string;
  description: string;           // e.g. "Take blood pressure medication twice daily"
  frequency: string;             // e.g. "daily", "weekly"
  addedBy: string;               // doctor user id
  isCompleted?: boolean;         // for display only
}
```

---

## Risk Engine Logic (`src/lib/riskEngine.ts`)

### Risk Score Components
| Component | Weight | Trigger |
|-----------|--------|---------|
| Missed meds streak ≥ 2 | High | MISSED_MEDS_STREAK_2 |
| Missed meds yesterday | Medium | MISSED_MEDS_YESTERDAY |
| BP systolic uptrend >5 days | High | BP_UPTREND_5D |
| HR uptrend >5 days | Medium | HR_UPTREND_5D |
| Severe symptom (any) | High | SYMPTOM_*_SEVERE |
| No response streak ≥ 2 | Medium | NO_RESPONSE_STREAK_2 |
| Engagement drop >30% | Low | ENGAGEMENT_DROP_30PCT |

### Risk Level Mapping
| Score Range | Risk Level |
|-------------|-----------|
| 0–2 | green |
| 3–5 | yellow |
| 6+ | red |

---

## Mock Data Scenarios (required)

### Scenario A — Ms. Tan (Caregiver Patient)
- 30-day history with deteriorating BP trend (130→148 systolic over 10 days)
- Missed evening meds on Feb 23 and Feb 24 → MISSED_MEDS_STREAK_2
- Dizziness symptom reported Feb 24 (moderate)
- Current risk: **Yellow** (BP_UPTREND_5D + MISSED_MEDS_STREAK_2)
- One upcoming appointment (scheduled, March 3)

### Scenario B — Ms. Tan (Red Demo)
- Pre-authored data state: severe chest tightness + no response 2 days → **Red**
- Available as a view toggle or second patient record

### Doctor Panel (10 patients)
| Patient | Risk | Key Reason |
|---------|------|-----------|
| Ms. Tan | Yellow | BP_UPTREND_5D + MISSED_MEDS_STREAK_2 |
| Mr. Lim | Red | SYMPTOM_CHEST_TIGHTNESS_SEVERE + NO_RESPONSE_STREAK_2 |
| Mrs. Wong | Red | BP_UPTREND_5D + MISSED_MEDS_STREAK_2 |
| Mr. Kumar | Yellow | MISSED_MEDS_STREAK_2 |
| Ms. Lee | Yellow | HR_UPTREND_5D |
| Mr. Ang | Yellow | ENGAGEMENT_DROP_30PCT |
| Mrs. Chong | No data (>48h) | — |
| Mr. Raj | Green | — |
| Ms. Siti | Green | — |
| Mr. Chen | Green | — |

---

## State Transitions

### Appointment Status Flow
```
Requested → Scheduled → Completed
                      → Cancelled
```

### Alert Status Flow
```
open → acknowledged → resolved
```

### Escalation Outcome Flow
```
pending → acknowledged → resolved
```

### Check-in Session Status
```
(daily) → completed | partial | missed
```
